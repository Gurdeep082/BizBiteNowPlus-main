import {
  ShoppingBag,
  Clock3,
  ChefHat,
  CheckCircle2,
  IndianRupee,
} from "lucide-react";

const cards = [
  {
    key: "total",
    title: "Total Orders",
    icon: ShoppingBag,
    color: "bg-blue-100 text-blue-600",
  },
  {
    key: "pending",
    title: "Pending",
    icon: Clock3,
    color: "bg-amber-100 text-amber-600",
  },
  {
    key: "preparing",
    title: "Preparing",
    icon: ChefHat,
    color: "bg-orange-100 text-orange-600",
  },
  {
    key: "delivered",
    title: "Delivered",
    icon: CheckCircle2,
    color: "bg-green-100 text-green-600",
  },
  {
    key: "revenue",
    title: "Today's Revenue",
    icon: IndianRupee,
    color: "bg-emerald-100 text-emerald-600",
  },
];

export default function OrderStats({ stats }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-5">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.key}
            className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#16522d]/20 hover:shadow-lg"
          >
            <div className="flex items-start justify-between">

              <div>

                <p className="text-sm font-medium text-slate-500">
                  {card.title}
                </p>

                <h2 className="mt-3 text-3xl font-bold text-slate-900">
                  {card.key === "revenue"
                    ? `₹${stats[card.key]?.toLocaleString()}`
                    : stats[card.key]}
                </h2>

              </div>

              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl ${card.color}`}
              >
                <Icon size={22} />
              </div>

            </div>

            <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-[#16522d] transition-all duration-500 group-hover:w-full"
                style={{
                  width: `${Math.min(
                    card.key === "revenue"
                      ? stats.revenue / 1000
                      : stats[card.key] * 10,
                    100
                  )}%`,
                }}
              />
            </div>

          </div>
        );
      })}
    </div>
  );
}