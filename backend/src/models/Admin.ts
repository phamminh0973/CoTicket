import { query } from '../config/database';

export interface Admin {
  id: number;
  email: string;
  password: string;
  name: string;
  created_at: Date;
}

export interface AdminCreateDto {
  email: string;
  password: string;
  name: string;
}

export const AdminModel = {
  // Tìm admin theo email
  async findByEmail(email: string): Promise<Admin | null> {
    const result = await query(
      'SELECT * FROM admins WHERE email = $1',
      [email]
    );
    return result.rows[0] || null;
  },

  // Tìm admin theo ID
  async findById(id: number): Promise<Admin | null> {
    const result = await query(
      'SELECT * FROM admins WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  },

  // Tạo admin mới
  async create(data: AdminCreateDto): Promise<Admin> {
    const result = await query(
      'INSERT INTO admins (email, password, name) VALUES ($1, $2, $3) RETURNING *',
      [data.email, data.password, data.name]
    );
    return result.rows[0];
  },
};
