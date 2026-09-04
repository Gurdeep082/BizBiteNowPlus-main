const router = require("express").Router();

const {
  addOrder,
  getCurrentOrders,
  getOrderHistory,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
  deleteOrder,
  getOrderStats,
} = require("../data/orders");

const {
  getCart,
  clearCart,
} = require("../data/cart");

const {
  getStore,
} = require("../data/store");

// =======================================
// Customer Current Order
// =======================================

router.get("/current/:customerId", (req, res) => {
  res.json({
    success: true,
    data: getCurrentOrders(req.params.customerId),
  });
});

// =======================================
// Customer Order History
// =======================================

router.get("/history/:customerId", (req, res) => {
  res.json({
    success: true,
    data: getOrderHistory(req.params.customerId),
  });
});

// =======================================
// Get Order By ID
// =======================================

router.get("/:id", (req, res) => {
  const order = getOrderById(req.params.id);

  if (!order) {
    return res.status(404).json({
      success: false,
      message: "Order not found.",
    });
  }

  res.json({
    success: true,
    data: order,
  });
});

// =======================================
// Place Order
// =======================================

router.post("/", (req, res) => {
  const cart = getCart();
  const store = getStore();

  if (!cart.items.length) {
    return res.status(400).json({
      success: false,
      message: "Cart is empty.",
    });
  }

  const order = {
    id: `ORD-${Date.now()}`,

    storeId: cart.storeId,

    sellerId: cart.sellerId,

    customerId:
      cart.customerId,

    status: "Placed",

    createdAt:
      new Date().toISOString(),

    estimatedDelivery:
      store.delivery.averageTime,

    restaurant: {
      id: store.id,
      name: store.name,
      logo: store.logo,
      rating: store.rating,
      address: store.address,
    },

tracking: {
  currentStep: "placed",

  steps: [
    {
      id: "placed",
      title: "Order Placed",
      completed: true,
      time: new Date().toLocaleTimeString(),
    },
    {
      id: "preparing",
      title: "Preparing Food",
      completed: true,
      time: "",
    },
    {
      id: "ready",
      title: "Ready",
      completed: false,
      time: "",
    },
    {
      id: "onway",
      title: "Out for Delivery",
      completed: false,
      time: "",
    },
    {
      id: "delivered",
      title: "Delivered",
      completed: false,
      time: "",
    },
  ],
},
    items: cart.items,

    summary: cart.summary,

    payment:
      req.body.payment,

    address:
      req.body.address,

    coupon:
      cart.coupon,

    notes:
      req.body.notes || "",

    invoiceNo:
      "INV-" + Date.now(),
  };

  addOrder(order);

// Auto update for demo
setTimeout(() => updateOrderStatus(order.id, "Preparing"), 30000);
setTimeout(() => updateOrderStatus(order.id, "Ready"), 60000);
setTimeout(() => updateOrderStatus(order.id, "Out for Delivery"), 90000);
setTimeout(() => updateOrderStatus(order.id, "Delivered"), 120000);

clearCart();

  res.status(201).json({
    success: true,
    message:
      "Order placed successfully.",
    data: order,
  });
});

// =======================================
// Update Status
// =======================================

router.patch("/:id/status", (req, res) => {
  const order =
    updateOrderStatus(
      req.params.id,
      req.body.status
    );

  if (!order) {
    return res.status(404).json({
      success: false,
      message: "Order not found.",
    });
  }

  res.json({
    success: true,
    message:
      "Order updated successfully.",
    data: order,
  });
});

// =======================================
// Cancel Order
// =======================================

router.patch("/:id/cancel", (req, res) => {
  const order =
    cancelOrder(req.params.id);

  if (!order) {
    return res.status(404).json({
      success: false,
      message: "Order not found.",
    });
  }

  res.json({
    success: true,
    message:
      "Order cancelled.",
    data: order,
  });
});

// =======================================
// Seller - All Orders
// =======================================

router.get("/", (req, res) => {
  res.json({
    success: true,
    data: getAllOrders(),
  });
});

// =======================================
// Seller Dashboard Stats
// =======================================

router.get("/stats/dashboard", (req, res) => {
  res.json({
    success: true,
    data: getOrderStats(),
  });
});

// =======================================
// Delete Order
// =======================================

router.delete("/:id", (req, res) => {
  const deleted =
    deleteOrder(req.params.id);

  if (!deleted) {
    return res.status(404).json({
      success: false,
      message: "Order not found.",
    });
  }

  res.json({
    success: true,
    message:
      "Order deleted successfully.",
  });
});

module.exports = router;