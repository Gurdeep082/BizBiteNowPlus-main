import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CreditCard,
  Smartphone,
  Save,
  Banknote,
  Loader2,
  Lock,
  Check,
  IndianRupee,
  Plus,
  Trash2,
} from "lucide-react";

export default function PaymentSettingsCard({ profile, loading: parentLoading, onSave, onSaveDelivery }) {
  const [isPlusUser, setIsPlusUser] = useState(false);

  useEffect(() => {
    const tier = profile?.tier || profile?.seller_tier;
    if (tier) {
      const t = tier.toUpperCase();
      setIsPlusUser(t === "PLUS" || t === "PRO" || t === "FREE");
    }
  }, [profile]);

  const [acceptedMethods, setAcceptedMethods] = useState({
    cod: true,
    upi: true,
    cards: false,
    wallets: false,
  });

  const [additionalCharges, setAdditionalCharges] = useState([]);
  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (profile?.payment_settings) {
      const ps = profile.payment_settings;
      const methods = ps.accepted_methods || {};
      setAcceptedMethods({
        cod: methods.cod ?? true,
        upi: methods.upi ?? true,
        cards: methods.cards ?? false,
        wallets: methods.wallets ?? false,
      });
    }

    if (profile?.delivery_settings) {
      const ds = profile.delivery_settings;
      setAdditionalCharges(
        Array.isArray(ds.additional_charges)
          ? ds.additional_charges.map((c) => ({
            label: c.label ?? "",
            value: c.value ?? "",
          }))
          : []
      );
    }
  }, [profile]);

  const handleCheckboxChange = (key) => {
    if (key === "upi" && !isPlusUser) return;
    setAcceptedMethods((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleChargeChange = (index, field, value) => {
    setAdditionalCharges((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const addCharge = () => {
    setAdditionalCharges((prev) => [...prev, { label: "", value: "" }]);
  };

  const removeCharge = (index) => {
    setAdditionalCharges((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (typeof onSave !== "function") return;

    try {
      setSaving(true);
      setShowSuccess(false);

      const payloadCharges = additionalCharges
        .filter((c) => c.label?.trim() && c.value !== "")
        .map((c) => ({ label: c.label.trim(), value: Number(c.value) || 0 }));

      // 1. Save payment methods to payment_settings
      await onSave({
        accepted_methods: acceptedMethods,
      });

      // 2. Sneakily save additional charges back to delivery_settings
      if (typeof onSaveDelivery === "function") {
        const currentDeliverySettings = profile?.delivery_settings || {};
        await onSaveDelivery({
          ...currentDeliverySettings,
          additional_charges: payloadCharges,
        });
      }

      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);

    } catch (err) {
      console.error("Failed to save payment settings:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="rounded-3xl border border-slate-100 bg-white shadow-sm overflow-hidden"
    >
      <form onSubmit={handleFormSubmit}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 px-6 py-5 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-700 shrink-0">
              <CreditCard size={22} />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Payment Settings
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Configure customer payment methods and extra charges.
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
                  <Save size={16} /> <span className="hidden sm:inline">Save Payment Settings</span><span className="sm:hidden">Save</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="space-y-6 p-6">
          <div>
            <h3 className="mb-4 text-sm sm:text-base font-bold text-slate-900">
              Accepted Payment Methods
            </h3>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/50 p-4 cursor-pointer hover:bg-slate-50 transition">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-700">
                    <Banknote size={20} />
                  </div>
                  <div>
                    <span className="text-xs sm:text-sm font-bold text-slate-800 block">
                      Cash On Delivery
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Standard offline cash payment
                    </span>
                  </div>
                </div>

                <input
                  type="checkbox"
                  checked={acceptedMethods.cod}
                  onChange={() => handleCheckboxChange("cod")}
                  className="h-5 w-5 rounded border-slate-300 text-emerald-700 focus:ring-emerald-600 accent-emerald-700 cursor-pointer"
                />
              </label>

              <label
                className={`flex items-center justify-between rounded-2xl border p-4 transition ${isPlusUser
                  ? "border-slate-100 bg-slate-50/50 cursor-pointer hover:bg-slate-50"
                  : "border-amber-200 bg-amber-50/30 opacity-80"
                  }`}
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-700">
                    <Smartphone size={20} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs sm:text-sm font-bold text-slate-800">
                        Razorpay Gateway
                      </span>
                      {!isPlusUser && (
                        <span className="flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                          <Lock size={10} /> PRO Tier
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-500">
                      Online instant customer payments
                    </span>
                  </div>
                </div>

                <input
                  type="checkbox"
                  disabled={!isPlusUser}
                  checked={isPlusUser && acceptedMethods.upi}
                  onChange={() => handleCheckboxChange("upi")}
                  className="h-5 w-5 rounded border-slate-300 text-emerald-700 focus:ring-emerald-600 accent-emerald-700 disabled:opacity-40 cursor-pointer"
                />
              </label>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase">
                <IndianRupee size={16} className="text-slate-400" />
                Additional Charges
              </span>
              <button
                type="button"
                onClick={addCharge}
                className="flex items-center gap-1 rounded-lg bg-emerald-700 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-emerald-800 cursor-pointer"
              >
                <Plus size={14} /> Add Charge
              </button>
            </div>

            {additionalCharges.length === 0 && (
              <p className="text-xs text-slate-400">
                No additional charges added. e.g. Convenience Fee, Packaging Fee.
              </p>
            )}

            <div className="flex flex-col gap-2">
              {additionalCharges.map((charge, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={charge.label}
                    onChange={(e) => handleChargeChange(index, "label", e.target.value)}
                    placeholder="Convenience Fee"
                    className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-800 outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10 shadow-xs"
                  />
                  <input
                    type="number"
                    value={charge.value}
                    onChange={(e) => handleChargeChange(index, "value", e.target.value)}
                    placeholder="8"
                    className="w-24 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-800 outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10 shadow-xs"
                  />
                  <button
                    type="button"
                    onClick={() => removeCharge(index)}
                    className="shrink-0 rounded-xl border border-red-100 bg-red-50 p-2.5 text-red-600 transition hover:bg-red-100 cursor-pointer"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>
      </form>
    </motion.section>
  );
}