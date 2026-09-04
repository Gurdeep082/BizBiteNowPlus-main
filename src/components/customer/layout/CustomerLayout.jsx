import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import DesktopSidebar from "./DesktopSidebar";
import CustomerHeader from "./CustomerHeader";
import BottomNavigation from "./BottomNavigation";
import FloatingCartButton from "./FloatingCartButton";
import useCartStore from "../../../api/stores/customerstore/cartStore";
import useGuestCartStore from "../../../api/stores/customerstore/guestCartStore";
import useNotificationStore from "../../../api/stores/customerstore/notificationStore";
import useStoreStore from "../../../api/stores/customerstore/storeStore";
import useAuthStore from "../../../store/authStore";
import { getSocket } from "../../../services/socketNew";

import InstallAppPrompt from "../InstallAppPrompt";
import SectionHeader from "../common/SectionHeader";
import Avatar from "../common/Avatar";

const DEFAULT_THEME_COLORS = {
  primary: "#16522D",
  secondary: "#14bb54",
  accent: "#F5F5F5",
};

const getPageDetails = (pathname) => {
  const pages = {
    "/customer/menu": ["Menu", "Explore our delicious food items"],
    "/customer/cart": ["Cart", "Review the items you have selected"],
    "/customer/checkout": ["Checkout", "Complete your order securely"],
    "/customer/orders": ["My Orders", "Track your recent orders"],
    "/customer/rewards": ["Rewards", "Your offers, points and savings"],
    "/customer/favorites": ["Favourites", "Your saved dishes"],
    "/customer/profile": ["My Profile", "Manage your account"],
    "/customer/notifications": ["Notifications", "Stay up to date"],
    "/customer/book-table": ["Book a Table", "Reserve your table"],
    "/customer/booking-history": ["Booking History", "Your table reservations"],
    "/customer/scan-qr": ["Scan Table QR", "Scan the QR code at your table"],
    "/customer/scan-confirmation": ["Table Confirmed", "Your table is ready for ordering"],
    "/customer/order-success": ["Order Placed", "Your order has been sent to the store"],
    "/customer/contact": ["Contact Us", "Get in touch with the store"],
    "/customer/policies": ["About & Policies", "Store information and policies"],
    "/customer/profile/personal-details": ["Personal Details", "Manage your personal information"],
    "/customer/profile/language": ["Language", "Choose your preferred language"],
    "/customer/profile/appearance": ["Appearance", "Customize your app experience"],
    "/customer/profile/help-support": ["Help & Support", "We're here to help with your order"],
    "/customer/profile/terms-policy": ["Terms & Policies", "Read our policies and terms"],
    "/customer/profile/privacy-security": ["Privacy & Security", "Manage your privacy settings"],
    "/customer/profile/account-settings": ["Settings & Preferences", "Customize your account experience"],
    "/customer/profile/payment-methods": ["Payment Methods", "Choose how you'd like to pay"],
    "/customer/profile/addresses": ["Saved Addresses", "Manage your delivery addresses"],
  };
  if (pages[pathname]) return pages[pathname];
  if (pathname.startsWith("/customer/product/")) return ["Product Details", "View dish details and customise your order"];
  if (pathname.startsWith("/customer/orders/")) return ["Order Details", "Review your order status"];
  if (pathname.startsWith("/customer/profile/terms-policy/")) return ["Policy Details", "Review this store policy"];
  if (pathname.startsWith("/customer/profile/")) return ["Account Settings", "Manage your customer preferences"];
  if (pathname.startsWith("/customer/menu/")) return ["Menu", "Explore our delicious food items"];
  return ["BizBiteNow", "Everything you need in one place"];
};

// These screens provide a richer, page-specific header (including their own
// navigation or status controls), so the generic page header is not added.
const pagesWithOwnHeader = new Set([
  "/customer/booking-history",
  "/customer/notifications",
  "/customer/scan-confirmation",
]);

const hasOwnPageHeader = (pathname) =>
  pagesWithOwnHeader.has(pathname) ||
  pathname.startsWith("/customer/orders/") ||
  pathname.startsWith("/customer/product/") ||
  pathname.startsWith("/customer/profile/terms-policy/");

