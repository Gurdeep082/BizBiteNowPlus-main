import { create } from "zustand";
import API from "../services/api";
import { FESTIVE_VALIDITY_DAYS } from "../data/occasionTemplate";

const toISODate = (date) => new Date(date).toISOString().split("T")[0];

const addDays = (date, days) => {
  const d = new Date(date);
  d.setDate(d.getDate() + Number(days || 0));
  return d;
};

const formatDiscountBadge = (type, value) => {
  if (type === "delivery") return "FREE DELIVERY";
  if (type === "percentage") return `${value}% OFF`;
  return `₹${value} OFF`;
};

const FALLBACK_TEMPLATES = [
  {
    id: "diwali",
    label: "Diwali",
    isFestive: true,
    discountType: "percentage",
    discountValue: 20,
    minOrder: 199,
    maxDiscount: 150,
    messageTemplate:
      "✨ Happy Diwali from {shopName}! Enjoy {discountBadge} on orders above ₹{minOrder}. Use code {discountCode} — valid till {validityEnd}. Order now! 🪔",
  },
  {
    id: "holi",
    label: "Holi",
    isFestive: true,
    discountType: "percentage",
    discountValue: 15,
    minOrder: 149,
    maxDiscount: 100,
    messageTemplate:
      "🎨 Happy Holi from {shopName}! Get {discountBadge} on orders above ₹{minOrder}. Use code {discountCode} — valid till {validityEnd}. Colour your day with great food! 🎉",
  },
  {
    id: "weekend",
    label: "Weekend Special",
    isFestive: true,
    discountType: "flat",
    discountValue: 50,
    minOrder: 249,
    maxDiscount: 50,
    messageTemplate:
      "🎉 Weekend treat from {shopName}! {discountBadge} on orders above ₹{minOrder}. Use code {discountCode} — valid till {validityEnd}.",
  },
  {
    id: "generic",
    label: "Custom Offer",
    isFestive: false,
    discountType: "percentage",
    discountValue: 10,
    minOrder: 99,
    maxDiscount: 100,
    messageTemplate:
      "🎁 Special offer from {shopName}! Enjoy {discountBadge} on orders above ₹{minOrder}. Use code {discountCode} — valid till {validityEnd}.",
  },
];

const today = toISODate(new Date());

const emptyState = {
  customers: [],
  templates: FALLBACK_TEMPLATES,
  recipientMode: "all",
  selectedCustomerIds: [],
  customerSearch: "",
  templateId: FALLBACK_TEMPLATES[0].id,
  discountType: FALLBACK_TEMPLATES[0].discountType,
  discountValue: FALLBACK_TEMPLATES[0].discountValue,
  minOrder: FALLBACK_TEMPLATES[0].minOrder,
  maxDiscount: FALLBACK_TEMPLATES[0].maxDiscount,
  validityMode: "festive",
  validityStart: today,
  validityEnd: toISODate(addDays(today, 3)),
  message: "",
  discountCode: "FESTIVE20",
  loading: false,
  sending: false,
  sentCount: null,
  error: null,
};

