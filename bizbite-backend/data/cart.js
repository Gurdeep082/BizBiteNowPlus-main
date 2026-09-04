const {
  getProductById,
} = require("./menu");

const STORE_ID = "STORE_001";
const SELLER_ID = "SELLER_001";

let cart = {
  storeId: STORE_ID,

  sellerId: SELLER_ID,

  customerId: "CUSTOMER_001",

  coupon: null,

  items: [],
};

// ===============================
// Helpers
// ===============================

const calculateTotals = () => {
  const subtotal = cart.items.reduce(
    (sum, item) => sum + item.total,
    0
  );

  const delivery =
    subtotal >= 499 ? 0 : 40;

  const tax = Math.round(
    subtotal * 0.05
  );

  const discount =
    cart.coupon?.discount || 0;

  return {
    subtotal,
    delivery,
    tax,
    discount,
    total:
      subtotal +
      delivery +
      tax -
      discount,
  };
};

// ===============================
// Get Cart
// ===============================

const getCart = () => ({
  ...cart,
  summary: calculateTotals(),
});

// ===============================
// Add To Cart
// ===============================
const addToCart = ({
  productId,
  quantity = 1,
  selectedVariant = null,
  selectedAddons = [],
  note = "",
}) => {
  const product = getProductById(productId);

  if (!product) return null;

  const variant =
    selectedVariant ||
    product.variants?.[0] ||
    null;

  const addons = selectedAddons || [];

  const existing = cart.items.find(
    (item) =>
      item.productId === productId &&
      item.selectedVariant?.id ===
        variant?.id &&
      JSON.stringify(
        item.selectedAddons
      ) === JSON.stringify(addons)
  );

  const basePrice =
    variant?.price ?? product.price;

  const addonPrice = addons.reduce(
    (sum, addon) =>
      sum + (addon.price || 0),
    0
  );

  const unitPrice =
    basePrice + addonPrice;

  if (existing) {
    existing.quantity += quantity;

    existing.price = unitPrice;

    existing.total =
      unitPrice *
      existing.quantity;

    return getCart();
  }

  cart.items.push({
    id: "CART_" + Date.now(),

    productId,

    sku: product.sku,

    name: product.name,

    image: product.image,

    price: unitPrice,

    selectedVariant: variant,

    selectedAddons: addons,

    note,

    quantity,

    total:
      unitPrice * quantity,
  });

  return getCart();
};

// ===============================
// Update Quantity
// ===============================

const updateCartItem = (
  id,
  quantity
) => {
  const item =
    cart.items.find(
      (i) => i.id === id
    );

  if (!item)
    return null;

  if (quantity <= 0) {
    return removeCartItem(id);
  }

  item.quantity = quantity;

const variantPrice =
  item.selectedVariant?.price ??
  item.price;

const addonPrice =
  (item.selectedAddons || []).reduce(
    (sum, addon) =>
      sum + (addon.price || 0),
    0
  );

item.total =
  (variantPrice + addonPrice) *
  quantity;



  return getCart();
};

// ===============================
// Remove Item
// ===============================

const removeCartItem = (
  id
) => {
  cart.items =
    cart.items.filter(
      (item) =>
        item.id !== id
    );

  return getCart();
};

// ===============================
// Coupon
// ===============================

const applyCoupon = (
  coupon
) => {
  cart.coupon = coupon;

  return getCart();
};

const removeCoupon = () => {
  cart.coupon = null;

  return getCart();
};

// ===============================
// Clear Cart
// ===============================

const clearCart = () => {
  cart.items = [];
  cart.coupon = null;
};

// ===============================
// Cart Count
// ===============================

const getCartCount =
  () =>
    cart.items.reduce(
      (sum, item) =>
        sum + item.quantity,
      0
    );

// ===============================
// Exports
// ===============================

module.exports = {
  getCart,

  addToCart,

  updateCartItem,

  removeCartItem,

  applyCoupon,

  removeCoupon,

  clearCart,

  getCartCount,
};