import React from "react";

const DeliveryProfileCard = ({ isOnline }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-6">

      <div className="flex items-center justify-between">

        <div className="flex items-center gap-4">

          <div className="w-16 h-16 rounded-full bg-amber-500 flex items-center justify-center text-white text-2xl font-bold">
            I
          </div>

          <div>

            <h2 className="text-xl font-bold text-gray-800">
              Imran Khan
            </h2>

            <p className="text-gray-500">
              Delivery Partner
            </p>

            <p className="text-sm text-gray-500">
              📞 +91 9876543210
            </p>

            <p className="text-sm text-gray-500">
              🛵 Bike
            </p>

          </div>

        </div>

        <div className="text-right">

          <p className="text-yellow-500 font-semibold">
            ⭐ 4.8 Rating
          </p>

          <span
            className={`inline-block mt-2 px-4 py-1 rounded-full text-white text-sm ${
              isOnline
                ? "bg-green-900"
                : "bg-red-500"
            }`}
          >
            {isOnline ? "Online" : "Offline"}
          </span>

        </div>

      </div>

    </div>
  );
};

export default DeliveryProfileCard;