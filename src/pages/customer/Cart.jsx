import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShoppingBag,
  ShieldCheck,
  Clock,
  Award,
  Loader2,
  FileText,
  Check
} from "lucide-react";
import useCartStore from "../../api/stores/customerstore/cartStore";
import useGuestCartStore from "../../api/stores/customerstore/guestCartStore";
import { getStore } from "../../api/customerApi";
import { toast } from "react-toastify";

const Cart = () => {
  const navigate = useNavigate();

  const authCart = useCartStore();
  const guestCart = useGuestCartStore();

  const hasGuestItems = guestCart.items.length > 0;
  const items = [
    ...authCart.items.map((item) => ({ ...item, __origin: "auth" })),
    ...guestCart.items.map((item) => ({ ...item, __origin: "guest" })),
  ];
  const loading = authCart.loading;
  const getItemId = (item) =>
    item.__origin === "guest" ? item.product_id : (item._id || item.id);

  const updateQuantity = (item, qty) => {
    const id = getItemId(item);
    if (item.__origin === "guest") {
      guestCart.updateQuantity(id, qty);
    } else {
      authCart.updateQuantity(id, qty);
    }
  };

  const removeItem = async (item) => {
    const id = getItemId(item);
    try {
      if (item.__origin === "guest") {
        await guestCart.removeItem(id);
      } else {
        await authCart.removeItem(id);
      }
      toast.success("Removed from cart");
    } catch (error) {
      console.error("Remove item failed:", error);
      toast.error("Unable to remove item. Please try again.");
    }
  };

  const [instructions, setInstructions] = useState({});
  const [savingId, setSavingId] = useState(null);
  const [savedId, setSavedId] = useState(null);
  const [additionalCharges, setAdditionalCharges] = useState([]);

  useEffect(() => {
    if (authCart.fetchCart) {
      authCart.fetchCart().catch(() => { });
    }
  }, []);

  // 🆕 Dynamically fetch seller-defined additional charges from store settings
  useEffect(() => {
    const fetchAdditionalCharges = async () => {
      try {
        const res = await getStore(); // uses getSellerId() internally
        const charges = res?.data?.data?.delivery_settings?.additional_charges;
        const normalized = Array.isArray(charges)
          ? charges
            .filter((c) => c && c.label && Number(c.value) > 0)
            .map((c) => ({ label: c.label, value: Number(c.value) }))
          : [];
        setAdditionalCharges(normalized);
      } catch (err) {
        console.error("Failed to fetch additional charges:", err);
      }
    };

    fetchAdditionalCharges();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setInstructions((prev) => {
      const next = { ...prev };
      let changed = false;
      items.forEach((item) => {
        if (item.__origin === "guest") return;
        const itemId = getItemId(item);
        if (next[itemId] === undefined) {
          next[itemId] = item.special_instructions || "";
          changed = true;
        }
      });
      return changed ? next : prev;
    });
  }, [authCart.items]);

  const handleInstructionChange = (item, text) => {
    const itemId = getItemId(item);
    if (item.__origin === "guest") {
      guestCart.setInstruction(itemId, text);
    } else {
      setInstructions((prev) => ({ ...prev, [itemId]: text }));
    }
  };

  const handleSaveInstruction = async (item) => {
    if (item.__origin === "guest") return;
    const itemId = getItemId(item);
    const text = instructions[itemId] || "";
    try {
      setSavingId(itemId);
      setSavedId(null);
      await authCart.setInstruction(itemId, text);
      setSavedId(itemId);
      setTimeout(() => setSavedId((prev) => (prev === itemId ? null : prev)), 1500);
    } catch (err) {
      console.error("Save instruction failed:", err);
    } finally {
      setSavingId(null);
    }
  };

  const getAddonsTotal = (item) => {
    if (!Array.isArray(item.addons)) return 0;
    return item.addons.reduce((sum, a) => sum + (Number(a.price) || 0), 0);
  };

  // Effective unit price: variant price REPLACES base price (not additive).
  // Offer price (base or variant) is already baked into `item.price`.
  const getUnitPrice = (item) => {
    const addonsTotal = getAddonsTotal(item);
    const base = Number(item.price || 0); // already variant-replaced + offer-applied
    return base + addonsTotal;
  };

  const getLineTotal = (item) => {
    if (item.line_total !== undefined && item.line_total !== null) {
      return Number(item.line_total);
    }
    return getUnitPrice(item) * (item.quantity || 1);
  };

  const getBaseLineTotal = (item) => {
    if (item.variant) return 0;
    const original = Number(item.original_price ?? item.price ?? 0);
    return original * (item.quantity || 1);
  };

  const getVariantLineTotal = (item) => {
    if (!item.variant) return 0;
    const original = Number(item.original_price ?? item.price ?? 0);
    return original * (item.quantity || 1);
  };

  const getAddonsLineTotal = (item) => {
    return getAddonsTotal(item) * (item.quantity || 1);
  };

  // Discount shown = difference between original price and offer/effective price
  const getItemDiscount = (item) => {
    const original = Number(item.original_price ?? item.price ?? 0);
    const effective = Number(item.price || 0);
    const perUnitDiscount = Math.max(0, original - effective);
    return perUnitDiscount * (item.quantity || 1);
  };

  const getTaxPercent = (item) => {
    return Number(item.product_id?.tax_percent ?? item.tax_percent ?? 0);
  };

  const getTaxLineAmount = (item) => {
    const taxPercent = getTaxPercent(item);
    if (!taxPercent) return 0;
    return Number(((getLineTotal(item) * taxPercent) / 100).toFixed(2));
  };

  const subtotal = items.reduce((total, item) => total + getLineTotal(item), 0);
  const baseItemsTotal = items.reduce((total, item) => total + getBaseLineTotal(item), 0);
  const variantChargesTotal = items.reduce((total, item) => total + getVariantLineTotal(item), 0);
  const addonsChargesTotal = items.reduce((total, item) => total + getAddonsLineTotal(item), 0);
  const totalDiscount = items.reduce((total, item) => total + getItemDiscount(item), 0);
  const taxTotal = Number(items.reduce((total, item) => total + getTaxLineAmount(item), 0).toFixed(2));
  const additionalChargesTotal = additionalCharges.reduce((total, c) => total + c.value, 0);
  const grandTotal = Number((subtotal + taxTotal + additionalChargesTotal).toFixed(2));

  if (loading && (!items || items.length === 0)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 font-sans">
        <Loader2 size={36} className="text-[#16522D] animate-spin mb-3" />
        <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">Loading your cart...</p>
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 font-sans">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mb-3 shadow-2xs"
          style={{
            backgroundColor:
              "color-mix(in srgb, var(--primary-color) 10%, transparent)",
            color: "var(--primary-color)",
          }}
        >
          <ShoppingBag size={30} strokeWidth={1.8} />
        </div>

        <h2
          className="text-lg font-semibold mb-1"
          style={{ color: "var(--primary-color)" }}
        >
          Your cart is empty
        </h2>

        <p
          className="text-xs sm:text-sm mb-5 font-medium"
          style={{ color: "var(--secondary-color)" }}
        >
          Good food is always just a click away.
        </p>

        <button
          onClick={() =>
            navigate(
              guestCart.table_token
                ? `/customer/menu/${guestCart.table_token}`
                : "/customer"
            )
          }
          className="text-xs sm:text-sm font-semibold px-6 py-2.5 rounded-xl transition shadow-xs cursor-pointer active:scale-95"
          style={{
            backgroundColor: "var(--primary-color)",
            color: "var(--accent-color)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor =
              "color-mix(in srgb, var(--primary-color) 85%, black)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor =
              "var(--primary-color)";
          }}
        >
          Explore Menu
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1780px] mx-auto px-3 sm:px-6 lg:px-8 py-4 pb-32 sm:pb-36 select-none font-sans text-slate-800">

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 items-start">

        <div className="lg:col-span-7 space-y-3.5">

          <div className="space-y-2.5">
            {items.map((item) => {
              const itemId = getItemId(item);
              const isGuestItem = item.__origin === "guest";
              const variantName = item.variant?.name || null;

              const itemQuantity = item.quantity || 1;
              const itemTotal = getLineTotal(item);
              const itemTaxPercent = getTaxPercent(item);
              const itemTaxAmount = getTaxLineAmount(item);
              const itemHasOffer =
                Number(item.original_price ?? item.price ?? 0) > Number(item.price || 0);

              const instructionValue = isGuestItem
                ? (item.instruction || "")
                : (instructions[itemId] !== undefined ? instructions[itemId] : (item.special_instructions || ""));

              const savedInstructionValue = item.special_instructions || item.instruction || "";
              const isDirty = !isGuestItem && instructionValue !== savedInstructionValue;
              const isSavingThis = savingId === itemId;
              const isSavedThis = savedId === itemId;

              return (
                <div
                  key={`${item.__origin}-${itemId}${variantName ? `-${variantName}` : ""}`}
                  className="bg-white dark:bg-[#181A1B] rounded-2xl border border-slate-200/90 dark:border-white/10 p-3 sm:p-4 shadow-2xs transition hover:border-slate-300 dark:hover:border-white/20 flex flex-col gap-2.5"
                >
                  <div className="flex items-center justify-between gap-2.5">

                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <img
                        src={item.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=150"}
                        alt={item.name}
                        className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl object-cover border border-slate-100 dark:border-white/10 shrink-0 bg-slate-50 dark:bg-white/5"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h3 className="font-semibold text-slate-900 dark:text-white text-xs sm:text-base truncate leading-snug">{item.name}</h3>
                          {variantName && (
                            <span className="shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-50 text-[#16522D] border border-emerald-100">
                              {variantName}
                            </span>
                          )}
                          {isGuestItem && (
                            <span className="shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200">
                              Guest Order
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] sm:text-xs text-slate-400 dark:text-slate-500 font-medium truncate mt-0.5">{item.description}</p>
                        <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                          <p className="font-bold text-xs sm:text-sm" style={{ color: "var(--primary-color)" }}>₹{itemTotal}</p>
                          {itemHasOffer && (
                            <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 line-through">
                              ₹{Number(item.original_price) * itemQuantity}
                            </span>
                          )}
                          {itemTaxPercent > 0 && (
                            <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500">
                              +₹{itemTaxAmount} tax ({itemTaxPercent}%)
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
                      <div className="flex items-center border border-slate-200 dark:border-white/10 rounded-xl bg-slate-50 dark:bg-white/5 overflow-hidden shadow-2xs">
                        <button
                          onClick={() => updateQuantity(item, itemQuantity - 1)}
                          className="p-1.5 sm:p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10 transition cursor-pointer active:scale-90"
                        >
                          <Minus size={12} strokeWidth={2.5} />
                        </button>
                        <span className="w-5 sm:w-6 text-center text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100">{itemQuantity}</span>
                        <button
                          onClick={() => updateQuantity(item, itemQuantity + 1)}
                          className="p-1.5 sm:p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10 transition cursor-pointer active:scale-90"
                        >
                          <Plus size={12} strokeWidth={2.5} />
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item)}
                        className="p-1.5 sm:p-2 text-slate-400 dark:text-slate-500 hover:text-rose-500 transition cursor-pointer rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/20 active:scale-90"
                        title="Remove item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1.5">
                    <FileText size={13} className="text-slate-400 dark:text-slate-500 shrink-0" />
                    <input
                      type="text"
                      maxLength={120}
                      placeholder="Add special cooking instructions (e.g. Extra cheese, less spicy)..."
                      value={instructionValue}
                      onChange={(e) => handleInstructionChange(item, e.target.value)}
                      className="w-full bg-transparent py-0.5 text-[11px] sm:text-xs text-slate-700 dark:text-slate-200 outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500 font-medium"
                    />
                    {!isGuestItem && (
                      <button
                        onClick={() => handleSaveInstruction(item)}
                        disabled={!isDirty || isSavingThis}
                        className="shrink-0 flex items-center gap-1 text-[10px] sm:text-[11px] font-bold px-2 py-1 rounded-lg transition cursor-pointer active:scale-95 disabled:cursor-not-allowed"
                        style={
                          isDirty
                            ? { backgroundColor: "var(--primary-color)", color: "var(--accent-color)" }
                            : { backgroundColor: "#f1f5f9", color: "#94a3b8" }
                        }
                      >
                        {isSavingThis ? (
                          <Loader2 size={12} className="animate-spin" />
                        ) : isSavedThis ? (
                          <Check size={12} />
                        ) : null}
                        {isSavingThis ? "Saving..." : isSavedThis ? "Saved" : "Save"}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-slate-50/80 dark:bg-white/5 p-3 rounded-2xl border border-slate-200/60 dark:border-white/10 grid grid-cols-3 gap-2 text-center">
            <div className="flex flex-col items-center justify-center gap-1">
              <div className="p-1.5 rounded-xl bg-white dark:bg-white/10 text-[#16522D] shadow-2xs">
                <ShieldCheck size={16} />
              </div>
              <p className="text-[11px] font-semibold text-slate-800 dark:text-slate-200 leading-tight">100% Safe</p>
            </div>

            <div className="flex flex-col items-center justify-center gap-1 border-x border-slate-200/60 dark:border-white/10 px-1">
              <div className="p-1.5 rounded-xl bg-white dark:bg-white/10 text-indigo-600 shadow-2xs">
                <Clock size={16} />
              </div>
              <p className="text-[11px] font-semibold text-slate-800 dark:text-slate-200 leading-tight">On-Time</p>
            </div>

            <div className="flex flex-col items-center justify-center gap-1">
              <div className="p-1.5 rounded-xl bg-white dark:bg-white/10 text-amber-600 shadow-2xs">
                <Award size={16} />
              </div>
              <p className="text-[11px] font-semibold text-slate-800 dark:text-slate-200 leading-tight">Top Quality</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 sticky top-6 space-y-4">

          <div className="bg-white dark:bg-[#181A1B] rounded-2xl border border-slate-200/90 dark:border-white/10 p-4 sm:p-5 shadow-sm space-y-3.5">
            <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white pb-2.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span>Bill Summary</span>
              <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500">Taxes & Charges</span>
            </h2>

            {hasGuestItems && (
              <div className="text-[11px] font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-2.5 py-1.5">
                Your cart includes items from a guest table order.
              </div>
            )}

            <div className="space-y-2 text-xs sm:text-sm">
              {baseItemsTotal > 0 && (
                <div className="flex justify-between text-slate-600 dark:text-slate-400 font-medium">
                  <span>Item Total</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">₹{baseItemsTotal}</span>
                </div>
              )}

              {variantChargesTotal > 0 && (
                <div className="flex justify-between text-slate-600 dark:text-slate-400 font-medium">
                  <span>Specific Variant Price</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">₹{variantChargesTotal}</span>
                </div>
              )}

              {addonsChargesTotal > 0 && (
                <div className="flex justify-between text-slate-600 dark:text-slate-400 font-medium">
                  <span>Add-ons Charges</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">+ ₹{addonsChargesTotal}</span>
                </div>
              )}

              {totalDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Offer Discount</span>
                  <span className="font-semibold">- ₹{totalDiscount}</span>
                </div>
              )}

              {taxTotal > 0 && (
                <div className="flex justify-between text-slate-600 dark:text-slate-400 font-medium">
                  <span>Taxes</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">+ ₹{taxTotal}</span>
                </div>
              )}

              {additionalCharges.length > 0 ? (
                additionalCharges.map((charge, index) => (
                  <div key={index} className="flex justify-between text-slate-600 dark:text-slate-400 font-medium">
                    <span>{charge.label}</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">+ ₹{charge.value}</span>
                  </div>
                ))
              ) : (
                <div className="flex justify-between text-slate-600 dark:text-slate-400 font-medium">
                  <span>Additional Charges</span>
                  <span className="font-semibold" style={{ color: "var(--secondary-color)" }}>FREE</span>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-dashed border-slate-200 dark:border-slate-700 flex items-center justify-between text-sm sm:text-base font-bold text-slate-900 dark:text-white">
              <span>Grand Total</span>
              <span className="text-[#16522D] font-bold text-base sm:text-lg">₹{grandTotal}</span>
            </div>

            <div className="pt-2">
              <button
                onClick={() => navigate("/customer/checkout")}
                className="w-full flex items-center justify-between font-semibold px-5 py-3.5 rounded-xl transition shadow-sm cursor-pointer text-sm sm:text-base active:scale-[0.99]" style={{ color: "var(--accent-color)", backgroundColor: "var(--primary-color)" }}
              >
                <span>Proceed to Checkout</span>
                <div className="flex items-center gap-1.5 font-bold">
                  <span>₹{grandTotal}</span>
                  <ArrowRight size={16} strokeWidth={2.5} />
                </div>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-center gap-1.5 text-[11px] sm:text-xs text-slate-400 dark:text-slate-500 font-medium text-center">
            <ShieldCheck size={14} className="text-emerald-600 shrink-0" />
            <span>100% Safe & Secure Payments via Razorpay / UPI</span>
          </div>
        </div>

      </div>

    </div>
  );
};

export default Cart;
