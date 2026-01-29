# 🐳 CoTicket - Docker Scripts for Windows

## 📋 Available Scripts

### ✅ `start-docker.bat`
**Khởi động toàn bộ project**
- Kiểm tra Docker đã chạy chưa
- Build và start tất cả containers
- Hiển thị URLs và thông tin login

**Cách dùng:** Double-click file hoặc:
```powershell
.\start-docker.bat
```

---

### ⏹️ `stop-docker.bat`
**Dừng tất cả containers**
- Dừng PostgreSQL, Backend, Frontend

**Cách dùng:**
```powershell
.\stop-docker.bat
```

---

### 📋 `logs-docker.bat`
**Xem logs real-time**
- Hiển thị logs của tất cả containers
- Nhấn Ctrl+C để thoát

**Cách dùng:**
```powershell
.\logs-docker.bat
```

---

### 🔄 `reset-docker.bat`
**Reset hoàn toàn (XÓA DỮ LIỆU!)**
- Dừng và xóa tất cả containers
- Xóa database volumes
- Xóa images

⚠️ **Cảnh báo:** Sẽ xóa toàn bộ dữ liệu!

**Cách dùng:**
```powershell
.\reset-docker.bat
```

---

## 🚀 Quick Start

1. **Đảm bảo Docker Desktop đã chạy**
   - Mở Docker Desktop từ Start Menu
   - Đợi icon Docker ở system tray không còn "Starting..."

2. **Double-click `start-docker.bat`**
   - Hoặc chạy trong PowerShell: `.\start-docker.bat`

3. **Đợi ~30-60 giây**
   - Containers sẽ build và start

4. **Truy cập:**
   - Frontend: http://localhost:5173
   - Login: admin@coticket.com / Admin@123456

---

## 💡 Tips

### Xem status containers
```powershell
docker-compose ps
```

### Rebuild sau khi sửa code
```powershell
docker-compose up -d --build
```

### Vào backend container
```powershell
docker exec -it coticket-backend sh
```

### Vào database
```powershell
docker exec -it coticket-postgres psql -U postgres -d coticket
```

### Backup database
```powershell
docker exec coticket-postgres pg_dump -U postgres coticket > backup.sql
```

---

## ❓ Troubleshooting

### "Docker is not running"
- Mở Docker Desktop
- Đợi khởi động hoàn tất
- Chạy lại script

### "Port already in use"
Sửa ports trong `docker-compose.yml`:
```yaml
services:
  backend:
    ports:
      - "3000:5000"  # Đổi 3000 thành port khác
```

### Container không start
```powershell
# Xem logs
docker-compose logs backend

# Reset và thử lại
.\reset-docker.bat
.\start-docker.bat
```

---

## 📚 Xem Thêm

- [DOCKER_QUICKSTART.md](DOCKER_QUICKSTART.md) - Hướng dẫn nhanh
- [DOCKER.md](DOCKER.md) - Hướng dẫn chi tiết
- [README.md](README.md) - Tài liệu chính

---

**Made with ❤️ for Windows users**
