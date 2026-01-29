# Cấu Trúc Project CoTicket

```
CoTicket/
├── README.md                          # Tài liệu chính
├── INSTALLATION.md                    # Hướng dẫn cài đặt chi tiết
├── EXCEL_TEMPLATE.md                  # Mẫu file Excel
│
├── backend/                           # Backend API (Node.js + Express + TypeScript)
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.ts           # Kết nối PostgreSQL
│   │   │   └── index.ts              # Config tổng hợp
│   │   │
│   │   ├── models/
│   │   │   ├── Admin.ts              # Model Admin
│   │   │   └── Ticket.ts             # Model Ticket
│   │   │
│   │   ├── controllers/
│   │   │   ├── authController.ts     # Logic xác thực
│   │   │   └── ticketController.ts   # Logic quản lý vé
│   │   │
│   │   ├── routes/
│   │   │   ├── authRoutes.ts         # Routes auth
│   │   │   ├── ticketRoutes.ts       # Routes tickets
│   │   │   └── index.ts              # Routes tổng hợp
│   │   │
│   │   ├── middlewares/
│   │   │   ├── auth.ts               # JWT authentication
│   │   │   ├── errorHandler.ts       # Xử lý lỗi
│   │   │   ├── validation.ts         # Validate input
│   │   │   └── upload.ts             # Upload file Excel
│   │   │
│   │   ├── services/
│   │   │   ├── emailService.ts       # Gửi email (Nodemailer)
│   │   │   ├── qrService.ts          # Tạo QR code
│   │   │   └── excelService.ts       # Parse Excel
│   │   │
│   │   ├── utils/
│   │   │   ├── migrate.ts            # Tạo bảng database
│   │   │   └── seed.ts               # Seed admin account
│   │   │
│   │   └── index.ts                  # Main server file
│   │
│   ├── uploads/                       # Thư mục upload (tạo tự động)
│   │   └── .gitkeep
│   │
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env                          # Config môi trường (đã tạo)
│   ├── .env.example                  # Mẫu config
│   └── .gitignore
│
└── frontend/                          # Frontend (React + Vite + TypeScript + Ant Design)
    ├── src/
    │   ├── components/
    │   │   ├── AdminLayout.tsx        # Layout admin
    │   │   ├── PrivateRoute.tsx       # Protected route
    │   │   └── Footer.tsx             # Footer công khai
    │   │
    │   ├── pages/
    │   │   ├── LoginPage.tsx          # Trang đăng nhập
    │   │   ├── DashboardPage.tsx      # Dashboard admin
    │   │   ├── TicketManagementPage.tsx  # Quản lý vé
    │   │   └── TicketLookupPage.tsx   # Tra cứu vé công khai
    │   │
    │   ├── services/
    │   │   ├── api.ts                 # Axios config
    │   │   ├── authService.ts         # Auth API calls
    │   │   ├── ticketService.ts       # Ticket API calls
    │   │   └── contactService.ts      # Contact API calls
    │   │
    │   ├── hooks/
    │   │   └── useAuth.tsx            # Auth hook với Context
    │   │
    │   ├── main.tsx                   # Entry point
    │   ├── App.tsx                    # Root component + routing
    │   └── index.css                  # Global styles
    │
    ├── index.html
    ├── vite.config.ts
    ├── package.json
    ├── tsconfig.json
    ├── tsconfig.node.json
    ├── .env                           # Config (đã tạo)
    ├── .env.example                   # Mẫu config
    └── .gitignore
```

## Tính Năng Đã Implement

### ✅ Backend Features

1. **Authentication & Authorization**
   - JWT-based authentication
   - Admin login/logout
   - Protected routes with middleware

2. **Ticket Management**
   - Upload Excel (.xlsx)
   - CRUD operations (Create, Read, Update, Delete)
   - Pagination và tìm kiếm
   - Bulk insert từ Excel

3. **Email Service**
   - Gửi email đơn lẻ
   - Gửi email hàng loạt
   - HTML email template với QR code
   - Error handling cho từng trường hợp

