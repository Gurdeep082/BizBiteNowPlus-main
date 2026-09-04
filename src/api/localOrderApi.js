import { mockOrders } from "../data/customerMockData";

const findOrder = (url) => {
  const id = url.split("/").filter(Boolean).pop();
  return mockOrders.find((order) => String(order._id || order.id) === String(id)) || null;
};

const localOrderApi = {
  get: async (url) => {
    if (url.includes("track")) {
      return { data: { tracking: { status: "preparing", steps: [] } } };
    }
    if (url !== "/my-orders" && url !== "/customer-orders") {
      return { data: { order: findOrder(url) } };
    }
    return { data: { orders: mockOrders, data: mockOrders } };
  },
  post: async (url, payload = {}) => ({
    data: { order: { _id: `mock-order-${Date.now()}`, ...payload }, success: true },
  }),
  put: async (url, payload = {}) => ({ data: { order: { ...findOrder(url), ...payload }, success: true } }),
  patch: async (url, payload = {}) => ({ data: { order: { ...findOrder(url), ...payload }, success: true } }),
  delete: async () => ({ data: { success: true } }),
};

export default localOrderApi;
