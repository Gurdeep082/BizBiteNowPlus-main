import { BiFoodTag } from "react-icons/bi";
import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  Star,
  Plus,
  Minus,
  Heart,
  Percent,
  ArrowRight,
  ChevronRight,
  QrCode,
  Flame,
  Sparkles,
  UtensilsCrossed,
  X,
  UserRound,
  Gift,
  Copy,
  Check,
  AlertCircle,
  Leaf,
  Drumstick,
  Clock
} from "lucide-react";

import useAuthStore from "../../store/authStore";
import useProductStore from "../../store/productStore";
import useBannerStore from "../../store/bannerStore";
import useCartStore from "../../api/stores/customerstore/cartStore";
import useOrderStore from "../../api/stores/customerstore/customerOrderStore";
import useLoyaltyStore from "../../store/loyaltyStore";
import useDiscountStore from "../../store/discountStore";
import { useFavourite } from "../../context/FavouriteContext";
import { normalizeProduct, isProductFavourite } from "../../util/normalizeProduct";
import ReusableProductCard from "../../components/customer/ReusableProductCard";
import useTableStore from "../../store/tableStore";
import API from "../../api/axios";

const ACTIVE_STATUSES = ["unassigned", "assigned", "ready for pickup", "confirmed", "preparing", "on the way"];

const normalizePhoneLocal = (phoneStr) => {
  if (!phoneStr) return "";
  let digits = String(phoneStr).replace(/\D/g, "").trim();
  if (digits.length === 12 && digits.startsWith("91")) {
    digits = digits.slice(2);
  } else if (digits.length > 10) {
    digits = digits.slice(-10);
  }
  return digits;
};

const applyHoverDark = (e) => {
  e.currentTarget.style.filter = "brightness(0.85)";
};

const applyHoverReset = (e) => {
  e.currentTarget.style.filter = "brightness(1)";
};

