'use client';

import { useState, useCallback, useEffect } from 'react';
import type { User, UserRole, LoginCredentials, AadhaarVerifyPayload } from '@/types/user';
import { authApi } from '@/lib/api/auth';

export interface UseAuthReturn {
  user: User | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isFirstLogin: boolean;
  login: (credentials: LoginCredentials) => Promise<{ role: UserRole; firstLogin: boolean }>;
  verifyAadhaar: (payload: AadhaarVerifyPayload) => Promise<boolean>;
  logout: () => Promise<void>;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isFirstLogin, setIsFirstLogin] = useState<boolean>(false);

  useEffect(() => {
    // Initial session check placeholder
    const checkSession = async () => {
      try {
        const currentUser = await authApi.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          setIsFirstLogin(currentUser.firstLogin && !currentUser.isAadhaarVerified);
        }
      } catch (err) {
        console.error('Session check failed', err);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    setIsLoading(true);
    try {
      const response = await authApi.login(credentials);
      setUser(response.user);
      setIsFirstLogin(response.firstLogin);
      return {
        role: response.user.role,
        firstLogin: response.firstLogin,
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const verifyAadhaar = useCallback(async (payload: AadhaarVerifyPayload) => {
    setIsLoading(true);
    try {
      const res = await authApi.verifyAadhaar(payload);
      if (res.success && user) {
        setUser({ ...user, isAadhaarVerified: true, firstLogin: false });
        setIsFirstLogin(false);
      }
      return res.success;
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await authApi.logout();
      setUser(null);
      setIsFirstLogin(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    user,
    role: user?.role ?? null,
    isAuthenticated: !!user,
    isLoading,
    isFirstLogin,
    login,
    verifyAadhaar,
    logout,
  };
}
