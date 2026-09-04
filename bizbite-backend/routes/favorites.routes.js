const router = require("express").Router();

const {
  getFavorites,
  isFavorite,
  addFavorite,
  removeFavorite,
  toggleFavorite,
} = require("../data/favorites");



// =======================================
// Get Customer Favorites
// =======================================

router.get("/:customerId", (req, res) => {
  res.json({
    success: true,
    data: getFavorites(req.params.customerId),
  });
});

// =======================================
// Check Favorite
// =======================================

router.get("/:customerId/:productId", (req, res) => {
  res.json({
    success: true,
    favorite: isFavorite(
      req.params.customerId,
      req.params.productId
    ),
  });
});

// =======================================
// Add Favorite
// =======================================

router.post("/", (req, res) => {
  const favorite = addFavorite(req.body);

  if (!favorite) {
    return res.status(400).json({
      success: false,
      message: "Already in favorites.",
    });
  }

  res.status(201).json({
    success: true,
    message: "Added to favorites.",
    data: favorite,
  });
});

// =======================================
// Toggle Favorite
// =======================================

router.post("/toggle", (req, res) => {
  

  const result = toggleFavorite(req.body);

  

  res.json({
    success: true,
    data: result,
  });
});

// =======================================
// Remove Favorite
// =======================================

router.delete("/:customerId/:productId", (req, res) => {
  const removed = removeFavorite(
    req.params.customerId,
    req.params.productId
  );

  if (!removed) {
    return res.status(404).json({
      success: false,
      message: "Favorite not found.",
    });
  }

  res.json({
    success: true,
    message: "Removed from favorites.",
  });
});

module.exports = router;