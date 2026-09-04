import { Receipt } from "lucide-react";

import PriceBreakdown from "./PriceBreakdown";
import DeliveryProgress from "./DeliveryProgress";
import CheckoutActions from "./CheckoutActions";

const OrderSummary = ({
  summary = {},
  onCheckout,
  onContinueShopping,
}) => {
 const {
  subtotal = 0,
  discount = 0,
  deliveryFee = 0,
  taxes = 0,
  total = 0,

  freeDeliveryThreshold = 499,
  amountRemaining = 0,
  progress = 0,
  freeDeliveryUnlocked = false,
} = summary;



  return (
    <aside className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      {/* Header */}
      <div className="border-b border-gray-100 px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-50 text-green-600">
            <Receipt size={20} />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Order Summary
            </h2>

            <p className="text-sm text-gray-500">
              Review your payment details
            </p>
          </div>
        </div>
      </div>
       
      {/* Price Details */}
      <div className="px-6 py-5">
        <PriceBreakdown
          subtotal={subtotal}
          discount={discount}
          deliveryFee={deliveryFee}
          taxes={taxes}
          total={total}
        />
      </div>

      {/* Free Delivery */}
      <div className="border-t border-gray-100 px-6 py-5">
        <DeliveryProgress
        subtotal={subtotal}
        progress={progress}
        amountRemaining={amountRemaining}
        threshold={freeDeliveryThreshold}
        unlocked={freeDeliveryUnlocked}
        />
      </div>

      {/* Checkout */}
      <div className="border-t border-gray-100 px-6 py-6">
        <CheckoutActions
          total={total}
          onCheckout={onCheckout}
          onContinueShopping={onContinueShopping}
        />
      </div>
    </aside>
  );
};

export default OrderSummary;