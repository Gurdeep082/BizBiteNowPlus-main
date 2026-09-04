import { mockProducts, mockOrders, mockBanners, mockDiscounts, mockFestiveDeals, mockTables } from "./customerMockData";
import { products as sellerProducts, categories as sellerCategories } from "./productsData";
import { orders as sellerOrders } from "./ordersData";

export const mockSeller = {
  _id: "mock-seller",
  id: "mock-seller",
  role: "seller",
  business_name: "BizBite Demo Kitchen",
  email: "seller@bizbitenow.com",
  tier: "PLUS",
  store_profile: {
    store_name: "BizBite Demo Kitchen",
    logo: "",
    theme_colors: { primary: "#16522D", secondary: "#14bb54", accent: "#F5F5F5" },
  },
  contact_info: { business_email: "seller@bizbitenow.com", phone: "9999999999" },
  is_open: true,
};

export const mockCustomer = {
  id: "mock-customer",
  name: "Demo Customer",
  phone: "9999999999",
  phoneNumber: "9999999999",
  role: "customer",
  customer_phone: "9999999999",
};

export const mockData = {
  seller: mockSeller,
  customer: mockCustomer,
  products: sellerProducts,
  sellerCategories,
  storefrontProducts: mockProducts,
  orders: sellerOrders,
  customerOrders: mockOrders,
  banners: mockBanners,
  discounts: mockDiscounts,
  festiveDeals: mockFestiveDeals,
  tables: mockTables,
};
