const router = require("express").Router();

const {
  getStore,
  updateStore,
} = require("../data/store");

// =======================================
// Get Store
// =======================================

router.get("/", (req, res) => {
  res.json({
    success: true,
    data: getStore(),
  });
});

// =======================================
// Update Store
// =======================================

router.patch("/", (req, res) => {
  const store = updateStore(req.body);

  res.json({
    success: true,
    message: "Store updated successfully.",
    data: store,
  });
});

// =======================================
// Store Status
// =======================================

router.get("/status", (req, res) => {
  const store = getStore();

  res.json({
    success: true,
    data: {
      isOpen: store.timings.status === "Open",
      status: store.timings.status,
      open: store.timings.open,
      close: store.timings.close,
      averageDeliveryTime:
        store.delivery.averageTime,
      rating: store.rating,
      totalReviews: store.totalReviews,
    },
  });
});

// =======================================
// Contact Details
// =======================================

router.get("/contact", (req, res) => {
  const store = getStore();

  res.json({
    success: true,
    data: {
      phone: store.phone,
      email: store.email,
      social: store.social,
    },
  });
});

// =======================================
// Address
// =======================================

router.get("/address", (req, res) => {
  const store = getStore();

  res.json({
    success: true,
    data: store.address,
  });
});

module.exports = router;