import { useState, useMemo, useEffect, useRef } from "react";
import { Heart, Plus, Minus, ChevronDown, Check } from "lucide-react";
import { BiFoodTag } from "react-icons/bi";

const SizeDropdown = ({ variants, selectedIdx, onSelect, compact = false }) => {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!ref.current?.contains(e.target)) setOpen(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const selected = variants[selectedIdx] || variants[0];
    const selectedHasOffer =
        selected?.offer_price !== null &&
        selected?.offer_price !== undefined &&
        Number(selected.offer_price) < Number(selected?.price_delta || 0);
    const selectedPrice = selectedHasOffer
        ? Number(selected.offer_price)
        : Number(selected?.price_delta || 0);

    return (
        <div
            ref={ref}
            className={`relative ${compact ? "mt-1" : "mt-2 w-full"}`}
            onClick={(e) => e.stopPropagation()}
        >
            <button
                type="button"
                onClick={() => setOpen((prev) => !prev)}
                className={`flex w-full items-center justify-between gap-1 border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 font-semibold text-slate-700 dark:text-slate-300 outline-none transition hover:border-slate-300 dark:hover:border-white/20 ${compact ? "rounded-md pl-2 pr-1.5 py-1 text-[10px]" : "rounded-lg pl-2.5 pr-2 py-1.5 text-xs"}`}
            >
                <span className="truncate">
                    {selected?.name} · ₹{selectedPrice}
                </span>
                <ChevronDown
                    size={compact ? 11 : 14}
                    className={`shrink-0 text-slate-400 dark:text-slate-500 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                />
            </button>

            {open && (
                <div
                    className={`absolute left-0 right-0 z-30 mt-1 overflow-hidden rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-[#181A1B] shadow-lg ${compact ? "text-[10px]" : "text-xs"}`}
                >
                    {variants.map((v, idx) => {
                        const active = idx === selectedIdx;
                        const vHasOffer =
                            v.offer_price !== null &&
                            v.offer_price !== undefined &&
                            Number(v.offer_price) < Number(v.price_delta || 0);

                        return (
                            <button
                                key={idx}
                                type="button"
                                onClick={() => {
                                    onSelect(idx);
                                    setOpen(false);
                                }}
                                className={`flex w-full items-center justify-between gap-2 px-2.5 py-1.5 text-left font-semibold text-slate-700 dark:text-slate-300 transition ${active ? "" : "hover:bg-slate-50 dark:hover:bg-white/5"}`}
                                style={
                                    active
                                        ? { backgroundColor: "color-mix(in srgb, var(--primary-color) 8%, transparent)", color: "var(--primary-color)" }
                                        : undefined
                                }
                            >
                                <span className="truncate">{v.name}</span>
                                <span className="flex items-center gap-1 shrink-0">
                                    {vHasOffer && (
                                        <span className="font-normal text-slate-400 dark:text-slate-500 line-through">
                                            ₹{Number(v.price_delta || 0)}
                                        </span>
                                    )}
                                    <span>₹{vHasOffer ? Number(v.offer_price) : Number(v.price_delta || 0)}</span>
                                    {active && <Check size={compact ? 11 : 13} style={{ color: "var(--primary-color)" }} />}
                                </span>
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

const ReusableProductCard = ({
    product,
    qty = 0,
    isFav = false,
    isStoreOpen = true,
    badge = "",
    onCardClick,
    onToggleFavourite,
    onAdd,
    onIncrease,
    onDecrease,
}) => {
    if (!product) return null;

    const {
        name = "Delicious Item",
        image = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400",
        price = 0,
        offer_price = null,
        variants = [],
    } = product;

    const isVeg = product.is_veg !== false && product.isVeg !== false;
    const isAvailable = product.is_available !== false && product.available !== false;
    const hasVariants = Array.isArray(variants) && variants.length > 0;

    // 🟢 FIXED: Default to 0 (first variant) if variants exist, instead of -1
    const [selectedVariantIdx, setSelectedVariantIdx] = useState(hasVariants ? 0 : -1);

    // Sync state if product data changes dynamically
    useEffect(() => {
        if (hasVariants) {
            setSelectedVariantIdx(0);
        } else {
            setSelectedVariantIdx(-1);
        }
    }, [variants, hasVariants]);

    const selectedVariant =
        selectedVariantIdx >= 0 && hasVariants ? variants[selectedVariantIdx] : null;

    const activeBasePrice = selectedVariant ? Number(selectedVariant.price_delta || 0) : Number(price || 0);
    const activeOfferPrice = selectedVariant ? selectedVariant.offer_price : offer_price;

    const hasActiveOffer =
        activeOfferPrice !== null &&
        activeOfferPrice !== undefined &&
        Number(activeOfferPrice) < activeBasePrice;

    const displayPrice = useMemo(() => {
        if (hasActiveOffer) {
            return Number(activeOfferPrice);
        }
        return activeBasePrice;
    }, [activeBasePrice, hasActiveOffer, activeOfferPrice]);

    const strikethroughPrice = hasActiveOffer ? activeBasePrice : null;

    const buildCartProduct = () => ({
        ...product,
        selectedVariant: selectedVariant
            ? {
                name: selectedVariant.name,
                price_delta: Number(selectedVariant.price_delta) || 0,
                offer_price:
                    selectedVariant.offer_price !== null && selectedVariant.offer_price !== undefined
                        ? Number(selectedVariant.offer_price)
                        : null,
            }
            : null,
        finalPrice: displayPrice,
    });

    return (
        <div
            onClick={() => onCardClick?.(product)}
            className="group rounded-[18px] sm:rounded-[20px] border border-slate-200/90 dark:border-white/10 bg-white dark:bg-[#181A1B] p-2 sm:p-3.5 flex flex-col justify-between hover:shadow-md transition-all duration-300 cursor-pointer relative w-full select-none shadow-xs min-w-0"
        >
            {/* Mobile view */}
            <div className="flex sm:hidden flex-col justify-between w-full h-full">
                <div className="flex items-start gap-2">
                    <div className="relative h-16 w-16 shrink-0 rounded-xl overflow-hidden bg-slate-100 dark:bg-white/10">
                        <img
                            src={image}
                            alt={name}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                                e.currentTarget.src =
                                    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400";
                            }}
                        />
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onToggleFavourite?.(product);
                            }}
                            className="absolute top-1 right-1 z-10 h-5 w-5 rounded-full bg-white/90 dark:bg-[#181A1B]/90 backdrop-blur-xs flex items-center justify-center text-slate-600 dark:text-slate-300 shadow-2xs transition active:scale-90"
                        >
                            <Heart
                                size={11}
                                fill={isFav ? "#e11d48" : "none"}
                                color={isFav ? "#e11d48" : "#475569"}
                            />
                        </button>

                        {(badge || hasActiveOffer) && (
                            <span className="absolute bottom-0.5 left-0.5 z-10 bg-orange-500 text-white px-1 py-0.5 rounded text-[7px] font-black uppercase tracking-wider shadow-2xs">
                                {badge || "OFFER"}
                            </span>
                        )}
                    </div>

                    <div className="flex-1 min-w-0 pt-0.5">
                        <h4 className="line-clamp-2 text-xs font-bold text-slate-900 dark:text-white leading-tight">
                            {name}
                        </h4>

                        <div className="flex items-center gap-1 mt-1">
                            {isVeg ? (
                                <div className="flex items-center gap-1 text-[#16522D]">
                                    <BiFoodTag size={13} className="fill-[#16522D]" />
                                    <span className="text-[10px] font-semibold">Veg</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-1 text-rose-700">
                                    <BiFoodTag size={13} className="fill-rose-700" />
                                    <span className="text-[10px] font-semibold">Non Veg</span>
                                </div>
                            )}
                        </div>

                        {/* Size dropdown */}
                        {hasVariants && (
                            <SizeDropdown
                                variants={variants}
                                selectedIdx={selectedVariantIdx}
                                onSelect={setSelectedVariantIdx}
                                compact
                            />
                        )}
                    </div>
                </div>

                <div
                    className="mt-2 flex items-center justify-between pt-1.5 border-t"
                    style={{ borderColor: "var(--secondary-color)" }}
                >
                    <div className="flex items-baseline gap-1.5">
                        {strikethroughPrice !== null && (
                            <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 line-through">
                                ₹{strikethroughPrice}
                            </span>
                        )}
                        <span
                            className="text-xs sm:text-sm font-black"
                            style={{ color: "var(--primary-color)" }}
                        >
                            ₹{displayPrice}
                        </span>
                    </div>

                    {!isAvailable ? (
                        <span className="text-[10px] font-bold text-rose-500 bg-rose-50 px-2 py-0.5 rounded-md whitespace-nowrap">
                            Sold Out
                        </span>
                    ) : qty === 0 ? (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onAdd?.(buildCartProduct());
                            }}
                            disabled={!isStoreOpen}
                            className="rounded-full px-3 py-1 text-xs font-bold transition-all shadow-2xs whitespace-nowrap active:scale-95"
                            style={{
                                backgroundColor: isStoreOpen
                                    ? "var(--primary-color)"
                                    : "var(--secondary-color)",
                                color: isStoreOpen
                                    ? "var(--accent-color)"
                                    : "var(--primary-color)",
                                cursor: isStoreOpen ? "pointer" : "not-allowed",
                            }}
                            onMouseEnter={(e) => {
                                if (isStoreOpen) {
                                    e.currentTarget.style.backgroundColor =
                                        "color-mix(in srgb, var(--primary-color) 85%, black)";
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (isStoreOpen) {
                                    e.currentTarget.style.backgroundColor = "var(--primary-color)";
                                }
                            }}
                        >
                            {isStoreOpen ? "+ Add" : "Closed"}
                        </button>
                    ) : (
                        <div
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center rounded-full p-0.5 shadow-sm shrink-0"
                            style={{
                                backgroundColor: "var(--primary-color)",
                                color: "var(--accent-color)",
                            }}
                        >
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDecrease?.(buildCartProduct());
                                }}
                                className="flex h-5 w-5 items-center justify-center rounded-full hover:bg-black/15 transition active:scale-90"
                            >
                                <Minus size={10} strokeWidth={2.5} />
                            </button>
                            <span className="w-4 text-center text-xs font-extrabold select-none">
                                {qty}
                            </span>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onIncrease?.(buildCartProduct());
                                }}
                                className="flex h-5 w-5 items-center justify-center rounded-full hover:bg-black/15 transition active:scale-90"
                            >
                                <Plus size={10} strokeWidth={2.5} />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Desktop view */}
            <div className="hidden sm:flex flex-col justify-between h-full">
                {(badge || hasActiveOffer) && (
                    <span className="absolute top-3 left-3 z-10 bg-orange-500 text-white px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-wider shadow-xs">
                        {badge || "OFFER"}
                    </span>
                )}

                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavourite?.(product);
                    }}
                    className="absolute top-3 right-3 z-10 h-8 w-8 rounded-full bg-white/85 dark:bg-[#181A1B]/85 backdrop-blur-md flex items-center justify-center text-slate-600 dark:text-slate-300 shadow-sm hover:text-rose-500 transition active:scale-90"
                >
                    <Heart
                        size={16}
                        fill={isFav ? "#e11d48" : "none"}
                        color={isFav ? "#e11d48" : "#475569"}
                    />
                </button>

                <div>
                    <div className="h-36 md:h-40 w-full rounded-2xl overflow-hidden bg-slate-100 dark:bg-white/10 relative">
                        <img
                            src={image}
                            alt={name}
                            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                            onError={(e) => {
                                e.currentTarget.src =
                                    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400";
                            }}
                        />
                        <div className="absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-black/40 to-transparent pointer-events-none" />
                    </div>

                    <div className="flex items-center gap-1.5 mt-3 mb-1">
                        {isVeg ? (
                            <div className="flex items-center gap-1 text-[#16522D] px-2 py-0.5 rounded-md">
                                <BiFoodTag size={18} className="fill-[#16522D]" />
                                <span className="text-xs font-semibold">Veg</span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-1 text-rose-700 px-2 py-0.5 rounded-md">
                                <BiFoodTag size={18} className="fill-rose-700" />
                                <span className="text-xs font-semibold">Non Veg</span>
                            </div>
                        )}
                    </div>

                    <h4 className="line-clamp-1 text-base font-semibold text-slate-900 dark:text-white leading-snug">
                        {name}
                    </h4>

                    {/* Size dropdown */}
                    {hasVariants && (
                        <SizeDropdown
                            variants={variants}
                            selectedIdx={selectedVariantIdx}
                            onSelect={setSelectedVariantIdx}
                        />
                    )}
                </div>

                <div className="mt-4 flex items-center justify-between pt-1 gap-1">
                    <div className="flex flex-col xl:flex-row xl:items-baseline gap-0 xl:gap-1.5 shrink-0">
                        {strikethroughPrice !== null && (
                            <span className="text-xs font-medium text-slate-400 dark:text-slate-500 line-through">
                                ₹{strikethroughPrice}
                            </span>
                        )}
                        <span className="text-sm font-black" style={{ color: "var(--primary-color)" }}>
                            ₹{displayPrice}
                        </span>
                    </div>

                    {!isAvailable ? (
                        <span className="text-xs font-bold text-rose-500 bg-rose-50 px-2.5 py-1 rounded-md whitespace-nowrap">
                            Sold Out
                        </span>
                    ) : qty === 0 ? (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onAdd?.(buildCartProduct());
                            }}
                            disabled={!isStoreOpen}
                            className="rounded-full border-2 px-3 lg:px-2.5 xl:px-4 py-1 text-xs lg:text-[11px] xl:text-sm font-bold transition-all duration-200 shadow-2xs whitespace-nowrap shrink-0 active:scale-95 cursor-pointer"
                            style={{
                                borderColor: isStoreOpen
                                    ? "var(--primary-color)"
                                    : "var(--secondary-color)",
                                backgroundColor: isStoreOpen
                                    ? "transparent"
                                    : "var(--secondary-color)",
                                color: isStoreOpen
                                    ? "var(--primary-color)"
                                    : "var(--accent-color)",
                            }}
                            onMouseEnter={(e) => {
                                if (isStoreOpen) {
                                    e.currentTarget.style.backgroundColor = "var(--primary-color)";
                                    e.currentTarget.style.color = "var(--accent-color)";
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (isStoreOpen) {
                                    e.currentTarget.style.backgroundColor = "transparent";
                                    e.currentTarget.style.color = "var(--primary-color)";
                                }
                            }}
                        >
                            {isStoreOpen ? "Order Now" : "Closed"}
                        </button>
                    ) : (
                        <div
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center rounded-full p-0.5 shadow-sm shrink-0"
                            style={{
                                backgroundColor: "var(--primary-color)",
                                color: "var(--accent-color)",
                            }}
                        >
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDecrease?.(buildCartProduct());
                                }}
                                className="flex h-5 w-5 items-center justify-center rounded-full transition active:scale-90"
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.15)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = "transparent";
                                }}
                            >
                                <Minus size={10} strokeWidth={2.5} />
                            </button>
                            <span className="w-4 text-center text-xs font-extrabold select-none">
                                {qty}
                            </span>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onIncrease?.(buildCartProduct());
                                }}
                                className="flex h-5 w-5 items-center justify-center rounded-full transition active:scale-90"
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.15)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = "transparent";
                                }}
                            >
                                <Plus size={10} strokeWidth={2.5} />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReusableProductCard;