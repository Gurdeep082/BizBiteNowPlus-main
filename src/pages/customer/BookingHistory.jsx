import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowLeft,
    CalendarDays,
    Clock,
    Users,
    UtensilsCrossed,
    Loader2,
    AlertCircle,
    IndianRupee,
    X
} from "lucide-react";

import useBookingStore from "../../store/bookingStore";

const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}/${year}`;
};

const formatTime = (timeStr) => {
    if (!timeStr) return "";
    const [h, m] = timeStr.split(":");
    const ampm = h >= 12 ? "PM" : "AM";
    const hh = h % 12 || 12;
    return `${hh}:${m} ${ampm}`;
};

export default function BookingHistory() {
    const navigate = useNavigate();
    const { bookings, fetchBookings, cancelBooking, loading, error } = useBookingStore();

    const [activeTab, setActiveTab] = useState("upcoming");
    const [cancellingId, setCancellingId] = useState(null);
    const [confirmingId, setConfirmingId] = useState(null);

    useEffect(() => {
        fetchBookings().catch((err) => console.error("Failed to fetch bookings:", err));
    }, [fetchBookings]);

    const upcomingBookings = bookings.filter((b) =>
        b.status === "pending" || b.status === "confirmed"
    );

    const pastBookings = bookings.filter((b) =>
        b.status === "completed" || b.status === "cancelled" || b.status === "no_show"
    );

    const displayedBookings = activeTab === "upcoming" ? upcomingBookings : pastBookings;

    const handleCancelClick = (bookingId) => {
        setConfirmingId(bookingId);
    };

    const handleConfirmCancel = async (bookingId) => {
        setCancellingId(bookingId);
        try {
            await cancelBooking(bookingId);
            await fetchBookings();
        } catch (err) {
            console.error("Failed to cancel booking:", err);
        } finally {
            setCancellingId(null);
            setConfirmingId(null);
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case "confirmed":
                return (
                    <span className="bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider">
                        Confirmed
                    </span>
                );
            case "pending":
                return (
                    <span className="bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider">
                        Pending
                    </span>
                );
            case "cancelled":
                return (
                    <span className="bg-rose-100 text-rose-700 px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider">
                        Cancelled
                    </span>
                );
            case "completed":
                return (
                    <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider">
                        Completed
                    </span>
                );
            default:
                return (
                    <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider">
                        {status}
                    </span>
                );
        }
    };

    return (
        <div className="min-h-screen w-full font-sans text-slate-800 pb-10">
            <div className="sticky top-0 z-40 w-full px-4 shadow-sm flex items-center justify-between">
                <button
                    onClick={() => navigate(-1)}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-700 transition active:scale-95 cursor-pointer"
                >
                    <ArrowLeft size={20} />
                </button>
                <div className="w-10" />
            </div>

            <div className="w-full max-w-lg mx-auto p-4 space-y-4">

                <div className="flex bg-white p-1 rounded-2xl shadow-sm border border-slate-100">
                    <button
                        onClick={() => setActiveTab("upcoming")}
                        className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition cursor-pointer ${activeTab === "upcoming"
                            ? "shadow-sm"
                            : "text-slate-500 hover:text-slate-700"
                            }`}
                        style={activeTab === "upcoming" ? { backgroundColor: "var(--primary-color)", color: "var(--accent-color)" } : {}}
                    >
                        Upcoming
                    </button>
                    <button
                        onClick={() => setActiveTab("past")}
                        className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition cursor-pointer ${activeTab === "past"
                            ? "shadow-sm"
                            : "text-slate-500 hover:text-slate-700"
                            }`}
                        style={activeTab === "past" ? { backgroundColor: "var(--primary-color)", color: "var(--accent-color)" } : {}}
                    >
                        Past History
                    </button>
                </div>

                {error && (
                    <div className="rounded-2xl bg-rose-50 p-4 flex items-center gap-3 text-rose-700 border border-rose-200">
                        <AlertCircle size={20} className="shrink-0" />
                        <p className="text-sm font-semibold">{error}</p>
                    </div>
                )}

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 space-y-3">
                        <Loader2 className="animate-spin" size={32} style={{ color: "var(--primary-color)" }} />
                        <p className="text-sm font-medium text-slate-500">Loading your bookings...</p>
                    </div>
                ) : displayedBookings.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col items-center justify-center py-16 text-center space-y-3 bg-white rounded-3xl border border-slate-100 shadow-sm px-6"
                    >
                        <div className="h-16 w-16 rounded-full flex items-center justify-center bg-slate-50" style={{ color: "var(--primary-color)" }}>
                            <CalendarDays size={32} />
                        </div>
                        <div>
                            <h3 className="text-base font-semibold text-slate-900">No {activeTab} bookings</h3>
                            <p className="text-sm text-slate-500 font-medium mt-1">
                                {activeTab === "upcoming"
                                    ? "You don't have any table reservations coming up."
                                    : "Your past booking history is empty."}
                            </p>
                        </div>
                        {activeTab === "upcoming" && (
                            <button
                                onClick={() => navigate("/book-table")}
                                className="mt-4 px-6 py-2.5 rounded-xl text-sm font-semibold shadow-sm transition active:scale-95 cursor-pointer"
                                style={{ backgroundColor: "var(--primary-color)", color: "var(--accent-color)" }}
                            >
                                Book a Table Now
                            </button>
                        )}
                    </motion.div>
                ) : (
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, x: activeTab === "upcoming" ? -10 : 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="space-y-4"
                        >
                            {displayedBookings.map((booking) => {
                                const isCancellable = booking.status === "pending" || booking.status === "confirmed";
                                const isConfirming = confirmingId === booking._id;
                                const isCancelling = cancellingId === booking._id;

                                return (
                                    <div
                                        key={booking._id}
                                        className="bg-white rounded-[24px] p-5 shadow-sm border border-slate-100 space-y-4"
                                    >
                                        <div className="flex justify-between items-start">
                                            <div className="flex items-center gap-3">
                                                <div className="h-12 w-12 rounded-2xl flex items-center justify-center shadow-xs" style={{ backgroundColor: "color-mix(in srgb, var(--primary-color) 10%, white)", color: "var(--primary-color)" }}>
                                                    <UtensilsCrossed size={20} />
                                                </div>
                                                <div>
                                                    <h3 className="text-base font-semibold text-slate-900">
                                                        Table {booking.table_id?.table_number || "TBD"}
                                                    </h3>
                                                    <p className="text-[11px] text-slate-400 font-medium tracking-wide uppercase">
                                                        ID: {String(booking._id).slice(-6)}
                                                    </p>
                                                </div>
                                            </div>
                                            {getStatusBadge(booking.status)}
                                        </div>

                                        <div className="bg-slate-50 rounded-2xl p-4 grid grid-cols-2 gap-y-3 gap-x-2">
                                            <div className="flex items-center gap-2">
                                                <CalendarDays size={16} className="text-slate-400" />
                                                <span className="text-xs font-semibold text-slate-700">
                                                    {formatDate(booking.slot_date)}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <Clock size={16} className="text-slate-400" />
                                                <span className="text-xs font-semibold text-slate-700">
                                                    {formatTime(booking.slot_start_time)} - {formatTime(booking.slot_end_time)}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <Users size={16} className="text-slate-400" />
                                                <span className="text-xs font-semibold text-slate-700">
                                                    {booking.guest_count} {booking.guest_count > 1 ? "Guests" : "Guest"}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <IndianRupee size={16} className="text-slate-400" />
                                                <span className="text-xs font-semibold text-slate-700">
                                                    {booking.booking_amount > 0 ? `₹${booking.booking_amount} Paid` : "Free"}
                                                </span>
                                            </div>
                                        </div>

                                        {isCancellable && (
                                            <div className="pt-1">
                                                {isConfirming ? (
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => handleConfirmCancel(booking._id)}
                                                            disabled={isCancelling}
                                                            className="flex-1 py-2.5 rounded-xl text-xs font-semibold bg-rose-600 text-white transition active:scale-95 disabled:opacity-60 cursor-pointer flex items-center justify-center gap-1.5"
                                                        >
                                                            {isCancelling ? (
                                                                <Loader2 size={14} className="animate-spin" />
                                                            ) : (
                                                                "Yes, Cancel Booking"
                                                            )}
                                                        </button>
                                                        <button
                                                            onClick={() => setConfirmingId(null)}
                                                            disabled={isCancelling}
                                                            className="py-2.5 px-4 rounded-xl text-xs font-semibold bg-slate-100 text-slate-600 transition active:scale-95 cursor-pointer"
                                                        >
                                                            <X size={14} />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => handleCancelClick(booking._id)}
                                                        className="w-full py-2.5 rounded-xl text-xs font-semibold border border-rose-200 text-rose-600 bg-rose-50 hover:bg-rose-100 transition active:scale-95 cursor-pointer"
                                                    >
                                                        Cancel Booking
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </motion.div>
                    </AnimatePresence>
                )}
            </div>
        </div>
    );
}