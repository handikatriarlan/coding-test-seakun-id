import { Response } from 'express';
import { ApiSuccessResponse, ApiErrorResponse, PaginationMeta } from '../types/index.js';

export const sendSuccess = <T>(
  res: Response,
  data: T,
  message?: string,
  statusCode: number = 200
): Response => {
  const response: ApiSuccessResponse<T> = {
    success: true,
    data,
  };
  if (message) {
    response.message = message;
  }
  return res.status(statusCode).json(response);
};

export const sendPaginatedSuccess = <T>(
  res: Response,
  data: T[],
  pagination: PaginationMeta,
  statusCode: number = 200
): Response => {
  return res.status(statusCode).json({
    success: true,
    data,
    pagination,
  });
};

export const sendError = (
  res: Response,
  statusCode: number,
  message: string,
  code: string = 'ERROR',
  details?: unknown
): Response => {
  const errorObj: { code: string; message: string; details?: unknown } = {
    code,
    message,
  };
  if (details !== undefined) {
    errorObj.details = details;
  }
  const response: ApiErrorResponse = {
    success: false,
    error: errorObj,
  };
  return res.status(statusCode).json(response);
};

export const calculatePagination = (
  page: number,
  limit: number,
  totalItems: number
): PaginationMeta => {
  const totalPages = Math.ceil(totalItems / limit);
  return {
    page,
    limit,
    totalItems,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
};
