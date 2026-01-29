# Sample Data for Testing

Tạo file Excel với các dòng sau để test tính năng upload mới:

## Dữ liệu hợp lệ:

| email | name | cccd | ticketCode |
|-------|------|------|------------|
| test1@gmail.com | Nguyễn Văn A | 001234567890 | TICKET001 |
| test2@gmail.com | Trần Thị B | 098765432101 | TICKET002 |

## Dữ liệu có lỗi (để test skip):

| email | name | cccd | ticketCode |
|-------|------|------|------------|
| invalid-email | Lê Văn C | 012345678901 | TICKET003 |
| test4@gmail.com |  | 012345678901 | TICKET004 |
| test5@gmail.com | Phạm Thị D | 123 | TICKET005 |
| test6@gmail.com | Hoàng Văn E | 098765432101 |  |

## Kết quả mong đợi:

- Tổng: 6 dòng
- Thành công: 2 dòng (test1, test2)
- Thất bại: 4 dòng
- Hệ thống sẽ import 2 vé hợp lệ và hiển thị chi tiết 4 lỗi

## Test gửi email:

Sau khi import, test "Gửi Email Tất Cả":
- Nếu chưa config SMTP, email sẽ failed
- Status sẽ được cập nhật trong bảng
- Modal hiển thị chi tiết thành công/thất bại
