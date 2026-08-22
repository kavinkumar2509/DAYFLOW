import { authApi } from '../api/auth.api';
import { authStore } from '../context/auth.state';
import { showToast } from './Toast';
import { ApiError } from '../api/client';

export class LoginModal {
  private container: HTMLElement;
  private isKycStep = false;
  private kycEmail = '';

  constructor(containerId = 'modal-root') {
    let el = document.getElementById(containerId);
    if (!el) {
      el = document.createElement('div');
      el.id = containerId;
      document.body.appendChild(el);
    }
    this.container = el;
  }

  show(requireAuth = true) {
    this.isKycStep = false;
    this.kycEmail = '';
    this.render(requireAuth);
  }

  hide() {
    this.container.innerHTML = '';
  }

  private render(isForced = false) {
    if (this.isKycStep) {
      this.renderKycDialog();
      return;
    }

    this.container.innerHTML = `
      <div class="modal-overlay" id="login-overlay">
        <div class="modal-dialog">
          <div style="display: flex; justify-content: space-between; align-items: flex-start;">
            <div>
              <h2 class="modal-title">Sign in to DAYFLOW</h2>
              <p class="modal-subtitle">Enterprise Human Resource & Attendance System</p>
            </div>
            ${!isForced ? '<button class="toast-close" id="modal-close" style="font-size:1.5rem;">&times;</button>' : ''}
          </div>

          <form id="login-form">
            <div class="form-group">
              <label class="form-label" for="login-email">Work Email</label>
              <input type="email" id="login-email" class="form-input" placeholder="e.g. kavin@dayflow.com" value="kavin@dayflow.com" required />
            </div>

            <div class="form-group">
              <label class="form-label" for="login-password">Password</label>
              <input type="password" id="login-password" class="form-input" placeholder="••••••••" value="Password@123" required />
            </div>

            <button type="submit" id="btn-login-submit" class="btn-primary">
              Authenticate Session
            </button>
          </form>

          <div class="quick-accounts-list">
            <div class="quick-accounts-title">Quick Switch Test Credentials (Click to Autofill)</div>
            
            <div class="account-pill" data-email="kavin@dayflow.com" data-pass="Password@123">
              <div>
                <div class="account-pill-name">Kavin Prabhu (EMP001)</div>
                <div style="font-size:0.7rem; color:var(--text-muted)">kavin@dayflow.com</div>
              </div>
              <span class="account-pill-role" style="background:rgba(59,130,246,0.15); color:#60a5fa;">EMPLOYEE</span>
            </div>

            <div class="account-pill" data-email="admin@dayflow.com" data-pass="Admin@123">
              <div>
                <div class="account-pill-name">Admin Console (ADMIN001)</div>
                <div style="font-size:0.7rem; color:var(--text-muted)">admin@dayflow.com</div>
              </div>
              <span class="account-pill-role" style="background:rgba(244,63,94,0.15); color:#fb7185;">ADMIN</span>
            </div>

            <div class="account-pill" data-email="adhi@dayflow.com" data-pass="Password@123">
              <div>
                <div class="account-pill-name">Adhi (EMP002)</div>
                <div style="font-size:0.7rem; color:var(--text-muted)">adhi@dayflow.com</div>
              </div>
              <span class="account-pill-role" style="background:rgba(16,185,129,0.15); color:#34d399;">EMPLOYEE</span>
            </div>

            <div class="account-pill" data-email="sarah.connor@dayflow.com" data-pass="Password@123">
              <div>
                <div class="account-pill-name">Sarah Connor (EMP003)</div>
                <div style="font-size:0.7rem; color:var(--text-muted)">sarah.connor@dayflow.com (Requires KYC)</div>
              </div>
              <span class="account-pill-role" style="background:rgba(245,158,11,0.15); color:#fbbf24;">KYC PENDING</span>
            </div>
          </div>
        </div>
      </div>
    `;

    this.attachEvents();
  }

