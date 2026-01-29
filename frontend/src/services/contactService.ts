import api from './api';

export interface ContactInfo {
  phone: string;
  email: string;
  facebook: string;
}

export const contactService = {
  /**
   * Lấy thông tin liên hệ admin (cho footer)
   */
  async getContactInfo(): Promise<{ success: boolean; data: ContactInfo }> {
    const response = await api.get('/contact');
    return response.data;
  },
};
