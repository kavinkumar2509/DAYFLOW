import { attendanceApi } from '../api/attendance.api';
import { AttendanceRecord, AttendanceStatus } from '@dayflow/shared-types';
import { showToast } from './Toast';
import { ApiError } from '../api/client';

export class AttendanceCard {
  private element: HTMLElement;
  private todayRecord: AttendanceRecord | null = null;
  private timerInterval: any = null;
  private onRecordChanged?: () => void;

  constructor(targetEl: HTMLElement, onRecordChanged?: () => void) {
    this.element = targetEl;
    this.onRecordChanged = onRecordChanged;
    this.startLiveClock();
  }

  setTodayRecord(record: AttendanceRecord | null) {
    this.todayRecord = record;
    this.render();
  }

  private startLiveClock() {
    this.updateClock();
    if (this.timerInterval) clearInterval(this.timerInterval);
    this.timerInterval = setInterval(() => this.updateClock(), 1000);
  }

  private updateClock() {
    const timeEl = this.element.querySelector('#live-clock-time');
    const dateEl = this.element.querySelector('#live-clock-date');
    const now = new Date();

    if (timeEl) {
      timeEl.textContent = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      });
    }

    if (dateEl) {
      dateEl.textContent = now.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    }
  }

  render() {
    const record = this.todayRecord;
    const isCheckedIn = !!record?.checkIn;
    const isCheckedOut = !!record?.checkOut;

    let statusBadgeHtml = '';
    let actionState = {
      canCheckIn: false,
      canCheckOut: false,
      statusText: 'Not Checked In',
    };

    if (!isCheckedIn) {
      actionState.canCheckIn = true;
      actionState.canCheckOut = false;
      actionState.statusText = 'Not Checked In';
      statusBadgeHtml = `<div class="status-badge-large not-checked">⭕ Not Punched In Today</div>`;
    } else if (isCheckedIn && !isCheckedOut) {
      actionState.canCheckIn = false;
      actionState.canCheckOut = true;
      actionState.statusText = 'Active / Working';
      statusBadgeHtml = `<div class="status-badge-large present">🟢 Checked In & Working</div>`;
    } else {
      actionState.canCheckIn = false;
      actionState.canCheckOut = false;
      actionState.statusText = 'Shift Completed';
      const statusClass = record.status === AttendanceStatus.HALF_DAY ? 'halfday' : 'completed';
      statusBadgeHtml = `<div class="status-badge-large ${statusClass}">✨ Shift Completed (${record.workHours ?? 0} hrs)</div>`;
    }

    const checkInTimeStr = record?.checkIn
      ? new Date(record.checkIn).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      : '--:--';

    const checkOutTimeStr = record?.checkOut
      ? new Date(record.checkOut).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      : '--:--';

    const durationStr = record?.workHours !== undefined && record?.workHours !== null
      ? `${record.workHours} hrs`
      : isCheckedIn && !isCheckedOut
      ? 'In Progress'
      : '--';

    this.element.innerHTML = `
      <div class="punch-card glass-panel">
        <div class="punch-header">
          <div class="card-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent-blue)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            <span>Today's Attendance</span>
          </div>
          <div class="live-indicator">
            <div class="pulse-dot"></div>
            <span>LIVE</span>
          </div>
        </div>

        <div class="clock-display">
          <div class="live-time" id="live-clock-time">--:--:--</div>
          <div class="live-date" id="live-clock-date">Loading...</div>
        </div>

        ${statusBadgeHtml}

        <div class="punch-details">
          <div class="punch-detail-item">
            <span class="punch-detail-label">Check-In</span>
            <span class="punch-detail-val" style="color:#34d399;">${checkInTimeStr}</span>
          </div>
          <div class="punch-detail-item">
            <span class="punch-detail-label">Check-Out</span>
            <span class="punch-detail-val" style="color:#fb7185;">${checkOutTimeStr}</span>
          </div>
          <div class="punch-detail-item" style="grid-column: 1 / -1; margin-top:0.25rem;">
            <span class="punch-detail-label">Effective Work Hours</span>
            <span class="punch-detail-val" style="color:#93c5fd;">${durationStr}</span>
          </div>
        </div>

        <div>
          <input
            type="text"
            id="punch-remarks-input"
            class="remarks-input"
            placeholder="Optional punch notes (e.g. Working from HQ)"
          />
        </div>

        <div class="punch-actions">
          <button
            id="btn-action-checkin"
            class="btn-punch-in"
            ${!actionState.canCheckIn ? 'disabled' : ''}
            title="${!actionState.canCheckIn ? 'Already checked in for today' : 'Punch in for today'}"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
              <polyline points="10 17 15 12 10 7"></polyline>
              <line x1="15" y1="12" x2="3" y2="12"></line>
            </svg>
            <span>Punch In</span>
          </button>

          <button
            id="btn-action-checkout"
            class="btn-punch-out"
            ${!actionState.canCheckOut ? 'disabled' : ''}
            title="${!actionState.canCheckOut ? 'Must check in first or already checked out' : 'Punch out for today'}"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            <span>Punch Out</span>
          </button>
        </div>
      </div>
    `;

    this.updateClock();
    this.attachEvents();
  }

  private attachEvents() {
    const checkInBtn = this.element.querySelector('#btn-action-checkin') as HTMLButtonElement;
    const checkOutBtn = this.element.querySelector('#btn-action-checkout') as HTMLButtonElement;
    const remarksInput = this.element.querySelector('#punch-remarks-input') as HTMLInputElement;

    // Check In click handler
    checkInBtn?.addEventListener('click', async () => {
      const remarks = remarksInput?.value.trim() || undefined;
      try {
        checkInBtn.disabled = true;
        checkInBtn.innerHTML = '<span>Punching In...</span>';

        const updated = await attendanceApi.checkIn({ remarks });
        showToast('Check-In Successful', `Checked in at ${new Date(updated.checkIn!).toLocaleTimeString()}`, 'success');
        this.todayRecord = updated;
        this.render();
        this.onRecordChanged?.();
      } catch (err: any) {
        if (err instanceof ApiError && err.statusCode === 409) {
          // Display backend message e.g. "You have already checked in for today."
          showToast('Already Checked In', err.message || 'You have already checked in for today.', 'conflict');
        } else {
          showToast('Check-In Failed', err.message || 'Could not record check-in.', 'error');
        }
        this.render();
      }
    });

    // Check Out click handler
    checkOutBtn?.addEventListener('click', async () => {
      const remarks = remarksInput?.value.trim() || undefined;
      try {
        checkOutBtn.disabled = true;
        checkOutBtn.innerHTML = '<span>Punching Out...</span>';

        const updated = await attendanceApi.checkOut({ remarks });
        showToast(
          'Check-Out Recorded',
          `Checked out at ${new Date(updated.checkOut!).toLocaleTimeString()}. Total hours: ${updated.workHours || 0} hrs`,
          'success',
        );
        this.todayRecord = updated;
        this.render();
        this.onRecordChanged?.();
      } catch (err: any) {
        if (err instanceof ApiError && (err.statusCode === 400 || err.statusCode === 409)) {
          // Display backend message e.g. "You have already checked out for today." or "No check-in record found for today."
          showToast('Attendance Notice', err.message, 'conflict');
        } else {
          showToast('Check-Out Failed', err.message || 'Could not record check-out.', 'error');
        }
        this.render();
      }
    });
  }
}
