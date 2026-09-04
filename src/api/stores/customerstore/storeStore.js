import { create } from "zustand";
import { getStore } from "../../customerApi";

const CACHE_TTL = 5 * 60 * 1000;

let inFlightRequest = null;

const useStoreStore = create((set, get) => ({
  store: null,
  loading: false,
  error: null,
  lastFetched: null,

  fetchStore: async (force = false) => {
    const { store, lastFetched } = get();

    const isFresh =
      store && lastFetched && Date.now() - lastFetched < CACHE_TTL;

    if (isFresh && !force) {
      return store;
    }

    if (inFlightRequest) {
      return inFlightRequest;
    }

    set({ loading: true, error: null });

    inFlightRequest = (async () => {
      try {
        const res = await getStore();
        const storeData = res?.data?.data || null;

        set({
          store: storeData,
          loading: false,
          lastFetched: Date.now(),
        });

        return storeData;
      } catch (err) {
        set({ loading: false, error: err });
        return null;
      } finally {
        inFlightRequest = null;
      }
    })();

    return inFlightRequest;
  },

  clearStore: () => {
    set({ store: null, lastFetched: null, error: null });
  },
}));

export default useStoreStore;
