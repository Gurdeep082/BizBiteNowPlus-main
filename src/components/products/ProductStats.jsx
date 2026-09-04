import {
  Package,
  CheckCircle2,
  AlertTriangle,
  Grid2X2,
} from "lucide-react";

const cards = [
  {
    key: "totalProducts",
    title: "Total Products",
    icon: Package,
    color: "bg-blue-100 text-blue-600",
  },
  {
    key: "activeProducts",
    title: "Active Products",
    icon: CheckCircle2,
    color: "bg-emerald-100 text-emerald-600",
  },
  {
    key: "outOfStock",
    title: "Out of Stock",
    icon: AlertTriangle,
    color: "bg-red-100 text-red-600",
  },
  {
    key: "categories",
    title: "Categories",
    icon: Grid2X2,
    color: "bg-purple-100 text-purple-600",
  },
];

export default function ProductStats({ stats }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.key}
            className="
              rounded-2xl
              border
              border-slate-200
              bg-white
              p-6
              shadow-sm
              transition-all
              duration-300
              hover:-translate-y-1
              hover:shadow-lg
            "
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  {card.title}
                </p>

                <h2 className="mt-3 text-3xl font-bold text-slate-900">
                  {stats[card.key]}
                </h2>
              </div>

              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl ${card.color}`}
              >
                <Icon size={22} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}