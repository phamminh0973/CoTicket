import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler';
import { config } from './config';

// Load environment variables
dotenv.config();

/**
 * Main Express Application
 */
const app: Application = express();

/**
 * Middlewares
 */

// CORS - cho phép frontend gọi API
const allowedOrigins = [
  'http://localhost:5173', // Local dev
  'https://coticket-frontend.onrender.com', // Production
  process.env.FRONTEND_URL, // Custom domain
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Cho phép requests không có origin (mobile apps, curl, postman)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.includes(origin) || process.env.NODE_ENV === 'development') {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

// Parse JSON body
app.use(express.json());

// Parse URL-encoded body
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req, _res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

/**
 * Routes
 */
app.use('/api', routes);

// Root endpoint
app.get('/', (_req, res) => {
  res.json({
    success: true,
    message: 'CoTicket API Server',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      contact: '/api/contact',
      auth: '/api/auth',
      tickets: '/api/tickets',
    },
  });
});

/**
 * Error Handlers
 */

// 404 Not Found
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

/**
 * Start Server
 */
const PORT = config.port || 5000;
const HOST = process.env.HOST || '0.0.0.0';

app.listen(PORT, HOST, () => {
  console.log('');
  console.log('╔════════════════════════════════════════╗');
  console.log('║                                        ║');
  console.log('║        🎫 CoTicket API Server         ║');
  console.log('║                                        ║');
  console.log('╚════════════════════════════════════════╝');
  console.log('');
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`🌍 Environment: ${config.nodeEnv}`);
  console.log(`📡 API URL: http://localhost:${PORT}/api`);
  console.log(`📊 Health Check: http://localhost:${PORT}/api/health`);
  console.log('');
  console.log('📝 Available endpoints:');
  console.log('   - POST   /api/auth/login');
  console.log('   - GET    /api/auth/me');
  console.log('   - POST   /api/tickets/upload-excel');
  console.log('   - GET    /api/tickets');
  console.log('   - GET    /api/tickets/:id');
  console.log('   - PUT    /api/tickets/:id');
  console.log('   - DELETE /api/tickets/:id');
  console.log('   - POST   /api/tickets/send-email/:id');
  console.log('   - POST   /api/tickets/send-email-all');
  console.log('   - GET    /api/tickets/lookup?cccd=xxx');
  console.log('   - GET    /api/contact');
  console.log('');
  console.log('💡 Tips:');
  console.log('   - Run "npm run migrate" to create database tables');
  console.log('   - Run "npm run seed" to create admin account');
  console.log('   - Configure .env file with your database and SMTP settings');
  console.log('');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  process.exit(0);
});

export default app;
