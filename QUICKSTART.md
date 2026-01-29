# 🚀 Quick Start Guide - CoTicket

Hướng dẫn nhanh để chạy project trong 5 phút!

## ⚡ Bước 1: Cài Đặt PostgreSQL (nếu chưa có)

### Windows
Download và cài đặt: https://www.postgresql.org/download/windows/

### Mac
```bash
brew install postgresql
brew services start postgresql
```

### Linux
```bash
sudo apt install postgresql
sudo systemctl start postgresql
```

## ⚡ Bước 2: Tạo Database

```bash
# Windows: Mở "SQL Shell (psql)" từ Start Menu
# Mac/Linux: Mở terminal
psql -U postgres

# Trong psql:
CREATE DATABASE coticket;
\q
```

## ⚡ Bước 3: Setup Backend

```bash
cd backend
npm install
npm run migrate
npm run seed
npm run dev
```

**Kết quả:** Backend chạy tại http://localhost:5000

## ⚡ Bước 4: Setup Frontend

Mở terminal mới:

```bash
cd frontend
npm install
npm run dev
```

**Kết quả:** Frontend chạy tại http://localhost:5173

## ⚡ Bước 5: Đăng Nhập

1. Mở trình duyệt: http://localhost:5173
2. Nhấn "Đăng nhập" hoặc truy cập: http://localhost:5173/login
3. Đăng nhập với:
   - **Email:** `admin@coticket.com`
   - **Password:** `Admin@123456`

## 🎉 Xong!

Bạn đã có:
- ✅ Backend API chạy tại http://localhost:5000
- ✅ Frontend chạy tại http://localhost:5173
- ✅ Tài khoản admin: admin@coticket.com / Admin@123456
- ✅ Database đã được tạo và khởi tạo

## 📝 Bước Tiếp Theo

1. **Upload Excel:**
   - Vào "Quản Lý Vé" trong Admin Panel
   - Nhấn "Upload Excel"
   - Chọn file .xlsx (xem `EXCEL_TEMPLATE.md` để biết cấu trúc)

2. **Tra Cứu Vé (Public):**
   - Vào trang chủ: http://localhost:5173
   - Nhập CCCD để tra cứu

3. **Gửi Email (Tùy chọn):**
   - Cấu hình SMTP trong `backend/.env` (xem `INSTALLATION.md`)
   - Restart backend server
   - Test gửi email trong Admin Panel

## ❗ Lỗi Thường Gặp

### "Cannot connect to database"
- Kiểm tra PostgreSQL đã chạy chưa
- Kiểm tra password trong `backend/.env` (mặc định: `postgres`)

### "Port already in use"
- Backend: Đổi `PORT` trong `backend/.env`
- Frontend: Đổi port trong `vite.config.ts`

### "Email không gửi được"
- Đây là bình thường nếu chưa cấu hình SMTP
- Xem `INSTALLATION.md` để cấu hình Gmail SMTP

## 📚 Tài Liệu

- `README.md` - Tổng quan project
- `INSTALLATION.md` - Hướng dẫn chi tiết
- `PROJECT_STRUCTURE.md` - Cấu trúc và API
- `EXCEL_TEMPLATE.md` - Mẫu file Excel

## 🆘 Cần Trợ Giúp?

1. Xem logs trong terminal (backend và frontend)
2. Check Browser Console (F12)
3. Đọc `INSTALLATION.md` để biết chi tiết hơn

---

**Happy coding!** 🎫✨
