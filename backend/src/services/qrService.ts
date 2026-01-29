import QRCode from 'qrcode';

/**
 * QR Code Service
 * Tạo mã QR code từ text
 */

export interface QRCodeOptions {
  width?: number;
  margin?: number;
  color?: {
    dark?: string;
    light?: string;
  };
}

/**
 * Tạo QR code dạng Data URL (base64)
 * Trả về string có thể embed trực tiếp vào <img src="...">
 */
export const generateQRCode = async (
  text: string,
  options: QRCodeOptions = {}
): Promise<string> => {
  try {
    const defaultOptions = {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
      ...options,
    };

    const qrCodeDataUrl = await QRCode.toDataURL(text, defaultOptions);
    return qrCodeDataUrl;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw new Error('Không thể tạo mã QR');
  }
};

/**
 * Tạo QR code dạng Buffer (để lưu file hoặc gửi API)
 */
export const generateQRCodeBuffer = async (
  text: string,
  options: QRCodeOptions = {}
): Promise<Buffer> => {
  try {
    const defaultOptions = {
      width: 300,
      margin: 2,
      ...options,
    };

    const buffer = await QRCode.toBuffer(text, defaultOptions);
    return buffer;
  } catch (error) {
    console.error('Error generating QR code buffer:', error);
    throw new Error('Không thể tạo mã QR');
  }
};
