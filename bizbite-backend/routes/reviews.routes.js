const router = require("express").Router();

const {
  getRestaurantReviews,
  getProductReviews,
  getCustomerReviews,
  addReview,
  updateReview,
  deleteReview,
} = require("../data/reviews");

// =======================================
// Get Restaurant Reviews
// =======================================

router.get("/restaurant/:storeId", (req, res) => {
  res.json({
    success: true,
    data: getRestaurantReviews(req.params.storeId),
  });
});

// =======================================
// Get Product Reviews
// =======================================

router.get("/product/:productId", (req, res) => {
  res.json({
    success: true,
    data: getProductReviews(req.params.productId),
  });
});

// =======================================
// Get Customer Reviews
// =======================================

router.get("/customer/:customerId", (req, res) => {
  res.json({
    success: true,
    data: getCustomerReviews(req.params.customerId),
  });
});

// =======================================
// Add Review
// =======================================

router.post("/", (req, res) => {
  const review = addReview(req.body);

  res.status(201).json({
    success: true,
    message: "Review added successfully.",
    data: review,
  });
});

// =======================================
// Update Review
// =======================================

router.patch("/:id", (req, res) => {
  const review = updateReview(
    req.params.id,
    req.body
  );

  if (!review) {
    return res.status(404).json({
      success: false,
      message: "Review not found.",
    });
  }

  res.json({
    success: true,
    message: "Review updated successfully.",
    data: review,
  });
});

// =======================================
// Delete Review
// =======================================

router.delete("/:id", (req, res) => {
  const deleted = deleteReview(req.params.id);

  if (!deleted) {
    return res.status(404).json({
      success: false,
      message: "Review not found.",
    });
  }

  res.json({
    success: true,
    message: "Review deleted successfully.",
  });
});

module.exports = router;