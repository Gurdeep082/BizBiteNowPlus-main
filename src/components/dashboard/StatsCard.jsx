import { ArrowUpRight, ArrowDownRight } from "lucide-react";

const StatsCard = ({
  title,
  value,
  icon: Icon,
  trend = 0,
  subtitle = "vs last week",
  iconBg = "bg-[#1A4D2E]/10",
  iconColor = "text-[#1A4D2E]",
}) => {
  const isPositive = trend >= 0;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-all duration-200 hover:shadow-md">
      {/* Background Decoration */}
      <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gray-100/50" />

      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500">{title}</p>

          <h2 className="mt-2 text-2xl font-bold text-slate-900">{value}</h2>

          <div className="mt-3 flex items-center gap-1.5">
            <span
              className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-semibold ${
                isPositive
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {isPositive ? (
                <ArrowUpRight size={13} />
              ) : (
                <ArrowDownRight size={13} />
              )}
              {Math.abs(trend)}%
            </span>

            <span className="text-[11px] text-slate-400">{subtitle}</span>
          </div>
        </div>

        {Icon && (
          <div className={`rounded-xl p-3 ${iconBg}`}>
            <Icon size={22} className={iconColor} />
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsCard;