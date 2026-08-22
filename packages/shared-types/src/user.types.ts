import { Role } from './enums';
import { UserSummary } from './auth.types';

export interface EmployeeProfileSummary {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  phone?: string;
  address?: string;
  profilePictureUrl?: string;
  department?: string;
  designation?: string;
  dateOfJoining?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserDetails extends UserSummary {
  profile?: EmployeeProfileSummary;
}

export interface UpdateProfileRequest {
  phone?: string;
  address?: string;
  profilePictureUrl?: string;
}

export interface AdminUpdateEmployeeRequest {
  email?: string;
  role?: Role;
  isActive?: boolean;
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  profilePictureUrl?: string;
  department?: string;
  designation?: string;
  dateOfJoining?: string;
}
