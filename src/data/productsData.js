// ========================================
// Product Management Mock Data
// Replace with API later
// ========================================

export const categories = [
  "All",
  "Pizza",
  "Burger",
  "Beverages",
  "Desserts",
  "Snacks",
];

export const products = [
  {
    id: 1,
    sku: "BRG-001",
    name: "Chicken Burger",
    description:
      "Juicy grilled chicken patty with fresh lettuce, tomatoes, onions, cheese, and signature sauce.",
    category: "Burgers",
    price: 249,
    stock: 28,
    available: true,
    featured: true,
    combo: true,
    delivery: true,
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600",
  },

  {
    id: 2,
    sku: "PZA-001",
    name: "Veg Supreme Pizza",
    description:
      "Loaded with fresh vegetables, mozzarella cheese, olives, capsicum, and sweet corn.",
    category: "Pizza",
    price: 399,
    stock: 15,
    available: true,
    featured: false,
    combo: false,
    delivery: true,
    image:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600",
  },

  {
    id: 3,
    sku: "BEV-001",
    name: "Cold Coffee",
    description:
      "Creamy chilled coffee blended with milk, chocolate syrup, and vanilla ice cream.",
    category: "Beverages",
    price: 149,
    stock: 40,
    available: true,
    featured: false,
    combo: false,
    delivery: true,
    image:
      "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600",
  },

  {
    id: 4,
    sku: "SNK-001",
    name: "French Fries",
    description:
      "Golden crispy fries served with tomato ketchup and peri-peri seasoning.",
    category: "Snacks",
    price: 129,
    stock: 5,
    available: true,
    featured: true,
    combo: true,
    delivery: true,
    image:
      "https://images.unsplash.com/photo-1576107232684-1279f390859f?w=600",
  },

  {
    id: 5,
    sku: "DST-001",
    name: "Chocolate Brownie",
    description:
      "Rich chocolate brownie served warm with chocolate drizzle.",
    category: "Desserts",
    price: 179,
    stock: 0,
    available: false,
    featured: false,
    combo: false,
    delivery: false,
    image:
      "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600",
  },

  {
    id: 6,
    sku: "PZA-002",
    name: "Paneer Tikka Pizza",
    description:
      "Indian-style pizza topped with spicy paneer tikka, onions, capsicum, and mozzarella.",
    category: "Pizza",
    price: 449,
    stock: 12,
    available: true,
    featured: true,
    combo: false,
    delivery: true,
    image:
      "https://images.unsplash.com/photo-1594007654729-407eedc4be65?w=600",
  },

  {
    id: 7,
    sku: "BRG-002",
    name: "Cheese Burger",
    description:
      "Double cheese burger with fresh vegetables and creamy mayo.",
    category: "Burgers",
    price: 279,
    stock: 18,
    available: true,
    featured: false,
    combo: true,
    delivery: true,
    image:
      "https://images.unsplash.com/photo-1550547660-d9450f859349?w=600",
  },

  {
    id: 8,
    sku: "BEV-002",
    name: "Fresh Lime Soda",
    description:
      "Refreshing lime soda available in sweet or salted flavor.",
    category: "Beverages",
    price: 99,
    stock: 35,
    available: true,
    featured: false,
    combo: false,
    delivery: true,
    image:
      "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600",
  },
];

export const productStats = {
  totalProducts: products.length,
  activeProducts: products.filter((p) => p.available).length,
  outOfStock: products.filter((p) => !p.available).length,
  categories: new Set(products.map((p) => p.category)).size,
};