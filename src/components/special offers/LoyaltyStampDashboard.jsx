import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
    ArrowLeft,
    Search,
    Stamp,
    Users,
    Gift,
    TrendingUp,
    Phone,
    Loader2,
} from "lucide-react";

import useDiscountStore from "../../store/discountStore";

function statusFor(collected, needed) {
    if (collected >= needed) return { label: "Ready for reward", tone: "emerald" };
    if (collected >= needed - 2) return { label: "Almost there", tone: "amber" };
    return { label: "Collecting", tone: "slate" };
}

const TONE_CLASSES = {
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-200",
    amber: "bg-amber-50 text-amber-700 border-amber-200",
    slate: "bg-slate-100 text-slate-500 border-slate-200",
};

export default function LoyaltyStampsDashboard({ data, loading, onBack }) {
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");

    const { loyaltySettings } = useDiscountStore();
    const stampsNeeded = loyaltySettings?.target_stamps || 10;

    const customersList = data?.customers || [];
    const stats = data?.stats || { totalParticipants: 0, totalStampsIssued: 0 };

    const filtered = useMemo(() => {
        return customersList.filter((c) => {
            const name = c.customer_name || "Customer";
            const phone = c.customer_phone || "";
            const q = search.toLowerCase();

            const matchesSearch = name.toLowerCase().includes(q) || phone.includes(search);
            const ready = (c.stamps_earned || 0) >= stampsNeeded;
            const matchesFilter = filter === "all" || (filter === "ready" ? ready : !ready);

            return matchesSearch && matchesFilter;
        });
    }, [customersList, search, filter, stampsNeeded]);

    const totalRedeemed = customersList.reduce((sum, c) => sum + (c.stamps_redeemed || 0), 0);
    const readyCount = customersList.filter((c) => (c.stamps_earned || 0) >= stampsNeeded).length;

    if (loading) {
        return (
            <div className="flex h-[60vh] w-full items-center justify-center">
                <Loader2 size={32} className="animate-spin text-emerald-600" />
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full space-y-6 pb-12 font-sans text-slate-900"
        >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                    <button
                        onClick={onBack}
                        className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 cursor-pointer transition shrink-0"
                    >
                        <ArrowLeft size={16} />
                    </button>
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Loyalty Stamps</h1>
                        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                            See who's collecting stamps and who's ready for a reward
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                    { label: "Enrolled customers", value: stats.totalParticipants, icon: Users },
                    { label: "Stamps given out", value: stats.totalStampsIssued, icon: Stamp },
                    { label: "Rewards redeemed", value: totalRedeemed, icon: Gift },
                    { label: "Ready right now", value: readyCount, icon: TrendingUp },
                ].map((s) => {
                    const Icon = s.icon;
                    return (
                        <div key={s.label} className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                            <Icon size={16} className="text-emerald-600 mb-2" />
                            <p className="text-lg font-black text-slate-900">{s.value}</p>
                            <p className="text-[11px] font-medium text-slate-500 mt-0.5">{s.label}</p>
                        </div>
                    );
                })}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative flex-1 sm:max-w-xs">
                    <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search by name or phone..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-xs sm:text-sm focus:border-emerald-600 focus:outline-none shadow-xs font-medium"
                    />
                </div>
                <div className="flex gap-2">
                    {[
                        { key: "all", label: "All" },
                        { key: "ready", label: "Ready for reward" },
                        { key: "collecting", label: "Still collecting" },
                    ].map((f) => (
                        <button
                            key={f.key}
                            onClick={() => setFilter(f.key)}
                            className={`rounded-xl border px-3 py-2 text-[11px] font-bold transition cursor-pointer ${filter === f.key
                                    ? "border-emerald-600 bg-emerald-50 text-emerald-700"
                                    : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
                                }`}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="rounded-3xl border border-slate-100 bg-white shadow-sm overflow-hidden">
                {filtered.length === 0 ? (
                    <div className="py-16 text-center text-xs font-medium text-slate-400">
                        No customers match this criteria.
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100">
                        {filtered.map((c) => {
                            const name = c.customer_name || "Customer";
                            const collected = c.stamps_earned || 0;
                            const status = statusFor(collected, stampsNeeded);
                            const pct = Math.min(100, Math.round((collected / stampsNeeded) * 100));

                            return (
                                <div
                                    key={c._id}
                                    className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5"
                                >
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800 font-bold text-xs uppercase">
                                            {name.slice(0, 2)}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-bold text-slate-900 truncate">{name}</p>
                                            <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                                                <Phone size={11} /> {c.customer_phone}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 sm:w-72">
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-[10px] font-bold text-slate-500">
                                                    {collected}/{stampsNeeded} stamps
                                                </span>
                                                <span className="text-[10px] font-bold text-slate-400">{pct}%</span>
                                            </div>
                                            <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                                                <div
                                                    className="h-full rounded-full bg-emerald-500"
                                                    style={{ width: `${pct}%` }}
                                                />
                                            </div>
                                        </div>
                                        <span
                                            className={`shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-bold ${TONE_CLASSES[status.tone]}`}
                                        >
                                            {status.label}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </motion.div>
    );
}