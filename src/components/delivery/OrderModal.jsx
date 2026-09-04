import React from "react";

const OrderModal = ({ order, onClose }) => {
  if (!order) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

      <div className="bg-white w-[420px] rounded-xl shadow-xl p-6">

        <h2 className="text-2xl font-bold mb-5">
          Order Details
        </h2>

        <div className="space-y-3">

          <p><strong>Order ID:</strong> {order.id}</p>

          <p><strong>Customer:</strong> {order.customer}</p>

          <p><strong>Phone:</strong> {order.phone}</p>

          <p><strong>Address:</strong> {order.address}</p>

          <p><strong>Items:</strong> {order.items}</p>

          <p><strong>Total:</strong> {order.total}</p>

          <p><strong>Status:</strong> {order.status}</p>

        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600"
        >
          Close
        </button>

      </div>

    </div>
  );
};

export default OrderModal;