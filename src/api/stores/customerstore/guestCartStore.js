import { create } from "zustand";
import { persist } from "zustand/middleware";

const useGuestCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      table_token: null,

      // Avoid notifying subscribers when the active table has not changed.
      // This is important for pages that sync the route token on mount.
      setTableToken: (token) => {
        if (get().table_token !== token) {
          set({ table_token: token });
        }
      },

      addToCart: (product) => {
        const items = get().items;

        const variant = product?.selectedVariant || null;
        const addons = product?.selectedAddons || [];

        const hasBaseOffer =
          product?.offer_price !== null && product?.offer_price !== undefined;

        const variantName = variant
          ? variant.name || variant.variant_name
          : null;
        const hasVariantOffer =
          variant?.offer_price !== null && variant?.offer_price !== undefined;

        let unitPrice;
        let originalPrice;
        let variantData = null;

        if (variant) {
          const variantAbsolutePrice = Number(variant.price_delta) || 0;
          unitPrice = hasVariantOffer
            ? Number(variant.offer_price)
            : variantAbsolutePrice;
          originalPrice = variantAbsolutePrice;
          variantData = {
            name: variantName,
            price: variantAbsolutePrice,
            ...(hasVariantOffer && {
              offer_price: Number(variant.offer_price),
            }),
          };
        } else {
          unitPrice = hasBaseOffer
            ? Number(product.offer_price)
            : Number(product.price);
          originalPrice = Number(product.price);
        }

        const existing = items.find(
          (i) =>
            i.product_id === product.id &&
            (i.variant?.name || null) === variantName,
        );

        if (existing) {
          set({
            items: items.map((i) =>
              i === existing ? { ...i, quantity: i.quantity + 1 } : i,
            ),
          });
        } else {
          set({
            items: [
              ...items,
              {
                product_id: product.id,
                name: product.name,
                image: product.image,
                price: unitPrice,
                original_price: originalPrice,
                tax_percent: Number(product.tax_percent) || 0,
                ...(!variant &&
                  hasBaseOffer && { offer_price: Number(product.offer_price) }),
                ...(variantData && { variant: variantData }),
                ...(addons.length > 0 && {
                  addons: addons.map((a) => ({
                    name: a.name || a,
                    price: Number(a.price) || 0,
                  })),
                }),
                quantity: 1,
                instruction: "",
              },
            ],
          });
        }
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set({
          items: get().items.map((i) =>
            i.product_id === productId ? { ...i, quantity } : i,
          ),
        });
      },

      removeItem: (productId) => {
        set({ items: get().items.filter((i) => i.product_id !== productId) });
      },

      setInstruction: (productId, instruction) => {
        set({
          items: get().items.map((i) =>
            i.product_id === productId ? { ...i, instruction } : i,
          ),
        });
      },

      getTotal: () => {
        return get().items.reduce((sum, i) => {
          const addonsTotal = Array.isArray(i.addons)
            ? i.addons.reduce((s, a) => s + (Number(a.price) || 0), 0)
            : 0;
          const unit = Number(i.price || 0) + addonsTotal;
          return sum + unit * i.quantity;
        }, 0);
      },

      clearCart: () => set({ items: [] }),

      clearGuestSession: () => set({ items: [], table_token: null }),
    }),
    { name: "guest-cart-storage" },
  ),
);

export default useGuestCartStore;
