import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  Mail,
  Smartphone,
  Package,
  ShoppingBag,
  Wallet,
  AlertTriangle,
  Save,
  Loader2,
  Check,
} from "lucide-react";

const notificationSettingsConfig = [
  {
    key: "new_orders",
    title: "New Orders",
    description: "Receive notifications for every new order.",
    icon: ShoppingBag,
  },
  {
    key: "payment_updates",
    title: "Payment Updates",
    description: "Notify when payments are received or refunded.",
    icon: Wallet,
  },
  {
    key: "system_alerts",
    title: "System Alerts",
    description: "Maintenance, outages and important announcements.",
    icon: AlertTriangle,
  },
];

const deliveryChannelsConfig = [
  {
    key: "push",
    title: "Push Notifications",
    description: "Receive alerts directly on your device.",
    icon: Bell
  },
];

export default function NotificationsCard({ profile, loading: parentLoading, onSave }) {
  const [events, setEvents] = useState({
    new_orders: true,
    payment_updates: true,
    system_alerts: true,
  });

  const [channels, setChannels] = useState({
    email: true,
    sms: false,
    push: true,
  });

  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (profile?.notifications) {
      const n = profile.notifications;
      if (n.events) {
        setEvents((prev) => ({ ...prev, ...n.events }));
      }
      if (n.channels) {
        setChannels((prev) => ({ ...prev, ...n.channels }));
      }
    }
  }, [profile]);

  const toggleEvent = (key) => {
    setEvents((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleChannel = (key) => {
    setChannels((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (typeof onSave !== "function") return;

    try {
      setSaving(true);
      setShowSuccess(false);

      await onSave({ events, channels });

      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    } catch (err) {
      console.error("Failed to save notification settings:", err);
    } finally {
      setSaving(false);
    }
  };

  const ToggleSwitch = ({ checked, onChange }) => (
    <div
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 ease-in-out ${checked ? "bg-emerald-600" : "bg-slate-200"
        }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition duration-200 ease-in-out ${checked ? "translate-x-6" : "translate-x-1"
          }`}
      />
    </div>
  );

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
              <Bell size={22} />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Notification Preferences
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Choose how you want to receive important updates.
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
                  <Save size={16} /> <span className="hidden sm:inline">Save Preferences</span><span className="sm:hidden">Save</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="space-y-3 p-6">
          {notificationSettingsConfig.map((item) => {
            const IconComponent = item.icon;
            const isChecked = !!events[item.key];

            return (
              <div
                key={item.key}
                onClick={() => toggleEvent(item.key)}
                className={`flex items-center justify-between rounded-2xl border p-4 cursor-pointer transition ${isChecked
                    ? "border-emerald-100 bg-emerald-50/30"
                    : "border-slate-100 bg-slate-50/50 hover:bg-slate-50"
                  }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`rounded-xl p-2.5 transition ${isChecked
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-slate-100 text-slate-500"
                      }`}
                  >
                    <IconComponent size={20} />
                  </div>

                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-800">
                      {item.title}
                    </h4>
                    <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
                      {item.description}
                    </p>
                  </div>
                </div>

                <ToggleSwitch checked={isChecked} onChange={() => { }} />
              </div>
            );
          })}
        </div>

        <div className="border-t border-slate-100 p-6">
          <h3 className="mb-4 text-sm sm:text-base font-bold text-slate-900">
            Delivery Channels
          </h3>

          <div className="space-y-3">
            {deliveryChannelsConfig.map((item) => {
              const IconComponent = item.icon;
              const isChecked = !!channels[item.key];

              return (
                <div
                  key={item.key}
                  onClick={() => toggleChannel(item.key)}
                  className={`flex items-center justify-between rounded-2xl border p-4 cursor-pointer transition ${isChecked
                      ? "border-emerald-100 bg-emerald-50/30"
                      : "border-slate-100 bg-slate-50/50 hover:bg-slate-50"
                    }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`rounded-xl p-2.5 transition ${isChecked
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-slate-100 text-slate-500"
                        }`}
                    >
                      <IconComponent size={20} />
                    </div>

                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-800">
                        {item.title}
                      </h4>
                      {item.description && (
                        <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <ToggleSwitch checked={isChecked} onChange={() => { }} />
                </div>
              );
            })}
          </div>
        </div>
      </form>
    </motion.section>
  );
}