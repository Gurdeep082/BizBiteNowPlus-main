import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Truck,
  Phone,
  CheckCircle2,
  XCircle,
  Plus,
  Search,
  Trash2,
  Edit3,
  Loader2,
  Package,
  Clock,
  MessageCircle,
  Lock,
  AlertTriangle,
  UserX,
  ChevronRight,
  MapPin,
} from "lucide-react";

import Typography from "../../../components/UI/Typography";
import Button from "../../../components/UI/Button";
import Input from "../../../components/UI/Input";
import Modal from "../../../components/UI/Modal";
import Card from "../../../components/UI/Card";
import Badge from "../../../components/UI/Badge";

import useDeliveryBoyStore from "../../../store/deliveryboyStore";
import useOrderStore from "../../../store/sellerOrderStore";

const STATUS_STEPS = ["assigned", "picked", "on the way", "delivered"];

function normalizeStatus(raw) {
  const s = String(raw || "assigned").toLowerCase();
  if (s.includes("deliver")) return "delivered";
  if (s.includes("pick")) return "picked";
  if (s.includes("way") || s.includes("transit")) return "on the way";
  return "assigned";
}

export default function DeliveryManagement() {
  const {
    deliveryBoys = [],
    loading,
    error,
    fetchDeliveryBoys,
    createDeliveryBoy,
    updateDeliveryBoy,
    toggleAvailability,
    deleteDeliveryBoy,
  } = useDeliveryBoyStore();

  const { orders = [], fetchSellerOrders } = useOrderStore();

  const [search, setSearch] = useState("");
  const [availableOnly, setAvailableOnly] = useState(false);
  const [selectedBoy, setSelectedBoy] = useState(null);

  const ORDERS_PAGE_SIZE = 8;
  const [visibleOrderCount, setVisibleOrderCount] = useState(ORDERS_PAGE_SIZE);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [formData, setFormData] = useState({ name: "", phoneNumber: "" });
  const [saving, setSaving] = useState(false);

  const [deactivateTarget, setDeactivateTarget] = useState(null);
  const [deactivating, setDeactivating] = useState(false);

  const [assignTarget, setAssignTarget] = useState(null);
  const [sendState, setSendState] = useState("idle");

  useEffect(() => {
    fetchDeliveryBoys().catch(() => { });
    if (typeof fetchSellerOrders === "function") {
      fetchSellerOrders().catch(() => { });
    }
  }, [fetchDeliveryBoys, fetchSellerOrders]);

  useEffect(() => {
    if (deliveryBoys.length > 0 && !selectedBoy) {
      setSelectedBoy(deliveryBoys[0]);
    }
  }, [deliveryBoys, selectedBoy]);

  const filteredBoys = useMemo(() => {
    return deliveryBoys.filter((boy) => {
      const matchesSearch =
        boy.name?.toLowerCase().includes(search.toLowerCase()) ||
        boy.phoneNumber?.includes(search);
      const isAvailable = boy.is_available ?? true;
      return matchesSearch && (!availableOnly || isAvailable);
    });
  }, [deliveryBoys, search, availableOnly]);

  function getOrderTime(ord) {
    const raw = ord.createdAt || ord.created_at || ord.orderDate || ord.order_date || ord.date;
    const t = raw ? new Date(raw).getTime() : NaN;
    if (!Number.isNaN(t)) return t;
    const id = String(ord._id || ord.id || "");
    if (/^[0-9a-fA-F]{24}$/.test(id)) return parseInt(id.slice(0, 8), 16) * 1000;
    return 0;
  }

  function orderMatchesSearch(ord, term) {
    if (!term) return true;
    const q = term.toLowerCase();
    const rawId = String(ord._id || ord.id || "");
    const orderId = String(ord.order_id || ord.orderId || `#BN${rawId.slice(-5).toUpperCase()}`);
    const customerName = String(ord.customer_name || ord.customer?.name || "");
    const address = String(
      ord.delivery_address?.address_line || ord.delivery_address || ord.address || ""
    );
    const amount = String(ord.total_amount ?? ord.summary?.total ?? ord.amount ?? "");
    return (
      orderId.toLowerCase().includes(q) ||
      customerName.toLowerCase().includes(q) ||
      address.toLowerCase().includes(q) ||
      amount.includes(q)
    );
  }

  function getAssignedIdStr(ord) {
    const assignedObj =
      ord.delivery_boy_id || ord.deliveryBoy || ord.delivery_boy || ord.assignedDeliveryBoy;
    return String(
      typeof assignedObj === "object" && assignedObj !== null
        ? assignedObj._id || assignedObj.id || ""
        : assignedObj || ord.deliveryBoyId || ord.delivery_boy_id || ord.assignedDeliveryBoyId || ""
    ).trim();
  }

  const assignedOrders = useMemo(() => {
    if (!selectedBoy) return [];
    const boyId = String(selectedBoy._id || selectedBoy.id || "").trim();
    return orders
      .filter((ord) => getAssignedIdStr(ord) === boyId && orderMatchesSearch(ord, search))
      .sort((a, b) => getOrderTime(b) - getOrderTime(a));
  }, [orders, selectedBoy, search]);

  const visibleOrders = assignedOrders.slice(0, visibleOrderCount);
  const hasMoreOrders = assignedOrders.length > visibleOrders.length;

  useEffect(() => {
    setVisibleOrderCount(ORDERS_PAGE_SIZE);
  }, [selectedBoy, search]);

  const unassignedOrders = useMemo(() => {
    return orders
      .filter((ord) => {
        const status = String(ord.delivery_status || ord.status || "").toLowerCase();
        return !getAssignedIdStr(ord) && !["delivered", "completed", "cancelled"].includes(status);
      })
      .sort((a, b) => getOrderTime(b) - getOrderTime(a));
  }, [orders]);

  function activeOrderFor(boyId) {
    return orders.find((ord) => {
      const status = normalizeStatus(ord.delivery_status || ord.status);
      return getAssignedIdStr(ord) === String(boyId) && status !== "delivered";
    });
  }

  const handleOpenAdd = () => {
    setModalMode("add");
    setFormData({ name: "", phoneNumber: "" });
    setModalOpen(true);
  };

  const handleOpenEdit = (boy, e) => {
    e.stopPropagation();
    setModalMode("edit");
    setSelectedBoy(boy);
    setFormData({ name: boy.name || "", phoneNumber: boy.phoneNumber || "" });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phoneNumber) {
      alert("Please fill in both name and phone number.");
      return;
    }
    setSaving(true);
    try {
      if (modalMode === "add") {
        await createDeliveryBoy(formData);
      } else {
        await updateDeliveryBoy(selectedBoy._id || selectedBoy.id, formData);
      }
      setModalOpen(false);
    } catch (err) {
      alert(err.response?.data?.message || "Could not save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleConfirmDeactivate = async () => {
    if (!deactivateTarget) return;
    const id = deactivateTarget._id || deactivateTarget.id;
    setDeactivating(true);
    try {
      await deleteDeliveryBoy(id);
      if (selectedBoy?._id === id || selectedBoy?.id === id) {
        setSelectedBoy(null);
      }
      setDeactivateTarget(null);
    } catch (err) {
      alert(err.response?.data?.message || "Could not remove. Please try again.");
    } finally {
      setDeactivating(false);
    }
  };

  const handleConfirmAssignSend = async () => {
    if (!assignTarget) return;
    setSendState("sending");
    await new Promise((r) => setTimeout(r, 900));
    setSendState("sent");
  };

  const isAssignLocked = true;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full space-y-6 pb-12 font-sans"
    >
      {/* HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Typography variant="h3">Delivery Team</Typography>
          <Typography variant="p">
            Manage your delivery partners and send them orders
          </Typography>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1 sm:w-72">
            <Input
              type="text"
              placeholder="Search partner, order id, customer, address..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              leftIcon={<Search size={16} />}
              className="!py-2.5 !text-sm"
            />
          </div>

          <Button
            variant="primary"
            onClick={handleOpenAdd}
            className="!h-10 !px-4 shrink-0"
          >
            <Plus size={16} /> Add Partner
          </Button>
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-2 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs font-semibold text-rose-600 shadow-xs">
          <AlertTriangle size={16} className="mt-0.5 shrink-0" />
          <Typography variant="small" weight="semibold" color="text-rose-600">
            Something went wrong: {error}. Try reloading the page.
          </Typography>
        </div>
      )}

      {unassignedOrders.length > 0 && (
        <div className="flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3">
          <Package size={18} className="text-amber-700 shrink-0" />
          <Typography variant="small" weight="semibold" color="text-amber-800" className="flex-1">
            {unassignedOrders.length} order{unassignedOrders.length > 1 ? "s" : ""} not assigned to anyone yet.
          </Typography>
          <Badge variant="warning" size="sm" className="!bg-white/70">
            <Lock size={10} className="mr-1" /> Coming soon
          </Badge>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* LEFT: PARTNERS LIST */}
        <Card padding="p-5" className="lg:col-span-1 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <Typography variant="h5" className="text-sm sm:text-base">Delivery Partners</Typography>
            <Badge variant="success" size="sm">
              {deliveryBoys.length} total
            </Badge>
          </div>

          <Button
            variant="outline"
            onClick={() => setAvailableOnly((v) => !v)}
            className={`w-full !justify-center !text-[11px] !border-slate-200 ${availableOnly
              ? "!border-emerald-600 !bg-emerald-50 !text-emerald-700"
              : "!bg-white !text-slate-500 hover:!bg-slate-50"
              }`}
          >
            <CheckCircle2 size={13} /> Show available only
          </Button>

          <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
            {loading && deliveryBoys.length === 0 ? (
              <div className="flex items-center justify-center py-12 text-slate-400 gap-2">
                <Loader2 size={20} className="animate-spin text-[#1A4D2E]" />
                <Typography variant="small" weight="medium">Loading partners...</Typography>
              </div>
            ) : filteredBoys.length === 0 ? (
              <div className="py-12 text-center space-y-2">
                <UserX size={24} className="mx-auto text-slate-300" />
                <Typography variant="small" weight="medium" color="text-slate-400">
                  {deliveryBoys.length === 0
                    ? 'No delivery partners yet. Add one using "Add Partner".'
                    : "No partner found with that name or number."}
                </Typography>
              </div>
            ) : (
              filteredBoys.map((boy) => {
                const boyId = boy._id || boy.id;
                const isSelected = selectedBoy?._id === boyId || selectedBoy?.id === boyId;
                const isAvailable = boy.is_available ?? true;
                const activeOrder = activeOrderFor(boyId);

                return (
                  <div
                    key={boyId}
                    onClick={() => setSelectedBoy(boy)}
                    className={`p-3.5 rounded-2xl border transition cursor-pointer ${isSelected
                      ? "border-[#1A4D2E] bg-emerald-50/40 shadow-xs"
                      : "border-slate-100 bg-slate-50/50 hover:bg-slate-50"
                      }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800 font-bold text-xs">
                          {boy.name?.slice(0, 2).toUpperCase() || "DB"}
                        </div>
                        <div className="min-w-0">
                          <Typography variant="h6" className="text-xs sm:text-sm truncate">
                            {boy.name}
                          </Typography>
                          <Typography variant="small" className="text-[11px] flex items-center gap-1 mt-0.5">
                            <Phone size={12} /> {boy.phoneNumber}
                          </Typography>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <Button
                          variant="outline"
                          onClick={(e) => handleOpenEdit(boy, e)}
                          className="!w-8 !h-8 !p-0 !border-transparent !text-slate-400 hover:!text-[#1A4D2E]"
                          title="Edit details"
                        >
                          <Edit3 size={14} />
                        </Button>
                        <Button
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeactivateTarget(boy);
                          }}
                          className="!w-8 !h-8 !p-0 !border-transparent !text-slate-400 hover:!text-rose-600"
                          title="Remove"
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <Button
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleAvailability(boyId);
                        }}
                        className={`!h-6 !px-2.5 !text-[10px] !rounded-full ${isAvailable
                          ? "!bg-emerald-50 !text-emerald-700 !border-emerald-200"
                          : "!bg-rose-50 !text-rose-600 !border-rose-200"
                          }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${isAvailable ? "bg-emerald-500" : "bg-rose-500"}`}
                        />
                        {isAvailable ? "Present Today" : "Absent"}
                      </Button>

                      {activeOrder && (
                        <Badge variant="warning" size="sm" className="!text-[9px]" title="Out delivering an order right now">
                          <Truck size={10} className="mr-1" /> Out for Delivery
                        </Badge>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </Card>

        {/* RIGHT: ASSIGNED ORDERS */}
        <Card padding="p-6 sm:p-7" className="lg:col-span-2 space-y-6">
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-5 gap-3">
            <div>
              <Typography variant="h4" className="text-base sm:text-lg">
                {selectedBoy ? `${selectedBoy.name}'s Orders` : "Orders"}
              </Typography>
              <Typography variant="small" className="text-xs mt-1">
                {selectedBoy ? `Phone: ${selectedBoy.phoneNumber}` : "Select a delivery partner"}
              </Typography>
            </div>

            {selectedBoy && (
              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  variant={(selectedBoy.is_available ?? true) ? "success" : "danger"}
                  size="md"
                  className="!px-3.5 !py-1.5 !text-xs font-semibold"
                >
                  <span
                    className={`h-1.5 w-1.5 mr-1.5 rounded-full ${(selectedBoy.is_available ?? true) ? "bg-emerald-500" : "bg-rose-500"}`}
                  />
                  {(selectedBoy.is_available ?? true) ? "Present Today" : "Absent"}
                </Badge>
                {activeOrderFor(selectedBoy._id || selectedBoy.id) && (
                  <Badge variant="warning" size="md" className="!px-3.5 !py-1.5 !text-xs font-semibold">
                    <Truck size={13} className="mr-1.5" /> Out for Delivery — busy on an order
                  </Badge>
                )}
              </div>
            )}
          </div>

          {/* 🔒 LOCKED: Quick-Assign Row */}
          {selectedBoy && unassignedOrders.length > 0 && (
            <div className="rounded-2xl border border-dashed border-emerald-300 bg-emerald-50/40 p-5 space-y-3.5 my-2">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-[#1A4D2E] text-xs font-bold">
                  <Plus size={15} /> Send new order to {selectedBoy.name}
                </div>
                <Badge variant="success" size="sm" className="!bg-white !border-emerald-300 !text-[9px] !font-bold">
                  <Lock size={9} className="mr-1" /> Coming soon
                </Badge>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 pt-1">
                {unassignedOrders.slice(0, 4).map((ord) => {
                  const rawId = String(ord._id || ord.id || "");
                  const orderId = ord.order_id || ord.orderId || `#BN${rawId.slice(-5).toUpperCase()}`;
                  return (
                    <Button
                      key={rawId}
                      variant="outline"
                      disabled={isAssignLocked}
                      onClick={() => setAssignTarget({ order: ord, boy: selectedBoy })}
                      className="!h-9 !px-3.5 !text-[11px] !rounded-xl !border-emerald-300 !bg-white !text-emerald-700 hover:!bg-emerald-50 shadow-2xs"
                    >
                      {orderId} <ChevronRight size={12} className="ml-0.5" />
                    </Button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Orders List Container */}
          <div className="space-y-4 pt-1">
            {!selectedBoy ? (
              <div className="py-20 text-center text-slate-400 text-xs font-medium">
                Select a delivery partner from the left list.
              </div>
            ) : assignedOrders.length === 0 ? (
              <div className="py-16 text-center text-slate-400 text-xs font-medium border border-dashed border-slate-200 rounded-2xl space-y-1">
                <Package size={22} className="mx-auto text-slate-300 mb-1" />
                <Typography variant="small" weight="medium">
                  {search
                    ? "No orders match your search."
                    : `${selectedBoy.name} has no orders right now.`}
                </Typography>
              </div>
            ) : (
              visibleOrders.map((ord) => {
                const rawMongoId = String(ord._id || ord.id || "");
                const orderId =
                  ord.order_id || ord.orderId || (rawMongoId ? `#BN${rawMongoId.slice(-5).toUpperCase()}` : "#ORD");
                const amount = ord.total_amount ?? ord.summary?.total ?? ord.amount ?? 0;
                const customerName = ord.customer_name || ord.customer?.name || "Customer";
                const status = normalizeStatus(ord.delivery_status || ord.status);
                const stepIndex = STATUS_STEPS.indexOf(status);
                const address =
                  ord.delivery_address?.address_line || ord.delivery_address || ord.address || "Address not available";

                return (
                  <div
                    key={rawMongoId}
                    className="rounded-2xl border border-slate-100 bg-slate-50/70 hover:bg-slate-50 transition p-5 sm:p-6 space-y-4 shadow-2xs"
                  >
                    {/* Top Row: Details & Price */}
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-[#1A4D2E] mt-0.5">
                          <Package size={22} />
                        </div>
                        <div className="space-y-1">
                          <Typography variant="small" weight="bold" color="text-[#1A4D2E]" className="text-xs">
                            {orderId}
                          </Typography>
                          <Typography variant="h6" className="text-sm sm:text-base leading-snug">
                            {customerName}
                          </Typography>
                          <Typography variant="small" weight="medium" className="text-[12px] flex items-center gap-1.5 pt-0.5 text-slate-500">
                            <MapPin size={12} className="shrink-0 text-slate-400" />
                            <span className="line-clamp-1">{address}</span>
                          </Typography>
                        </div>
                      </div>
                      <div className="sm:text-right shrink-0 pt-0.5">
                        <Typography variant="small" weight="bold" className="text-slate-400 uppercase text-[10px] block">
                          Total Amount
                        </Typography>
                        <Typography variant="h5" weight="bold" className="text-slate-900 mt-0.5">
                          ₹{amount}
                        </Typography>
                      </div>
                    </div>

                    {/* Timeline & Status Section */}
                    <div className="border-t border-slate-200/70 pt-4 mt-2 space-y-2.5">
                      <div className="flex items-center gap-1.5 px-0.5">
                        {STATUS_STEPS.map((step, i) => (
                          <div key={step} className="flex items-center flex-1 last:flex-none">
                            <div
                              className={`h-2.5 w-2.5 rounded-full shrink-0 transition-colors ${i <= stepIndex ? "bg-[#1A4D2E]" : "bg-slate-200"
                                }`}
                            />
                            {i < STATUS_STEPS.length - 1 && (
                              <div
                                className={`h-1 flex-1 mx-1 rounded-full transition-colors ${i < stepIndex ? "bg-[#1A4D2E]" : "bg-slate-200"
                                  }`}
                              />
                            )}
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center justify-between text-[11px] pt-1 px-0.5">
                        <Typography variant="small" weight="bold" className="text-slate-600 capitalize">
                          Status: <span className="text-slate-900">{status}</span>
                        </Typography>
                        <Typography variant="small" className="text-slate-400 uppercase text-[10px] tracking-wider font-semibold">
                          Step {stepIndex + 1} of {STATUS_STEPS.length}
                        </Typography>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {selectedBoy && assignedOrders.length > 0 && (
            <div className="flex flex-col items-center gap-2.5 pt-3 border-t border-slate-100">
              <Typography variant="small" weight="medium" className="text-[11px] text-slate-400">
                Showing {visibleOrders.length} of {assignedOrders.length} orders
              </Typography>
              {hasMoreOrders && (
                <Button
                  variant="outline"
                  onClick={() => setVisibleOrderCount((c) => c + ORDERS_PAGE_SIZE)}
                  className="!h-9 !px-5 !text-xs !bg-white hover:!bg-slate-50"
                >
                  Load more orders
                </Button>
              )}
            </div>
          )}
        </Card>
      </div>

      {/* ADD / EDIT MODAL */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={modalMode === "add" ? "Add Delivery Partner" : "Edit Details"}
        size="sm"
        showCloseButton={true}
        footer={
          <div className="flex items-center justify-end gap-3 w-full">
            <Button
              variant="outline"
              onClick={() => setModalOpen(false)}
              className="!border-slate-200 hover:!bg-slate-50"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={saving}
            >
              {saving ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Saving...
                </>
              ) : modalMode === "add" ? (
                "Add Partner"
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <Input
            label="Partner Name"
            required
            type="text"
            placeholder="e.g. Ramesh Kumar"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="!py-2.5 !text-sm"
          />

          <div>
            <Input
              label="Phone Number"
              required
              type="text"
              placeholder="e.g. 9876543210"
              value={formData.phoneNumber}
              onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
              className="!py-2.5 !text-sm"
            />
            <Typography variant="small" className="text-[10px] mt-1">
              Order details will be sent to this number on WhatsApp.
            </Typography>
          </div>
        </form>
      </Modal>

      {/* DEACTIVATE CONFIRM MODAL */}
      <Modal
        isOpen={!!deactivateTarget}
        onClose={() => !deactivating && setDeactivateTarget(null)}
        size="sm"
        showCloseButton={false}
      >
        <div className="flex flex-col items-center text-center space-y-4 pt-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
            <AlertTriangle size={22} />
          </div>
          <div>
            <Typography variant="h5" className="text-sm sm:text-base">
              {deactivateTarget?.name} ?
            </Typography>
            <Typography variant="small" className="text-xs mt-1.5">
              This partner will no longer appear for new orders. Past order history stays safe.
            </Typography>
          </div>
          <div className="flex items-center justify-center gap-3 pt-2 w-full">
            <Button
              variant="outline"
              disabled={deactivating}
              onClick={() => setDeactivateTarget(null)}
              className="flex-1 !border-slate-200 hover:!bg-slate-50"
            >
              Keep Partner
            </Button>
            <Button
              variant="danger"
              disabled={deactivating}
              onClick={handleConfirmDeactivate}
              className="flex-1"
            >
              {deactivating ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
              Yes, Remove
            </Button>
          </div>
        </div>
      </Modal>

      {/* ASSIGN WHATSAPP MODAL */}
      <Modal
        isOpen={!!assignTarget}
        onClose={() => {
          if (sendState !== "sending") {
            setAssignTarget(null);
            setSendState("idle");
          }
        }}
        size="sm"
        showCloseButton={false}
      >
        <div className="flex flex-col items-center text-center space-y-4 pt-4">
          {sendState !== "sent" ? (
            <>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-[#1A4D2E]">
                <MessageCircle size={22} />
              </div>
              <div>
                <Typography variant="h5" className="text-sm sm:text-base">
                  Send WhatsApp message to {assignTarget?.boy.name}?
                </Typography>
                <Typography variant="small" className="text-xs mt-1.5">
                  The customer's name, address, and order details will be sent to their phone using a ready-made template.
                </Typography>
              </div>
              <div className="flex items-center justify-center gap-3 pt-1 w-full">
                <Button
                  variant="outline"
                  disabled={sendState === "sending"}
                  onClick={() => {
                    setAssignTarget(null);
                    setSendState("idle");
                  }}
                  className="flex-1 !border-slate-200 hover:!bg-slate-50"
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  disabled={sendState === "sending"}
                  onClick={handleConfirmAssignSend}
                  className="flex-1"
                >
                  {sendState === "sending" ? (
                    <>
                      <Loader2 size={14} className="animate-spin" /> Sending...
                    </>
                  ) : (
                    <>
                      <MessageCircle size={14} /> Yes, Send
                    </>
                  )}
                </Button>
              </div>
            </>
          ) : (
            <div className="space-y-3 w-full">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-[#1A4D2E]">
                <CheckCircle2 size={22} />
              </div>
              <Typography variant="h5" className="text-sm sm:text-base">Message sent!</Typography>
              <Typography variant="small" className="text-xs">
                {assignTarget?.boy.name} has received the full order details on WhatsApp.
              </Typography>
              <Button
                variant="primary"
                onClick={() => {
                  setAssignTarget(null);
                  setSendState("idle");
                }}
                className="w-full mt-2"
              >
                Got It
              </Button>
            </div>
          )}
        </div>
      </Modal>
    </motion.div>
  );
}