import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Percent,
  IndianRupee,
  Bike,
  Trash2,
  Edit2,
  Plus,
  Loader2,
  Tag,
  Search,
  TicketPercent,
  Stamp,
  ChevronRight,
  AlertTriangle,
  Check,
  Gift,
} from "lucide-react";

import Typography from "../UI/Typography";
import Button from "../UI/Button";
import Input from "../UI/Input";
import Modal from "../UI/Modal";
import Card from "../UI/Card";
import Toggle from "../UI/Toggle";

import useDiscountStore from "../../store/discountStore";
import LoyaltyStampsDashboard from "./LoyaltyStampDashboard";
import API from "../../api/axios";

const formatDate = (iso) => {
  if (!iso) return "";
  return new Date(iso).toISOString().split("T")[0];
};

const defaultForm = {
  code: "",
  description: "",
  discount_type: "percentage",
  discount_value: 0,
  min_order_value: 0,
  max_discount_cap: 0,
  valid_from: "",
  valid_until: "",
  is_active: true,
};

const TYPE_OPTIONS = [
  { type: "percentage", icon: Percent, label: "% Off" },
  { type: "flat", icon: IndianRupee, label: "₹ Off" },
  { type: "delivery", icon: Bike, label: "Free Delivery" },
];

const defaultLoyaltyForm = {
  is_active: true,
  target_stamps: 10,
  reward_type: "FLAT_DISCOUNT",
  reward_value: 10,
  reward_description: "",
  min_order_value: 200,
  free_products: [],
};

