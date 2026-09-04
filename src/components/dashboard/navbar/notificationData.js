export const notifications = [
  {
    id: 1,
    type: "order",
    title: "New Order Received",
    message: "Rahul Sharma placed Order #ORD-1042",
    time: "2 min ago",
    read: false,
  },
  {
    id: 2,
    type: "payment",
    title: "Payment Received",
    message: "₹1,250 credited successfully",
    time: "18 min ago",
    read: false,
  },
  {
    id: 3,
    type: "inventory",
    title: "Low Stock",
    message: "French Fries stock is below threshold",
    time: "1 hour ago",
    read: true,
  },
  {
    id: 4,
    type: "system",
    title: "System Update",
    message: "Dashboard updated successfully",
    time: "Yesterday",
    read: true,
  },
];
export const unreadCount = notifications.filter(
  (notification) => !notification.read
).length;