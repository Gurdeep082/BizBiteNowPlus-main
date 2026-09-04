const reviews = [];

// =======================================
// Get All Reviews
// =======================================

const getReviews = () => reviews;

// =======================================
// Restaurant Reviews
// =======================================

const getRestaurantReviews = (storeId) =>
  reviews.filter(
    (review) =>
      review.storeId === storeId
  );

// =======================================
// Product Reviews
// =======================================

const getProductReviews = (productId) =>
  reviews.filter(
    (review) =>
      review.productId === productId
  );

// =======================================
// Customer Reviews
// =======================================

const getCustomerReviews = (customerId) =>
  reviews.filter(
    (review) =>
      review.customerId === customerId
  );

// =======================================
// Add Review
// =======================================

const addReview = (review) => {
  const newReview = {
    id: `REV_${Date.now()}`,

    createdAt:
      new Date().toISOString(),

    ...review,
  };

  reviews.unshift(newReview);

  return newReview;
};

// =======================================
// Get Review
// =======================================

const getReview = (id) =>
  reviews.find(
    (review) =>
      review.id === id
  );

// =======================================
// Update Review
// =======================================

const updateReview = (
  id,
  data
) => {
  const review =
    getReview(id);

  if (!review)
    return null;

  Object.assign(
    review,
    data
  );

  review.updatedAt =
    new Date().toISOString();

  return review;
};

// =======================================
// Delete Review
// =======================================

const deleteReview = (
  id
) => {
  const index =
    reviews.findIndex(
      (review) =>
        review.id === id
    );

  if (index === -1)
    return false;

  reviews.splice(index, 1);

  return true;
};

module.exports = {
  getReviews,

  getRestaurantReviews,

  getProductReviews,

  getCustomerReviews,

  addReview,

  getReview,

  updateReview,

  deleteReview,
};