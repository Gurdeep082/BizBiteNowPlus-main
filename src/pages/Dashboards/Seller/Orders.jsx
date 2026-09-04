import React, { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ShoppingBag,
  Clock,
  CheckCircle2,
  XCircle,
  PackageCheck,
  RefreshCw,
  UserCheck,
  Check,
  X,
  Truck,
  UtensilsCrossed,
  Wallet,
  Printer,
  MoreHorizontal,
  Clock3,
  Loader2,
  CalendarDays,
} from "lucide-react";

// UI Components
import Typography from "../../../components/UI/Typography";
import Button from "../../../components/UI/Button";
import Input from "../../../components/UI/Input";
import Card from "../../../components/UI/Card";
import Badge from "../../../components/UI/Badge";
import EmptyState from "../../../components/UI/EmptyState";

import OrderDrawer from "../../../components/orders/OrderDrawer";
import ExportModal from "../../../components/orders/ExportModal";
import AssignDeliveryModal from "../../../components/delivery/AssignDeliveryModal";

import useOrderStore from "../../../store/sellerOrderStore";
import useAuthStore from "../../../store/authStore";
import axiosInstance from "../../../api/axios";
import API from "../../../api/axios";

// ---------- Meta mappers ----------

const STATUS_META = {
  pending: { label: "New", text: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200", dot: "bg-blue-500", step: 0 },
  new: { label: "New", text: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200", dot: "bg-blue-500", step: 0 },
  unassigned: { label: "New", text: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200", dot: "bg-blue-500", step: 0 },
  order_created: { label: "New", text: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200", dot: "bg-blue-500", step: 0 },
  placed: { label: "New", text: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200", dot: "bg-blue-500", step: 0 },
  assigned: { label: "Assigned", text: "text-indigo-600", bg: "bg-indigo-50", border: "border-indigo-200", dot: "bg-indigo-500", step: 3 },
  preparing: { label: "Preparing", text: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200", dot: "bg-amber-500", step: 1 },
  ready: { label: "Ready", text: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200", dot: "bg-emerald-500", step: 2 },
  "ready for pickup": { label: "Ready", text: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200", dot: "bg-emerald-500", step: 2 },
  "out for delivery": { label: "Out for Delivery", text: "text-indigo-600", bg: "bg-indigo-50", border: "border-indigo-200", dot: "bg-indigo-500", step: 3 },
  delivered: { label: "Delivered", text: "text-purple-600", bg: "bg-purple-50", border: "border-purple-200", dot: "bg-purple-500", step: 4 },
  completed: { label: "Delivered", text: "text-purple-600", bg: "bg-purple-50", border: "border-purple-200", dot: "bg-purple-500", step: 4 },
  cancelled: { label: "Cancelled", text: "text-rose-600", bg: "bg-rose-50", border: "border-rose-200", dot: "bg-rose-500", step: -1 },
};

const getStatusMeta = (status) =>
  STATUS_META[String(status || "").trim().toLowerCase()] || {
    label: status || "New", text: "text-slate-600", bg: "bg-slate-50", border: "border-slate-200", dot: "bg-slate-400", step: 0,
  };

const getPaymentMeta = (order) => {
  const method = String(order.payment || order.payment_method || "COD").toUpperCase();
  const statusRaw = String(order.paymentStatus || order.payment_status || "Pending");
  const isPaid = statusRaw.toLowerCase() === "paid";
  return { method, statusLabel: statusRaw, isPaid };
};

const STATUS_OVERRIDE_OPTIONS = [
  { value: "Pending", label: "Pending", icon: Clock, tone: "text-blue-600 bg-blue-50" },
  { value: "Preparing", label: "Preparing", icon: PackageCheck, tone: "text-amber-600 bg-amber-50" },
  { value: "Ready", label: "Ready", icon: CheckCircle2, tone: "text-emerald-600 bg-emerald-50" },
  { value: "Out for Delivery", label: "Out for Delivery", icon: Truck, tone: "text-indigo-600 bg-indigo-50" },
  { value: "Delivered", label: "Delivered", icon: PackageCheck, tone: "text-purple-600 bg-purple-50" },
  { value: "Cancelled", label: "Cancelled", icon: XCircle, tone: "text-rose-600 bg-rose-50" },
];

const OVERRIDE_STEP = {
  Pending: 0,
  Preparing: 1,
  Ready: 2,
  "Out for Delivery": 3,
  Delivered: 4,
  Cancelled: -1,
};

const getOverrideOptions = (order) => {
  const meta = getStatusMeta(order.status);
  const currentStep = meta.step;

  if (currentStep === 4 || currentStep === -1) return [];

  const isDineIn = String(order.order_type).toLowerCase() === "dine-in";

  if (isDineIn) {
    return STATUS_OVERRIDE_OPTIONS.filter(
      (opt) => opt.value === "Delivered" || opt.value === "Cancelled"
    );
  }

  return STATUS_OVERRIDE_OPTIONS.filter((opt) => {
    if (opt.value === "Cancelled") return true;
    if (opt.value === "Pending") return false;
    return OVERRIDE_STEP[opt.value] > currentStep;
  });
};

const dayLabel = (dateStr) => {
  const d = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const sameDay = (a, b) =>
    a.getDate() === b.getDate() && a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear();

  if (sameDay(d, today)) return "Today";
  if (sameDay(d, yesterday)) return "Yesterday";
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
};

const groupByDay = (list) => {
  const groups = [];
  let currentLabel = null;
  let currentGroup = null;
  list.forEach((order) => {
    const label = dayLabel(order.createdAt);
    if (label !== currentLabel) {
      currentLabel = label;
      currentGroup = { label, orders: [] };
      groups.push(currentGroup);
    }
    currentGroup.orders.push(order);
  });
  return groups;
};

// ---------- Small bits ----------

function IconTip({ icon: Icon, label, tone = "text-slate-400" }) {
  return (
    <span className="group/tip relative inline-flex">
      <Icon size={13} className={tone} />
      <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-slate-900 px-2 py-1 text-[10px] font-semibold text-white opacity-0 shadow-lg transition-opacity group-hover/tip:opacity-100 z-40">
        {label}
      </span>
    </span>
  );
}

function SkeletonCard() {
  return (
    <Card padding="p-4" className="animate-pulse">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-xl bg-slate-100" />
        <div className="flex-1 space-y-2">
          <div className="h-3 w-2/3 rounded bg-slate-100" />
          <div className="h-2.5 w-1/2 rounded bg-slate-100" />
        </div>
      </div>
      <div className="mt-3 flex gap-1.5">
        <div className="h-5 w-16 rounded-full bg-slate-100" />
        <div className="h-5 w-14 rounded-full bg-slate-100" />
      </div>
      <div className="mt-3 h-8 w-full rounded-xl bg-slate-100" />
    </Card>
  );
}

function DateSeparator({ label }) {
  return (
    <div className="col-span-full flex items-center justify-center py-1.5">
      <Badge variant="secondary" size="sm" className="!font-bold">
        {label}
      </Badge>
    </div>
  );
}

// ---------- Order card ----------

function OrderCard({ order, action, isUpdating, onOpenDrawer, onPrint, openMenuId, setOpenMenuId, onOverride, overrideOptions }) {
  const statusMeta = getStatusMeta(order.status);
  const { method, isPaid, statusLabel } = getPaymentMeta(order);
  const itemsList = order.items || [];
  const orderKey = order._id || order.id;
  const menuOpen = openMenuId === orderKey;

  const typeIsDineIn = String(order.order_type).toLowerCase() === "dine-in";
  const typeIsTakeaway = ["takeaway", "pickup"].includes(String(order.order_type).toLowerCase());
  const TypeIcon = typeIsDineIn ? UtensilsCrossed : typeIsTakeaway ? ShoppingBag : Truck;
  const typeTone = typeIsDineIn
    ? "text-emerald-700 bg-emerald-50"
    : typeIsTakeaway
      ? "text-amber-700 bg-amber-50"
      : "text-blue-700 bg-blue-50";

  const timeAgo = (() => {
    const mins = Math.floor((Date.now() - new Date(order.createdAt).getTime()) / 60000);
    if (mins < 1) return "now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    return hrs < 24 ? `${hrs}h ago` : new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  })();

  const cancelled = statusMeta.step === -1;
  const completed = statusMeta.step === 4;
  const canOverride = overrideOptions && overrideOptions.length > 0;

  return (
    <motion.div
      layout
      className="group relative flex flex-col gap-3 rounded-2xl border border-slate-100 bg-white p-4 transition-shadow hover:border-slate-200 hover:shadow-sm z-0"
      transition={{ layout: { duration: 0.2, ease: "easeInOut" } }}
    >
      <div onClick={() => onOpenDrawer(order)} className="flex cursor-pointer items-start gap-3">
        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-slate-100 bg-slate-50">
          <img src={order.displayImage} alt="" className="h-full w-full object-cover" />
          <span className={`absolute bottom-0 right-0 flex h-5 w-5 items-center justify-center rounded-tl-lg ${typeTone}`}>
            <TypeIcon size={11} strokeWidth={2.25} />
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <Typography variant="small" weight="bold" color="text-slate-900" className="truncate">{order.orderId}</Typography>
            <span className="flex shrink-0 items-center gap-1 text-[10px] font-semibold text-slate-400">
              <Clock3 size={11} />
              {timeAgo}
            </span>
          </div>
          <Typography variant="small" weight="semibold" className="text-[13px] mt-0.5 truncate">{order.customer}</Typography>
          <Typography variant="small" weight="medium" className="text-[11px] mt-0.5 truncate">
            {itemsList.length} item{itemsList.length !== 1 ? "s" : ""}
          </Typography>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        <span className={`inline-flex items-center gap-1 rounded-full border ${statusMeta.bg} ${statusMeta.text} ${statusMeta.border} px-2 py-1 text-[10px] font-bold`}>
          <span className={`h-1.5 w-1.5 rounded-full ${statusMeta.dot}`} />
          {statusMeta.label}
        </span>
        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-bold ${isPaid ? "bg-emerald-50 text-emerald-700" : "bg-orange-50 text-orange-700"}`}>
          <IconTip icon={Wallet} label={`Payment method: ${method}`} tone={isPaid ? "text-emerald-500" : "text-orange-500"} />
          {method} · {isPaid ? "Paid" : statusLabel}
        </span>
        {typeIsDineIn && order.table_number && (
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-600">
            Table {order.table_number}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between gap-2 border-t border-slate-50 pt-2.5">
        <div>
          <Typography variant="small" weight="semibold" className="text-[10px] text-slate-400">Amount</Typography>
          <Typography variant="h6" className="text-sm font-bold text-slate-900">₹{order.amount}</Typography>
        </div>

        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            onClick={(e) => { e.stopPropagation(); onPrint(order); }}
            className="group/print relative !h-9 !w-9 !p-0 !border-slate-200 hover:!border-slate-300"
          >
            <Printer size={14} />
            <span className="pointer-events-none absolute -top-8 right-0 whitespace-nowrap rounded-md bg-slate-900 px-2 py-1 text-[10px] font-semibold text-white opacity-0 shadow-lg transition-opacity group-hover/print:opacity-100 z-40">
              Print bill
            </span>
          </Button>

          {action.secondaryLabel && (
            <Button
              variant="outline"
              onClick={(e) => { e.stopPropagation(); action.onSecondary?.(e); }}
              disabled={isUpdating}
              className="!h-9 !w-9 !p-0 !border-rose-100 !bg-rose-50 !text-rose-500 hover:!bg-rose-100"
            >
              <X size={14} />
            </Button>
          )}

          <Button
            variant={(cancelled || completed) ? "outline" : "primary"}
            onClick={(e) => { e.stopPropagation(); action.onClick?.(e); }}
            disabled={!action.onClick || isUpdating || cancelled || completed}
            style={!(cancelled || completed) ? action.style.style : {}}
            className={`!h-9 !px-4 !text-xs ${cancelled
                ? "!border-rose-200 !bg-rose-50 !text-rose-600 !opacity-100"
                : completed
                  ? "!border-purple-200 !bg-purple-50 !text-purple-600 !opacity-100"
                  : action.style.className
              }`}
          >
            {isUpdating ? (
              <>
                <Loader2 size={13} className="animate-spin" />
                Updating...
              </>
            ) : (
              <>
                {cancelled ? (
                  <XCircle size={13} strokeWidth={2.75} />
                ) : completed ? (
                  <CheckCircle2 size={13} strokeWidth={2.75} />
                ) : (
                  <action.Icon size={13} strokeWidth={2.75} />
                )}
                {action.label}
              </>
            )}
          </Button>

          {!action.secondaryLabel && canOverride && !cancelled && !completed && (
            <Button
              variant="outline"
              onClick={(e) => { e.stopPropagation(); setOpenMenuId(menuOpen ? null : orderKey); }}
              className={`!h-9 !w-9 !p-0 !border-transparent ${menuOpen ? "!bg-slate-100 !text-slate-600" : ""}`}
            >
              <MoreHorizontal size={16} />
            </Button>
          )}
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && canOverride && !cancelled && !completed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.18 }}
            className="overflow-hidden"
          >
            <div
              className="flex flex-wrap items-center gap-1.5 border-t border-slate-50 pt-2.5"
              onClick={(e) => e.stopPropagation()}
            >
              {overrideOptions.map((opt) => {
                const Icon = opt.icon;
                return (
                  <button
                    key={opt.value}
                    onClick={(e) => { onOverride(e, order, opt.value); setOpenMenuId(null); }}
                    className={`flex items-center gap-1 rounded-full px-2.5 py-1.5 text-[10px] font-bold transition hover:opacity-80 ${opt.tone}`}
                  >
                    <Icon size={11} strokeWidth={2.5} />
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ---------- Column with incremental "load more on scroll" + date grouping ----------

const PAGE_SIZE = 6;

function OrderColumn({ title, Icon, iconTone, list, showInitialSkeleton, emptyLabel, getPrimaryAction, updatingId, openDrawer, handlePrintFromCard, openMenuId, setOpenMenuId, handleStatusChange }) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const sentinelRef = useRef(null);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [list]);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, list.length));
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [list.length]);

  const visibleList = list.slice(0, visibleCount);
  const groups = groupByDay(visibleList);
  const hasMore = visibleCount < list.length;

  return (
    <div>
      <div className="mb-4 flex items-center gap-2.5">
        <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${iconTone.bg} ${iconTone.text}`}>
          <Icon size={17} strokeWidth={2.25} />
        </span>
        <Typography variant="h5" className="text-lg">{title}</Typography>
        <Badge variant="secondary" size="sm" className="!px-2.5">
          {list.length}
        </Badge>
      </div>

      <div className="max-h-[calc(100vh-24rem)] overflow-y-auto pr-1.5">
        {showInitialSkeleton ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : list.length === 0 ? (
          <EmptyState
            icon={ShoppingBag}
            title={emptyLabel}
            description="New orders will appear here automatically."
            className="!p-10 !border-dashed"
          />
        ) : (
          <>
            {groups.map((group) => (
              <div key={group.label} className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-1">
                <DateSeparator label={group.label} />
                {group.orders.map((order) => {
                  const action = getPrimaryAction(order);
                  const orderKey = order._id || order.id;
                  return (
                    <OrderCard
                      key={orderKey}
                      order={order}
                      action={action}
                      isUpdating={updatingId === orderKey}
                      onOpenDrawer={openDrawer}
                      onPrint={handlePrintFromCard}
                      openMenuId={openMenuId}
                      setOpenMenuId={setOpenMenuId}
                      overrideOptions={getOverrideOptions(order)}
                      onOverride={(e, ord, val) => handleStatusChange(e, ord._id || ord.id, val)}
                    />
                  );
                })}
              </div>
            ))}

            {hasMore && (
              <div ref={sentinelRef} className="flex items-center justify-center py-4">
                <Typography variant="small" weight="semibold" className="flex items-center gap-2">
                  <Loader2 size={14} className="animate-spin" /> Loading more...
                </Typography>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ---------- Main component ----------

export default function Orders() {
  const authUser = useAuthStore((state) => state.user);
  const authProfile = useAuthStore((state) => state.profile);

  const rawOrders = useOrderStore((state) => state.orders);
  const orders = useMemo(() => (Array.isArray(rawOrders) ? rawOrders : []), [rawOrders]);

  const isLoading = useOrderStore((state) => state.isLoading);
  const updateOrderStatus = useOrderStore((state) => state.updateOrderStatus);
  const assignOrder = useOrderStore((state) => state.assignOrder);
  const fetchSellerOrders = useOrderStore((state) => state.fetchSellerOrders);
  const markDineInPaid = useOrderStore((state) => state.markDineInPaid);

  const safeFetchOrders = useCallback(async () => {
    try {
      if (typeof fetchSellerOrders === "function") {
        await fetchSellerOrders();
      }
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    }
  }, [fetchSellerOrders]);

  const normalizedOrders = useMemo(() => {
    return orders.map((o) => {
      const backendStatus = String(
        o.order_status || o.status || o.delivery_status || "Pending"
      ).trim();

      const rawMongoId = String(o._id || o.id || "");
      const boyObj = typeof o.delivery_boy_id === "object" ? o.delivery_boy_id : null;

      const itemsList = Array.isArray(o.items)
        ? o.items
        : Array.isArray(o.order_items)
          ? o.order_items
          : [];

      const addressObj = typeof o.delivery_address === "object" ? o.delivery_address : {};
      const addressStr = addressObj.address_line || addressObj.address || o.delivery_address || "";

      const geoCoords = addressObj.location?.coordinates || o.location?.coordinates || null;

      const latVal =
        o.lat || o.latitude || geoCoords?.[1] || addressObj.lat || addressObj.latitude || null;
      const lngVal =
        o.lng || o.longitude || geoCoords?.[0] || addressObj.lng || addressObj.longitude || null;

      const firstItem = itemsList[0] || {};
      const prodObj = firstItem.product_id || firstItem.product || {};
      const realImage =
        o.image ||
        prodObj.image ||
        prodObj.img ||
        prodObj.image_url ||
        firstItem.image ||
        firstItem.img ||
        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=120";

      return {
        ...o,
        _id: rawMongoId,
        id: rawMongoId,
        orderId:
          o.order_id ||
          o.orderId ||
          (rawMongoId ? `#BN${rawMongoId.slice(-5).toUpperCase()}` : "ORD-TX"),
        customer: o.customer_name || o.customer?.name || o.user_name || "Guest Customer",
        phone: o.customer_phone || o.customer?.phone || o.phone || "N/A",
        address: addressStr,
        lat: latVal,
        lng: lngVal,
        items: itemsList,
        amount: o.total_amount ?? o.summary?.total ?? o.amount ?? 0,
        payment: o.payment_method || "COD",
        status: backendStatus,
        createdAt: o.createdAt || o.created_at || new Date().toISOString(),
        deliveryBoy: boyObj?.name || boyObj?.fullName || o.delivery_boy_name || "Unassigned",
        deliveryBoyId: boyObj?._id || o.delivery_boy_id || null,
        displayImage: realImage,
        order_type: o.order_type || "delivery",
        table_number: o.table_number || null,
        paymentStatus: o.paymentStatus || o.payment_status || "Pending",
      };
    });
  }, [orders]);

  const [activeFilter, setActiveFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [customDate, setCustomDate] = useState("");
  const [search, setSearch] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [assignModal, setAssignModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [deliveryBoys, setDeliveryBoys] = useState([]);
  const [storeProfile, setStoreProfile] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [pendingPrintOrder, setPendingPrintOrder] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

  useEffect(() => {
    if (!isLoading) setHasLoadedOnce(true);
  }, [isLoading]);

  useEffect(() => {
    let isMounted = true;
    const loadStoreProfile = async () => {
      try {
        const sellerId = import.meta.env.VITE_DEFAULT_SELLER_ID;
        if (!sellerId) return;

        const res = await API.get(`/customer/store/${sellerId}`);
        const payload = res?.data?.data || res?.data || {};
        if (isMounted) {
          setStoreProfile({
            ...payload,
            store_name: payload.store_profile?.store_name || payload.business_name || "Store",
            logo: payload.store_profile?.logo || "",
            address: [
              payload.contact_info?.address,
              payload.contact_info?.city,
              payload.contact_info?.state,
            ].filter(Boolean).join(", "),
            description: payload.store_profile?.description || payload.store_profile?.tagline || "",
            gst_percentage: payload.tax_settings?.gst_percentage || 0,
          });
        }
      } catch (err) {
        console.error("Failed to fetch store profile:", err);
      }
    };
    loadStoreProfile();
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    let isMounted = true;
    const loadDeliveryBoys = async () => {
      try {
        let res;
        try {
          res = await axiosInstance.get("/deliveryBoy/list");
        } catch {
          try {
            res = await axiosInstance.get("/delivery-boy/list");
          } catch {
            res = await axiosInstance.get("/deliveryboy/list");
          }
        }
        const rawData =
          res?.data?.data ||
          res?.data?.deliveryBoys ||
          res?.data?.deliveryBoy ||
          (Array.isArray(res?.data) ? res.data : []);
        if (isMounted) setDeliveryBoys(rawData);
      } catch (err) {
        console.error("Failed to fetch delivery partners list:", err);
        if (isMounted) setDeliveryBoys([]);
      }
    };
    loadDeliveryBoys();
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    safeFetchOrders();
  }, [safeFetchOrders]);

  const filteredOrders = useMemo(() => {
    let data = [...normalizedOrders];

    if (activeFilter !== "all") {
      data = data.filter((order) => {
        const s = String(order.status || "").trim().toLowerCase();
        if (activeFilter === "new") return ["pending", "new", "unassigned", "assigned", "order_created", "placed"].includes(s);
        if (activeFilter === "preparing") return s === "preparing";
        if (activeFilter === "ready") return s === "ready" || s === "ready for pickup";
        if (activeFilter === "completed") return s === "delivered" || s === "completed";
        if (activeFilter === "cancelled") return s === "cancelled";
        return true;
      });
    }

    if (dateFilter !== "all") {
      const now = new Date();
      data = data.filter((order) => {
        const d = new Date(order.createdAt);
        if (dateFilter === "today") {
          return d.toDateString() === now.toDateString();
        }
        if (dateFilter === "yesterday") {
          const y = new Date(now);
          y.setDate(now.getDate() - 1);
          return d.toDateString() === y.toDateString();
        }
        if (dateFilter === "7days") {
          const weekAgo = new Date(now);
          weekAgo.setDate(now.getDate() - 7);
          return d >= weekAgo && d <= now;
        }
        if (dateFilter === "custom" && customDate) {
          return d.toDateString() === new Date(customDate).toDateString();
        }
        return true;
      });
    }

    if (search.trim()) {
      const value = search.toLowerCase();
      data = data.filter(
        (order) =>
          String(order.orderId || "").toLowerCase().includes(value) ||
          String(order.customer || "").toLowerCase().includes(value) ||
          String(order.phone || "").includes(value)
      );
    }

    data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return data;
  }, [normalizedOrders, activeFilter, dateFilter, customDate, search]);

  const deliverySideOrders = useMemo(
    () => filteredOrders.filter((o) => String(o.order_type).toLowerCase() !== "dine-in"),
    [filteredOrders]
  );
  const dineInSideOrders = useMemo(
    () => filteredOrders.filter((o) => String(o.order_type).toLowerCase() === "dine-in"),
    [filteredOrders]
  );

  const metrics = useMemo(() => {
    return {
      total: normalizedOrders.length,
      new: normalizedOrders.filter((o) => ["pending", "new", "unassigned", "assigned", "order_created", "placed"].includes(String(o.status || "").toLowerCase())).length,
      preparing: normalizedOrders.filter((o) => String(o.status || "").toLowerCase() === "preparing").length,
      ready: normalizedOrders.filter((o) => ["ready", "ready for pickup"].includes(String(o.status || "").toLowerCase())).length,
      completed: normalizedOrders.filter((o) => ["delivered", "completed"].includes(String(o.status || "").toLowerCase())).length,
      cancelled: normalizedOrders.filter((o) => String(o.status || "").toLowerCase() === "cancelled").length,
    };
  }, [normalizedOrders]);

  const handleStatusChange = async (e, orderId, newStatus) => {
    if (e && e.stopPropagation) e.stopPropagation();
    setUpdatingId(orderId);
    try {
      await updateOrderStatus(orderId, newStatus);
    } catch (err) {
      console.error("Status update error:", err);
    } finally {
      setUpdatingId(null);
    }
  };

  // Mark dine in order as paid
  const handleMarkPaid = async (e, orderId) => {
    if (e && e.stopPropagation) e.stopPropagation();
    setUpdatingId(orderId);
    try {
      await markDineInPaid(orderId, "Cash");
    } catch (err) {
      console.error("Payment update error:", err);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleAssignDelivery = async (boyId, phone, boyObj) => {
    const targetOrderId = selectedOrder?._id || selectedOrder?.id;
    if (!targetOrderId) return;

    try {
      if (typeof assignOrder === "function") {
        await assignOrder(targetOrderId, boyId || boyObj?._id, phone || boyObj?.phone, boyObj);
      } else if (typeof updateOrderStatus === "function") {
        await updateOrderStatus(targetOrderId, "Out for Delivery");
      }

      const rawPhone = String(
        phone || boyObj?.phone || boyObj?.phoneNumber || boyObj?.mobile || ""
      ).replace(/\D/g, "");

      if (rawPhone) {
        const orderIdDisplay = selectedOrder.orderId || targetOrderId;
        const customerName = selectedOrder.customer || "Customer";
        const customerPhone = selectedOrder.phone || "N/A";
        const customerAddress = selectedOrder.address || "Address not provided";
        const totalAmount = selectedOrder.amount || 0;
        const lat = selectedOrder.lat;
        const lng = selectedOrder.lng;

        let locationMapUrl = "";
        if (lat && lng) {
          locationMapUrl = `https://www.google.com/maps?q=${lat},${lng}`;
        } else if (customerAddress && customerAddress !== "Address not provided") {
          locationMapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(customerAddress)}`;
        }

        let message = `🛵 *NEW DELIVERY ASSIGNED*\n\n`;
        message += `📦 *Order ID:* ${orderIdDisplay}\n`;
        message += `👤 *Customer:* ${customerName}\n`;
        message += `📞 *Phone:* ${customerPhone}\n`;
        message += `💵 *Collect Amount:* ₹${totalAmount}\n`;
        message += `🏠 *Address:* ${customerAddress}\n\n`;
        if (locationMapUrl) message += `📍 *Google Maps Location:* ${locationMapUrl}\n\n`;
        message += `Please deliver this order as soon as possible. Thank you!`;

        const formattedPhone = rawPhone.length === 10 ? `91${rawPhone}` : rawPhone;
        const whatsappUrl = `https://api.whatsapp.com/send?phone=${formattedPhone}&text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, "_blank");
      }

      setAssignModal(false);
      setSelectedOrder(null);
      await safeFetchOrders();
    } catch (err) {
      console.error("Assign order error:", err);
    }
  };

  const openAssignModal = (order) => {
    setSelectedOrder(order);
    setAssignModal(true);
  };

  const openDrawer = (order) => {
    setSelectedOrder(order);
    setDrawerOpen(true);
  };

  const handlePrintFromCard = (order) => {
    setPendingPrintOrder(order._id || order.id);
    openDrawer(order);
  };

  const getPrimaryAction = (order) => {
    const normStatus = String(order.status || "").trim().toLowerCase();
    const orderType = String(order.order_type || "delivery").trim().toLowerCase();
    const isDeliveryOrder = orderType === "delivery";

    const { isPaid } = getPaymentMeta(order);

    if (orderType === "dine-in" && !isPaid && normStatus !== "cancelled") {
      return {
        label: "Settle Bill",
        Icon: Wallet,
        onClick: (e) => handleMarkPaid(e, order._id || order.id),
        style: { className: "!bg-[#1A4D2E] !text-white hover:!bg-[#114023]" },
      };
    }

    if (["pending", "new", "unassigned", "order_created", "placed"].includes(normStatus)) {
      return {
        label: "Accept", Icon: Check,
        onClick: (e) => handleStatusChange(e, order._id || order.id, "Preparing"),
        secondaryLabel: "Decline",
        onSecondary: (e) => handleStatusChange(e, order._id || order.id, "Cancelled"),
        style: { style: { backgroundColor: "#1A4D2E" }, className: "text-white hover:opacity-90" },
      };
    }
    if (normStatus === "preparing") {
      return {
        label: "Mark Ready", Icon: PackageCheck,
        onClick: (e) => handleStatusChange(e, order._id || order.id, "Ready"),
        style: { className: "bg-amber-500 text-white hover:bg-amber-600" },
      };
    }
    if (normStatus === "ready" || normStatus === "ready for pickup") {
      if (isDeliveryOrder) {
        return {
          label: "Assign", Icon: UserCheck,
          onClick: () => openAssignModal(order),
          style: { className: "bg-indigo-600 text-white hover:bg-indigo-700" },
        };
      }
      return {
        label: "Picked Up", Icon: Truck,
        onClick: (e) => handleStatusChange(e, order._id || order.id, "Delivered"),
        style: { className: "bg-purple-600 text-white hover:bg-purple-700" },
      };
    }
    if (normStatus === "assigned" || normStatus === "out for delivery") {
      return {
        label: "Delivered", Icon: Truck,
        onClick: (e) => handleStatusChange(e, order._id || order.id, "Delivered"),
        style: { className: "bg-purple-600 text-white hover:bg-purple-700" },
      };
    }
    if (normStatus === "delivered" || normStatus === "completed") {
      return { label: "Completed", Icon: CheckCircle2, style: { className: "bg-purple-50 text-purple-500 cursor-default" } };
    }
    if (normStatus === "cancelled") {
      return { label: "Cancelled", Icon: XCircle, style: { className: "bg-rose-50 text-rose-400 cursor-default" } };
    }
    return {
      label: "Accept", Icon: Check,
      onClick: (e) => handleStatusChange(e, order._id || order.id, "Preparing"),
      style: { style: { backgroundColor: "#1A4D2E" }, className: "text-white hover:opacity-90" },
    };
  };

  const showInitialSkeleton = isLoading && !hasLoadedOnce && normalizedOrders.length === 0;

  const FILTER_CARDS = [
    { id: "all", label: "All Orders", value: metrics.total, icon: ShoppingBag, iconBg: "bg-slate-100", iconText: "text-slate-600" },
    { id: "new", label: "New", value: metrics.new, icon: Clock, iconBg: "bg-blue-50", iconText: "text-blue-600" },
    { id: "preparing", label: "Preparing", value: metrics.preparing, icon: PackageCheck, iconBg: "bg-amber-50", iconText: "text-amber-600" },
    { id: "ready", label: "Ready", value: metrics.ready, icon: CheckCircle2, iconBg: "bg-emerald-50", iconText: "text-emerald-600" },
    { id: "completed", label: "Completed", value: metrics.completed, icon: CheckCircle2, iconBg: "bg-purple-50", iconText: "text-purple-600" },
    { id: "cancelled", label: "Cancelled", value: metrics.cancelled, icon: XCircle, iconBg: "bg-rose-50", iconText: "text-rose-600" },
  ];

  const DATE_FILTERS = [
    { id: "all", label: "All Dates" },
    { id: "today", label: "Today" },
    { id: "yesterday", label: "Yesterday" },
    { id: "7days", label: "Last 7 Days" },
    { id: "custom", label: "Pick a date" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full space-y-6 pb-16 font-sans"
    >
      <div className="mb-2 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <Typography variant="h3" className="text-xl sm:text-2xl">Orders</Typography>
          <Typography variant="small" className="text-xs sm:text-sm">View and manage all customer orders</Typography>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex-1 sm:w-72">
            <Input
              type="text"
              placeholder="Search orders..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              leftIcon={<Search size={18} />}
              className="!py-2 !pl-9 !text-sm"
            />
          </div>

          <div className="relative">
            <CalendarDays size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <select
              value={dateFilter}
              onChange={(e) => { setDateFilter(e.target.value); if (e.target.value !== "custom") setCustomDate(""); }}
              className="appearance-none rounded-xl border border-slate-200 bg-white py-2 pl-8 pr-8 text-xs sm:text-sm font-semibold text-slate-600 focus:border-[#1A4D2E] focus:ring-4 focus:ring-[#1A4D2E]/10 focus:outline-none transition-all duration-200"
            >
              {DATE_FILTERS.map((f) => (
                <option key={f.id} value={f.id}>{f.label}</option>
              ))}
            </select>
          </div>

          {dateFilter === "custom" && (
            <input
              type="date"
              value={customDate}
              onChange={(e) => setCustomDate(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white py-2 px-3 text-xs sm:text-sm font-semibold text-slate-600 focus:border-[#1A4D2E] focus:ring-4 focus:ring-[#1A4D2E]/10 focus:outline-none transition-all duration-200"
            />
          )}

          <Button
            variant="outline"
            onClick={safeFetchOrders}
            className="!h-[38px] !w-[38px] !p-0 !border-slate-200 !bg-white hover:!bg-slate-50"
          >
            <RefreshCw size={18} />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {FILTER_CARDS.map((card) => {
          const active = activeFilter === card.id;
          return (
            <button
              key={card.id}
              onClick={() => setActiveFilter(card.id)}
              className={`flex items-center justify-between rounded-2xl border p-3.5 text-left shadow-sm transition ${active ? "border-transparent shadow-md" : "border-slate-100 bg-white hover:border-slate-200"
                }`}
              style={active ? { backgroundColor: "#1A4D2E" } : undefined}
            >
              <div>
                <Typography variant="small" weight="medium" color={active ? "text-white/80" : "text-slate-500"} className="text-[11px]">{card.label}</Typography>
                <Typography variant="h4" className={`mt-1 ${active ? "text-white" : "text-slate-900"}`}>{card.value}</Typography>
              </div>
              <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${active ? "bg-white/15" : card.iconBg}`}>
                <card.icon size={18} className={active ? "text-white" : card.iconText} />
              </div>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:divide-x lg:divide-slate-100">
        <div className="lg:pr-6">
          <OrderColumn
            title="Delivery & Takeaway"
            Icon={Truck}
            iconTone={{ bg: "bg-blue-50", text: "text-blue-600" }}
            list={deliverySideOrders}
            showInitialSkeleton={showInitialSkeleton}
            emptyLabel="No delivery or takeaway orders"
            getPrimaryAction={getPrimaryAction}
            updatingId={updatingId}
            openDrawer={openDrawer}
            handlePrintFromCard={handlePrintFromCard}
            openMenuId={openMenuId}
            setOpenMenuId={setOpenMenuId}
            handleStatusChange={handleStatusChange}
          />
        </div>

        <div className="lg:pl-6">
          <OrderColumn
            title="Dine-in"
            Icon={UtensilsCrossed}
            iconTone={{ bg: "bg-emerald-50", text: "text-emerald-600" }}
            list={dineInSideOrders}
            showInitialSkeleton={showInitialSkeleton}
            emptyLabel="No dine-in orders right now"
            getPrimaryAction={getPrimaryAction}
            updatingId={updatingId}
            openDrawer={openDrawer}
            handlePrintFromCard={handlePrintFromCard}
            openMenuId={openMenuId}
            setOpenMenuId={setOpenMenuId}
            handleStatusChange={handleStatusChange}
          />
        </div>
      </div>

      <OrderDrawer
        open={drawerOpen}
        order={selectedOrder}
        onClose={() => { setDrawerOpen(false); setPendingPrintOrder(null); }}
        storeProfile={storeProfile}
        autoPrintOrderId={pendingPrintOrder}
      />
      <ExportModal open={exportOpen} onClose={() => setExportOpen(false)} />
      <AssignDeliveryModal isOpen={assignModal} onClose={() => setAssignModal(false)} order={selectedOrder} deliveryBoys={deliveryBoys} onAssign={handleAssignDelivery} />
    </motion.div>
  );
}