const CustomerLayout = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const authCartItems = useCartStore((state) => state.items) || [];
  const fetchCart = useCartStore((state) => state.fetchCart);
  const guestCartItems = useGuestCartStore((state) => state.items) || [];
  const activeCartItems = [...authCartItems, ...guestCartItems];

  const addRealtimeNotification = useNotificationStore(
    (state) => state.addRealtimeNotification
  );

  const profilePhone = useAuthStore((state) => state.profile?.customer_phone);
  const userPhoneNumber = useAuthStore((state) => state.user?.phoneNumber);
  const userPhone = useAuthStore((state) => state.user?.phone);

  const customerPhone =
    profilePhone ||
    userPhoneNumber ||
    userPhone ||
    localStorage.getItem("customer_phone");

  const authLogout = useAuthStore((state) => state.logout);

  const totalItems = activeCartItems.reduce(
    (total, item) => total + (item.quantity || 0),
    0
  );

  const totalPrice = activeCartItems.reduce(
    (total, item) =>
      total + (item.line_total ?? (item.price || 0) * (item.quantity || 0)),
    0
  );

  const location = useLocation();
  const navigate = useNavigate();

  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);

  const store = useStoreStore((state) => state.store);
  const fetchStore = useStoreStore((state) => state.fetchStore);

  const isRestaurantOpen = true;

  const handleLogout = () => {
    setShowLogoutPopup(true);
  };

  const confirmAndClearLogout = () => {
    try {
      authLogout();
    } catch (err) {
      console.error("Store logout error:", err);
    }

    useAuthStore.persist.clearStorage();
  };

  const handleLoginRedirect = () => {
    navigate("/auth/login", { replace: true });
  };

  const hideFloatingCart = ["/customer/cart", "/customer/checkout"].includes(
    location.pathname
  );

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    fetchStore();
  }, [fetchStore]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart().catch(() => {});
    }
  }, [fetchCart, isAuthenticated]);

  useEffect(() => {
    const themeColors = store?.store_profile?.theme_colors;

    const primary = themeColors?.primary || DEFAULT_THEME_COLORS.primary;
    const secondary = themeColors?.secondary || DEFAULT_THEME_COLORS.secondary;
    const accent = themeColors?.accent || DEFAULT_THEME_COLORS.accent;

    const root = document.documentElement;
    root.style.setProperty("--primary-color", primary);
    root.style.setProperty("--secondary-color", secondary);
    root.style.setProperty("--accent-color", accent);
  }, [store]);

  useEffect(() => {
    if (!customerPhone) return;

    const cleanPhone = String(customerPhone).replace(/\D/g, "").slice(-10);
    const socket = getSocket();

    const handleConnect = () => {
      socket.emit("join_customer_room", cleanPhone);
    };

    const handleNewNotification = (data) => {
      addRealtimeNotification(data);
      const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3");
      audio.play().catch(() => { });
    };

    socket.on("connect", handleConnect);
    socket.on("new_notification", handleNewNotification);

    if (socket.connected) {
      handleConnect();
    } else {
      socket.connect();
    }

    return () => {
      socket.off("connect", handleConnect);
      socket.off("new_notification", handleNewNotification);
    };
  }, [customerPhone, addRealtimeNotification]);

  useEffect(() => {
    document.body.style.overflow = !isRestaurantOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isRestaurantOpen]);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-slate-100 dark:bg-[#1E2021] transition-colors duration-300">
      <InstallAppPrompt />
      <div
        className={`transition-all duration-300 ${!isRestaurantOpen ? "blur-[4px] pointer-events-none select-none" : ""
          }`}
      >
        <DesktopSidebar
          expanded={sidebarExpanded}
          setExpanded={setSidebarExpanded}
          onLogout={handleLogout}
          onLogin={handleLoginRedirect}
          isAuthenticated={isAuthenticated}
        />

        <main
          className="min-h-screen transition-all duration-300"
          style={{
            paddingLeft:
              window.innerWidth >= 1024
                ? sidebarExpanded
                  ? "17rem"
                  : "7.5rem"
                : "0rem",
          }}
        >
          {location.pathname.startsWith("/customer") && (
            <CustomerHeader
              sidebarExpanded={sidebarExpanded}
              isDesktop={isDesktop}
            />
          )}

          <div
            className={`w-full ${location.pathname === "/customer" ? "lg:pt-0" : "lg:pt-0"
              }`}
          >
            {location.pathname !== "/customer" && !hasOwnPageHeader(location.pathname) && (() => {
              const [title, subtitle] = getPageDetails(location.pathname);
              return (
                <SectionHeader
                  title={title}
                  subtitle={subtitle}
                  showBack
                  horizontal
                  action={location.pathname === "/customer/profile/addresses" && !location.search ? "+ Address" : null}
                  actionClassName="rounded-xl"
                  onAction={() => navigate("/customer/profile/addresses?add=1")}
                  className="mx-auto w-[calc(100%-2rem)] max-w-[1770px] rounded-3xl border border-slate-200/80 bg-white p-4 sm:w-[calc(100%-3rem)] sm:p-5 lg:w-[calc(100%-4rem)] dark:border-white/10 dark:bg-[#181A1B]"
                  rightContent={location.pathname === "/customer/profile" ? <Avatar name="Customer" size="sm" /> : null}
                />
              );
            })()}
            <Outlet />
          </div>
        </main>

        {!hideFloatingCart && (
          <FloatingCartButton totalItems={totalItems} totalPrice={totalPrice} />
        )}

        <BottomNavigation />
      </div>

      {!isRestaurantOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="mx-5 w-full max-w-md rounded-3xl bg-white dark:bg-[#181A1B] p-8 text-center shadow-2xl">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
              Store Closed
            </h2>
            <p className="mt-3 text-base text-slate-600 dark:text-slate-400">
              We're currently not accepting orders.
            </p>
            <p className="mt-2 text-sm text-slate-400 dark:text-slate-500">
              Please visit us again during our business hours.
            </p>
          </div>
        </div>
      )}

      {showLogoutPopup && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="w-full max-w-sm rounded-3xl bg-white dark:bg-[#181A1B] p-8 text-center shadow-2xl">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Logged Out Successfully
            </h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              You have been safely logged out of your account.
            </p>
            <button
              onClick={() => {
                confirmAndClearLogout();
                handleLoginRedirect();
              }}
              className="mt-6 w-full rounded-2xl py-3 text-sm font-semibold text-white transition cursor-pointer"
              style={{ backgroundColor: "var(--primary-color)" }}
            >
              Login to Another Account
            </button>
            <button
              onClick={() => {
                confirmAndClearLogout();
                setShowLogoutPopup(false);
                navigate("/", { replace: true });
              }}
              className="mt-3 w-full rounded-2xl py-3 text-sm font-semibold text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 transition cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerLayout;
