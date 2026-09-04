import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Fixed imports (Swapped path correction)
import NotificationCard from "../../components/customer/notification/NotificationCard";
import NotificationTabs from "../../components/customer/notification/NotificationTabs";
import EmptyNotifications from "../../components/customer/notification/EmptyNotification";

import useNotificationStore from "../../api/stores/customerstore/notificationStore";
import useAuthStore from "../../store/authStore";

const Notifications = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");

  const customerPhone = (() => {
    const state = useAuthStore.getState();
    return state.profile?.customer_phone || state.user?.phone ||
    localStorage.getItem("customer_phone");
  })();

  const {
    notifications,
    unreadCount,
    isLoading,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
  } = useNotificationStore();

  // 1. Initial Load from Backend API
  useEffect(() => {
    if (customerPhone) {
      fetchNotifications(customerPhone);
    }
  }, [customerPhone, fetchNotifications]);

  // 2. Filter Notifications based on active tab
  const filteredNotifications = useMemo(() => {
    if (activeTab === "all") return notifications;

    return notifications.filter((notification) => {
      if (activeTab === "unread") return !notification.is_read && !notification.read;
      if (activeTab === "orders") {
        return (
          notification.type === "ORDER_STATUS" ||
          notification.type === "ORDER_CREATED" ||
          notification.type === "order"
        );
      }
      if (activeTab === "offers") return notification.type === "OFFER" || notification.type === "offer";
      return true;
    });
  }, [notifications, activeTab]);

  // 3. Dynamic Section Grouping (Today, Yesterday, Earlier)
  const groupedNotifications = useMemo(() => {
    const now = new Date();
    const today = now.toDateString();
    const yesterdayDate = new Date(now);
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const yesterday = yesterdayDate.toDateString();

    const groups = {
      Today: [],
      Yesterday: [],
      Earlier: [],
    };

    filteredNotifications.forEach((item) => {
      const dateStr = item.createdAt ? new Date(item.createdAt).toDateString() : "";
      if (dateStr === today) {
        groups.Today.push(item);
      } else if (dateStr === yesterday) {
        groups.Yesterday.push(item);
      } else {
        groups.Earlier.push(item);
      }
    });

    return groups;
  }, [filteredNotifications]);

  // 4. Open & Mark Single Notification as Read
  const openNotification = (notification) => {
    const notifId = notification._id || notification.id;
    if (!notification.is_read && !notification.read) {
      markAsRead(notifId);
    }

    if (notification.order_id) {
      navigate(`/customer/orders/${notification.order_id}`);
    } else if (notification.route) {
      navigate(notification.route);
    }
  };

  return (
    <div className="w-full min-w-0 max-w-[1780px] space-y-6 px-1 pt-4 pb-28 sm:px-2">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="rounded-xl p-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <ArrowLeft size={20} />
          </button>

          <div>
            <h1 className="text-2xl font-bold">Notifications</h1>
            <p className="text-sm text-slate-500">
              {unreadCount} unread notifications
            </p>
          </div>
        </div>

        {notifications.length > 0 && (
          <button
            onClick={markAllAsRead}
            className="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#181A1B] px-4 py-2 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition"
          >
            <CheckCheck size={18} />
            Mark all read
          </button>
        )}
      </div>

      {/* Tabs */}
      <NotificationTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Content Section */}
      <div className="mt-6">
        {isLoading ? (
          <div className="space-y-4 py-4">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="h-20 w-full animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800"
              />
            ))}
          </div>
        ) : filteredNotifications.length === 0 ? (
          <EmptyNotifications
            title="No Notifications Found"
            description="There are no notifications for the selected filter."
          />
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedNotifications).map(([section, items]) => {
              if (items.length === 0) return null;

              return (
                <div key={section}>
                  <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
                    {section}
                  </h2>

                  <motion.div layout className="space-y-3">
                    {items.map((notification, index) => (
                      <motion.div
                        key={notification._id || notification.id}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.04 }}
                      >
                        <NotificationCard
                          notification={{
                            ...notification,
                            read: Boolean(notification.is_read || notification.read),
                            time: notification.createdAt
                              ? new Date(notification.createdAt).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                              : notification.time || "Just now",
                          }}
                          onClick={openNotification}
                        />
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
