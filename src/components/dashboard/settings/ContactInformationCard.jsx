import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Phone,
  Mail,
  Globe,
  MapPin,
  MessageCircle,
  Save,
  Loader2,
  Check,
} from "lucide-react";

export default function ContactInformationCard({ profile, loading: parentLoading, onSave }) {
  const [formData, setFormData] = useState({
    business_email: "",
    primary_phone: "",
    alternate_phone: "",
    website: "",
    whatsapp_business: "",
    google_maps_url: "",
    address: "",
    city: "",
    state: "",
  });

  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (profile?.contact_info) {
      const ci = profile.contact_info;
      setFormData({
        business_email: ci.business_email || "",
        primary_phone: ci.primary_phone || "",
        alternate_phone: ci.alternate_phone || "",
        website: ci.website || "",
        whatsapp_business: ci.whatsapp_business || "",
        google_maps_url: ci.google_maps_url || "",
        address: ci.address || "",
        city: ci.city || "",
        state: ci.state || "",
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
      console.error("Failed to save contact information:", err);
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
        {/* Header with integrated save button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 px-6 py-5 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-700 shrink-0">
              <Phone size={22} />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Contact Information
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Manage how customers reach your business.
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
                  <Save size={16} /> <span className="hidden sm:inline">Save Contact Info</span><span className="sm:hidden">Save</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Form Body */}
        <div className="grid gap-5 p-6 md:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-bold text-slate-700 uppercase">
              Business Email
            </label>
            <div className="relative">
              <Mail
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="email"
                name="business_email"
                value={formData.business_email}
                onChange={handleChange}
                placeholder="restaurant@email.com"
                className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-xs sm:text-sm font-semibold text-slate-800 outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10 shadow-xs"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold text-slate-700 uppercase">
              Primary Phone
            </label>
            <div className="relative">
              <Phone
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="tel"
                name="primary_phone"
                value={formData.primary_phone}
                onChange={handleChange}
                placeholder="+91 9876543210"
                className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-xs sm:text-sm font-semibold text-slate-800 outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10 shadow-xs"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold text-slate-700 uppercase">
              Alternate Phone
            </label>
            <div className="relative">
              <Phone
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="tel"
                name="alternate_phone"
                value={formData.alternate_phone}
                onChange={handleChange}
                placeholder="+91 9876543210"
                className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-xs sm:text-sm font-semibold text-slate-800 outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10 shadow-xs"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold text-slate-700 uppercase">
              Website
            </label>
            <div className="relative">
              <Globe
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleChange}
                placeholder="https://"
                className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-xs sm:text-sm font-semibold text-slate-800 outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10 shadow-xs"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold text-slate-700 uppercase">
              WhatsApp Business
            </label>
            <div className="relative">
              <MessageCircle
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="tel"
                name="whatsapp_business"
                value={formData.whatsapp_business}
                onChange={handleChange}
                placeholder="+91 9876543210"
                className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-xs sm:text-sm font-semibold text-slate-800 outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10 shadow-xs"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold text-slate-700 uppercase">
              Google Maps URL
            </label>
            <div className="relative">
              <MapPin
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="url"
                name="google_maps_url"
                value={formData.google_maps_url}
                onChange={handleChange}
                placeholder="Paste Google Maps link"
                className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-xs sm:text-sm font-semibold text-slate-800 outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10 shadow-xs"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold text-slate-700 uppercase">
              Address
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="123 MG Road"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs sm:text-sm font-semibold text-slate-800 outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10 shadow-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="mb-1.5 block text-xs font-bold text-slate-700 uppercase">
                City
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Delhi"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs sm:text-sm font-semibold text-slate-800 outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10 shadow-xs"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold text-slate-700 uppercase">
                State
              </label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="Delhi"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs sm:text-sm font-semibold text-slate-800 outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10 shadow-xs"
              />
            </div>
          </div>
        </div>
      </form>
    </motion.div>
  );
}