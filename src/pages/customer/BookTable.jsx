import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
    ArrowLeft,
    CalendarDays,
    Clock,
    Users,
    Search,
    CheckCircle2,
    AlertCircle,
    Loader2,
    UtensilsCrossed,
    CreditCard
} from "lucide-react";

import useBookingStore from "../../store/bookingStore";
import useAuthStore from "../../store/authStore";

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

export default function BookTable() {
    const navigate = useNavigate();

    const { fetchAvailableTables, createBookingOrder, verifyBookingPayment, loading, error, availableTables } = useBookingStore();
    const { user, profile } = useAuthStore();

    const sellerId = profile?.seller_id || user?.seller_id || localStorage.getItem("seller_id") || import.meta.env.VITE_DEFAULT_SELLER_ID;

    const [date, setDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [guestCount, setGuestCount] = useState(2);
    const [selectedTable, setSelectedTable] = useState(null);

    const [customerName, setCustomerName] = useState(user?.name || profile?.name || "");
    const [customerPhone, setCustomerPhone] = useState(user?.phone || user?.phoneNumber || profile?.customer_phone || "");

    const [hasSearched, setHasSearched] = useState(false);
    const [bookingStatus, setBookingStatus] = useState(null);
    const [bookedDetails, setBookedDetails] = useState(null);
    const [timeError, setTimeError] = useState("");

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        document.body.appendChild(script);
        return () => {
            document.body.removeChild(script);
        };
    }, []);

    const handleSearchTables = async (e) => {
        e.preventDefault();
        setTimeError("");

        if (!date || !startTime || !endTime) return;

        if (startTime >= endTime) {
            setTimeError("End time must be after start time");
            return;
        }

        setSelectedTable(null);
        setHasSearched(true);

        await fetchAvailableTables({
            seller_id: sellerId,
            date,
            start_time: startTime,
            end_time: endTime,
        });
    };

    const handleBookTable = async () => {
        if (!user) {
            navigate("/auth/login", { state: { redirectTo: "/customer/book-table" } });
            return;
        }

        if (!selectedTable || !customerName || !customerPhone) {
            alert("Please fill all customer details and select a table.");
            return;
        }

        const tableObj = availableTables.find((t) => t._id === selectedTable);

        try {
            const res = await createBookingOrder({
                seller_id: sellerId,
                table_id: selectedTable,
                customer_name: customerName,
                customer_phone: customerPhone,
                guest_count: guestCount,
                date,
                start_time: startTime,
                end_time: endTime,
            });

            if (res.payment_required === false) {
                setBookedDetails({
                    table_number: tableObj?.table_number,
                    date: date,
                    start_time: startTime,
                    end_time: endTime,
                });
                setBookingStatus("success");
                return;
            }

            if (res.payment_required === true && res.razorpay_order) {
                const options = {
                    key: res.key_id,
                    amount: res.razorpay_order.amount,
                    currency: "INR",
                    name: "Table Reservation",
                    description: "Advance Table Booking Fee",
                    order_id: res.razorpay_order.id,
                    handler: async function (response) {
                        try {
                            await verifyBookingPayment({
                                booking_id: res.booking._id,
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                            });
                            setBookedDetails({
                                table_number: tableObj?.table_number,
                                date: date,
                                start_time: startTime,
                                end_time: endTime,
                            });
                            setBookingStatus("success");
                        } catch (err) {
                            setBookingStatus("failed");
                        }
                    },
                    prefill: {
                        name: customerName,
                        contact: customerPhone,
                    },
                    theme: {
                        color: getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim() || "#16522D"
                    },
                };

                const rzp = new window.Razorpay(options);
                rzp.on('payment.failed', function () {
                    setBookingStatus("failed");
                });
                rzp.open();
            }
        } catch (err) {
            console.error("Booking Error:", err);
            alert("Something went wrong. Please try again.");
        }
    };

    if (bookingStatus === "success" && bookedDetails) {
        return (
            <div className="flex min-h-screen w-full flex-col items-center justify-center p-4 text-center bg-slate-50 space-y-4">
                <div className="h-14 w-14 rounded-full flex items-center justify-center shadow-md" style={{ backgroundColor: "var(--primary-color)", color: "var(--accent-color)" }}>
                    <CheckCircle2 size={28} />
                </div>

                <div className="space-y-1">
                    <h2 className="text-lg font-semibold text-slate-900">Booking Confirmed!</h2>
                    <p className="text-xs text-slate-500 font-medium">Your table has been reserved successfully.</p>
                </div>

                <div className="w-full max-w-xs bg-white rounded-2xl p-4 shadow-sm border border-slate-200 text-left space-y-2.5">
                    <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                        <span className="text-xs text-slate-500 font-medium">Table No.</span>
                        <span className="text-sm font-semibold text-slate-900" style={{ color: "var(--primary-color)" }}>
                            Table {bookedDetails.table_number}
                        </span>
                    </div>
                    <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                        <span className="text-xs text-slate-500 font-medium">Date</span>
                        <span className="text-sm font-semibold text-slate-900">
                            {formatDate(bookedDetails.date)}
                        </span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-xs text-slate-500 font-medium">Time</span>
                        <span className="text-sm font-semibold text-slate-900">
                            {formatTime(bookedDetails.start_time)} - {formatTime(bookedDetails.end_time)}
                        </span>
                    </div>
                </div>

                <div className="w-full mb-8 max-w-xs pt-2 space-y-2">
                    <button
                        onClick={() => navigate("/customer/booking-history")}
                        className="w-full py-3 rounded-xl text-xs font-semibold shadow-md transition active:scale-95 cursor-pointer"
                        style={{ backgroundColor: "var(--primary-color)", color: "var(--accent-color)" }}
                    >
                        View My Bookings
                    </button>
                    <button
                        onClick={() => navigate("/")}
                        className="w-full py-3 rounded-xl text-xs font-semibold text-slate-600 bg-slate-200 hover:bg-slate-300 transition active:scale-95 cursor-pointer"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full pb-28 font-sans text-slate-800">
            <div className="sticky top-0 z-40 w-full px-3 py-2 flex items-center justify-between">
                <button
                    onClick={() => navigate(-1)}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-700 transition active:scale-95 cursor-pointer"
                >
                    <ArrowLeft size={16} />
                </button>
                <button
                    onClick={() => navigate("/customer/booking-history")}
                    className="text-[11px] font-semibold cursor-pointer px-2 py-1 rounded-lg bg-slate-50 border border-slate-100 transition active:scale-95"
                    style={{ color: "var(--primary-color)" }}
                >
                    My Bookings
                </button>
            </div>

            <div className="w-full max-w-md mx-auto p-3 space-y-4">

                {error && (
                    <div className="rounded-xl bg-rose-50 p-3 flex items-center gap-2 text-rose-700 border border-rose-200">
                        <AlertCircle size={16} className="shrink-0" />
                        <p className="text-xs font-semibold">{error}</p>
                    </div>
                )}

                <form onSubmit={handleSearchTables} className="rounded-2xl bg-white p-3.5 sm:p-4 shadow-sm border border-slate-100 space-y-3.5">
                    <div className="flex items-center gap-1.5 mb-1">
                        <UtensilsCrossed size={15} style={{ color: "var(--primary-color)" }} />
                        <h2 className="text-sm font-semibold text-slate-900">Find a Table</h2>
                    </div>

                    <div className="space-y-3">
                        <div>
                            <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1 block">Select Date</label>
                            <div className="relative">
                                <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                                <input
                                    type="date"
                                    required
                                    min={new Date().toISOString().split("T")[0]}
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-xs font-semibold text-slate-900 outline-none transition focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-600/10"
                                />
                            </div>
                        </div>

                        <div className="flex gap-2.5">
                            <div className="flex-1 min-w-0">
                                <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1 block">From</label>
                                <div className="relative">
                                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                                    <input
                                        type="time"
                                        required
                                        value={startTime}
                                        onChange={(e) => setStartTime(e.target.value)}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-2 text-xs font-semibold text-slate-900 outline-none transition focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-600/10"
                                    />
                                </div>
                            </div>

                            <div className="flex-1 min-w-0">
                                <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1 block">Till</label>
                                <div className="relative">
                                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                                    <input
                                        type="time"
                                        required
                                        min={startTime}
                                        value={endTime}
                                        onChange={(e) => setEndTime(e.target.value)}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-2 text-xs font-semibold text-slate-900 outline-none transition focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-600/10"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1 block">Guests</label>
                            <div className="relative">
                                <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                                <input
                                    type="number"
                                    min="1"
                                    required
                                    value={guestCount}
                                    onChange={(e) => setGuestCount(Number(e.target.value))}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-xs font-semibold text-slate-900 outline-none transition focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-600/10"
                                />
                            </div>
                        </div>

                        {timeError && (
                            <p className="text-[11px] font-semibold text-rose-600">{timeError}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-xl py-2.5 text-xs font-semibold flex items-center justify-center gap-1.5 transition active:scale-95 disabled:opacity-70 cursor-pointer"
                        style={{ backgroundColor: "var(--primary-color)", color: "var(--accent-color)" }}
                    >
                        {loading && !hasSearched ? <Loader2 size={15} className="animate-spin" /> : <Search size={15} />}
                        {loading && !hasSearched ? "Searching..." : "Check Availability"}
                    </button>
                </form>

                {hasSearched && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                    >
                        <div className="rounded-2xl bg-white p-3.5 shadow-sm border border-slate-100">
                            <h3 className="text-sm font-semibold text-slate-900 mb-3">Available Tables</h3>

                            {loading ? (
                                <div className="py-6 flex justify-center"><Loader2 className="animate-spin text-slate-400" size={22} /></div>
                            ) : availableTables.length === 0 ? (
                                <div className="py-6 text-center text-xs font-medium text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-300 px-3">
                                    No tables available for this time slot.<br />Please try a different time.
                                </div>
                            ) : (
                                <div className="grid grid-cols-4 xs:grid-cols-4 gap-2">
                                    {availableTables.map((table) => {
                                        const isAvailable = table.is_available;
                                        const isSelected = selectedTable === table._id;

                                        return (
                                            <button
                                                key={table._id}
                                                disabled={!isAvailable}
                                                onClick={() => setSelectedTable(table._id)}
                                                className={`flex flex-col items-center justify-center py-2.5 rounded-xl border transition ${!isAvailable
                                                    ? "bg-slate-50 border-slate-100 opacity-50 cursor-not-allowed"
                                                    : isSelected
                                                        ? "shadow-sm border-2"
                                                        : "bg-white border-slate-200 hover:border-slate-300 cursor-pointer"
                                                    }`}
                                                style={isSelected ? { borderColor: "var(--primary-color)", backgroundColor: "color-mix(in srgb, var(--primary-color) 10%, white)" } : {}}
                                            >
                                                <span className="text-[9px] font-medium text-slate-500 mb-0.5">Table</span>
                                                <span className={`text-base font-semibold ${isSelected ? "" : "text-slate-800"}`} style={isSelected ? { color: "var(--primary-color)" } : {}}>
                                                    {table.table_number}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        <div className="rounded-2xl bg-white p-3.5 shadow-sm border border-slate-100 space-y-3">
                            <h3 className="text-sm font-semibold text-slate-900">Booking Details</h3>

                            <div>
                                <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1 block">Full Name</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Enter your name"
                                    value={customerName}
                                    onChange={(e) => setCustomerName(e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-semibold text-slate-900 outline-none transition focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-600/10"
                                />
                            </div>

                            <div>
                                <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1 block">Phone Number</label>
                                <input
                                    type="tel"
                                    required
                                    placeholder="Enter your phone"
                                    value={customerPhone}
                                    onChange={(e) => setCustomerPhone(e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-semibold text-slate-900 outline-none transition focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-600/10"
                                />
                            </div>
                        </div>

                    </motion.div>
                )}
            </div>

            <div className="fixed bottom-[65px] sm:bottom-0 left-0 right-0 z-40 p-3 bg-white border-t border-slate-200 shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
                <div className="max-w-md mx-auto">
                    <button
                        onClick={handleBookTable}
                        disabled={loading || (user && !selectedTable)}
                        className={`w-full rounded-xl py-3 text-xs font-semibold flex items-center justify-center gap-1.5 transition active:scale-95 shadow-lg ${user && !selectedTable
                            ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                            : "cursor-pointer"
                            }`}
                        style={!user || selectedTable ? { backgroundColor: "var(--primary-color)", color: "var(--accent-color)" } : {}}
                    >
                        {loading ? (
                            <Loader2 size={16} className="animate-spin" />
                        ) : (
                            <CreditCard size={16} />
                        )}
                        {!user
                            ? "Login to Book Table"
                            : !selectedTable
                                ? "Select a table to book"
                                : loading
                                    ? "Processing..."
                                    : "Confirm & Book Table"
                        }
                    </button>
                </div>
            </div>
        </div>
    );
}