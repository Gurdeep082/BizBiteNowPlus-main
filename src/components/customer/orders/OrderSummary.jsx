import {
  ShoppingBag,
  Tag,
  Check,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useState } from "react";

const OrderSummary = ({
  summary = {},
  deliveryType = "delivery",
  coupon = {},
  onCouponChange,
  onApplyCoupon,
}) => {
  const {
    subtotal = 0,
    discount = 0,
    deliveryFee = 0,
    taxes = 0,
    total = 0,
  } = summary;

  const [showOffers, setShowOffers] = useState(false);

  // 🟢 Filter out expired or already used/applied coupons so only valid available ones show at checkout
  const availableOffers = (coupon.offers || []).filter(
    (offer) => !offer.expired && offer.code !== coupon.code
  );

  return (
    <section
      className="
        rounded-2xl
        border
        border-slate-200
        bg-white
        shadow-sm
        p-5
        space-y-6
      "
    >
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
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
          <ShoppingBag size={22} />
        </div>

        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Order Summary
          </h2>
          <p className="text-sm text-slate-500">
            Review your payment details.
          </p>
        </div>
      </div>

      {/* Coupons & Offers Box */}
      <div className="rounded-xl border border-slate-200 p-4 bg-slate-50/50 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
              <Tag size={16} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Coupons & Offers</h3>
              <p className="text-xs text-slate-500">Apply a coupon and save more</p>
            </div>
          </div>
        </div>

        {/* Coupon Input & Apply */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Enter coupon code"
            value={coupon.code || ""}
            onChange={(e) => onCouponChange(e.target.value)}
            className="
              flex-1
              rounded-xl
              border
              border-slate-200
              bg-white
              px-3
              py-2
              text-sm
              uppercase
              placeholder:normal-case
              focus:border-green-600
              focus:outline-none
            "
          />
          <button
            type="button"
            onClick={() => onApplyCoupon()}
            className="
              rounded-xl
              bg-green-600
              px-4
              py-2
              text-sm
              font-semibold
              text-white
              transition-all
              hover:bg-green-700
            "
          >
            {coupon.applied ? "Applied" : "Apply"}
          </button>
        </div>

        {coupon.error && (
          <p className="text-xs text-red-500">{coupon.error}</p>
        )}

        {/* Available Coupons Dropdown / List from DB (Filtered) */}
        {availableOffers.length > 0 && (
          <div>
            <button
              type="button"
              onClick={() => setShowOffers(!showOffers)}
              className="flex w-full items-center justify-between text-xs font-semibold text-green-700 pt-1"
            >
              <span>Available Coupons ({availableOffers.length})</span>
              {showOffers ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {showOffers && (
              <div className="mt-2 space-y-2 max-h-48 overflow-y-auto pr-1">
                {availableOffers.map((offer) => (
                  <div
                    key={offer._id || offer.code}
                    className="flex items-center justify-between rounded-xl border border-dashed border-green-300 bg-white p-2.5 text-left"
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-900 text-xs bg-green-50 px-1.5 py-0.5 rounded text-green-700">
                          {offer.code}
                        </span>
                        <span className="text-[11px] text-slate-600 font-medium">
                          {offer.discount_type === "percentage"
                            ? `${offer.discount_value}% OFF`
                            : `₹${offer.discount_value} OFF`}
                        </span>
                      </div>
                      {offer.description && (
                        <p className="text-[11px] text-slate-500 mt-0.5 truncate max-w-[180px]">
                          {offer.description}
                        </p>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => onApplyCoupon(offer.code)}
                      className="text-xs font-bold text-green-600 hover:text-green-700 bg-green-50 px-2.5 py-1 rounded-lg"
                    >
                      Apply
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bill Details */}
      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-slate-500">Subtotal</span>
          <span className="font-medium">₹{subtotal}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-slate-500">
            {deliveryType === "pickup" ? "Pickup (Free)" : "Delivery Fee"}
          </span>
          <span className="font-medium">₹{deliveryFee}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-slate-500">Taxes & Charges</span>
          <span className="font-medium">₹{taxes}</span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Discount</span>
            <span>-₹{discount}</span>
          </div>
        )}
      </div>

      <div className="border-t border-dashed border-slate-200" />

      {/* Grand Total */}
      <div className="flex items-center justify-between">
        <span className="text-lg font-bold text-slate-900">Grand Total</span>
        <span className="text-2xl font-bold text-green-600">₹{total}</span>
      </div>
    </section>
  );
};

export default OrderSummary;