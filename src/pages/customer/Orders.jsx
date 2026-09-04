import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Search,
  ChevronRight,
  ChevronDown,
  Check,
  PackageOpen,
  SlidersHorizontal,
  Calendar,
  Clock,
  LogIn,
} from "lucide-react";

import useOrderStore from "../../api/stores/customerstore/customerOrderStore";
import useAuthStore from "../../store/authStore";

export default function Orders() {
  const navigate = useNavigate();

  const orders = useOrderStore((s) => s.orders);
  const loading = useOrderStore((s) => s.loading);
  const error = useOrderStore((s) => s.error);
  const fetchOrders = useOrderStore((s) => s.fetchOrders);

  const authProfile = useAuthStore((s) => s.profile);
  const authUser = useAuthStore((s) => s.user);

  const [activeTab, setActiveTab] = useState("All Orders");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const filterRef = useRef(null);

  // 🟢 Check if user is logged out
  const isLoggedOut = !authUser && !authProfile && !localStorage.getItem("token");

  const filterOptions = ["All Orders", "Ongoing", "Completed", "Cancelled"];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!filterRef.current?.contains(e.target)) {
        setFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    // 🟢 Prevent API call if user is not logged in (Avoids 401 Red Errors)
    if (!isLoggedOut) {
      fetchOrders();
    }
  }, [fetchOrders, isLoggedOut]);

  const filteredOrders = useMemo(() => {
    return (orders || []).filter((order) => {
      const status = (order.delivery_status || order.status || "").toLowerCase();

      if (
        activeTab === "Ongoing" &&
        !["unassigned", "placed", "pending", "new", "order_created", "preparing", "ready", "ready for pickup", "assigned", "out for delivery"].includes(status)
      )
        return false;
      if (activeTab === "Completed" && !["delivered", "completed"].includes(status))
        return false;
      if (activeTab === "Cancelled" && status !== "cancelled") return false;

      const orderIdStr = order._id ? order._id.toString().toLowerCase() : "";
      const itemNames = (order.items || [])
        .map((i) => (i.name || i.product_id?.name || "").toLowerCase())
        .join(" ");
      const matchesSearch =
        orderIdStr.includes(searchQuery.toLowerCase()) ||
        itemNames.includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  }, [orders, activeTab, searchQuery]);

  // ==============================================================
  // 🟢 FALLBACK UI: Matches Profile.jsx theme perfectly
  // ==============================================================
  if (isLoggedOut) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="flex min-h-[80vh] w-full flex-col items-center justify-center px-4 py-8 text-center font-sans"
      >
        <div className="w-full max-w-md rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xl dark:border-white/10 dark:bg-[#181A1B] flex flex-col items-center">
          <div
            className="mb-4 flex h-16 w-16 items-center justify-center rounded-full"
            style={{
              backgroundColor: "color-mix(in srgb, var(--primary-color) 15%, transparent)",
              color: "var(--primary-color)",
            }}
          >
            <PackageOpen size={30} />
          </div>

          <h2 className="mb-1 text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            User Not Logged In
          </h2>

          <p className="mb-6 text-xs sm:text-sm leading-relaxed text-slate-500 dark:text-slate-400 font-medium">
            Please log in to your account to track, reorder, and view your complete order history.
          </p>

          <button
            onClick={() => navigate("/auth/login")}
            onMouseEnter={(e) => {
              e.currentTarget.style.filter = "brightness(0.85)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.filter = "brightness(1)";
            }}
            className="group flex w-full items-center justify-center gap-2 rounded-xl py-3 text-xs sm:text-sm font-semibold text-white shadow-sm transition-all duration-300 active:scale-[0.99] cursor-pointer"
            style={{ backgroundColor: "var(--primary-color)" }}
          >
            <LogIn size={16} />
            <span>Login Now</span>
          </button>
        </div>
      </motion.div>
    );
  }

  // ==============================================================
  // MAIN ORDERS UI (For Logged In Users)
  // ==============================================================
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-[1780px] mx-auto space-y-6 pb-32 font-sans text-slate-800 px-4 sm:px-6 lg:px-8 pt-2"
    >
      {/* Search Bar (70%) & Dropdown Filter (30%) in a Single Row */}
      <div className="flex items-center gap-2 bg-white dark:bg-[#181A1B] p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 dark:border-white/10 shadow-2xs w-full">
        {/* Search Input (Takes ~70% width) */}
        <div className="relative w-[70%] flex-grow">
          <Search className="absolute left-3.5 top-3 text-slate-400" size={16} />
          <input
            type="text"
            placeholder="Search by order ID or item..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 rounded-xl pl-10 pr-3 py-2.5 text-xs sm:text-sm outline-none font-medium text-slate-900 dark:text-white focus:border-[#16522D] focus:bg-white dark:focus:bg-white/10 transition placeholder:text-slate-400 truncate"
          />
        </div>

        {/* Custom Dropdown Filter (Takes ~30% width) */}
        <div className="relative w-[30%] shrink-0" ref={filterRef}>
          <button
            type="button"
            onClick={() => setFilterOpen((prev) => !prev)}
            className="flex items-center gap-1.5 bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 px-2.5 sm:px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 w-full overflow-hidden cursor-pointer transition hover:border-slate-300 dark:hover:border-white/20 hover:bg-white dark:hover:bg-white/10"
          >
            <SlidersHorizontal size={14} className="text-slate-500 dark:text-slate-400 shrink-0 hidden sm:block" />
            <span className="flex-1 text-left text-slate-800 dark:text-slate-100 font-semibold truncate">{activeTab}</span>
            <ChevronDown
              size={14}
              className={`text-slate-400 shrink-0 transition-transform duration-200 ${filterOpen ? "rotate-180" : ""}`}
            />
          </button>

          {filterOpen && (
            <div className="absolute right-0 z-20 mt-2 w-44 overflow-hidden rounded-xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#181A1B] shadow-lg">
              {filterOptions.map((option) => {
                const active = option === activeTab;
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => {
                      setActiveTab(option);
                      setFilterOpen(false);
                    }}
                    className={`flex w-full items-center justify-between gap-2 px-3.5 py-2.5 text-xs font-medium text-left transition cursor-pointer hover:bg-slate-50 dark:hover:bg-white/5 ${
                      active ? "" : "text-slate-700 dark:text-slate-300"
                    }`}
                    style={
                      active
                        ? { backgroundColor: "color-mix(in srgb, var(--primary-color) 8%, transparent)", color: "var(--primary-color)" }
                        : undefined
                    }
                  >
                    <span className={active ? "font-semibold" : "font-medium"}>{option}</span>
                    {active && <Check size={14} style={{ color: "var(--primary-color)" }} />}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* States: Loading / Error / Empty / List */}
      {loading ? (
        <div className="bg-white dark:bg-[#181A1B] rounded-2xl p-16 text-center border border-slate-200/80 dark:border-white/10 shadow-2xs w-full">
          <p className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400 animate-pulse">
            Loading your orders...
          </p>
        </div>
      ) : error ? (
        <div className="bg-white dark:bg-[#181A1B] rounded-2xl p-16 text-center border border-slate-200/80 dark:border-white/10 shadow-2xs space-y-2 w-full">
          <div className="mx-auto w-12 h-12 bg-rose-50 dark:bg-rose-900/30 rounded-full flex items-center justify-center text-rose-500 dark:text-rose-400 mb-3">
            <PackageOpen size={24} />
          </div>
          <p className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200">{error}</p>
          <button
            onClick={() => fetchOrders()}
            className="text-xs font-semibold text-[#16522D] dark:text-emerald-400 underline cursor-pointer"
          >
            Retry
          </button>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-white dark:bg-[#181A1B] rounded-2xl p-16 text-center border border-slate-200/80 dark:border-white/10 shadow-2xs space-y-3 w-full">
          <div className="mx-auto w-16 h-16 bg-emerald-50 dark:bg-emerald-900/30 rounded-full flex items-center justify-center text-[#16522D] dark:text-emerald-400">
            <PackageOpen size={30} />
          </div>
          <p className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200">
            No orders found matching your filter.
          </p>
          <button
            onClick={() => {
              setActiveTab("All Orders");
              setSearchQuery("");
            }}
            className="text-xs font-semibold text-[#16522D] dark:text-emerald-400 underline cursor-pointer"
          >
            Reset filters
          </button>
        </div>
      ) : (
        <div className="space-y-3.5 w-full">
          {filteredOrders.map((order) => {
            const rawStatus = (order.delivery_status || order.status || "Unassigned").toLowerCase();
            const orderIdFormatted = order._id ? `#BBN${order._id.slice(-6).toUpperCase()}` : "";
            const dateFormatted = order.createdAt
              ? new Date(order.createdAt).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })
              : "";
            const timeFormatted = order.createdAt
              ? new Date(order.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
              : "";

            // Status values are refined below for display styling.
            // eslint-disable-next-line no-useless-assignment
            let badgeBg = "bg-emerald-50 text-emerald-700 border border-emerald-200/60";
            // eslint-disable-next-line no-useless-assignment
            let displayStatus = order.delivery_status || order.status || "Placed";

            if (["delivered", "completed"].includes(rawStatus)) {
              badgeBg = "bg-sky-50 text-sky-700 border border-sky-200/60 dark:bg-sky-900/30 dark:text-sky-400 dark:border-sky-800/60";
              displayStatus = "Delivered";
            } else if (rawStatus === "cancelled") {
              badgeBg = "bg-rose-50 text-rose-700 border border-rose-200/60 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800/60";
              displayStatus = "Cancelled";
            } else if (["assigned", "out for delivery"].includes(rawStatus)) {
              badgeBg = "bg-indigo-50 text-indigo-700 border border-indigo-200/60 dark:bg-indigo-900/30 dark:text-indigo-400 dark:border-indigo-800/60";
              displayStatus = "Out for Delivery";
            } else if (rawStatus === "preparing") {
              badgeBg = "bg-amber-50 text-amber-700 border border-amber-200/60 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800/60";
              displayStatus = "Preparing";
            } else if (["ready", "ready for pickup"].includes(rawStatus)) {
              badgeBg = "bg-emerald-50 text-emerald-700 border border-emerald-200/60 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800/60";
              displayStatus = "Ready";
            } else {
              badgeBg = "bg-amber-50 text-amber-700 border border-amber-200/60 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800/60";
              displayStatus = "Placed";
            }

            const itemsList = order.items || [];
            const firstItem = itemsList[0];
            const itemImage =
              firstItem?.product_id?.image ||
              firstItem?.product_id?.imageUrl ||
              "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=150";
            const itemCount =
              itemsList.reduce((acc, curr) => acc + (curr.quantity || 1), 0) || 0;
            const itemSummary = itemsList
              .map((i) => i.name || i.product_id?.name)
              .filter(Boolean)
              .join(", ");

            return (
              <div
                key={order._id}
                onClick={() => navigate(`/customer/orders/${order._id}`)}
                className="group bg-white dark:bg-[#181A1B] rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-white/10 shadow-2xs hover:border-slate-300 dark:hover:border-white/20 hover:shadow-md transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full"
              >
                {/* Left Side: Image + Details */}
                <div className="flex items-center gap-4 min-w-0">
                  <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-xl overflow-hidden bg-slate-100 dark:bg-white/10 shrink-0 border border-slate-100 dark:border-white/10">
                    <img
                      src={itemImage}
                      alt="Order Item"
                      className="h-full w-full object-cover group-hover:scale-105 transition duration-300"
                    />
                  </div>
                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                        {orderIdFormatted}
                      </h3>
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wide ${badgeBg}`}
                      >
                        {displayStatus}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">
                      {itemSummary || "Delicious Food Items"}
                    </p>

                    <div className="flex items-center gap-3 text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} /> {dateFormatted}
                      </span>
                      <span>&bull;</span>
                      <span className="flex items-center gap-1">
                        <Clock size={12} /> {timeFormatted}
                      </span>
                      <span>&bull;</span>
                      <span className="font-semibold text-slate-600 dark:text-slate-300">
                        {itemCount} {itemCount === 1 ? "Item" : "Items"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Side: Total Amount + Arrow */}
                <div className="flex items-center justify-between sm:justify-end gap-6 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100 dark:border-white/10 shrink-0">
                  <div className="text-left sm:text-right">
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider">
                      Total Amount
                    </p>
                    <p className="text-sm sm:text-base font-bold" style={{ color: "var(--primary-color)" }}>
                      ₹{order.total_amount || order.amount || "249.00"}
                    </p>
                  </div>

                  <div className="h-9 w-9 rounded-xl bg-slate-50 dark:bg-white/10 border border-slate-200/80 dark:border-white/10 flex items-center justify-center text-slate-600 dark:text-slate-300 shrink-0 group-hover:bg-[var(--primary-color)] group-hover:text-white group-hover:border-[var(--primary-color)] transition">
                    <ChevronRight size={17} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
