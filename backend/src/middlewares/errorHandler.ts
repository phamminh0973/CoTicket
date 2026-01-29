import { Request, Response, NextFunction } from 'express';

/**
 * Global error handler middleware
 * Xử lý tất cả lỗi trong application
 */
export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error('Error:', err);

  // Lỗi validation từ Joi
  if (err.isJoi) {
    return res.status(400).json({
      success: false,
      message: 'Dữ liệu không hợp lệ',
      errors: err.details.map((detail: any) => detail.message),
    });
  }

  // Lỗi database
  if (err.code && err.code.startsWith('23')) {
    // PostgreSQL error codes
    if (err.code === '23505') {
      // Unique violation
      return res.status(409).json({
        success: false,
        message: 'Dữ liệu đã tồn tại',
        detail: err.detail,
      });
    }
  }

  // Lỗi mặc định
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Lỗi máy chủ';

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

/**
 * 404 Not Found handler
 */
export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Route không tồn tại',
    path: req.originalUrl,
  });
};
