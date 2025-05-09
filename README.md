# Profix Service System

## Cấu trúc dự án

1. **Backend (Golang + Gin)**: Chạy trên cổng 8080.
2. **Frontend (React)**: Chạy trên cổng 3000.
3. **MySQL**: Chạy trên cổng 3306.
4. **Nginx**: Reverse proxy cho frontend và backend.

## Các bước cài đặt

1. **Cài đặt Docker và Docker Compose** nếu chưa có.
2. Clone repository về máy:

3. **Cấu hình file `.env`** với các thông số phù hợp.

4. **Khởi động các dịch vụ Docker**:

5. Truy cập vào:

- Frontend: `http://localhost`
- Backend API: `http://localhost:8080`
- Nginx sẽ tự động chuyển hướng frontend đến backend.

## Các dịch vụ

- **Backend**: API được xây dựng bằng Golang và Gin.
- **Frontend**: Web được xây dựng bằng React.
- **Database**: MySQL.

## Lưu ý

- Đảm bảo rằng các dịch vụ phụ thuộc (như MySQL) đã sẵn sàng trước khi backend và frontend khởi động (được quản lý bởi `wait-for-it.sh`).

Kết nối dbeaver để xem db

| docker exec -it mysql bash

| mysql -uroot -p
pass: rootpassword

| select user,host from mysql.user;

| update mysql.user set host='%' where user='root';

Or delete if exist 2 root

| DELETE FROM mysql.user WHERE User='root' AND Host='localhost';
FLUSH PRIVILEGES;

xoá cache docker

    | docker-compose down --volumes --remove-orphans
    | docker builder prune --all --force

use restaurant_bookings

INSERT INTO admin (gmail, name, phone, password) VALUES ('admin@gmail.com', 'admin', '0123456798', '$2a$14$sMQ5X783KRCdtWEkEmkz2u1oSZapWZsi3dR1xOTGF9LHetpcprjpG');

$2a$14$sMQ5X783KRCdtWEkEmkz2u1oSZapWZsi3dR1xOTGF9LHetpcprjpG
