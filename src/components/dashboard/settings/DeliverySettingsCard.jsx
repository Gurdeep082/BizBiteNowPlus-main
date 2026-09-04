import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bike,
  Save,
  Clock3,
  IndianRupee,
  MapPinned,
  Loader2,
  Check,
} from "lucide-react";

export default function DeliverySettingsCard({ profile, loading: parentLoading, onSave }) {
  const [formData, setFormData] = useState({
    enable_home_delivery: true,
    enable_pickup: true,
    delivery_radius_km: "",
    grace_radius_km: "",
    delivery_charge: "",
    min_order_value: "",
    free_delivery_above: "",
    estimated_delivery_time: "",
  });

  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (profile?.delivery_settings) {
      const ds = profile.delivery_settings;
      setFormData({
        enable_home_delivery: ds.enable_home_delivery ?? true,
        enable_pickup: ds.enable_pickup ?? true,
        delivery_radius_km: ds.delivery_radius_km ?? "",
        grace_radius_km: ds.grace_radius_km ?? "",
        delivery_charge: ds.delivery_charge ?? "",
        min_order_value: ds.min_order_value ?? "",
        free_delivery_above: ds.free_delivery_above ?? "",
        estimated_delivery_time: ds.estimated_delivery_time || "",
      });
    }
  }, [profile]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (typeof onSave !== "function") return;

    try {
      setSaving(true);
      setShowSuccess(false);

      await onSave(formData);

      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    } catch (err) {
      console.error("Failed to save delivery settings:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-3xl border border-slate-100 bg-white shadow-sm overflow-hidden"
    >
      <form onSubmit={handleFormSubmit}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 px-6 py-5 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-700 shrink-0">
              <Bike size={22} />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Delivery Settings
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Configure delivery options for your customers.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto">
            <AnimatePresence>
              {showSuccess && (
                <motion.span
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-emerald-600"
                >
                  <Check size={16} /> Saved
                </motion.span>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={saving || parentLoading}
              className="flex items-center gap-2 rounded-xl bg-amber-400 px-5 py-2.5 text-xs sm:text-sm font-bold text-emerald-950 shadow-sm transition hover:bg-amber-500 disabled:opacity-70 cursor-pointer"
            >
              {saving ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <Save size={16} /> <span className="hidden sm:inline">Save Delivery Settings</span><span className="sm:hidden">Save</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="grid gap-5 p-6 md:grid-cols-2">
          <label className="md:col-span-2 flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/50 p-4">
            <span className="text-xs sm:text-sm font-bold text-slate-800">
              Enable Home Delivery
            </span>

            <input
              type="checkbox"
              name="enable_home_delivery"
              checked={formData.enable_home_delivery}
              onChange={handleChange}
              className="h-5 w-5 rounded border-slate-300 text-emerald-700 focus:ring-emerald-600 accent-emerald-700 cursor-pointer"
            />
          </label>

          <label className="md:col-span-2 flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/50 p-4">
            <span className="text-xs sm:text-sm font-bold text-slate-800">
              Enable Pickup
            </span>

            <input
              type="checkbox"
              name="enable_pickup"
              checked={formData.enable_pickup}
              onChange={handleChange}
              className="h-5 w-5 rounded border-slate-300 text-emerald-700 focus:ring-emerald-600 accent-emerald-700 cursor-pointer"
            />
          </label>

          <div>
            <label className="mb-1.5 flex items-center gap-2 text-xs font-bold text-slate-700 uppercase">
              <MapPinned size={16} className="text-slate-400" />
              Delivery Radius (KM)
            </label>
            <input
              type="number"
              name="delivery_radius_km"
              value={formData.delivery_radius_km}
              onChange={handleChange}
              placeholder="10"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs sm:text-sm font-semibold text-slate-800 outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10 shadow-xs"
            />
          </div>

          <div>
            <label className="mb-1.5 flex items-center gap-2 text-xs font-bold text-slate-700 uppercase">
              <MapPinned size={16} className="text-slate-400" />
              Grace Radius (KM)
            </label>
            <input
              type="number"
              name="grace_radius_km"
              value={formData.grace_radius_km}
              onChange={handleChange}
              placeholder="15"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs sm:text-sm font-semibold text-slate-800 outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10 shadow-xs"
            />
          </div>

          <div>
            <label className="mb-1.5 flex items-center gap-2 text-xs font-bold text-slate-700 uppercase">
              <IndianRupee size={16} className="text-slate-400" />
              Delivery Charge
            </label>
            <input
              type="number"
              name="delivery_charge"
              value={formData.delivery_charge}
              onChange={handleChange}
              placeholder="40"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs sm:text-sm font-semibold text-slate-800 outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10 shadow-xs"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold text-slate-700 uppercase">
              Minimum Order Value
            </label>
            <input
              type="number"
              name="min_order_value"
              value={formData.min_order_value}
              onChange={handleChange}
              placeholder="199"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs sm:text-sm font-semibold text-slate-800 outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10 shadow-xs"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold text-slate-700 uppercase">
              Free Delivery Above
            </label>
            <input
              type="number"
              name="free_delivery_above"
              value={formData.free_delivery_above}
              onChange={handleChange}
              placeholder="499"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs sm:text-sm font-semibold text-slate-800 outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10 shadow-xs"
            />
          </div>

          <div>
            <label className="mb-1.5 flex items-center gap-2 text-xs font-bold text-slate-700 uppercase">
              <Clock3 size={16} className="text-slate-400" />
              Estimated Delivery Time
            </label>
            <input
              type="text"
              name="estimated_delivery_time"
              value={formData.estimated_delivery_time}
              onChange={handleChange}
              placeholder="30 - 45 Minutes"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs sm:text-sm font-semibold text-slate-800 outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10 shadow-xs"
            />
          </div>
        </div>
      </form>
    </motion.section>
  );
}