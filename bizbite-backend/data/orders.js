const orders = [];

// ===============================
// Add Order
// ===============================

const addOrder = (order) => {
  orders.unshift(order);
  return order;
};

// ===============================
// Current Active Order
// ===============================

// ===============================
// Current Active Orders
// ===============================

const getCurrentOrders = (customerId) => {
  return orders
    .filter(
      (order) =>
        order.customerId === customerId &&
        [
          "Placed",
          "Confirmed",
          "Preparing",
          "Ready",
          "Out for Delivery",
        ].includes(order.status)
    )
    .sort(
      (a, b) =>
        new Date(b.createdAt) -
        new Date(a.createdAt)
    );
};

// ===============================
// Order History
// ===============================

const getOrderHistory = (customerId) => {
  return orders
    .filter(
      (order) =>
        order.customerId === customerId &&
        ["Delivered", "Cancelled"].includes(order.status)
    )
    .sort(
      (a, b) =>
        new Date(b.createdAt) -
        new Date(a.createdAt)
    );
};

// ===============================
// Get Order By ID
// ===============================

const getOrderById = (id) => {
  return (
    orders.find(
      (order) => order.id === id
    ) || null
  );
};

// ===============================
// Update Order Status
// ===============================

const updateOrderStatus = (
  id,
  status
) => {
  const order = orders.find(
    (item) => item.id === id
  );

  if (!order) return null;

order.status = status;

switch (status) {
  case "Placed":
    order.tracking.currentStep = "placed";
    break;

  case "Preparing":
    order.tracking.currentStep = "preparing";

    order.tracking.steps[1].completed = true;
    order.tracking.steps[1].time =
      new Date().toLocaleTimeString();

    break;

  case "Ready":
    order.tracking.currentStep = "ready";

    order.tracking.steps[2].completed = true;
    order.tracking.steps[2].time =
      new Date().toLocaleTimeString();

    break;

  case "Out for Delivery":
    order.tracking.currentStep = "onway";

    order.tracking.steps[3].completed = true;
    order.tracking.steps[3].time =
      new Date().toLocaleTimeString();

    break;

  case "Delivered":
    order.tracking.currentStep = "delivered";

    order.tracking.steps[4].completed = true;
    order.tracking.steps[4].time =
      new Date().toLocaleTimeString();

    break;
}

  return order;
};

module.exports = {
  addOrder,
  getCurrentOrders,
  getOrderHistory,
  getOrderById,
  updateOrderStatus,
};