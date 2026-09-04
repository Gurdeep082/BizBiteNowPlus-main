import { create } from "zustand";
import API from "../services/api";

const useSettingStore = create((set) => ({
  sellerProfile: null,
  isLoading: false,
  error: null,

  // GET /seller/me
  fetchSellerProfile: async () => {
    try {
      set({ isLoading: true, error: null });
      const res = await API.get("/seller/me");
      const sellerData = res.data.seller || res.data.data || res.data;
      set({ sellerProfile: sellerData });
      return sellerData;
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Unable to fetch seller profile";
      set({ error: msg });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  // PUT /seller/me  { section, data }
  updateProfileSection: async (section, data) => {
    try {
      set({ isLoading: true, error: null });
      const payload = { section, data };
      const res = await API.put("/seller/me", payload);
      const updatedSeller = res.data.seller || res.data.data || res.data;

      set({ sellerProfile: updatedSeller });
      return res.data;
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.error || "Failed to update profile settings";
      set({ error: msg });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  // PUT /seller/profile/branding (multipart)
  updateBranding: async (formData) => {
    try {
      set({ isLoading: true, error: null });
      const res = await API.put("/seller/profile/branding", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      // API doc: Response is { success, message, store_profile } — the
      // updated store_profile SUB-object, not the full seller. Nest it
      // back under sellerProfile.store_profile rather than spreading its
      // fields onto the top level of sellerProfile.
      const updatedStoreProfile = res.data.store_profile || res.data.seller?.store_profile || res.data;

      set((state) => ({
        sellerProfile: state.sellerProfile
          ? { ...state.sellerProfile, store_profile: updatedStoreProfile }
          : { store_profile: updatedStoreProfile },
      }));

      return res.data;
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.error || "Failed to update branding";
      set({ error: msg });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  // POST /seller/complete-onboarding
  completeOnboarding: async (onboardingData) => {
    try {
      set({ isLoading: true, error: null });
      const res = await API.post("/seller/complete-onboarding", onboardingData);
      const updatedSeller = res.data.seller || res.data.data || res.data;
      set({ sellerProfile: updatedSeller });
      return res.data;
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.error || "Failed to complete onboarding";
      set({ error: msg });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  // PUT /seller/me/location
  updateLocation: async (latitude, longitude) => {
    try {
      set({ isLoading: true, error: null });
      const res = await API.put("/seller/me/location", {
        latitude: Number(latitude),
        longitude: Number(longitude),
      });
      const updatedLocation = res.data.store_location;

      set((state) => ({
        sellerProfile: state.sellerProfile
          ? { ...state.sellerProfile, store_location: updatedLocation }
          : null,
      }));

      return res.data;
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.error || "Failed to update store location";
      set({ error: msg });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  // POST /users/change-pin — this is NOT part of /seller/me. PIN/password
  // change is a separate auth endpoint, needs currentPin/newPin/confirmPin.
  changePin: async (currentPin, newPin, confirmPin) => {
    try {
      set({ isLoading: true, error: null });
      const res = await API.post("/users/change-pin", {
        currentPin,
        newPin,
        confirmPin,
      });
      return res.data;
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.error || "Failed to change PIN";
      set({ error: msg });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  // DELETE /seller/me — soft-deactivates seller + linked user, clears cookie
  deactivateAccount: async () => {
    try {
      set({ isLoading: true, error: null });
      const res = await API.delete("/seller/me");
      set({ sellerProfile: null });
      return res.data;
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.error || "Failed to deactivate account";
      set({ error: msg });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  // POST /seller/logout
  logout: async () => {
    try {
      set({ isLoading: true, error: null });
      const res = await API.post("/seller/logout");
      set({ sellerProfile: null });
      return res.data;
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.error || "Failed to log out";
      set({ error: msg });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  clearError: () => set({ error: null }),
  reset: () => set({ sellerProfile: null, isLoading: false, error: null }),
}));

export default useSettingStore;