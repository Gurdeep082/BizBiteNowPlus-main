const router = require("express").Router();

const {
  searchMenu,
  searchCategory,
  getFeaturedProducts,
  getRecommendedProducts,
  getBestSellers,
} = require("../data/search");

// =======================================
// Search Menu
// =======================================

router.get("/", (req, res) => {
  const { q = "" } = req.query;

  res.json({
    success: true,
    data: searchMenu(q),
  });
});

// =======================================
// Search By Category
// =======================================

router.get("/category/:category", (req, res) => {
  res.json({
    success: true,
    data: searchCategory(req.params.category),
  });
});

// =======================================
// Featured Products
// =======================================

router.get("/featured", (req, res) => {
  res.json({
    success: true,
    data: getFeaturedProducts(),
  });
});

// =======================================
// Recommended Products
// =======================================

router.get("/recommended", (req, res) => {
  res.json({
    success: true,
    data: getRecommendedProducts(),
  });
});

// =======================================
// Best Sellers
// =======================================

router.get("/bestsellers", (req, res) => {
  res.json({
    success: true,
    data: getBestSellers(),
  });
});

module.exports = router;