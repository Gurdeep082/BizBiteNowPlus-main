import CartHeader from "./CartHeader";
import CartItems from "./CartItems";

import CouponSection from "./CouponSection";
import PaymentMethods from "./PaymentMethods";

const CartPage = ({
  cartItems = [],
  deliveryAddress,
  summary,
  coupon,
  onAddressClick,
  onIncrease,
  onDecrease,
  onRemove,
  onCouponChange,
  onApplyCoupon,
  onCheckout,
  onContinueShopping,
}) => {
  return (
    <main className="min-h-screen bg-slate-100 dark:bg-[#1E2021]">
      <div className="mx-auto max-w-full px-4 py-6 sm:px-6 lg:px-8">
        <CartHeader
          address={deliveryAddress}
          itemCount={cartItems.length}
          onAddressClick={onAddressClick}
        />

      
          <section className="space-y-6">
            <CartItems
              items={cartItems}
              onIncrease={onIncrease}
              onDecrease={onDecrease}
              onRemove={onRemove}
              onContinueShopping={onContinueShopping}
            />

<button
  onClick={onCheckout}
  className="
    group
    flex
    w-full
    items-center
    justify-center
    gap-2

    rounded-2xl

    bg-[var(--primary)]

    px-6
    py-4

    text-base
    font-semibold
    text-white

    shadow-lg
    shadow-green-900/20

    transition-all
    duration-300

    hover:-translate-y-0.5
    hover:shadow-xl
    hover:shadow-green-900/30

    active:translate-y-0
    active:scale-[0.98]

    disabled:cursor-not-allowed
    disabled:opacity-60
    disabled:hover:translate-y-0
    disabled:hover:shadow-lg
  "
>
  <span>Proceed to Checkout</span>

  <span className="transition-transform duration-300 group-hover:translate-x-1">
    →
  </span>
</button>

            <PaymentMethods />
          </section>
        </div>

    </main>
  );
};

export default CartPage;