import { motion } from "framer-motion";
import {
  ArrowLeft,
  Store,
  MapPin,
  TicketPercent,
  ShoppingBag,
  Plus,
  MessageSquare,
} from "lucide-react";

import QuantitySelector from "../product/QuantitySelector";

const ReorderCard = ({
  order,
  onBack,
  onAddMore,
  onCheckout,
  onQuantityChange,
}) => {
  if (!order) return null;

  return (
    <div className="mx-auto max-w-5xl space-y-6 pb-40">
      {/* Header */}

      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        className="
          sticky
          top-0
          z-30

          flex
          items-center
          gap-4

          border-b
          border-slate-200

          bg-white/90
          backdrop-blur-xl

          px-2
          py-4
        "
      >
        <button
          onClick={onBack}
          className="
            flex
            h-11
            w-11
            items-center
            justify-center

            rounded-xl

            border
            border-slate-200

            bg-white
          "
        >
          <ArrowLeft size={20} />
        </button>

        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            Reorder Order
          </h2>

          <p className="text-sm text-slate-500">
            Review and customize your previous order
          </p>
        </div>
      </motion.div>

      {/* Restaurant */}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="
          rounded-3xl
          border
          border-slate-200
          bg-white
          p-6
          shadow-sm
        "
      >
        <div className="flex gap-5">
          <img
            src={order.restaurant.image}
            alt={order.restaurant.name}
            className="
              h-24
              w-24
              rounded-2xl
              object-cover
            "
          />

          <div className="flex-1">
            <h3 className="text-2xl font-bold text-slate-900">
              {order.restaurant.name}
            </h3>

            <div className="mt-2 flex flex-wrap gap-4 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                ⭐ {order.restaurant.rating}
              </div>

              <div className="flex items-center gap-2">
                <Store size={16} />
                Open Now
              </div>

              <div className="flex items-center gap-2">
                <MapPin size={16} />
                {order.restaurant.location}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Previous Items */}

      <div className="space-y-5">
        <h3 className="text-xl font-bold text-slate-900">
          Previous Order
        </h3>

        {order.items.map((item) => (
          <motion.div
            layout
            key={item.id}
            className="
              rounded-3xl
              border
              border-slate-200
              bg-white
              p-5
              shadow-sm
            "
          >
            <div className="flex gap-5">
              <img
                src={item.image}
                alt={item.name}
                className="
                  h-24
                  w-24
                  rounded-2xl
                  object-cover
                "
              />

              <div className="flex flex-1 flex-col">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-lg font-bold text-slate-900">
                      {item.name}
                    </h4>

                    <p className="mt-2 text-sm text-slate-500">
                      ₹{item.price}
                    </p>

                    {item.variants?.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {item.variants.map((variant) => (
                          <span
                            key={variant}
                            className="
                              rounded-full
                              bg-slate-100
                              px-3
                              py-1
                              text-xs
                            "
                          >
                            {variant}
                          </span>
                        ))}
                      </div>
                    )}

                    {item.addons?.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {item.addons.map((addon) => (
                          <span
                            key={addon}
                            className="
                              rounded-full
                              border
                              border-slate-200
                              px-3
                              py-1
                              text-xs
                            "
                          >
                            + {addon}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <QuantitySelector
                    quantity={item.quantity}
                    onChange={(qty) =>
                      onQuantityChange?.(item.id, qty)
                    }
                  />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
            {/* Add More */}

      <button
        onClick={onAddMore}
        className="
          flex
          w-full
          items-center
          justify-center
          gap-3

          rounded-3xl

          border-2
          border-dashed
          border-slate-300

          bg-white

          py-5

          text-lg
          font-semibold

          transition-all

          hover:border-[var(--primary)]
          hover:bg-slate-50
        "
      >
        <Plus
          size={22}
          style={{
            color: "var(--primary)",
          }}
        />

        Add More Items
      </button>

      {/* Special Instructions */}

      <div
        className="
          rounded-3xl
          border
          border-slate-200
          bg-white
          p-6
          shadow-sm
        "
      >
        <div className="mb-4 flex items-center gap-3">
          <MessageSquare
            size={20}
            style={{
              color: "var(--primary)",
            }}
          />

          <h3 className="text-lg font-bold text-slate-900">
            Special Instructions
          </h3>
        </div>

        <textarea
          rows={4}
          placeholder="Add cooking preferences, packing instructions, allergies..."
          className="
            w-full

            rounded-2xl

            border
            border-slate-200

            p-4

            outline-none

            transition-all

            focus:border-[var(--primary)]
          "
        />
      </div>

      {/* Coupon */}

      <button
        className="
          flex
          w-full
          items-center
          justify-between

          rounded-3xl

          border
          border-slate-200

          bg-white

          p-6

          shadow-sm

          transition

          hover:border-[var(--primary)]
        "
      >
        <div className="flex items-center gap-4">
          <TicketPercent
            size={26}
            style={{
              color: "var(--primary)",
            }}
          />

          <div className="text-left">
            <h3 className="font-bold text-slate-900">
              Apply Coupon
            </h3>

            <p className="text-sm text-slate-500">
              Save more on this order
            </p>
          </div>
        </div>

        <span
          className="font-semibold"
          style={{
            color: "var(--primary)",
          }}
        >
          View
        </span>
      </button>

      {/* Order Summary */}

      <div
        className="
          rounded-3xl
          border
          border-slate-200
          bg-white
          p-6
          shadow-sm
        "
      >
        <h3 className="mb-6 text-xl font-bold text-slate-900">
          Order Summary
        </h3>

        <div className="space-y-4 text-sm">

          <div className="flex justify-between">
            <span className="text-slate-500">
              Subtotal
            </span>

            <span className="font-semibold">
              ₹{order.summary.subtotal}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-500">
              Delivery Fee
            </span>

            <span className="font-semibold">
              ₹{order.summary.delivery}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-500">
              Taxes
            </span>

            <span className="font-semibold">
              ₹{order.summary.tax}
            </span>
          </div>

          <div
            className="flex justify-between font-semibold"
            style={{
              color: "var(--primary)",
            }}
          >
            <span>Discount</span>

            <span>
              - ₹{order.summary.discount}
            </span>
          </div>

          <div className="border-t border-slate-200 pt-4" />

          <div className="flex justify-between text-lg font-bold">
            <span>Total</span>

            <span>
              ₹{order.summary.total}
            </span>
          </div>

        </div>
      </div>

      {/* Sticky Bottom */}

      <motion.div
        initial={{
          y: 120,
        }}
        animate={{
          y: 0,
        }}
        className="
          fixed
          bottom-0
          left-0
          right-0

          z-40

          border-t
          border-slate-200

          bg-white/95

          backdrop-blur-xl

          p-4
        "
      >
        <div className="mx-auto flex max-w-5xl items-center justify-between">

          <div>
            <p className="text-sm text-slate-500">
              Pay
            </p>

            <h2 className="text-3xl font-bold">
              ₹{order.summary.total}
            </h2>
          </div>

          <button
            onClick={onCheckout}
            className="
              flex
              items-center
              gap-3

              rounded-2xl

              px-8
              py-4

              text-lg
              font-semibold

              text-white

              shadow-lg

              transition

              hover:scale-[1.02]
            "
            style={{
              background: "var(--primary)",
            }}
          >
            <ShoppingBag size={22} />

            Reorder Now
          </button>

        </div>
      </motion.div>
    </div>
  );
};

export default ReorderCard;