export default function Home() {
  const navigate = useNavigate();

  const profile = useAuthStore((s) => s.profile);
  const user = useAuthStore((s) => s.user);
  const isLoggedIn = useAuthStore((state) => state.isAuthenticated);

  // 🟢 FIX: Handle case-insensitive role like "Seller", "SELLER" or "seller"
  useEffect(() => {
    const role = user?.role || profile?.role;
    if (isLoggedIn && role && role.toLowerCase() === "seller") {
      navigate("/seller/dashboard");
    }
  }, [isLoggedIn, user, profile, navigate]);

  const sellerId = profile?.seller_id || user?.seller_id || localStorage.getItem("seller_id") || import.meta.env.VITE_DEFAULT_SELLER_ID;
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const customerPhone = profile?.customer_phone || user?.phone || user?.phoneNumber || localStorage.getItem("customer_phone");

  const storefront = useProductStore((s) => s.storefront);
  const storeInfo = useProductStore((s) => s.store || s.storeInfo || s.currentStore);
  const fetchStorefrontCatalog = useProductStore((s) => s.fetchStorefrontCatalog);
  const fetchFullMenu = useProductStore((s) => s.fetchFullMenu);
  const fetchFestiveDeals = useProductStore((s) => s.fetchFestiveDeals);
  const festiveDeals = useProductStore((s) => s.festiveDeals);

  const publicBanners = useBannerStore((s) => s.publicBanners);
  const fetchPublicBanners = useBannerStore((s) => s.fetchPublicBanners);

  const cartItems = useCartStore((s) => s.items || []);
  const addToCart = useCartStore((s) => s.addToCart);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const fetchCart = useCartStore((s) => s.fetchCart);

  const orders = useOrderStore((s) => s.orders);
  const fetchOrders = useOrderStore((s) => s.fetchOrders);

  const { stampsCollected, threshold, fetchLoyaltyStatus } = useLoyaltyStore();
  const { getDiscounts } = useDiscountStore();
  const tables = useTableStore((s) => s.tables || []);
  const fetchTables = useTableStore((s) => s.fetchTables);

  const [liveDiscounts, setLiveDiscounts] = useState([]);
  const { favouriteProducts, toggleFavourite } = useFavourite();
  const [currentBanner, setCurrentBanner] = useState(0);

  const [selectedOffer, setSelectedOffer] = useState(null);
  const [copiedCode, setCopiedCode] = useState(false);

  const [rewardCoupons, setRewardCoupons] = useState([]);
  const [settingsData, setSettingsData] = useState(null);

  const isStoreOpen = useMemo(() => {
    if (storeInfo && storeInfo.is_open !== undefined) return Boolean(storeInfo.is_open);
    if (storeInfo && storeInfo.data && storeInfo.data.is_open !== undefined) return Boolean(storeInfo.data.is_open);

    if (storefront && storefront.length > 0) {
      const firstItem = storefront[0];
      const openStatus = firstItem?.seller_id?.is_open ?? firstItem?.seller_id?.store_profile?.is_open ?? firstItem?.store_id?.is_open;
      if (openStatus !== undefined) return Boolean(openStatus);
    }

    const profileOpen = profile?.seller_id?.is_open ?? profile?.is_open;
    if (profileOpen !== undefined) return Boolean(profileOpen);

    return true;
  }, [storeInfo, storefront, profile]);

  const businessCategory = useMemo(() => {
    return (
      storeInfo?.data?.business_info?.business_type ||
      storeInfo?.business_info?.business_type ||
      profile?.seller_id?.business_info?.business_type ||
      profile?.business_info?.business_type ||
      "Restaurant"
    );
  }, [storeInfo, profile]);

  useEffect(() => {
    const loadSafeData = async () => {
      try {
        if (sellerId) {
          await Promise.all([
            fetchStorefrontCatalog(sellerId).catch(() => { }),
            fetchFullMenu(sellerId).catch(() => { }),
            fetchFestiveDeals(sellerId).catch(() => { }),
            fetchPublicBanners(sellerId).catch(() => { }),
            fetchTables().catch(() => { }),
            getDiscounts(sellerId)
              .then((res) => {
                const currentDate = new Date();
                const myPhone = normalizePhoneLocal(customerPhone);

                const filtered = (res || []).filter((d) => {
                  const isActive = d.is_active !== false;
                  const notExpired = d.valid_until ? new Date(d.valid_until) >= currentDate : true;
                  const underTotalLimit = d.usage_limit_total
                    ? d.used_count < d.usage_limit_total
                    : true;

                  const perCustomerLimit = d.usage_limit_per_customer || 1;
                  const myUsedCount =
                    myPhone && Array.isArray(d.redemptions)
                      ? d.redemptions.filter(
                        (r) => normalizePhoneLocal(r.customer_phone) === myPhone
                      ).length
                      : 0;
                  const underPerCustomerLimit = myUsedCount < perCustomerLimit;

                  return isActive && notExpired && underTotalLimit && underPerCustomerLimit;
                });

                setLiveDiscounts(filtered);
              })
              .catch(() => { }),
          ]);
        }
      } catch (err) {
        console.warn("Catalog fetch warning handled safely:", err);
      }
    };
    loadSafeData();
  }, [sellerId, customerPhone]);

  useEffect(() => {
    if (sellerId && customerPhone) {
      fetchLoyaltyStatus(sellerId, customerPhone).catch(() => { });
    }
  }, [sellerId, customerPhone, fetchLoyaltyStatus]);

  useEffect(() => {
    const fetchSettings = async () => {
      if (!sellerId) return;
      try {
        const res = await API.get("/loyalty/settings", {
          params: { seller_id: sellerId }
        });
        if (res.data?.success && res.data?.settings) {
          setSettingsData(res.data.settings);
        }
      } catch (err) { }
    };
    fetchSettings();
  }, [sellerId]);

  useEffect(() => {
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
      } catch (err) { }
    };
    fetchRewardCoupons();
  }, [sellerId, customerPhone]);

  useEffect(() => {
    fetchCart().catch(() => { });
  }, [fetchCart]);

  useEffect(() => {
    try {
      if (typeof fetchOrders === "function") {
        fetchOrders().catch(() => { });
      }
    } catch (e) {
      console.warn("fetchOrders warning:", e);
    }
  }, [fetchOrders]);

  const latestActiveOrder = useMemo(() => {
    if (!orders || !Array.isArray(orders)) return null;
    return orders.find((order) =>
      ACTIVE_STATUSES.includes((order.delivery_status || "").toLowerCase())
    );
  }, [orders]);

  const products = useMemo(() => storefront.map(normalizeProduct), [storefront]);

  const topPicks = products.slice(0, 5);
  const bestSellers = products.slice(5, 10).length > 0 ? products.slice(5, 10) : products.slice(0, 5).reverse();
  const quickBites = products.slice(10, 15).length > 0 ? products.slice(10, 15) : products.slice(0, 4);

  const activeBanners = useMemo(() => {
    const list = [];
    if (publicBanners && publicBanners.length > 0) {
      publicBanners.forEach((b) => {
        const mappedProducts = (b.products || [])
          .filter((p) => p.product_id)
          .map((p) => ({
            id: p.product_id._id || p.product_id,
            name: p.product_id.name,
            image: p.product_id.image,
            price: p.banner_price ?? p.product_id.price,
          }));

        list.push({
          _id: b._id,
          tag: b.tag || "OFFER",
          title: b.title,
          subtitle: b.subtitle || "",
          description: b.subtitle || "Grab this special offer on our fresh menu items.",
          image: b.image_url,
          validity: "Active Offer",
          ctaText: b.cta_text || "View Deal Details",
          products: mappedProducts,
          isDeal: true,
        });
      });
    }

    if (festiveDeals && festiveDeals.length > 0) {
      festiveDeals.forEach((d) => {
        const dealProductIds = d.applicable_products || d.product_ids || [];

        let matchedProducts = d.applies_to_all_products
          ? products
          : (dealProductIds.length > 0
            ? products.filter(p => dealProductIds.some(id => String(id) === String(p.id) || String(id) === String(p._id)))
            : []);

        if (matchedProducts.length === 0 && dealProductIds.length > 0 && products.length > 0) {
          matchedProducts = [products[0]];
        }

        list.push({
          tag: "FESTIVE DEAL",
          title: d.title,
          subtitle: d.description || "Limited period special discount offer",
          description: d.description || "Grab this special festive offer on our fresh menu items.",
          image: d.banner_image || "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1200",
          validity: d.end_date ? `Valid till ${new Date(d.end_date).toLocaleDateString()}` : "Active Offer",
          ctaText: "View Deal Details",
          products: matchedProducts,
          isDeal: true
        });
      });
    }

    return list;
  }, [publicBanners, festiveDeals, products]);

  const exclusiveOffersList = useMemo(() => {
    const list = [];

    if (festiveDeals && festiveDeals.length > 0) {
      festiveDeals.forEach(d => {
        const dealProductIds = d.applicable_products || d.product_ids || [];
        let matchedProds = d.applies_to_all_products
          ? products
          : (dealProductIds.length > 0
            ? products.filter(p => dealProductIds.some(id => String(id) === String(p.id) || String(id) === String(p._id)))
            : []);

        if (matchedProds.length === 0 && dealProductIds.length > 0 && products.length > 0) {
          matchedProds = [products[0]];
        }

        list.push({
          _id: d._id || d.id,
          title: d.title || "Festive Deal",
          subtitle: d.description || `Special Offer Minimum order ₹${d.min_order_value || 0}`,
          code: d.code || "",
          description: d.description || "Special festive discount offer on store items.",
          validity: d.end_date ? `Valid till ${new Date(d.end_date).toLocaleDateString()}` : "Active Offer",
          image: d.banner_image || "",
          products: matchedProds,
          isDeal: true
        });
      });
    }

    if (liveDiscounts && liveDiscounts.length > 0) {
      liveDiscounts.forEach(disc => {
        list.push({
          _id: disc._id || disc.id,
          title: disc.title || (disc.discount_type === "percentage" ? `${disc.discount_value}% OFF` : `₹${disc.discount_value} OFF`),
          subtitle: `Use code: ${disc.code || "SPECIAL"} Minimum order ₹${disc.min_order_value || 0}`,
          code: disc.code || "",
          description: disc.description || "Get special discount on your order value.",
          validity: disc.valid_until ? `Valid till ${new Date(disc.valid_until).toLocaleDateString()}` : "Active Offer",
          image: "",
          products: [],
          isDeal: false
        });
      });
    }

    return list;
  }, [festiveDeals, liveDiscounts, products]);

  useEffect(() => {
    if (activeBanners.length === 0) return;
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % activeBanners.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [activeBanners.length]);

  const banner = activeBanners[currentBanner] || activeBanners[0];

  const handleBannerCta = (b) => {
    setSelectedOffer(b);
  };

  const getItemName = (item) => {
    return item?.product_id?.name || item?.name || item?.product_name || item?.title || "Delicious Item";
  };

  const getItemImage = (item) => {
    return item?.product_id?.image || item?.image || item?.product_image || item?.img || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400";
  };

  const getCartItem = (productId) =>
    cartItems.find((item) => {
      const pid =
        typeof item.product_id === "object"
          ? item.product_id?._id
          : item.product_id ?? item.productId ?? item.product?._id ?? item._id ?? item.id;
      return String(pid) === String(productId);
    });

  const handleAdd = async (product) => {
    if (!isLoggedIn) {
      setShowLoginPopup(true);
      return;
    }
    if (!isStoreOpen) {
      alert(`${businessCategory} is currently closed. Ordering is paused.`);
      return;
    }
    try {
      await addToCart(product);
    } catch (err) {
      console.error("Add to cart error:", err);
    }
  };

  const increaseQuantity = async (product) => {
    if (!isLoggedIn) {
      setShowLoginPopup(true);
      return;
    }
    if (!isStoreOpen) return;
    const existing = getCartItem(product.id);
    if (existing) {
      await updateQuantity(existing._id || existing.id, Number(existing.quantity) + 1);
    } else {
      await handleAdd(product);
    }
    await fetchCart();
  };

  const decreaseQuantity = async (product) => {
    if (!isStoreOpen) return;
    const existing = getCartItem(product.id);
    if (!existing) return;
    const targetId = existing._id || existing.id;
    if (Number(existing.quantity) <= 1) {
      await removeItem(targetId);
    } else {
      await updateQuantity(targetId, Number(existing.quantity) - 1);
    }
    await fetchCart();
  };

  const copyToClipboard = (code) => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const rewardTotalStamps = settingsData?.target_stamps || threshold || 5;
  const rewardEarnedStamps = stampsCollected || 0;

  const topRewardCoupon = rewardCoupons[0];
  let availableCouponCode = null;
  let availableCouponDesc = "Earn stamps on your orders to unlock exclusive discounts and free items.";
  let availableCouponTitle = "Keep Ordering!";
  let availableCouponTag = "Loyalty Program";

  if (topRewardCoupon) {
    availableCouponCode = topRewardCoupon.coupon_code;
    availableCouponTag = "Loyalty Reward";
    if (topRewardCoupon.discount_type === "FREE_PRODUCT") {
      availableCouponDesc = `Unlocked Item: ${topRewardCoupon.free_products?.[0]?.name || "Free Item"}`;
      availableCouponTitle = "1 Free Item";
    } else if (topRewardCoupon.discount_type === "percentage") {
      availableCouponDesc = "Your loyalty reward";
      availableCouponTitle = `${topRewardCoupon.discount_value}% OFF`;
    } else {
      availableCouponDesc = "Your loyalty reward";
      availableCouponTitle = `₹${topRewardCoupon.discount_value} OFF`;
    }
  } else if (liveDiscounts?.[0]) {
    availableCouponCode = liveDiscounts[0].code;
    availableCouponTag = "Active Deal";
    availableCouponDesc = liveDiscounts[0].description || "Use this special store discount";
    availableCouponTitle = liveDiscounts[0].discount_type === "percentage" ? `${liveDiscounts[0].discount_value}% OFF` : `₹${liveDiscounts[0].discount_value} OFF`;
  } else if (festiveDeals?.[0]) {
    availableCouponCode = festiveDeals[0].code;
    availableCouponTag = "Active Deal";
    availableCouponDesc = festiveDeals[0].description || "Special festive offer";
    availableCouponTitle = festiveDeals[0].title || "Festive Deal";
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-[1760px] mx-auto overflow-x-hidden space-y-6 sm:space-y-8 pb-28 font-sans text-slate-800 dark:text-slate-100 px-3 sm:px-6 box-border"
    >
      {!isStoreOpen && (
        <div className="w-full rounded-2xl bg-rose-50 border border-rose-200 p-4 text-rose-700 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <AlertCircle size={22} className="text-rose-600 shrink-0 animate-pulse" />
            <div>
              <h4 className="text-sm font-semibold">{businessCategory} is Currently Closed</h4>
              <p className="text-xs text-rose-600/90 font-medium">
                We are not accepting online orders right now. You can browse our items, but ordering is temporarily paused.
              </p>
            </div>
          </div>
          <span className="bg-rose-600 text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-full">
            Offline
          </span>
        </div>
      )}

      {activeBanners.length > 0 && (
        <div
          onClick={() => handleBannerCta(banner)}
          className="relative overflow-hidden rounded-3xl h-48 sm:h-64 lg:h-72 w-full shadow-sm cursor-pointer group"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={banner._id || currentBanner}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0 w-full h-full flex flex-col justify-center p-5 sm:p-8 lg:p-10 text-white"
            >
              <img
                src={banner.image}
                alt={banner.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />

              <div className="relative z-10 max-w-lg space-y-1.5 sm:space-y-2">
                <span
                  className="inline-block text-white border border-emerald-500/40 px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wider shadow-sm"
                  style={{ backgroundColor: "var(--primary-color)" }}
                >
                  {banner.tag}
                </span>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight leading-none text-white drop-shadow-md">
                  {banner.title}
                </h2>
                <p className="text-[11px] sm:text-xs lg:text-sm text-slate-200 tracking-wide uppercase drop-shadow-sm">
                  {banner.subtitle}
                </p>
                <div className="pt-1 flex items-center gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBannerCta(banner);
                    }}
                    onMouseEnter={applyHoverDark}
                    onMouseLeave={applyHoverReset}
                    className="rounded-2xl px-2 py-2 text-xs sm:text-sm text-white transition cursor-pointer shadow-lg flex items-center gap-2 border"
                    style={{ backgroundColor: "var(--primary-color)", borderColor: "var(--secondary-color)" }}
                  >
                    {banner.ctaText || "View Deal Details"} <ArrowRight size={15} />
                  </button>
                </div>
              </div>
              <AnimatePresence>
                {showLoginPopup && (
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowLoginPopup(false);
                    }}
                    className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
                  >
                    <motion.div
                      onClick={(e) => e.stopPropagation()}
                      initial={{ opacity: 0, scale: 0.9, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: 20 }}
                      transition={{ duration: 0.25 }}
                      className="w-full max-w-sm rounded-3xl bg-white dark:bg-[#181A1B] p-6 text-center space-y-4 shadow-2xl"
                    >
                      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400">
                        <UserRound size={28} />
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Login Required</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                          Please log in to add items to your cart and place an order.
                        </p>
                      </div>
                      <div className="flex flex-col gap-2 pt-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate("/auth/login");
                          }}
                          onMouseEnter={applyHoverDark}
                          onMouseLeave={applyHoverReset}
                          className="w-full rounded-2xl text-white py-3 text-sm font-semibold transition"
                          style={{ backgroundColor: "var(--primary-color)" }}
                        >
                          Login Now
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowLoginPopup(false);
                          }}
                          className="w-full rounded-2xl py-3 text-sm font-semibold text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10 transition"
                        >
                          Cancel
                        </button>
                      </div>
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>
            </motion.div>
          </AnimatePresence>

          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20">
            {activeBanners.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentBanner(idx);
                }}
                className={`h-2 rounded-full border transition-all cursor-pointer ${currentBanner === idx ? "w-5" : "w-2"
                  }`}
                style={{
                  borderColor:
                    currentBanner === idx
                      ? "var(--primary-color)"
                      : "rgba(255,255,255,0.6)",
                  backgroundColor: "transparent",
                }}
              />
            ))}
          </div>
        </div>
      )}

      {(tables?.length > 0 || !isLoggedIn) && (
        <div className="block sm:hidden w-full">
          <div className="block sm:hidden w-full flex flex-col gap-2.5">

            {/* ROW 1: Scan QR & Sign In */}
            {(tables?.length > 0 || !isLoggedIn) && (
              <div className="flex gap-1.5 w-full">

                {tables?.length > 0 && (
                  <div
                    onClick={() => navigate("/customer/scan-qr")}
                    className={`${isLoggedIn ? "w-full" : "w-1/2"} flex items-center justify-between p-2 rounded-2xl bg-white dark:bg-[#181A1B] shadow-xs cursor-pointer border border-emerald-500/30 hover:border-emerald-400 transition min-w-0`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-white/10 flex items-center justify-center text-slate-900 dark:text-white shrink-0">
                        <QrCode size={26} />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-[11px] font-bold text-slate-900 dark:text-white leading-tight truncate">
                          Scan Table QR
                        </h4>
                        <p className="text-[9px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                          Order Instantly
                        </p>
                      </div>
                    </div>
                    {isLoggedIn && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate("/customer/scan-qr");
                        }}
                        className="ml-2 h-7 px-4 rounded-full text-[11px] font-semibold shadow-xs whitespace-nowrap shrink-0 transition"
                        style={{
                          backgroundColor: "var(--primary-color)",
                          color: "var(--accent-color)",
                        }}
                      >
                        Scan
                      </button>
                    )}
                  </div>
                )}

                {!isLoggedIn && (
                  <div
                    onClick={() => navigate("/auth/login")}
                    className={`${tables?.length > 0 ? "w-1/2" : "w-full"} bg-white dark:bg-[#181A1B] rounded-2xl border border-slate-200 dark:border-white/10 shadow-xs p-2 cursor-pointer flex gap-2 items-center min-w-0`}
                  >
                    <div className="relative shrink-0 flex items-center">
                      <div className="relative">
                        <div className="h-10 w-10 rounded-full bg-emerald-50 flex items-center justify-center">
                          <UserRound
                            size={22}
                            strokeWidth={1.8}
                            style={{ color: "var(--primary-color)" }}
                          />
                        </div>
                        <div
                          className="absolute -top-1 -left-1 h-3.5 w-3.5 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: "var(--primary-color)" }}
                        >
                          <Gift size={8} className="text-white" />
                        </div>
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-white dark:bg-[#181A1B] border border-slate-300 dark:border-slate-700 rounded px-1 py-[1px] text-[7px] font-bold text-slate-700 dark:text-slate-300 shadow-2xs leading-none whitespace-nowrap">
                          Member
                        </div>
                      </div>
                    </div>
                    <div className="flex-1 flex items-center justify-between min-w-0">
                      <div className="min-w-0">
                        <h4 className="text-[11px] font-bold text-slate-900 dark:text-white leading-tight truncate">
                          Sign In
                        </h4>
                        <p className="mt-0.5 text-[9px] leading-tight text-slate-500 dark:text-slate-400 truncate">
                          Unlock Rewards
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate("/auth/login");
                        }}
                        onMouseEnter={applyHoverDark}
                        onMouseLeave={applyHoverReset}
                        className="h-7 px-3 ml-1 rounded-full text-white text-[10px] font-semibold flex items-center justify-center shadow-2xs shrink-0 transition"
                        style={{ backgroundColor: "var(--secondary-color)" }}
                      >
                        Sign In
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ROW 2: Book Table */}
            <div
              onClick={() => navigate("/customer/book-table")}
              className="w-full flex items-center justify-between p-2.5 sm:p-3 rounded-2xl bg-white dark:bg-[#181A1B] shadow-xs cursor-pointer border border-emerald-500/30 hover:border-emerald-400 transition min-w-0"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-white/10 flex items-center justify-center shrink-0" style={{ color: "var(--primary-color)" }}>
                  <UtensilsCrossed size={22} />
                </div>

                <div className="min-w-0">
                  <h4 className="text-[13px] font-bold text-slate-900 dark:text-white leading-tight truncate">
                    Reserve a Table
                  </h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                    Book in advance & skip the wait
                  </p>
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate("/customer/book-table");
                }}
                onMouseEnter={applyHoverDark}
                onMouseLeave={applyHoverReset}
                className="ml-2 h-8 px-4 rounded-full text-xs font-semibold shadow-xs whitespace-nowrap shrink-0 transition"
                style={{
                  backgroundColor: "var(--primary-color)",
                  color: "var(--accent-color)",
                }}
              >
                Book Now
              </button>
            </div>
          </div>
        </div>
      )}

      {latestActiveOrder && latestActiveOrder.items && latestActiveOrder.items.length > 0 && (
        <div className="space-y-3 w-full">
          <div className="flex items-center justify-between">
            <h3
              className="font-semibold text-base sm:text-lg"
            >
              Continue Ordering
            </h3>

            <button
              onClick={() => navigate("/customer/orders")}
              className="text-xs font-bold hover:underline cursor-pointer"
              style={{ color: "var(--primary-color)" }}
            >
              View All
            </button>
          </div>

          <div
            onClick={() => navigate(`/customer/orders/${latestActiveOrder._id}`)}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-3xl shadow-2xs cursor-pointer transition"
            style={{
              backgroundColor: "var(--accent-color)",
              border: "1px solid var(--secondary-color)",
            }}
          >
            <div className="flex items-center gap-3.5">
              {latestActiveOrder.items.length === 1 ? (
                <div className="flex items-center gap-3.5">
                  <div
                    className="h-14 w-14 rounded-2xl overflow-hidden shrink-0"
                    style={{ backgroundColor: "var(--secondary-color)" }}
                  >
                    <img
                      src={getItemImage(latestActiveOrder.items[0])}
                      alt={getItemName(latestActiveOrder.items[0])}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4
                        className="text-sm sm:text-base font-black"
                      >
                        {getItemName(latestActiveOrder.items[0])}
                      </h4>

                      <span
                        className="text-[10px] font-bold"
                      >
                        #ORD{String(latestActiveOrder._id || "").slice(-6).toUpperCase()}
                      </span>
                    </div>

                    <p className="text-xs font-medium mt-0.5">
                      Qty: {latestActiveOrder.items[0].quantity || 1} &middot;{" "}
                      {latestActiveOrder.items[0].variant?.name ||
                        latestActiveOrder.items[0].selectedVariant?.name ||
                        "Standard"}
                    </p>

                    <p
                      className="text-sm font-black mt-1"
                    >
                      ₹{latestActiveOrder.total_amount || 0}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3.5">
                  <div className="flex -space-x-3 overflow-hidden p-1">
                    {latestActiveOrder.items.slice(0, 3).map((it, idx) => (
                      <div
                        key={idx}
                        className="h-14 w-14 rounded-2xl overflow-hidden ring-2 shrink-0"
                        style={{
                          backgroundColor: "var(--secondary-color)",
                          borderColor: "var(--accent-color)",
                        }}
                      >
                        <img
                          src={getItemImage(it)}
                          alt={getItemName(it)}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ))}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4
                        className="text-sm sm:text-base font-black"
                        style={{ color: "var(--primary-color)" }}
                      >
                        {getItemName(latestActiveOrder.items[0])}
                        {latestActiveOrder.items.length > 1
                          ? ` + ${latestActiveOrder.items.length - 1} more items`
                          : ""}
                      </h4>

                      <span
                        className="text-[10px] font-bold"
                        style={{ color: "var(--secondary-color)" }}
                      >
                        #ORD{String(latestActiveOrder._id || "").slice(-6).toUpperCase()}
                      </span>
                    </div>

                    <p
                      className="text-xs font-medium mt-0.5"
                      style={{ color: "var(--primary-color)" }}
                    >
                      Total{" "}
                      {latestActiveOrder.items.reduce(
                        (acc, curr) => acc + (Number(curr.quantity) || 1),
                        0
                      )}{" "}
                      items in order
                    </p>

                    <p
                      className="text-sm font-black mt-1"
                      style={{ color: "var(--primary-color)" }}
                    >
                      ₹{latestActiveOrder.total_amount || 0}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div
              className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-3 sm:pt-0"
              style={{ borderColor: "var(--secondary-color)" }}
            >
              <div className="text-left sm:text-right">
                <span
                  className="rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase"
                  style={{
                    backgroundColor:
                      "color-mix(in srgb, var(--primary-color) 15%, transparent)",
                    color: "var(--primary-color)",
                  }}
                >
                  {latestActiveOrder.delivery_status || "Active"}
                </span>

                <div className="flex items-center gap-1.5 mt-2">
                  <div
                    className="h-1.5 w-16 sm:w-24 rounded-full"
                    style={{ backgroundColor: "var(--primary-color)" }}
                  />

                  <span
                    className="text-[10px] font-bold"
                    style={{ color: "var(--primary-color)" }}
                  >
                    Live Status
                  </span>
                </div>
              </div>

              <button
                onClick={async (e) => {
                  e.stopPropagation();

                  if (!isStoreOpen) {
                    alert(`Store ${businessCategory} is currently closed.`);
                    return;
                  }

                  if (latestActiveOrder.items && addToCart) {
                    for (const item of latestActiveOrder.items) {

                      const cartReadyItem = {
                        ...item,
                        _id: item.product_id?._id || item.product_id || item._id,
                        id: item.product_id?._id || item.product_id || item.id,
                        variant: item.variant || item.selectedVariant || null
                      };

                      try {
                        await addToCart(cartReadyItem, item.quantity || 1);
                      } catch (err) {
                        console.error("Cart add error:", err);
                      }
                    }

                    navigate("/customer/cart");
                  } else {
                    navigate("/customer/menu");
                  }
                }}
                disabled={!isStoreOpen}
                className="rounded-2xl px-4 py-2 text-xs font-bold transition shadow-xs shrink-0 cursor-pointer"
                style={{
                  backgroundColor: isStoreOpen
                    ? "var(--primary-color)"
                    : "var(--secondary-color)",
                  color: isStoreOpen
                    ? "var(--accent-color)"
                    : "var(--primary-color)",
                }}
              >
                {isStoreOpen ? "Order Again" : "Closed"}
              </button>
            </div>
          </div>
        </div>
      )}

      {topPicks.length > 0 && (
        <div className="space-y-3 w-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles size={20} className="text-amber-500" />
              <h3 className="font-semibold text-slate-900 dark:text-white text-base sm:text-lg">Top Picks For You</h3>
            </div>
            <button
              onClick={() => navigate("/customer/menu")}
              className="text-xs font-bold hover:underline cursor-pointer" style={{ color: "var(--primary-color)" }}
            >
              View All
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 w-full">
            {topPicks.map((product) => {
              const qty = getCartItem(product.id)?.quantity || 0;
              const isFav = isProductFavourite(favouriteProducts, product.id);

              return (
                <ReusableProductCard
                  key={product.id || product._id}
                  product={product}
                  qty={qty}
                  isFav={isFav}
                  isStoreOpen={isStoreOpen}
                  onCardClick={(prod) => navigate(`/customer/product/${prod.id || prod._id}`)}
                  onToggleFavourite={(prod) => toggleFavourite(prod)}
                  onAdd={(prod) => handleAdd(prod)}
                  onIncrease={(prod) => increaseQuantity(prod)}
                  onDecrease={(prod) => decreaseQuantity(prod)}
                />
              );
            })}
          </div>
        </div>
      )}

      {bestSellers.length > 0 && (
        <div className="space-y-3 w-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame size={20} className="text-orange-500" />
              <h3 className="font-semibold text-slate-900 dark:text-white text-base sm:text-lg">What's Popular & Trending</h3>
            </div>
            <button
              onClick={() => navigate("/customer/menu")}
              className="text-xs font-bold hover:underline cursor-pointer" style={{ color: "var(--primary-color)" }}
            >
              View All
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 w-full">
            {bestSellers.map((product) => {
              const qty = getCartItem(product.id)?.quantity || 0;
              const isFav = isProductFavourite(favouriteProducts, product.id);

              return (
                <ReusableProductCard
                  key={product.id || product._id}
                  product={product}
                  qty={qty}
                  isFav={isFav}
                  isStoreOpen={isStoreOpen}
                  badge="Trending"
                  onCardClick={(prod) => navigate(`/customer/product/${prod.id || prod._id}`)}
                  onToggleFavourite={(prod) => toggleFavourite(prod)}
                  onAdd={(prod) => handleAdd(prod)}
                  onIncrease={(prod) => increaseQuantity(prod)}
                  onDecrease={(prod) => decreaseQuantity(prod)}
                />
              );
            })}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 w-full">
        <div
          className="lg:col-span-7 rounded-3xl p-5 sm:p-6 text-white shadow-sm space-y-3 flex flex-col justify-between"
          style={{ backgroundColor: "var(--primary-color)" }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-base sm:text-lg" style={{ color: "var(--accent-color)" }}>Loyalty Progress</h3>
            </div>
            <button
              onClick={() => navigate("/customer/rewards")}
              className="text-xs font-bold text-emerald-200 hover:underline cursor-pointer" style={{ color: "var(--accent-color)" }}
            >
              View Details →
            </button>
          </div>

          <p className="text-xs font-medium" style={{ color: "var(--accent-color)" }}>
            {rewardEarnedStamps} / {rewardTotalStamps} Stamps Collected
          </p>

          <div className="relative flex items-center justify-between py-4 px-2">
            <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-[3px] z-0" style={{ backgroundColor: "var(--secondary-color)" }} />

            {Array.from({ length: rewardTotalStamps }).map((_, i) => {
              const earned = i < rewardEarnedStamps;
              return (
                <div key={i} className="relative z-10 flex flex-col items-center">
                  <div
                    className={`h-8 w-8 sm:h-9 sm:w-9 rounded-full flex items-center justify-center text-xs font-bold border-2 transition`}
                    style={
                      earned
                        ? {
                          backgroundColor: "var(--accent-color)",
                          color: "var(--secondary-color)",
                          borderColor: "var(--accent-color)",
                        }
                        : {
                          backgroundColor: "var(--secondary-color)",
                          color: "var(--accent-color)",
                          borderColor: "var(--secondary-color)",
                        }
                    }
                  >
                    {earned ? <Star size={13} fill="currentColor" /> : i + 1}
                  </div>
                </div>
              );
            })}
          </div>

          <p className="text-[11px] font-bold text-center pt-1" style={{ color: "var(--accent-color)" }}>
            Collect {Math.max(0, rewardTotalStamps - rewardEarnedStamps)} more stamps to unlock your reward
          </p>
        </div>

        <div
          className="lg:col-span-5 rounded-3xl p-5 sm:p-6 shadow-sm flex flex-col justify-between space-y-3"
          style={{
            backgroundColor: "color-mix(in srgb, var(--secondary-color) 12%, white)",
            border: "1px solid color-mix(in srgb, var(--primary-color) 25%, white)",
            color: "var(--primary-color)",
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-xl text-white flex items-center justify-center shadow-xs"
                style={{ backgroundColor: "var(--primary-color)" }}>
                <Percent size={18} />
              </div>
              <h3 className="font-semibold text-slate-900 text-base sm:text-lg">{availableCouponTitle}</h3>
            </div>
            <span
              className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full"
              style={{
                color: "var(--primary-color)",
                backgroundColor: "color-mix(in srgb, var(--primary-color) 20%, transparent)",
              }}
            >
              {availableCouponTag}
            </span>
          </div>

          <div className="space-y-1">
            <p className="text-xs text-slate-600 font-medium">
              {availableCouponDesc}
            </p>

            {availableCouponCode ? (
              <div className="flex items-center justify-between bg-white border rounded-2xl p-2.5 mt-2 shadow-2xs" style={{ backgroundColor: "var(--accent-color)", borderColor: "var(--secondary-color)" }}>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Coupon Code</span>
                  <span className="font-mono font-black text-sm tracking-wider" style={{ color: "var(--primary-color)" }}>{availableCouponCode}</span>
                </div>
                <button
                  onClick={() => copyToClipboard(availableCouponCode)}
                  onMouseEnter={applyHoverDark}
                  onMouseLeave={applyHoverReset}
                  className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-[11px] sm:text-xs font-bold text-white shadow-sm transition active:scale-95 cursor-pointer"
                  style={{ backgroundColor: "var(--primary-color)" }}
                >
                  {copiedCode ? <Check size={14} /> : <Copy size={14} />}
                  {copiedCode ? "Copied" : "Copy"}
                </button>
              </div>
            ) : (
              <div className="mt-2 text-xs font-semibold text-slate-500 bg-white/50 p-3 rounded-xl border border-dashed border-emerald-200">
                Keep ordering to unlock your next big reward!
              </div>
            )}
          </div>

          <button
            onClick={() => navigate("/customer/rewards")}
            className="w-full rounded-2xl py-2.5 text-xs font-bold transition shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
            style={{ backgroundColor: "var(--primary-color)", color: "var(--accent-color" }}
          >
            View All Rewards & Coupons <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {quickBites.length > 0 && (
        <div className="space-y-3 w-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <UtensilsCrossed size={18} style={{ color: "var(--primary-color)" }} />
              <h3 className="font-semibold text-slate-900 dark:text-white text-base sm:text-lg">Gourmet Specials & Quick Bites</h3>
            </div>
            <button
              onClick={() => navigate("/customer/menu")}
              className="text-xs font-bold hover:underline cursor-pointer" style={{ color: "var(--primary-color)" }}
            >
              View All
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 w-full">
            {quickBites.map((product) => {
              const qty = getCartItem(product.id)?.quantity || 0;
              const isFav = isProductFavourite(favouriteProducts, product.id);

              return (
                <ReusableProductCard
                  key={product.id || product._id}
                  product={product}
                  qty={qty}
                  isFav={isFav}
                  isStoreOpen={isStoreOpen}
                  onCardClick={(prod) => navigate(`/customer/product/${prod.id || prod._id}`)}
                  onToggleFavourite={(prod) => toggleFavourite(prod)}
                  onAdd={(prod) => handleAdd(prod)}
                  onIncrease={(prod) => increaseQuantity(prod)}
                  onDecrease={(prod) => decreaseQuantity(prod)}
                />
              );
            })}
          </div>
        </div>
      )}

      {exclusiveOffersList.length > 0 && (
        <div className="space-y-3 w-full">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-slate-900 dark:text-white text-base sm:text-lg">Exclusive Offers</h3>
            <button
              onClick={() => navigate("/customer/rewards")}
              className="text-xs font-bold text-emerald-700 hover:underline cursor-pointer" style={{ color: "var(--primary-color)" }}
            >
              View All
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full">
            {exclusiveOffersList.map((offer, index) => (
              <div
                key={offer._id || index}
                onClick={() => setSelectedOffer(offer)}
                className="flex items-center justify-between p-4 rounded-3xl cursor-pointer transition shadow-2xs"
                style={{
                  backgroundColor:
                    "color-mix(in srgb, var(--secondary-color) 12%, transparent)",
                  border:
                    "1px solid color-mix(in srgb, var(--primary-color) 25%, transparent)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor =
                    "color-mix(in srgb, var(--secondary-color) 20%, transparent)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor =
                    "color-mix(in srgb, var(--secondary-color) 12%, transparent)";
                }}
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className="flex h-11 w-11 items-center justify-center rounded-2xl shrink-0 shadow-xs"
                    style={{
                      backgroundColor: "var(--primary-color)",
                      color: "var(--accent-color)",
                    }}
                  >
                    <Percent size={20} />
                  </div>

                  <div>
                    <h4
                      className="text-sm font-semibold font-black"
                      style={{ color: "var(--primary-color)" }}
                    >
                      {offer.title || "Special Deal"}
                    </h4>

                    <p
                      className="text-xs font-medium mt-0.5"
                      style={{ color: "var(--secondary-color)" }}
                    >
                      {offer.subtitle || offer.description}
                    </p>
                  </div>
                </div>

                <div
                  className="h-8 w-8 rounded-full flex items-center justify-center"
                  style={{
                    backgroundColor:
                      "color-mix(in srgb, var(--primary-color) 15%, transparent)",
                    color: "var(--primary-color)",
                  }}
                >
                  <ChevronRight size={18} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <AnimatePresence>
        {selectedOffer && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 sm:p-6 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="relative flex w-full max-w-lg flex-col overflow-hidden rounded-[28px] sm:rounded-3xl bg-white dark:bg-[#181A1B] shadow-2xl max-h-[85vh]"
            >
              <button
                onClick={() => setSelectedOffer(null)}
                className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 z-20 flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md transition hover:bg-black/60 active:scale-95 cursor-pointer"
              >
                <X size={18} />
              </button>

              {selectedOffer.image && (
                <div className="relative h-40 sm:h-48 w-full shrink-0 bg-slate-100 dark:bg-white/10">
                  <img
                    src={selectedOffer.image}
                    alt="Deal Banner"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  <span
                    className="absolute bottom-3 left-4 sm:left-6 rounded-full bg-white px-2.5 py-1 text-[9px] sm:text-[10px] font-black uppercase tracking-wider shadow-lg"
                    style={{ color: "var(--primary-color)" }}
                  >
                    {selectedOffer.isDeal ? "Festive Deal" : "Discount Coupon"}
                  </span>
                </div>
              )}

              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 sm:space-y-6 scrollbar-hide">

                <div className="space-y-1">
                  <h3 className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white leading-tight">
                    {selectedOffer.title}
                  </h3>
                  <p className="text-[11px] sm:text-sm font-bold" style={{ color: "var(--primary-color)" }}>
                    {selectedOffer.subtitle}
                  </p>
                </div>

                <div className="space-y-2 rounded-2xl border border-emerald-100 bg-emerald-50/50 p-3.5 sm:p-4">
                  <p className="text-[11px] sm:text-[13px] font-medium leading-relaxed text-slate-700">
                    {selectedOffer.description ||
                      "Grab this special offer and enjoy our delicious items at an incredible discounted value."}
                  </p>
                  <p className="pt-1 text-[10px] sm:text-[11px] font-bold flex items-center gap-1.5" style={{ color: "var(--primary-color)" }}>
                    <Clock size={12} /> {selectedOffer.validity}
                  </p>
                </div>

                {selectedOffer.code && (
                  <div className="space-y-1.5">
                    <label className="text-[10px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                      Coupon Code
                    </label>
                    <div
                      className="flex items-center justify-between rounded-xl border border-dashed bg-emerald-50/30 p-1.5 pl-3.5"
                      style={{ borderColor: "color-mix(in srgb, var(--primary-color) 40%, transparent)" }}
                    >
                      <span className="font-mono text-sm sm:text-base font-black tracking-wider" style={{ color: "var(--primary-color)" }}>
                        {selectedOffer.code}
                      </span>
                      <button
                        onClick={() => copyToClipboard(selectedOffer.code)}
                        className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-[11px] sm:text-xs font-bold text-white shadow-sm transition active:scale-95 cursor-pointer"
                        style={{ backgroundColor: "var(--primary-color)" }}
                      >
                        {copiedCode ? <Check size={14} /> : <Copy size={14} />}
                        {copiedCode ? "Copied" : "Copy"}
                      </button>
                    </div>
                  </div>
                )}

                {selectedOffer.products && selectedOffer.products.length > 0 && (
                  <div className="space-y-2.5 pt-1">
                    <h4 className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      Products Included in this Deal
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {selectedOffer.products.map((product) => (
                        <div
                          key={product.id}
                          className="flex items-center gap-3 rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#181A1B] p-2 sm:p-2.5 shadow-2xs"
                        >
                          <img
                            src={product.image}
                            alt={product.name}
                            className="h-10 w-10 sm:h-12 sm:w-12 shrink-0 rounded-xl object-cover bg-slate-100 dark:bg-white/10"
                          />
                          <div className="min-w-0 flex-1">
                            <h5 className="truncate text-[11px] sm:text-xs font-bold text-slate-900 dark:text-white">
                              {product.name}
                            </h5>
                            <p className="mt-0.5 text-[11px] font-black" style={{ color: "var(--primary-color)" }}>
                              ₹{product.price}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="shrink-0 border-t border-slate-100 dark:border-white/10 bg-white dark:bg-[#181A1B] p-3.5 sm:p-5 shadow-[0_-10px_15px_-3px_rgba(0,0,0,0.05)]">
                <button
                  onClick={async () => {
                    if (!isStoreOpen) {
                      alert(`Store ${businessCategory} is currently offline/closed. Ordering is paused.`);
                      return;
                    }
                    const dealProducts =
                      selectedOffer.products && selectedOffer.products.length > 0
                        ? selectedOffer.products
                        : [];

                    for (const prod of dealProducts) {
                      await handleAdd(prod);
                    }
                    await fetchCart();
                    setSelectedOffer(null);
                    navigate("/customer/cart");
                  }}
                  onMouseEnter={isStoreOpen ? applyHoverDark : undefined}
                  onMouseLeave={isStoreOpen ? applyHoverReset : undefined}
                  disabled={!isStoreOpen}
                  className={`flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl py-3 sm:py-4 text-[11px] sm:text-sm font-bold text-white shadow-lg transition active:scale-[0.98] ${!isStoreOpen ? "cursor-not-allowed bg-slate-400 shadow-none" : ""
                    }`}
                  style={isStoreOpen ? { backgroundColor: "var(--primary-color)" } : undefined}
                >
                  {isStoreOpen ? (
                    <>
                      {selectedOffer.products && selectedOffer.products.length > 0
                        ? "Order Deal Now"
                        : "Explore Menu & Apply Offer"}
                      <ShoppingBag size={15} className="sm:h-[18px] sm:w-[18px]" />
                    </>
                  ) : (
                    "Store Currently Closed"
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}