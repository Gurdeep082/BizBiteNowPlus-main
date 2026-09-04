import {
  LayoutDashboard,
  Package,
  IndianRupee,
  ShoppingCart,
  Truck,
  Gift,
  BarChart3,
  Settings,
  LogOut,
  LogIn,
  TicketPercent,
  UtensilsCrossed,
  Store,
  Users,
  ReceiptIndianRupee,
  UserCog,
  LayoutTemplate,
  Utensils,
} from "lucide-react";
import { BiDish } from "react-icons/bi";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import SidebarItem from "./SidebarItem";
import useAuthStore from "../../store/authStore";
import bizBiteIcon from "../../assets/BIZ BITE NOW Icon.png";

const user = {
  subscription: "plus",
};

const isPlus = user.subscription === "plus";

const NAV_ITEMS = [
  { module: "home", title: "Home", icon: LayoutDashboard, to: "/seller/dashboard" },
  { module: "categories", title: "Categories", icon: Utensils, to: "/seller/categories" },
  { module: "products", title: "Products", icon: Package, to: "/seller/products" },
  { module: "orders", title: "Orders", icon: ShoppingCart, to: "/seller/orders" },
  { module: "billing", title: "Billing", icon: ReceiptIndianRupee, to: "/seller/billing" },
  { module: "delivery", title: "Delivery", icon: Truck, to: "/seller/delivery", premium: !isPlus },
  { module: "coupons_rewards", title: "Coupons & Rewards", icon: TicketPercent, to: "/seller/special-offers", premium: !isPlus },
  { module: "festive_menu", title: "Festive Menu", icon: Gift, to: "/seller/festivemenu", premium: !isPlus },
  { module: "landing_page", title: "Landing Page", icon: LayoutTemplate, to: "/seller/landing-page" },
  { module: "earnings", title: "Earnings", icon: IndianRupee, to: "/seller/earnings", premium: !isPlus },
  { module: "customers", title: "Customers", icon: Users, to: "/seller/customers", premium: !isPlus },
  { module: "table_qr", title: "Table & QR", icon: BiDish, to: "/seller/dine-in", premium: !isPlus },
  { module: "store_settings", title: "Store Settings", icon: Settings, to: "/seller/settings" },
];

