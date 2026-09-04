import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Building2, Save, Loader2, Check } from "lucide-react";

export default function BusinessInformationCard({ profile, loading: parentLoading, onSave }) {
  const [formData, setFormData] = useState({
    business_name: "",
    business_type: "Restaurant",
    cuisine_categories: "",
    fssai_license: "",
    pan_number: "",
    business_registration_number: "",
  });

  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (profile?.business_info) {
      setFormData({
        business_name: profile.business_info.business_name || profile.store_profile?.store_name || "",
        business_type: profile.business_info.business_type || "Restaurant",
        cuisine_categories: profile.business_info.cuisine_categories || "",
        fssai_license: profile.business_info.fssai_license || "",
        pan_number: profile.business_info.pan_number || "",
        business_registration_number: profile.business_info.business_registration_number || "",
      });
    }
  }, [profile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
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
      console.error("Failed to save business info:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="rounded-3xl border border-slate-100 bg-white shadow-sm overflow-hidden"
    >
      <form onSubmit={handleFormSubmit}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 px-6 py-5 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-700 shrink-0">
              <Building2 size={22} />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Business Information
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Legal and restaurant business details.
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
                  <Save size={16} /> <span className="hidden sm:inline">Save Business Info</span><span className="sm:hidden">Save</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="grid gap-5 p-6 md:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-bold text-slate-700 uppercase">
              Business Name
            </label>
            <input
              type="text"
              name="business_name"
              value={formData.business_name}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs sm:text-sm font-semibold text-slate-800 outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10 shadow-xs"
              placeholder="BizBite Restaurant"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold text-slate-700 uppercase">
              Business Type
            </label>
            <select
              name="business_type"
              value={formData.business_type}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs sm:text-sm font-semibold text-slate-800 outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10 shadow-xs"
            >
              <option value="Restaurant">Restaurant</option>
              <option value="Cafe">Cafe</option>
              <option value="Cloud Kitchen">Cloud Kitchen</option>
              <option value="Bakery">Bakery</option>
              <option value="Food Truck">Food Truck</option>
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold text-slate-700 uppercase">
              Cuisine Category
            </label>
            <input
              type="text"
              name="cuisine_categories"
              value={formData.cuisine_categories}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs sm:text-sm font-semibold text-slate-800 outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10 shadow-xs"
              placeholder="North Indian, Chinese"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold text-slate-700 uppercase">
              FSSAI License
            </label>
            <input
              type="text"
              name="fssai_license"
              value={formData.fssai_license}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs sm:text-sm font-semibold text-slate-800 outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10 shadow-xs"
              placeholder="12345678901234"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold text-slate-700 uppercase">
              PAN Number
            </label>
            <input
              type="text"
              name="pan_number"
              value={formData.pan_number}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs sm:text-sm font-semibold text-slate-800 outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10 shadow-xs uppercase"
              placeholder="ABCDE1234F"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold text-slate-700 uppercase">
              Business Registration Number
            </label>
            <input
              type="text"
              name="business_registration_number"
              value={formData.business_registration_number}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs sm:text-sm font-semibold text-slate-800 outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10 shadow-xs uppercase"
              placeholder="Enter registration number"
            />
          </div>
        </div>
      </form>
    </motion.div>
  );
}