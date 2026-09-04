import {
  User,
  Phone,
  MapPin,
  Clock3,
  CreditCard,
  Store,
} from "lucide-react";

const DeliveryDetails = ({
  order = {},
}) => {
  const {
    customer = {},
    restaurant = {},
    deliveryAddress = {},
    paymentMethod = "Cash on Delivery",
    estimatedDelivery = "30-35 mins",
  } = order;

  return (
    <section
      className="
        rounded-2xl
        border
        border-slate-200
        bg-white
        shadow-sm
      "
    >
      {/* Header */}
      <div className="border-b border-slate-100 px-6 py-5">
        <h2 className="text-lg font-bold text-slate-900">
          Delivery Details
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Customer and delivery information
        </p>
      </div>

      <div className="space-y-6 p-6">
        {/* Customer */}
        <div className="flex gap-4">
          <div
            className="
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-xl
              bg-green-50
              text-green-600
            "
          >
            <User size={20} />
          </div>

          <div>
            <p className="text-xs uppercase text-slate-500">
              Customer
            </p>

            <h3 className="mt-1 font-semibold text-slate-900">
              {customer.name || "Guest User"}
            </h3>
          </div>
        </div>

        {/* Phone */}
        <div className="flex gap-4">
          <div
            className="
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-xl
              bg-blue-50
              text-blue-600
            "
          >
            <Phone size={20} />
          </div>

          <div>
            <p className="text-xs uppercase text-slate-500">
              Phone Number
            </p>

            <h3 className="mt-1 font-semibold text-slate-900">
              {customer.phone || "+91 XXXXX XXXXX"}
            </h3>
          </div>
        </div>

        {/* Address */}
        <div className="flex gap-4">
          <div
            className="
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-xl
              bg-orange-50
              text-orange-600
            "
          >
            <MapPin size={20} />
          </div>

          <div>
            <p className="text-xs uppercase text-slate-500">
              Delivery Address
            </p>

            <p className="mt-1 leading-6 text-slate-800">
              {deliveryAddress.address ||
                "No address available"}
            </p>
          </div>
        </div>

        {/* ETA */}
        <div className="flex gap-4">
          <div
            className="
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-xl
              bg-purple-50
              text-purple-600
            "
          >
            <Clock3 size={20} />
          </div>

          <div>
            <p className="text-xs uppercase text-slate-500">
              Estimated Delivery
            </p>

            <h3 className="mt-1 font-semibold text-green-600">
              {estimatedDelivery}
            </h3>
          </div>
        </div>

        {/* Payment */}
        <div className="flex gap-4">
          <div
            className="
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-xl
              bg-emerald-50
              text-emerald-600
            "
          >
            <CreditCard size={20} />
          </div>

          <div>
            <p className="text-xs uppercase text-slate-500">
              Payment Method
            </p>

            <h3 className="mt-1 font-semibold text-slate-900">
              {paymentMethod}
            </h3>
          </div>
        </div>

        {/* Restaurant */}
        <div className="flex gap-4">
          <div
            className="
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-xl
              bg-amber-50
              text-amber-600
            "
          >
            <Store size={20} />
          </div>

          <div>
            <p className="text-xs uppercase text-slate-500">
              Restaurant
            </p>

            <h3 className="mt-1 font-semibold text-slate-900">
              {restaurant.name ||
                "BizBite Restaurant"}
            </h3>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DeliveryDetails;