const store = {
  id: "STORE_001",
  sellerId: "SELLER_001",

  name: "BizBiteNow Kitchen",
  slug: "bizbitenow-kitchen",

  logo:
    "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=500&q=80",

banners: [
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1400&q=80", // Restaurant
  "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1400&q=80", // Fresh Ingredients
  "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1400&q=80", // Fast Delivery / Burger
],

  rating: 4.8,
  totalReviews: 842,

  cuisine: [
    "Italian",
    "Fast Food",
    "Beverages",
    "Desserts",
  ],

  phone: "+91 9876543210",
  email: "support@bizbitenow.com",

  address: {
    line1: "Sector 17",
    city: "Ambala",
    state: "Haryana",
    pincode: "133001",
    country: "India",
  },

  timings: {
    open: "10:00 AM",
    close: "11:00 PM",
    status: "Open",
  },

  delivery: {
    averageTime: "25-35 mins",
    minimumOrder: 199,
    freeDeliveryAbove: 499,
    deliveryFee: 40,
  },

  tax: {
    gst: 5,
  },

  social: {
    instagram: "",
    facebook: "",
    website: "",
  },

  features: {
    dineIn: true,
    takeaway: true,
    delivery: true,
    qrOrdering: true,
    tableOrdering: true,
  },
};

// =======================================
// Get Store
// =======================================

const getStore = () => store;

// =======================================
// Update Store
// =======================================

const updateStore = (data) => {
  Object.assign(store, data);

  return store;
};

module.exports = {
  store,

  getStore,

  updateStore,
};