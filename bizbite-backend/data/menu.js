const STORE_ID = "STORE_001";
const SELLER_ID = "SELLER_001";

const categories = [
  {
    id: "all",
    name: "All",
    icon: "🍽️",
    image: "",
    available: true,
    sortOrder: 0,
  },
  {
  id: "favorites",
  name: "Favorites",
  icon: "❤️",
  image: "",
  available: true,
  sortOrder: 0,
},
  {
    id: "Pizza",
    name: "Pizza",
    icon: "🍕",
    image: "",
    available: true,
    sortOrder: 1,
  },
  {
    id: "Burgers",
    name: "Burgers",
    icon: "🍔",
    image: "",
    available: true,
    sortOrder: 2,
  },
  {
    id: "Pasta",
    name: "Pasta",
    icon: "🍝",
    image: "",
    available: true,
    sortOrder: 3,
  },
  {
    id: "Wraps",
    name: "Wraps",
    icon: "🌯",
    image: "",
    available: true,
    sortOrder: 4,
  },
  {
    id: "Rice Bowls",
    name: "Rice Bowls",
    icon: "🍚",
    image: "",
    available: true,
    sortOrder: 5,
  },
  {
    id: "Drinks",
    name: "Drinks",
    icon: "🥤",
    image: "",
    available: true,
    sortOrder: 6,
  },
  {
    id: "Desserts",
    name: "Desserts",
    icon: "🍰",
    image: "",
    available: true,
    sortOrder: 7,
  },
  {
    id: "Snacks",
    name: "Snacks",
    icon: "🍟",
    image: "",
    available: true,
    sortOrder: 8,
  },
  {
    id: "Combo Meals",
    name: "Combo Meals",
    icon: "🍱",
    image: "",
    available: true,
    sortOrder: 9,
  },
];

