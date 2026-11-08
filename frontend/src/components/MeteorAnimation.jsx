import './MeteorAnimation.css'

// Animation sao băng khi đang roll. Hình TẠM bằng CSS, sau thay bằng art vẽ tay.
// Chỉ để nhìn: aria-hidden (trình đọc màn hình bỏ qua),
// pointer-events: none trong CSS (không nhận click).
//
// Tổng 3,6s, chia 3 nhịp (tính theo % của 3,6s trong CSS):
//   0–0,8s    nền tối dần + lóe sáng góc trên phải
//   0,8–2,2s  sao băng lao chéo xuống giữa (ease-in)
//   2,2–3,6s  chớp trắng + vòng nổ phóng to rồi mờ dần
function MeteorAnimation() {
  return (
    <div className="meteor" aria-hidden="true">
      <div className="meteor__backdrop" />
      <div className="meteor__glint" />
      <div className="meteor__star" />
      <div className="meteor__flash" />
      <div className="meteor__burst" />
    </div>
  )
}

export default MeteorAnimation
