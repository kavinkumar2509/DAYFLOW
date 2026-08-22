/**
 * DAYFLOW API Client for Next.js Frontend
 * Handles baseURL, Bearer token injection from cookies/localStorage,
 * standard response envelope unwrapping, and typed error handling (409 Conflict, 400, etc.).
 */

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

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

export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;

  // 1. Try cookie
  const match = document.cookie.match(/(?:^|;\s*)token=([^;]*)/);
  if (match && match[1] && match[1] !== 'demo-auth-token') {
    return decodeURIComponent(match[1]);
  }

  // 2. Try localStorage
  return localStorage.getItem('dayflow_token') || localStorage.getItem('dayflow_access_token');
}

export function setAuthToken(token: string, role?: string): void {
  if (typeof window === 'undefined') return;
  document.cookie = `token=${encodeURIComponent(token)}; path=/; max-age=604800; SameSite=Lax`;
  if (role) {
    document.cookie = `user_role=${encodeURIComponent(role)}; path=/; max-age=604800; SameSite=Lax`;
  }
  localStorage.setItem('dayflow_token', token);
}

export function clearAuthToken(): void {
  if (typeof window === 'undefined') return;
  document.cookie = 'token=; path=/; max-age=0; SameSite=Lax';
  document.cookie = 'user_role=; path=/; max-age=0; SameSite=Lax';
  localStorage.removeItem('dayflow_token');
  localStorage.removeItem('dayflow_access_token');
}

export async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const headers = new Headers(options.headers || {});

  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const url = endpoint.startsWith('http')
    ? endpoint
    : `${API_BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

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

    // Unwrap envelope: { success: true, statusCode: 200, data: T } -> return data
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
