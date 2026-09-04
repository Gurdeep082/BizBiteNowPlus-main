import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, Award, Loader2 } from "lucide-react";

export default function LoyaltySettingsCard({ profile, loading, onSave }) {
  const [targetStamps, setTargetStamps] = useState(5);
  const [rewardValue, setRewardValue] = useState(100);
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile?.loyalty_settings) {
      setTargetStamps(profile.loyalty_settings.target_stamps || 5);
      setRewardValue(profile.loyalty_settings.reward_value || 100);
      setIsActive(profile.loyalty_settings.is_active ?? true);
    }
  }, [profile]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (typeof onSave !== "function") return;

    setSaving(true);
    try {
      await onSave({
        loyalty_settings: {
          target_stamps: Number(targetStamps),
          reward_value: Number(rewardValue),
          is_active: isActive,
        },
      });
    } catch (err) {
      console.error("Failed to save loyalty settings:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-6 sm:p-8 shadow-sm space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-emerald-50 p-2.5 text-emerald-700">
            <Sparkles size={20} />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">Customer Loyalty Program</h3>
            <p className="text-xs text-slate-500 mt-0.5">Manage stamp rewards and customer retention incentives.</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsActive(!isActive)}
          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${
            isActive ? "bg-emerald-600" : "bg-slate-300"
          }`}
        >
          <span
            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition duration-200 ${
              isActive ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
              Target Stamps Required
            </label>
            <input
              type="number"
              min="1"
              max="20"
              value={targetStamps}
              onChange={(e) => setTargetStamps(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs sm:text-sm font-medium focus:border-emerald-600 focus:outline-none"
            />
            <p className="text-[11px] text-slate-400 mt-1">Stamps needed for customer to unlock a free reward.</p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
              Reward Value (₹ / Discount)
            </label>
            <input
              type="number"
              min="0"
              value={rewardValue}
              onChange={(e) => setRewardValue(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs sm:text-sm font-medium focus:border-emerald-600 focus:outline-none"
            />
            <p className="text-[11px] text-slate-400 mt-1">Approximate value of the unlocked reward coupon.</p>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving || loading}
            className="flex items-center gap-2 rounded-xl bg-emerald-700 px-5 py-2.5 text-xs font-bold text-white hover:bg-emerald-800 disabled:opacity-60 cursor-pointer transition shadow-xs"
          >
            {saving ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Saving...
              </>
            ) : (
              "Save Loyalty Settings"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}