import { Request, Response } from 'express';
import { TicketModel } from '../models/Ticket';
import { parseExcelFile } from '../services/excelService';
import { generateQRCode } from '../services/qrService';
import { sendEmail, generateTicketEmailTemplate } from '../services/emailService';
import { deleteFile } from '../middlewares/upload';

/**
 * Ticket Controller
 * Xử lý tất cả logic liên quan đến vé
 */

export const ticketController = {
  /**
   * POST /api/tickets/upload-excel
   * Upload file Excel và import vé
   */
  async uploadExcel(req: Request, res: Response) {
    let filePath = '';
    
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'Vui lòng chọn file Excel',
        });
      }

      filePath = req.file.path;

      // Parse Excel file - trả về kết quả với errors
      const parseResult = await parseExcelFile(filePath);

      if (parseResult.successRows === 0) {
        return res.status(400).json({
          success: false,
          message: 'File Excel không có dữ liệu hợp lệ',
          data: {
            totalRows: parseResult.totalRows,
            failedRows: parseResult.failedRows,
            errors: parseResult.errors,
          },
        });
      }

      // Lọc ra các ticket_code đã tồn tại
      const ticketCodes = parseResult.tickets.map(t => t.ticket_code);
      const existingTickets = await Promise.all(
        ticketCodes.map(code => TicketModel.findByTicketCode(code))
      );
      
      const duplicateCodes = new Set(
        existingTickets
          .filter(ticket => ticket !== null)
          .map(ticket => ticket!.ticket_code)
      );

      // Lọc ra các vé chưa tồn tại
      const newTickets = parseResult.tickets.filter(
        ticket => !duplicateCodes.has(ticket.ticket_code)
      );

      // Thêm duplicate vào danh sách errors
      const duplicateErrors = parseResult.tickets
        .filter(ticket => duplicateCodes.has(ticket.ticket_code))
        .map(ticket => {
          const rowIndex = parseResult.tickets.indexOf(ticket);
          return {
            row: rowIndex + 2, // +2 vì header và index 0-based
            message: `⚠️ Mã vé "${ticket.ticket_code}" đã tồn tại (bỏ qua)`,
          };
        });

      const allErrors = [...parseResult.errors, ...duplicateErrors];

      // Insert vào database (chỉ các vé mới)
      const insertedTickets = newTickets.length > 0 
        ? await TicketModel.createMany(newTickets)
        : [];

      // Xóa file sau khi xử lý xong
      deleteFile(filePath);

      res.json({
        success: true,
        message: `Import thành công ${insertedTickets.length}/${parseResult.totalRows} vé${
          allErrors.length > 0 ? `. Bỏ qua ${allErrors.length} dòng` : ''
        }`,
        data: {
          imported: insertedTickets.length,
          total: parseResult.totalRows,
          skipped: allErrors.length,
          duplicates: duplicateErrors.length,
          errors: allErrors,
          tickets: insertedTickets,
        },
      });
    } catch (error: any) {
      console.error('Upload Excel error:', error);
      
      // Xóa file nếu có lỗi
      if (filePath) {
        deleteFile(filePath);
      }

      res.status(400).json({
        success: false,
        message: error.message || 'Lỗi upload file Excel',
      });
    }
  },

  /**
   * GET /api/tickets
   * Lấy danh sách vé với phân trang
   */
  async getAll(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = (req.query.search as string) || '';

      const result = await TicketModel.findAll({ page, limit, search });

      res.json({
        success: true,
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error) {
      console.error('Get tickets error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi lấy danh sách vé',
      });
    }
  },

  /**
   * GET /api/tickets/:id
   * Lấy thông tin chi tiết vé
   */
  async getById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: 'ID không hợp lệ',
        });
      }

      const ticket = await TicketModel.findById(id);

      if (!ticket) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy vé',
        });
      }

      res.json({
        success: true,
        data: ticket,
      });
    } catch (error) {
      console.error('Get ticket error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi lấy thông tin vé',
      });
    }
  },

  /**
   * PUT /api/tickets/:id
   * Cập nhật thông tin vé
   */
  async update(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: 'ID không hợp lệ',
        });
      }

      const ticket = await TicketModel.update(id, req.body);

      if (!ticket) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy vé',
        });
      }

      res.json({
        success: true,
        message: 'Cập nhật vé thành công',
        data: ticket,
      });
    } catch (error: any) {
      console.error('Update ticket error:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Lỗi cập nhật vé',
      });
    }
  },

  /**
   * DELETE /api/tickets/:id
   * Xóa vé
   */
  async delete(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: 'ID không hợp lệ',
        });
      }

      const success = await TicketModel.delete(id);

      if (!success) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy vé',
        });
      }

      res.json({
        success: true,
        message: 'Xóa vé thành công',
      });
    } catch (error) {
      console.error('Delete ticket error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi xóa vé',
      });
    }
  },

  /**
   * POST /api/tickets/send-email/:id
   * Gửi email mã vé cho 1 người
   */
  async sendEmailSingle(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: 'ID không hợp lệ',
        });
      }

      const ticket = await TicketModel.findById(id);

      if (!ticket) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy vé',
        });
      }

      // Kiểm tra email hợp lệ
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!ticket.email || !emailRegex.test(ticket.email)) {
        await TicketModel.updateEmailStatus(id, 'failed', 'Email không hợp lệ hoặc để trống');
        return res.status(400).json({
          success: false,
          message: 'Email không hợp lệ hoặc để trống. Vui lòng cập nhật email trước khi gửi.',
        });
      }

      try {
        // Tạo QR code
        const qrCodeDataUrl = await generateQRCode(ticket.ticket_code);

        // Tạo email template
        const emailHtml = generateTicketEmailTemplate(
          ticket.name,
          ticket.ticket_code,
          qrCodeDataUrl
        );

        // Gửi email
        await sendEmail({
          to: ticket.email,
          subject: `🎫 Mã vé sự kiện - ${ticket.ticket_code}`,
          html: emailHtml,
        });

        // Cập nhật status thành công
        await TicketModel.updateEmailStatus(id, 'success');

        res.json({
          success: true,
          message: `Đã gửi email đến ${ticket.email}`,
        });
      } catch (emailError: any) {
        // Cập nhật status thất bại
        await TicketModel.updateEmailStatus(id, 'failed', emailError.message);
        
        throw emailError;
      }
    } catch (error: any) {
      console.error('Send email error:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Lỗi gửi email',
      });
    }
  },

  /**
   * POST /api/tickets/send-email-all
   * Gửi email mã vé cho tất cả
   */
  async sendEmailAll(req: Request, res: Response) {
    try {
      // Lấy tất cả vé (không phân trang)
      const result = await TicketModel.findAll({ page: 1, limit: 999999 });
      const tickets = result.data;

      if (tickets.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Không có vé nào để gửi',
        });
      }

      const successResults: Array<{ id: number; email: string }> = [];
      const failedResults: Array<{ id: number; email: string; error: string }> = [];

      // Gửi email cho từng vé và cập nhật status
      for (const ticket of tickets) {
        // Skip nếu không có email hoặc email không hợp lệ
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!ticket.email || !emailRegex.test(ticket.email)) {
          await TicketModel.updateEmailStatus(ticket.id, 'failed', 'Email không hợp lệ hoặc để trống');
          
          failedResults.push({
            id: ticket.id,
            email: ticket.email || '(trống)',
            error: 'Email không hợp lệ hoặc để trống',
          });
          continue;
        }

        try {
          // Tạo QR code
          const qrCodeDataUrl = await generateQRCode(ticket.ticket_code);

          // Tạo email template
          const emailHtml = generateTicketEmailTemplate(
            ticket.name,
            ticket.ticket_code,
            qrCodeDataUrl
          );

          // Gửi email
          await sendEmail({
            to: ticket.email,
            subject: `🎫 Mã vé sự kiện - ${ticket.ticket_code}`,
            html: emailHtml,
          });

          // Cập nhật status thành công
          await TicketModel.updateEmailStatus(ticket.id, 'success');
          
          successResults.push({
            id: ticket.id,
            email: ticket.email,
          });
        } catch (error: any) {
          console.error(`Failed to send email to ${ticket.email}:`, error);
          
          // Cập nhật status thất bại
          await TicketModel.updateEmailStatus(ticket.id, 'failed', error.message);
          
          failedResults.push({
            id: ticket.id,
            email: ticket.email,
            error: error.message,
          });
        }
      }

      res.json({
        success: true,
        message: `Đã gửi ${successResults.length}/${tickets.length} email thành công`,
        data: {
          total: tickets.length,
          success: successResults.length,
          failed: failedResults.length,
          successList: successResults,
          failedList: failedResults,
        },
      });
    } catch (error: any) {
      console.error('Send email all error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Lỗi gửi email',
      });
    }
  },

  /**
   * GET /api/tickets/lookup?cccd=xxx
   * Tra cứu vé theo CCCD (public - không cần auth)
   */
  async lookup(req: Request, res: Response) {
    try {
      const cccd = req.query.cccd as string;

      if (!cccd) {
        return res.status(400).json({
          success: false,
          message: 'Vui lòng nhập CCCD',
        });
      }

      // Normalize CCCD - bỏ số 0 ở đầu để match với DB
      const normalizedCCCD = cccd.trim().replace(/^0+/, '') || '0';
      const ticket = await TicketModel.findByCCCD(normalizedCCCD);

      if (!ticket) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy vé với CCCD này',
        });
      }

      // Tạo QR code
      const qrCodeDataUrl = await generateQRCode(ticket.ticket_code);

      res.json({
        success: true,
        data: {
          name: ticket.name,
          email: ticket.email,
          ticket_code: ticket.ticket_code,
          qr_code: qrCodeDataUrl,
        },
      });
    } catch (error) {
      console.error('Lookup ticket error:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi tra cứu vé',
      });
    }
  },
};
