import type {
  AuthResponse,
  LoginCredentials,
  AadhaarVerifyPayload,
  AadhaarVerifyResponse,
  User,
} from '@/types/user';
import { fetchApi, setAuthToken, clearAuthToken } from './client';

export const authApi = {
  /**
   * Authenticate user credentials with backend (POST /auth/login)
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const rawData = await fetchApi<any>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: credentials.email.trim(),
        password: credentials.password,
      }),
    });

    const isFirstLogin =
      rawData.requiresAadhaarVerification === true ||
      rawData.user?.firstLoginCompleted === false ||
      rawData.user?.aadhaarVerified === false;

    const token = rawData.accessToken || '';
    const userRole = (rawData.user?.role || 'EMPLOYEE') as 'EMPLOYEE' | 'ADMIN' | 'HR';

    const mappedUser: User = {
      id: rawData.user?.id || '',
      employeeId: rawData.user?.employeeId || '',
      email: rawData.user?.email || credentials.email,
      name: rawData.user?.profile
        ? `${rawData.user.profile.firstName} ${rawData.user.profile.lastName}`.trim()
        : rawData.user?.email?.split('@')[0] || 'User',
      role: userRole,
      department: rawData.user?.profile?.department || 'DAYFLOW',
      designation: rawData.user?.profile?.designation || (userRole === 'ADMIN' ? 'Administrator' : 'Staff Member'),
      phone: rawData.user?.profile?.phone,
      avatarUrl: rawData.user?.profile?.profilePictureUrl,
      firstLogin: isFirstLogin,
      isAadhaarVerified: rawData.user?.aadhaarVerified ?? !isFirstLogin,
      createdAt: rawData.user?.createdAt || new Date().toISOString(),
    };

    if (token && !isFirstLogin) {
      setAuthToken(token, userRole);
    }

    return {
      user: mappedUser,
      token,
      firstLogin: isFirstLogin,
    };
  },

  /**
   * Verify Aadhaar during first login flow (POST /auth/verify-aadhaar)
   */
  async verifyAadhaar(payload: AadhaarVerifyPayload): Promise<AadhaarVerifyResponse> {
    const rawData = await fetchApi<any>('/auth/verify-aadhaar', {
      method: 'POST',
      body: JSON.stringify({
        email: (payload as any).email || undefined,
        aadhaarNumber: payload.aadhaarNumber.replace(/\s+/g, ''),
        otp: payload.otp || '123456',
        consent: true,
      }),
    });

    if (rawData.accessToken) {
      const userRole = (rawData.user?.role || 'EMPLOYEE') as 'EMPLOYEE' | 'ADMIN' | 'HR';
      setAuthToken(rawData.accessToken, userRole);
    }

    return {
      success: true,
      message: rawData.message || 'Aadhaar e-KYC verified successfully.',
    };
  },

  /**
   * Fetch current authenticated session (GET /users/me)
   */
  async getCurrentUser(): Promise<User | null> {
    try {
      const rawUser = await fetchApi<any>('/users/me', {
        method: 'GET',
      });

      if (!rawUser) return null;

      const userRole = (rawUser.role || 'EMPLOYEE') as 'EMPLOYEE' | 'ADMIN' | 'HR';
      const isFirstLogin = !rawUser.firstLoginCompleted || !rawUser.aadhaarVerified;

      return {
        id: rawUser.id,
        employeeId: rawUser.employeeId,
        email: rawUser.email,
        name: rawUser.profile
          ? `${rawUser.profile.firstName} ${rawUser.profile.lastName}`.trim()
          : rawUser.email.split('@')[0],
        role: userRole,
        department: rawUser.profile?.department || 'Engineering',
        designation: rawUser.profile?.designation || (userRole === 'ADMIN' ? 'Administrator' : 'Staff Member'),
        phone: rawUser.profile?.phone,
        avatarUrl: rawUser.profile?.profilePictureUrl,
        firstLogin: isFirstLogin,
        isAadhaarVerified: rawUser.aadhaarVerified ?? true,
        createdAt: rawUser.createdAt || new Date().toISOString(),
      };
    } catch {
      return null;
    }
  },

  /**
   * Log out current session (POST /auth/logout)
   */
  async logout(): Promise<void> {
    try {
      await fetchApi('/auth/logout', {
        method: 'POST',
      });
    } finally {
      clearAuthToken();
    }
  },
};
