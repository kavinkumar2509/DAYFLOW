import { PrismaClient, Role, AttendanceStatus, LeaveType, LeaveStatus, PayrollStatus, NotificationType } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding for DAYFLOW HRMS...');

  // Clean existing tables
  await prisma.notification.deleteMany();
  await prisma.document.deleteMany();
  await prisma.aadhaarLog.deleteMany();
  await prisma.payroll.deleteMany();
  await prisma.leaveRequest.deleteMany();
  await prisma.attendance.deleteMany();
  await prisma.employeeProfile.deleteMany();
  await prisma.user.deleteMany();

  const defaultPassword = await bcrypt.hash('Password@123', 10);
  const adminPassword = await bcrypt.hash('Admin@123', 10);

  // 1. Create Admin User
  const admin = await prisma.user.create({
    data: {
      employeeId: 'ADMIN001',
      email: 'admin@dayflow.com',
      passwordHash: adminPassword,
      role: Role.ADMIN,
      emailVerified: true,
      aadhaarVerified: true,
      firstLoginCompleted: true,
      isActive: true,
      profile: {
        create: {
          firstName: 'HR',
          lastName: 'Administrator',
          phone: '+91 9876543210',
          address: '404 Corporate Boulevard, Tech City, Bangalore, India',
          profilePictureUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
          department: 'Human Resources',
          designation: 'Head of People Operations',
          dateOfJoining: new Date('2022-01-15'),
        },
      },
    },
  });
  console.log(`✅ Seeded Admin: ${admin.email} (${admin.employeeId})`);

  // 2. Create Employee 1 (Kavin - Backend Lead)
  const emp1 = await prisma.user.create({
    data: {
      employeeId: 'EMP001',
      email: 'kavin@dayflow.com',
      passwordHash: defaultPassword,
      role: Role.EMPLOYEE,
      emailVerified: true,
      aadhaarVerified: true,
      firstLoginCompleted: true,
      isActive: true,
      profile: {
        create: {
          firstName: 'Kavin',
          lastName: 'Prabhu',
          phone: '+91 9876543211',
          address: '12 Cyber Street, Silicon Oasis, Bangalore, India',
          profilePictureUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400',
          department: 'Engineering',
          designation: 'Senior Backend Engineer',
          dateOfJoining: new Date('2023-03-01'),
        },
      },
    },
  });

  // 3. Create Employee 2 (Adhi - Frontend Lead)
  const emp2 = await prisma.user.create({
    data: {
      employeeId: 'EMP002',
      email: 'adhi@dayflow.com',
      passwordHash: defaultPassword,
      role: Role.EMPLOYEE,
      emailVerified: true,
      aadhaarVerified: true,
      firstLoginCompleted: true,
      isActive: true,
      profile: {
        create: {
          firstName: 'Adhithya',
          lastName: 'V',
          phone: '+91 9876543212',
          address: '77 Design Lane, HSR Layout, Bangalore, India',
          profilePictureUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=400',
          department: 'Engineering',
          designation: 'Lead Frontend Engineer',
          dateOfJoining: new Date('2023-04-15'),
        },
      },
    },
  });

  // 4. Create Employee 3 (New Hire - Pending First Login Aadhaar Verification)
  const emp3 = await prisma.user.create({
    data: {
      employeeId: 'EMP003',
      email: 'sarah.connor@dayflow.com',
      passwordHash: defaultPassword,
      role: Role.EMPLOYEE,
      emailVerified: true,
      aadhaarVerified: false,
      firstLoginCompleted: false, // Testing first-login Aadhaar verification flow!
      isActive: true,
      profile: {
        create: {
          firstName: 'Sarah',
          lastName: 'Connor',
          phone: '+91 9876543213',
          address: '55 Future Way, Indiranagar, Bangalore, India',
          profilePictureUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
          department: 'Product',
          designation: 'Associate Product Manager',
          dateOfJoining: new Date('2024-01-10'),
        },
      },
    },
  });

  // 5. Create Employee 4 (John Doe - Finance)
  const emp4 = await prisma.user.create({
    data: {
      employeeId: 'EMP004',
      email: 'john.doe@dayflow.com',
      passwordHash: defaultPassword,
      role: Role.EMPLOYEE,
      emailVerified: true,
      aadhaarVerified: true,
      firstLoginCompleted: true,
      isActive: true,
      profile: {
        create: {
          firstName: 'John',
          lastName: 'Doe',
          phone: '+91 9876543214',
          address: '99 Wall Street Colony, Koramangala, Bangalore, India',
          profilePictureUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
          department: 'Finance',
          designation: 'Senior Financial Analyst',
          dateOfJoining: new Date('2022-08-01'),
        },
      },
    },
  });

  const employees = [emp1, emp2, emp3, emp4];
  console.log(`✅ Seeded ${employees.length} Employees.`);

  // 6. Seed Attendance Records for EMP001 and EMP002 across past 5 days
  const today = new Date();
  for (let i = 4; i >= 0; i--) {
    const attendanceDate = new Date(today);
    attendanceDate.setDate(today.getDate() - i);
    attendanceDate.setHours(0, 0, 0, 0);

    const checkIn = new Date(attendanceDate);
    checkIn.setHours(9, 30, 0, 0);

    const checkOut = new Date(attendanceDate);
    checkOut.setHours(18, 30, 0, 0);

    // Seed EMP001 attendance
    await prisma.attendance.create({
      data: {
        userId: emp1.id,
        date: attendanceDate,
        checkIn: checkIn,
        checkOut: i === 0 ? null : checkOut, // Today is ongoing
        status: AttendanceStatus.PRESENT,
        workHours: i === 0 ? 4.5 : 9.0,
        remarks: i === 0 ? 'Checked in on time' : 'Completed daily shift',
      },
    });

    // Seed EMP002 attendance
    if (i === 1) {
      // Half day
      const halfCheckOut = new Date(attendanceDate);
      halfCheckOut.setHours(14, 0, 0, 0);
      await prisma.attendance.create({
        data: {
          userId: emp2.id,
          date: attendanceDate,
          checkIn: checkIn,
          checkOut: halfCheckOut,
          status: AttendanceStatus.HALF_DAY,
          workHours: 4.5,
          remarks: 'Left early for doctor appointment',
        },
      });
    } else {
      await prisma.attendance.create({
        data: {
          userId: emp2.id,
          date: attendanceDate,
          checkIn: checkIn,
          checkOut: checkOut,
          status: AttendanceStatus.PRESENT,
          workHours: 9.0,
        },
      });
    }
  }
  console.log('✅ Seeded Attendance logs.');

  // 7. Seed Leave Requests
  await prisma.leaveRequest.create({
    data: {
      userId: emp1.id,
      leaveType: LeaveType.PAID,
      startDate: new Date('2026-09-01'),
      endDate: new Date('2026-09-03'),
      reason: 'Attending tech conference',
      status: LeaveStatus.APPROVED,
      adminRemarks: 'Approved. Enjoy the conference!',
      reviewedById: admin.id,
      reviewedAt: new Date(),
    },
  });

  await prisma.leaveRequest.create({
    data: {
      userId: emp2.id,
      leaveType: LeaveType.SICK,
      startDate: new Date('2026-08-25'),
      endDate: new Date('2026-08-26'),
      reason: 'Severe seasonal fever',
      status: LeaveStatus.PENDING,
    },
  });

  await prisma.leaveRequest.create({
    data: {
      userId: emp4.id,
      leaveType: LeaveType.UNPAID,
      startDate: new Date('2026-08-10'),
      endDate: new Date('2026-08-12'),
      reason: 'Personal family relocation',
      status: LeaveStatus.REJECTED,
      adminRemarks: 'Critical audit week; please reschedule to next month.',
      reviewedById: admin.id,
      reviewedAt: new Date('2026-08-08'),
    },
  });
  console.log('✅ Seeded Leave Requests.');

  // 8. Seed Payroll Records
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1;

  for (const emp of [emp1, emp2, emp4]) {
    // Current month payroll
    const base = emp.employeeId === 'EMP001' ? 120000 : emp.employeeId === 'EMP002' ? 115000 : 95000;
    const allowances = 15000;
    const deductions = 5000;
    const net = base + allowances - deductions;

    await prisma.payroll.create({
      data: {
        userId: emp.id,
        month: currentMonth,
        year: currentYear,
        baseSalary: base,
        allowances,
        deductions,
        netSalary: net,
        status: PayrollStatus.GENERATED,
        remarks: `Standard payroll disbursement for ${currentMonth}/${currentYear}`,
      },
    });

    // Previous month payroll (PAID)
    const prevMonth = currentMonth === 1 ? 12 : currentMonth - 1;
    const prevYear = currentMonth === 1 ? currentYear - 1 : currentYear;

    await prisma.payroll.create({
      data: {
        userId: emp.id,
        month: prevMonth,
        year: prevYear,
        baseSalary: base,
        allowances,
        deductions,
        netSalary: net,
        status: PayrollStatus.PAID,
        paymentDate: new Date(`${prevYear}-${String(prevMonth).padStart(2, '0')}-28`),
        remarks: 'Salary processed via direct bank deposit',
      },
    });
  }
  console.log('✅ Seeded Payroll records.');

  // 9. Seed Notifications
  await prisma.notification.create({
    data: {
      userId: emp1.id,
      title: 'Leave Request Approved',
      message: 'Your leave request for Sep 01 - Sep 03 has been APPROVED by HR.',
      type: NotificationType.LEAVE_STATUS,
      isRead: false,
    },
  });

  await prisma.notification.create({
    data: {
      userId: emp2.id,
      title: 'Leave Request Submitted',
      message: 'Your leave request for Aug 25 - Aug 26 has been submitted for approval.',
      type: NotificationType.LEAVE_STATUS,
      isRead: true,
    },
  });

  // 10. Seed Documents
  await prisma.document.create({
    data: {
      userId: emp1.id,
      name: 'Employment Offer Letter',
      type: 'PDF',
      fileUrl: 'https://docs.dayflow.internal/contracts/EMP001_offer.pdf',
      verificationStatus: 'VERIFIED',
    },
  });

  console.log('🎉 Seeding successfully completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