  private renderKycDialog() {
    this.container.innerHTML = `
      <div class="modal-overlay" id="login-overlay">
        <div class="modal-dialog">
          <h2 class="modal-title" style="color: #fbbf24;">Aadhaar e-KYC Verification</h2>
          <p class="modal-subtitle">First-time login detected for <strong>${this.kycEmail}</strong>. Please complete UIDAI Aadhaar verification to continue.</p>

          <form id="kyc-form">
            <div class="form-group">
              <label class="form-label" for="kyc-aadhaar">12-Digit Aadhaar Number</label>
              <input type="text" id="kyc-aadhaar" class="form-input" placeholder="123456789012" value="123456789012" maxlength="12" required />
            </div>

            <div class="form-group">
              <label class="form-label" for="kyc-otp">6-Digit Verification OTP</label>
              <input type="text" id="kyc-otp" class="form-input" placeholder="123456" value="123456" maxlength="6" required />
            </div>

            <div class="form-group" style="display:flex; align-items:center; gap:0.5rem; margin-top:0.5rem;">
              <input type="checkbox" id="kyc-consent" checked required style="width:16px; height:16px;" />
              <label for="kyc-consent" style="font-size:0.775rem; color:var(--text-secondary); cursor:pointer;">
                I consent to UIDAI verification for employee records
              </label>
            </div>

            <button type="submit" id="btn-kyc-submit" class="btn-primary" style="background:linear-gradient(135deg, #f59e0b, #d97706);">
              Verify e-KYC & Access Portal
            </button>
          </form>
        </div>
      </div>
    `;

    const kycForm = document.getElementById('kyc-form') as HTMLFormElement;
    kycForm?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const aadhaarNumber = (document.getElementById('kyc-aadhaar') as HTMLInputElement)?.value.trim();
      const otp = (document.getElementById('kyc-otp') as HTMLInputElement)?.value.trim();
      const consent = (document.getElementById('kyc-consent') as HTMLInputElement)?.checked;
      const submitBtn = document.getElementById('btn-kyc-submit') as HTMLButtonElement;

      try {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Verifying with UIDAI...';

        const result = await authApi.verifyAadhaar({
          email: this.kycEmail,
          aadhaarNumber,
          otp,
          consent,
        });

        showToast('e-KYC Verified', result.message || 'Aadhaar verified successfully!', 'success');
        
        // Fetch full profile
        const profile = await authApi.getProfile();
        authStore.setAuthSuccess(result.accessToken!, result.user, profile);
        this.hide();
      } catch (err: any) {
        showToast('Verification Failed', err.message || 'Could not verify Aadhaar', 'error');
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Verify e-KYC & Access Portal';
      }
    });
  }

  private attachEvents() {
    const form = document.getElementById('login-form') as HTMLFormElement;
    const closeBtn = document.getElementById('modal-close');

    closeBtn?.addEventListener('click', () => this.hide());

    // Account pill quick select
    const pills = this.container.querySelectorAll('.account-pill');
    pills.forEach((pill) => {
      pill.addEventListener('click', () => {
        const email = pill.getAttribute('data-email');
        const pass = pill.getAttribute('data-pass');
        const emailInput = document.getElementById('login-email') as HTMLInputElement;
        const passInput = document.getElementById('login-password') as HTMLInputElement;
        if (emailInput && passInput && email && pass) {
          emailInput.value = email;
          passInput.value = pass;
          // Auto submit
          form.dispatchEvent(new Event('submit'));
        }
      });
    });

    form?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = (document.getElementById('login-email') as HTMLInputElement)?.value.trim();
      const password = (document.getElementById('login-password') as HTMLInputElement)?.value;
      const submitBtn = document.getElementById('btn-login-submit') as HTMLButtonElement;

      try {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Authenticating...';

        const result = await authApi.login({ email, password });

        if (result.requiresAadhaarVerification) {
          this.isKycStep = true;
          this.kycEmail = email;
          showToast('KYC Required', 'Please complete one-time Aadhaar verification.', 'conflict');
          this.renderKycDialog();
          return;
        }

        if (result.accessToken) {
          const profile = await authApi.getProfile();
          authStore.setAuthSuccess(result.accessToken, result.user, profile);
          showToast('Welcome Back', `Signed in as ${result.user.employeeId} (${result.user.email})`, 'success');
          this.hide();
        }
      } catch (err: any) {
        const msg = err instanceof ApiError ? err.message : 'Invalid credentials. Please check email and password.';
        showToast('Authentication Error', msg, 'error');
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Authenticate Session';
      }
    });
  }
}

export const loginModal = new LoginModal();
