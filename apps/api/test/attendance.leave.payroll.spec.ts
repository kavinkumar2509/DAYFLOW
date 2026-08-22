import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, BadRequestException } from '@nestjs/common';
import { AttendanceService } from '../src/attendance/attendance.service';
import { LeaveService } from '../src/leave/leave.service';
import { PayrollService } from '../src/payroll/payroll.service';
import { PrismaService } from '../src/prisma/prisma.service';
import { AttendanceStatus, LeaveStatus, LeaveType, PayrollStatus } from '@dayflow/shared-types';

describe('DAYFLOW HRMS - Attendance, Leave & Payroll Test Suite', () => {
  let attendanceService: AttendanceService;
  let leaveService: LeaveService;
  let payrollService: PayrollService;

  const mockPrismaService = {
    attendance: {
      findUnique: jest.fn(),
      upsert: jest.fn(),
      update: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
    },
    leaveRequest: {
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
    },
    notification: {
      create: jest.fn(),
    },
    payroll: {
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
    },
    user: {
      findFirst: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AttendanceService,
        LeaveService,
        PayrollService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    attendanceService = module.get<AttendanceService>(AttendanceService);
    leaveService = module.get<LeaveService>(LeaveService);
    payrollService = module.get<PayrollService>(PayrollService);
    jest.clearAllMocks();
  });

  // TEST 11: Employee Check-In & Duplicate Prevention
  it('11. Should allow check-in and prevent duplicate check-in on the same day', async () => {
    // 1. Initial check-in
    mockPrismaService.attendance.findUnique.mockResolvedValueOnce(null);
    mockPrismaService.attendance.upsert.mockResolvedValueOnce({
      id: 'att-1',
      userId: 'emp-1',
      date: new Date(),
      checkIn: new Date(),
      status: AttendanceStatus.PRESENT,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const checkInResult = await attendanceService.checkIn('emp-1', { remarks: 'On time' });
    expect(checkInResult.status).toBe(AttendanceStatus.PRESENT);

    // 2. Duplicate check-in should throw ConflictException
    mockPrismaService.attendance.findUnique.mockResolvedValueOnce({
      id: 'att-1',
      userId: 'emp-1',
      date: new Date(),
      checkIn: new Date(),
    });

    await expect(
      attendanceService.checkIn('emp-1', { remarks: 'Second attempt' }),
    ).rejects.toThrow(ConflictException);
  });

  // TEST 12: Employee Check-Out & Duration Calculation
  it('12. Should calculate work hours upon check-out and update status', async () => {
    const checkInTime = new Date(Date.now() - 8 * 60 * 60 * 1000); // 8 hours ago

    mockPrismaService.attendance.findUnique.mockResolvedValue({
      id: 'att-1',
      userId: 'emp-1',
      date: new Date(),
      checkIn: checkInTime,
      checkOut: null,
      status: AttendanceStatus.PRESENT,
    });

    mockPrismaService.attendance.update.mockResolvedValue({
      id: 'att-1',
      userId: 'emp-1',
      date: new Date(),
      checkIn: checkInTime,
      checkOut: new Date(),
      workHours: 8.0,
      status: AttendanceStatus.PRESENT,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result = await attendanceService.checkOut('emp-1', { remarks: 'Done for the day' });
    expect(result.workHours).toBeGreaterThanOrEqual(7.9);
    expect(result.status).toBe(AttendanceStatus.PRESENT);
  });

  // TEST 13: Employee Leave Creation & Validation
  it('13. Should create leave request and reject invalid dates', async () => {
    // 1. Invalid date range (endDate < startDate)
    await expect(
      leaveService.createLeave('emp-1', {
        leaveType: LeaveType.PAID,
        startDate: '2026-09-10',
        endDate: '2026-09-05',
        reason: 'Vacation',
      }),
    ).rejects.toThrow(BadRequestException);

    // 2. Valid leave request
    mockPrismaService.leaveRequest.findFirst.mockResolvedValue(null);
    mockPrismaService.leaveRequest.create.mockResolvedValue({
      id: 'leave-1',
      userId: 'emp-1',
      leaveType: LeaveType.PAID,
      startDate: new Date('2026-09-01'),
      endDate: new Date('2026-09-03'),
      reason: 'Vacation',
      status: LeaveStatus.PENDING,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const leave = await leaveService.createLeave('emp-1', {
      leaveType: LeaveType.PAID,
      startDate: '2026-09-01',
      endDate: '2026-09-03',
      reason: 'Vacation',
    });

    expect(leave.status).toBe(LeaveStatus.PENDING);
    expect(leave.daysCount).toBe(3);
  });

  // TEST 14: Admin Approves Leave with Comments
  it('14. Should allow Admin to approve leave and create employee notification', async () => {
    mockPrismaService.leaveRequest.findUnique.mockResolvedValue({
      id: 'leave-1',
      userId: 'emp-1',
      leaveType: LeaveType.PAID,
      status: LeaveStatus.PENDING,
    });

    mockPrismaService.leaveRequest.update.mockResolvedValue({
      id: 'leave-1',
      userId: 'emp-1',
      leaveType: LeaveType.PAID,
      startDate: new Date('2026-09-01'),
      endDate: new Date('2026-09-03'),
      status: LeaveStatus.APPROVED,
      adminRemarks: 'Approved by HR',
      reviewedById: 'admin-1',
      reviewedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result = await leaveService.approveLeave('leave-1', 'admin-1', {
      adminRemarks: 'Approved by HR',
    });

    expect(result.status).toBe(LeaveStatus.APPROVED);
    expect(mockPrismaService.notification.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          userId: 'emp-1',
          title: 'Leave Request Approved',
        }),
      }),
    );
  });

  // TEST 15: Overlapping Leave Prevention
  it('15. Should reject overlapping leave requests with ConflictException', async () => {
    mockPrismaService.leaveRequest.findFirst.mockResolvedValue({
      id: 'existing-leave',
      status: LeaveStatus.APPROVED,
    });

    await expect(
      leaveService.createLeave('emp-1', {
        leaveType: LeaveType.SICK,
        startDate: '2026-09-02',
        endDate: '2026-09-04',
        reason: 'Sick leave overlap',
      }),
    ).rejects.toThrow(ConflictException);
  });

  // TEST 16: Employee Payroll Read-Only
  it('16. Should return read-only payroll records for employee', async () => {
    mockPrismaService.payroll.findMany.mockResolvedValue([
      {
        id: 'pay-1',
        userId: 'emp-1',
        month: 8,
        year: 2026,
        baseSalary: 120000,
        allowances: 15000,
        deductions: 5000,
        netSalary: 130000,
        status: PayrollStatus.GENERATED,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    const records = await payrollService.getOwnPayroll('emp-1');
    expect(records.length).toBe(1);
    expect(records[0].netSalary).toBe(130000);
  });

  // TEST 17: Admin Payroll Update Workflow
  it('17. Should allow Admin to update salary structure and calculate net salary accurately', async () => {
    mockPrismaService.user.findFirst.mockResolvedValue({ id: 'emp-1', employeeId: 'EMP001' });
    mockPrismaService.payroll.findFirst.mockResolvedValue({
      id: 'pay-1',
      userId: 'emp-1',
      month: 8,
      year: 2026,
      baseSalary: 100000,
      allowances: 10000,
      deductions: 5000,
      netSalary: 105000,
    });

    mockPrismaService.payroll.update.mockResolvedValue({ id: 'pay-1' });
    mockPrismaService.payroll.findUnique.mockResolvedValue({
      id: 'pay-1',
      userId: 'emp-1',
      month: 8,
      year: 2026,
      baseSalary: 130000,
      allowances: 20000,
      deductions: 6000,
      netSalary: 144000, // 130000 + 20000 - 6000
      status: PayrollStatus.GENERATED,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const updated = await payrollService.updatePayroll('EMP001', {
      baseSalary: 130000,
      allowances: 20000,
      deductions: 6000,
    });

    expect(updated.netSalary).toBe(144000);
  });
});
