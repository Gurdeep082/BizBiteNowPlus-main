import React from "react";

const TodayEarnings = ({ completedOrders }) => {
  const earnings = completedOrders * 120;

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-gray-500 text-sm font-medium">
            Today's Earnings
          </h3>

          <h2 className="text-3xl font-bold text-green-600 mt-2">
            ₹{earnings}
          </h2>

          <p className="text-sm text-green-500 mt-1">
            ₹120 per completed delivery
          </p>
        </div>

        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-3xl">
          💰
        </div>
      </div>
    </div>
  );
};

export default TodayEarnings;