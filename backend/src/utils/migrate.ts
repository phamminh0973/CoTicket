import pool from '../config/database';

/**
 * Migration script - Tạo bảng database
 * Chạy: npm run migrate
 */

async function migrate() {
  const client = await pool.connect();

  try {
    console.log('🚀 Starting database migration...');

    // Tạo bảng admins
    await client.query(`
      CREATE TABLE IF NOT EXISTS admins (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Table "admins" created');

    // Tạo bảng tickets
    await client.query(`
      CREATE TABLE IF NOT EXISTS tickets (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255),
        name VARCHAR(255) NOT NULL,
        cccd VARCHAR(50) NOT NULL,
        ticket_code VARCHAR(100) UNIQUE NOT NULL,
        email_status VARCHAR(20) DEFAULT 'pending',
        email_sent_at TIMESTAMP,
        email_error TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Table "tickets" created');

    // Thêm các cột mới nếu bảng đã tồn tại
    await client.query(`
      DO $$ 
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='tickets' AND column_name='email_status') THEN
          ALTER TABLE tickets ADD COLUMN email_status VARCHAR(20) DEFAULT 'pending';
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='tickets' AND column_name='email_sent_at') THEN
          ALTER TABLE tickets ADD COLUMN email_sent_at TIMESTAMP;
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='tickets' AND column_name='email_error') THEN
          ALTER TABLE tickets ADD COLUMN email_error TEXT;
        END IF;
      END $$;
    `);
    console.log('✅ Email tracking columns ensured');

    // Cho phép email nullable (nếu đang NOT NULL)
    await client.query(`
      ALTER TABLE tickets ALTER COLUMN email DROP NOT NULL;
    `);
    console.log('✅ Email column made nullable');

    // Tạo index cho tìm kiếm nhanh
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_tickets_cccd ON tickets(cccd);
    `);
    console.log('✅ Index on "cccd" created');

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_tickets_ticket_code ON tickets(ticket_code);
    `);
    console.log('✅ Index on "ticket_code" created');

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_tickets_email ON tickets(email);
    `);
    console.log('✅ Index on "email" created');

    console.log('🎉 Migration completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

// Run migration
migrate().catch((err) => {
  console.error('Fatal error during migration:', err);
  process.exit(1);
});
