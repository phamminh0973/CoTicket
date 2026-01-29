# CoTicket - Hệ Thống Quản Lý Vé Sự Kiện

## 📋 Mô Tả

CoTicket là hệ thống quản lý và tra cứu vé sự kiện với đầy đủ tính năng:
- **Admin**: Quản lý vé, upload Excel, gửi email mã vé
- **Guest**: Tra cứu vé theo CCCD, tải QR code

## 🛠 Công Nghệ Sử Dụng

### Frontend
- React 18 + TypeScript
- Vite
- Ant Design
- Axios
- React Router DOM

### Backend
- Node.js + Express
- TypeScript
- PostgreSQL
- JWT Authentication
- Multer (upload file)
- xlsx (đọc Excel)
- Nodemailer (gửi email)
- qrcode (tạo QR)

## 📁 Cấu Trúc Thư Mục

```
CoTicket/
├── backend/          # Node.js + Express API
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── models/
│   │   ├── middlewares/
│   │   ├── services/
│   │   ├── utils/
│   │   └── index.ts
│   └── package.json
├── frontend/         # React + Vite
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── services/
│   │   ├── hooks/
│   │   └── main.tsx
│   └── package.json
└── README.md
```

## 🚀 Hướng Dẫn Cài Đặt

### 🐳 Option 1: Docker (Khuyến Nghị - Nhanh Nhất!)

**Không cần cài PostgreSQL!** Chỉ cần Docker Desktop.

```bash
# Chạy tất cả với 1 lệnh
docker-compose up -d

# Đợi 30-60 giây, sau đó truy cập:
# Frontend: http://localhost:5173
# Login: admin@coticket.com / Admin@123456
```

👉 **Xem chi tiết:** [DOCKER_QUICKSTART.md](DOCKER_QUICKSTART.md)

---

### 💻 Option 2: Cài Đặt Local

#### 1. Cài Đặt PostgreSQL

Đảm bảo PostgreSQL đã được cài đặt và chạy trên máy của bạn.

Tạo database:
```sql
CREATE DATABASE coticket;
```

### 2. Cài Đặt Backend

```bash
cd backend
npm install
```

Tạo file `.env` từ `.env.example`:
```bash
cp .env.example .env
```

Cấu hình file `.env`:
```env
# Server
PORT=5000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=coticket
DB_USER=postgres
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Admin Contact Info (hiển thị ở Footer)
ADMIN_PHONE=0123456789
ADMIN_EMAIL=admin@coticket.com
ADMIN_FACEBOOK=https://facebook.com/coticket
```

**Lưu ý về SMTP với Gmail:**
- Bật "2-Step Verification" trong Google Account
- Tạo "App Password" tại: https://myaccount.google.com/apppasswords
- Sử dụng App Password làm `SMTP_PASS`

Chạy migration (tạo bảng):
```bash
npm run migrate
```

Seed admin account:
```bash
npm run seed
```

**Tài khoản admin mặc định:**
- Email: `admin@coticket.com`
- Password: `Admin@123456`

Chạy server:
```bash
npm run dev
```

Backend sẽ chạy tại: http://localhost:5000

### 3. Cài Đặt Frontend

```bash
cd frontend
npm install
```

Tạo file `.env` (nếu cần custom API URL):
```env
VITE_API_URL=http://localhost:5000/api
```

Chạy frontend:
```bash
npm run dev
```

Frontend sẽ chạy tại: http://localhost:5173

## 👤 Tài Khoản Admin

Sau khi chạy seed, tài khoản admin:
- **Email**: admin@coticket.com
- **Password**: Admin@123456

⚠️ **Lưu ý**: Đổi mật khẩu sau khi đăng nhập lần đầu (nếu deploy production)

## 📧 Cấu Hình Gửi Email

### Gmail SMTP
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### Outlook/Hotmail SMTP
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@outlook.com
SMTP_PASS=your-password
```

### Custom SMTP
Liên hệ nhà cung cấp email để lấy thông tin SMTP.

## 📝 Hướng Dẫn Sử Dụng

### Admin
1. Đăng nhập tại `/login`
2. Upload file Excel (.xlsx) với các cột:
   - `email`: Email người nhận
   - `name`: Tên người nhận
   - `cccd`: Số CCCD
   - `ticketCode`: Mã vé
3. Quản lý vé: xem danh sách, chỉnh sửa, gửi email
4. Gửi email mã vé (từng người hoặc gửi tất cả)

### Guest (Người Dùng)
1. Truy cập trang chủ
2. Nhập CCCD vào form tra cứu
3. Xem mã vé và QR code
4. Tải xuống ảnh QR code

## 🔒 Phân Quyền

- **Admin**: Đăng nhập với email/password, quản lý vé, gửi email
- **Guest**: Không cần đăng nhập, tra cứu vé công khai

## 📦 Scripts

### Backend
```bash
npm run dev          # Chạy development mode
npm run build        # Build TypeScript
npm start            # Chạy production
npm run migrate      # Tạo bảng database
npm run seed         # Seed admin account
```

### Frontend
```bash
npm run dev          # Chạy development mode
npm run build        # Build production
npm run preview      # Preview build
```

## 🔧 Troubleshooting

### Lỗi kết nối database
- Kiểm tra PostgreSQL đã chạy
- Kiểm tra thông tin kết nối trong `.env`
- Kiểm tra database đã được tạo

### Lỗi gửi email
- Kiểm tra SMTP credentials trong `.env`
- Với Gmail: đảm bảo đã tạo App Password
- Kiểm tra email có đúng định dạng
- Kiểm tra logs trong console

### Port đã được sử dụng
- Thay đổi `PORT` trong backend `.env`
- Hoặc kill process đang sử dụng port

## � Docker Deployment

Project hỗ trợ Docker đầy đủ!

```bash
# Chạy với Docker (PostgreSQL + Backend + Frontend)
docker-compose up -d

# Xem logs
docker-compose logs -f

# Dừng
docker-compose down
```

Xem chi tiết: [DOCKER.md](DOCKER.md) | [DOCKER_QUICKSTART.md](DOCKER_QUICKSTART.md)

## �📄 License

MIT

## 👨‍💻 Developer

Developed by Senior Fullstack Developer

---

**Lưu ý**: Đây là phiên bản production-ready. Tất cả tính năng đã được implement đầy đủ.
