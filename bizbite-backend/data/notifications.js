const notifications = [];

// =======================================
// Create Notification
// =======================================

const addNotification = ({
  storeId,
  sellerId,
  customerId,
  title,
  message,
  type = "general",
}) => {
  const notification = {
    id: `NOTIFY_${Date.now()}`,

    storeId,

    sellerId,

    customerId,

    title,

    message,

    type,

    read: false,

    createdAt: new Date().toISOString(),
  };

  notifications.unshift(notification);

  return notification;
};

// =======================================
// Get Customer Notifications
// =======================================

const getCustomerNotifications = (
  customerId
) => {
  return notifications.filter(
    (notification) =>
      notification.customerId === customerId
  );
};

// =======================================
// Get Seller Notifications
// =======================================

const getSellerNotifications = (
  sellerId
) => {
  return notifications.filter(
    (notification) =>
      notification.sellerId === sellerId
  );
};

// =======================================
// Get Notification
// =======================================

const getNotification = (id) => {
  return (
    notifications.find(
      (notification) =>
        notification.id === id
    ) || null
  );
};

// =======================================
// Mark As Read
// =======================================

const markAsRead = (id) => {
  const notification =
    getNotification(id);

  if (!notification) return null;

  notification.read = true;

  return notification;
};

// =======================================
// Mark All As Read
// =======================================

const markAllAsRead = (
  customerId
) => {
  notifications.forEach(
    (notification) => {
      if (
        notification.customerId ===
        customerId
      ) {
        notification.read = true;
      }
    }
  );

  return getCustomerNotifications(
    customerId
  );
};

// =======================================
// Delete Notification
// =======================================

const deleteNotification = (
  id
) => {
  const index =
    notifications.findIndex(
      (notification) =>
        notification.id === id
    );

  if (index === -1)
    return false;

  notifications.splice(index, 1);

  return true;
};

// =======================================
// Notification Count
// =======================================

const getUnreadCount = (
  customerId
) => {
  return notifications.filter(
    (notification) =>
      notification.customerId ===
        customerId &&
      !notification.read
  ).length;
};

module.exports = {
  addNotification,

  getCustomerNotifications,

  getSellerNotifications,

  getNotification,

  markAsRead,

  markAllAsRead,

  deleteNotification,

  getUnreadCount,
};