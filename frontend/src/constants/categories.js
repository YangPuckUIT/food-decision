// Giá trị category trong data -> nhãn hiển thị (theo CLAUDE.md).
// Dùng chung cho FoodCard, Codex, Food Detail...
export const CATEGORY_LABELS = {
  'noodle-soup': 'Noodle Soup',
  rice: 'Rice',
  'fast-food': 'Fast Food',
  'hotpot-grill': 'Hotpot & Grill',
  'street-snack': 'Street Snack',
}

// Danh sách giá trị category theo đúng thứ tự trên: ['noodle-soup', 'rice', ...]
export const CATEGORIES = Object.keys(CATEGORY_LABELS)
