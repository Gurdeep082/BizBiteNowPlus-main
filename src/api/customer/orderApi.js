import api from "../axios";

const BASE_URL = "/orders";

/**
 * Generic Request Wrapper
 */
const request = async (callback) => {
  try {
    const { data } = await callback();
    return data;
  } catch (error) {
    throw normalizeApiError(error);
  }
};

/* -------------------------------------------------------------------------- */
/*                                  ORDERS                                    */
/* -------------------------------------------------------------------------- */

export const createOrder = (payload, config = {}) =>
  request(() =>
    api.post(`${BASE_URL}/create`, payload, config)
  );

export const getCustomerOrders = (params = {}, config = {}) =>
  request(() =>
    api.get(`${BASE_URL}/customer-orders`, {
      params,
      ...config,
    })
  );

export const getCustomerOrder = (orderId, config = {}) =>
  request(() =>
    api.get(`${BASE_URL}/${orderId}`, config)
  );

export const reorder = (payload, config = {}) =>
  request(() =>
    api.post(`${BASE_URL}/reorder`, payload, config)
  );

export const cancelOrder = (orderId, config = {}) =>
  request(() =>
    api.patch(`${BASE_URL}/${orderId}/cancel`, {}, config)
  );

export const trackOrder = (orderId, config = {}) =>
  request(() =>
    api.get(`${BASE_URL}/${orderId}/track`, config)
  );

/* -------------------------------------------------------------------------- */
/*                                CHECKOUT                                    */
/* -------------------------------------------------------------------------- */

export const initiateCheckout = (payload, config = {}) =>
  request(() =>
    api.post(
      `${BASE_URL}/checkout/initiate`,
      payload,
      config
    )
  );

export const verifyCheckout = (payload, config = {}) =>
  request(() =>
    api.post(
      `${BASE_URL}/checkout/verify`,
      payload,
      config
    )
  );

/* -------------------------------------------------------------------------- */
/*                                 DINE-IN                                    */
/* -------------------------------------------------------------------------- */

export const createDineInOrder = (
  payload,
  config = {}
) =>
  request(() =>
    api.post(
      `${BASE_URL}/dine-in/create`,
      payload,
      config
    )
  );

/* -------------------------------------------------------------------------- */
/*                              ERROR HANDLER                                 */
/* -------------------------------------------------------------------------- */

function normalizeApiError(error) {
  if (error?.response) {
    return {
      success: false,
      status: error.response.status,
      message:
        error.response.data?.message ||
        "Request failed.",
      errors: error.response.data?.errors ?? null,
      data: error.response.data ?? null,
    };
  }

  if (error?.request) {
    return {
      success: false,
      status: 0,
      message:
        "Network error. Please check your internet connection.",
      errors: null,
      data: null,
    };
  }

  return {
    success: false,
    status: 0,
    message:
      error?.message || "Something went wrong.",
    errors: null,
    data: null,
  };
}