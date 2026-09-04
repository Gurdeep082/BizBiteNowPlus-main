import { useState, useEffect, useRef } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Menu, Bell, CheckCircle, ChevronDown, ExternalLink, User, LogOut } from "lucide-react";
import Sidebar from "../dashboard/Sidebar";
import useAuthStore from "../../../src/store/authStore";
import useSettingStore from "../../../src/store/SettingStore";
import useSellerDashboardStore from "../../../src/store/sellerDashboardStore";
import bizBiteIcon from "../../assets/BIZ BITE NOW Icon.png";


export default function DashboardLayout({ children }) {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  const { profile, fetchSellerProfile, getStoreName } = useSellerDashboardStore();

  useEffect(() => {
    fetchSellerProfile();
  }, [fetchSellerProfile]);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const notifRef = useRef(null);
  const profileRef = useRef(null);

  const sellerInfo = JSON.parse(localStorage.getItem("seller") || "{}");
  const sellerId = sellerInfo._id || sellerInfo.seller_id || profile?._id || "";

  const realStoreName = getStoreName ? getStoreName() : (profile?.store_profile?.store_name || profile?.business_name || "My Store");
  const realEmail = profile?.contact_info?.business_email || profile?.email || "seller@bizbitenow.com";
  const storeInitials = realStoreName ? realStoreName.slice(0, 2).toUpperCase() : "ST";

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setNotifications([]);
    setUnreadCount(0);
  }, [sellerId]);

  const handleMarkAllRead = async () => {
    setUnreadCount(0);
    setNotifications(notifications.map((n) => ({ ...n, is_read: true })));
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F8FAFC] font-sans m-0 p-0">
      {sidebarOpen && !isDesktop && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar
        sidebarOpen={sidebarOpen}
        closeSidebar={() => setSidebarOpen(false)}
        onExpandedChange={setSidebarExpanded}
      />

      <div
        className="flex-1 h-full flex flex-col overflow-y-auto transition-all duration-300 ease-in-out m-0 p-0"
        style={{
          marginLeft: isDesktop ? (sidebarExpanded ? "240px" : "80px") : "0px",
        }}
      >
        <header className="flex items-center justify-between border-b border-slate-200/80 bg-white px-4 sm:px-8 py-2.5 sticky top-0 z-30 shadow-2xs w-full m-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="flex lg:hidden h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition cursor-pointer"
            >
              <Menu size={16} />
            </button>

            <div className="flex items-center gap-2 lg:hidden">
              <div className="flex h-10 w-30 items-center justify-center rounded-lg">
                <img src={bizBiteIcon} alt="Biz Bite Now" className="h-10 w-10 object-contain" />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 ml-auto">
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => {
                  setShowDropdown(!showDropdown);
                  setShowProfileMenu(false);
                }}
                className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition cursor-pointer shadow-xs"
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white shadow-xs">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showDropdown && (
                <div
                  className="
      fixed top-16 left-3 right-3
      sm:absolute sm:top-full sm:right-0 sm:left-auto sm:mt-2
      sm:w-96 w-auto max-w-[calc(100vw-1.5rem)]
      rounded-2xl bg-white border border-slate-200
      shadow-2xl p-4 z-50
      max-h-[70vh] sm:max-h-[400px]
      overflow-y-auto
    "
                >
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
                    <div>
                      <h3 className="font-bold text-sm text-slate-900">
                        Notifications
                      </h3>
                      <p className="text-[11px] text-slate-400">
                        Real-time alerts & updates
                      </p>
                    </div>

                    {unreadCount > 0 && (
                      <button
                        onClick={handleMarkAllRead}
                        className="flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
                      >
                        <CheckCircle size={14} />
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div className="space-y-2">
                    {notifications.length === 0 ? (
                      <div className="py-8 text-center">
                        <p className="text-sm text-slate-400">
                          No notifications yet
                        </p>
                      </div>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n._id}
                          className={`rounded-xl p-3 transition-all ${n.is_read
                              ? "bg-slate-50"
                              : "bg-emerald-50 border border-emerald-100"
                            }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <h4 className="flex-1 break-words text-sm font-semibold text-slate-900">
                              {n.title}
                            </h4>

                            <span className="shrink-0 text-[11px] text-slate-400">
                              {new Date(n.createdAt).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>

                          <p className="mt-1 break-words text-sm leading-relaxed text-slate-600">
                            {n.message}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="relative" ref={profileRef}>
              <div
                onClick={() => {
                  setShowProfileMenu(!showProfileMenu);
                  setShowDropdown(false);
                }}
                className="flex items-center gap-2.5 cursor-pointer bg-white p-1.5 pr-3 rounded-full border border-slate-200 shadow-xs hover:bg-slate-50 transition"
              >
                <div className="h-8 w-8 rounded-full bg-[#16522D] flex items-center justify-center text-white text-xs font-bold">
                  {storeInitials}
                </div>
                <div className="text-left leading-tight hidden sm:block">
                  <p className="text-xs font-bold text-slate-800 truncate max-w-[120px]">{realStoreName}</p>
                  <p className="text-[10px] text-slate-400 font-medium">View Store</p>
                </div>
                <ChevronDown size={14} className="text-slate-400 ml-0.5" />
              </div>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-56 max-w-[90vw] rounded-2xl bg-white p-2 shadow-2xl border border-slate-200 z-50">
                  <div className="p-2 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-900 truncate">{realStoreName}</p>
                    <p className="text-[11px] text-slate-400 truncate">{realEmail}</p>
                  </div>
                  <div className="py-1 space-y-0.5 text-xs">
                    <button
                      onClick={() => window.open("/store", "_blank")}
                      className="w-full flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-slate-100 rounded-xl transition cursor-pointer font-medium"
                    >
                      <ExternalLink size={14} /> Visit Public Store
                    </button>
                    <button
                      onClick={() => navigate("/seller/settings")}
                      className="w-full flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-slate-100 rounded-xl transition cursor-pointer font-medium"
                    >
                      <User size={14} /> Store Settings
                    </button>
                    <button
                      onClick={() => {
                        useSettingStore.getState().logout().catch(() => { });
                        if (typeof logout === "function") logout();
                        navigate("/login");
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-rose-600 hover:bg-rose-50 rounded-xl transition cursor-pointer font-bold"
                    >
                      <LogOut size={14} /> Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 p-3 sm:p-5 lg:p-6 w-full max-w-[1750px] mx-auto m-0 mt-0 pt-3">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
}
