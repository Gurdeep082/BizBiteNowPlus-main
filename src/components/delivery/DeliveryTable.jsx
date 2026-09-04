import React, { useState } from "react";
import OrderModal from "./OrderModal";

const getStatusColor = (status) => {
  switch (status) {
    case "Pending":
      return "bg-yellow-100 text-yellow-700";

    case "Picked Up":
      return "bg-blue-100 text-blue-700";

    case "Out for Delivery":
      return "bg-purple-100 text-purple-700";

    case "Delivered":
      return "bg-green-100 text-green-700";

    default:
      return "bg-gray-100 text-gray-700";
  }
};

const DeliveryTable = ({ orders, setOrders }) => {
  const [selectedOrder, setSelectedOrder] = useState(null);

  const updateStatus = (id) => {
    const updatedOrders = orders.map((order) => {
      if (order.id === id) {
        if (order.status === "Pending") {
          return { ...order, status: "Picked Up" };
        }

        if (order.status === "Picked Up") {
          return { ...order, status: "Out for Delivery" };
        }

        if (order.status === "Out for Delivery") {
          return { ...order, status: "Delivered" };
        }
      }

      return order;
    });

    setOrders(updatedOrders);
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-md p-5 mt-6 overflow-x-auto">
        <h2 className="text-xl font-semibold mb-5">
          Delivery Orders
        </h2>

        <table className="w-full">
          <thead>
            <tr className="border-b text-left">
              <th className="py-6">Order ID</th>
              <th>Customer</th>
              <th>Address</th>
              <th>Items</th>
              <th>Status</th>
              <th className="text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr
                key={order.id}
                className="border-b hover:bg-gray-50"
              >
                <td className="py-4 font-semibold">
                  {order.id}
                </td>

                <td>{order.customer}</td>

                <td>{order.address}</td>

                <td>{order.items}</td>

                <td>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </td>

                <td className="flex gap-2 py-3">

                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg"
                  >
                    View
                  </button>

                  <button
                    onClick={() => updateStatus(order.id)}
                    disabled={order.status === "Delivered"}
                    className={`px-3 py-2 rounded-lg text-white transition ${
                      order.status === "Delivered"
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-amber-500 hover:bg-amber-600"
                    }`}
                  >
                    {order.status === "Pending" &&
                      "Pick Up"}

                    {order.status === "Picked Up" &&
                      "Out For Delivery"}

                    {order.status ===
                      "Out for Delivery" &&
                      "Deliver"}

                    {order.status === "Delivered" &&
                      "Completed"}
                  </button>

                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <OrderModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />
    </>
  );
};

export default DeliveryTable;