import { Request, Response, NextFunction } from 'express';
import { env } from '../config/env';

export interface CustomError extends Error {
  statusCode?: number;
  status?: string;
  errors?: any[];
  isOperational?: boolean;
}

export const errorHandler = (
  err: CustomError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const statusCode = err.statusCode || 500;
  const status = err.status || 'error';
  const message = err.message || 'Internal Server Error';

  console.error('💥 Error caught in handler:', {
    message,
    stack: env.NODE_ENV === 'development' ? err.stack : undefined,
    errors: err.errors,
  });

  res.status(statusCode).json({
    success: false,
    status,
    message,
    ...(err.errors && { errors: err.errors }),
    ...(env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
