import React, { useState } from "react";
import DeliveryProfileCard from "../../../components/delivery/DeliveryProfileCard";
import TodayEarnings from "../../../components/delivery/TodayEarnings";
import DeliveryStats from "../../../components/delivery/DeliveryStats";
import DeliveryTable from "../../../components/delivery/DeliveryTable";

export default function DeliveryDashboard() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [isOnline, setIsOnline] = useState(true);

  // Search & Filter
  const filteredOrders = orders.filter((order) => {
    const matchSearch =
      order.id.toLowerCase().includes(search.toLowerCase()) ||
      order.customer.toLowerCase().includes(search.toLowerCase());

    const matchFilter = filter === "All" ? true : order.status === filter;

    return matchSearch && matchFilter;
  });

  // Dynamic Earnings
  const completedOrders = orders.filter(
    (order) => order.status === "Delivered",
  ).length;

  return (
    <div className="min-h-screen bg-amber-50 p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-amber-700">
            Delivery Dashboard
          </h1>

          <p className="text-gray-500 mt-1">Manage all delivery orders</p>
        </div>

        {/* Animated Toggle Switch */}
        <div className="flex items-center gap-3">
          <span
            className={`text-sm font-semibold ${
              isOnline ? "text-green-600" : "text-red-600"
            }`}>
            {isOnline ? "Online" : "Offline"}
          </span>

          <button
            type="button"
            onClick={() => setIsOnline(!isOnline)}
            className={`relative w-16 h-8 rounded-full transition-all duration-300 ${
              isOnline ? "bg-green-500" : "bg-gray-400"
            }`}>
            <div
              className={`absolute top-1 left-1 w-6 h-6 rounded-full bg-white shadow-md transition-all duration-300 ${
                isOnline ? "translate-x-8" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      </div>

      {/* Delivery Partner */}
      <DeliveryProfileCard isOnline={isOnline} />

      {/* Earnings */}
      <TodayEarnings completedOrders={completedOrders} />

      {/* Stats */}
      <DeliveryStats orders={orders} />

      {/* Search & Filter */}
      <div className="bg-white rounded-xl shadow-md p-4 mb-6 flex flex-col md:flex-row gap-4 justify-between">
        <input
          type="text"
          placeholder="Search Order ID or Customer..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-lg px-4 py-2 w-full md:w-80 focus:outline-none focus:ring-2 focus:ring-amber-500"
        />

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border rounded-lg px-4 py-2 w-full md:w-60 focus:outline-none focus:ring-2 focus:ring-amber-500">
          <option>All</option>
          <option>Pending</option>
          <option>Picked Up</option>
          <option>Out for Delivery</option>
          <option>Delivered</option>
        </select>
      </div>

      {/* Orders Table */}
      <DeliveryTable orders={filteredOrders} setOrders={setOrders} />
    </div>
  );
}
