

export default function OrderCustomer({ order }) {
  // Safe extractions with fallbacks for both frontend & backend object shapes
  const customerName = order?.customer || order?.customer_name || "Guest Customer";
  const customerPhone = order?.phone || order?.customer_phone || "N/A";

  // Safe avatar initial (takes first letter, capitalizes, falls back to "G")
  const avatarInitial = customerName.trim().charAt(0).toUpperCase() || "G";

  return (
    <div className="flex items-center gap-3">
      {/* Customer Avatar */}
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#16522d]/10 font-bold text-[#16522d]">
        {avatarInitial}
      </div>

      {/* Customer Details */}
      <div className="min-w-0 flex-1">
        <h4 className="truncate font-semibold text-slate-900">
          {customerName}
        </h4>
        <p className="truncate text-xs text-slate-500">
          {customerPhone}
        </p>
      </div>
    </div>
  );
}