import { useState, useCallback, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import {
  Search, Bell, LayoutGrid, ShoppingCart,
  RefreshCw, User, LogOut, CheckCircle, Star, Check,
  ChevronRight, Clock, MapPin,
} from "lucide-react";
import { categories, allProducts } from "../../data/products";
import { useCart } from "../../context/CartContext";
import FoodTypeIndicator from "../../components/customer/FoodTypeIndicator";
import NotificationPanel from "../../components/customer/NotificationPanel";
import {
  isCustomerLoggedIn,
  logoutCustomer,
  getMyProfile,
} from "../../api/customer/authApi";

const storeInfo = {
  name: "Store Name",
  initials: "SN",
  brandColor: "#E8622D",
};

const loyalty = { earned: 6, total: 10 };

const recentOrderIds = [13, 6, 8, 1];
const recentOrders = recentOrderIds
  .map((id) => allProducts.find((p) => p.id === id))
  .filter(Boolean)
  .map((p, i) => ({ ...p, distance: "4.97 km", time: `${18 + i * 3} min` }));

const img = (id) => `https://images.unsplash.com/photo-${id}?w=1400&auto=format&fit=crop&q=80`;

const heroSlides = [
  {
    image: img("1666001120694-3ebe8fd207be"),
    title: ["Great food is", "always worth it."],
    subtitle: "Fresh meals from your favourite local kitchens, delivered fast and hot to your door.",
    cta: "Order Now",
  },
  {
    image: img("1603894584373-5ac82b2ae398"),
    title: ["Cravings, solved", "in minutes."],
    subtitle: "Explore hundreds of dishes from kitchens near you, ready whenever you are.",
    cta: "Explore Menu",
  },
  {
    image: img("1697155406055-2db32d47ca07"),
    title: ["Free delivery on", "every order today."],
    subtitle: "No hidden fees, no minimum order — just great food delivered fast.",
    cta: "Start Ordering",
  },
];

const allTabs = [{ id: 0, name: "All items" }, ...categories];

const notificationTags = ["New", "Offer", "Trending", "Back in stock", "Chef's pick"];
const notifications = allProducts.slice(0, 5).map((p, i) => ({
  id: p.id,
  image: p.image,
  tag: notificationTags[i % notificationTags.length],
  title: p.name,
  meta: p.category,
  price: p.price,
}));

const StoreFront = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { totalItems, addToCart } = useCart();
  const [activeCategory, setActiveCategory] = useState(0);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState("");
  const [customerName, setCustomerName] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const searchRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    if (isCustomerLoggedIn()) {
      getMyProfile()
        .then((user) => setCustomerName(user.name))
        .catch(() => {});
    }
  }, []);

  const jumpToCategory = (categoryId) => {
    setActiveCategory(categoryId);
    setSearch("");
    menuRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const showToast = useCallback((name) => {
    setToast(name);
    setTimeout(() => setToast(""), 2000);
  }, []);

  const filteredProducts = (() => {
    let products =
      activeCategory === 0
        ? allProducts
        : categories.find((c) => c.id === activeCategory)?.products || [];
    if (search)
      products = products.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      );
    return products;
  })();

  const currentCategoryName =
    activeCategory === 0
      ? "All items"
      : categories.find((c) => c.id === activeCategory)?.name || "";

  const handleLogout = async () => {
    await logoutCustomer();
    window.location.href = "/";
  };

  const sidebarItems = [
    { icon: LayoutGrid, label: "Menu", action: () => navigate("/menu"), match: ["/storefront", "/menu"] },
    { icon: Search, label: "Search", action: () => { searchRef.current?.focus(); } },
    {
      icon: ShoppingCart,
      label: "Cart",
      action: () => navigate("/cart"),
      badge: totalItems,
      match: ["/cart"],
    },
    { icon: RefreshCw, label: "Reorder", action: () => {} },
    {
      icon: User,
      label: "Profile",
      action: () =>
        navigate(
          isCustomerLoggedIn() ? "/customer/profile" : "/customer/onboarding"
        ),
      match: ["/customer/profile"],
    },
  ];

  return (
    <div style={{ fontFamily: "Arial, sans-serif" }} className="bg-[#FAFAF5] min-h-screen">

      {/* TOP HEADER */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
        <div className="flex items-center gap-3 px-4 py-3">

          {/* Store Avatar + Name */}
          <div className="flex items-center gap-2 shrink-0">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-[16px] shrink-0"
              style={{ backgroundColor: storeInfo.brandColor }}
            >
              {storeInfo.initials}
            </div>
            <div className="hidden sm:block">
              <p className="font-bold text-[#1C1C1C] leading-tight" style={{ fontSize: "16px" }}>
                {storeInfo.name}
              </p>
              <p className="text-gray-400 leading-tight" style={{ fontSize: "12px" }}>
                POWERED BY BIZBITENOW
              </p>
            </div>
          </div>

          {/* Search bar */}
          <div
            className="flex-1 flex items-center bg-gray-50 border border-gray-200 rounded-full px-4 gap-2"
            style={{ minHeight: "42px" }}
          >
            <Search size={16} className="text-gray-400 shrink-0" />
            <input
              ref={searchRef}
              type="text"
              placeholder={`Search in ${storeInfo.name}...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full outline-none text-[15px] bg-transparent text-[#1C1C1C] placeholder-gray-400"
              style={{ fontFamily: "Arial, sans-serif" }}
            />
          </div>

          {/* Menu + Bell + Cart + Customer */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => navigate("/menu")}
              className="relative flex items-center justify-center text-gray-500 shrink-0 rounded-xl hover:bg-[#FBE7DD] hover:text-[#E8622D] transition-colors lg:hidden cursor-pointer"
              style={{ minHeight: "40px", minWidth: "40px" }}
            >
              <LayoutGrid size={20} />
            </button>

            <div className="relative">
              <button
                onClick={() => setShowNotifications((v) => !v)}
                className="relative flex items-center justify-center text-gray-500 shrink-0 rounded-xl hover:bg-[#FBE7DD] hover:text-[#E8622D] transition-colors cursor-pointer"
                style={{ minHeight: "40px", minWidth: "40px" }}
              >
                <Bell size={20} />
                <span
                  className="absolute rounded-full"
                  style={{ top: "8px", right: "9px", width: "7px", height: "7px", backgroundColor: "#E8622D" }}
                />
              </button>
              {showNotifications && (
                <NotificationPanel
                  notifications={notifications}
                  onClose={() => setShowNotifications(false)}
                  onBrowseMenu={() => {
                    setShowNotifications(false);
                    navigate("/menu");
                  }}
                />
              )}
            </div>

            <button
              onClick={() => navigate("/cart")}
              className="relative flex items-center justify-center text-gray-500 shrink-0 rounded-xl hover:bg-[#FBE7DD] hover:text-[#E8622D] transition-colors lg:hidden cursor-pointer"
              style={{ minHeight: "40px", minWidth: "40px" }}
            >
              <ShoppingCart size={20} />
              {totalItems > 0 && (
                <span
                  className="absolute bg-[#E8622D] text-white font-bold rounded-full flex items-center justify-center"
                  style={{ top: "2px", right: "0px", fontSize: "10px", width: "16px", height: "16px" }}
                >
                  {totalItems > 9 ? "9+" : totalItems}
                </span>
              )}
            </button>

            <button
              onClick={() =>
                navigate(
                  isCustomerLoggedIn() ? "/customer/profile" : "/customer/onboarding"
                )
              }
              className="flex items-center gap-2 pl-2 sm:border-l border-gray-100 cursor-pointer"
            >
              <span
                className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                style={{ backgroundColor: "#FBE7DD" }}
              >
                <User size={18} style={{ color: "#E8622D" }} />
              </span>
              <div className="hidden sm:block text-left">
                <p className="font-bold text-[#1C1C1C] leading-tight" style={{ fontSize: "13px" }}>
                  {customerName || "Guest"}
                </p>
                <p className="text-gray-400 leading-tight" style={{ fontSize: "11px" }}>
                  {customerName ? "Customer" : "Sign in"}
                </p>
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* BODY */}
      <div className="flex">

        {/* LEFT SIDEBAR — desktop only, icon-only rail */}
        <aside
          className="hidden lg:flex flex-col items-center gap-2 py-3 bg-white rounded-2xl shadow-sm mx-3 mt-4 mb-4 sticky top-20 h-fit"
          style={{ width: "72px" }}
        >
          {sidebarItems.map(({ icon: Icon, label, action, badge, match }) => {
            const active = match?.includes(location.pathname);
            return (
              <button
                key={label}
                onClick={action}
                title={label}
                className="relative flex items-center justify-center rounded-xl transition-colors shrink-0 cursor-pointer"
                style={{
                  width: "44px",
                  height: "44px",
                  color: active ? "#E8622D" : "#9CA3AF",
                  backgroundColor: active ? "#FBE7DD" : "transparent",
                }}
              >
                <Icon size={20} />
                {badge > 0 && (
                  <span
                    className="absolute -top-1 -right-1 bg-[#E8622D] text-white font-bold rounded-full flex items-center justify-center"
                    style={{ fontSize: "10px", width: "16px", height: "16px" }}
                  >
                    {badge > 9 ? "9+" : badge}
                  </span>
                )}
              </button>
            );
          })}

          <div className="w-full h-px bg-gray-100 my-1" />

          <button
            onClick={handleLogout}
            title="Log out"
            className="flex items-center justify-center rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors shrink-0 cursor-pointer"
            style={{ width: "44px", height: "44px" }}
          >
            <LogOut size={20} />
          </button>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 min-w-0 px-3 lg:pr-4 lg:pl-0 py-4 pb-24 lg:pb-8">

          {/* HERO */}
          <div className="storefront-banner rounded-2xl overflow-hidden mb-4" style={{ minHeight: "260px" }}>
            
            <Swiper
              modules={[Autoplay, Pagination]}
              autoplay={{ delay: 4000, disableOnInteraction: false }}
              pagination={{ clickable: true }}
              loop={true}
              style={{ height: "100%" }}
            >
              {heroSlides.map((slide, i) => (
                <SwiperSlide key={i}>
                  <div
                    className="relative w-full h-full flex flex-col justify-center p-8"
                    style={{ minHeight: "260px", backgroundColor: "#1C1C1C" }}
                  >
                    <img
                      src={slide.image}
                      alt=""
                      className="absolute inset-0 w-full h-full object-cover opacity-70"
                    />
                    <div
                      className="absolute inset-0"
                      style={{ background: "linear-gradient(90deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.35) 60%, rgba(0,0,0,0.1) 100%)" }}
                    />
                    <div className="relative z-10 max-w-md">
                      <h1
                        className="font-bold text-white"
                        style={{ fontSize: "34px", lineHeight: "1.15" }}
                      >
                        {slide.title[0]}
                        <br />
                        {slide.title[1]}
                      </h1>
                      <p className="text-white/70 mt-3" style={{ fontSize: "15px" }}>
                        {slide.subtitle}
                      </p>
                      <button
                        onClick={() => navigate("/menu")}
                        className="mt-5 font-bold rounded-full px-6 text-white transition-colors cursor-pointer"
                        style={{ minHeight: "44px", backgroundColor: "#E8622D", fontSize: "15px" }}
                      >
                        {slide.cta}
                      </button>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* CATEGORY CARDS */}
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-[#1C1C1C]" style={{ fontSize: "17px" }}>
              Category
            </h2>
            <button
              onClick={() => navigate("/menu")}
              className="flex items-center gap-0.5 font-semibold text-gray-500 cursor-pointer"
              style={{ fontSize: "13px" }}
            >
              View all <ChevronRight size={14} />
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => jumpToCategory(category.id)}
                className="relative rounded-2xl overflow-hidden text-left cursor-pointer"
                style={{ height: "190px" }}
              >
                <img
                  src={category.products[0]?.image}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div
                  className="absolute inset-0"
                  style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.05) 40%, rgba(0,0,0,0.65) 100%)" }}
                />
                <span
                  className="absolute bottom-2.5 left-3 font-bold text-white"
                  style={{ fontSize: "14px" }}
                >
                  {category.name}
                </span>
              </button>
            ))}
            <button
              onClick={() => navigate("/menu")}
              className="relative rounded-2xl overflow-hidden flex flex-col items-center justify-center gap-1.5 text-center cursor-pointer"
              style={{ height: "190px", backgroundColor: "#FBE7DD" }}
            >
              <ChevronRight size={22} style={{ color: "#E8622D" }} />
              <span className="font-bold" style={{ fontSize: "14px", color: "#E8622D" }}>
                View all
              </span>
            </button>
          </div>

          {/* RECENT ORDERS */}
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-[#1C1C1C]" style={{ fontSize: "17px" }}>
              Recent Order
            </h2>
            <button
              onClick={() => navigate("/menu")}
              className="flex items-center gap-0.5 font-semibold text-gray-500 cursor-pointer"
              style={{ fontSize: "13px" }}
            >
              View all <ChevronRight size={14} />
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                onClick={() => navigate(`/product/${order.id}`)}
                className="bg-white rounded-2xl overflow-hidden shadow-sm cursor-pointer active:opacity-80"
              >
                <div className="relative" style={{ height: "190px" }}>
                  <img src={order.image} alt={order.name} className="w-full h-full object-cover" />
                  <span
                    className="absolute top-2 left-2 flex items-center gap-1 bg-white/90 rounded-full px-2 py-1 font-semibold text-gray-600"
                    style={{ fontSize: "11px" }}
                  >
                    <MapPin size={11} /> {order.distance}
                    <Clock size={11} className="ml-1" /> {order.time}
                  </span>
                </div>
                <div className="p-3">
                  <p className="font-bold text-[#1C1C1C] leading-snug" style={{ fontSize: "14px" }}>
                    {order.name}
                  </p>
                  <p className="font-bold mt-1" style={{ fontSize: "14px", color: "#E8622D" }}>
                    ₹{order.price}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* LOYALTY STAMPS */}
          <div
            className="rounded-2xl mb-4 px-4 py-3"
            style={{ backgroundColor: "#FBE7DD" }}
          >
            <span
              className="inline-flex items-center gap-1 text-white font-bold uppercase rounded-full px-3 py-1 mb-2"
              style={{ backgroundColor: "#E8622D", fontSize: "12px" }}
            >
              <Star size={11} fill="currentColor" />
              Plus
            </span>
            <p
              className="font-bold mb-2"
              style={{ color: "#E8622D", fontSize: "17px" }}
            >
              Your loyalty stamps
            </p>
            <div className="flex items-center gap-2 flex-wrap">
              {Array.from({ length: loyalty.total }).map((_, i) => {
                const earned = i < loyalty.earned;
                return (
                  <span
                    key={i}
                    className="rounded-full shrink-0 flex items-center justify-center"
                    style={{
                      width: "24px",
                      height: "24px",
                      border: "2px solid #E8622D",
                      backgroundColor: earned ? "#E8622D" : "transparent",
                    }}
                  >
                    {earned && <Check size={13} color="#fff" strokeWidth={3} />}
                  </span>
                );
              })}
              <span
                className="ml-1"
                style={{ color: "#E8622D", opacity: 0.75, fontSize: "14px" }}
              >
                {loyalty.earned} of {loyalty.total} — {loyalty.total - loyalty.earned} more for a free item
              </span>
            </div>
          </div>

          {/* CATEGORY TABS */}
          <div
            ref={menuRef}
            className="flex gap-2 overflow-x-auto pb-2 mb-4 scroll-mt-20 scrollbar-hide"
          >
            {allTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => { setActiveCategory(tab.id); setSearch(""); }}
                className="shrink-0 px-4 rounded-full text-[16px] font-semibold transition-all shadow-sm cursor-pointer"
                style={{
                  minHeight: "38px",
                  backgroundColor: activeCategory === tab.id ? "#E8622D" : "#fff",
                  color: activeCategory === tab.id ? "#fff" : "#1C1C1C",
                }}
              >
                {tab.name}
              </button>
            ))}
          </div>

          {/* SECTION HEADING */}
          <h2
            className="font-bold text-[#1C1C1C] mb-3 tracking-wide uppercase"
            style={{ fontSize: "16px" }}
          >
            {currentCategoryName}
          </h2>

          {/* PRODUCT LIST */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16 text-gray-400 text-[16px]">
              No products found
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  onClick={() => navigate(`/product/${product.id}`)}
                  className="bg-white rounded-2xl p-4 flex items-center gap-3 shadow-sm cursor-pointer active:opacity-80"
                >
                  {/* Image */}
                  <div className="shrink-0 w-16 h-16 rounded-xl bg-gray-100 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-[#1C1C1C] text-[16px] flex items-center gap-1.5">
                      <FoodTypeIndicator isVeg={product.isVeg} />
                      {product.name}
                    </p>
                    <p className="text-gray-400 mt-0.5 line-clamp-2" style={{ fontSize: "13px" }}>
                      {product.description}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="font-bold text-[#1C1C1C] text-[16px]">
                        ₹{product.price}
                      </span>
                    </div>
                  </div>

                  {/* Add button */}
                  <button
                    onClick={(e) => { e.stopPropagation(); addToCart(product); showToast(product.name); }}
                    className="shrink-0 border-2 border-[#E8622D] text-[#E8622D] font-bold rounded-full px-4 hover:bg-[#E8622D] hover:text-white transition-colors cursor-pointer"
                    style={{ minHeight: "38px", fontSize: "15px" }}
                  >
                    Add
                  </button>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* TOAST */}
      {toast && (
        <div
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-[#E8622D] text-white px-5 py-3 rounded-2xl shadow-lg"
          style={{ fontFamily: "Arial, sans-serif", fontSize: "15px", whiteSpace: "nowrap" }}
        >
          <CheckCircle size={16} />
          <span><strong>{toast}</strong> added to cart</span>
        </div>
      )}
    </div>
  );
};

export default StoreFront;
