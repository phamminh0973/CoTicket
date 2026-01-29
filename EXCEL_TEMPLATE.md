# CoTicket - Sample Excel Template

Đây là template mẫu cho file Excel upload vào hệ thống.

## Cấu trúc file Excel

File Excel phải có các cột sau (chính xác tên cột):

| email | name | cccd | ticketCode |
|-------|------|------|------------|
| user1@example.com | Nguyễn Văn A | 001234567890 | TICKET001 |
| user2@example.com | Trần Thị B | 098765432101 | TICKET002 |
| user3@example.com | Lê Văn C | 012345678901 | TICKET003 |

## Lưu ý:

1. **Tên cột**: Phải chính xác: `email`, `name`, `cccd`, `ticketCode` (có phân biệt hoa thường)
2. **email**: 
   - ⚠️ Có thể để trống (sẽ có cảnh báo nhưng vẫn import)
   - Nếu có email, phải đúng định dạng
   - Vé có email trống sẽ không thể gửi email
3. **name**: Tên người nhận vé (bắt buộc)
4. **cccd**: Số CCCD từ 9-12 chữ số (bắt buộc)
5. **ticketCode**: Mã vé duy nhất, không trùng lặp (bắt buộc)

## Tạo file mẫu:

Bạn có thể tạo file Excel (.xlsx) với cấu trúc trên trong Excel hoặc Google Sheets.

### Ví dụ dữ liệu:

```
email: john.doe@gmail.com
name: John Doe
cccd: 001234567890
ticketCode: EVENT2024-001

email: jane.smith@gmail.com
name: Jane Smith
cccd: 098765432101
ticketCode: EVENT2024-002
```
