const { menu } = require("../data/menu");

const favorites = [];

// =======================================
// Get Customer Favorites
// =======================================

const getFavorites = (customerId) => {
  return favorites
    .filter(
      (item) => item.customerId === customerId
    )
    .map((favorite) => {
      const product = menu.find(
        (p) => p.id === favorite.productId
      );

      return {
        ...favorite,
        product,
      };
    })
    .filter((item) => item.product);
};

// =======================================
// Check Favorite
// =======================================

const isFavorite = (
  customerId,
  productId
) => {
  return favorites.some(
    (item) =>
      item.customerId === customerId &&
      item.productId === productId
  );
};

// =======================================
// Add Favorite
// =======================================

const addFavorite = ({
  customerId,
  productId,
  storeId,
}) => {
  if (
    isFavorite(
      customerId,
      productId
    )
  ) {
    return null;
  }

  const favorite = {
    id: `FAV_${Date.now()}`,
    customerId,
    productId,
    storeId,
    createdAt:
      new Date().toISOString(),
  };

  favorites.push(favorite);

  const product = menu.find(
    (p) => p.id === productId
  );

  return {
    ...favorite,
    product,
  };
};

// =======================================
// Remove Favorite
// =======================================

const removeFavorite = (
  customerId,
  productId
) => {
  const index =
    favorites.findIndex(
      (item) =>
        item.customerId === customerId &&
        item.productId === productId
    );

  if (index === -1) {
    return false;
  }

  favorites.splice(index, 1);

  return true;
};

// =======================================
// Toggle Favorite
// =======================================

const toggleFavorite = ({
  customerId,
  productId,
  storeId,
}) => {
  if (!customerId || !productId) {
    throw new Error(
      "customerId and productId are required."
    );
  }

  if (
    isFavorite(
      customerId,
      productId
    )
  ) {
    removeFavorite(
      customerId,
      productId
    );

    return {
      favorite: false,
    };
  }

  const favorite = addFavorite({
    customerId,
    productId,
    storeId,
  });

  return {
    favorite: true,
    data: favorite,
  };
};

module.exports = {
  getFavorites,
  isFavorite,
  addFavorite,
  removeFavorite,
  toggleFavorite,
};