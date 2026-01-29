# 🐳 Docker Deployment Guide - CoTicket

## Yêu Cầu

- Docker Desktop (Windows/Mac) hoặc Docker Engine (Linux)
- Docker Compose

### Cài Đặt Docker Desktop

**Windows:**
1. Download: https://www.docker.com/products/docker-desktop
2. Cài đặt và khởi động Docker Desktop
3. Đảm bảo WSL 2 đã được cài đặt

**Mac:**
```bash
brew install --cask docker
```

**Linux:**
```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
```

## 🚀 Chạy Project với Docker (1 Lệnh!)

### Bước 1: Mở Terminal tại thư mục CoTicket

```powershell
cd C:\Users\ADMIN\Desktop\CoTicket
```

### Bước 2: Chạy Docker Compose

```bash
docker-compose up -d
```

**Giải thích:**
- `-d`: Chạy ở background (detached mode)
- Docker sẽ tự động:
  - ✅ Tạo PostgreSQL database
  - ✅ Build và chạy Backend API
  - ✅ Chạy migration (tạo bảng)
  - ✅ Seed admin account
  - ✅ Build và chạy Frontend

### Bước 3: Đợi Services Khởi Động

```bash
# Xem logs để đảm bảo mọi thứ đã sẵn sàng
docker-compose logs -f
```

**Chờ đến khi thấy:**
```
coticket-backend   | ✅ Connected to PostgreSQL database
coticket-backend   | ✅ Migration completed successfully!
coticket-backend   | ✅ Admin account created successfully!
coticket-backend   | 🚀 Server is running on port 5000
```

Nhấn `Ctrl+C` để thoát logs.

### Bước 4: Truy Cập Ứng Dụng

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000/api/health
- **Database:** localhost:5432 (từ máy host)

### Bước 5: Đăng Nhập Admin

- URL: http://localhost:5173/login
- Email: `admin@coticket.com`
- Password: `Admin@123456`

## 🎉 Xong! Không Cần Cài PostgreSQL!

Tất cả đã chạy trong Docker containers:
- ✅ PostgreSQL database
- ✅ Backend API
- ✅ Frontend UI

## 📝 Các Lệnh Docker Hữu Ích

### Xem Status Containers

```bash
docker-compose ps
```

### Xem Logs

```bash
# Tất cả services
docker-compose logs -f

# Chỉ backend
docker-compose logs -f backend

# Chỉ postgres
docker-compose logs -f postgres

# Chỉ frontend
docker-compose logs -f frontend
```

### Dừng Containers

```bash
docker-compose stop
```

### Khởi động lại

```bash
docker-compose start
```

### Dừng và Xóa Containers

```bash
docker-compose down
```

### Dừng và Xóa Cả Database (Reset Hoàn Toàn)

```bash
docker-compose down -v
```

⚠️ **Cảnh báo:** Lệnh này sẽ xóa toàn bộ dữ liệu trong database!

### Rebuild Containers (sau khi sửa code)

```bash
# Rebuild tất cả
docker-compose up -d --build

# Rebuild chỉ backend
docker-compose up -d --build backend

# Rebuild chỉ frontend
docker-compose up -d --build frontend
```

### Chạy Lại Migration/Seed

```bash
# Vào container backend
docker exec -it coticket-backend sh

# Trong container:
npm run migrate
npm run seed
exit
```

### Xem Database

```bash
# Kết nối vào PostgreSQL
docker exec -it coticket-postgres psql -U postgres -d coticket

# Trong psql:
\dt              # Xem tables
SELECT * FROM admins;
SELECT * FROM tickets;
\q               # Thoát
```

## 🔧 Cấu Hình

### Thay Đổi Port

Sửa file `docker-compose.yml`:

```yaml
services:
  backend:
    ports:
      - "3000:5000"  # Chạy trên port 3000 thay vì 5000
  
  frontend:
    ports:
      - "8080:5173"  # Chạy trên port 8080 thay vì 5173
```

Sau đó:
```bash
docker-compose up -d --force-recreate
```

