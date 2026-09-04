import API from "./api";

export const placeGuestOrder = async (table_token, payload) => {
  return await API.post(`/guest-order/place/${table_token}`, payload);
};

export const getGuestOrderStatus = async (order_id) => {
  return await API.get(`/guest-order/status/${order_id}`);
};
