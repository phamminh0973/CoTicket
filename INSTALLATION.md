# Hướng Dẫn Cài Đặt Chi Tiết CoTicket

## Yêu Cầu Hệ Thống

- Node.js >= 18.x
- PostgreSQL >= 13.x
- npm hoặc yarn

## Bước 1: Clone hoặc Copy Project

Đảm bảo bạn đã có toàn bộ source code trong thư mục `CoTicket/`

## Bước 2: Cài Đặt PostgreSQL

### Windows:
1. Download PostgreSQL từ: https://www.postgresql.org/download/windows/
2. Cài đặt với password mặc định hoặc tùy chỉnh
3. Nhớ lại password của user `postgres`

### Mac:
```bash
brew install postgresql
brew services start postgresql
```

### Linux (Ubuntu):
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

## Bước 3: Tạo Database

Mở PostgreSQL command line (psql):

```bash
# Windows: Tìm "SQL Shell (psql)" trong Start Menu
# Mac/Linux:
psql -U postgres
```

Trong psql, chạy:
```sql
CREATE DATABASE coticket;
\q
```

## Bước 4: Cấu Hình Backend

### 4.1 Cài đặt dependencies

```bash
cd backend
npm install
```

### 4.2 Cấu hình .env

File `.env` đã được tạo sẵn. Chỉnh sửa nếu cần:

```env
# Thay đổi password PostgreSQL nếu khác
DB_PASSWORD=postgres

# Thay đổi SMTP nếu muốn gửi email thật
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### 4.3 Tạo bảng database (Migration)

```bash
npm run migrate
```

Kết quả mong đợi:
```
✅ Table "admins" created
✅ Table "tickets" created
✅ Index on "cccd" created
✅ Index on "ticket_code" created
✅ Index on "email" created
🎉 Migration completed successfully!
```

### 4.4 Tạo tài khoản admin (Seed)

```bash
npm run seed
```

Kết quả:
```
✅ Admin account created successfully!

📧 Email: admin@coticket.com
🔑 Password: Admin@123456

⚠️  IMPORTANT: Please change the password after first login!
```

### 4.5 Chạy backend server

```bash
npm run dev
```

Server chạy tại: http://localhost:5000

## Bước 5: Cấu Hình Frontend

Mở terminal mới:

### 5.1 Cài đặt dependencies

```bash
cd frontend
npm install
```

### 5.2 Cấu hình .env (đã có sẵn)

File `.env` đã được tạo với cấu hình mặc định.

### 5.3 Chạy frontend

```bash
npm run dev
```

Frontend chạy tại: http://localhost:5173

## Bước 6: Kiểm Tra Hoạt Động

### 6.1 Test Backend API

Mở browser hoặc Postman:

```
GET http://localhost:5000/api/health
```

Kết quả:
```json
{
  "success": true,
  "message": "API is running",
  "timestamp": "..."
}
```

### 6.2 Test Frontend

1. Mở: http://localhost:5173
2. Nhấn vào link đăng nhập hoặc truy cập: http://localhost:5173/login
3. Đăng nhập với:
   - Email: `admin@coticket.com`
   - Password: `Admin@123456`

## Bước 7: Cấu Hình Gửi Email (Tùy Chọn)

Nếu muốn thử gửi email thật, cấu hình SMTP trong `backend/.env`:

### Với Gmail:

1. Bật 2-Step Verification: https://myaccount.google.com/security
2. Tạo App Password: https://myaccount.google.com/apppasswords
3. Copy App Password và dán vào `.env`:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=xxxx-xxxx-xxxx-xxxx  # App Password (16 ký tự)
EMAIL_FROM=CoTicket <your-email@gmail.com>
```

4. Restart backend server

## Bước 8: Test Upload Excel

1. Tạo file Excel mẫu (xem file `EXCEL_TEMPLATE.md`)
2. Đăng nhập vào Admin panel
3. Vào "Quản Lý Vé"
4. Nhấn "Upload Excel"
5. Chọn file và upload

## Khắc Phục Sự Cố

### Lỗi: "Cannot connect to database"
- Kiểm tra PostgreSQL đã chạy: `pg_isready`
- Kiểm tra thông tin trong `.env` đúng chưa
- Kiểm tra database đã tạo chưa: `psql -U postgres -c "\l"`

### Lỗi: "Port 5000 already in use"
- Thay đổi `PORT` trong `backend/.env` thành `5001` hoặc khác
- Update `VITE_API_URL` trong `frontend/.env` tương ứng

### Lỗi: "Token không hợp lệ"
- Clear localStorage trong browser (F12 > Application > Local Storage > Clear)
- Đăng nhập lại

### Lỗi: "Cannot send email"
- Nếu chưa cấu hình SMTP thật, đây là lỗi bình thường
- Kiểm tra SMTP credentials trong `.env`
- Với Gmail: đảm bảo dùng App Password, không phải password thường

## Production Deployment

### Backend:

1. Build TypeScript:
```bash
cd backend
npm run build
```

2. Chạy production:
```bash
npm start
```

3. Sử dụng PM2 (recommended):
```bash
npm install -g pm2
pm2 start dist/index.js --name coticket-api
```

### Frontend:

1. Build production:
```bash
cd frontend
npm run build
```

2. Deploy thư mục `dist/` lên hosting (Vercel, Netlify, etc.)

3. Hoặc serve locally:
```bash
npm install -g serve
serve -s dist -p 3000
```

## Bảo Mật

- Đổi `JWT_SECRET` trong production
- Đổi mật khẩu admin sau lần đăng nhập đầu
- Không commit file `.env` lên git
- Sử dụng HTTPS trong production
- Giới hạn CORS chỉ cho domain của bạn

## Liên Hệ Hỗ Trợ

Nếu gặp vấn đề, kiểm tra:
1. Console logs của backend
2. Browser console (F12)
3. PostgreSQL logs

Happy coding! 🎉
