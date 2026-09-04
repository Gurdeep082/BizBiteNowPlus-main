import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
    QrCode,
    Plus,
    RefreshCw,
    Copy,
    Check,
    Printer,
    Loader2,
    AlertCircle,
    UtensilsCrossed,
    CalendarDays,
    Users,
    Clock,
    Ban,
    Search,
    Megaphone,
    ImagePlus,
    Download,
    Trash2
} from "lucide-react";

// UI Components
import Typography from "../../../components/UI/Typography";
import Button from "../../../components/UI/Button";
import Input from "../../../components/UI/Input";
import Card from "../../../components/UI/Card";
import Badge from "../../../components/UI/Badge";
import EmptyState from "../../../components/UI/EmptyState";
import Modal from "../../../components/UI/Modal";
import Toggle from "../../../components/UI/Toggle";

import useTableStore from "../../../store/tableStore";
import useBookingStore from "../../../store/bookingStore";
import API from "../../../api/axios";

const formatTime = (timeStr) => {
    if (!timeStr) return "";
    const [h, m] = timeStr.split(":");
    const ampm = h >= 12 ? "PM" : "AM";
    const hh = h % 12 || 12;
    return `${hh}:${m} ${ampm}`;
};

export default function DineIn() {
    const {
        tables,
        fetchTables,
        createTable,
        toggleTableStatus,
        loading: tableLoading,
        error: tableError,
    } = useTableStore();

    const {
        bookings,
        fetchBookings,
        cancelBooking,
        loading: bookingLoading,
        error: bookingError,
    } = useBookingStore();

    const [activeTab, setActiveTab] = useState("tables");

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newTableNumber, setNewTableNumber] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [copiedId, setCopiedId] = useState(null);
    const [searchTable, setSearchTable] = useState("");

    const [bookingDate, setBookingDate] = useState("");
    const [bookingStatus, setBookingStatus] = useState("");

    const [marketingQRs, setMarketingQRs] = useState([]);
    const [marketingLoading, setMarketingLoading] = useState(false);
    const [isMarketingModalOpen, setIsMarketingModalOpen] = useState(false);
    const [marketingName, setMarketingName] = useState("");
    const [marketingUrl, setMarketingUrl] = useState("");
    const [marketingLogoUrl, setMarketingLogoUrl] = useState("");
    const [isGeneratingQR, setIsGeneratingQR] = useState(false);
    const [marketingCopiedId, setMarketingCopiedId] = useState(null);

    const [popupModal, setPopupModal] = useState({ show: false, title: "", message: "", type: "error" });
    const showPopup = (title, message, type = "error") => setPopupModal({ show: true, title, message, type });

    const [confirmModal, setConfirmModal] = useState({ show: false, bookingId: null });
    const [deleteQrModal, setDeleteQrModal] = useState({ show: false, qrId: null });

    useEffect(() => {
        fetchTables().catch((err) => console.error(err));
    }, [fetchTables]);

    useEffect(() => {
        if (activeTab === "bookings") {
            fetchBookings({ date: bookingDate, status: bookingStatus }).catch((err) =>
                console.error(err)
            );
        }
    }, [activeTab, bookingDate, bookingStatus, fetchBookings]);

    useEffect(() => {
        if (activeTab === "marketing") {
            fetchMarketingQRs();
        }
    }, [activeTab]);

    const filteredTables = useMemo(() => {
        if (!searchTable.trim()) return tables;
        const q = searchTable.toLowerCase();
        return tables.filter((t) =>
            String(t.table_number || "").toLowerCase().includes(q)
        );
    }, [tables, searchTable]);

    const handleCreateTable = async (e) => {
        if (e) e.preventDefault();
        if (!newTableNumber.trim()) return;

        setIsSubmitting(true);
        try {
            await createTable({ table_number: newTableNumber.trim() });
            setNewTableNumber("");
            setIsAddModalOpen(false);
            showPopup("Success", "Table generated successfully!", "success");
        } catch (err) {
            showPopup("Creation Failed", err || "Unable to generate the table. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCopyLink = (url, id) => {
        if (!url) {
            showPopup("Link Unavailable", "This table does not have a valid ordering URL yet.");
            return;
        }
        navigator.clipboard.writeText(url);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const handlePrintQR = (table) => {
        const qrImageSrc = table.display_qr || table.qr_code_url || table.qr_code;
        if (!qrImageSrc) {
            showPopup("Print Error", "No valid QR code image found for this table.");
            return;
        }

        const printWindow = window.open("", "_blank");
        printWindow.document.write(`
      <html>
        <head>
          <title>Print QR - Table ${table.table_number}</title>
          <style>
            body { font-family: 'Segoe UI', sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #f8fafc; }
            .card { background: white; padding: 40px; border-radius: 28px; text-align: center; border: 2px solid #e2e8f0; max-width: 320px; }
            .title { font-size: 28px; font-weight: 900; color: #1A4D2E; margin-bottom: 8px; text-transform: uppercase; }
            .subtitle { font-size: 14px; color: #64748b; margin-bottom: 24px; font-weight: 600; }
            .qr-container { padding: 16px; border-radius: 20px; border: 1px dashed #cbd5e1; display: inline-block; margin-bottom: 20px; }
            img { width: 220px; height: 220px; display: block; }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="title">Table ${table.table_number}</div>
            <div class="subtitle">Scan to View Menu & Order</div>
            <div class="qr-container"><img src="${qrImageSrc}" alt="QR" /></div>
          </div>
          <script>window.onload = () => { setTimeout(() => { window.print(); window.close(); }, 300); };</script>
        </body>
      </html>
    `);
        printWindow.document.close();
    };

    const executeCancelBooking = async () => {
        if (!confirmModal.bookingId) return;
        try {
            await cancelBooking(confirmModal.bookingId);
            setConfirmModal({ show: false, bookingId: null });
            showPopup("Booking Cancelled", "The table booking has been successfully cancelled.", "success");
        } catch (err) {
            setConfirmModal({ show: false, bookingId: null });
            showPopup("Cancellation Failed", typeof err === 'string' ? err : "Could not cancel booking.");
        }
    };

    const fetchMarketingQRs = async () => {
        setMarketingLoading(true);
        try {
            const { data } = await API.get("/tables/marketing-qr/list");
            if (data.success) {
                setMarketingQRs(data.marketing_qrs);
            }
        } catch (err) {
            showPopup("Error", "Failed to load marketing QR codes.");
        } finally {
            setMarketingLoading(false);
        }
    };

    const handleGenerateMarketingQR = async (e) => {
        if (e) e.preventDefault();
        if (!marketingName.trim() || !marketingUrl.trim()) return;

        setIsGeneratingQR(true);
        try {
            const { data } = await API.post("/tables/marketing-qr", {
                name: marketingName.trim(),
                destination_url: marketingUrl.trim(),
                logo_url: marketingLogoUrl.trim() || undefined,
            });

            if (!data.success) throw new Error(data.message || "Failed to generate QR code");

            setMarketingQRs((prev) => [data.marketing_qr, ...prev]);

            setMarketingName("");
            setMarketingUrl("");
            setMarketingLogoUrl("");
            setIsMarketingModalOpen(false);
            showPopup("Success", "Marketing QR generated successfully!", "success");
        } catch (err) {
            showPopup("Generation Failed", err.response?.data?.message || err.message || "Unable to generate the QR code.");
        } finally {
            setIsGeneratingQR(false);
        }
    };

    const executeDeleteMarketingQR = async () => {
        if (!deleteQrModal.qrId) return;
        try {
            const { data } = await API.delete(`/tables/marketing-qr/${deleteQrModal.qrId}`);
            if (data.success) {
                setMarketingQRs((prev) => prev.filter((qr) => qr._id !== deleteQrModal.qrId));
                showPopup("Deleted", "Marketing QR deleted successfully.", "success");
            }
        } catch (err) {
            showPopup("Delete Failed", err.response?.data?.message || "Could not delete QR code.");
        } finally {
            setDeleteQrModal({ show: false, qrId: null });
        }
    };

    const handleCopyMarketingLink = (url, id) => {
        navigator.clipboard.writeText(url);
        setMarketingCopiedId(id);
        setTimeout(() => setMarketingCopiedId(null), 2000);
    };

    const handlePrintMarketingQR = (item) => {
        const printWindow = window.open("", "_blank");
        printWindow.document.write(`
      <html>
        <head>
          <title>Print QR - ${item.name}</title>
          <style>
            body { font-family: 'Segoe UI', sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #f8fafc; }
            .card { background: white; padding: 40px; border-radius: 28px; text-align: center; border: 2px solid #e2e8f0; max-width: 320px; }
            .title { font-size: 24px; font-weight: 900; color: #1A4D2E; margin-bottom: 8px; text-transform: uppercase; }
            .qr-container { padding: 16px; border-radius: 20px; border: 1px dashed #cbd5e1; display: inline-block; margin-bottom: 20px; }
            img { width: 220px; height: 220px; display: block; }
            .footer { font-size: 12px; font-weight: bold; color: #059669; text-transform: uppercase; }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="title">${item.name}</div>
            <div class="qr-container"><img src="${item.qr_code_url}" alt="QR" /></div>
            <div class="footer">⚡ Powered by BizBiteNow</div>
          </div>
          <script>window.onload = () => { setTimeout(() => { window.print(); window.close(); }, 300); };</script>
        </body>
      </html>
    `);
        printWindow.document.close();
    };

    const handleDownloadMarketingQR = async (item) => {
        try {
            const res = await fetch(item.qr_code_url);
            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `${item.name}.png`;
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            showPopup("Download Failed", "Could not download the QR code image.");
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full space-y-6 pb-16 font-sans"
        >
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <Typography variant="h3">
                        {activeTab === "tables" ? "Dine-In & QR Tables" : activeTab === "bookings" ? "Table Bookings" : "Marketing QR Codes"}
                    </Typography>
                    <Typography variant="small" className="mt-1 text-sm">
                        {activeTab === "tables"
                            ? "Manage restaurant tables, generate QR codes, and allow instant orders."
                            : activeTab === "bookings"
                                ? "View and manage customer table reservations."
                                : "Generate branded QR codes for marketing, app downloads, and promotions."}
                    </Typography>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    {activeTab === "tables" && (
                        <Button variant="primary" onClick={() => setIsAddModalOpen(true)} className="!h-10 !px-4">
                            <Plus size={18} /> Add Table
                        </Button>
                    )}
                    {activeTab === "marketing" && (
                        <Button variant="primary" onClick={() => setIsMarketingModalOpen(true)} className="!h-10 !px-4">
                            <Plus size={18} /> New QR Code
                        </Button>
                    )}
                </div>
            </div>

            <div className="flex gap-2 overflow-x-auto rounded-2xl border border-slate-200 bg-white p-1.5 shadow-xs hide-scrollbar">
                {[
                    { key: "tables", label: "Tables" },
                    { key: "bookings", label: "Bookings" },
                    { key: "marketing", label: "Marketing QR" }
                ].map((t) => (
                    <Button
                        key={t.key}
                        variant={activeTab === t.key ? "primary" : "outline"}
                        onClick={() => setActiveTab(t.key)}
                        className={`!h-9 !px-4 !text-xs !rounded-xl ${activeTab !== t.key ? "!border-transparent !text-slate-500 hover:!bg-slate-50" : "shadow-sm"}`}
                    >
                        {t.label}
                    </Button>
                ))}
            </div>

            {(tableError || bookingError) && (
                <div className="flex items-start gap-3 rounded-2xl bg-rose-50 border border-rose-200 p-4 text-rose-700 shadow-xs">
                    <AlertCircle size={18} className="shrink-0 mt-0.5 text-rose-600" />
                    <Typography variant="small" weight="bold" color="text-rose-700">
                        {activeTab === "tables" ? tableError : bookingError}
                    </Typography>
                </div>
            )}

            {activeTab === "tables" && (
                <>
                    <Card padding="p-4" className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 shadow-sm">
                        <div className="w-full sm:w-80">
                            <Input
                                type="text"
                                placeholder="Search table number (e.g., Table 1)..."
                                value={searchTable}
                                onChange={(e) => setSearchTable(e.target.value)}
                                leftIcon={<Search size={16} />}
                                rightIcon={searchTable ? (
                                    <button onClick={() => setSearchTable("")} className="hover:text-slate-600">
                                        <X size={16} />
                                    </button>
                                ) : null}
                                className="!py-2"
                            />
                        </div>

                        <div className="flex items-center gap-3">
                            <Typography variant="small" weight="medium" className="flex items-center gap-1.5 text-xs">
                                <UtensilsCrossed size={16} className="text-[#1A4D2E]" />
                                Total: <span className="font-bold text-slate-900">{tables.length}</span>
                            </Typography>
                            <span className="text-slate-300">|</span>
                            <Typography variant="small" weight="medium" className="flex items-center gap-1.5 text-xs">
                                Active: <span className="font-bold text-emerald-700">{tables.filter(t => t.is_active !== false).length}</span>
                            </Typography>
                            <Button
                                variant="outline"
                                onClick={() => fetchTables()}
                                disabled={tableLoading}
                                className="!h-8 !w-8 !p-0 !border-transparent !bg-slate-50 hover:!bg-slate-100 ml-2"
                            >
                                <RefreshCw size={14} className={tableLoading ? "animate-spin text-[#1A4D2E]" : "text-slate-500"} />
                            </Button>
                        </div>
                    </Card>

                    {tableLoading && tables.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-3">
                            <Loader2 size={32} className="animate-spin text-[#1A4D2E]" />
                            <Typography variant="small" weight="medium" color="text-slate-400">Loading Tables...</Typography>
                        </div>
                    ) : filteredTables.length === 0 ? (
                        <EmptyState
                            icon={QrCode}
                            title="No Dine-In Tables Found"
                            description={searchTable ? `No results matching "${searchTable}".` : "You haven't set up any dine-in tables yet."}
                            primaryAction={searchTable ? null : { label: "Add Table", onClick: () => setIsAddModalOpen(true) }}
                        />
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                            {filteredTables.map((table) => {
                                const isActive = table.is_active !== false;
                                const isCopied = copiedId === table._id;
                                const qrImageSrc = table.display_qr || table.qr_code_url || table.qr_code;
                                const targetUrl = table.display_url || table.ordering_url;

                                return (
                                    <Card
                                        key={table._id}
                                        padding="p-0"
                                        className={`flex flex-col overflow-hidden transition-all duration-300 ${!isActive ? "opacity-75 border-rose-200 bg-rose-50/20" : "hover:border-[#1A4D2E]/30"}`}
                                    >
                                        <div className="p-4 flex items-center justify-between border-b border-slate-100 bg-slate-50/50">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-[#1A4D2E] font-bold text-sm">
                                                    #{table.table_number}
                                                </div>
                                                <div>
                                                    <Typography variant="h6" className="text-base">Table {table.table_number}</Typography>
                                                    <Badge variant={isActive ? "success" : "danger"} size="sm" className="!px-1.5 !py-0.5 !text-[10px] mt-0.5">
                                                        {isActive ? "Active" : "Disabled"}
                                                    </Badge>
                                                </div>
                                            </div>
                                            <Toggle
                                                checked={isActive}
                                                onChange={() => toggleTableStatus(table._id)}
                                            />
                                        </div>

                                        <div className="p-5 flex flex-col items-center justify-center bg-white my-auto relative group">
                                            <div className="relative p-3 rounded-2xl bg-white border border-slate-100 shadow-xs">
                                                {qrImageSrc ? (
                                                    <img src={qrImageSrc} alt="Table QR" className={`h-32 w-32 object-contain transition duration-300 ${!isActive ? "grayscale blur-sm opacity-40" : "group-hover:scale-105"}`} />
                                                ) : (
                                                    <div className="h-32 w-32 flex items-center justify-center text-slate-300"><QrCode size={40} /></div>
                                                )}
                                                {!isActive && (
                                                    <div className="absolute inset-0 flex items-center justify-center font-bold text-xs uppercase tracking-wider text-rose-600 bg-white/40 backdrop-blur-[2px] rounded-2xl">
                                                        Offline
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="p-3 bg-slate-50 border-t border-slate-100 grid grid-cols-2 gap-2">
                                            <Button
                                                variant="outline"
                                                onClick={() => handleCopyLink(targetUrl, table._id)}
                                                disabled={!targetUrl}
                                                className="!h-9 !text-xs !bg-white hover:!bg-slate-100"
                                            >
                                                {isCopied ? <Check size={14} className="text-[#1A4D2E]" /> : <Copy size={14} />}
                                                {isCopied ? "Copied!" : "Copy Link"}
                                            </Button>
                                            <Button
                                                variant="primary"
                                                onClick={() => handlePrintQR(table)}
                                                disabled={!qrImageSrc || !isActive}
                                                className="!h-9 !text-xs"
                                            >
                                                <Printer size={14} /> Print QR
                                            </Button>
                                        </div>
                                    </Card>
                                );
                            })}
                        </div>
                    )}
                </>
            )}

            {activeTab === "bookings" && (
                <>
                    <Card padding="p-4" className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shadow-sm">
                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <input
                                type="date"
                                value={bookingDate}
                                onChange={(e) => setBookingDate(e.target.value)}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium focus:border-[#1A4D2E] focus:ring-4 focus:ring-[#1A4D2E]/10 outline-none transition-all"
                            />
                            <select
                                value={bookingStatus}
                                onChange={(e) => setBookingStatus(e.target.value)}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium focus:border-[#1A4D2E] focus:ring-4 focus:ring-[#1A4D2E]/10 outline-none transition-all cursor-pointer"
                            >
                                <option value="">All Statuses</option>
                                <option value="pending">Pending</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>
                        <Button
                            variant="outline"
                            onClick={() => fetchBookings({ date: bookingDate, status: bookingStatus })}
                            disabled={bookingLoading}
                            className="!h-[42px] !px-5"
                        >
                            <RefreshCw size={16} className={bookingLoading ? "animate-spin text-slate-400" : ""} />
                            Refresh
                        </Button>
                    </Card>

                    {bookingLoading && bookings.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-3">
                            <Loader2 size={32} className="animate-spin text-[#1A4D2E]" />
                            <Typography variant="small" weight="medium" color="text-slate-400">Loading Bookings...</Typography>
                        </div>
                    ) : bookings.length === 0 ? (
                        <EmptyState
                            icon={CalendarDays}
                            title="No Bookings Found"
                            description="There are no table reservations matching your current filters."
                        />
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {bookings.map((booking) => {
                                const isCancelled = booking.status === "cancelled";
                                const isCompleted = booking.status === "completed";
                                const badgeVariant = booking.status === 'confirmed' ? 'success' :
                                    booking.status === 'pending' ? 'warning' :
                                        booking.status === 'cancelled' ? 'danger' : 'secondary';

                                return (
                                    <Card
                                        key={booking._id}
                                        padding="p-5"
                                        className={`flex flex-col gap-4 shadow-sm transition ${isCancelled ? "border-rose-200 bg-rose-50/30 opacity-75" : "border-slate-200"}`}
                                    >
                                        <div className="flex justify-between items-start gap-2">
                                            <div className="min-w-0">
                                                <Typography variant="h5" className="truncate">{booking.customer_name}</Typography>
                                                <Typography variant="small" weight="medium" className="text-slate-500 mt-0.5 truncate">{booking.customer_phone}</Typography>
                                            </div>
                                            <Badge variant={badgeVariant} size="sm" className="!px-2.5 !py-1 uppercase shrink-0">
                                                {booking.status}
                                            </Badge>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3 text-sm text-slate-600 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                                            <div className="flex items-center gap-2">
                                                <CalendarDays size={15} className="text-slate-400 shrink-0" />
                                                <Typography variant="small" weight="semibold" className="truncate">
                                                    {booking.slot_date ? new Date(booking.slot_date).toLocaleDateString('en-GB') : "N/A"}
                                                </Typography>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Clock size={15} className="text-slate-400 shrink-0" />
                                                <Typography variant="small" weight="semibold" className="truncate">
                                                    {booking.slot_start_time ? formatTime(booking.slot_start_time) : "N/A"}
                                                </Typography>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Users size={15} className="text-slate-400 shrink-0" />
                                                <Typography variant="small" weight="semibold" className="truncate">
                                                    {booking.guest_count} Guests
                                                </Typography>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <UtensilsCrossed size={15} className="text-slate-400 shrink-0" />
                                                <Typography variant="small" weight="semibold" color="text-slate-800" className="truncate">
                                                    Table: {booking.table_id?.table_number || "TBD"}
                                                </Typography>
                                            </div>
                                        </div>

                                        {(!isCancelled && !isCompleted) && (
                                            <Button
                                                variant="outline"
                                                onClick={() => setConfirmModal({ show: true, bookingId: booking._id })}
                                                className="w-full mt-1 !border-rose-200 !text-rose-600 hover:!bg-rose-50"
                                            >
                                                <Ban size={15} /> Cancel Booking
                                            </Button>
                                        )}
                                    </Card>
                                );
                            })}
                        </div>
                    )}
                </>
            )}

            {activeTab === "marketing" && (
                <>
                    {marketingLoading ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-3">
                            <Loader2 size={32} className="animate-spin text-[#1A4D2E]" />
                            <Typography variant="small" weight="medium" color="text-slate-400">Loading Marketing QRs...</Typography>
                        </div>
                    ) : marketingQRs.length === 0 ? (
                        <EmptyState
                            icon={Megaphone}
                            title="No Marketing QR Codes Yet"
                            description="Generate a branded QR code for app downloads, promotions, or any custom link."
                            primaryAction={{ label: "Create QR Code", onClick: () => setIsMarketingModalOpen(true) }}
                        />
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                            {marketingQRs.map((item) => {
                                const isCopied = marketingCopiedId === item._id;
                                return (
                                    <Card
                                        key={item._id}
                                        padding="p-0"
                                        className="flex flex-col overflow-hidden transition-all duration-300 hover:border-[#1A4D2E]/30"
                                    >
                                        <div className="p-4 flex items-center justify-between border-b border-slate-100 bg-slate-50/50">
                                            <div className="flex items-center gap-3 overflow-hidden">
                                                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-[#1A4D2E] shrink-0">
                                                    <Megaphone size={18} />
                                                </span>
                                                <Typography variant="h6" className="text-sm truncate">{item.name}</Typography>
                                            </div>

                                            <Button
                                                variant="outline"
                                                onClick={() => setDeleteQrModal({ show: true, qrId: item._id })}
                                                className="!h-8 !w-8 !p-0 !border-transparent !bg-rose-50 !text-rose-500 hover:!bg-rose-100 shrink-0"
                                            >
                                                <Trash2 size={14} />
                                            </Button>
                                        </div>

                                        <div className="p-5 flex flex-col items-center justify-center bg-white my-auto">
                                            <div className="relative p-3 rounded-2xl bg-white border border-slate-100 shadow-xs group">
                                                <img src={item.qr_code_url} alt={item.name} className="h-32 w-32 object-contain transition duration-300 group-hover:scale-105" />
                                            </div>
                                        </div>

                                        <div className="p-3 bg-slate-50 border-t border-slate-100 grid grid-cols-3 gap-2">
                                            <Button
                                                variant="outline"
                                                onClick={() => handleCopyMarketingLink(item.destination_url, item._id)}
                                                className="!h-9 !px-2 !text-[11px] !bg-white hover:!bg-slate-100"
                                            >
                                                {isCopied ? <Check size={13} className="text-[#1A4D2E]" /> : <Copy size={13} />}
                                                {isCopied ? "Copied" : "Link"}
                                            </Button>

                                            <Button
                                                variant="outline"
                                                onClick={() => handleDownloadMarketingQR(item)}
                                                className="!h-9 !px-2 !text-[11px] !bg-white hover:!bg-slate-100"
                                            >
                                                <Download size={13} /> Save
                                            </Button>

                                            <Button
                                                variant="primary"
                                                onClick={() => handlePrintMarketingQR(item)}
                                                className="!h-9 !px-2 !text-[11px]"
                                            >
                                                <Printer size={13} /> Print
                                            </Button>
                                        </div>
                                    </Card>
                                );
                            })}
                        </div>
                    )}
                </>
            )}

            {/* MODALS */}
            <Modal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                title={
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-emerald-100 text-[#1A4D2E] flex items-center justify-center">
                            <Plus size={20} />
                        </div>
                        <div>
                            <Typography variant="h5" className="text-lg">Add Dine-In Table</Typography>
                            <Typography variant="small" className="text-[11px]">Generate a unique QR code.</Typography>
                        </div>
                    </div>
                }
                size="sm"
                footer={
                    <div className="flex gap-3 w-full">
                        <Button variant="outline" onClick={() => setIsAddModalOpen(false)} className="flex-1">
                            Cancel
                        </Button>
                        <Button
                            variant="primary"
                            onClick={handleCreateTable}
                            disabled={isSubmitting || !newTableNumber.trim()}
                            className="flex-1"
                        >
                            {isSubmitting ? <><Loader2 size={16} className="animate-spin" /> Creating...</> : "Generate QR"}
                        </Button>
                    </div>
                }
            >
                <div className="pt-2">
                    <Input
                        label="Table Number or Name"
                        required
                        type="text"
                        placeholder="e.g., 1, 12, T-05..."
                        value={newTableNumber}
                        onChange={(e) => setNewTableNumber(e.target.value)}
                        autoFocus
                    />
                </div>
            </Modal>

            <Modal
                isOpen={isMarketingModalOpen}
                onClose={() => setIsMarketingModalOpen(false)}
                title={
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-emerald-100 text-[#1A4D2E] flex items-center justify-center">
                            <Megaphone size={20} />
                        </div>
                        <div>
                            <Typography variant="h5" className="text-lg">New Marketing QR</Typography>
                            <Typography variant="small" className="text-[11px]">Generate a branded QR with your logo.</Typography>
                        </div>
                    </div>
                }
                size="sm"
                footer={
                    <div className="flex gap-3 w-full">
                        <Button variant="outline" onClick={() => setIsMarketingModalOpen(false)} className="flex-1">
                            Cancel
                        </Button>
                        <Button
                            variant="primary"
                            onClick={handleGenerateMarketingQR}
                            disabled={isGeneratingQR || !marketingName.trim() || !marketingUrl.trim()}
                            className="flex-1"
                        >
                            {isGeneratingQR ? <><Loader2 size={16} className="animate-spin" /> Generating...</> : "Generate QR"}
                        </Button>
                    </div>
                }
            >
                <div className="space-y-4 pt-2">
                    <Input
                        label="QR Name"
                        required
                        type="text"
                        placeholder="e.g., Download App, Instagram Page..."
                        value={marketingName}
                        onChange={(e) => setMarketingName(e.target.value)}
                        autoFocus
                    />
                    <Input
                        label="Destination URL"
                        required
                        type="url"
                        placeholder="https://..."
                        value={marketingUrl}
                        onChange={(e) => setMarketingUrl(e.target.value)}
                    />
                    <Input
                        label={
                            <span className="flex items-center gap-1.5">
                                <ImagePlus size={14} /> Logo URL <span className="lowercase font-normal text-slate-400">(optional)</span>
                            </span>
                        }
                        type="url"
                        placeholder="https://... (leave blank for plain QR)"
                        value={marketingLogoUrl}
                        onChange={(e) => setMarketingLogoUrl(e.target.value)}
                    />
                </div>
            </Modal>

            <Modal
                isOpen={confirmModal.show}
                onClose={() => setConfirmModal({ show: false, bookingId: null })}
                size="sm"
                showCloseButton={false}
            >
                <div className="flex flex-col items-center text-center space-y-4 pt-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-600">
                        <AlertCircle size={24} />
                    </div>
                    <div>
                        <Typography variant="h4" className="text-xl">Cancel Reservation?</Typography>
                        <Typography variant="small" className="mt-2 text-sm text-slate-600">
                            Are you sure you want to cancel this booking? This action cannot be undone.
                        </Typography>
                    </div>
                    <div className="flex items-center justify-center gap-3 pt-2 w-full">
                        <Button
                            variant="outline"
                            onClick={() => setConfirmModal({ show: false, bookingId: null })}
                            className="flex-1 !border-slate-200 hover:!bg-slate-50"
                        >
                            Keep It
                        </Button>
                        <Button
                            variant="danger"
                            onClick={executeCancelBooking}
                            className="flex-1"
                        >
                            Yes, Cancel
                        </Button>
                    </div>
                </div>
            </Modal>

            <Modal
                isOpen={deleteQrModal.show}
                onClose={() => setDeleteQrModal({ show: false, qrId: null })}
                size="sm"
                showCloseButton={false}
            >
                <div className="flex flex-col items-center text-center space-y-4 pt-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-100 text-rose-600">
                        <Trash2 size={24} />
                    </div>
                    <div>
                        <Typography variant="h4" className="text-xl">Delete QR Code?</Typography>
                        <Typography variant="small" className="mt-2 text-sm text-slate-600">
                            Are you sure you want to delete this marketing QR? The code will no longer work.
                        </Typography>
                    </div>
                    <div className="flex items-center justify-center gap-3 pt-2 w-full">
                        <Button
                            variant="outline"
                            onClick={() => setDeleteQrModal({ show: false, qrId: null })}
                            className="flex-1 !border-slate-200 hover:!bg-slate-50"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="danger"
                            onClick={executeDeleteMarketingQR}
                            className="flex-1"
                        >
                            Yes, Delete
                        </Button>
                    </div>
                </div>
            </Modal>

            <Modal
                isOpen={popupModal.show}
                onClose={() => setPopupModal({ show: false, title: "", message: "", type: "error" })}
                size="sm"
                showCloseButton={false}
            >
                <div className="flex flex-col items-center text-center space-y-4 pt-4">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-2xl shadow-inner ${popupModal.type === 'success' ? 'bg-emerald-100 text-[#1A4D2E]' : 'bg-rose-100 text-rose-600'}`}>
                        {popupModal.type === 'success' ? <Check size={24} /> : <AlertCircle size={24} />}
                    </div>
                    <div className="space-y-1">
                        <Typography variant="h4" className="text-xl">{popupModal.title}</Typography>
                        <Typography variant="p" className="text-sm leading-relaxed text-slate-600">{popupModal.message}</Typography>
                    </div>
                    <Button
                        variant="primary"
                        onClick={() => setPopupModal({ show: false, title: "", message: "", type: "error" })}
                        className="w-full mt-2"
                    >
                        Understood
                    </Button>
                </div>
            </Modal>
        </motion.div>
    );
}