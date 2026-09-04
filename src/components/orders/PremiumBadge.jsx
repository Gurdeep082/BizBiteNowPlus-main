import { Crown, Lock } from "lucide-react";

export default function PremiumBadge({
  enabled = false,
  children,
  title = "BizBiteNow+ Feature",
  description = "Upgrade to Plus to unlock this feature.",
}) {
  if (enabled) return children;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 via-yellow-50 to-white">

      <div className="absolute right-4 top-4">
        <div className="flex items-center gap-2 rounded-full bg-amber-500 px-3 py-1 text-xs font-semibold text-white shadow">
          <Crown size={14} />
          Plus Only
        </div>
      </div>

      <div className="flex flex-col items-center justify-center px-8 py-12 text-center">

        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
          <Lock
            size={28}
            className="text-amber-600"
          />
        </div>

        <h3 className="text-lg font-bold text-slate-800">
          {title}
        </h3>

        <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
          {description}
        </p>

        <button className="mt-6 rounded-xl bg-[#16522d] px-6 py-3 text-sm font-semibold text-white transition hover:scale-[1.02] hover:bg-[#124426]">
          Upgrade to BizBiteNow+
        </button>

      </div>

    </div>
  );
}