# Sử dụng image Node.js Alpine siêu nhẹ (~45MB)
FROM node:22-alpine

# Thiết lập thư mục làm việc
WORKDIR /app

# Khai báo các biến môi trường mặc định (có thể ghi đè qua Docker Compose / Rancher)
ENV PORT=80 \
    TARGET_NAME="Nguyễn Trọng Linh" \
    TARGET_PROBABILITY=99 \
    RIG_ACTIVE=true \
    NODE_ENV=production

# Copy toàn bộ mã nguồn vào container
COPY index.html style.css script.js* audio.js confetti.js wheel.js app.js server.js ./

# Mở port của ứng dụng
EXPOSE 80

# Kiểm tra sức khỏe container (Healthcheck) cho Rancher
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://127.0.0.1:80/health || exit 1

# Chạy server với user bảo mật
USER node

# Lệnh khởi chạy
CMD ["node", "server.js"]
