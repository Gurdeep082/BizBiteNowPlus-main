import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock3, Save, Loader2, Check } from "lucide-react";

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const defaultSchedule = days.reduce((acc, day) => {
  acc[day.toLowerCase()] = { open: "09:00", close: "22:00", closed: false };
  return acc;
}, {});

export default function BusinessHoursCard({ profile, loading: parentLoading, onSave }) {
  const [schedule, setSchedule] = useState(defaultSchedule);
  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (profile?.business_hours) {
      const savedHours = profile.business_hours;
      const updated = {};
      days.forEach((day) => {
        const key = day.toLowerCase();
        const isClosedStatus =
          savedHours[key]?.is_closed ??
          savedHours[key]?.closed ??
          savedHours[day]?.is_closed ??
          savedHours[day]?.closed ??
          false;

        updated[key] = {
          open: savedHours[key]?.open || savedHours[day]?.open || "09:00",
          close: savedHours[key]?.close || savedHours[day]?.close || "22:00",
          closed: isClosedStatus,
        };
      });
      setSchedule(updated);
    }
  }, [profile]);

  const handleTimeChange = (day, field, value) => {
    const key = day.toLowerCase();
    setSchedule((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        [field]: value,
      },
    }));
  };

  const handleToggleClosed = (day) => {
    const key = day.toLowerCase();
    setSchedule((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        closed: !prev[key].closed,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (typeof onSave !== "function") return;

    try {
      setSaving(true);
      setShowSuccess(false);
      await onSave(schedule);

      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    } catch (err) {
      console.error("Failed to save business hours:", err);
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
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 px-6 py-5 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-700 shrink-0">
              <Clock3 size={22} />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Business Hours
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Configure your weekly opening schedule.
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
                  <Save size={16} /> <span className="hidden sm:inline">Save Business Hours</span><span className="sm:hidden">Save</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="space-y-3 p-6">
          {days.map((day) => {
            const key = day.toLowerCase();
            const dayData = schedule[key] || { open: "09:00", close: "22:00", closed: false };

            return (
              <div
                key={day}
                className={`grid items-center gap-4 rounded-2xl border p-4 lg:grid-cols-4 transition-colors ${dayData.closed
                    ? "border-rose-100 bg-rose-50/30"
                    : "border-slate-100 bg-slate-50/50"
                  }`}
              >
                <h4
                  className={`text-xs sm:text-sm font-bold ${dayData.closed ? "text-rose-700" : "text-slate-800"
                    }`}
                >
                  {day}
                </h4>

                <input
                  type="time"
                  disabled={dayData.closed}
                  value={dayData.open}
                  onChange={(e) => handleTimeChange(day, "open", e.target.value)}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-800 outline-none transition focus:border-emerald-600 disabled:opacity-50 shadow-xs"
                />

                <input
                  type="time"
                  disabled={dayData.closed}
                  value={dayData.close}
                  onChange={(e) => handleTimeChange(day, "close", e.target.value)}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-800 outline-none transition focus:border-emerald-600 disabled:opacity-50 shadow-xs"
                />

                <label className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-700 cursor-pointer w-fit lg:justify-self-end">
                  <input
                    type="checkbox"
                    checked={dayData.closed}
                    onChange={() => handleToggleClosed(day)}
                    className="h-4 w-4 rounded border-slate-300 text-emerald-700 focus:ring-emerald-600 accent-emerald-700 cursor-pointer"
                  />
                  Closed
                </label>
              </div>
            );
          })}
        </div>
      </form>
    </motion.div>
  );
}