import { create } from "zustand";
import API from "../../axios";

// Helper for 10-digit phone number parsing
const cleanPhone = (p) => (p ? String(p).replace(/\D/g, "").slice(-10) : "");

const useNotificationStore = create((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null,

  // 1. Fetch Customer Notifications
  fetchNotifications: async (phone) => {
    const rawPhone = phone || localStorage.getItem("customer_phone");
    const customerPhone = cleanPhone(rawPhone);

    if (!customerPhone) return;

    try {
      set({ isLoading: true, error: null });
      const res = await API.get(`/notifications/customer/${customerPhone}`);

      const list = res.data?.notifications || res.data?.data || [];
      
      // Normalize objects to ensure both `is_read` and `read` keys exist
      const normalizedList = list.map((n) => ({
        ...n,
        is_read: Boolean(n.is_read || n.read),
        read: Boolean(n.is_read || n.read),
      }));

      const unread = normalizedList.filter((n) => !n.is_read).length;

      set({ notifications: normalizedList, unreadCount: unread });
    } catch (err) {
      console.error("Fetch Notifications Error:", err);
      set({ error: err.response?.data?.message || "Failed to load notifications" });
    } finally {
      set({ isLoading: false });
    }
  },

  // 2. Real-time Socket Event Listener Handler
  addRealtimeNotification: (notification) => {
    if (!notification) return;

    set((state) => {
      const notifId = notification._id || notification.id;
      
      // Prevent duplicate additions if socket fires twice
      const exists = state.notifications.some(
        (n) => (n._id || n.id) === notifId
      );
      if (exists) return state;

      const normalized = {
        ...notification,
        is_read: false,
        read: false,
      };

      return {
        notifications: [normalized, ...state.notifications],
        unreadCount: state.unreadCount + 1,
      };
    });
  },

  // 3. Mark Single Notification as Read (Optimistic Instant UI)
  markAsRead: async (notificationId) => {
    if (!notificationId) return;

    // A. Instant Local UI Update (No Lag)
    set((state) => {
      const updatedList = state.notifications.map((n) => {
        const id = n._id || n.id;
        if (String(id) === String(notificationId)) {
          return { ...n, is_read: true, read: true };
        }
        return n;
      });

      const unread = updatedList.filter((n) => !n.is_read).length;
      return { notifications: updatedList, unreadCount: unread };
    });

    // B. Fire Background API Request
    try {
      await API.patch(`/notifications/read/${notificationId}`);
    } catch (err) {
      console.error("Mark Read Backend Error:", err);
    }
  },

  // 4. Mark All Read (Optimistic Instant UI)
  markAllAsRead: async () => {
    const rawPhone = localStorage.getItem("customer_phone");
    const customerPhone = cleanPhone(rawPhone);

    // A. Instant Local UI Reset
    set((state) => ({
      notifications: state.notifications.map((n) => ({
        ...n,
        is_read: true,
        read: true,
      })),
      unreadCount: 0,
    }));

    // B. Fire Background API Request
    try {
      await API.patch("/notifications/read-all", {
        recipientType: "CUSTOMER",
        recipientId: customerPhone,
      });
    } catch (err) {
      console.error("Mark All Read Backend Error:", err);
    }
  },
}));

export default useNotificationStore;