import { attendanceApi, AttendanceRecordWithRemarks } from '../api/attendance.api';
import { AttendanceStatus } from '@dayflow/shared-types';
import { showToast } from './Toast';

export class AttendanceTable {
  private element: HTMLElement;
  private records: AttendanceRecordWithRemarks[] = [];
  private selectedStatus: AttendanceStatus | '' = '';
  private isLoading = false;
  private onRecordsFetched?: (records: AttendanceRecordWithRemarks[]) => void;

  constructor(targetEl: HTMLElement, onRecordsFetched?: (records: AttendanceRecordWithRemarks[]) => void) {
    this.element = targetEl;
    this.onRecordsFetched = onRecordsFetched;
  }

  async fetchRecords() {
    this.isLoading = true;
    this.render();
    try {
      const data = await attendanceApi.getOwnAttendance(
        this.selectedStatus ? { status: this.selectedStatus } : {},
      );
      this.records = data;
      this.onRecordsFetched?.(data);
    } catch (err: any) {
      showToast('Error Loading Attendance', err.message || 'Could not fetch attendance history.', 'error');
    } finally {
      this.isLoading = false;
      this.render();
    }
  }

  render() {
    this.element.innerHTML = `
      <div class="history-panel glass-panel">
        <div class="history-header">
          <div>
            <h3 class="card-title">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent-indigo)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
              <span>Attendance History Log</span>
            </h3>
            <p style="font-size:0.775rem; color:var(--text-muted); margin-top:0.2rem;">
              Verified punch records retrieved from backend database
            </p>
          </div>

          <div class="table-filters">
            <select id="status-filter" class="filter-select">
              <option value="" ${this.selectedStatus === '' ? 'selected' : ''}>All Statuses</option>
              <option value="PRESENT" ${this.selectedStatus === 'PRESENT' ? 'selected' : ''}>Present</option>
              <option value="HALF_DAY" ${this.selectedStatus === 'HALF_DAY' ? 'selected' : ''}>Half Day</option>
              <option value="ABSENT" ${this.selectedStatus === 'ABSENT' ? 'selected' : ''}>Absent</option>
              <option value="LEAVE" ${this.selectedStatus === 'LEAVE' ? 'selected' : ''}>On Leave</option>
            </select>

            <button id="btn-refresh-history" class="btn-refresh" title="Refresh records from backend">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="23 4 23 10 17 10"></polyline>
                <polyline points="1 20 1 14 7 14"></polyline>
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
              </svg>
              <span>Refresh</span>
            </button>
          </div>
        </div>

        <div class="table-wrap">
          ${
            this.isLoading
              ? `
              <div style="padding:3rem; text-align:center; color:var(--text-muted);">
                <div style="margin-bottom:0.5rem; font-size:1.5rem;">⏳</div>
                <div>Fetching verified attendance records from backend...</div>
              </div>
            `
              : this.records.length === 0
              ? `
              <div class="empty-state">
                <div class="empty-icon">📂</div>
                <div style="font-weight:600; color:var(--text-secondary); margin-bottom:0.25rem;">No attendance records found</div>
                <div style="font-size:0.8rem;">Punch in using the card on the left to create your first attendance record.</div>
              </div>
            `
              : `
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Check In</th>
                    <th>Check Out</th>
                    <th>Work Duration</th>
                    <th>Status</th>
                    <th>Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  ${this.records
                    .map((r) => {
                      const checkInStr = r.checkIn
                        ? new Date(r.checkIn).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
                        : '—';
                      const checkOutStr = r.checkOut
                        ? new Date(r.checkOut).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
                        : '—';
                      const durationStr = r.workHours !== undefined && r.workHours !== null
                        ? `${r.workHours} hrs`
                        : r.checkIn && !r.checkOut
                        ? 'In Progress'
                        : '—';
                      
                      const statusClass = (r.status || 'PRESENT').toLowerCase();
                      const statusLabel = (r.status || 'PRESENT').replace('_', ' ');

                      return `
                        <tr>
                          <td style="font-family:var(--font-mono); font-weight:600;">${r.date}</td>
                          <td style="color:#34d399; font-family:var(--font-mono); font-weight:500;">${checkInStr}</td>
                          <td style="color:#fb7185; font-family:var(--font-mono); font-weight:500;">${checkOutStr}</td>
                          <td style="color:#93c5fd; font-family:var(--font-mono); font-weight:600;">${durationStr}</td>
                          <td>
                            <span class="badge ${statusClass}">${statusLabel}</span>
                          </td>
                          <td style="color:var(--text-secondary); font-size:0.8rem; max-width:200px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;" title="${escapeHtml(r.remarks || '')}">
                            ${escapeHtml(r.remarks || '—')}
                          </td>
                        </tr>
                      `;
                    })
                    .join('')}
                </tbody>
              </table>
            `
          }
        </div>
      </div>
    `;

    this.attachEvents();
  }

  private attachEvents() {
    const filterSelect = this.element.querySelector('#status-filter') as HTMLSelectElement;
    filterSelect?.addEventListener('change', () => {
      this.selectedStatus = filterSelect.value as AttendanceStatus | '';
      this.fetchRecords();
    });

    const refreshBtn = this.element.querySelector('#btn-refresh-history');
    refreshBtn?.addEventListener('click', () => {
      this.fetchRecords();
    });
  }
}

function escapeHtml(str: string): string {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
