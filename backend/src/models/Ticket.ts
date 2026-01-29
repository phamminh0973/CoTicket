import { query } from '../config/database';

export interface Ticket {
  id: number;
  email?: string;
  name: string;
  cccd: string;
  ticket_code: string;
  email_status?: string;
  email_sent_at?: Date;
  email_error?: string;
  created_at: Date;
  updated_at: Date;
}

export interface TicketCreateDto {
  email?: string;
  name: string;
  cccd: string;
  ticket_code: string;
}

export interface TicketUpdateDto {
  email?: string;
  name?: string;
  cccd?: string;
  ticket_code?: string;
}

export interface TicketFilterDto {
  page?: number;
  limit?: number;
  search?: string;
}

export const TicketModel = {
  // Lấy tất cả vé với phân trang và tìm kiếm
  async findAll(filter: TicketFilterDto = {}) {
    const { page = 1, limit = 10, search = '' } = filter;
    const offset = (page - 1) * limit;

    // Build query với tìm kiếm
    let whereClause = '';
    const params: any[] = [];
    
    if (search) {
      whereClause = 'WHERE name ILIKE $1 OR email ILIKE $1 OR cccd ILIKE $1 OR ticket_code ILIKE $1';
      params.push(`%${search}%`);
    }

    // Count total
    const countResult = await query(
      `SELECT COUNT(*) FROM tickets ${whereClause}`,
      params.length > 0 ? params : undefined
    );
    const total = parseInt(countResult.rows[0].count);

    // Get data
    const dataParams = params.length > 0 ? [...params, limit, offset] : [limit, offset];
    const dataResult = await query(
      `SELECT * FROM tickets ${whereClause} ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
      dataParams
    );

    return {
      data: dataResult.rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  // Tìm vé theo ID
  async findById(id: number): Promise<Ticket | null> {
    const result = await query(
      'SELECT * FROM tickets WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  },

  // Tìm vé theo CCCD
  async findByCCCD(cccd: string): Promise<Ticket | null> {
    const result = await query(
      'SELECT * FROM tickets WHERE cccd = $1',
      [cccd]
    );
    return result.rows[0] || null;
  },

  // Tìm vé theo ticket code
  async findByTicketCode(ticketCode: string): Promise<Ticket | null> {
    const result = await query(
      'SELECT * FROM tickets WHERE ticket_code = $1',
      [ticketCode]
    );
    return result.rows[0] || null;
  },

  // Tạo vé mới
  async create(data: TicketCreateDto): Promise<Ticket> {
    const result = await query(
      'INSERT INTO tickets (email, name, cccd, ticket_code) VALUES ($1, $2, $3, $4) RETURNING *',
      [data.email, data.name, data.cccd, data.ticket_code]
    );
    return result.rows[0];
  },

  // Tạo nhiều vé cùng lúc (bulk insert)
  async createMany(tickets: TicketCreateDto[]): Promise<Ticket[]> {
    if (tickets.length === 0) return [];

    // Build values string: ($1, $2, $3, $4), ($5, $6, $7, $8), ...
    const values: any[] = [];
    const valueStrings: string[] = [];

    tickets.forEach((ticket, index) => {
      const offset = index * 4;
      valueStrings.push(`($${offset + 1}, $${offset + 2}, $${offset + 3}, $${offset + 4})`);
      values.push(ticket.email, ticket.name, ticket.cccd, ticket.ticket_code);
    });

    const result = await query(
      `INSERT INTO tickets (email, name, cccd, ticket_code) VALUES ${valueStrings.join(', ')} RETURNING *`,
      values
    );

    return result.rows;
  },

  // Cập nhật vé
  async update(id: number, data: TicketUpdateDto): Promise<Ticket | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (data.email !== undefined) {
      fields.push(`email = $${paramCount++}`);
      values.push(data.email);
    }
    if (data.name !== undefined) {
      fields.push(`name = $${paramCount++}`);
      values.push(data.name);
    }
    if (data.cccd !== undefined) {
      fields.push(`cccd = $${paramCount++}`);
      values.push(data.cccd);
    }
    if (data.ticket_code !== undefined) {
      fields.push(`ticket_code = $${paramCount++}`);
      values.push(data.ticket_code);
    }

    if (fields.length === 0) return null;

    fields.push(`updated_at = NOW()`);
    values.push(id);

    const result = await query(
      `UPDATE tickets SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    );

    return result.rows[0] || null;
  },

  // Xóa vé
  async delete(id: number): Promise<boolean> {
    const result = await query(
      'DELETE FROM tickets WHERE id = $1',
      [id]
    );
    return (result.rowCount || 0) > 0;
  },

  // Cập nhật trạng thái email
  async updateEmailStatus(
    id: number,
    status: 'pending' | 'success' | 'failed',
    error?: string
  ): Promise<Ticket | null> {
    const result = await query(
      `UPDATE tickets 
       SET email_status = $1::VARCHAR, 
           email_sent_at = CASE WHEN $1::VARCHAR = 'success' THEN NOW() ELSE email_sent_at END,
           email_error = $2,
           updated_at = NOW()
       WHERE id = $3 
       RETURNING *`,
      [status, error || null, id]
    );
    return result.rows[0] || null;
  },
};
