import { Navbar } from './components/Navbar';
import { AttendanceCard } from './components/AttendanceCard';
import { AttendanceTable } from './components/AttendanceTable';
import { authStore, AuthState } from './context/auth.state';
import { loginModal } from './components/LoginModal';
import { AttendanceRecord, AttendanceStatus } from '@dayflow/shared-types';

export class App {
  private container: HTMLElement;
  private navbar!: Navbar;
  private attendanceCard!: AttendanceCard;
  private attendanceTable!: AttendanceTable;
  private records: AttendanceRecord[] = [];

  constructor(containerId = 'app') {
    this.container = document.getElementById(containerId) || document.body;
  }

  async init() {
    this.renderBaseLayout();
    await authStore.init();

    authStore.subscribe((state) => {
      this.handleAuthStateChange(state);
    });

    if (!authStore.getState().isAuthenticated) {
      loginModal.show(true);
    }
  }

  private renderBaseLayout() {
    this.container.innerHTML = `
      <div class="app-container">
        <header id="navbar-root"></header>
        
        <main class="main-content">
          <div class="dashboard-header">
            <div>
              <h1 class="page-title" id="welcome-heading">Workforce Attendance Portal</h1>
              <p class="page-subtitle">Real-time attendance tracking, check-in timestamps, and biometric KYC</p>
            </div>
          </div>

          <div id="stats-grid-root" class="stats-grid">
            <!-- Stats rendered dynamically -->
          </div>

          <div class="dashboard-main-grid">
            <div id="punch-card-root"></div>
            <div id="attendance-table-root"></div>
          </div>
        </main>
      </div>
    `;

    const navRoot = document.getElementById('navbar-root')!;
    this.navbar = new Navbar(navRoot);

    const punchRoot = document.getElementById('punch-card-root')!;
    this.attendanceCard = new AttendanceCard(punchRoot, () => {
      // When check in or check out occurs, re-fetch history table
      this.attendanceTable.fetchRecords();
    });

    const tableRoot = document.getElementById('attendance-table-root')!;
    this.attendanceTable = new AttendanceTable(tableRoot, (records) => {
      this.records = records;
      this.updateTodayRecordFromList(records);
      this.renderStats(records);
    });
  }

  private handleAuthStateChange(state: AuthState) {
    const welcomeHeading = document.getElementById('welcome-heading');
    if (welcomeHeading) {
      if (state.isAuthenticated && state.profile?.profile) {
        const firstName = state.profile.profile.firstName || 'Employee';
        welcomeHeading.textContent = `Welcome back, ${firstName}`;
      } else if (state.isAuthenticated && state.user) {
        welcomeHeading.textContent = `Welcome, ${state.user.employeeId}`;
      } else {
        welcomeHeading.textContent = `Workforce Attendance Portal`;
      }
    }

    if (state.isAuthenticated) {
      this.attendanceTable.fetchRecords();
    } else {
      this.records = [];
      this.attendanceCard.setTodayRecord(null);
      this.renderStats([]);
    }
  }

  private updateTodayRecordFromList(records: AttendanceRecord[]) {
    const todayStr = new Date().toISOString().split('T')[0];
    const todayRecord = records.find((r) => r.date === todayStr) || null;
    this.attendanceCard.setTodayRecord(todayRecord);
  }

  private renderStats(records: AttendanceRecord[]) {
    const statsRoot = document.getElementById('stats-grid-root');
    if (!statsRoot) return;

    const totalDays = records.length;
    const presentCount = records.filter(
      (r) => r.status === AttendanceStatus.PRESENT || r.status === AttendanceStatus.HALF_DAY,
    ).length;

    const completedShifts = records.filter((r) => r.workHours !== undefined && r.workHours !== null);
    const totalHours = completedShifts.reduce((acc, curr) => acc + (curr.workHours || 0), 0);
    const avgHours = completedShifts.length > 0 ? (totalHours / completedShifts.length).toFixed(1) : '0.0';

    const todayStr = new Date().toISOString().split('T')[0];
    const todayRecord = records.find((r) => r.date === todayStr);
    const todayStatus = todayRecord?.checkOut
      ? 'Shift Completed'
      : todayRecord?.checkIn
      ? 'Checked In'
      : 'Not Punched';

    statsRoot.innerHTML = `
      <div class="stat-card blue glass-panel">
        <div class="stat-icon-wrap blue">📅</div>
        <div>
          <div class="stat-label">Total Recorded Days</div>
          <div class="stat-value">${totalDays}</div>
        </div>
      </div>

      <div class="stat-card emerald glass-panel">
        <div class="stat-icon-wrap emerald">✅</div>
        <div>
          <div class="stat-label">Days Present</div>
          <div class="stat-value">${presentCount}</div>
        </div>
      </div>

      <div class="stat-card purple glass-panel">
        <div class="stat-icon-wrap purple">⏱️</div>
        <div>
          <div class="stat-label">Avg Daily Hours</div>
          <div class="stat-value">${avgHours} <span style="font-size:0.9rem; font-weight:500; color:var(--text-muted);">hrs</span></div>
        </div>
      </div>

      <div class="stat-card amber glass-panel">
        <div class="stat-icon-wrap amber">🏢</div>
        <div>
          <div class="stat-label">Today's State</div>
          <div class="stat-value" style="font-size:1.15rem; margin-top:0.25rem;">${todayStatus}</div>
        </div>
      </div>
    `;
  }
}
