import api from './api';

export interface Ticket {
  id: number;
  email: string;
  name: string;
  cccd: string;
  ticket_code: string;
  email_status?: string;
  email_sent_at?: string;
  email_error?: string;
  created_at: string;
  updated_at: string;
}

export interface TicketUpdateDto {
  email?: string;
  name?: string;
  cccd?: string;
  ticket_code?: string;
}

export interface TicketListResponse {
  success: boolean;
  data: Ticket[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface TicketLookupResponse {
  success: boolean;
  data: {
    name: string;
    email: string;
    ticket_code: string;
    qr_code: string;
  };
}

export const ticketService = {
  /**
   * Upload file Excel
   */
  async uploadExcel(file: File): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/tickets/upload-excel', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * Lấy danh sách vé
   */
  async getAll(params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<TicketListResponse> {
    const response = await api.get('/tickets', { params });
    return response.data;
  },

  /**
   * Lấy thông tin vé theo ID
   */
  async getById(id: number): Promise<{ success: boolean; data: Ticket }> {
    const response = await api.get(`/tickets/${id}`);
    return response.data;
  },

  /**
   * Cập nhật vé
   */
  async update(id: number, data: TicketUpdateDto): Promise<any> {
    const response = await api.put(`/tickets/${id}`, data);
    return response.data;
  },

  /**
   * Xóa vé
   */
  async delete(id: number): Promise<any> {
    const response = await api.delete(`/tickets/${id}`);
    return response.data;
  },

  /**
   * Gửi email cho 1 người
   */
  async sendEmailSingle(id: number): Promise<any> {
    const response = await api.post(`/tickets/send-email/${id}`);
    return response.data;
  },

  /**
   * Gửi email cho tất cả
   */
  async sendEmailAll(): Promise<any> {
    const response = await api.post('/tickets/send-email-all');
    return response.data;
  },

  /**
   * Tra cứu vé theo CCCD (public)
   */
  async lookup(cccd: string): Promise<TicketLookupResponse> {
    const response = await api.get('/tickets/lookup', {
      params: { cccd },
    });
    return response.data;
  },
};
