FROM nginx:alpine

# Cài đặt netcat (nc) để kiểm tra kết nối tới backend
# RUN apk add --no-cache netcat-openbsd
COPY default.conf /etc/nginx/conf.d/default.conf

# # Dùng entrypoint script để chờ backend trước khi khởi động Nginx
# CMD ["sh", "-c", "until nc -z backend 8080; do echo Waiting for backend to be up...; sleep 5; done; nginx -g 'daemon off;'"]

# Expose port 4000 cho Nginx
EXPOSE 4000

