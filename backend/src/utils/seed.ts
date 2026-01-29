import bcrypt from 'bcryptjs';
import pool from '../config/database';
import { AdminModel } from '../models/Admin';

/**
 * Seed script - Tạo tài khoản admin mặc định
 * Chạy: npm run seed
 * 
 * Tài khoản admin:
 * Email: admin@coticket.com
 * Password: Admin@123456
 */

async function seed() {
  const client = await pool.connect();

  try {
    console.log('🌱 Starting database seeding...');

    // Kiểm tra admin đã tồn tại chưa
    const existingAdmin = await AdminModel.findByEmail('admin@coticket.com');

    if (existingAdmin) {
      console.log('ℹ️  Admin account already exists. Skipping seed.');
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash('Admin@123456', 10);

    // Tạo admin
    await AdminModel.create({
      email: 'admin@coticket.com',
      password: hashedPassword,
      name: 'Administrator',
    });

    console.log('✅ Admin account created successfully!');
    console.log('');
    console.log('📧 Email: admin@coticket.com');
    console.log('🔑 Password: Admin@123456');
    console.log('');
    console.log('⚠️  IMPORTANT: Please change the password after first login!');
    console.log('');
    console.log('🎉 Seeding completed successfully!');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

// Run seed
seed().catch((err) => {
  console.error('Fatal error during seeding:', err);
  process.exit(1);
});
