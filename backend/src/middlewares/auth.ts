import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';

// Extend Express Request type để thêm userId
export interface AuthRequest extends Request {
  userId?: number;
}

/**
 * Middleware xác thực JWT token
 * Sử dụng cho các route admin
 */
export const authenticateToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Lấy token từ header Authorization
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer TOKEN"

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token không được cung cấp',
      });
    }

    // Verify token
    jwt.verify(token, config.jwt.secret, (err: any, decoded: any) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          res.status(401).json({
            success: false,
            message: 'Token đã hết hạn',
          });
          return;
        }
        res.status(403).json({
          success: false,
          message: 'Token không hợp lệ',
        });
        return;
      }

      // Lưu userId vào request để sử dụng ở các handler
      req.userId = decoded.userId;
      next();
    });
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi xác thực',
    });
  }
};
