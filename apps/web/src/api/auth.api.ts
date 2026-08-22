import { apiClient, clearStoredAuth, setStoredToken } from './client';
import { AuthResult, UserDetails } from '@dayflow/shared-types';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface VerifyAadhaarRequest {
  email?: string;
  aadhaarNumber: string;
  otp: string;
  consent: boolean;
}

export const authApi = {
  /**
   * Authenticate user with Email & Password
   */
  async login(credentials: LoginRequest): Promise<AuthResult> {
    const data = await apiClient<AuthResult>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    if (data.accessToken && !data.requiresAadhaarVerification) {
      setStoredToken(data.accessToken);
    }
    return data;
  },

  /**
   * Verify Aadhaar e-KYC for first-time login
   */
  async verifyAadhaar(payload: VerifyAadhaarRequest): Promise<AuthResult & { message: string }> {
    const data = await apiClient<AuthResult & { message: string }>('/auth/verify-aadhaar', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    if (data.accessToken) {
      setStoredToken(data.accessToken);
    }
    return data;
  },

  /**
   * Fetch current authenticated employee profile
   */
  async getProfile(): Promise<UserDetails> {
    return apiClient<UserDetails>('/users/me', {
      method: 'GET',
    });
  },

  /**
   * Logout user session
   */
  async logout(): Promise<{ message: string }> {
    try {
      const res = await apiClient<{ message: string }>('/auth/logout', {
        method: 'POST',
      });
      clearStoredAuth();
      return res;
    } catch {
      clearStoredAuth();
      return { message: 'Logged out successfully.' };
    }
  },
};
