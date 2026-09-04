import { Filter, CalendarRange, Search } from "lucide-react";
import { festiveStatus } from "../../../data/festiveMenuData";
import Card from "../../../components/UI/Card";
import Input from "../../../components/UI/Input";
import Button from "../../../components/UI/Button";

const festivals = ["All", "Diwali", "Christmas", "Eid", "Holi", "Navratri", "New Year"];

export default function FestiveFilters({
  search = "",
  setSearch,
  onSearchChange,
  status = "All",
  setStatus,
  onStatusChange,
  festival = "All",
  setFestival,
  onFestivalChange,
}) {
  const handleSearchChange = typeof setSearch === "function" ? setSearch : onSearchChange;
  const handleStatusChange = typeof setStatus === "function" ? setStatus : onStatusChange;
  const handleFestivalChange = typeof setFestival === "function" ? setFestival : onFestivalChange;

  return (
    <Card padding="p-4">
      <div className="grid gap-4 xl:grid-cols-[1fr_auto_auto] xl:items-center">

        <div className="w-full xl:max-w-md">
          <Input
            type="text"
            value={search}
            onChange={(e) => handleSearchChange?.(e.target.value)}
            placeholder="Search festive menu..."
            leftIcon={<Search size={18} />}
            className="!rounded-2xl !h-12 !py-0"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {festiveStatus.map((item) => (
            <Button
              key={item}
              variant={status === item ? "primary" : "outline"}
              onClick={() => handleStatusChange?.(item)}
              className={`!h-10 !px-4 !text-xs !rounded-xl ${status !== item ? "!border-slate-200 !text-slate-500 hover:!border-[#1A4D2E] hover:!text-[#1A4D2E] hover:!bg-emerald-50" : ""}`}
            >
              {item === "All" ? "All" : item.charAt(0).toUpperCase() + item.slice(1)}
            </Button>
          ))}
        </div>

        <div className="relative">
          <CalendarRange size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <select
            value={festival}
            onChange={(e) => handleFestivalChange?.(e.target.value)}
            className="h-12 min-w-[200px] appearance-none rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-10 text-sm font-bold text-slate-700 outline-none transition-all duration-300 focus:border-[#1A4D2E] focus:bg-white focus:ring-4 focus:ring-[#1A4D2E]/10 cursor-pointer"
          >
            {festivals.map((item) => (
              <option key={item} value={item}>
                {item === "All" ? "All Festivals" : item}
              </option>
            ))}
          </select>
          <Filter size={16} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
        </div>
      </div>
    </Card>
  );
}