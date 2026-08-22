import { authApi } from '../api/auth.api';
import { getStoredToken, clearStoredAuth, USER_STORAGE_KEY } from '../api/client';
import { UserDetails, UserSummary, Role } from '@dayflow/shared-types';

export interface AuthState {
  token: string | null;
  user: UserSummary | null;
  profile: UserDetails | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

type Listener = (state: AuthState) => void;

class AuthStore {
  private state: AuthState = {
    token: getStoredToken(),
    user: null,
    profile: null,
    isAuthenticated: !!getStoredToken(),
    isLoading: false,
  };

  private listeners: Set<Listener> = new Set();

  constructor() {
    this.restoreUser();
  }

  private restoreUser() {
    const cached = localStorage.getItem(USER_STORAGE_KEY);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        this.state.user = parsed.user || null;
        this.state.profile = parsed.profile || null;
      } catch {
        // Ignore JSON error
      }
    }
  }

  getState(): AuthState {
    return { ...this.state };
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    listener(this.getState());
    return () => this.listeners.delete(listener);
  }

  private notify() {
    const currentState = this.getState();
    this.listeners.forEach((fn) => fn(currentState));
  }

  async init(): Promise<void> {
    if (this.state.token) {
      try {
        this.state.isLoading = true;
        this.notify();
        const profile = await authApi.getProfile();
        this.state.profile = profile;
        this.state.user = {
          id: profile.id,
          employeeId: profile.employeeId,
          email: profile.email,
          role: profile.role as unknown as Role,
          emailVerified: true,
          aadhaarVerified: true,
          firstLoginCompleted: true,
          isActive: true,
          createdAt: new Date().toISOString(),
        };
        this.state.isAuthenticated = true;
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify({ user: this.state.user, profile: this.state.profile }));
      } catch (err) {
        console.warn('Could not restore profile with stored token:', err);
        clearStoredAuth();
        this.state.token = null;
        this.state.user = null;
        this.state.profile = null;
        this.state.isAuthenticated = false;
      } finally {
        this.state.isLoading = false;
        this.notify();
      }
    }
  }

  setAuthSuccess(token: string, user: UserSummary, profile?: UserDetails) {
    this.state.token = token;
    this.state.user = user;
    this.state.profile = profile || null;
    this.state.isAuthenticated = true;
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify({ user, profile }));
    this.notify();
  }

  async logout() {
    await authApi.logout();
    clearStoredAuth();
    this.state.token = null;
    this.state.user = null;
    this.state.profile = null;
    this.state.isAuthenticated = false;
    this.notify();
  }
}

export const authStore = new AuthStore();
