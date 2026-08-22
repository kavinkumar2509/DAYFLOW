import type {
  AuthResponse,
  LoginCredentials,
  AadhaarVerifyPayload,
  AadhaarVerifyResponse,
  User,
} from '@/types/user';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

/**
 * Auth API Client (Placeholder for backend integration)
 */
export const authApi = {
  /**
   * Authenticate user credentials with backend
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      throw new Error(`Login failed with status: ${response.status}`);
    }

    return response.json();
  },

  /**
   * Verify Aadhaar during first login flow
   * Note: Frontend only passes payload to backend, no local storage of sensitive numbers
   */
  async verifyAadhaar(payload: AadhaarVerifyPayload): Promise<AadhaarVerifyResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/verify-aadhaar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Aadhaar verification failed with status: ${response.status}`);
    }

    return response.json();
  },

  /**
   * Fetch current authenticated session
   */
  async getCurrentUser(): Promise<User | null> {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      return null;
    }

    return response.json();
  },

  /**
   * Log out current session
   */
  async logout(): Promise<void> {
    await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
  },
};
