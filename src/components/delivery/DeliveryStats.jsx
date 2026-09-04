import React from "react";

const DeliveryStats = ({ orders }) => {
  const total = orders.length;
  const pending = orders.filter(
    (order) => order.status === "Pending"
  ).length;

  const pickedUp = orders.filter(
    (order) => order.status === "Picked Up"
  ).length;

  const delivered = orders.filter(
    (order) => order.status === "Delivered"
  ).length;

  const cards = [
    {
      title: "Total Orders",
      value: total,
    },
    {
      title: "Pending",
      value: pending,
    },
    {
      title: "Picked Up",
      value: pickedUp,
    },
    {
      title: "Delivered",
      value: delivered,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
      {cards.map((card, index) => (
        <div
          key={index}
          className="bg-white rounded-xl shadow-md p-5"
        >
          <h3 className="text-gray-500 text-sm">
            {card.title}
          </h3>

          <p className="text-3xl font-bold text-amber-600 mt-2">
            {card.value}
          </p>
        </div>
      ))}
    </div>
  );
};

export default DeliveryStats;