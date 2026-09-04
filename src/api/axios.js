import { mockData } from "../data/mockData";

const response = (data) => Promise.resolve({ data });

const localDataFor = (url) => {
  if (url.includes("seller/me")) return { seller: mockData.seller };
  if (url.includes("products")) return { products: mockData.products, data: mockData.products };
  if (url.includes("orders")) return { orders: mockData.orders, data: mockData.orders };
  if (url.includes("discount")) return { discounts: mockData.discounts, data: mockData.discounts };
  if (url.includes("festive-deals")) return { deals: mockData.festiveDeals, data: mockData.festiveDeals };
  if (url.includes("tables")) return { tables: mockData.tables, data: mockData.tables };
  if (url.includes("categories")) return { categories: mockData.sellerCategories, data: mockData.sellerCategories };
  if (url.includes("store")) return { data: mockData.seller };
  return { success: true, data: [] };
};

const API = {
  defaults: { headers: { common: {} } },
  get: (url) => response(localDataFor(url)),
  post: (url, payload) => response({ success: true, data: payload || {}, ...localDataFor(url) }),
  put: (url, payload) => response({ success: true, data: payload || {}, ...localDataFor(url) }),
  patch: (url, payload) => response({ success: true, data: payload || {}, ...localDataFor(url) }),
  delete: (url) => response({ success: true, data: {} }),
};

export default API;
