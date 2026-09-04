import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Gift } from "lucide-react";
import PriceBreakdown from "../cart/PriceBreakdown";
import DeliveryProgress from "../cart/DeliveryProgress";
import CouponSection from "../cart/CouponSection";

import API from "../../../api/axios";
import useAuthStore from "../../../store/authStore";

const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (e) {
    return null;
  }
};

const OrderSummary = ({
  summary = {},
  deliveryType = "delivery",
  coupon,
  onCouponChange,
  onApplyCoupon,
}) => {
  const {
    subtotal = 0,
    discount = 0,
    deliveryFee = 0,
    additionalCharges = [],
    taxes = 0,
    total = 0,
    freeDeliveryThreshold = 499,
    amountRemaining = 0,
    progress = 0,
    freeDeliveryUnlocked = false,
  } = summary;

  const [rewardCoupons, setRewardCoupons] = useState([]);
  const { user, profile, token } = useAuthStore();

  const decodedToken = token ? parseJwt(token) : null;

  const sellerId =
    decodedToken?.seller_id ||
    profile?.seller_id ||
    user?.seller_id ||
    localStorage.getItem("seller_id");

  const customerPhone =
    profile?.customer_phone ||
    user?.phone ||
    user?.phoneNumber ||
    decodedToken?.customer_phone ||
    localStorage.getItem("customer_phone");

  useEffect(() => {
    // Fetch coupons
    const fetchRewardCoupons = async () => {
      if (!sellerId || !customerPhone) return;
      try {
        const rewardRes = await API.get(`/rewards/customer-coupons`, {
          params: {
            seller_id: sellerId,
            customer_phone: customerPhone,
          },
        });

        if (rewardRes.data?.success && rewardRes.data?.coupons?.length > 0) {
          setRewardCoupons(rewardRes.data.coupons);
        } else {
          setRewardCoupons([]);
        }
      } catch (err) {
        console.warn("Failed to fetch reward coupons for checkout", err);
      }
    };

    fetchRewardCoupons();
  }, [sellerId, customerPhone]);

  return (
    <motion.section
      initial={{
        opacity: 0,
        y: 12,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.35,
      }}
      className="
        rounded-[24px]
        border
        border-slate-200
        bg-white
        p-5
        dark:border-[#A9BDCF]/30
        dark:bg-[#181A1B]
      "
    >
      <div>
        <h2
          className="
            text-lg
            font-bold
            text-slate-900
            dark:text-white
          "
        >
          Order Summary
        </h2>

        <p
          className="
            mt-1
            text-sm
            text-slate-500
            dark:text-slate-400
          "
        >
          Review your payment details.
        </p>
      </div>

      <div className="mb-5 mt-5">
        <CouponSection
          coupon={coupon}
          onChange={onCouponChange}
          onApply={onApplyCoupon}
        />

        {rewardCoupons.length > 0 && (
          <div className="mt-4 space-y-2">
            <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
              <Gift size={14} /> Available Loyalty Rewards
            </p>
            <div className="flex flex-col gap-2">
              {rewardCoupons.map((c) => {
                let titleText = "";
                if (c.discount_type === "FREE_PRODUCT") {
                  const productName = c.free_products?.[0]?.name;
                  titleText = productName ? `1 FREE: ${productName}` : "1 FREE ITEM";
                } else if (c.discount_type === "percentage") {
                  titleText = `${c.discount_value}% OFF`;
                } else {
                  titleText = `₹${c.discount_value} OFF`;
                }

                return (
                  <div
                    key={c._id}
                    onClick={() => {
                      onCouponChange(c.coupon_code);
                    }}
                    className="
                      flex 
                      items-center 
                      justify-between 
                      p-3 
                      rounded-xl 
                      border 
                      border-emerald-200 
                      bg-emerald-50 
                      cursor-pointer 
                      transition 
                      hover:bg-emerald-100
                      dark:bg-emerald-900/20
                      dark:border-emerald-800
                    "
                  >
                    <div>
                      <p className="text-sm font-bold text-emerald-800 dark:text-emerald-300">
                        {titleText}
                      </p>
                      <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-0.5">
                        Code: <span className="font-semibold">{c.coupon_code}</span>
                      </p>
                    </div>
                    <button className="text-xs font-semibold text-emerald-700 bg-emerald-200/50 px-3 py-1.5 rounded-lg dark:text-emerald-200 dark:bg-emerald-800/50">
                      Tap to use
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <PriceBreakdown
        subtotal={subtotal}
        discount={discount}
        deliveryType={deliveryType}
        deliveryFee={deliveryFee}
        additionalCharges={additionalCharges}
        taxes={taxes}
        total={total}
      />

      {deliveryType === "delivery" && (
        <DeliveryProgress
          subtotal={subtotal}
          progress={progress}
          amountRemaining={amountRemaining}
          threshold={freeDeliveryThreshold}
          unlocked={freeDeliveryUnlocked}
        />
      )}

      <div
        className="
          mt-6
          rounded-2xl
          p-4
          text-center
        "
        style={{
          background: "var(--primary-light)",
        }}
      >
        <p
          className="
            text-sm
            font-medium
          "
          style={{
            color: "var(--primary-color)",
          }}
        >
          🔒 Secure payment with encrypted checkout
        </p>
      </div>
    </motion.section>
  );
};

export default OrderSummary;