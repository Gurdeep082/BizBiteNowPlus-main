import api from "../axios";

const BASE_URL = "/cart";

/*                               REQUEST WRAPPER                              */

const request = async (callback) => {
  try {
    const { data } = await callback();
    return data;
  } catch (error) {
    throw normalizeApiError(error);
  }
};

/*                                   CART                                     */

export const getCart = (config = {}) =>
  request(() => api.get(BASE_URL, config));

export const addToCart = (payload, config = {}) =>
  request(() => api.post(`${BASE_URL}/add`, payload, config));

export const updateCartItem = (itemId, quantity, config = {}) =>
  request(() => api.patch(`${BASE_URL}/item/${itemId}`, { quantity }, config));

export const removeCartItem = (itemId, config = {}) =>
  request(() => api.delete(`${BASE_URL}/item/${itemId}`, config));

export const clearCart = (config = {}) =>
  request(() => api.delete(`${BASE_URL}/clear`, config));

/*                              ERROR HANDLER                                 */

function normalizeApiError(error) {
  if (error?.response) {
    return {
      success: false,
      status: error.response.status,
      message: error.response.data?.message || "Request failed.",
      errors: error.response.data?.errors ?? null,
      data: error.response.data ?? null,
    };
  }

  if (error?.request) {
    return {
      success: false,
      status: 0,
      message: "Network error. Please check your internet connection.",
      errors: null,
      data: null,
    };
  }

  return {
    success: false,
    status: 0,
    message: error?.message || "Something went wrong.",
    errors: null,
    data: null,
  };
}
