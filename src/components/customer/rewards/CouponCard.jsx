import { motion } from "framer-motion";
import {
  TicketPercent,
  Truck,
  BadgePercent,
  Copy,
  CheckCircle2,
  Clock3,
} from "lucide-react";

const ICONS = {
  percentage: BadgePercent,
  flat: TicketPercent,
  delivery: Truck,
};

const CouponCard = ({
  coupon,
  copied = false,
  used = false,
  onCopy,
  onApply,
}) => {
  if (!coupon) return null;

  const expired = coupon.expired;
  const Icon = ICONS[coupon.discountType] || TicketPercent;

  const discountLabel =
    coupon.discountType === "percentage"
      ? `${coupon.discount}% OFF`
      : coupon.discountType === "flat"
        ? `₹${coupon.discount} OFF`
        : "OFFER";

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={`
        relative 
        w-full 
        flex 
        flex-col 
        bg-white 
        rounded-[14px] 
        border 
        border-slate-200
        overflow-hidden
        ${expired ? "opacity-60 grayscale-[0.3]" : "hover:shadow-md"}
      `}
    >
      {/* 🎟️ TOP SECTION */}
      <div
        className="p-2.5 pb-3 relative"
        style={{ background: "var(--primary-light)" }}
      >
        <div className="flex justify-between items-start gap-1">
          <div className="flex gap-2 w-full pr-1 overflow-hidden">
            <div
              className="h-8 w-8 rounded-[8px] flex items-center justify-center shrink-0 shadow-sm"
              style={{ background: "var(--primary-color)" }}
            >
              <Icon size={14} color="var(--accent-color)" />
            </div>

            <div className="flex flex-col justify-center min-w-0">
              <h3
                className="font-bold text-[13px] leading-none tracking-tight truncate"
                style={{ color: "var(--primary-color)" }}
              >
                {discountLabel}
              </h3>
              <p className="text-[9px] font-semibold text-slate-700 mt-1 leading-tight truncate">
                {coupon.title}
              </p>
            </div>
          </div>

          <span
            className={`text-[8px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider shrink-0 ${expired ? "bg-red-100 text-red-600" : "text-white shadow-sm"
              }`}
            style={!expired ? { backgroundColor: "var(--secondary-color)" } : {}}
          >
            {expired ? "Exp" : "Active"}
          </span>
        </div>
      </div>

      {/* ✂️ PERFORATION LINE & CUTOUTS */}
      <div className="relative h-0 w-full flex items-center z-10">
        <div className="absolute -left-2 w-4 h-4 bg-slate-50 dark:bg-[#181A1B] rounded-full border-r border-slate-200" />
        <div className="w-full border-t border-dashed border-slate-300 mx-2" />
        <div className="absolute -right-2 w-4 h-4 bg-slate-50 dark:bg-[#181A1B] rounded-full border-l border-slate-200" />
      </div>

      {/* 💳 BOTTOM SECTION */}
      <div className="p-2.5 pt-3 space-y-2 bg-white relative">
        <div className="flex justify-between items-center text-[9px] px-0.5">
          <span className="text-slate-500 font-medium">
            Min: <span className="text-slate-800 font-bold">₹{coupon.minOrder}</span>
          </span>
          <span className="font-bold text-emerald-600 bg-emerald-50 px-1 py-0.5 rounded border border-emerald-100 truncate max-w-[60px]">
            Save ₹{coupon.maxDiscount}
          </span>
        </div>

        <div
          className="rounded-lg border border-dashed p-1.5 flex justify-between items-center bg-slate-50/50"
          style={{ borderColor: "var(--primary-color)" }}
        >
          <code
            className="font-bold tracking-wider text-[10px] truncate mr-1"
            style={{ color: "var(--primary-color)" }}
          >
            {coupon.code}
          </code>

          <button
            onClick={() => onCopy?.(coupon.code)}
            className="text-[9px] flex items-center gap-1 font-bold px-1.5 py-1 rounded bg-black/5 shrink-0 transition-colors"
            style={{ color: "var(--primary-color)" }}
          >
            {copied ? (
              <>
                <CheckCircle2 size={10} style={{ color: "var(--secondary-color)" }} />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy size={10} />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>

        <div className="flex justify-between items-center px-0.5 pt-0.5">
          <div className="flex gap-1 items-center text-[8px] font-semibold text-slate-400 truncate pr-1">
            <Clock3 size={9} />
            {coupon.expiry}
          </div>

          {!expired && !used && (
            <button
              onClick={() => onApply?.(coupon)}
              className="rounded-md px-2.5 py-1 text-[9px] font-bold uppercase tracking-wide shadow-sm active:scale-95 shrink-0"
              style={{
                backgroundColor: "var(--primary-color)",
                color: "var(--accent-color)",
              }}
            >
              Apply
            </button>
          )}

          {used && (
            <span
              className="text-[8px] font-bold uppercase tracking-wider px-2 py-1 rounded bg-slate-100 shrink-0"
              style={{ color: "var(--secondary-color)" }}
            >
              Applied
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default CouponCard;