### Cấu Hình SMTP Email

Sửa phần `environment` của service `backend` trong `docker-compose.yml`:

```yaml
environment:
  SMTP_HOST: smtp.gmail.com
  SMTP_PORT: 587
  SMTP_USER: your-email@gmail.com
  SMTP_PASS: your-app-password  # Gmail App Password
```

Restart backend:
```bash
docker-compose restart backend
```

## 🔍 Troubleshooting

### Port Already in Use

```bash
# Kiểm tra port đang được sử dụng
netstat -ano | findstr :5000
netstat -ano | findstr :5173
netstat -ano | findstr :5432

# Dừng containers và đổi port trong docker-compose.yml
docker-compose down
# Sửa file docker-compose.yml
docker-compose up -d
```

### Container Keeps Restarting

```bash
# Xem logs để tìm lỗi
docker-compose logs backend

# Thường gặp: database chưa sẵn sàng
# Giải pháp: Đợi vài giây rồi check lại
```

### Database Connection Error

```bash
# Kiểm tra postgres container đã chạy chưa
docker-compose ps

# Kiểm tra logs postgres
docker-compose logs postgres

# Restart postgres
docker-compose restart postgres
```

### Cannot Access Frontend

```bash
# Kiểm tra frontend container
docker-compose logs frontend

# Rebuild frontend
docker-compose up -d --build frontend
```

### Reset Hoàn Toàn

```bash
# Xóa tất cả containers và volumes
docker-compose down -v

# Xóa images cũ
docker images | grep coticket
docker rmi coticket-backend coticket-frontend

# Build lại từ đầu
docker-compose up -d --build
```

## 📦 Production Deployment

### Build Production Images

Tạo `docker-compose.prod.yml`:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    restart: always
    environment:
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: ${DB_NAME}
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    restart: always
    ports:
      - "5000:5000"
    environment:
      NODE_ENV: production
      DB_HOST: postgres
      # ... other env vars from .env
    depends_on:
      - postgres

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    restart: always
    ports:
      - "80:5173"
    depends_on:
      - backend

volumes:
  postgres_data:
```

Chạy production:
```bash
docker-compose -f docker-compose.prod.yml up -d
```

## 🌐 Deploy to Cloud

### Deploy to Railway.app

1. Push code lên GitHub
2. Tạo account trên Railway.app
3. New Project > Deploy from GitHub
4. Railway sẽ tự detect `docker-compose.yml` và deploy

### Deploy to DigitalOcean

```bash
# Install doctl CLI
# Create Droplet
# SSH vào server
git clone <your-repo>
cd CoTicket
docker-compose up -d
```

### Deploy to AWS ECS

Sử dụng AWS CLI và ECR để push images, sau đó deploy lên ECS.

## 💾 Backup Database

```bash
# Backup
docker exec coticket-postgres pg_dump -U postgres coticket > backup.sql

# Restore
cat backup.sql | docker exec -i coticket-postgres psql -U postgres coticket
```

## 📊 Monitoring

### Xem Resource Usage

```bash
docker stats
```

### Health Check

```bash
# Backend health
curl http://localhost:5000/api/health

# Database connection
docker exec coticket-postgres pg_isready -U postgres
```

## ✅ Advantages of Docker

- ✅ Không cần cài PostgreSQL trên máy
- ✅ Môi trường đồng nhất (dev = prod)
- ✅ Dễ dàng reset/rebuild
- ✅ Dễ deploy lên cloud
- ✅ Isolated services
- ✅ Easy scaling

---

## 🎯 Quick Commands Cheat Sheet

```bash
# Start everything
docker-compose up -d

# View logs
docker-compose logs -f

# Stop everything
docker-compose down

# Reset everything
docker-compose down -v && docker-compose up -d --build

# Rebuild after code changes
docker-compose up -d --build

# Access backend shell
docker exec -it coticket-backend sh

# Access database
docker exec -it coticket-postgres psql -U postgres -d coticket
```

---

**Happy Docker Deployment!** 🐳🚀
