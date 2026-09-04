import { create } from "zustand";
import API from "../services/api";

// Backend routes this store talks to (see customer.routes.js):
//   GET    /api/customer/mohallas/:seller_id
//   GET    /api/customer/address/list/:customer_phone
//   POST   /api/customer/address/add
//   PATCH  /api/customer/address/update/:id
//   PUT    /api/customer/address/set-default
//   DELETE /api/customer/address/delete/:customer_phone/:address_id
//   POST   /api/customer/address/save        (legacy single-address upsert)
//   PUT    /api/customer/update/:id
//   DELETE /api/customer/delete/:id

const extractList = (data, keys = ["addresses", "data"]) => {
  for (const key of keys) {
    if (Array.isArray(data?.[key])) return data[key];
  }
  return Array.isArray(data) ? data : [];
};

const addressIdOf = (a) => a?._id || a?.id;

const useCustomerProfileStore = create((set, get) => ({
  // ===========================
  // STATE
  // ===========================
  mohallas: [],
  addresses: [],
  loadingAddresses: false,
  addressError: null,
  savingAddress: false,

  // ===========================
  // MOHALLAS
  // ===========================
  getMohallas: async (sellerId) => {
    if (!sellerId) return [];
    try {
      const res = await API.get(`/customer/mohallas/${sellerId}`);
      const list = extractList(res.data, ["mohallas", "data"]);
      set({ mohallas: list });
      return list;
    } catch (err) {
      console.error("getMohallas failed:", err.response?.data || err.message);
      set({ mohallas: [] });
      throw err;
    }
  },

  // ===========================
  // 🟢 MULTI-ADDRESS CRUD
  // ===========================

  fetchAddresses: async (customerPhone, sellerId) => {
    if (!customerPhone) return [];
    set({ loadingAddresses: true, addressError: null });
    try {
      const res = await API.get(`/customer/address/list/${customerPhone}`, {
        params: sellerId ? { seller_id: sellerId } : {},
      });
      const list = extractList(res.data);
      set({ addresses: list, loadingAddresses: false });
      return list;
    } catch (err) {
      console.error(
        "fetchAddresses failed:",
        err.response?.data || err.message,
      );
      set({
        loadingAddresses: false,
        addressError: err.response?.data?.message || "Could not load addresses",
        addresses: [],
      });
      return [];
    }
  },

  addAddress: async (payload) => {
    set({ savingAddress: true, addressError: null });
    try {
      const finalPayload = {
        ...payload,
        delivery_address:
          payload.delivery_address ||
          `${payload.address || ""}, ${payload.mohalla || ""}`.trim(),
      };

      const res = await API.post("/customer/address/add", finalPayload);
      const list = extractList(res.data);
      if (list.length) {
        set({ addresses: list, savingAddress: false });
      } else {
        set({ savingAddress: false });
        await get().fetchAddresses(payload.customer_phone, payload.seller_id);
      }
      return res.data;
    } catch (err) {
      console.error("addAddress failed:", err.response?.data || err.message);
      set({
        savingAddress: false,
        addressError: err.response?.data?.message || "Could not add address",
      });
      throw err;
    }
  },

  updateAddress: async (addressId, payload) => {
    set({ savingAddress: true, addressError: null });
    try {
      const res = await API.patch(
        `/customer/address/update/${addressId}`,
        payload,
      );
      const list = extractList(res.data);
      if (list.length) {
        set({ addresses: list, savingAddress: false });
      } else {
        set((state) => ({
          savingAddress: false,
          addresses: state.addresses.map((a) =>
            addressIdOf(a) === addressId ? { ...a, ...payload } : a,
          ),
        }));
      }
      return res.data;
    } catch (err) {
      console.error("updateAddress failed:", err.response?.data || err.message);
      set({
        savingAddress: false,
        addressError: err.response?.data?.message || "Could not update address",
      });
      throw err;
    }
  },

  setDefaultAddress: async (customerPhone, addressId, sellerId) => {
    set({ addressError: null });
    const previous = get().addresses;
    set({
      addresses: previous.map((a) => ({
        ...a,
        default: addressIdOf(a) === addressId,
      })),
    });
    try {
      const res = await API.put("/customer/address/set-default", {
        customer_phone: customerPhone,
        address_id: addressId,
        seller_id: sellerId,
      });
      const list = extractList(res.data);
      if (list.length) set({ addresses: list });
      return res.data;
    } catch (err) {
      console.error(
        "setDefaultAddress failed:",
        err.response?.data || err.message,
      );
      set({
        addresses: previous,
        addressError:
          err.response?.data?.message || "Could not set default address",
      });
      throw err;
    }
  },

  // 🟢 FIXED: seller_id ab query param ke through backend ko bheja ja raha hai
  // (backend controller req.seller / req.user / req.query.seller_id se seller_id
  // uthata hai, aur is route par auth middleware attach nahi hai — pehle
  // seller_id kahin se bhi nahi ja raha tha isliye "Seller context required" error aata tha)
  deleteAddress: async (customerPhone, addressId, sellerId) => {
    set({ addressError: null });
    const previous = get().addresses;
    set({ addresses: previous.filter((a) => addressIdOf(a) !== addressId) });
    const resolvedSellerId =
      sellerId ||
      localStorage.getItem("seller_id") ||
      import.meta.env.VITE_DEFAULT_SELLER_ID;
    try {
      const res = await API.delete(
        `/customer/address/delete/${customerPhone}/${addressId}`,
        { params: resolvedSellerId ? { seller_id: resolvedSellerId } : {} },
      );
      return res.data;
    } catch (err) {
      console.error("deleteAddress failed:", err.response?.data || err.message);
      set({
        addresses: previous,
        addressError: err.response?.data?.message || "Could not delete address",
      });
      throw err;
    }
  },

  clearAddressError: () => set({ addressError: null }),

  // ===========================
  // Legacy single-address upsert
  // ===========================
  saveAddress: async (payload) => {
    try {
      const res = await API.post("/customer/address/save", payload);
      return res.data;
    } catch (err) {
      console.error("saveAddress failed:", err.response?.data || err.message);
      throw err;
    }
  },

  // ===========================
  // PROFILE / ACCOUNT
  // ===========================
  updateProfile: async (customerId, payload) => {
    try {
      const res = await API.put(`/customer/update/${customerId}`, payload);
      const updatedCustomer = res.data?.customer || res.data?.data;

      if (updatedCustomer) {
        set((state) => ({
          profile: {
            ...(state.profile || {}),
            customer_name: updatedCustomer.name,
            name: updatedCustomer.name,
          },
        }));
      }

      return res.data;
    } catch (err) {
      console.error("updateProfile failed:", err.response?.data || err.message);
      throw err;
    }
  },

  deleteAccount: async (customerId) => {
    try {
      const res = await API.delete(`/customer/delete/${customerId}`);
      return res.data;
    } catch (err) {
      console.error("deleteAccount failed:", err.response?.data || err.message);
      throw err;
    }
  },
}));

export default useCustomerProfileStore;