import { create } from "zustand";
import { persist } from "zustand/middleware";
import { mockCustomer } from "../data/mockData";

const useAuthStore = create(
  persist(
    (set) => ({
      // STATES

      user: mockCustomer,
      token: "mock-session-token",
      role: "customer",
      profile: mockCustomer,

      loading: false,
      error: null,

      verificationToken: null,
      reqId: null,
      loginRole: null, // role returned by login/init, used to decide OTP vs direct PIN

      isAuthenticated: true,

      // LOGIN INIT (Step 1 - checks role, sends OTP if Seller)

      loginInit: async (payload) => {
        set({ loginRole: "customer", reqId: "mock-request", loading: false, error: null });
        return { role: "customer", reqId: "mock-request", phone: payload?.phoneNumber };
      },

      // LOGIN

      login: async (payload) => {
        const user = { ...mockCustomer, phone: payload?.phoneNumber || mockCustomer.phone };
        const data = { token: "mock-session-token", user, profile: user };
        set({ ...data, role: "customer", isAuthenticated: true, loading: false, error: null });
        return data;
      },

      // REGISTER SELLER

      registerSeller: async (payload) => {
        return { success: true, data: { ...payload, ...mockCustomer, role: "seller" } };
      },

      // REGISTER CUSTOMER

      registerCustomer: async (payload) => {
        return { success: true, data: { ...mockCustomer, ...payload } };
      },

      // SEND OTP

      sendOTP: async (payload) => {
        return { success: true, otp: "1234", ...payload };
      },

      // VERIFY OTP

      verifyOTP: async (payload) => {
        set({ verificationToken: "mock-verification-token" });
        return { success: true, verificationToken: "mock-verification-token", ...payload };
      },

      // RESEND OTP

      resendOTP: async (payload) => {
        return { success: true, otp: "1234", ...payload };
      },

      // VERIFY ACCESS TOKEN

      verifyAccessToken: async (payload) => {
        return { success: true, ...payload };
      },

      // FORGOT PIN

      forgotPin: async (payload) => {
        return { success: true, ...payload };
      },

      // RESET PIN

      resetPin: async (payload) => {
        return { success: true, ...payload };
      },

      // CHANGE PIN

      changePin: async (payload) => {
        return { success: true, ...payload };
      },

      // PATCH PROFILE (local update after a successful save, no re-login needed)

      setProfile: (patch) => {
        set((state) => ({ profile: { ...state.profile, ...patch } }));
      },

      // LOGOUT

      logout: () => {
        set({
          user: null,
          token: null,
          role: null,
          profile: null,
          verificationToken: null,
          reqId: null,
          loginRole: null,
          isAuthenticated: false,
          error: null,
        });

        // Other parts of the app fall back to reading these raw keys
        // directly instead of the (now-cleared) store state — leaving them
        // behind lets the next person on a shared device inherit the
        // previous user's seller/customer identity.
        [
          "seller_id",
          "current_seller_id",
          "seller",
          "customer_phone",
          "customer_token",
          "customerId",
          "resolvedTable",
          "bizbite_customer_cart",
          "token",
          "user",
          "appliedCoupon",
        ].forEach((key) => localStorage.removeItem(key));

        // cartStore persists itself under "bizbite_customer_cart" — removing
        // the raw key above isn't enough, its in-memory state would just
        // write itself straight back on the next render. Dynamic import to
        // avoid a circular import (cartStore imports this store).
        import("../api/stores/customerstore/cartStore").then((m) =>
          m.default.getState().clearCart(),
        );
      },
    }),

    {
      name: "bizbite-auth",
    },
  ),
);

export default useAuthStore;