4. **QR Code Generation**
   - Tạo QR code từ mã vé
   - Data URL format (base64)
   - Embedded trong email

5. **Excel Processing**
   - Parse file .xlsx
   - Validation dữ liệu
   - Bulk import tickets

6. **Database**
   - PostgreSQL với connection pooling
   - Migration scripts
   - Seed admin account
   - Indexes cho performance

### ✅ Frontend Features

1. **Public Pages**
   - Trang tra cứu vé theo CCCD
   - Hiển thị QR code
   - Download QR code
   - Footer với thông tin liên hệ

2. **Admin Panel**
   - Login page
   - Dashboard
   - Quản lý vé với bảng
   - Upload Excel
   - Chỉnh sửa thông tin vé
   - Xóa vé
   - Gửi email (đơn lẻ/tất cả)
   - Tìm kiếm và phân trang

3. **UI/UX**
   - Ant Design components
   - Responsive design
   - Loading states
   - Error handling
   - Success/Error messages

4. **Security**
   - Protected routes
   - Token management
   - Auto-redirect on token expiry
   - Form validation

## API Endpoints

### Public
- `GET /api/health` - Health check
- `GET /api/contact` - Lấy thông tin liên hệ
- `GET /api/tickets/lookup?cccd=xxx` - Tra cứu vé

### Admin (Require JWT)
- `POST /api/auth/login` - Đăng nhập
- `GET /api/auth/me` - Thông tin admin
- `POST /api/tickets/upload-excel` - Upload Excel
- `GET /api/tickets` - Danh sách vé
- `GET /api/tickets/:id` - Chi tiết vé
- `PUT /api/tickets/:id` - Cập nhật vé
- `DELETE /api/tickets/:id` - Xóa vé
- `POST /api/tickets/send-email/:id` - Gửi email đơn
- `POST /api/tickets/send-email-all` - Gửi email tất cả

## Database Schema

### Table: admins
```sql
id          SERIAL PRIMARY KEY
email       VARCHAR(255) UNIQUE NOT NULL
password    VARCHAR(255) NOT NULL
name        VARCHAR(255) NOT NULL
created_at  TIMESTAMP DEFAULT NOW()
```

### Table: tickets
```sql
id          SERIAL PRIMARY KEY
email       VARCHAR(255) NOT NULL
name        VARCHAR(255) NOT NULL
cccd        VARCHAR(50) NOT NULL
ticket_code VARCHAR(100) UNIQUE NOT NULL
created_at  TIMESTAMP DEFAULT NOW()
updated_at  TIMESTAMP DEFAULT NOW()

-- Indexes
idx_tickets_cccd
idx_tickets_ticket_code
idx_tickets_email
```

## Tech Stack Summary

### Backend
- ✅ Node.js + Express
- ✅ TypeScript (strict mode)
- ✅ PostgreSQL
- ✅ JWT Authentication
- ✅ Multer (file upload)
- ✅ xlsx (Excel processing)
- ✅ Nodemailer (SMTP email)
- ✅ qrcode (QR generation)
- ✅ Joi (validation)
- ✅ bcryptjs (password hashing)

### Frontend
- ✅ React 18
- ✅ TypeScript
- ✅ Vite
- ✅ Ant Design
- ✅ Axios
- ✅ React Router DOM

## Default Admin Account

```
Email: admin@coticket.com
Password: Admin@123456
```

## Scripts

### Backend
```bash
npm run dev      # Development mode
npm run build    # Build TypeScript
npm start        # Production mode
npm run migrate  # Create database tables
npm run seed     # Create admin account
```

### Frontend
```bash
npm run dev      # Development mode
npm run build    # Build for production
npm run preview  # Preview production build
```

## Ports

- Backend API: `http://localhost:5000`
- Frontend: `http://localhost:5173`

## Production Ready ✅

- TypeScript strict mode enabled
- Complete error handling
- Validation for all inputs
- Security best practices
- No TODOs left
- Fully documented
- Ready to deploy

---

**Status**: ✅ COMPLETE - Production Ready
**Last Updated**: January 30, 2026
