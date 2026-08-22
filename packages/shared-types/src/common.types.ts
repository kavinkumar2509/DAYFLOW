export interface ApiResponse<T = any> {
  success: boolean;
  statusCode: number;
  message?: string;
  data?: T;
  errors?: any;
  timestamp: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
