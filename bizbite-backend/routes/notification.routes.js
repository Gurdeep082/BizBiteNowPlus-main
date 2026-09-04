const router = require("express").Router();

const {
  addNotification,

  getCustomerNotifications,

  getSellerNotifications,

  getNotification,

  markAsRead,

  markAllAsRead,

  deleteNotification,

  getUnreadCount,
} = require("../data/notifications");

// =======================================
// Get Customer Notifications
// =======================================

router.get("/customer/:customerId", (req, res) => {
  res.json({
    success: true,
    data: getCustomerNotifications(
      req.params.customerId
    ),
  });
});

// =======================================
// Get Seller Notifications
// =======================================

router.get("/seller/:sellerId", (req, res) => {
  res.json({
    success: true,
    data: getSellerNotifications(
      req.params.sellerId
    ),
  });
});

// =======================================
// Get Single Notification
// =======================================

router.get("/:id", (req, res) => {
  const notification = getNotification(
    req.params.id
  );

  if (!notification) {
    return res.status(404).json({
      success: false,
      message: "Notification not found.",
    });
  }

  res.json({
    success: true,
    data: notification,
  });
});

// =======================================
// Add Notification
// =======================================

router.post("/", (req, res) => {
  const notification = addNotification(
    req.body
  );

  res.status(201).json({
    success: true,
    message: "Notification created successfully.",
    data: notification,
  });
});

// =======================================
// Get Unread Count
// =======================================

router.get(
  "/customer/:customerId/unread-count",
  (req, res) => {
    res.json({
      success: true,
      data: {
        unread: getUnreadCount(
          req.params.customerId
        ),
      },
    });
  }
);

// =======================================
// Mark Notification As Read
// =======================================

router.patch("/:id/read", (req, res) => {
  const notification = markAsRead(
    req.params.id
  );

  if (!notification) {
    return res.status(404).json({
      success: false,
      message: "Notification not found.",
    });
  }

  res.json({
    success: true,
    message: "Notification marked as read.",
    data: notification,
  });
});

// =======================================
// Mark All As Read
// =======================================

router.patch(
  "/customer/:customerId/read-all",
  (req, res) => {
    markAllAsRead(
      req.params.customerId
    );

    res.json({
      success: true,
      message:
        "All notifications marked as read.",
    });
  }
);

// =======================================
// Delete Notification
// =======================================

router.delete("/:id", (req, res) => {
  const deleted = deleteNotification(
    req.params.id
  );

  if (!deleted) {
    return res.status(404).json({
      success: false,
      message: "Notification not found.",
    });
  }

  res.json({
    success: true,
    message: "Notification deleted successfully.",
  });
});

module.exports = router;