function StampCard({ total, filled }) {
  return (
    <div className="rounded-2xl border-2 border-dashed border-emerald-300 bg-emerald-50/50 p-4">
      <div className="grid grid-cols-5 gap-2.5">
        {Array.from({ length: total }).map((_, i) => {
          const isFilled = i < filled;
          return (
            <div
              key={i}
              className={`flex aspect-square items-center justify-center rounded-full border-2 transition ${isFilled
                ? "border-[#1A4D2E] bg-[#1A4D2E] text-white"
                : "border-slate-300 border-dashed bg-white text-slate-300"
                }`}
            >
              <Stamp size={14} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function DiscountManager() {
  const {
    discounts,
    isLoading,
    getDiscounts,
    createDiscount,
    updateDiscount,
    deleteDiscount,
    getLoyaltySettings,
    updateLoyaltySettings,
  } = useDiscountStore();

  const [tab, setTab] = useState("coupons");
  const [showStampsDashboard, setShowStampsDashboard] = useState(false);

  const [formData, setFormData] = useState(defaultForm);
  const [editingId, setEditingId] = useState(null);
  const [localError, setLocalError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [deactivateTarget, setDeactivateTarget] = useState(null);
  const [deactivating, setDeactivating] = useState(false);
  const [togglingId, setTogglingId] = useState(null);

  const [loyaltyForm, setLoyaltyForm] = useState(defaultLoyaltyForm);
  const [loyaltySaved, setLoyaltySaved] = useState(false);
  const [loyaltyLoading, setLoyaltyLoading] = useState(false);
  const [loyaltyError, setLoyaltyError] = useState("");

  const [engagementData, setEngagementData] = useState(null);
  const [loadingEngagement, setLoadingEngagement] = useState(false);

  const [menuProducts, setMenuProducts] = useState([]);
  const [productSearch, setProductSearch] = useState("");

  useEffect(() => {
    getDiscounts();
    getLoyaltySettings()
      .then((settings) => {
        if (settings) {
          setLoyaltyForm((prev) => ({
            ...prev,
            ...settings,
            free_products: settings.free_products?.map(p => typeof p === 'object' ? p._id : p) || []
          }));
        }
      })
      .catch(() => { });

    API.get("/products/dashboard/all")
      .then((res) => {
        let fetchedProducts = [];
        const data = res.data;

        if (Array.isArray(data)) {
          fetchedProducts = data;
        } else if (data?.products) {
          fetchedProducts = data.products;
        } else if (data?.data && Array.isArray(data.data)) {
          fetchedProducts = data.data;
        } else if (data?.data?.products) {
          fetchedProducts = data.data.products;
        }

        setMenuProducts(fetchedProducts);
      })
      .catch((err) => console.warn("Failed to fetch dashboard products", err));
  }, [getDiscounts, getLoyaltySettings]);

  useEffect(() => {
    if (tab === "loyalty") {
      const fetchEngagement = async () => {
        setLoadingEngagement(true);
        try {
          const res = await API.get("/loyalty/engagement");
          if (res.data?.success || res.data) {
            setEngagementData(res.data);
          }
        } catch (error) {
          console.error("Failed to fetch loyalty engagement data", error);
        } finally {
          setLoadingEngagement(false);
        }
      };
      fetchEngagement();
    }
  }, [tab]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");

    if (!formData.code || !formData.valid_until) {
      setLocalError("Please enter a code and an expiry date.");
      return;
    }
    if (formData.discount_type !== "delivery" && formData.discount_value <= 0) {
      setLocalError("Please enter a discount value greater than 0.");
      return;
    }

    try {
      if (editingId) {
        await updateDiscount(editingId, formData);
      } else {
        await createDiscount(formData);
      }
      setFormData(defaultForm);
      setEditingId(null);
      getDiscounts();
    } catch (err) {
      setLocalError("Something went wrong. Please try again.");
    }
  };

  const handleEdit = (discount) => {
    setEditingId(discount._id);
    setFormData({
      code: discount.code || "",
      description: discount.description || "",
      discount_type: discount.discount_type || "percentage",
      discount_value: discount.discount_value || 0,
      min_order_value: discount.min_order_value || 0,
      max_discount_cap: discount.max_discount_cap || 0,
      valid_from: formatDate(discount.valid_from),
      valid_until: formatDate(discount.valid_until),
      is_active: discount.is_active ?? true,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleQuickActivate = async (discount) => {
    setTogglingId(discount._id);
    try {
      await updateDiscount(discount._id, { ...discount, is_active: true });
      getDiscounts();
    } catch (err) {
      console.error(err);
    } finally {
      setTogglingId(null);
    }
  };

  const handleConfirmDeactivate = async () => {
    if (!deactivateTarget) return;
    setDeactivating(true);
    try {
      await deleteDiscount(deactivateTarget._id);
      getDiscounts();
      setDeactivateTarget(null);
    } catch (err) {
      console.error(err);
    } finally {
      setDeactivating(false);
    }
  };

  const handleCancel = () => {
    setFormData(defaultForm);
    setEditingId(null);
    setLocalError("");
  };

  const handleLoyaltyChange = (field, value) => {
    setLoyaltyForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveLoyalty = async () => {
    setLoyaltyError("");
    setLoyaltyLoading(true);

    if (loyaltyForm.reward_type === "FREE_PRODUCT" && (!loyaltyForm.free_products || loyaltyForm.free_products.length === 0)) {
      setLoyaltyError("Please select at least one free product.");
      setLoyaltyLoading(false);
      return;
    }

    try {
      await updateLoyaltySettings(loyaltyForm);
      setLoyaltySaved(true);
      setTimeout(() => setLoyaltySaved(false), 2000);
    } catch (err) {
      setLoyaltyError("Could not save stamp settings. Please try again.");
      console.error(err);
    } finally {
      setLoyaltyLoading(false);
    }
  };

  const filteredDiscounts = useMemo(() => {
    return (discounts || []).filter((d) => {
      const matchesSearch =
        d.code?.toLowerCase().includes(search.toLowerCase()) ||
        d.description?.toLowerCase().includes(search.toLowerCase());
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" ? d.is_active : !d.is_active);
      return matchesSearch && matchesStatus;
    });
  }, [discounts, search, statusFilter]);

  const filteredProducts = useMemo(() => {
    if (!productSearch.trim()) return menuProducts;
    return menuProducts.filter(item =>
      item.name?.toLowerCase().includes(productSearch.toLowerCase())
    );
  }, [menuProducts, productSearch]);

  if (showStampsDashboard) {
    return (
      <LoyaltyStampsDashboard
        data={engagementData}
        loading={loadingEngagement}
        onBack={() => setShowStampsDashboard(false)}
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full space-y-6 pb-12 font-sans text-slate-900"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Typography variant="h3">Offers & Rewards</Typography>
          <Typography variant="p">
            Create discount codes and manage your loyalty stamp program
          </Typography>
        </div>
      </div>

      <div className="inline-flex rounded-2xl border border-slate-200 bg-white p-1 shadow-xs">
        <button
          onClick={() => setTab("coupons")}
          className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs sm:text-sm font-bold transition cursor-pointer ${tab === "coupons" ? "bg-[#1A4D2E] text-white shadow-sm" : "text-slate-500 hover:bg-slate-50"
            }`}
        >
          <TicketPercent size={15} /> Coupons
        </button>
        <button
          onClick={() => setTab("loyalty")}
          className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs sm:text-sm font-bold transition cursor-pointer ${tab === "loyalty" ? "bg-[#1A4D2E] text-white shadow-sm" : "text-slate-500 hover:bg-slate-50"
            }`}
        >
          <Stamp size={15} /> Loyalty Stamps
        </button>
      </div>

      {tab === "coupons" && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <Card padding="p-5 sm:p-6" className="space-y-4 sticky top-6">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <Tag size={18} className="text-[#1A4D2E]" />
                <Typography variant="h5" className="text-base">
                  {editingId ? "Edit Coupon" : "Create a Coupon"}
                </Typography>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 pt-1">
                <div>
                  <Input
                    label={<span className="text-[10px] uppercase text-slate-500">Coupon Code</span>}
                    type="text"
                    required
                    value={formData.code}
                    disabled={!!editingId}
                    onChange={(e) => handleChange("code", e.target.value.toUpperCase())}
                    placeholder="OFFER20"
                    className="uppercase font-bold text-[#1A4D2E]"
                  />
                  <Typography variant="small" className="text-[10px] mt-1">
                    Customers will type this at checkout.
                  </Typography>
                </div>

                <div>
                  <Typography variant="small" weight="bold" color="text-slate-500" className="text-[10px] uppercase mb-1.5 block">
                    Discount Type
                  </Typography>
                  <div className="grid grid-cols-3 gap-2">
                    {TYPE_OPTIONS.map((btn) => {
                      const Icon = btn.icon;
                      const active = formData.discount_type === btn.type;
                      return (
                        <button
                          key={btn.type}
                          type="button"
                          onClick={() => handleChange("discount_type", btn.type)}
                          className={`flex flex-col items-center justify-center gap-1 rounded-xl border py-2.5 transition cursor-pointer ${active
                            ? "border-[#1A4D2E] bg-[#1A4D2E] text-white shadow-sm"
                            : "border-slate-200 text-slate-600 hover:bg-slate-50"
                            }`}
                        >
                          <Icon size={15} />
                          <span className="text-[10px] font-bold">{btn.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {formData.discount_type !== "delivery" && (
                  <Input
                    label={<span className="text-[10px] uppercase text-slate-500">How much off</span>}
                    type="number"
                    min={0}
                    max={formData.discount_type === "percentage" ? 100 : undefined}
                    value={formData.discount_value}
                    onChange={(e) => handleChange("discount_value", Number(e.target.value))}
                    leftIcon={<span className="text-xs font-bold text-slate-400">{formData.discount_type === "percentage" ? "%" : "₹"}</span>}
                    className="font-semibold"
                  />
                )}

                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label={<span className="text-[10px] uppercase text-slate-500">Min. order value</span>}
                    type="number"
                    min={0}
                    value={formData.min_order_value}
                    onChange={(e) => handleChange("min_order_value", Number(e.target.value))}
                    className="font-semibold"
                  />
                  <Input
                    label={<span className="text-[10px] uppercase text-slate-500">Max discount <span className="lowercase font-medium">(optional)</span></span>}
                    type="number"
                    min={0}
                    value={formData.max_discount_cap}
                    onChange={(e) => handleChange("max_discount_cap", Number(e.target.value))}
                    className="font-semibold"
                  />
                </div>

                <div className="space-y-2 pt-1">
                  <Typography variant="small" weight="bold" color="text-slate-500" className="text-[10px] uppercase block">
                    Valid From — Until
                  </Typography>
                  <div className="flex items-center gap-2">
                    <input
                      type="date"
                      value={formData.valid_from}
                      onChange={(e) => handleChange("valid_from", e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white px-2 py-2 text-xs font-semibold text-slate-700 outline-none focus:border-[#1A4D2E] focus:ring-4 focus:ring-[#1A4D2E]/10"
                    />
                    <span className="text-xs text-slate-400 font-medium">to</span>
                    <input
                      type="date"
                      required
                      value={formData.valid_until}
                      min={formData.valid_from}
                      onChange={(e) => handleChange("valid_until", e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white px-2 py-2 text-xs font-semibold text-slate-700 outline-none focus:border-[#1A4D2E] focus:ring-4 focus:ring-[#1A4D2E]/10"
                    />
                  </div>
                </div>

                <div>
                  <Typography variant="small" weight="bold" color="text-slate-500" className="text-[10px] uppercase block mb-1.5">
                    Description <span className="lowercase font-medium">(optional)</span>
                  </Typography>
                  <textarea
                    rows={2}
                    value={formData.description}
                    onChange={(e) => handleChange("description", e.target.value)}
                    placeholder="Shown to customers, e.g. Flat 20% off on your first order"
                    className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm font-medium text-slate-700 outline-none focus:border-[#1A4D2E] focus:ring-4 focus:ring-[#1A4D2E]/10 shadow-sm resize-none"
                  />
                </div>

                {editingId && (
                  <div className="flex items-center justify-between py-2 border-t border-slate-100">
                    <Typography variant="small" weight="bold" color="text-slate-700" className="text-[10px] uppercase">Status</Typography>
                    <Toggle
                      checked={formData.is_active}
                      onChange={(checked) => handleChange("is_active", checked)}
                    />
                  </div>
                )}

                {localError && (
                  <Typography variant="small" weight="bold" color="text-rose-600" className="flex items-center gap-1.5 text-xs">
                    <AlertTriangle size={13} /> {localError}
                  </Typography>
                )}

                <div className="flex gap-2 pt-2">
                  {editingId && (
                    <Button
                      variant="outline"
                      type="button"
                      onClick={handleCancel}
                      className="flex-1 !border-slate-200 hover:!bg-slate-50"
                    >
                      Cancel
                    </Button>
                  )}
                  <Button
                    variant="primary"
                    type="submit"
                    disabled={isLoading}
                    className="flex-1"
                  >
                    {isLoading ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : editingId ? (
                      "Save Changes"
                    ) : (
                      <>
                        <Plus size={16} /> Create Coupon
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Card>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex-1 sm:max-w-xs">
                <Input
                  type="text"
                  placeholder="Search coupons..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  leftIcon={<Search size={16} />}
                  className="!py-2.5 !text-sm"
                />
              </div>
              <div className="flex gap-2">
                {[
                  { key: "all", label: "All" },
                  { key: "active", label: "Active" },
                  { key: "inactive", label: "Inactive" },
                ].map((f) => (
                  <Button
                    key={f.key}
                    variant={statusFilter === f.key ? "primary" : "outline"}
                    onClick={() => setStatusFilter(f.key)}
                    className={`!h-8 !px-3 !text-[11px] !rounded-xl ${statusFilter !== f.key ? "!border-slate-200 !text-slate-500 hover:!bg-slate-50" : ""}`}
                  >
                    {f.label}
                  </Button>
                ))}
              </div>
            </div>

            {isLoading && (discounts || []).length === 0 ? (
              <div className="flex justify-center py-12">
                <Loader2 size={32} className="animate-spin text-[#1A4D2E]" />
              </div>
            ) : filteredDiscounts.length === 0 ? (
              <div className="rounded-3xl border border-slate-200 bg-white py-16 text-center shadow-sm space-y-1">
                <Tag size={22} className="mx-auto text-slate-300 mb-1" />
                <Typography variant="small" weight="semibold" className="text-slate-500">
                  {(discounts || []).length === 0
                    ? "No coupons yet. Create your first one on the left."
                    : "No coupons match your search."}
                </Typography>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredDiscounts.map((discount) => {
                  const isToggling = togglingId === discount._id;
                  return (
                    <div
                      key={discount._id}
                      className={`rounded-2xl border p-5 shadow-sm transition relative overflow-hidden ${discount.is_active ? "border-emerald-100 bg-white" : "border-slate-200 bg-slate-50 opacity-75"
                        }`}
                    >
                      <button
                        onClick={() =>
                          discount.is_active ? setDeactivateTarget(discount) : handleQuickActivate(discount)
                        }
                        disabled={isToggling}
                        title={discount.is_active ? "Click to deactivate" : "Click to activate"}
                        className={`absolute top-0 right-0 flex items-center gap-1 px-3 py-1.5 text-[10px] font-bold text-white rounded-bl-xl transition cursor-pointer disabled:opacity-70 ${discount.is_active ? "bg-emerald-500 hover:bg-emerald-600" : "bg-slate-400 hover:bg-slate-500"
                          }`}
                      >
                        {isToggling ? (
                          <Loader2 size={11} className="animate-spin" />
                        ) : (
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${discount.is_active ? "bg-white" : "bg-white/70"
                              }`}
                          />
                        )}
                        {discount.is_active ? "ACTIVE" : "INACTIVE"}
                      </button>

                      <div className="space-y-3">
                        <div>
                          <Typography variant="h4" className="text-lg tracking-tight">{discount.code}</Typography>
                          <Typography variant="small" weight="medium" className="text-[11px] mt-1">
                            {discount.description || "No description provided."}
                          </Typography>
                        </div>

                        <div className="flex flex-wrap gap-1.5">
                          <span className="rounded-lg bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-700 uppercase">
                            {discount.discount_type === "percentage"
                              ? `${discount.discount_value}% OFF`
                              : discount.discount_type === "flat"
                                ? `₹${discount.discount_value} OFF`
                                : "FREE DELIVERY"}
                          </span>
                          <span className="rounded-lg bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-600">
                            MIN: ₹{discount.min_order_value}
                          </span>
                          {discount.max_discount_cap > 0 && (
                            <span className="rounded-lg bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-600">
                              MAX: ₹{discount.max_discount_cap}
                            </span>
                          )}
                        </div>

                        <div className="text-[11px] font-medium text-slate-500 pt-2 border-t border-slate-100">
                          Expires: {formatDate(discount.valid_until)}
                        </div>

                        <div className="flex gap-2 pt-2">
                          <Button
                            variant="outline"
                            onClick={() => handleEdit(discount)}
                            className="flex-1 !h-8 !bg-indigo-50 !border-transparent !text-indigo-700 hover:!bg-indigo-100 !text-xs"
                          >
                            <Edit2 size={14} /> Edit
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() =>
                              discount.is_active ? setDeactivateTarget(discount) : handleQuickActivate(discount)
                            }
                            disabled={isToggling}
                            className={`flex-1 !h-8 !text-xs !border-transparent ${discount.is_active
                              ? "!bg-rose-50 !text-rose-700 hover:!bg-rose-100"
                              : "!bg-emerald-50 !text-emerald-700 hover:!bg-emerald-100"
                              }`}
                          >
                            {isToggling ? (
                              <Loader2 size={14} className="animate-spin" />
                            ) : discount.is_active ? (
                              <Trash2 size={14} />
                            ) : (
                              <Check size={14} />
                            )}
                            {discount.is_active ? "Deactivate" : "Activate"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {tab === "loyalty" && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <Card padding="p-5 sm:p-6" className="space-y-5 sticky top-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Stamp size={18} className="text-[#1A4D2E]" />
                  <Typography variant="h5" className="text-base">Stamp Program</Typography>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Typography variant="small" weight="bold" color="text-slate-700" className="text-xs">Enable stamp program</Typography>
                  <Typography variant="small" className="text-[10px] mt-0.5">
                    Orders above the minimum value earn the customer 1 stamp
                  </Typography>
                </div>
                <Toggle
                  checked={loyaltyForm.is_active}
                  onChange={(checked) => handleLoyaltyChange("is_active", checked)}
                />
              </div>

              <div className={`space-y-4 ${!loyaltyForm.is_active ? "opacity-40 pointer-events-none" : ""}`}>
                <Input
                  label={<span className="text-[10px] uppercase text-slate-500">Stamps needed for a reward</span>}
                  type="number"
                  min={1}
                  max={50}
                  value={loyaltyForm.target_stamps}
                  onChange={(e) => handleLoyaltyChange("target_stamps", Number(e.target.value) || 1)}
                  className="font-semibold"
                />
                <Typography variant="small" className="text-[10px] -mt-2">
                  Customer can claim the reward automatically after this many stamps.
                </Typography>

                <div>
                  <Typography variant="small" weight="bold" color="text-slate-500" className="mb-1.5 block text-[10px] uppercase">
                    Reward Type
                  </Typography>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { type: "FLAT_DISCOUNT", icon: IndianRupee, label: "₹ Off" },
                      { type: "PERCENTAGE", icon: Percent, label: "% Off" },
                      { type: "FREE_PRODUCT", icon: Gift, label: "Free Item" },
                    ].map((btn) => {
                      const Icon = btn.icon;
                      const active = loyaltyForm.reward_type === btn.type;
                      return (
                        <button
                          key={btn.type}
                          type="button"
                          onClick={() => handleLoyaltyChange("reward_type", btn.type)}
                          className={`flex flex-col items-center justify-center gap-1 rounded-xl border py-2.5 transition cursor-pointer ${active
                            ? "border-[#1A4D2E] bg-[#1A4D2E] text-white shadow-sm"
                            : "border-slate-200 text-slate-600 hover:bg-slate-50"
                            }`}
                        >
                          <Icon size={15} />
                          <span className="text-[10px] font-bold">{btn.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {loyaltyForm.reward_type === "FREE_PRODUCT" ? (
                  <div>
                    <Typography variant="small" weight="bold" color="text-slate-500" className="mb-1.5 block text-[10px] uppercase">
                      Select Free Products
                    </Typography>
                    <div className="mb-2">
                      <Input
                        type="text"
                        placeholder="Search products..."
                        value={productSearch}
                        onChange={(e) => setProductSearch(e.target.value)}
                        leftIcon={<Search size={14} />}
                        className="!py-2 !text-xs"
                      />
                    </div>

                    <div className="max-h-40 overflow-y-auto rounded-xl border border-slate-200 bg-white p-2 shadow-sm">
                      {menuProducts.length === 0 ? (
                        <Typography variant="small" className="text-[11px] p-2 text-center">Loading menu items...</Typography>
                      ) : filteredProducts.length === 0 ? (
                        <Typography variant="small" className="text-[11px] p-2 text-center">No products found.</Typography>
                      ) : (
                        filteredProducts.map(item => {
                          const isSelected = loyaltyForm.free_products?.includes(item._id);
                          const isUnavailable = item.is_available === false;

                          return (
                            <label
                              key={item._id}
                              className={`flex items-center gap-3 p-2 rounded-lg transition 
                                ${isUnavailable ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} 
                                ${isSelected && !isUnavailable ? "bg-emerald-50" : ""} 
                                ${!isSelected && !isUnavailable ? "hover:bg-slate-50" : ""}`
                              }
                            >
                              <input
                                type="checkbox"
                                checked={isSelected}
                                disabled={isUnavailable}
                                onChange={(e) => {
                                  if (isUnavailable) return;
                                  const checked = e.target.checked;
                                  const curr = loyaltyForm.free_products || [];
                                  handleLoyaltyChange(
                                    "free_products",
                                    checked ? [...curr, item._id] : curr.filter(id => id !== item._id)
                                  );
                                }}
                                className="h-4 w-4 rounded border-slate-300 text-[#1A4D2E] focus:ring-[#1A4D2E] disabled:opacity-50 disabled:cursor-not-allowed"
                              />
                              <div className="flex flex-col min-w-0">
                                <span className="text-xs font-semibold text-slate-800 truncate">
                                  {item.name} {isUnavailable && "(Unavailable)"}
                                </span>
                                <span className="text-[10px] font-bold text-[#1A4D2E]">₹{item.price}</span>
                              </div>
                            </label>
                          )
                        })
                      )}
                    </div>
                    <Typography variant="small" className="text-[10px] mt-1.5 leading-tight">
                      Customer can claim ANY ONE of these selected products for free.
                    </Typography>
                  </div>
                ) : (
                  <div>
                    <Input
                      label={<span className="text-[10px] uppercase text-slate-500">Reward Value</span>}
                      type="number"
                      min={0}
                      max={loyaltyForm.reward_type === "PERCENTAGE" ? 100 : undefined}
                      value={loyaltyForm.reward_value}
                      onChange={(e) => handleLoyaltyChange("reward_value", Number(e.target.value))}
                      leftIcon={<span className="text-xs font-bold text-slate-400">{loyaltyForm.reward_type === "PERCENTAGE" ? "%" : "₹"}</span>}
                      className="font-semibold"
                    />
                  </div>
                )}

                <Input
                  label={<span className="text-[10px] uppercase text-slate-500">Reward description (shown to customer)</span>}
                  type="text"
                  value={loyaltyForm.reward_description}
                  onChange={(e) => handleLoyaltyChange("reward_description", e.target.value)}
                  placeholder="e.g. Get a Free Burger!"
                  className="font-semibold"
                />

                <Input
                  label={<span className="text-[10px] uppercase text-slate-500">Min. order value to earn a stamp</span>}
                  type="number"
                  min={0}
                  value={loyaltyForm.min_order_value}
                  onChange={(e) => handleLoyaltyChange("min_order_value", Number(e.target.value))}
                  className="font-semibold"
                />
              </div>

              {loyaltyError && (
                <Typography variant="small" weight="bold" color="text-rose-600" className="flex items-center gap-1.5 text-xs">
                  <AlertTriangle size={13} /> {loyaltyError}
                </Typography>
              )}

              <Button
                variant="primary"
                onClick={handleSaveLoyalty}
                disabled={loyaltyLoading}
                className="w-full mt-2"
              >
                {loyaltyLoading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : loyaltySaved ? (
                  <>
                    <Check size={16} /> Saved
                  </>
                ) : (
                  "Save Stamp Settings"
                )}
              </Button>

              <Button
                variant="outline"
                onClick={() => setShowStampsDashboard(true)}
                className="w-full !justify-between !bg-emerald-50 !border-emerald-200 !text-[#1A4D2E] hover:!bg-emerald-100"
              >
                <span className="flex items-center gap-2">
                  View customer stamps
                  {loadingEngagement && <Loader2 size={12} className="animate-spin" />}
                </span>
                <ChevronRight size={15} />
              </Button>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card padding="p-5 sm:p-6" className="space-y-5">
              <div>
                <Typography variant="h5" className="text-base sm:text-lg">How the card looks</Typography>
                <Typography variant="small" className="text-xs mt-0.5">
                  A preview of a customer's stamp card, partway filled
                </Typography>
              </div>

              <StampCard
                total={loyaltyForm.target_stamps || 1}
                filled={Math.min(loyaltyForm.target_stamps, Math.ceil((loyaltyForm.target_stamps || 1) * 0.6))}
              />

              <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4 flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-[#1A4D2E]">
                  <Stamp size={18} />
                </div>
                <Typography variant="small" weight="medium" className="text-xs">
                  Once a customer collects{" "}
                  <Typography variant="span" weight="bold" color="text-[#1A4D2E]">{loyaltyForm.target_stamps || 0} stamps</Typography>{" "}
                  on orders above{" "}
                  <Typography variant="span" weight="bold" color="text-[#1A4D2E]">₹{loyaltyForm.min_order_value || 0}</Typography>,
                  they can claim:{" "}
                  <Typography variant="span" weight="bold" color="text-[#1A4D2E]">
                    {loyaltyForm.reward_description ||
                      (loyaltyForm.reward_type === "PERCENTAGE"
                        ? `${loyaltyForm.reward_value}% off`
                        : loyaltyForm.reward_type === "FREE_PRODUCT"
                          ? "1 Free Product"
                          : `₹${loyaltyForm.reward_value} off`)}
                  </Typography>
                </Typography>
              </div>

              <div className="rounded-2xl border border-dashed border-slate-200 p-4">
                <Typography variant="small" weight="bold" color="text-slate-500" className="text-[11px] uppercase mb-2 block">How it works</Typography>
                <ul className="space-y-1.5 text-xs text-slate-500 font-medium">
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-1 w-1 rounded-full bg-slate-400 shrink-0" />
                    Every order at or above the minimum value adds 1 stamp to the customer's card.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-1 w-1 rounded-full bg-slate-400 shrink-0" />
                    When the card is full, the customer can claim a discount coupon for their next order.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-1 w-1 rounded-full bg-slate-400 shrink-0" />
                    If you select "Free Item", the customer can claim one of the products you ticked.
                  </li>
                </ul>
              </div>
            </Card>
          </div>
        </div>
      )}

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
              Deactivate {deactivateTarget?.code}?
            </Typography>
            <Typography variant="small" className="text-xs mt-1.5">
              Customers won't be able to use this code anymore. You can't undo this from here.
            </Typography>
          </div>
          <div className="flex items-center justify-center gap-3 pt-2 w-full">
            <Button
              variant="outline"
              disabled={deactivating}
              onClick={() => setDeactivateTarget(null)}
              className="flex-1 !border-slate-200 hover:!bg-slate-50"
            >
              Keep It
            </Button>
            <Button
              variant="danger"
              disabled={deactivating}
              onClick={handleConfirmDeactivate}
              className="flex-1"
            >
              {deactivating ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
              Yes, Deactivate
            </Button>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
}