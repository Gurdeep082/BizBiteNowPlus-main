import { create } from "zustand";
import API from "../api/axios";

const useSellerNotificationStore = create((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,

  // Fetch Seller Notifications
  fetchNotifications: async (sellerId) => {
    const activeSellerId = sellerId || localStorage.getItem("seller_id");
    if (!activeSellerId) return;

    try {
      set({ isLoading: true });
      const res = await API.get(`/notifications/seller/${activeSellerId}`);
      const list = res.data?.notifications || res.data?.data || [];
      
      const unread = list.filter((n) => !n.is_read && !n.read).length;

      set({ notifications: list, unreadCount: unread, isLoading: false });
    } catch (err) {
      console.error("Fetch Seller Notifications Error:", err);
      set({ isLoading: false });
    }
  },

  // Realtime Socket Add
  addRealtimeNotification: (notif) => {
    if (!notif) return;
    set((state) => {
      const exists = state.notifications.some(
        (n) => (n._id || n.id) === (notif._id || notif.id)
      );
      if (exists) return state;

      return {
        notifications: [notif, ...state.notifications],
        unreadCount: state.unreadCount + 1,
      };
    });
  },

  // Mark Single Notification as Read
  markAsRead: async (id) => {
    if (!id) return;

    // Optimistic UI update
    set((state) => {
      const updated = state.notifications.map((n) =>
        (n._id || n.id) === id ? { ...n, is_read: true, read: true } : n
      );
      const unread = updated.filter((n) => !n.is_read && !n.read).length;
      return { notifications: updated, unreadCount: unread };
    });

    try {
      await API.patch(`/notifications/read/${id}`);
    } catch (err) {
      console.error("Mark Read Error:", err);
    }
  },

  // Mark All Read
  markAllAsRead: async () => {
    const activeSellerId = localStorage.getItem("seller_id");

    set((state) => ({
      notifications: state.notifications.map((n) => ({
        ...n,
        is_read: true,
        read: true,
      })),
      unreadCount: 0,
    }));

    try {
      await API.patch("/notifications/read-all", {
        recipientType: "SELLER",
        recipientId: activeSellerId,
      });
    } catch (err) {
      console.error("Mark All Read Error:", err);
    }
  },
}));

export default useSellerNotificationStore;