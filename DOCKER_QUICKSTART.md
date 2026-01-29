# 🐳 Quick Start with Docker

**Cách nhanh nhất để chạy CoTicket - Không cần cài PostgreSQL!**

## Yêu Cầu Duy Nhất

- Docker Desktop (Windows/Mac) hoặc Docker Engine (Linux)

👉 **Download Docker Desktop:** https://www.docker.com/products/docker-desktop

## 🚀 Chạy trong 2 Bước!

### Bước 1: Mở PowerShell tại thư mục CoTicket

```powershell
cd C:\Users\ADMIN\Desktop\CoTicket
```

### Bước 2: Chạy Docker Compose

```powershell
docker-compose up -d
```

**Đợi 30-60 giây** để containers khởi động...

### ✅ Kiểm Tra

```powershell
docker-compose ps
```

Kết quả nên thấy 3 containers đang chạy:
- `coticket-postgres`
- `coticket-backend`
- `coticket-frontend`

### 🎉 Xong! Truy Cập Ứng Dụng

- **Frontend:** http://localhost:5173
- **Login:** http://localhost:5173/login
  - Email: `admin@coticket.com`
  - Password: Lien he: pvminh1024@gmail.com 

## 📝 Các Lệnh Cơ Bản

```powershell
# Xem logs
docker-compose logs -f

# Dừng
docker-compose stop

# Khởi động lại
docker-compose start

# Xóa tất cả (reset)
docker-compose down -v
```

## ❓ Gặp Lỗi?

### "docker-compose: command not found"
Cài Docker Desktop: https://www.docker.com/products/docker-desktop

### "Port already in use"
Đổi port trong `docker-compose.yml`, sau đó:
```powershell
docker-compose down
docker-compose up -d
```

### Container không khởi động
```powershell
# Xem logs chi tiết
docker-compose logs backend
docker-compose logs postgres
```

## 🔄 Rebuild Sau Khi Sửa Code

```powershell
docker-compose up -d --build
```

## 📚 Xem Thêm

- `DOCKER.md` - Hướng dẫn chi tiết
- `README.md` - Tổng quan project

---

**That's it! Enjoy!** 🎫✨
