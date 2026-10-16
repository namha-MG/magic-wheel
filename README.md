# 💘 CS:GO Romantic Couple Gacha - Vòng Quay Ghép Đôi Nam Nữ

Hệ thống quay Gacha ghép đôi Nam - Nữ song song lấy cảm hứng từ cơ chế mở hòm (Case Opening) kinh điển của **CS:GO / CS2**, kết hợp hiệu ứng tình cảm lãng mạn lung linh khi ghép đôi thành công.

Dự án hỗ trợ cơ chế cài cắm tỉ lệ trúng theo yêu cầu (mặc định **99% bạn Nam trúng Nguyễn Trọng Linh**) mà giao diện hoàn toàn tự nhiên và kín đáo.

---

## ✨ Điểm Nổi Bật

1. **Cơ Chế Gacha CS:GO Song Song (Dual Roller Tracks)**:
   - Hai dải băng chuyền cuộn ngang song song:
     - ♂ **Đàng Trai (Bạn Nam)**: Tông màu Neon Cyan / Blue mạnh mẽ.
     - ♀ **Đàng Gái (Bạn Nữ)**: Tông màu Neon Pink / Magenta ngọt ngào.
   - Kim vàng chỉ vạch trung tâm (Center Pointer Needle) chuẩn CS:GO.
   - Thuật toán giảm tốc vật lý (Quartic ease-out) với âm thanh tiếng gõ cơ học (ratchet click) chậm dần và dừng lại chuẩn xác dưới kim.

2. **Quản Lý Tên & Ảnh Thành Viên**:
   - Nút **"Quản Lý Thành Viên"** ở góc trên bên phải.
   - Thêm bạn Nam hoặc bạn Nữ dễ dàng:
     - Nhập tên hiển thị.
     - **Tải ảnh đại diện trực tiếp từ máy tính** (File Upload) hoặc dán link ảnh URL.
     - Hỗ trợ bộ biểu tượng / avatar hoạt hình vector sắc nét tạo sẵn.
     - Xóa / chỉnh sửa danh sách trực tiếp, tự động lưu vào `localStorage`.

3. **Cơ Chế Cài Cắm 99% Trúng "Nguyễn Trọng Linh"**:
   - Dù danh sách có 10, 50 hay 100 bạn nam, dải quay CS:GO vẫn cuộn hàng chục thẻ mượt mà và **99% dừng lại ở Nguyễn Trọng Linh**.
   - **Menu bí mật (Secret Rig)**: Bấm tổ hợp phím **`Ctrl + Shift + L`** hoặc nhấp **3 lần** vào dòng chữ **`CS:GO v2.4`** ở góc dưới bên phải:
     - Chỉnh tên bạn Nam được chọn.
     - Chỉnh tỉ lệ trúng (% từ 1 đến 100).
     - Chỉ định luôn bạn Nữ muốn ghép cặp cùng (nếu muốn).
     - Nút "Ép trúng 100% ở lượt tới".

4. **Hiệu Ứng Lung Linh Tình Cảm (Romantic Climax)**:
   - Cơn mưa trái tim màu hồng, đỏ và bụi sao vàng kim bay lượn từ giữa màn hình.
   - Chuông nhạc tình yêu ngân vang (romantic harp / chime chords).
   - Bảng vàng uyên ương với 2 ảnh đại diện lồng khung hào quang neon tiến vào giữa, trái tim đập thình thịch (heartbeat pulsing) cùng **chỉ số hợp đôi 99.9%** và lời chúc ngọt ngào.

---

## 🌐 Triển Khai Miễn Phí Với GitHub Pages

Ứng dụng chạy hoàn toàn phía Client (Static Web App).

1. Đẩy code lên GitHub repository: `https://github.com/namha-MG/magic-wheel.git`
2. Vào **Settings** -> **Pages** -> Tại mục **Build and deployment**, chọn **GitHub Actions** (đã có sẵn file workflow tự động `.github/workflows/deploy.yml`).
3. Website sẽ hoạt động trực tiếp tại:
   👉 **`https://namha-mg.github.io/magic-wheel/`**

### Cấu hình nhanh qua URL (URL Query Params):
- `?target=Nguyễn+Trọng+Linh`: Chỉ định tên bạn Nam.
- `?rate=99`: Đặt tỉ lệ trúng (%).
- `?rig=true`: Bật cài cắm bí mật.
