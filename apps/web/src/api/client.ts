/**
 * DAYFLOW HRMS API Client & Interceptors
 * Automatically passes Authorization: Bearer <accessToken>
 * Unwraps standard backend envelopes and normalizes error messages (409 Conflict, 400, 401).
 */

export const API_BASE_URL = 'http://localhost:3000';

export interface ApiClientResponse<T> {
  success: boolean;
  statusCode: number;
  data: T;
  message?: string;
  timestamp?: string;
}

export class ApiError extends Error {
  statusCode: number;
  errors?: string[];
  rawResponse?: any;

  constructor(message: string, statusCode: number, errors?: string[], rawResponse?: any) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.errors = errors;
    this.rawResponse = rawResponse;
  }
}

export const TOKEN_STORAGE_KEY = 'dayflow_access_token';
export const USER_STORAGE_KEY = 'dayflow_user_data';

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_STORAGE_KEY);
}

export function setStoredToken(token: string): void {
  localStorage.setItem(TOKEN_STORAGE_KEY, token);
}

export function clearStoredAuth(): void {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
  localStorage.removeItem(USER_STORAGE_KEY);
}

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getStoredToken();
  const headers = new Headers(options.headers || {});

  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    let json: any = null;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      json = await response.json();
    }

    if (!response.ok) {
      // Backend error format: { statusCode, message, errors, path, timestamp } or standard Nest exception
      const errorMsg =
        json?.message ||
        (Array.isArray(json?.errors) ? json.errors.join(', ') : null) ||
        `Request failed with status ${response.status}`;
      
      throw new ApiError(
        typeof errorMsg === 'string' ? errorMsg : JSON.stringify(errorMsg),
        response.status,
        json?.errors,
        json,
      );
    }

    // Unwrap envelope: { success: true, statusCode: 200, data: T } -> returns data
    if (json && typeof json === 'object' && 'data' in json) {
      return json.data as T;
    }

    return json as T;
  } catch (error: any) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      error?.message || 'Network error occurred. Please verify backend server on http://localhost:3000.',
      0,
    );
  }
}
