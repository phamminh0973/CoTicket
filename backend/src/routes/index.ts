import { Router } from 'express';
import authRoutes from './authRoutes';
import ticketRoutes from './ticketRoutes';
import { config } from '../config';

const router = Router();

/**
 * Health check
 */
router.get('/health', (_req, res) => {
  res.json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString(),
  });
});

/**
 * Get admin contact info (cho footer)
 */
router.get('/contact', (_req, res) => {
  res.json({
    success: true,
    data: config.adminContact,
  });
});

/**
 * Auth routes
 */
router.use('/auth', authRoutes);

/**
 * Ticket routes
 */
router.use('/tickets', ticketRoutes);

export default router;
