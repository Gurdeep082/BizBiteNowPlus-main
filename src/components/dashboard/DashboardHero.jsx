import React, { useEffect, useMemo, useState } from "react";
import {
  Store,
  CalendarDays,
  Clock3,
  Sun,
  CloudSun,
  MoonStar,
} from "lucide-react";

// Temporary
// Replace with backend value later
const isPremium = true;

const DashboardHero = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [storeActive, setStoreActive] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const greeting = useMemo(() => {
    const hour = currentTime.getHours();

    if (hour < 12)
      return {
        title: "Good Morning",
        subtitle:
          "Hope today's service brings another day of happy customers.",
        Icon: Sun,
      };

    if (hour < 17)
      return {
        title: "Good Afternoon",
        subtitle:
          "Lunch hours are here. Wishing you a successful service.",
        Icon: CloudSun,
      };

    return {
      title: "Good Evening",
      subtitle:
        "Dinner service is about to begin. Make every order memorable.",
      Icon: MoonStar,
    };
  }, [currentTime]);

  const today = currentTime.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const liveTime = currentTime.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const handleToggle = async () => {
    const next = !storeActive;

    setStoreActive(next);
    setLoading(true);

    try {
      // await API.patch("/seller/store/status",{active:next});
    } catch (err) {
      setStoreActive(!next);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const GreetingIcon = greeting.Icon;

  return (
    <section className="relative overflow-hidden rounded-[30px] border border-[#FBFBFB] bg-[#FBFBFB] shadow-[0_18px_45px_rgba(0,0,0,.06)]">
      {/* Background */}

      <div className="absolute left-0 top-0 h-full w-[5px] bg-[#C89B3C]" />

      <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full border border-[#183A2A]/5" />

      <div className="absolute -right-2 top-0 h-32 w-32 rounded-full border border-[#183A2A]/5" />

      <div className="relative px-5 md:px-8">
        <div
          className="
            grid
            gap-8
            items-center
            lg:grid-cols-[1fr_360px]
            2xl:grid-cols-[1.3fr_1fr_360px]
          "
        >
          {/* ================= LEFT ================= */}

          <div
            className="
              mt-10
              space-y-4
              lg:col-start-1
              lg:row-start-1
              2xl:col-start-1
              2xl:row-start-1
            "
          >
            <div className="flex items-center gap-3">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#F5F2EC]">
                <Store size={28} className="text-[#183A2A]" />
              </div>

              <div>
                <h2
                  className="text-3xl font-bold text-[#183A2A]"
                  style={{ fontFamily: "Playfair Display" }}
                >
                  {isPremium ? "BizBiteNow+" : "BizBiteNow"}
                </h2>

                <p className="mt-1 text-xs uppercase tracking-[0.35em] text-[#8C8375]">
                  Restaurant Seller
                </p>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-3">
              <GreetingIcon className="text-[#C89B3C]" size={34} />

              <h1 className="text-3xl font-bold text-[#2C2C2C] md:text-4xl">
                {greeting.title}
              </h1>
            </div>

            <h3 className="mt-3 text-2xl font-semibold text-[#183A2A] md:text-3xl">
              Welcome back, Seller.
            </h3>

            <p className="mt-5 max-w-xl leading-8 text-[#6B7280]">
              {greeting.subtitle}
            </p>
          </div>

          {/* ================= CENTER ================= */}

          <div
            className="
              w-full

              lg:col-start-1
              lg:row-start-2

              2xl:col-start-2
              2xl:row-start-1
            "
          >
            <div className="grid grid-cols-2 pb-10 gap-5">
              {/* DATE */}

              <div className="group h-full rounded-[26px] border border-[#F4DADB] bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F5F2EC]">
                  <CalendarDays
                    size={22}
                    className="text-[#C89B3C]"
                  />
                </div>

                <p className="mt-6 text-[11px] uppercase tracking-[0.3em] text-[#9C9488]">
                  Today
                </p>

                <h3 className="mt-3 text-base font-bold leading-7 text-[#2C2C2C] lg:text-lg">
                  {today}
                </h3>
              </div>

              {/* TIME */}

              <div className="group h-full rounded-[26px] border border-[#E9E4DB] bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl lg:p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F5F2EC]">
                  <Clock3
                    size={22}
                    className="text-[#183A2A]"
                  />
                </div>

                <p className="mt-6 text-[11px] uppercase tracking-[0.3em] text-[#9C9488]">
                  Live Time
                </p>

                <h3 className="mt-3 text-base font-bold leading-7 text-[#2C2C2C] lg:text-lg">
                  {liveTime}
                </h3>
              </div>
            </div>
          </div>
                    {/* ================= RIGHT ================= */}

          <div
            className="
              w-full
              lg:py-10
              lg:col-start-2
              lg:row-start-1
              lg:row-span-2
              lg:self-center
              lg:flex
              lg:justify-end

              2xl:col-start-3
              2xl:row-start-1
              2xl:row-span-1
            "
          >
            <div className="w-full max-w-md overflow-hidden rounded-[28px] border border-[#E9E4DB] bg-[#183A2A] shadow-[0_20px_45px_rgba(24,58,42,.18)]">
              <div className="h-1 bg-[#C89B3C]" />

              <div className="relative p-5 sm:p-6 lg:p-5">
                <div className="absolute -right-8 -top-8 opacity-[0.05]">
                  <Store size={140} strokeWidth={1} />
                </div>

                <div className="relative flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-[10px] uppercase tracking-[0.3em] text-[#D7C49A] sm:text-[11px]">
                      Restaurant Status
                    </p>

                    <h2 className="mt-3 text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
                      {storeActive ? "OPEN" : "CLOSED"}
                    </h2>
                  </div>

                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${
                      storeActive
                        ? "bg-green-500/15"
                        : "bg-white/10"
                    } sm:h-14 sm:w-14`}
                  >
                    <div
                      className={`h-3.5 w-3.5 rounded-full sm:h-4 sm:w-4 ${
                        storeActive
                          ? "bg-green-400"
                          : "bg-slate-400"
                      }`}
                    />
                  </div>
                </div>

                <p className="mt-6 text-sm leading-7 text-white/70 sm:text-base">
                  {storeActive
                    ? "Your restaurant is currently accepting online orders."
                    : "Your restaurant is temporarily unavailable for online ordering."}
                </p>

                <div className="mt-8 rounded-2xl bg-white/5 p-4 backdrop-blur-sm sm:p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white">
                      Restaurant {storeActive ? "Open" : "Closed"}
                    </p>

                    <p className="mt-1 text-xs text-white/60">
                      {storeActive
                        ? "Customers can place orders online."
                        : "Online ordering is currently paused."}
                    </p>
                  </div>

                    <button
                      type="button"
                      disabled={loading}
                      onClick={handleToggle}
                      className={`relative h-9 w-20 shrink-0 rounded-full transition-all duration-400 ease-[cubic-bezier(.34,1.56,.64,1)] active:scale-95 ${
                        storeActive
                          ? "bg-[#C89B3C]"
                          : "bg-white/20"
                      } ${
                        loading
                          ? "cursor-not-allowed opacity-60"
                          : ""
                      }`}
                    >
                      <span
                        className={`absolute left-1 top-1 flex h-7 w-7 items-center justify-center rounded-full bg-white shadow-md transition-transform duration-400 ease-[cubic-bezier(.34,1.56,.64,1)] ${
                          storeActive
                            ? "translate-x-11"
                            : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>
                </div>
                                <div className="mt-8 h-px bg-white/10" />

                <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.25em] text-white/50">
                      Seller Dashboard
                    </p>

                    <p className="mt-2 text-sm text-white/70">
                      Crafted for premium restaurant management.
                    </p>
                  </div>

                  <div className="w-fit rounded-full border border-white/10 bg-white/5 px-4 py-2">
                    <span className="text-xs tracking-[0.2em] text-[#D7C49A]">
                      {isPremium ? "BizBiteNow+" : "BizBiteNow"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
                  </div>
      </div>
    </section>
  );
};

export default DashboardHero;