export default function Sidebar({
  sidebarOpen,
  closeSidebar,
  onExpandedChange,
}) {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const authUser = useAuthStore((state) => state.user);
  const authProfile = useAuthStore((state) => state.profile);

  const [collapsed, setCollapsed] = useState(window.innerWidth >= 1024);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);

  const hoverTimer = useRef(null);

  const isDesktop = useCallback(() => window.innerWidth >= 1024, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setCollapsed(false);
      } else {
        setCollapsed(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const expandSidebar = () => {
    if (!isDesktop()) return;
    setCollapsed(false);
    onExpandedChange?.(true);
  };

  const collapseSidebar = () => {
    if (!isDesktop()) return;
    setCollapsed(true);
    onExpandedChange?.(false);
  };

  useEffect(() => {
    return () => {
      clearTimeout(hoverTimer.current);
    };
  }, []);

  const isSeller = authUser?.role === "Seller";

  const visibleNavItems = useMemo(() => {
    const role = authUser?.role;

    let items = NAV_ITEMS;
    if (role === "Staff") {
      const allowedModules = authProfile?.modules || [];
      items = NAV_ITEMS.filter((item) => allowedModules.includes(item.module));
    }

    const deliveryIndex = items.findIndex((item) => item.module === "delivery");

    if (isSeller) {
      const staffItem = {
        module: "staff",
        title: "Staff",
        icon: UserCog,
        to: "/seller/staff",
      };

      const withStaff = [...items];
      if (deliveryIndex !== -1) {
        withStaff.splice(deliveryIndex + 1, 0, staffItem);
      } else {
        withStaff.push(staffItem);
      }
      return withStaff;
    }

    return items;
  }, [authUser, authProfile, isSeller]);

  const handleLogout = () => {
    try {
      useAuthStore.getState().logout();
    } catch (err) {
      console.error("Store logout error:", err);
    }

    localStorage.removeItem("bizbite-auth");

    closeSidebar?.();
    setShowLogoutPopup(true);
  };

  const handleLoginRedirect = () => {
    navigate("/auth/login");
  };

  const showCollapsedLabel = window.innerWidth >= 1024 ? collapsed : false;

  return (
    <>
      <aside
        onMouseEnter={() => {
          if (window.innerWidth >= 1024) {
            expandSidebar();
          }
        }}
        onMouseLeave={() => {
          if (window.innerWidth >= 1024) {
            collapseSidebar();
          }
        }}
        className={`
            fixed
            top-0
            bottom-0
            left-0
            h-dvh

            z-40
            flex
            flex-col
            overflow-hidden
            scrollbar-hide
            rounded-none
            bg-white
            border-r
            border-slate-200/80

            transform-gpu
            will-change-transform
            will-change-[width]

            transition-all
            duration-300
            ease-[cubic-bezier(.22,1,.36,1)]

            /* Mobile */
            w-72
            ${sidebarOpen ? "translate-x-0" : "-translate-x-[120%]"}

            /* Desktop */
            lg:translate-x-0
            ${collapsed ? "lg:w-20" : "lg:w-60"}
            `}
      >
        {/* Header */}
        <div className="flex h-20 shrink-0 items-center justify-center border-b border-slate-100 px-4 py-4">
          <div
            className={`flex items-center gap-3 transition-all duration-300 ${collapsed ? "justify-center" : "justify-start px-2 w-full"
              }`}
          >
            {/* Sirf collapsed hone par icon dikhaye */}
            {collapsed && (
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl">
                <img
                  src={bizBiteIcon}
                  alt="Icon"
                  className="h-11 w-11 rounded-xl object-contain"
                />
              </div>
            )}

            {!collapsed && (
              <div className="min-w-0 w-full">
                <img
                  src={bizBiteIcon}
                  alt="Logo"
                  className="h-10 w-10 rounded-xl object-contain"
                />
              </div>
            )}
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden px-3 py-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <div className="space-y-1.5">
            {visibleNavItems.map((item) => (
              <SidebarItem
                key={item.module}
                title={item.title}
                icon={item.icon}
                to={item.to}
                premium={item.premium}
                collapsed={showCollapsedLabel}
                onClick={closeSidebar}
              />
            ))}
          </div>
        </nav>

        {/* Footer / Logout or Login */}
        <div className="mt-auto shrink-0 border-t border-slate-100 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          {isAuthenticated ? (
            <button
              type="button"
              onClick={handleLogout}
              className={`
                flex
                w-full
                items-center
                gap-3
                rounded-xl
                px-3
                py-2.5

                text-red-600
                transition

                hover:bg-red-50

                ${showCollapsedLabel ? "justify-center" : "justify-start"}
              `}
            >
              <LogOut size={20} className="shrink-0" />
              {!showCollapsedLabel && (
                <span className="text-sm font-semibold whitespace-nowrap">
                  Logout
                </span>
              )}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleLoginRedirect}
              className={`
                flex
                w-full
                items-center
                gap-3
                rounded-xl
                px-3
                py-2.5

                transition

                hover:bg-[#16522D]/10

                ${showCollapsedLabel ? "justify-center" : "justify-start"}
              `}
              style={{ color: "#16522D" }}
            >
              <LogIn size={20} className="shrink-0" />
              {!showCollapsedLabel && (
                <span className="text-sm font-semibold whitespace-nowrap">
                  Login
                </span>
              )}
            </button>
          )}
        </div>
      </aside>

      {/* Logout Success Popup */}
      {showLogoutPopup && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="w-full max-w-sm rounded-3xl bg-white p-8 text-center shadow-2xl">
            <h2 className="text-2xl font-bold text-slate-900">
              Logged Out Successfully
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              You have been safely logged out of your account.
            </p>

            <button
              onClick={handleLoginRedirect}
              className="mt-6 w-full rounded-2xl py-3 text-sm font-semibold text-white transition"
              style={{ backgroundColor: "#16522D" }}
            >
              Login to Another Account
            </button>

            <button
              onClick={() => setShowLogoutPopup(false)}
              className="mt-3 w-full rounded-2xl py-3 text-sm font-semibold text-slate-500 hover:bg-slate-100 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}