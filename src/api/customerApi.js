import api from "../../src/api/axios";

// Helper function to get seller_id safely (with URL query params fallback)
const getSellerId = () => {
  let sellerId =
    localStorage.getItem("seller_id") ||
    localStorage.getItem("current_seller_id");

  if (!sellerId && typeof window !== "undefined") {
    const urlParams = new URLSearchParams(window.location.search);
    sellerId =
      urlParams.get("seller_id") ||
      urlParams.get("storeId") ||
      urlParams.get("store");
  }

  if (!sellerId) {
    try {
      const rawAuth = localStorage.getItem("bizbite-auth");
      if (rawAuth) {
        const { profile, user } = JSON.parse(rawAuth)?.state || {};
        sellerId = profile?.seller_id || user?.seller_id;
      }
    } catch (e) {
      console.error("Failed to parse auth for seller_id", e);
    }
  }

  if (!sellerId) {
    sellerId = import.meta.env.VITE_DEFAULT_SELLER_ID;
  }

  return sellerId;
};

// Helper function to get customer phone safely
const getCustomerPhone = () => {
  let phone = localStorage.getItem("customer_phone");
  if (!phone) {
    try {
      const rawAuth = localStorage.getItem("bizbite-auth");
      if (rawAuth) {
        const { profile, user } = JSON.parse(rawAuth)?.state || {};
        phone = profile?.customer_phone || user?.phoneNumber || user?.phone;
      }
    } catch (e) {
      console.error("Failed to parse auth for phone", e);
    }
  }
  return phone;
};

/* =========================================================================
   CUSTOMER API ENDPOINTS
   ========================================================================= */

// 1. Get Store Details
export const getStore = async (sellerId = getSellerId()) => {
  if (!sellerId) {
    console.warn("Seller ID missing in getStore, skipping or returning null");
    return { data: null };
  }
  return await api.get(`/customer/store/${sellerId}`);
};

// 2. Get Menu List
export const getMenu = async (sellerId = getSellerId()) => {
  if (!sellerId) throw new Error("Seller ID missing");
  return await api.get(`/customer/menu/${sellerId}`);
};

// 3. Get Today Special Products
export const getTodaySpecialProducts = async (sellerId = getSellerId()) => {
  if (!sellerId) throw new Error("Seller ID missing");
  return await api.get(`/customer/menu/today-special/${sellerId}`);
};

// 4. Get Combo Meal Products
// export const getComboMealProducts = async (sellerId = getSellerId()) => {
//   if (!sellerId) throw new Error("Seller ID missing");
//   return await api.get(`/customer/menu/combo-meals/${sellerId}`);
// };

// 5. Get Recently Ordered Products
export const getRecentlyOrderedProducts = async (
  sellerId = getSellerId(),
  phone = getCustomerPhone()
) => {
  if (!sellerId) throw new Error("Seller ID missing");
  return await api.get(`/customer/recently-ordered`, {
    params: { seller_id: sellerId, customer_phone: phone },
  });
};

// 6. Single Product Details (Hits GET /api/products/:id - 🟢 Fixed endpoint path)
export const getProduct = async (productId) => {
  if (!productId) throw new Error("Product ID missing");
  return await api.get(`/products/${productId}`);
};
export const getProductById = getProduct;

// 7. Favorites / Favourites Endpoints
export const getFavorites = async (
  sellerId = getSellerId(),
  phone = getCustomerPhone()
) => {
  return await api.get(`/product/favorites`, {
    params: { seller_id: sellerId, customer_phone: phone },
  });
};
export const getFavourites = getFavorites;

export const toggleFavorite = async (data) => {
  return await api.post(`/product/toggle`, data);
};
export const toggleFavourite = toggleFavorite;

// 8. Notifications Endpoints
export const getCustomerNotifications = async (phone = getCustomerPhone()) => {
  if (!phone) {
    console.warn("Customer phone missing, skipping notifications API call");
    return { data: [] };
  }
  return await api.get(`/notifications/customer/${phone}`);
};
export const getNotifications = getCustomerNotifications;