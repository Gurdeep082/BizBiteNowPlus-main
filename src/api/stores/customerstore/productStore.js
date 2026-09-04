import { create } from "zustand";
import { mockProducts } from "../../../../data/customerMockData";

const useProductStore = create((set) => ({
  storefront: [],
  fullMenu: [],
  productDetail: null,
  loading: false,
  error: null,

  // Customer storefront uses the bundled catalog instead of a backend request.
  fetchStorefrontCatalog: async (sellerId) => {
    if (!sellerId) return [];
    set({ storefront: mockProducts, loading: false, error: null });
    return mockProducts;
  },

  // Categories are derived from the bundled catalog and returned in the shape the menu screen expects.
  fetchFullMenu: async (sellerId) => {
    if (!sellerId) return [];

    const grouped = mockProducts.reduce((acc, product) => {
      const categoryName = product.category || "Other";
      if (!acc[categoryName]) {
        acc[categoryName] = { _id: categoryName, id: categoryName, name: categoryName, products: [] };
      }
      acc[categoryName].products.push(product);
      return acc;
    }, {});

    const categories = Object.values(grouped);
    set({ fullMenu: categories, storefront: mockProducts, loading: false, error: null });
    return categories;
  },

  fetchStorefrontCategories: async (sellerId) => {
    if (!sellerId) return [];
    const categories = [...new Set(mockProducts.map((product) => product.category))];
    set({ categories });
    return categories;
  },

  // Product details come from the same bundled catalog.
  fetchProductById: async (productId) => {
    const product = mockProducts.find((item) => String(item._id || item.id) === String(productId)) || null;
    set({ productDetail: product, loading: false, error: product ? null : "Product not found" });
    return product;
  },
}));

export default useProductStore;