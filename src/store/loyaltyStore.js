import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { getCustomerLoyaltyStatus, claimLoyaltyReward } from "../api/loyalty";

const useLoyaltyStore = create(
  devtools(
    (set) => ({
      // STATES

      active: true,
      threshold: 5,
      stampsCollected: 0,
      rewardType: "item",
      rewardDetail: "a reward",
      customerName: null,
      rewardsHistory: [],
      rewardCoupon: null,
      rewardItem: null,

      loading: false,
      claiming: false,
      error: null,

      // FETCH LOYALTY STATUS

      fetchLoyaltyStatus: async (sellerId, customerPhone) => {
        try {
          set(
            { loading: true, error: null },
            false,
            "fetchLoyaltyStatus/pending",
          );
          const data = await getCustomerLoyaltyStatus(sellerId, customerPhone);
          const raw = data?.data || data;

          set(
            {
              active: raw?.active ?? true,
              threshold: raw?.max_stamps ?? 5,
              stampsCollected: raw?.stamps_earned ?? 0,
              customerName: raw?.customer_name ?? null,
              rewardsHistory: raw?.rewards_history ?? [],
            },
            false,
            "fetchLoyaltyStatus/success",
          );

          return raw;
        } catch (err) {
          set(
            {
              error:
                err.response?.data?.message || "Could not load loyalty status",
            },
            false,
            "fetchLoyaltyStatus/error",
          );
          throw err;
        } finally {
          set({ loading: false }, false, "fetchLoyaltyStatus/settled");
        }
      },

      // CLAIM LOYALTY REWARD

      claimReward: async (sellerId, customerPhone) => {
        try {
          set({ claiming: true, error: null }, false, "claimReward/pending");
          const data = await claimLoyaltyReward(sellerId, customerPhone);
          const raw = data?.data || data;
          const coupon = raw?.reward_coupon ?? raw?.coupon ?? null;

          set(
            { rewardCoupon: coupon, rewardItem: raw?.reward_item ?? null },
            false,
            "claimReward/success",
          );
          return raw;
        } catch (err) {
          set(
            {
              error: err.response?.data?.message || "Could not claim reward",
            },
            false,
            "claimReward/error",
          );
          throw err;
        } finally {
          set({ claiming: false }, false, "claimReward/settled");
        }
      },

      clearError: () => set({ error: null }, false, "clearError"),
    }),
    { name: "LoyaltyStore" },
  ),
);

export default useLoyaltyStore;
