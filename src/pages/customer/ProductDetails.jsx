import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import {
  ArrowLeft,
  ShoppingBag,
  Star,
  Clock,
  Flame,
  Check,
  Plus,
  Minus,
  Heart,
  ShieldCheck
} from "lucide-react";

import ProductSkeleton from "../../components/customer/product/ProductSkeleton";
import useCartStore from "../../api/stores/customerstore/cartStore";
import useGuestCartStore from "../../api/stores/customerstore/guestCartStore";
import useTableStore from "../../store/tableStore";
import { useFavourite } from "../../context/FavouriteContext";
import { mockProducts } from "../../data/customerMockData";

export default function ProductDetails() {
  const { id, table_token } = useParams();
  const navigate = useNavigate();

  const isGuestFlow = !!table_token;

  const { favouriteProducts, toggleFavourite } = useFavourite();

  // Auth cart
  const authAddToCart = useCartStore((s) => s.addToCart);

  // Guest cart
  const guestCart = useGuestCartStore();
  const resolveTable = useTableStore((s) => s.resolveTable);
  const resolvedTable = useTableStore((s) => s.resolvedTable);

  const addToCart = isGuestFlow ? guestCart.addToCart : authAddToCart;

  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [product, setProduct] = useState(null);
  const [isAdding, setIsAdding] = useState(false);

  // Guest: resolve table + set token in guest cart store (same as Menu.jsx)
  useEffect(() => {
    if (!isGuestFlow) return;
    guestCart.setTableToken(table_token);

    if (!resolvedTable || resolvedTable.table_token !== table_token) {
      resolveTable(table_token).catch((err) =>
        console.error("Table resolve failed:", err)
      );
    }
  }, [table_token, isGuestFlow]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = mockProducts.find((item) => String(item._id || item.id) === String(id));
        if (!data) throw new Error("Product not found");
        setProduct(data);

        const rawVariants = data?.variants || data?.sizes || data?.options || [];
        if (rawVariants.length > 0) {
          const normalized = normalizeVariants(rawVariants);
          setSelectedVariant(normalized[0]);
        }
      } catch (err) {
        console.error("Error loading product details:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      load();
    }
  }, [id]);

  // Reset selected addons whenever the variant changes — addons are
  // variant-specific (different _id/price per variant), so previously
  // selected addons from another variant should not carry over.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSelectedAddons([]);
  }, [selectedVariant?._id]);

  function normalizeVariants(raw) {
    return raw.map((v) => {
      if (typeof v === "string") return { _id: v, name: v, price_delta: 0, offer_price: null };
      return {
        _id: v._id,
        name: v.name,
        price_delta: Number(
          v.price_delta ?? v.price ?? v.additional_price ?? 0
        ),
        offer_price:
          v.offer_price !== undefined && v.offer_price !== null ? Number(v.offer_price) : null,
      };
    });
  }

  const isFav = favouriteProducts.some((item) => item.id === product?._id || item.id === product?.id);

  // Guest-safe back navigation — Menu open karo table_token ke sath
  const goBack = () => {
    if (isGuestFlow) {
      navigate(`/customer/menu/${table_token}`);
    } else {
      navigate(-1);
    }
  };

  const handleAddToCart = async () => {
    if (quantity <= 0 || isAdding || !isAvailable) return;
    try {
      setIsAdding(true);

      const payload = {
        ...product,
        quantity,
        selectedVariant: selectedVariant
          ? { name: selectedVariant.name, price_delta: selectedVariant.price_delta, offer_price: selectedVariant.offer_price }
          : null,
        selectedAddons,
      };

      if (isGuestFlow) {
        guestCart.addToCart(payload);
        toast.success(`${product.name} added to your cart.`);
      } else {
        await addToCart(payload);
        toast.success(`${product.name} added to your cart.`);
        navigate("/customer/cart");
      }
    } catch (error) {
      console.error("Failed to add to cart:", error);
      toast.error(error?.response?.data?.message || "Unable to add this item to your cart.");
    } finally {
      setIsAdding(false);
    }
  };

  // Track selection by _id (falls back to name) — addon names can repeat
  // across variants (e.g. "Double Cheese" for both Small & Medium) with
  // different _id/price, so name-only matching would misidentify them.
  const handleAddonToggle = (addon) => {
    const addonId = addon._id || addon.name || addon;
    if (selectedAddons.some((a) => (a._id || a.name || a) === addonId)) {
      setSelectedAddons(selectedAddons.filter((a) => (a._id || a.name || a) !== addonId));
    } else {
      setSelectedAddons([...selectedAddons, addon]);
    }
  };

  if (loading) {
    return <ProductSkeleton />;
  }

  if (!product) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-[#1E2021]">
        <div className="text-center space-y-3">
          <p className="text-base font-semibold text-slate-700 dark:text-slate-300">Product not found or unavailable.</p>
          <button
            onClick={goBack}
            className="rounded-xl px-5 py-2.5 text-xs font-semibold text-white shadow-sm cursor-pointer"
            style={{ backgroundColor: "var(--primary-color)" }}
          >
            Back to Menu
          </button>
        </div>
      </div>
    );
  }

  const rawVariants = product.variants || product.sizes || product.options || [];
  const realVariants = normalizeVariants(rawVariants);

  // Addons are variant-specific via `applicable_variants` (array of variant _ids).
  // An addon with no applicable_variants (or an empty array) is treated as
  // available for every variant.
  const rawAddonsList = product.addons || product.toppings || [];
  const realAddons = rawAddonsList.filter((addon) => {
    if (!addon.applicable_variants || addon.applicable_variants.length === 0) return true;
    if (!selectedVariant?._id) return false;
    return addon.applicable_variants.includes(selectedVariant._id);
  });

  const isAvailable = product.is_available !== false && product.available !== false;

  const addonsExtra = selectedAddons.reduce((acc, curr) => acc + (Number(curr.price) || 0), 0);

  const activeItemBasePrice = selectedVariant
    ? Number(selectedVariant.price_delta || 0)
    : Number(product.price || 0);

  const activeOfferPrice = selectedVariant ? selectedVariant.offer_price : product.offer_price;

  const hasActiveOffer =
    activeOfferPrice !== null &&
    activeOfferPrice !== undefined &&
    Number(activeOfferPrice) < activeItemBasePrice;

  const currentItemPrice = hasActiveOffer ? Number(activeOfferPrice) : activeItemBasePrice;

  const basePrice = currentItemPrice + addonsExtra;
  const totalPrice = basePrice * quantity;

  const strikethroughPrice = hasActiveOffer ? activeItemBasePrice : null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-slate-50 dark:bg-[#1E2021] pb-44 sm:pb-40 font-sans text-slate-800 dark:text-slate-200"
    >
      <div className="sticky top-0 z-30 bg-white dark:bg-[#181A1B] border-b border-slate-200 dark:border-white/10 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <button
          onClick={goBack}
          className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300 cursor-pointer"
        >
          <ArrowLeft size={16} />
          Back to Menu
        </button>
        <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
          {isGuestFlow && resolvedTable?.table_number
            ? `Table ${resolvedTable.table_number}`
            : "Item Details"}
        </span>
      </div>

      <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          <div className="lg:col-span-5 lg:sticky lg:top-24">
            <div className="relative rounded-2xl overflow-hidden bg-slate-200 dark:bg-white/10 h-64 sm:h-80 w-full">
              <img
                src={product.image}
                alt={product.name}
                className={`h-full w-full object-cover ${!isAvailable ? "grayscale opacity-60" : ""}`}
              />

              <button
                onClick={() => toggleFavourite(product)}
                className="absolute top-3 right-3 h-9 w-9 rounded-full bg-white dark:bg-[#181A1B] flex items-center justify-center text-slate-600 dark:text-slate-300 shadow-sm cursor-pointer"
              >
                <Heart size={16} fill={isFav ? "#f43f5e" : "none"} color={isFav ? "#f43f5e" : "#475569"} />
              </button>

              {!isAvailable && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/35">
                  <span className="bg-white text-slate-900 text-sm font-bold px-4 py-1.5 rounded-full shadow-sm">
                    Sold Out
                  </span>
                </div>
              )}

              {isAvailable && product.is_bestseller && (
                <div className="absolute bottom-3 left-3 bg-black/55 text-white text-[11px] font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5">
                  <Flame size={12} className="text-orange-400" /> Bestseller
                </div>
              )}

              {isAvailable && hasActiveOffer && (
                <div className="absolute top-3 left-3 bg-orange-500 text-white text-[11px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wide">
                  Offer
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-7 space-y-4">

            <div className="bg-white dark:bg-[#181A1B] rounded-2xl border border-slate-200 dark:border-white/10 p-5 space-y-3">
              <div className="flex items-center gap-2">
                <span
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase"
                  style={
                    product.is_veg !== false
                      ? { backgroundColor: "color-mix(in srgb, var(--primary-color) 10%, transparent)", color: "var(--primary-color)" }
                      : { backgroundColor: "#fef2f2", color: "#be123c" }
                  }
                >
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: product.is_veg !== false ? "var(--primary-color)" : "#be123c" }}
                  />
                  {product.is_veg !== false ? "Veg" : "Non-Veg"}
                </span>
                {product.is_bestseller && (
                  <span className="inline-flex items-center gap-1 bg-orange-50 text-orange-600 px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase">
                    <Flame size={10} /> Bestseller
                  </span>
                )}
                {!isAvailable && (
                  <span className="inline-flex items-center gap-1 bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-400 px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase">
                    Sold Out
                  </span>
                )}
              </div>

              <div className="space-y-1">
                <h1 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white">{product.name}</h1>
                <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 font-medium">
                  <span className="flex items-center gap-1 text-amber-600 font-semibold">
                    <Star size={13} fill="currentColor" /> {product.rating || 4.6}
                  </span>
                  <span className="h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-600" />
                  <span className="flex items-center gap-1">
                    <Clock size={13} /> 25–30 mins
                  </span>
                </div>
              </div>

              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                {product.description || "Freshly prepared with premium ingredients and authentic spices."}
              </p>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-baseline gap-2">
                  {strikethroughPrice !== null && (
                    <span className="text-base font-medium text-slate-400 dark:text-slate-500 line-through">
                      ₹{strikethroughPrice}
                    </span>
                  )}
                  <h3 className="text-2xl font-semibold text-slate-900 dark:text-white">₹{basePrice}</h3>
                </div>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium uppercase mt-1">Inclusive of all taxes</p>
              </div>
            </div>

            {realVariants.length > 0 && (
              <div className="bg-white dark:bg-[#181A1B] rounded-2xl border border-slate-200 dark:border-white/10 p-5 space-y-3">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Choose Size / Variant</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {realVariants.map((v, idx) => {
                    const isSelected = selectedVariant?._id
                      ? selectedVariant._id === v._id
                      : selectedVariant?.name === v.name;
                    const vHasOffer =
                      v.offer_price !== null &&
                      v.offer_price !== undefined &&
                      Number(v.offer_price) < Number(v.price_delta || 0);

                    return (
                      <button
                        key={v._id || idx}
                        onClick={() => isAvailable && setSelectedVariant(v)}
                        disabled={!isAvailable}
                        className="p-3 rounded-xl border text-left transition flex flex-col items-start gap-1 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 relative"
                        style={
                          isSelected
                            ? { borderColor: "var(--primary-color)", backgroundColor: "color-mix(in srgb, var(--primary-color) 5%, transparent)" }
                            : { borderColor: "#e2e8f0" }
                        }
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="text-xs font-semibold text-slate-900 dark:text-white">{v.name}</span>
                          {isSelected && <Check size={14} style={{ color: "var(--primary-color)" }} />}
                        </div>
                        <div className="flex items-baseline gap-1.5">
                          {vHasOffer && (
                            <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 line-through">
                              ₹{Number(v.price_delta || 0)}
                            </span>
                          )}
                          <span className="text-xs font-semibold" style={{ color: "var(--primary-color)" }}>
                            ₹{vHasOffer ? Number(v.offer_price) : Number(v.price_delta || 0)}
                          </span>
                        </div>
                        {vHasOffer && (
                          <span className="absolute top-1.5 right-1.5 bg-orange-500 text-white text-[8px] font-black uppercase px-1.5 py-0.5 rounded-full">
                            Offer
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {realAddons.length > 0 && (
              <div className="bg-white dark:bg-[#181A1B] rounded-2xl border border-slate-200 dark:border-white/10 p-5 space-y-3">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Add Extra Toppings</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {realAddons.map((addon, idx) => {
                    const addonId = addon._id || addon.name || addon;
                    const addonName = addon.name || addon;
                    const addonPrice = addon.price || 0;
                    const isChecked = selectedAddons.some((a) => (a._id || a.name || a) === addonId);
                    return (
                      <button
                        key={addon._id || idx}
                        onClick={() => isAvailable && handleAddonToggle(addon)}
                        disabled={!isAvailable}
                        className="p-3 rounded-xl border cursor-pointer transition flex flex-col justify-between gap-2 text-left disabled:cursor-not-allowed disabled:opacity-50"
                        style={
                          isChecked
                            ? { borderColor: "var(--primary-color)", backgroundColor: "color-mix(in srgb, var(--primary-color) 5%, transparent)" }
                            : { borderColor: "#e2e8f0" }
                        }
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-xs font-medium text-slate-800 dark:text-slate-200">{addonName}</span>
                          <div
                            className="h-5 w-5 shrink-0 rounded-md border flex items-center justify-center"
                            style={
                              isChecked
                                ? { backgroundColor: "var(--primary-color)", borderColor: "var(--primary-color)", color: "#fff" }
                                : { borderColor: "#cbd5e1" }
                            }
                          >
                            {isChecked && <Check size={12} />}
                          </div>
                        </div>
                        <span className="text-[11px] font-semibold" style={{ color: "var(--primary-color)" }}>+₹{addonPrice}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="bg-white dark:bg-[#181A1B] rounded-2xl border border-slate-200 dark:border-white/10 p-5 space-y-3">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Product Information</h3>
              <div className="grid grid-cols-3 gap-2.5">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 flex flex-col items-start gap-1.5">
                  <ShieldCheck size={18} style={{ color: "var(--primary-color)" }} />
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">Food Type</span>
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">{product.is_veg !== false ? "Veg" : "Non-Veg"}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 flex flex-col items-start gap-1.5">
                  <Star size={18} className="text-amber-500" />
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">Rating</span>
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">{product.rating || 4.6}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 flex flex-col items-start gap-1.5">
                  <Clock size={18} className="text-amber-500" />
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">Prep. Time</span>
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">25–30 mins</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      <div className="fixed bottom-[60px] sm:bottom-0 left-0 right-0 z-[9999] bg-white dark:bg-[#181A1B] border-t border-slate-200 dark:border-white/10 px-3 sm:px-10 py-2.5 sm:py-4 w-full shadow-[0_-4px_16px_rgba(0,0,0,0.06)]">
        <div className="max-w-[1200px] mx-auto flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">

          <div className="flex items-center justify-between sm:block">
            <div className="flex items-baseline gap-2">
              <p className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white">₹{totalPrice}</p>
              <span className="text-[10px] sm:text-[11px] font-semibold" style={{ color: "var(--primary-color)" }}>
                {quantity} item{quantity > 1 ? "s" : ""}
              </span>
            </div>

            <div className="flex items-center bg-slate-100 dark:bg-white/10 rounded-full p-1 sm:hidden">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={!isAvailable}
                className="h-7 w-7 rounded-full bg-white dark:bg-[#232627] flex items-center justify-center text-slate-700 dark:text-slate-300 shadow-xs cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Minus size={12} />
              </button>
              <span className="w-7 text-center text-xs font-semibold">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                disabled={!isAvailable}
                className="h-7 w-7 rounded-full text-white flex items-center justify-center shadow-xs cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: "var(--primary-color)" }}
              >
                <Plus size={12} />
              </button>
            </div>
          </div>

          <p className="text-[9px] text-slate-400 dark:text-slate-500 font-medium uppercase -mt-1 sm:hidden">Incl. all taxes</p>
          <p className="hidden sm:block text-[10px] text-slate-400 dark:text-slate-500 font-medium uppercase -mt-3">Incl. all taxes</p>

          <div className="flex items-center gap-2.5">
            <div className="hidden sm:flex items-center bg-slate-100 dark:bg-white/10 rounded-full p-1">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={!isAvailable}
                className="h-8 w-8 rounded-full bg-white dark:bg-[#232627] flex items-center justify-center text-slate-700 dark:text-slate-300 shadow-xs cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Minus size={14} />
              </button>
              <span className="w-8 text-center text-sm font-semibold">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                disabled={!isAvailable}
                className="h-8 w-8 rounded-full text-white flex items-center justify-center shadow-xs cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: "var(--primary-color)" }}
              >
                <Plus size={14} />
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={quantity <= 0 || isAdding || !isAvailable}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 rounded-full px-6 sm:px-8 py-3 text-xs sm:text-sm font-semibold text-white transition cursor-pointer active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: !isAvailable ? "#94a3b8" : "var(--primary-color)" }}
            >
              <ShoppingBag size={16} />
              {!isAvailable ? "Sold Out" : isAdding ? "Adding..." : "Add to Cart"}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
