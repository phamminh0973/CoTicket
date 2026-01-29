import api from './api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface Admin {
  id: number;
  email: string;
  name: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    admin: Admin;
  };
}

export const authService = {
  /**
   * Đăng nhập admin
   */
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  /**
   * Lấy thông tin admin hiện tại
   */
  async getMe(): Promise<{ success: boolean; data: Admin }> {
    const response = await api.get('/auth/me');
    return response.data;
  },

  /**
   * Lưu token và admin info vào localStorage
   */
  saveAuth(token: string, admin: Admin): void {
    localStorage.setItem('token', token);
    localStorage.setItem('admin', JSON.stringify(admin));
  },

  /**
   * Xóa thông tin auth
   */
  clearAuth(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('admin');
  },

  /**
   * Kiểm tra có đăng nhập hay không
   */
  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  },

  /**
   * Lấy admin info từ localStorage
   */
  getAdminInfo(): Admin | null {
    const adminStr = localStorage.getItem('admin');
    if (adminStr) {
      try {
        return JSON.parse(adminStr);
      } catch {
        return null;
      }
    }
    return null;
  },
};
