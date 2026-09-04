import { create } from "zustand";
import API from "../services/api";

const useBookingStore = create((set, get) => ({
  availableTables: [],
  bookings: [],
  currentBooking: null,
  loading: false,
  error: null,

  fetchAvailableTables: async ({ seller_id, date, start_time, end_time }) => {
    try {
      set({ loading: true, error: null });

      const finalSellerId =
        seller_id ||
        localStorage.getItem("seller_id") ||
        import.meta.env.VITE_DEFAULT_SELLER_ID;

      if (!finalSellerId) {
        throw new Error("No Seller ID found to fetch available tables.");
      }

      const res = await API.get("/booking/available-tables", {
        params: {
          seller_id: finalSellerId,
          date,
          start_time,
          end_time,
        },
      });

      const list = res.data.tables || res.data.data || [];
      set({ availableTables: list });
      return list;
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        "Unable to load available tables";
      set({ error: errorMsg });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  createBookingOrder: async ({
    seller_id,
    table_id,
    customer_name,
    customer_phone,
    guest_count,
    date,
    start_time,
    end_time,
  }) => {
    try {
      set({ loading: true, error: null });

      const res = await API.post("/booking/create", {
        seller_id,
        table_id,
        customer_name,
        customer_phone,
        guest_count,
        date,
        start_time,
        end_time,
      });

      const booking = res.data.booking || res.data.data || null;
      set({ currentBooking: booking });
      return res.data;
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Unable to create booking";
      set({ error: errorMsg });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  verifyBookingPayment: async ({
    booking_id,
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  }) => {
    try {
      set({ loading: true, error: null });

      const res = await API.post("/booking/verify", {
        booking_id,
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      });

      const booking = res.data.booking || res.data.data || null;
      set({ currentBooking: booking });
      return res.data;
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Payment verification failed";
      set({ error: errorMsg });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  fetchBookings: async ({ date, status } = {}) => {
    try {
      set({ loading: true, error: null });
      const finalSellerId =
        localStorage.getItem("seller_id") ||
        import.meta.env.VITE_DEFAULT_SELLER_ID;
      const customerPhone = localStorage.getItem("customer_phone");

      if (!finalSellerId) {
        throw new Error("No Seller ID found to fetch bookings.");
      }

      const res = await API.get("/booking/list", {
        params: {
          date,
          status,
          seller_id: finalSellerId, 
          customer_phone: customerPhone,
        },
      });

      const list = res.data.bookings || res.data.data || [];
      set({ bookings: list });
      return list;
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Unable to load bookings";
      set({ error: errorMsg });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  cancelBooking: async (booking_id) => {
    try {
      set({ loading: true, error: null });

      const res = await API.put(`/booking/cancel/${booking_id}`);
      const updatedBooking = res.data.booking || res.data.data || null;

      set({
        bookings: get().bookings.map((b) =>
          b._id === booking_id
            ? { ...b, status: updatedBooking?.status ?? "cancelled" }
            : b,
        ),
      });
      return res.data;
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Unable to cancel booking";
      set({ error: errorMsg });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  clearCurrentBooking: () => set({ currentBooking: null }),

  reset: () =>
    set({
      availableTables: [],
      bookings: [],
      currentBooking: null,
      loading: false,
      error: null,
    }),
}));

export default useBookingStore;
