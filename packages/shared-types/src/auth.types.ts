import { Role } from './enums';

export interface UserSummary {
  id: string;
  employeeId: string;
  email: string;
  role: Role;
  emailVerified: boolean;
  aadhaarVerified: boolean;
  firstLoginCompleted: boolean;
  isActive: boolean;
  createdAt: string;
}

export interface AuthTokens {
  accessToken: string;
}

export interface AuthResult {
  user: UserSummary;
  accessToken?: string;
  requiresAadhaarVerification?: boolean;
  verificationSessionId?: string;
}

export interface JwtPayload {
  sub: string;
  userId: string;
  employeeId: string;
  email: string;
  role: Role;
  iat?: number;
  exp?: number;
}

export interface AadhaarVerificationRequest {
  aadhaarNumberOrOtpToken: string;
  otp?: string;
  consent: boolean;
}

export interface AadhaarVerificationResult {
  verified: boolean;
  maskedAadhaar: string;
  transactionId: string;
  message: string;
}
