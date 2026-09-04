import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Copy, CheckCircle2, Gift, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import LoyaltyCard from "../../components/customer/rewards/LoyaltyCard";
import RewardProgress from "../../components/customer/rewards/RewardProgress";
import Coupons from "../../components/customer/rewards/Coupons";
import { discountsToCoupons } from "../../components/customer/rewards/discountMapper";
import useDiscountStore from "../../store/discountStore";
import useAuthStore from "../../store/authStore";
import useLoyaltyStore from "../../store/loyaltyStore";
import ActivityTimeline from "../../components/customer/rewards/ActivityTimeline";
import API from "../../api/axios";
import { getLoyaltySettings } from "../../api/loyalty";
import useCartStore from "../../api/stores/customerstore/cartStore";

const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
};

const mapRewardType = (type) => {
  if (!type) return "item";
  const lowerType = type.toLowerCase();
  if (lowerType.includes("percentage") || lowerType.includes("flat") || lowerType.includes("discount")) return "discount";
  if (lowerType.includes("delivery")) return "delivery";
  return "item";
};

const Rewards = () => {
  const [coupons, setCoupons] = useState([]);
  const [rewardCoupons, setRewardCoupons] = useState([]);
  const [activities, setActivities] = useState([]);
  const [settingsData, setSettingsData] = useState(null);
  const [copiedCode, setCopiedCode] = useState(null);

  const [appliedCoupon, setAppliedCoupon] = useState(() => {
    try {
      const saved = localStorage.getItem("appliedCoupon");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [usedCoupons, setUsedCoupons] = useState(() => {
    try {
      const saved = localStorage.getItem("usedCoupons");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [couponError, setCouponError] = useState(null);

  const navigate = useNavigate();
  const { getDiscounts } = useDiscountStore();
  const { user, profile, token } = useAuthStore();
  const { addToCart } = useCartStore();

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

  const {
    active,
    threshold,
    stampsCollected,
    rewardType,
    rewardDetail,
    rewardCoupon,
    rewardItem,
    fetchLoyaltyStatus,
    claimReward,
  } = useLoyaltyStore();

  // Fetch settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await getLoyaltySettings();
        if (response?.success && response?.settings) {
          setSettingsData(response.settings);
        }
      } catch (err) {
        console.warn("Failed to fetch loyalty settings", err);
      }
    };
    fetchSettings();
  }, [sellerId]);

  const loyalty = {
    active: settingsData?.is_active ?? active,
    threshold: settingsData?.target_stamps ?? threshold,
    stampsCollected: stampsCollected,
    rewardType: settingsData ? mapRewardType(settingsData.reward_type) : rewardType,
    rewardDetail: settingsData?.reward_description ?? rewardDetail,
  };

  // Fetch coupons
  useEffect(() => {
    const fetchAllCoupons = async () => {
      if (!sellerId) return;

      try {
        const storeDiscounts = await getDiscounts(sellerId);
        setCoupons(discountsToCoupons(storeDiscounts) || []);

        if (customerPhone) {
          try {
            const rewardRes = await API.get(`/rewards/customer-coupons`, {
              params: {
                seller_id: sellerId,
                customer_phone: customerPhone,
              },
            });

            if (rewardRes.data?.success && rewardRes.data?.coupons?.length > 0) {
              const mappedRewards = rewardRes.data.coupons.map((c) => ({
                id: c._id,
                code: c.coupon_code,
                type: c.discount_type || "percentage",
                title: c.discount_type === "percentage"
                  ? `${c.discount_value}% OFF`
                  : c.discount_type === "FREE_PRODUCT"
                    ? "Free Item Reward"
                    : `₹${c.discount_value} OFF`,
                freeProducts: c.free_products || [],
                minOrder: c.min_order_value || 0,
                expiry: new Date(c.expiry_date).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                }),
                isUsed: c.is_used || false
              }));
              setRewardCoupons(mappedRewards);
            } else {
              setRewardCoupons([]);
            }
          } catch (rewardErr) {
            console.warn("Failed to fetch personal reward coupons", rewardErr);
            setRewardCoupons([]);
          }
        }
      } catch (err) {
        console.warn("Error fetching coupons", err);
        setCoupons([]);
      }
    };

    fetchAllCoupons();
  }, [getDiscounts, sellerId, customerPhone]);

  useEffect(() => {
    if (!sellerId || !customerPhone) return;
    fetchLoyaltyStatus(sellerId, customerPhone).catch((err) => {
      console.warn("Could not fetch loyalty status", err);
    });
  }, [sellerId, customerPhone, fetchLoyaltyStatus]);

  // Fetch history
  useEffect(() => {
    const fetchCustomerHistory = async () => {
      const finalSellerId = sellerId || localStorage.getItem("seller_id");
      const finalPhone = customerPhone || user?.phone || localStorage.getItem("customer_phone");

      if (!finalSellerId || !finalPhone) return;

      try {
        const response = await API.get(`/orders/customer-orders`, {
          params: {
            seller_id: finalSellerId,
            customer_phone: finalPhone,
          },
        });

        const orders = response.data?.orders || response.data?.data || [];

        const orderedCoupons = orders
          .map((ord) => ord.coupon_used || ord.discount_code_used)
          .filter(Boolean);

        if (orderedCoupons.length > 0) {
          setUsedCoupons((prev) => {
            const combined = Array.from(new Set([...prev, ...orderedCoupons]));
            localStorage.setItem("usedCoupons", JSON.stringify(combined));
            return combined;
          });
        }

        const validOrders = orders.filter(
          (order) => order.delivery_status !== "Cancelled"
        );

        const currentCycleOrders = validOrders.slice(0, stampsCollected);

        const formattedActivities = currentCycleOrders.map((order) => {
          const itemNames = (order.items || [])
            .map((item) => item.name || item.product_id?.name || item.title)
            .filter(Boolean)
            .join(", ");

          return {
            id: order._id,
            type: "stamp",
            title: itemNames || `Order #${order._id ? order._id.slice(-6) : "Item"}`,
            subtitle: `${order.delivery_status || "Placed"} - ${order.payment_method || "COD"}`,
            amount: order.total_amount,
            stamps: 1,
            date: new Date(order.createdAt).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            }),
          };
        });

        setActivities(formattedActivities);
      } catch (err) {
        console.warn("Failed to load live activity timeline", err?.response?.data || err.message);
        setActivities([]);
      }
    };

    fetchCustomerHistory();
  }, [sellerId, customerPhone, user, stampsCollected]);

  // Claim reward
  const handleRedeem = async () => {
    if (!sellerId || !customerPhone) return;
    try {
      await claimReward(sellerId, customerPhone);
    } catch (err) {
      setCouponError(err?.response?.data?.message || "Could not claim reward");
    }
  };

  // Apply coupon
  const applyCoupon = async (coupon) => {
    if (usedCoupons.includes(coupon.code)) {
      setCouponError("This coupon has already been used in an order.");
      return;
    }
    setCouponError(null);

    try {
      const applied = { ...coupon };
      setAppliedCoupon(applied);
      localStorage.setItem("appliedCoupon", JSON.stringify(applied));
    } catch {
      setCouponError("Could not apply coupon");
    }
  };

  // Add product
  const handleAddFreeProduct = async (coupon, product) => {
    await applyCoupon(coupon);
    if (addToCart && product) {
      addToCart({ ...product, product_id: product._id || product.id }, 1);
    }
    navigate("/customer/cart");
  };

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => {
      setCopiedCode(null);
    }, 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="w-full min-h-screen pb-28 font-sans text-slate-800 px-4 sm:px-8 max-w-[1780px] mx-auto space-y-6"
    >
      <div className="flex items-center justify-between w-full pt-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Rewards & Loyalty
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            Track your stamps, unlock rewards and view order history
          </p>
        </div>
      </div>

      <div className="space-y-6 w-full">
        <LoyaltyCard data={loyalty} onRedeem={handleRedeem} />

        {rewardCoupon && (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs sm:text-sm font-medium text-emerald-800 shadow-2xs">
            {rewardItem && <span className="font-bold">{rewardItem}</span>} Use code{" "}
            <span className="font-bold underline">{rewardCoupon}</span> at checkout.
          </div>
        )}

        {rewardCoupons.length > 0 && (
          <div className="space-y-3 pt-2">
            <h2 className="text-lg font-bold text-(--primary-color)">Your Unlocked Reward</h2>
            <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 snap-x snap-mandatory">
              {rewardCoupons.map((coupon) => (
                <div
                  key={coupon.code}
                  className="snap-center shrink-0 w-[90%] sm:w-80 rounded-3xl border border-emerald-200 bg-(--accent-color)/20 p-5 shadow-sm relative overflow-hidden"
                >
                  <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-emerald-200/40 blur-2xl"></div>

                  <div className="flex items-start justify-between relative z-10">
                    <div className="flex items-center gap-2 rounded-full bg-(--secondary-color)/20 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-(--primary-color)">
                      <Gift size={12} />
                      Loyalty Reward
                    </div>
                    <span className="text-[10px] font-semibold text-slate-500">
                      Valid till {coupon.expiry}
                    </span>
                  </div>

                  <div className="mt-4 relative z-10">
                    {coupon.type === "FREE_PRODUCT" && coupon.freeProducts?.length > 0 ? (
                      <div className="flex items-center gap-3">
                        <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-emerald-100 bg-white">
                          <img
                            src={coupon.freeProducts[0]?.image || coupon.freeProducts[0]?.imageUrl || "https://via.placeholder.com/60"}
                            alt="Reward"
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-emerald-600 uppercase">Free Item</p>
                          <h3 className="text-base font-bold text-slate-900 leading-tight line-clamp-1">
                            {coupon.freeProducts[0]?.name}
                          </h3>
                          <p className="text-xs font-medium text-slate-500 mt-0.5">
                            On orders above ₹{coupon.minOrder}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div>
                          <h3 className="text-xl sm:text-2xl font-black text-(--primary-color)">
                          {coupon.title}
                        </h3>
                        <p className="text-xs font-medium text-slate-500 mt-1">
                          On orders above ₹{coupon.minOrder}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="mt-5 flex items-center justify-between gap-3 border-t border-emerald-100/60 pt-4 relative z-10">
                    <div className="rounded-xl border border-dashed border-(--primary-color) bg-white px-4 py-2 font-mono text-sm font-bold text-slate-800 tracking-wider">
                      {coupon.code}
                    </div>
                    {coupon.type === "FREE_PRODUCT" && coupon.freeProducts?.length > 0 ? (
                      <button
                        onClick={() => handleAddFreeProduct(coupon, coupon.freeProducts[0])}
                        className="flex items-center gap-1.5 rounded-xl bg-(--primary-color) px-4 py-2 text-xs font-bold text-white"
                      >
                        <ShoppingCart size={14} /> Add Product
                      </button>
                    ) : (
                      <button
                        onClick={() => handleCopy(coupon.code)}
                        className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition-all ${copiedCode === coupon.code
                            ? "bg-(--primary-color) text-white"
                          : "bg-(--primary-color)/20 text-(--primary-color) hover:bg-emerald-200"
                          }`}
                      >
                        {copiedCode === coupon.code ? (
                          <>
                            <CheckCircle2 size={14} /> Copied
                          </>
                        ) : (
                          <>
                            <Copy size={14} /> Copy Code
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <RewardProgress data={loyalty} onRedeem={handleRedeem} />

        {couponError && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-600">
            {couponError}
          </div>
        )}

        {coupons.length > 0 && (
          <div className="pt-4">
            <Coupons
              coupons={coupons}
              appliedCoupon={appliedCoupon}
              usedCoupons={usedCoupons}
              onApply={applyCoupon}
              onCopy={handleCopy}
            />
          </div>
        )}

        <div className="pt-2 mt-4">
          <ActivityTimeline activities={activities} />
        </div>
      </div>
    </motion.div>
  );
};

export default Rewards;
