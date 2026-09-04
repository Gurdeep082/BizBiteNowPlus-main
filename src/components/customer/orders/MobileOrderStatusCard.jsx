import {
  BadgeCheck,
  CreditCard,
  Hash,
  Clock3,
} from "lucide-react";

const MobileOrderStatusCard = ({
  order = {},
}) => {
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
      {/* Top */}
      <div
        className="
          flex
          items-center
          gap-4

          px-4
          py-5
        "
      >
        <div
          className="
            flex
            h-14
            w-14
            items-center
            justify-center

            rounded-2xl

            bg-green-600

            text-white
          "
        >
          <BadgeCheck size={30} />
        </div>

        <div className="flex-1">
          <h2 className="text-lg font-bold text-slate-900">
            {order.statusTitle ||
              "Order Confirmed"}
          </h2>

          <p className="mt-1 text-xs leading-5 text-slate-500">
            {order.statusMessage ||
              "Your order has been placed successfully."}
          </p>
        </div>
      </div>

      {/* Info */}
      <div
        className="
          grid
          grid-cols-2
          gap-4

          border-t
          border-slate-100

          px-4
          py-4
        "
      >
        <div>
          <div className="flex items-center gap-2">
            <Hash
              size={14}
              className="text-slate-400"
            />

            <span className="text-[11px] uppercase text-slate-500">
              Order ID
            </span>
          </div>

          <p className="mt-2 text-sm font-semibold text-slate-900">
            #
            {order.id ||
              "BBN123456"}
          </p>
        </div>

        <div>
          <div className="flex items-center gap-2">
            <CreditCard
              size={14}
              className="text-slate-400"
            />

            <span className="text-[11px] uppercase text-slate-500">
              Payment
            </span>
          </div>

          <p className="mt-2 text-sm font-semibold text-slate-900">
            {order.paymentMethod ||
              "Cash on Delivery"}
          </p>
        </div>

        <div className="col-span-2">
          <div className="flex items-center gap-2">
            <Clock3
              size={14}
              className="text-slate-400"
            />

            <span className="text-[11px] uppercase text-slate-500">
              Ordered On
            </span>
          </div>

          <p className="mt-2 text-sm font-semibold text-slate-900">
            {order.createdAt ||
              "16 Jul 2026 • 11:42 AM"}
          </p>
        </div>
      </div>
    </section>
  );
};

export default MobileOrderStatusCard;