const {
  getAllOrders,
} = require("./orders");

const {
  menu,
} = require("./menu");

// =======================================
// Overview
// =======================================

const getOverview = () => {
  const orders = getAllOrders();

  const revenue = orders
    .filter(
      (order) =>
        order.status === "Delivered"
    )
    .reduce(
      (sum, order) =>
        sum + order.summary.total,
      0
    );

  const totalOrders =
    orders.length;

  const completedOrders =
    orders.filter(
      (order) =>
        order.status === "Delivered"
    ).length;

  const cancelledOrders =
    orders.filter(
      (order) =>
        order.status === "Cancelled"
    ).length;

  const activeOrders =
    orders.filter((order) =>
      [
        "Placed",
        "Confirmed",
        "Preparing",
        "Out for Delivery",
      ].includes(order.status)
    ).length;

  return {
    revenue,

    totalOrders,

    activeOrders,

    completedOrders,

    cancelledOrders,

    averageOrderValue:
      totalOrders > 0
        ? Math.round(
            revenue /
              totalOrders
          )
        : 0,
  };
};

// =======================================
// Revenue Chart
// =======================================

const getRevenueChart = () => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  return months.map(
    (month, index) => {
      const revenue =
        getAllOrders()
          .filter(
            (order) =>
              new Date(
                order.createdAt
              ).getMonth() ===
                index &&
              order.status ===
                "Delivered"
          )
          .reduce(
            (
              sum,
              order
            ) =>
              sum +
              order.summary.total,
            0
          );

      return {
        month,
        revenue,
      };
    }
  );
};

// =======================================
// Order Status
// =======================================

const getOrderStatus = () => {
  const orders =
    getAllOrders();

  return [
    {
      name: "Placed",
      value:
        orders.filter(
          (o) =>
            o.status ===
            "Placed"
        ).length,
    },
    {
      name: "Preparing",
      value:
        orders.filter(
          (o) =>
            o.status ===
            "Preparing"
        ).length,
    },
    {
      name:
        "Out for Delivery",
      value:
        orders.filter(
          (o) =>
            o.status ===
            "Out for Delivery"
        ).length,
    },
    {
      name: "Delivered",
      value:
        orders.filter(
          (o) =>
            o.status ===
            "Delivered"
        ).length,
    },
    {
      name: "Cancelled",
      value:
        orders.filter(
          (o) =>
            o.status ===
            "Cancelled"
        ).length,
    },
  ];
};

// =======================================
// Top Selling Products
// =======================================

const getTopProducts = () => {
  const sales = {};

  getAllOrders().forEach(
    (order) => {
      order.items.forEach(
        (item) => {
          if (
            !sales[item.productId]
          ) {
            sales[
              item.productId
            ] = {
              productId:
                item.productId,

              name: item.name,

              image:
                item.image,

              sold: 0,

              revenue: 0,
            };
          }

          sales[
            item.productId
          ].sold +=
            item.quantity;

          sales[
            item.productId
          ].revenue +=
            item.total;
        }
      );
    }
  );

  return Object.values(
    sales
  ).sort(
    (a, b) =>
      b.sold - a.sold
  );
};

// =======================================
// Inventory Summary
// =======================================

const getInventorySummary =
  () => ({
    totalProducts:
      menu.length,

    available:
      menu.filter(
        (item) =>
          item.available
      ).length,

    outOfStock:
      menu.filter(
        (item) =>
          item.stock === 0
      ).length,

    lowStock:
      menu.filter(
        (item) =>
          item.stock > 0 &&
          item.stock <= 10
      ).length,
  });

module.exports = {
  getOverview,

  getRevenueChart,

  getOrderStatus,

  getTopProducts,

  getInventorySummary,
};