const useSpecialOfferStore = create((set, get) => ({
  ...emptyState,

  fetchCustomers: async () => {
    try {
      set({ loading: true, error: null });
      const customerMap = new Map();

      try {
        const res = await API.get("/orders/customers");
        const registered = res.data?.customers || res.data?.data || res.data || [];
        if (Array.isArray(registered)) {
          registered.forEach((c) => {
            const phone = c.phone || c.customer_phone;
            if (phone) {
              const cleanPhone = String(phone).replace(/\D/g, "").trim();
              customerMap.set(cleanPhone, {
                id: c._id || c.id || cleanPhone,
                name: c.name || c.customer_name || "Customer",
                phone: cleanPhone,
                orders: c.orders_count || c.orders || 0,
              });
            }
          });
        }
      } catch {}

      try {
        const res = await API.get("/orders/list");
        const orders = res.data?.orders || res.data?.data || res.data || [];
        if (Array.isArray(orders)) {
          orders.forEach((o) => {
            const phone = o.customer_phone || o.phone || o.customerPhone || o.customer?.phone || "";
            const name = o.customer_name || o.customerName || o.customer?.name || "Customer";
            if (phone) {
              const cleanPhone = String(phone).replace(/\D/g, "").trim();
              if (cleanPhone.length >= 8) {
                if (!customerMap.has(cleanPhone)) {
                  customerMap.set(cleanPhone, {
                    id: o._id || o.id || cleanPhone,
                    name,
                    phone: cleanPhone,
                    orders: 1,
                  });
                } else {
                  const existing = customerMap.get(cleanPhone);
                  existing.orders += 1;
                }
              }
            }
          });
        }
      } catch {}

      const allList = Array.from(customerMap.values());
      set({ customers: allList });
      return allList;
    } catch (err) {
      set({ customers: [] });
      return [];
    } finally {
      set({ loading: false });
    }
  },

  fetchTemplates: async () => {
    set({ templates: FALLBACK_TEMPLATES });
    return FALLBACK_TEMPLATES;
  },

  setTemplateId: (id, shopName) => {
    const template = get().templates.find((t) => String(t.id) === String(id));
    if (!template) return;
    const isFestive = !!template.isFestive;
    const start = today;
    const days = FESTIVE_VALIDITY_DAYS[id] ?? 3;
    const end = isFestive ? toISODate(addDays(start, days)) : get().validityEnd || toISODate(addDays(start, 7));

    set({
      templateId: id,
      discountType: template.discountType,
      discountValue: template.discountValue,
      minOrder: template.minOrder,
      maxDiscount: template.maxDiscount,
      validityMode: isFestive ? "festive" : "custom",
      validityStart: start,
      validityEnd: end,
    });
    get().updateMessage(shopName);
  },

  updateMessage: (shopName) => {
    const state = get();
    const template = state.templates.find((t) => String(t.id) === String(state.templateId));
    const base = template?.messageTemplate || "🎁 Special offer from {shopName}! Use code {discountCode}.";

    const msg = base
      .replaceAll("{shopName}", shopName || "Your Shop")
      .replaceAll("{discountBadge}", formatDiscountBadge(state.discountType, state.discountValue))
      .replaceAll("{minOrder}", String(state.minOrder ?? 0))
      .replaceAll("{discountCode}", state.discountCode || "OFFER")
      .replaceAll(
        "{validityEnd}",
        state.validityEnd
          ? new Date(state.validityEnd).toLocaleDateString("en-IN", { day: "numeric", month: "short" })
          : ""
      );

    set({ message: msg });
  },

  setMessage: (message) => set({ message }),
  setDiscountCode: (discountCode) => set({ discountCode }),
  setRecipientMode: (recipientMode) => set({ recipientMode }),
  setCustomerSearch: (customerSearch) => set({ customerSearch }),

  toggleCustomer: (id) =>
    set((state) => ({
      selectedCustomerIds: state.selectedCustomerIds.includes(id)
        ? state.selectedCustomerIds.filter((cid) => cid !== id)
        : [...state.selectedCustomerIds, id],
    })),

  selectAllFiltered: (customers) =>
    set((state) => ({
      selectedCustomerIds: Array.from(new Set([...state.selectedCustomerIds, ...customers.map((c) => c.id)])),
    })),

  clearSelection: () => set({ selectedCustomerIds: [] }),
  setDiscountType: (discountType) => set({ discountType }),
  setDiscountValue: (discountValue) => set({ discountValue }),
  setMinOrder: (minOrder) => set({ minOrder }),
  setMaxDiscount: (maxDiscount) => set({ maxDiscount }),
  setValidityStart: (validityStart) => set({ validityStart, validityMode: "custom" }),
  setValidityEnd: (validityEnd) => set({ validityEnd, validityMode: "custom" }),

  sendOffer: async (totalCount) => {
    const state = get();
    const targetCustomers =
      state.recipientMode === "all"
        ? state.customers
        : state.customers.filter((c) => state.selectedCustomerIds.includes(c.id));
    const count = targetCustomers.length || totalCount;

    set({ sending: true, error: null, sentCount: null });
    try {
      if (targetCustomers.length === 1 && targetCustomers[0].phone) {
        const phone = targetCustomers[0].phone.replace(/\D/g, "");
        const formatted = phone.length === 10 ? `91${phone}` : phone;
        window.open(`https://wa.me/${formatted}?text=${encodeURIComponent(state.message)}`, "_blank");
      }
      set({ sentCount: count });
      return count;
    } catch (err) {
      set({ error: "Unable to process offer dispatch." });
      throw err;
    } finally {
      set({ sending: false });
    }
  },

  clearError: () => set({ error: null }),
  reset: () => set({ ...emptyState }),
}));

export default useSpecialOfferStore;