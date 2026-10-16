# 🎡 Random Wheel - Vòng Quay May Mắn (Wheel of Names)

Dự án vòng quay ngẫu nhiên trực tuyến với giao diện hiện đại mô phỏng chuẩn Wheel of Names, hỗ trợ cơ chế cài cắm tỉ lệ trúng theo yêu cầu (mặc định **99% trúng Nguyễn Trọng Linh**) hoàn toàn tự nhiên và kín đáo.

Ứng dụng chạy hoàn toàn phía client (Static Web App), sẵn sàng để deploy miễn phí lên **GitHub Pages**.

---

## 🚀 Tính Năng Chính

1. **Giao diện & Trải nghiệm thực tế**:
   - Giao diện Dark theme mô phỏng chuẩn Wheel of Names.
   - Font chữ chuẩn tiếng Việt **Be Vietnam Pro** & **Montserrat** cực kỳ sắc nét, cân đối.
   - Hiệu ứng âm thanh gõ từng nan quạt (ratchet click) & nhạc ăn mừng (fanfare) qua Web Audio API.
   - Pháo hoa giấy (confetti) rực rỡ khi người chiến thắng xuất hiện.
   - Phím tắt: `Ctrl + Enter` để quay nhanh.
   - Đầy đủ tính năng quản lý danh sách Entries (Shuffle, Sort) & Tab Results xem lịch sử.

2. **Cơ chế cài cắm tỉ lệ 99% (Secret Rigging)**:
   - Các nan quạt trên vòng quay chia đều 100% về kích thước thị giác.
   - Thuật toán giảm tốc mượt mà và góc dừng lệch ngẫu nhiên trong lòng ô trúng để người xem không nhận ra.
   - **Menu bí mật**: Bấm phím tắt **`Ctrl + Shift + L`** hoặc nhấp 3 lần vào dòng chữ **`Version 437`** ở góc dưới bên phải để mở menu cấu hình trực tiếp (chỉnh tên người trúng, kéo thanh tỉ lệ % hoặc ép trúng 100% lượt quay tới).

---

## 🔗 Cấu Hình Qua Đường Dẫn URL (Rất Tiện Trên GitHub Pages)

Bạn có thể truyền trực tiếp thông số vào URL khi mở web hoặc chia sẻ:

- **Chỉ định người trúng**: `?target=Nguyễn+Trọng+Linh`
- **Chỉnh tỉ lệ trúng**: `?rate=99` (từ 1 đến 100%)
- **Bật/Tắt cài cắm**: `?rig=true` hoặc `?rig=false`

**Ví dụ URL hoàn chỉnh:**
```
https://namha-mg.github.io/magic-wheel/?target=Nguyễn+Trọng+Linh&rate=99
```

---

## 🌐 Hướng Dẫn Bật GitHub Pages Trên Repository

Khi đã push code lên GitHub `https://github.com/namha-MG/magic-wheel.git`:

1. Vào repository trên GitHub: `https://github.com/namha-MG/magic-wheel`
2. Chọn **Settings** -> mục **Pages** (ở menu bên trái).
3. Tại phần **Build and deployment**:
   - **Source**: Chọn **GitHub Actions** (Workflow tự động `.github/workflows/deploy.yml` đã được cấu hình sẵn).
   - *(Hoặc nếu chọn Deploy from a branch: Chọn Branch `main` / `root` -> Bấm Save)*.
4. Chờ khoảng 1 phút, trang web của bạn sẽ được kích hoạt tại:
   `https://namha-mg.github.io/magic-wheel/`
