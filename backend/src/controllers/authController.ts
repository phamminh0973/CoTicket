import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AdminModel } from '../models/Admin';
import { config } from '../config';

/**
 * Auth Controller
 * Xử lý login, logout
 */

export const authController = {
  /**
   * POST /api/auth/login
   * Đăng nhập admin
   */
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      // Tìm admin theo email
      const admin = await AdminModel.findByEmail(email);

      if (!admin) {
        return res.status(401).json({
          success: false,
          message: 'Email hoặc mật khẩu không đúng',
        });
      }

      // Kiểm tra password
      const isPasswordValid = await bcrypt.compare(password, admin.password);

      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Email hoặc mật khẩu không đúng',
        });
      }

      // Tạo JWT token
      const token = jwt.sign(
        { userId: admin.id, email: admin.email },
        config.jwt.secret,
        { expiresIn: config.jwt.expiresIn } as jwt.SignOptions
      );

      // Trả về thông tin admin (không bao gồm password)
      res.json({
        success: true,
        message: 'Đăng nhập thành công',
        data: {
          token,
          admin: {
            id: admin.id,
            email: admin.email,
            name: admin.name,
          },
        },
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi đăng nhập',
      });
    }
  },

  /**
   * GET /api/auth/me
   * Lấy thông tin admin hiện tại
   */
  async getMe(req: any, res: Response) {
    try {
      const userId = req.userId; // Từ auth middleware

      const admin = await AdminModel.findById(userId);

      if (!admin) {
        return res.status(404).json({
          success: false,
          message: 'Admin không tồn tại',
        });
      }

      res.json({
        success: true,
        data: {
          id: admin.id,
          email: admin.email,
          name: admin.name,
        },
      });
    } catch (error) {
      console.error('Get me error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi lấy thông tin',
      });
    }
  },
};
