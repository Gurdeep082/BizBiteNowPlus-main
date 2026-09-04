import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { UtensilsCrossed, IndianRupee, Save, Loader2 } from "lucide-react";

export default function DineInSettingsCard({ profile, loading, onSave }) {
    const [enableDineIn, setEnableDineIn] = useState(true);
    const [bookingAmount, setBookingAmount] = useState("");

    // Sync state with profile data when it loads
    useEffect(() => {
        if (profile) {
            setEnableDineIn(profile.enable_dineIn ?? true);
            setBookingAmount(profile.booking_settings?.booking_amount ?? 0);
        }
    }, [profile]);

    const handleSave = () => {
        onSave({
            enable_dineIn: enableDineIn,
            booking_settings: {
                ...profile?.booking_settings,
                booking_amount: Number(bookingAmount),
            },
        });
    };

    return (
        <div className="w-full rounded-[24px] border border-slate-100 bg-white p-5 sm:p-8 shadow-sm">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                        <UtensilsCrossed size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-slate-900 tracking-tight">
                            Dine-In & Reservations
                        </h2>
                        <p className="text-xs sm:text-sm font-medium text-slate-500 mt-0.5">
                            Manage your dine-in availability and table booking charges.
                        </p>
                    </div>
                </div>

                <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSave}
                    disabled={loading}
                    className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-[#FFC107] hover:bg-[#FFB300] px-5 py-2.5 text-sm font-bold text-slate-900 transition shadow-sm disabled:opacity-60 cursor-pointer"
                >
                    {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                    {loading ? "Saving..." : "Save Preferences"}
                </motion.button>
            </div>

            {/* Settings Options */}
            <div className="space-y-4">
                {/* Toggle Dine-in Status */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-emerald-50 bg-white p-4 sm:p-5 shadow-xs transition hover:border-emerald-100">
                    <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                            <UtensilsCrossed size={18} />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-slate-900">Enable Dine-In Orders</h3>
                            <p className="text-xs font-medium text-slate-500 mt-0.5">
                                Allow customers to view the menu and book tables at your restaurant.
                            </p>
                        </div>
                    </div>

                    <div className="flex justify-end sm:block">
                        <button
                            type="button"
                            onClick={() => setEnableDineIn(!enableDineIn)}
                            className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${enableDineIn ? "bg-emerald-600" : "bg-slate-300"
                                }`}
                        >
                            <span
                                className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${enableDineIn ? "translate-x-5" : "translate-x-0"
                                    }`}
                            />
                        </button>
                    </div>
                </div>

                {/* Booking Amount Field */}
                <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border bg-white p-4 sm:p-5 shadow-xs transition ${enableDineIn ? "border-emerald-50 hover:border-emerald-100" : "border-slate-100 opacity-60 grayscale"
                    }`}>
                    <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                            <IndianRupee size={18} />
                        </div>
                        <div className="max-w-xs">
                            <h3 className="text-sm font-bold text-slate-900">Advance Booking Fee</h3>
                            <p className="text-xs font-medium text-slate-500 mt-0.5">
                                Amount requested via Razorpay when a customer reserves a table. Set to ₹0 for free bookings.
                            </p>
                        </div>
                    </div>

                    <div className="relative w-full sm:w-40 mt-2 sm:mt-0">
                        <IndianRupee className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type="number"
                            min="0"
                            disabled={!enableDineIn}
                            value={bookingAmount}
                            onChange={(e) => setBookingAmount(e.target.value)}
                            placeholder="e.g. 500"
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-4 text-sm font-bold text-slate-900 outline-none transition focus:border-emerald-600 focus:bg-white focus:ring-4 focus:ring-emerald-600/10 disabled:cursor-not-allowed disabled:bg-slate-100"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}