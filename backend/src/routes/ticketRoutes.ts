import { Router } from 'express';
import { ticketController } from '../controllers/ticketController';
import { authenticateToken } from '../middlewares/auth';
import { upload } from '../middlewares/upload';
import { validate, ticketSchemas } from '../middlewares/validation';

const router = Router();

/**
 * PUBLIC ROUTES (không cần auth)
 */

/**
 * GET /api/tickets/lookup?cccd=xxx
 * Tra cứu vé theo CCCD
 */
router.get('/lookup', ticketController.lookup);

/**
 * PROTECTED ROUTES (cần auth)
 */

/**
 * POST /api/tickets/upload-excel
 * Upload file Excel và import vé
 */
router.post(
  '/upload-excel',
  authenticateToken,
  upload.single('file'),
  ticketController.uploadExcel
);

/**
 * GET /api/tickets
 * Lấy danh sách vé với phân trang
 */
router.get('/', authenticateToken, ticketController.getAll);

/**
 * GET /api/tickets/:id
 * Lấy thông tin chi tiết vé
 */
router.get('/:id', authenticateToken, ticketController.getById);

/**
 * PUT /api/tickets/:id
 * Cập nhật thông tin vé
 */
router.put(
  '/:id',
  authenticateToken,
  validate(ticketSchemas.update),
  ticketController.update
);

/**
 * DELETE /api/tickets/:id
 * Xóa vé
 */
router.delete('/:id', authenticateToken, ticketController.delete);

/**
 * POST /api/tickets/send-email/:id
 * Gửi email mã vé cho 1 người
 */
router.post('/send-email/:id', authenticateToken, ticketController.sendEmailSingle);

/**
 * POST /api/tickets/send-email-all
 * Gửi email mã vé cho tất cả
 */
router.post('/send-email-all', authenticateToken, ticketController.sendEmailAll);

export default router;
