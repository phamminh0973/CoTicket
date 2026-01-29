import xlsx from 'xlsx';
import { TicketCreateDto } from '../models/Ticket';

/**
 * Excel Service
 * Đọc và parse file Excel
 */

/**
 * Normalize CCCD - bỏ số 0 ở đầu
 * Excel tự động bỏ số 0 đầu, nên normalize để tránh mismatch
 */
const normalizeCCCD = (cccd: string): string => {
  return cccd.replace(/^0+/, '') || '0'; // Giữ ít nhất 1 số nếu toàn bộ là 0
};

export interface ExcelRowData {
  email: string;
  name: string;
  cccd: string;
  ticketCode: string;
}

export interface ParseExcelResult {
  tickets: TicketCreateDto[];
  errors: { row: number; message: string }[];
  totalRows: number;
  successRows: number;
  failedRows: number;
}

/**
 * Parse file Excel thành array tickets
 * Expected columns: email, name, cccd, ticketCode
 * Skip các dòng lỗi, không throw error
 */
export const parseExcelFile = async (
  filePath: string
): Promise<ParseExcelResult> => {
  try {
    // Đọc file Excel
    const workbook = xlsx.readFile(filePath);
    
    // Lấy sheet đầu tiên
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // Convert sang JSON
    const rawData: any[] = xlsx.utils.sheet_to_json(worksheet);

    if (rawData.length === 0) {
      throw new Error('File Excel không có dữ liệu');
    }

    // Map và validate data
    const tickets: TicketCreateDto[] = [];
    const errors: { row: number; message: string }[] = [];

    rawData.forEach((row, index) => {
      const rowNumber = index + 2; // +2 vì row 1 là header, index bắt đầu từ 0
      const rowErrors: string[] = [];
      const rowWarnings: string[] = [];

      // Validate required fields
      const email = row.email?.toString().trim() || '';
      const name = row.name?.toString().trim() || '';
      const cccd = row.cccd?.toString().trim() || '';
      const ticketCode = row.ticketCode?.toString().trim() || '';

      // Kiểm tra email (warning nếu trống, không block import)
      if (!email) {
        rowWarnings.push('Email trống (không thể gửi email)');
      } else {
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          rowWarnings.push('Email không đúng định dạng');
        }
      }

      // Kiểm tra các field bắt buộc (chặn import nếu thiếu)
      if (!name) {
        rowErrors.push('Tên không được để trống');
      }

      if (!cccd) {
        rowErrors.push('CCCD không được để trống');
      } else if (cccd.length < 9 || cccd.length > 12) {
        rowErrors.push('CCCD phải có từ 9-12 ký tự');
      }

      if (!ticketCode) {
        rowErrors.push('Mã vé không được để trống');
      }

      // Nếu có lỗi nghiêm trọng, skip dòng này
      if (rowErrors.length > 0) {
        errors.push({
          row: rowNumber,
          message: rowErrors.join(', '),
        });
      } else {
        // Không có lỗi nghiêm trọng, import (kể cả email trống)
        tickets.push({
          email: email || '', // Cho phép email trống
          name,
          cccd: normalizeCCCD(cccd), // Normalize CCCD để bỏ số 0 đầu
          ticket_code: ticketCode,
        });
        
        // Ghi warning nếu có
        if (rowWarnings.length > 0) {
          errors.push({
            row: rowNumber,
            message: `⚠️ ${rowWarnings.join(', ')}`,
          });
        }
      }
    });

    return {
      tickets,
      errors,
      totalRows: rawData.length,
      successRows: tickets.length,
      failedRows: errors.length,
    };
  } catch (error: any) {
    console.error('Error parsing Excel file:', error);
    if (error.message.includes('lỗi trong file Excel')) {
      throw error;
    }
    throw new Error('Không thể đọc file Excel. Vui lòng kiểm tra định dạng file.');
  }
};

/**
 * Validate Excel file structure
 * Kiểm tra file có đúng format không
 */
export const validateExcelStructure = (filePath: string): boolean => {
  try {
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data: any[] = xlsx.utils.sheet_to_json(worksheet);

    if (data.length === 0) return false;

    // Kiểm tra các cột bắt buộc
    const firstRow = data[0];
    const requiredColumns = ['email', 'name', 'cccd', 'ticketCode'];
    
    return requiredColumns.every((col) => col in firstRow);
  } catch (error) {
    return false;
  }
};
