import { ShoppingBag, Wallet, CreditCard, TrendingUp } from "lucide-react";
import Card from "../../../components/UI/Card";
import Typography from "../../../components/UI/Typography";

const formatCardValue = (val, isCount = false) => {
  if (val === undefined || val === null) return isCount ? "0" : "₹0";
  if (isCount) return String(val);

  const strVal = String(val).trim();
  if (strVal.startsWith("₹")) return strVal;

  const num = Number(strVal.replace(/[^0-9.-]+/g, ""));
  if (isNaN(num)) return "₹0";

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(num);
};

export default function EarningsSummaryCards({ summary = {} }) {
  const cards = [
    {
      title: "Today's Orders",
      value: formatCardValue(summary.todayOrders, true),
      subtitle: "Completed orders",
      icon: ShoppingBag,
      iconBg: "bg-sky-100",
      iconColor: "text-sky-700",
    },
    {
      title: "Average Order",
      value: formatCardValue(summary.averageOrderValue),
      subtitle: "Average order value",
      icon: Wallet,
      iconBg: "bg-violet-100",
      iconColor: "text-violet-700",
    },
    {
      title: "COD Collection",
      value: formatCardValue(summary.codPending),
      subtitle: "Pending COD collection",
      icon: CreditCard,
      iconBg: "bg-amber-100",
      iconColor: "text-amber-700",
    },
    {
      title: "Online Received",
      value: formatCardValue(summary.onlineReceived),
      subtitle: "Successfully received",
      icon: TrendingUp,
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-700",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <Card key={idx} padding="p-5" hover={true} className="flex flex-col justify-between">
            <div className="flex items-start justify-between gap-2">
              <Typography variant="small" weight="bold" color="text-slate-500" className="text-xs uppercase tracking-wide">
                {card.title}
              </Typography>
              <div className={`rounded-xl p-2.5 ${card.iconBg}`}>
                <Icon size={18} className={card.iconColor} />
              </div>
            </div>
            <Typography variant="h3" className="mt-2 text-2xl tracking-tight">{card.value}</Typography>
            <Typography variant="small" className="mt-3 text-[11px] text-slate-400 font-medium">{card.subtitle}</Typography>
          </Card>
        );
      })}
    </div>
  );
}