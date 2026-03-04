export interface Post {
  id: number;
  title: string;
  content: string;
  slug: string;
  created_at: Date;
  updated_at: Date;
}

export interface CreatePostDTO {
  title: string;
  content: string;
  slug: string;
}

export interface UpdatePostDTO {
  title?: string;
  content?: string;
  slug?: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginationQuery {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  message?: string;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;
