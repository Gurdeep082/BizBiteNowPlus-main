import {
  User,
  Phone,
  MapPin,
  Store,
  CreditCard,
  Clock3,
} from "lucide-react";

const MobileDeliveryDetails = ({
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
        overflow-hidden

        rounded-2xl

        border
        border-slate-200

        bg-white

        shadow-sm
      "
    >
      {/* Header */}
      <div className="border-b border-slate-100 px-4 py-4">
        <h2 className="text-base font-bold text-slate-900">
          Delivery Details
        </h2>

        <p className="mt-1 text-xs text-slate-500">
          Delivery information
        </p>
      </div>

      <div className="space-y-5 p-4">
        {/* Customer */}
        <div className="flex gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-600">
            <User size={18} />
          </div>

          <div>
            <p className="text-[11px] uppercase text-slate-500">
              Customer
            </p>

            <h3 className="mt-1 text-sm font-semibold text-slate-900">
              {customer.name || "Guest User"}
            </h3>
          </div>
        </div>

        {/* Phone */}
        <div className="flex gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <Phone size={18} />
          </div>

          <div>
            <p className="text-[11px] uppercase text-slate-500">
              Phone
            </p>

            <h3 className="mt-1 text-sm font-semibold text-slate-900">
              {customer.phone || "+91 XXXXX XXXXX"}
            </h3>
          </div>
        </div>

        {/* Address */}
        <div className="flex gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
            <MapPin size={18} />
          </div>

          <div className="flex-1">
            <p className="text-[11px] uppercase text-slate-500">
              Delivery Address
            </p>

            <p className="mt-1 text-sm leading-6 text-slate-700">
              {deliveryAddress.address ||
                "No delivery address available"}
            </p>
          </div>
        </div>

        {/* Restaurant */}
        <div className="flex gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
            <Store size={18} />
          </div>

          <div>
            <p className="text-[11px] uppercase text-slate-500">
              Restaurant
            </p>

            <h3 className="mt-1 text-sm font-semibold text-slate-900">
              {restaurant.name ||
                "BizBite Restaurant"}
            </h3>
          </div>
        </div>

        {/* Payment */}
        <div className="flex gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <CreditCard size={18} />
          </div>

          <div>
            <p className="text-[11px] uppercase text-slate-500">
              Payment
            </p>

            <h3 className="mt-1 text-sm font-semibold text-slate-900">
              {paymentMethod}
            </h3>
          </div>
        </div>

        {/* ETA */}
        <div className="flex gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
            <Clock3 size={18} />
          </div>

          <div>
            <p className="text-[11px] uppercase text-slate-500">
              Estimated Delivery
            </p>

            <h3 className="mt-1 text-sm font-semibold text-green-600">
              {estimatedDelivery}
            </h3>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MobileDeliveryDetails;