import React from "react";
import { Menu, Clock } from "lucide-react";
import { useLocation } from "react-router-dom";

import SearchBar from "../SearchBar";
import NotificationButton from "./NotificationButton";
import ProfileMenu from "../ProfileMenu";
import useSellerDashboardStore from "../../../store/sellerDashboardStore";

const user = {
  subscription: "plus", // "free" | "plus"
};

const isPlus = user.subscription === "plus";

export default function Navbar({
  openSidebar,
  sidebarExpanded,
}) {
  const location = useLocation();
  const isDashboard = location.pathname === "/seller/dashboard";

  // 🟢 Fetch real seller profile data from dashboard store
  const { profile } = useSellerDashboardStore();

  // 🎯 FIX: Correctly reading store_name from nested store_profile object
  const storeName =
    profile?.store_profile?.store_name ||
    profile?.business_info?.business_name ||
    profile?.business_name ||
    profile?.name ||
    "Store";

  const storeRole = profile?.tier ? `${profile.tier} Seller` : "Plus Seller";

  const [currentTime, setCurrentTime] = React.useState(new Date());

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formattedTime = currentTime.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const formattedDate = currentTime.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <header
      className={`
        fixed
        z-40

        flex
        items-center

        border
        border-slate-200
        bg-slate-100

        shadow-md

        max-[1024px]:relative
        max-[1024px]:w-full
        max-[1024px]:h-16
        max-[1024px]:px-3
        max-[1024px]:shadow-none
        min-[1025px]:top-4
        min-[1025px]:right-4
        min-[1025px]:h-[72px]
        min-[1025px]:rounded-3xl
        min-[1025px]:px-6
        min-[1025px]:transition-[left]
        min-[1025px]:duration-300
        min-[1025px]:ease-[cubic-bezier(.22,1,.36,1)]

        ${
          sidebarExpanded
            ? "min-[1025px]:left-[256px]"
            : "min-[1025px]:left-[112px]"
        }
      `}
    >
      {/* Left */}

      <div className="flex w-10 shrink-0 items-center justify-start">
        <button
          onClick={openSidebar}
          className="
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-xl
            transition-all
            duration-300
            hover:bg-[#FDFDF5]
            active:scale-95
            lg:hidden
          "
        >
          <Menu size={22} strokeWidth={2} />
        </button>
      </div>

      {/* Center */}

      <div className="relative flex-1 h-[52px] overflow-hidden lg:flex lg:justify-start">

        <div
          className={`absolute inset-0 flex items-center lg:justify-start lg:px-0 px-2 transition-all duration-500 ease-in-out ${
            isDashboard
              ? "translate-y-0 opacity-100"
              : "-translate-y-6 opacity-0 pointer-events-none"
          }`}
        >
          <h2
            className="
              truncate
              text-center
              font-bold
              leading-none
              text-slate-900

              text-[15px]
              sm:text-[17px]
              md:text-[20px]
              lg:text-[18px]
              xl:text-[24px]
            "
          >
            BizBitesNow
            <span className="text-green-700 font-inter">{isPlus ? "Plus" : ""}</span>
          </h2>
        </div>

        {/* Time & Date */}

        <div
          className={`absolute inset-0 flex items-center lg:justify-start transition-all duration-500 ease-in-out ${
            !isDashboard
              ? "translate-y-0 opacity-100"
              : "translate-y-6 opacity-0 pointer-events-none"
          }`}
        >
          <div className="flex items-center gap-3 rounded-2xl bg-white/60 px-3 py-2 backdrop-blur-sm">
            <div className="rounded-xl bg-[#16522d]/10 p-2">
              <Clock
                size={18}
                className="text-[#16522d]"
              />
            </div>

            <div className="leading-tight">
              <p className="text-[11px] text-slate-500">
                {formattedDate}
              </p>

              <p className="text-sm font-semibold text-slate-900">
                {formattedTime}
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Right */}

      <div className="flex shrink-0 items-center gap-2 sm:gap-3">

        <div className="flex h-10 w-10 items-center justify-center sm:h-11 sm:w-11">
          <NotificationButton />
        </div>

        <div className="flex items-center">
          <ProfileMenu
            seller={{
              name: storeName,
              role: storeRole,
            }}
          />
        </div>

      </div>
    </header>
  );
}