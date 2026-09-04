import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  KeyRound,
  Smartphone,
  Trash2,
  Save,
  Loader2,
  AlertTriangle,
  Check,
} from "lucide-react";

export default function SecurityCard({
  profile,
  loading: parentLoading,
  onSave,
  onChangePin,
  onDeactivate,
  onLogout,
}) {
  const [pinData, setPinData] = useState({
    current_pin: "",
    new_pin: "",
    confirm_pin: "",
  });

  const [securityToggles, setSecurityToggles] = useState({
    two_factor_auth: profile?.security?.two_factor_auth ?? false,
    login_alerts: profile?.security?.login_alerts ?? false,
  });

  const [savingToggles, setSavingToggles] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [changingPin, setChangingPin] = useState(false);
  const [deactivating, setDeactivating] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [errorMsg, setErrorMsg] = useState("");
  const [pinSuccessMsg, setPinSuccessMsg] = useState("");

  const handlePinChange = (e) => {
    const { name, value } = e.target;
    setPinData((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggleChange = (e) => {
    const { name, checked } = e.target;
    setSecurityToggles((prev) => ({ ...prev, [name]: checked }));
  };

  const handlePinSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setPinSuccessMsg("");

    if (!pinData.current_pin || !pinData.new_pin || !pinData.confirm_pin) {
      setErrorMsg("Current PIN, New PIN, and Confirm PIN are required.");
      return;
    }
    if (pinData.new_pin !== pinData.confirm_pin) {
      setErrorMsg("New PIN and Confirm PIN do not match.");
      return;
    }
    if (typeof onChangePin !== "function") return;

    try {
      setChangingPin(true);
      await onChangePin(pinData.current_pin, pinData.new_pin, pinData.confirm_pin);
      setPinSuccessMsg("PIN changed successfully!");
      setPinData({ current_pin: "", new_pin: "", confirm_pin: "" });

      setTimeout(() => {
        setPinSuccessMsg("");
      }, 3000);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Failed to change PIN.");
    } finally {
      setChangingPin(false);
    }
  };

  const handleToggleSubmit = async (e) => {
    e?.preventDefault();
    setErrorMsg("");
    setShowSuccess(false);
    if (typeof onSave !== "function") return;

    try {
      setSavingToggles(true);
      await onSave(securityToggles);

      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Failed to update security settings.");
    } finally {
      setSavingToggles(false);
    }
  };

  const handleDeleteStore = async () => {
    if (typeof onDeactivate !== "function") return;
    try {
      setDeactivating(true);
      await onDeactivate();
      setShowDeleteModal(false);
      if (typeof onLogout === "function") {
        onLogout();
      } else {
        window.location.href = "/login";
      }
    } catch (err) {
      console.error("Failed to delete store:", err);
      setErrorMsg("An error occurred while deleting the store. Please try again.");
    } finally {
      setDeactivating(false);
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="rounded-3xl border border-slate-100 bg-white shadow-sm overflow-hidden"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 px-6 py-5 bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-700 shrink-0">
            <ShieldCheck size={22} />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              Security & Access
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Protect your store and manage account access.
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
            onClick={handleToggleSubmit}
            disabled={savingToggles || parentLoading}
            className="flex items-center gap-2 rounded-xl bg-amber-400 px-5 py-2.5 text-xs sm:text-sm font-bold text-emerald-950 shadow-sm transition hover:bg-amber-500 disabled:opacity-70 cursor-pointer"
          >
            {savingToggles ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Save size={16} /> <span className="hidden sm:inline">Save Security Settings</span><span className="sm:hidden">Save</span>
              </>
            )}
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-600 font-bold">
          {errorMsg}
        </div>
      )}

      {pinSuccessMsg && (
        <div className="mx-6 mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-700 font-bold">
          {pinSuccessMsg}
        </div>
      )}

      {/* PIN Change Section */}
      <form onSubmit={handlePinSubmit} className="border-b border-slate-100 p-6 space-y-4">
        <h3 className="text-sm sm:text-base font-bold text-slate-900">
          Change PIN
        </h3>

        <div className="grid gap-4 md:grid-cols-3">
          <input
            type="password"
            name="current_pin"
            value={pinData.current_pin}
            onChange={handlePinChange}
            placeholder="Current PIN"
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs sm:text-sm font-semibold text-slate-800 outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10 shadow-xs"
          />
          <input
            type="password"
            name="new_pin"
            value={pinData.new_pin}
            onChange={handlePinChange}
            placeholder="New PIN"
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs sm:text-sm font-semibold text-slate-800 outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10 shadow-xs"
          />
          <input
            type="password"
            name="confirm_pin"
            value={pinData.confirm_pin}
            onChange={handlePinChange}
            placeholder="Confirm New PIN"
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs sm:text-sm font-semibold text-slate-800 outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10 shadow-xs"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={changingPin}
            className="flex items-center gap-2 rounded-xl bg-amber-400 px-6 py-3 text-xs sm:text-sm font-bold text-emerald-950 shadow-sm transition hover:bg-amber-500 disabled:opacity-70 cursor-pointer"
          >
            {changingPin ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Changing...
              </>
            ) : (
              <>
                <KeyRound size={16} /> Change PIN
              </>
            )}
          </button>
        </div>
      </form>

      {/* Security Toggles */}
      <div className="p-6 space-y-3">
        <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-4">
          Security Options
        </h3>

        {/* Two-Factor Authentication - Coming Soon */}
        <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/50 p-4 opacity-75 cursor-not-allowed">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-slate-200 p-2.5 text-slate-500">
              <KeyRound size={20} />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-800">
                Two-Factor Authentication
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Require OTP verification during sensitive logins.
              </p>
            </div>
          </div>

          <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-bold text-amber-800 uppercase tracking-wider shrink-0 shadow-sm">
            Coming Soon
          </span>
        </div>

        {/* Login Alerts - Coming Soon */}
        <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/50 p-4 opacity-75 cursor-not-allowed">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-slate-200 p-2.5 text-slate-500">
              <Smartphone size={20} />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-800">
                Login Alerts
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Receive notifications on every new device login.
              </p>
            </div>
          </div>

          <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-bold text-amber-800 uppercase tracking-wider shrink-0 shadow-sm">
            Coming Soon
          </span>
        </div>
      </div>

      {/* Actions Footer */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 px-6 py-5">
        <button
          type="button"
          onClick={() => setShowDeleteModal(true)}
          className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-5 py-3 text-xs sm:text-sm font-bold text-rose-600 transition hover:bg-rose-100 cursor-pointer"
        >
          <Trash2 size={16} /> Delete Store Account
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="rounded-2xl bg-rose-50 p-3">
                <AlertTriangle size={24} />
              </div>
              <h3 className="text-base font-bold text-slate-900">Deactivate / Delete Store?</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to deactivate your store account? This action will pause all online orders and close store access immediately.
            </p>
            <div className="flex justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deactivating}
                onClick={handleDeleteStore}
                className="flex items-center gap-2 rounded-xl bg-rose-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-rose-700 disabled:opacity-70 cursor-pointer"
              >
                {deactivating ? <Loader2 size={14} className="animate-spin" /> : null}
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.section>
  );
}