import { PartyPopper, CalendarDays, Clock3, ArrowRight } from "lucide-react";
import Typography from "../../../components/UI/Typography";
import Button from "../../../components/UI/Button";
import Badge from "../../../components/UI/Badge";

const FestiveBanner = ({ menu, onViewMenu }) => {
  if (!menu) return null;

  const rawEndDate = menu.endsOn || menu.end_date;
  const endDate = rawEndDate ? new Date(rawEndDate) : null;
  const isValidDate = endDate && !isNaN(endDate.getTime());

  const now = new Date();
  const diff = isValidDate ? endDate - now : 0;

  const days = Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
  const hours = Math.max(
    0,
    Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  );

  return (
    <section className="relative overflow-hidden rounded-3xl bg-slate-900 p-6 sm:p-8 text-white shadow-lg">

      {/* Background Image & Contrast Overlay */}
      <div className="absolute inset-0 z-0">
        {menu.banner && typeof menu.banner === "string" && menu.banner.trim() !== "" ? (
          <img
            src={menu.banner}
            alt={menu.name || "Festive Background"}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full bg-[#1A4D2E]" />
        )}
        {/* Strong gradient fading from dark left to transparent right for perfect text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-900/40 sm:to-transparent" />
      </div>

      <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

        {/* Left Section (Text Content) */}
        <div className="max-w-2xl">
          <Badge className="mb-4 !bg-[#F4A300]/20 !border-0 !text-[#F4A300]">
            <PartyPopper size={18} className="mr-1.5" />
            Festive Menu LIVE
          </Badge>

          <Typography variant="h2" color="text-white">
            {menu.name || menu.title || "Festive Special Menu"}
          </Typography>

          <Typography variant="p" color="text-white" className="mt-3 leading-relaxed">
            Customers are currently viewing your festive menu instead of your regular menu.
            Once the schedule ends, the regular menu will automatically become active again.
          </Typography>

          <div className="mt-6 flex flex-wrap items-center gap-6 text-sm">
            <Typography variant="small" weight="medium" color="text-slate-200" className="flex items-center gap-2">
              <CalendarDays size={18} className="text-[#F4A300]" />
              Ends on{" "}
              {isValidDate
                ? endDate.toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })
                : "N/A"}
            </Typography>

            <Typography variant="small" weight="medium" color="text-slate-200" className="flex items-center gap-2">
              <Clock3 size={18} className="text-[#F4A300]" />
              {isValidDate
                ? `${days} Days ${hours} Hours Remaining`
                : "Active Schedule"}
            </Typography>
          </div>
        </div>

        {/* Right Action Card (Glassmorphism effect) */}
        <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-black/40 p-6 backdrop-blur-md lg:min-w-[260px] shadow-2xl">
          <div>
            <Typography variant="small" color="text-white">Auto Revert</Typography>
            <Typography variant="h4" color="text-white" className="mt-1">Enabled</Typography>
          </div>

          <div className="h-px w-full bg-white/10" />

          <div>
            <Typography variant="small" color="text-white">Next Menu</Typography>
            <Typography variant="h6" color="text-white" className="mt-1">Regular Menu</Typography>
          </div>

          <Button
            variant="secondary"
            onClick={() => onViewMenu?.(menu)}
            className="mt-2 w-full shadow-md"
          >
            View Active Menu
            <ArrowRight size={18} />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FestiveBanner;