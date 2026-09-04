import { create } from "zustand";

const extractId = (item) => {
  if (!item) return "";
  if (typeof item === "string") return item;
  return String(
    item.id ||
      item._id ||
      item.product_id?._id ||
      item.product_id?.id ||
      item.product_id ||
      "",
  );
};

const getItemId = (item) => String(item?._id || item?.id || item?.product_id || "");

const useCartStore = create((set, get) => ({
  items: [],
  cart: null,
  isLoading: false,
  error: null,

  fetchCart: async () => get().items,

  addToCart: async (productData, quantity = 1) => {
    const targetId = extractId(productData);
    if (!targetId) return;

    const addQty = Number(quantity || productData?.quantity || 1);

    const variant = productData?.selectedVariant || null;
    const addons = productData?.selectedAddons || [];

    const hasBaseOffer =
      productData?.offer_price !== null &&
      productData?.offer_price !== undefined;
    const hasVariantOffer =
      variant?.offer_price !== null && variant?.offer_price !== undefined;

    const itemPrice = hasVariantOffer ? Number(variant.offer_price) : hasBaseOffer ? Number(productData.offer_price) : Number(productData.price || 0) + Number(variant?.price_delta || 0);
    const existing = get().items.find((item) => getItemId(item) === targetId);
    const item = {
      _id: existing?._id || `cart-${targetId}`,
      product_id: productData,
      name: productData.name,
      image: productData.image,
      price: itemPrice,
      quantity: (existing?.quantity || 0) + addQty,
      ...(variant && { variant_name: variant.name || variant.variant_name }),
      ...(addons.length > 0 && { addons }),
    };
    const items = existing ? get().items.map((entry) => getItemId(entry) === targetId ? item : entry) : [...get().items, item];
    set({ items, cart: { items } });
    return { success: true, cart: { items }, item };
  },

  updateQuantity: async (itemId, quantity) => {
    const targetId = String(itemId);
    const newQty = Number(quantity);

    const items = newQty <= 0
      ? get().items.filter((item) => getItemId(item) !== targetId)
      : get().items.map((item) => getItemId(item) === targetId ? { ...item, quantity: newQty } : item);
    set({ items, cart: { items } });
    return { success: true, cart: { items } };
  },

  setInstruction: async (itemId, text) => {
    const targetId = String(itemId);

    set((state) => ({
      items: state.items.map((i) =>
        String(i._id || i.id) === targetId
          ? { ...i, special_instructions: text }
          : i,
      ),
    }));

    return { success: true, cart: { items: get().items } };
  },

  removeItem: async (itemId) => {
    const targetId = String(itemId);

    const items = get().items.filter((item) => getItemId(item) !== targetId);
    set({ items, cart: { items } });
    return { success: true, cart: { items } };
  },

  clearCart: async () => {
    set({ items: [], cart: null });
    return { success: true };
  },

  updateCartItem: async (itemId, quantity) =>
    get().updateQuantity(itemId, quantity),
  removeCartItem: async (itemId) => get().removeItem(itemId),
}));

export default useCartStore;
