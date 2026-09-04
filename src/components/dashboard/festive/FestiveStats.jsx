import { CalendarRange, CheckCircle2, Clock3, FileText, Archive } from "lucide-react";
import Card from "../../../components/UI/Card";
import Typography from "../../../components/UI/Typography";

const FestiveStats = ({ stats }) => {
  const cards = [
    { title: "Total Menus", value: stats.totalMenus, icon: CalendarRange, color: "bg-blue-50 text-blue-600 border-blue-100" },
    { title: "Active", value: stats.active, icon: CheckCircle2, color: "bg-emerald-50 text-emerald-600 border-emerald-100" },
    { title: "Scheduled", value: stats.scheduled, icon: Clock3, color: "bg-amber-50 text-amber-600 border-amber-100" },
    { title: "Draft", value: stats.draft, icon: FileText, color: "bg-slate-100 text-slate-600 border-slate-200" },
    { title: "History", value: stats.expired, icon: Archive, color: "bg-rose-50 text-rose-600 border-rose-100" },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 xl:grid-cols-5">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card
            key={card.title}
            padding="p-5"
            hover={true}
            className="group"
          >
            <div className="flex items-start justify-between">
              <div>
                <Typography variant="small" weight="bold" color="text-slate-400" className="uppercase tracking-wide text-[10px]">
                  {card.title}
                </Typography>
                <Typography variant="h3" className="mt-2 tracking-tight">
                  {card.value}
                </Typography>
              </div>
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border ${card.color}`}>
                <Icon size={20} />
              </div>
            </div>
            <div className="mt-5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all duration-700 ease-out group-hover:bg-emerald-600"
                style={{ width: `${Math.min(card.value * 20, 100)}%` }}
              />
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default FestiveStats;