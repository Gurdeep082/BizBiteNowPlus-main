import {
  Receipt,
} from "lucide-react";

const MobileOrderSummary = ({
  order = {},
}) => {
const { items = [] } = order;

const subtotal = items.reduce(
  (sum, item) =>
    sum + (item.total || item.price * item.quantity),
  0
);

const discount = order.discount || 0;

const deliveryFee =
  order.deliveryFee ??
  (subtotal >= 499 ? 0 : 40);

const taxes =
  order.taxes ??
  Math.round(subtotal * 0.05);

const total =
  subtotal +
  deliveryFee +
  taxes -
  discount;

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
        <div className="flex items-center gap-3">
          <div
            className="
              flex
              h-10
              w-10
              items-center
              justify-center

              rounded-xl

              bg-green-50

              text-green-600
            "
          >
            <Receipt size={20} />
          </div>

          <div>
            <h2 className="text-base font-bold text-slate-900">
              Order Summary
            </h2>

            <p className="text-xs text-slate-500">
              {items.length} Items
            </p>
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="divide-y divide-slate-100">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-3 px-4 py-3"
          >
            <img
              src={item.image}
              alt={item.name}
              className="
                h-14
                w-14

                rounded-xl

                border
                border-slate-200

                object-cover
              "
            />

            <div className="min-w-0 flex-1">
              <h3 className="truncate text-sm font-semibold text-slate-900">
                {item.name}
              </h3>

              <p className="mt-1 text-xs text-slate-500">
                Qty × {item.quantity}
              </p>
            </div>

            <div className="text-right">
              <p className="text-sm font-bold text-slate-900">
                ₹{item.total}
              </p>

              <p className="text-[11px] text-slate-500">
                ₹{item.price} each
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Bill */}
      <div className="border-t border-slate-100 px-4 py-4">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-500">
              Subtotal
            </span>

            <span>
              ₹{subtotal}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-500">
              Delivery Fee
            </span>

            <span>
              ₹{deliveryFee}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-500">
              Taxes
            </span>

            <span>
              ₹{taxes}
            </span>
          </div>

          {discount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>
                Discount
              </span>

              <span>
                -₹{discount}
              </span>
            </div>
          )}
        </div>

        <div className="my-4 border-t border-dashed border-slate-200" />

        <div className="flex items-center justify-between">
          <span className="text-base font-bold text-slate-900">
            Total
          </span>

          <span className="text-xl font-bold text-green-600">
            ₹{total}
          </span>
        </div>
      </div>
    </section>
  );
};

export default MobileOrderSummary;
