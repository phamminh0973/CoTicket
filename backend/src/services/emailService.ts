import * as brevo from '@getbrevo/brevo';
import { config } from '../config';

/**
 * Email Service
 * Sử dụng Brevo API (HTTPS) thay vì SMTP để tránh bị block trên Render free tier
 */

// Initialize Brevo API client
const apiInstance = new brevo.TransactionalEmailsApi();
apiInstance.setApiKey(brevo.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY || '');

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

/**
 * Gửi email qua Brevo API
 */
export const sendEmail = async (options: SendEmailOptions): Promise<void> => {
  try {
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(options.to)) {
      throw new Error('Email không đúng định dạng');
    }

    if (!options.to.trim()) {
      throw new Error('Email không được để trống');
    }

    // Gửi email qua Brevo API
    const sendSmtpEmail = new brevo.SendSmtpEmail();
    sendSmtpEmail.sender = { email: config.email.from.split('<')[1]?.replace('>', '').trim() || config.email.user };
    sendSmtpEmail.to = [{ email: options.to }];
    sendSmtpEmail.subject = options.subject;
    sendSmtpEmail.htmlContent = options.html;
    if (options.text) {
      sendSmtpEmail.textContent = options.text;
    }

    const result = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log('✅ Email sent via Brevo API:', result.body.messageId);
  } catch (error: any) {
    console.error('Error sending email via Brevo API:', error);
    
    // Xử lý lỗi Brevo API
    if (error.response) {
      const errorBody = error.response.body || error.response.text;
      throw new Error(`Lỗi gửi email: ${errorBody}`);
    }
    
    throw new Error(error.message || 'Lỗi gửi email');
  }
};

/**
 * Template email chứa mã vé và QR code
 */
export const generateTicketEmailTemplate = (
  name: string,
  ticketCode: string,
  qrCodeDataUrl: string
): string => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .container {
          background-color: #f9f9f9;
          border-radius: 10px;
          padding: 30px;
          border: 2px solid #ff69b4;
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
        }
        .header h1 {
          color: #ff69b4;
          margin: 0;
        }
        .ticket-info {
          background-color: white;
          padding: 20px;
          border-radius: 8px;
          margin: 20px 0;
        }
        .ticket-code {
          font-size: 24px;
          font-weight: bold;
          color: #ff69b4;
          text-align: center;
          padding: 15px;
          background-color: #fff0f6;
          border-radius: 5px;
          margin: 20px 0;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #ddd;
          font-size: 14px;
          color: #666;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎫 Tổ Cò FC Phương Mỹ Chi</h1>
        </div>

        <div class="ticket-info">
          <p>Xin chào <strong>${name}</strong>,</p>
          <p>Chúc mừng bạn đã may mắn trúng vé Fanzone, Tổ Cò FC Phương Mỹ Chi xin gửi bạn thông tin vé:</p>

          <div class="ticket-code">
            ${ticketCode}
          </div>

          <p style="text-align: center; margin-top: 30px;">
            Chúc bạn tham gia sự kiện vui vẻ và hãy luôn ủng hộ Phương Mỹ Chi nhé!
          </p>
        </div>

        <div class="footer">
          <p>Mọi thắc mắc vui lòng liên hệ Fanpage Tổ Cò FC Phương Mỹ Chi</p>
          <p>© ${new Date().getFullYear()} Tổ Cò FC Phương Mỹ Chi. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};