const menu = [
  {
    id: "ITEM_001",

    sku: "PIZ-001",

    storeId: STORE_ID,
    sellerId: SELLER_ID,

    name: "Margherita Pizza",

    description:
      "Classic Italian pizza topped with fresh mozzarella cheese, rich tomato sauce, basil leaves, and aromatic herbs.",

    category: "Pizza",

    image:
      "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=900&q=80",

    gallery: [
      "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=900&q=80",
    ],

    price: 299,
    originalPrice: 349,

    tax: 5,

    stock: 120,

    available: true,

    preparationTime: 20,

    isVeg: true,

    featured: true,
    bestseller: true,
    recommended: true,

    todaySpecial: false,
    comboMeal: false,
    recentlyOrdered: true,

    rating: {
      average: 4.8,
      count: 281,
    },

    calories: 510,

    tags: [
      "Italian",
      "Pizza",
      "Cheesy",
      "Popular",
      "Veg",
    ],

    variants: [
      {
        id: "VAR001",
        name: "Regular",
        price: 299,
      },
      {
        id: "VAR002",
        name: "Medium",
        price: 449,
      },
      {
        id: "VAR003",
        name: "Large",
        price: 599,
      },
    ],

    addons: [
      {
        id: "ADD001",
        name: "Extra Cheese",
        price: 50,
      },
      {
        id: "ADD002",
        name: "Olives",
        price: 35,
      },
      {
        id: "ADD003",
        name: "Jalapeños",
        price: 40,
      },
      {
        id: "ADD004",
        name: "Cheese Burst Crust",
        price: 99,
      },
    ],
  },
    {
    id: "ITEM_002",

    sku: "PIZ-002",

    storeId: STORE_ID,
    sellerId: SELLER_ID,

    name: "Chicken Tikka Pizza",

    description:
      "Loaded with spicy chicken tikka, onions, capsicum, mozzarella cheese, and signature pizza sauce.",

    category: "Pizza",

    image:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=900&q=80",

    gallery: [
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=900&q=80",
    ],

    price: 549,
    originalPrice: 649,

    tax: 5,

    stock: 80,

    available: true,

    preparationTime: 24,

    isVeg: false,

    featured: true,
    bestseller: true,
    recommended: true,

    todaySpecial: true,
    comboMeal: false,
    recentlyOrdered: false,

    rating: {
      average: 4.9,
      count: 326,
    },

    calories: 735,

    tags: [
      "Chicken",
      "Pizza",
      "Spicy",
      "Best Seller",
      "Non Veg",
    ],

    variants: [
      {
        id: "VAR004",
        name: "Regular",
        price: 549,
      },
      {
        id: "VAR005",
        name: "Medium",
        price: 699,
      },
      {
        id: "VAR006",
        name: "Large",
        price: 849,
      },
    ],

    addons: [
      {
        id: "ADD005",
        name: "Extra Cheese",
        price: 50,
      },
      {
        id: "ADD006",
        name: "Chicken Tikka",
        price: 99,
      },
      {
        id: "ADD007",
        name: "Cheese Burst Crust",
        price: 99,
      },
      {
        id: "ADD008",
        name: "Black Olives",
        price: 40,
      },
    ],
  },
    {
    id: "ITEM_003",

    sku: "BUR-001",

    storeId: STORE_ID,
    sellerId: SELLER_ID,

    name: "Classic Chicken Burger",

    description:
      "Juicy grilled chicken patty layered with fresh lettuce, tomatoes, cheddar cheese, caramelized onions, creamy mayo, and signature burger sauce.",

    category: "Burgers",

    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=80",

    gallery: [
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=900&q=80",
    ],

    price: 249,
    originalPrice: 299,

    tax: 5,

    stock: 100,

    available: true,

    preparationTime: 15,

    isVeg: false,

    featured: true,
    bestseller: true,
    recommended: true,

    todaySpecial: false,
    comboMeal: false,
    recentlyOrdered: true,

    rating: {
      average: 4.8,
      count: 218,
    },

    calories: 590,

    tags: [
      "Burger",
      "Chicken",
      "Grilled",
      "Popular",
      "Non Veg",
    ],

    variants: [
      {
        id: "VAR007",
        name: "Regular",
        price: 249,
      },
      {
        id: "VAR008",
        name: "Double Patty",
        price: 369,
      },
    ],

    addons: [
      {
        id: "ADD009",
        name: "Extra Cheese",
        price: 35,
      },
      {
        id: "ADD010",
        name: "French Fries",
        price: 99,
      },
      {
        id: "ADD011",
        name: "Coke",
        price: 59,
      },
      {
        id: "ADD012",
        name: "Chicken Patty",
        price: 120,
      },
    ],
  },
    {
    id: "ITEM_004",

    sku: "PAS-001",

    storeId: STORE_ID,
    sellerId: SELLER_ID,

    name: "Creamy Alfredo Pasta",

    description:
      "Perfectly cooked penne pasta tossed in a rich and creamy Alfredo sauce with parmesan cheese, herbs, garlic, and fresh parsley.",

    category: "Pasta",

    image:
      "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=900&q=80",

    gallery: [
      "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?auto=format&fit=crop&w=900&q=80",
    ],

    price: 289,
    originalPrice: 349,

    tax: 5,

    stock: 70,

    available: true,

    preparationTime: 18,

    isVeg: true,

    featured: true,
    bestseller: true,
    recommended: true,

    todaySpecial: true,
    comboMeal: false,
    recentlyOrdered: false,

    rating: {
      average: 4.7,
      count: 186,
    },

    calories: 520,

    tags: [
      "Pasta",
      "Italian",
      "Creamy",
      "Cheese",
      "Veg",
    ],

    variants: [
      {
        id: "VAR009",
        name: "Regular",
        price: 289,
      },
      {
        id: "VAR010",
        name: "Large",
        price: 419,
      },
    ],

    addons: [
      {
        id: "ADD013",
        name: "Garlic Bread",
        price: 79,
      },
      {
        id: "ADD014",
        name: "Extra Parmesan",
        price: 45,
      },
      {
        id: "ADD015",
        name: "Mushrooms",
        price: 60,
      },
      {
        id: "ADD016",
        name: "Jalapeños",
        price: 35,
      },
    ],
  },
    {
    id: "ITEM_005",

    sku: "DRK-001",

    storeId: STORE_ID,
    sellerId: SELLER_ID,

    name: "Cold Coffee",

    description:
      "Smooth and refreshing cold coffee blended with premium vanilla ice cream, chocolate syrup, and crushed ice.",

    category: "Drinks",

    image:
      "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=900&q=80",

    gallery: [
      "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80",
    ],

    price: 149,
    originalPrice: 189,

    tax: 5,

    stock: 250,

    available: true,

    preparationTime: 5,

    isVeg: true,

    featured: false,
    bestseller: true,
    recommended: true,

    todaySpecial: false,
    comboMeal: false,
    recentlyOrdered: false,

    rating: {
      average: 4.8,
      count: 348,
    },

    calories: 270,

    tags: [
      "Coffee",
      "Cold",
      "Beverage",
      "Summer",
      "Popular",
    ],

    variants: [
      {
        id: "VAR011",
        name: "Regular",
        price: 149,
      },
      {
        id: "VAR012",
        name: "Large",
        price: 199,
      },
    ],

    addons: [
      {
        id: "ADD017",
        name: "Whipped Cream",
        price: 20,
      },
      {
        id: "ADD018",
        name: "Chocolate Syrup",
        price: 25,
      },
      {
        id: "ADD019",
        name: "Vanilla Ice Cream",
        price: 40,
      },
    ],
  },
    {
    id: "ITEM_006",

    sku: "DES-001",

    storeId: STORE_ID,
    sellerId: SELLER_ID,

    name: "Chocolate Lava Cake",

    description:
      "Warm chocolate sponge cake with a rich molten chocolate center, served fresh and topped with cocoa dust.",

    category: "Desserts",

    image:
      "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=900&q=80",

    gallery: [
      "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=900&q=80",
    ],

    price: 179,
    originalPrice: 229,

    tax: 5,

    stock: 90,

    available: true,

    preparationTime: 10,

    isVeg: true,

    featured: true,
    bestseller: true,
    recommended: true,

    todaySpecial: false,
    comboMeal: false,
    recentlyOrdered: true,

    rating: {
      average: 4.9,
      count: 296,
    },

    calories: 410,

    tags: [
      "Dessert",
      "Chocolate",
      "Cake",
      "Sweet",
      "Popular",
    ],

    variants: [
      {
        id: "VAR013",
        name: "Single",
        price: 179,
      },
      {
        id: "VAR014",
        name: "Double",
        price: 329,
      },
    ],

    addons: [
      {
        id: "ADD020",
        name: "Vanilla Ice Cream",
        price: 49,
      },
      {
        id: "ADD021",
        name: "Chocolate Syrup",
        price: 25,
      },
      {
        id: "ADD022",
        name: "Whipped Cream",
        price: 30,
      },
      {
        id: "ADD023",
        name: "Brownie Crumble",
        price: 40,
      },
    ],
  },
    {
    id: "ITEM_007",

    sku: "BUR-002",

    storeId: STORE_ID,
    sellerId: SELLER_ID,

    name: "Veg Loaded Burger",

    description:
      "A crispy vegetable patty layered with lettuce, tomatoes, onions, cheddar cheese, pickles, and creamy burger sauce in a toasted sesame bun.",

    category: "Burgers",

    image:
      "https://images.unsplash.com/photo-1550317138-10000687a72b?auto=format&fit=crop&w=900&q=80",

    gallery: [
      "https://images.unsplash.com/photo-1550317138-10000687a72b?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=80",
    ],

    price: 219,
    originalPrice: 269,

    tax: 5,

    stock: 110,

    available: true,

    preparationTime: 14,

    isVeg: true,

    featured: true,
    bestseller: false,
    recommended: true,

    todaySpecial: false,
    comboMeal: false,
    recentlyOrdered: false,

    rating: {
      average: 4.7,
      count: 194,
    },

    calories: 485,

    tags: [
      "Burger",
      "Veg",
      "Cheesy",
      "Fast Food",
      "Fresh",
    ],

    variants: [
      {
        id: "VAR015",
        name: "Regular",
        price: 219,
      },
      {
        id: "VAR016",
        name: "Double Patty",
        price: 319,
      },
    ],

    addons: [
      {
        id: "ADD024",
        name: "Extra Cheese",
        price: 35,
      },
      {
        id: "ADD025",
        name: "French Fries",
        price: 99,
      },
      {
        id: "ADD026",
        name: "Coke",
        price: 59,
      },
      {
        id: "ADD027",
        name: "Veg Patty",
        price: 70,
      },
    ],
  },
    {
    id: "ITEM_008",

    sku: "WRP-001",

    storeId: STORE_ID,
    sellerId: SELLER_ID,

    name: "Paneer Tikka Wrap",

    description:
      "Soft tortilla stuffed with smoky paneer tikka, fresh vegetables, mint mayo, onions, and crunchy lettuce.",

    category: "Wraps",

    image:
      "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=80",

    gallery: [
      "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=80",
    ],

    price: 229,
    originalPrice: 279,

    tax: 5,

    stock: 95,

    available: true,

    preparationTime: 12,

    isVeg: true,

    featured: true,
    bestseller: true,
    recommended: true,

    todaySpecial: false,
    comboMeal: false,
    recentlyOrdered: true,

    rating: {
      average: 4.8,
      count: 231,
    },

    calories: 455,

    tags: [
      "Wrap",
      "Paneer",
      "Veg",
      "Healthy",
      "Fresh",
    ],

    variants: [
      {
        id: "VAR017",
        name: "Regular",
        price: 229,
      },
      {
        id: "VAR018",
        name: "Double Paneer",
        price: 319,
      },
    ],

    addons: [
      {
        id: "ADD028",
        name: "Extra Paneer",
        price: 60,
      },
      {
        id: "ADD029",
        name: "Cheese Slice",
        price: 35,
      },
      {
        id: "ADD030",
        name: "French Fries",
        price: 99,
      },
      {
        id: "ADD031",
        name: "Mint Dip",
        price: 25,
      },
    ],
  },
    {
    id: "ITEM_009",

    sku: "COM-001",

    storeId: STORE_ID,
    sellerId: SELLER_ID,

    name: "Burger Combo Meal",

    description:
      "A complete meal with a crispy chicken burger, medium French fries, chilled Coke, and tomato ketchup.",

    category: "Combo Meals",

    image:
      "https://images.unsplash.com/photo-1565299507177-b0ac66763828?auto=format&fit=crop&w=900&q=80",

    gallery: [
      "https://images.unsplash.com/photo-1565299507177-b0ac66763828?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=900&q=80",
    ],

    price: 399,
    originalPrice: 499,

    tax: 5,

    stock: 75,

    available: true,

    preparationTime: 18,

    isVeg: false,

    featured: true,
    bestseller: true,
    recommended: true,

    todaySpecial: true,
    comboMeal: true,
    recentlyOrdered: true,

    rating: {
      average: 4.9,
      count: 382,
    },

    calories: 980,

    tags: [
      "Combo",
      "Burger",
      "Fries",
      "Meal",
      "Popular",
    ],

    variants: [
      {
        id: "VAR019",
        name: "Regular",
        price: 399,
      },
      {
        id: "VAR020",
        name: "Large Combo",
        price: 499,
      },
    ],

    addons: [
      {
        id: "ADD032",
        name: "Extra Fries",
        price: 79,
      },
      {
        id: "ADD033",
        name: "Chicken Nuggets (4 pcs)",
        price: 99,
      },
      {
        id: "ADD034",
        name: "Chocolate Brownie",
        price: 89,
      },
      {
        id: "ADD035",
        name: "Large Coke",
        price: 40,
      },
    ],
  },
    {
    id: "ITEM_010",

    sku: "RCB-001",

    storeId: STORE_ID,
    sellerId: SELLER_ID,

    name: "Butter Chicken Rice Bowl",

    description:
      "Tender butter chicken served over fragrant basmati rice, topped with fresh coriander and creamy butter gravy.",

    category: "Rice Bowls",

    image:
      "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=900&q=80",

    gallery: [
      "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1604908176997-431f3b3f88a2?auto=format&fit=crop&w=900&q=80",
    ],

    price: 349,
    originalPrice: 419,

    tax: 5,

    stock: 85,

    available: true,

    preparationTime: 20,

    isVeg: false,

    featured: true,
    bestseller: true,
    recommended: true,

    todaySpecial: true,
    comboMeal: false,
    recentlyOrdered: true,

    rating: {
      average: 4.9,
      count: 312,
    },

    calories: 760,

    tags: [
      "Rice Bowl",
      "Chicken",
      "Indian",
      "Butter Chicken",
      "Popular",
    ],

    variants: [
      {
        id: "VAR021",
        name: "Regular",
        price: 349,
      },
      {
        id: "VAR022",
        name: "Large",
        price: 449,
      },
    ],

    addons: [
      {
        id: "ADD036",
        name: "Extra Butter Chicken",
        price: 120,
      },
      {
        id: "ADD037",
        name: "Boiled Egg",
        price: 30,
      },
      {
        id: "ADD038",
        name: "Garlic Naan",
        price: 60,
      },
      {
        id: "ADD039",
        name: "Cold Drink",
        price: 50,
      },
    ],
  },
];

