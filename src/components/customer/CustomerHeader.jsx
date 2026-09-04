import { useNavigate } from "react-router-dom";
import { Bell, MapPin, ChevronDown, Store } from "lucide-react";
import useAuthStore from "../../../store/authStore";

export default function CustomerHeader({ store }) {
  const navigate = useNavigate();
  const profile = useAuthStore((s) => s.profile);

  // Safe localStorage fallbacks
  const localSeller = JSON.parse(localStorage.getItem("seller") || "{}");
  const localUser = JSON.parse(localStorage.getItem("user") || "{}");

  const restaurantName = 
    store?.restaurantName ||
    store?.store_name ||
    store?.business_name ||
    profile?.restaurantName || 
    profile?.business_name || 
    profile?.store_name || 
    localSeller.store_profile?.store_name || 
    localSeller.business_name || 
    localUser.restaurantName || 
    "Imperial Organic Cafe";

  // Check store prop first, then profile and localStorage
  const rawLogo = 
    store?.logo ||
    store?.store_profile?.logo ||
    profile?.logo || 
    profile?.store_profile?.logo || 
    localSeller.store_profile?.logo || 
    localSeller.logo || 
    null;

  // Automatically prepend backend base URL if logo path is relative (e.g. /uploads/...)
  const BASE_URL = 
    import.meta.env.VITE_API_URL?.replace(/\/api$/, "");

  const restaurantLogo = rawLogo 
    ? (rawLogo.startsWith("http") ? rawLogo : `${BASE_URL}${rawLogo.startsWith("/") ? "" : "/"}${rawLogo}`)
    : null;

  const deliveryLocation = 
    profile?.mohalla || 
    profile?.city || 
    localUser.mohalla || 
    "Civil Lines, Bareilly";

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200/80 px-4 sm:px-8 py-3 flex items-center justify-between shadow-2xs w-full">
      
      {/* Dynamic Restaurant Logo & Name */}
      <div 
        onClick={() => navigate("/customer")}
        className="flex items-center gap-3 cursor-pointer group"
      >
        <div className="h-10 w-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center overflow-hidden shrink-0 shadow-2xs">
          {restaurantLogo ? (
            <img src={restaurantLogo} alt={restaurantName} className="h-full w-full object-cover" />
          ) : (
            <Store size={20} className="text-emerald-700" />
          )}
        </div>
        <div>
          <h2 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition truncate max-w-[200px]">
            {restaurantName}
          </h2>
          <p className="text-[10px] text-slate-400 font-medium">Tap to view restaurant</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700">
          <MapPin size={14} className="text-emerald-600" />
          <span>Deliver to <strong className="text-slate-900">{deliveryLocation}</strong></span>
          <ChevronDown size={14} className="text-slate-400" />
        </div>

        <button
          onClick={() => navigate("/customer/notifications")}
          className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100 transition cursor-pointer"
        >
          <Bell size={18} />
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white shadow-xs">
            3
          </span>
        </button>
      </div>
    </header>
  );
}