export interface EmployeeProfileMock {
  name: string;
  role: string;
  department: string;
  employeeId: string;
  email: string;
  joinedDate: string;
}

export const mockEmployeeProfile: EmployeeProfileMock = {
  name: 'Adithya R',
  role: 'Frontend Developer',
  department: 'Engineering',
  employeeId: 'EMP-001',
  email: 'adithya@dayflow.internal',
  joinedDate: 'Jan 2025',
};

export const mockEmployeeDashboardData = {
  attendanceToday: {
    status: 'PRESENT',
    checkInTime: '09:15 AM',
    checkOutTime: null as string | null,
    workDuration: '4 hrs 15 mins',
    weeklyDuration: '37.5 / 40 hrs',
  },
  leaveBalance: {
    totalAvailable: 27,
    casualRemaining: 9,
    sickRemaining: 8,
    paidRemaining: 10,
  },
  upcomingHoliday: {
    name: 'Ganesh Chaturthi',
    date: 'Sep 05, 2026',
    type: 'Public Holiday',
    daysAway: '14 days away',
  },
  recentAttendance: [
    { id: '1', date: 'Today (Aug 22)', inTime: '09:15 AM', outTime: '--', duration: 'In Progress', status: 'PRESENT' },
    { id: '2', date: 'Aug 21, 2026', inTime: '09:05 AM', outTime: '06:15 PM', duration: '9h 10m', status: 'PRESENT' },
    { id: '3', date: 'Aug 20, 2026', inTime: '09:42 AM', outTime: '06:30 PM', duration: '8h 48m', status: 'LATE' },
    { id: '4', date: 'Aug 19, 2026', inTime: '09:00 AM', outTime: '06:00 PM', duration: '9h 00m', status: 'PRESENT' },
    { id: '5', date: 'Aug 18, 2026', inTime: '09:10 AM', outTime: '06:05 PM', duration: '8h 55m', status: 'PRESENT' },
  ],
  leaveHistory: [
    { id: 'l-1', type: 'Casual Leave', dates: 'Aug 28 - Aug 29', days: 2, reason: 'Personal family commitment', status: 'PENDING' },
    { id: 'l-2', type: 'Sick Leave', dates: 'Aug 04', days: 1, reason: 'Medical dental appointment', status: 'APPROVED' },
    { id: 'l-3', type: 'Paid Leave', dates: 'Jul 14 - Jul 18', days: 5, reason: 'Summer trip', status: 'APPROVED' },
  ],
};

export const mockAdminDashboardData = {
  stats: {
    totalEmployees: 128,
    totalEmployeesChange: '+4 this month',
    presentToday: '119 / 128',
    presentPercentage: '93% on duty',
    pendingApprovalsCount: 6,
    pendingApprovalsSubtitle: 'Requires HR review',
    onLeaveTodayCount: 9,
    onLeaveSubtitle: '6 Planned, 3 Sick',
  },
  pendingApprovals: [
    {
      id: 'req-101',
      employeeName: 'Sneha Patel',
      employeeId: 'EMP-002',
      department: 'Product Design',
      leaveType: 'Casual Leave',
      dates: 'Aug 25 - Aug 27',
      totalDays: 3,
      reason: 'Family wedding event in hometown.',
      appliedDate: '2 hours ago',
    },
    {
      id: 'req-102',
      employeeName: 'Rahul Verma',
      employeeId: 'EMP-014',
      department: 'Backend Engineering',
      leaveType: 'Sick Leave',
      dates: 'Aug 23 - Aug 24',
      totalDays: 2,
      reason: 'Viral fever, advised 2 days rest by physician.',
      appliedDate: '5 hours ago',
    },
    {
      id: 'req-103',
      employeeName: 'Pooja Sharma',
      employeeId: 'EMP-028',
      department: 'Growth & Marketing',
      leaveType: 'Paid Leave',
      dates: 'Sep 01 - Sep 05',
      totalDays: 5,
      reason: 'Annual family holiday leave.',
      appliedDate: '1 day ago',
    },
  ],
  departmentAttendance: [
    { department: 'Engineering', total: 54, present: 51, onLeave: 3, rate: '94%' },
    { department: 'Product Design', total: 18, present: 16, onLeave: 2, rate: '88%' },
    { department: 'Marketing', total: 22, present: 21, onLeave: 1, rate: '95%' },
    { department: 'Human Resources', total: 12, present: 12, onLeave: 0, rate: '100%' },
    { department: 'Operations & QA', total: 22, present: 19, onLeave: 3, rate: '86%' },
  ],
  recentActivity: [
    { id: 'act-1', message: 'Karthik Nair completed August Payroll reconciliation', time: '15 mins ago', type: 'PAYROLL' },
    { id: 'act-2', message: 'Sneha Patel submitted a 3-day Casual Leave request', time: '2 hours ago', type: 'LEAVE' },
    { id: 'act-3', message: 'New employee Vikram Roy completed Aadhaar KYC verification', time: '3 hours ago', type: 'ONBOARDING' },
    { id: 'act-4', message: 'Daily check-in threshold reached 90% quorum at 09:45 AM', time: '4 hours ago', type: 'ATTENDANCE' },
  ],
};
