const { menu } = require("./menu");

// =======================================
// Search Menu
// =======================================

const searchMenu = (query = "") => {
  const keyword = query.trim().toLowerCase();

  if (!keyword) return menu;

  return menu.filter((item) => {
    return (
      item.name.toLowerCase().includes(keyword) ||
      item.category.toLowerCase().includes(keyword) ||
      item.description.toLowerCase().includes(keyword) ||
      item.tags.some((tag) =>
        tag.toLowerCase().includes(keyword)
      )
    );
  });
};

// =======================================
// Featured
// =======================================

const getFeaturedProducts = () =>
  menu.filter(
    (item) =>
      item.featured &&
      item.available
  );

// =======================================
// Recommended
// =======================================

const getRecommendedProducts = () =>
  menu.filter(
    (item) =>
      item.recommended &&
      item.available
  );

// =======================================
// Best Sellers
// =======================================

const getBestSellers = () =>
  menu.filter(
    (item) =>
      item.bestseller &&
      item.available
  );

// =======================================
// Categories
// =======================================

const searchCategory = (
  category
) => {
  return menu.filter(
    (item) =>
      item.category.toLowerCase() ===
        category.toLowerCase() &&
      item.available
  );
};

module.exports = {
  searchMenu,

  searchCategory,

  getFeaturedProducts,

  getRecommendedProducts,

  getBestSellers,
};