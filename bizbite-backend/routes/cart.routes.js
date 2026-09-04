const router = require("express").Router();

const {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  applyCoupon,
  removeCoupon,
  clearCart,
  getCartCount,
} = require("../data/cart");

// =======================================
// Get Cart
// =======================================

router.get("/", (req, res) => {
  res.json({
    success: true,
    data: getCart(),
  });
});

// =======================================
// Get Cart Count
// =======================================

router.get("/count", (req, res) => {
  res.json({
    success: true,
    count: getCartCount(),
  });
});

// =======================================
// Add Item To Cart
// =======================================

router.post("/", (req, res) => {
  const cart = addToCart(req.body);

  if (!cart) {
    return res.status(404).json({
      success: false,
      message: "Product not found.",
    });
  }

  res.status(201).json({
    success: true,
    message: "Item added to cart.",
    data: cart,
  });
});

// =======================================
// Update Quantity
// =======================================

router.patch("/:id", (req, res) => {
  const cart = updateCartItem(
    req.params.id,
    req.body.quantity
  );

  if (!cart) {
    return res.status(404).json({
      success: false,
      message: "Cart item not found.",
    });
  }

  res.json({
    success: true,
    message: "Cart updated.",
    data: cart,
  });
});

// =======================================
// Remove Item
// =======================================

router.delete("/:id", (req, res) => {
  const cart = removeCartItem(req.params.id);

  res.json({
    success: true,
    message: "Item removed.",
    data: cart,
  });
});

// =======================================
// Apply Coupon
// =======================================

router.post("/coupon", (req, res) => {
  const cart = applyCoupon(req.body);

  res.json({
    success: true,
    message: "Coupon applied.",
    data: cart,
  });
});

// =======================================
// Remove Coupon
// =======================================

router.delete("/coupon", (req, res) => {
  const cart = removeCoupon();

  res.json({
    success: true,
    message: "Coupon removed.",
    data: cart,
  });
});

// =======================================
// Clear Cart
// =======================================

router.delete("/", (req, res) => {
  clearCart();

  res.json({
    success: true,
    message: "Cart cleared.",
  });
});

module.exports = router;