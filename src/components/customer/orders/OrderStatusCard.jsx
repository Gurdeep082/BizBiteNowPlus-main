import {
  BadgeCheck,
  CreditCard,
  Hash,
  CheckCircle2,
} from "lucide-react";
const OrderStatusCard = ({
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
      <div
        className="
          flex
          items-center
          justify-between
          gap-10

          p-8
        "
      >
        {/* Left */}
        <div className="flex flex-1 items-start gap-5">
          <div
            className="
              flex
              h-16
              w-16
              items-center
              justify-center

              rounded-2xl

              bg-green-600

              text-white
            "
          >
            <BadgeCheck size={34} />
          </div>

          <div className="flex-1">
            <h2 className="text-2xl font-bold text-slate-900">
              {order.statusTitle ||
                "Order Confirmed"}
            </h2>

            <p className="mt-2 text-slate-500">
              {order.statusMessage ||
                "Thank you! Your order has been placed successfully."}
            </p>

            <div className="mt-8 grid grid-cols-2 gap-8">
              <div>
                <div className="flex items-center gap-2">
                  <Hash
                    size={15}
                    className="text-slate-400"
                  />

                  <span className="text-sm text-slate-500">
                    Order ID
                  </span>
                </div>

                <p className="mt-2 text-lg font-bold text-slate-900">
                  #
                  {order.id ||
                    "BBN12345678"}
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <CreditCard
                    size={15}
                    className="text-slate-400"
                  />

                  <span className="text-sm text-slate-500">
                    Payment Method
                  </span>
                </div>

                <p className="mt-2 text-lg font-semibold text-slate-900">
                  {order.paymentMethod ||
                    "Cash on Delivery"}
                </p>
              </div>
            </div>
          </div>
        </div>

       {/* Right Success Icon */}
<div
  className="
    hidden
    xl:flex

    h-40
    w-40

    items-center
    justify-center
  "
>
  <div
    className="
      flex
      h-36
      w-36
      items-center
      justify-center

      rounded-full

      border-[6px]
      border-green-200

      bg-green-50
    "
  >
    <div
      className="
        flex
        h-24
        w-24
        items-center
        justify-center

        rounded-full

        bg-green-600

        shadow-lg
        shadow-green-600/30
      "
    >
      <CheckCircle2
        size={56}
        strokeWidth={2.8}
        className="text-white"
      />
    </div>
  </div>
</div>
      </div>
    </section>
  );
};

export default OrderStatusCard;