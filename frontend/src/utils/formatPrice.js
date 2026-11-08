// Giá VND -> chuỗi hiển thị: 45000 -> "45,000₫" (theo CLAUDE.md)
export function formatPrice(price) {
  return price.toLocaleString('en-US') + '₫'
}
