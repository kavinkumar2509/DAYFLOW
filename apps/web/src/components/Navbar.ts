import { authStore, AuthState } from '../context/auth.state';
import { loginModal } from './LoginModal';

export class Navbar {
  private element: HTMLElement;

  constructor(targetEl: HTMLElement) {
    this.element = targetEl;
    authStore.subscribe((state) => this.render(state));
  }

  private render(state: AuthState) {
    const user = state.user;
    const profile = state.profile?.profile;

    const firstName = profile?.firstName || user?.email?.split('@')[0] || 'User';
    const lastName = profile?.lastName || '';
    const fullName = `${firstName} ${lastName}`.trim();
    const designation = profile?.designation || (user?.role === 'ADMIN' ? 'System Administrator' : 'Staff Member');
    const department = profile?.department || 'DAYFLOW';
    const role = user?.role || 'GUEST';
    const avatarUrl =
      profile?.profilePictureUrl ||
      `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80`;

    this.element.innerHTML = `
      <nav class="navbar">
        <div class="nav-container">
          <div class="nav-brand">
            <div class="brand-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
              </svg>
            </div>
            <div>
              <div class="brand-title">DAYFLOW</div>
            </div>
            <span class="brand-badge">HRMS v1.0</span>
          </div>

          <div class="nav-user">
            ${
              state.isAuthenticated
                ? `
                <div class="quick-switcher">
                  <span>Switch Test:</span>
                  <button class="switcher-btn ${user?.email === 'kavin@dayflow.com' ? 'active' : ''}" data-switch="kavin@dayflow.com">Kavin (EMP)</button>
                  <button class="switcher-btn ${user?.email === 'admin@dayflow.com' ? 'active' : ''}" data-switch="admin@dayflow.com">Admin</button>
                  <button class="switcher-btn ${user?.email === 'sarah.connor@dayflow.com' ? 'active' : ''}" data-switch="sarah.connor@dayflow.com">Sarah (KYC)</button>
                </div>

                <div class="user-avatar-wrap" title="${fullName} (${user?.employeeId})">
                  <img src="${avatarUrl}" alt="${fullName}" />
                </div>
                
                <div class="user-info">
                  <div class="user-name">${escapeHtml(fullName)}</div>
                  <div class="user-meta">
                    <span>${escapeHtml(user?.employeeId || '')}</span>
                    <span>•</span>
                    <span>${escapeHtml(designation)}</span>
                    <span class="user-role-badge">${role}</span>
                  </div>
                </div>

                <button class="btn-logout" id="nav-logout-btn" title="Sign Out Session">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16 17 21 12 16 7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                  </svg>
                  <span>Logout</span>
                </button>
              `
                : `
                <button class="btn-primary" id="nav-login-btn" style="padding:0.45rem 1.25rem; font-size:0.85rem; width:auto; margin:0;">
                  Sign In
                </button>
              `
            }
          </div>
        </div>
      </nav>
    `;

    this.attachEvents();
  }

  private attachEvents() {
    const logoutBtn = this.element.querySelector('#nav-logout-btn');
    logoutBtn?.addEventListener('click', () => {
      authStore.logout();
      loginModal.show(true);
    });

    const loginBtn = this.element.querySelector('#nav-login-btn');
    loginBtn?.addEventListener('click', () => {
      loginModal.show(false);
    });

    // Quick switchers
    const switchBtns = this.element.querySelectorAll('[data-switch]');
    switchBtns.forEach((btn) => {
      btn.addEventListener('click', async () => {
        const email = btn.getAttribute('data-switch');
        const passMap: Record<string, string> = {
          'kavin@dayflow.com': 'Password@123',
          'admin@dayflow.com': 'Admin@123',
          'sarah.connor@dayflow.com': 'Password@123',
        };
        if (email && passMap[email]) {
          try {
            await authStore.logout();
            loginModal.show(true);
            const emailInput = document.getElementById('login-email') as HTMLInputElement;
            const passInput = document.getElementById('login-password') as HTMLInputElement;
            const form = document.getElementById('login-form') as HTMLFormElement;
            if (emailInput && passInput && form) {
              emailInput.value = email;
              passInput.value = passMap[email];
              form.dispatchEvent(new Event('submit'));
            }
          } catch (err) {
            console.error(err);
          }
        }
      });
    });
  }
}

function escapeHtml(str: string): string {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