const getMenu = () => menu;

const getCategories = () => categories;

const getProductById = (id) =>
  menu.find((item) => item.id === id);

const getProductBySku = (sku) =>
  menu.find((item) => item.sku === sku);

const getProductsByCategory = (category) =>
  menu.filter(
    (item) =>
      item.category.toLowerCase() ===
      category.toLowerCase()
  );

const getFeaturedProducts = () =>
  menu.filter(
    (item) =>
      item.featured && item.available
  );

const getBestSellerProducts = () =>
  menu.filter(
    (item) =>
      item.bestseller && item.available
  );

const getRecommendedProducts = () =>
  menu.filter(
    (item) =>
      item.recommended && item.available
  );
const getTodaySpecialProducts = () =>
  menu.filter(
    (item) =>
      item.todaySpecial &&
      item.available
  );

const getComboMealProducts = () =>
  menu.filter(
    (item) =>
      item.comboMeal &&
      item.available
  );

const getRecentlyOrderedProducts = () =>
  menu.filter(
    (item) =>
      item.recentlyOrdered &&
      item.available
  );
const searchMenu = (query = "") => {
  const keyword = query.toLowerCase();

  return menu.filter(
    (item) =>
      item.name.toLowerCase().includes(keyword) ||
      item.description.toLowerCase().includes(keyword) ||
      item.category.toLowerCase().includes(keyword) ||
      item.tags.some((tag) =>
        tag.toLowerCase().includes(keyword)
      )
  );
};

module.exports = {
  categories,
  menu,

  getMenu,
  getCategories,

  getProductById,
  getProductBySku,
  getProductsByCategory,

  getFeaturedProducts,
  getBestSellerProducts,
  getRecommendedProducts,

  getTodaySpecialProducts,
  getComboMealProducts,
  getRecentlyOrderedProducts,

  searchMenu,
};
