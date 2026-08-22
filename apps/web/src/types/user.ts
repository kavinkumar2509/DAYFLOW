export type UserRole = 'EMPLOYEE' | 'ADMIN' | 'HR';

export interface User {
  id: string;
  employeeId: string;
  email: string;
  name: string;
  role: UserRole;
  department?: string;
  designation?: string;
  phone?: string;
  avatarUrl?: string;
  firstLogin: boolean;
  isAadhaarVerified: boolean;
  createdAt: string;
}

export interface LoginCredentials {
  email: string;
  password?: string;
  otp?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  firstLogin: boolean;
}

export interface AadhaarVerifyPayload {
  aadhaarNumber: string;
  otp?: string;
}

export interface AadhaarVerifyResponse {
  success: boolean;
  message: string;
}
