import React, { useEffect, useState, useMemo } from "react";
import {
    Search,
    Loader2,
    AlertCircle,
    ChevronDown,
    ChevronUp,
    IndianRupee,
    Tag,
    Printer,
    CheckSquare,
    Square,
    UtensilsCrossed,
    ShoppingBag,
    Truck,
    Ban,
    FileText,
    MonitorSmartphone,
    X
} from "lucide-react";

// UI Components
import Typography from "../../../components/UI/Typography";
import Button from "../../../components/UI/Button";
import Input from "../../../components/UI/Input";
import Card from "../../../components/UI/Card";
import Badge from "../../../components/UI/Badge";
import EmptyState from "../../../components/UI/EmptyState";

import { generateBulkBillsPDF, generateOrderBillPDF } from "../../../util/generateBill";
import { getStore } from "../../../api/customerApi";
import CounterBilling from "./CounterBilling";

const API_BASE = import.meta.env.VITE_API_URL || "";

const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });
};

const getPaymentBadge = (status) => {
    switch (status?.toLowerCase()) {
        case "paid":
            return "success";
        case "failed":
        case "cancelled":
            return "danger";
        default:
            return "warning";
    }
};

const getOrderTypeIcon = (type) => {
    switch (type) {
        case "dine-in":
            return <UtensilsCrossed size={16} />;
        case "takeaway":
            return <ShoppingBag size={16} />;
        default:
            return <Truck size={16} />;
    }
};

const calculateItemTotal = (item) => {
    const base = (item.price || 0) + (item.variant?.price_delta || 0);
    const addonsTotal = (item.addons || []).reduce((sum, a) => sum + (a.price || 0), 0);
    return (base + addonsTotal) * (item.quantity || 1);
};

export default function Billing() {
    const [activeTab, setActiveTab] = useState("overview");

    const [orders, setOrders] = useState([]);
    const [storeProfile, setStoreProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [search, setSearch] = useState("");
    const [paymentFilter, setPaymentFilter] = useState("all");
    const [methodFilter, setMethodFilter] = useState("all");
    const [typeFilter, setTypeFilter] = useState("all");
    const [dateFilter, setDateFilter] = useState("all");

    const [expandedId, setExpandedId] = useState(null);
    const [printingId, setPrintingId] = useState(null);

    const [selectedOrders, setSelectedOrders] = useState([]);
    const [isBulkPrinting, setIsBulkPrinting] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const fetchBilling = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_BASE}/orders/billing`, {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
            });

            const data = await res.json();
            if (!res.ok || !data.success) {
                throw new Error(data.message || "Failed to fetch billing details");
            }
            setOrders(data.billing || []);
            setSelectedOrders([]);
        } catch (err) {
            setError(err.message || "Something went wrong while fetching billing details");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBilling();
        getStore()
            .then((res) => {
                if (res?.data?.success && res.data.data) {
                    setStoreProfile(res.data.data);
                }
            })
            .catch((err) => console.error("Failed to fetch store profile:", err));
    }, []);

    useEffect(() => {
        document.body.style.overflow = expandedId ? "hidden" : "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [expandedId]);

    const filteredOrders = useMemo(() => {
        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
        const weekStart = todayStart - 6 * 24 * 60 * 60 * 1000;
        const monthStart = todayStart - 29 * 24 * 60 * 60 * 1000;

        return orders.filter((order) => {
            const matchesSearch =
                !search ||
                order.customer_name?.toLowerCase().includes(search.toLowerCase()) ||
                order.customer_phone?.includes(search);
            const matchesPayment =
                paymentFilter === "all" || order.payment_status === paymentFilter;
            const matchesType =
                typeFilter === "all" || order.order_type === typeFilter;

            const method = (order.payment_method || "").toLowerCase();
            const isCash = method.includes("cash") || method.includes("cod");
            const matchesMethod =
                methodFilter === "all" ||
                (methodFilter === "cash" && isCash) ||
                (methodFilter === "online" && !isCash);

            let matchesDate = true;
            if (order.createdAt) {
                const orderTime = new Date(order.createdAt).getTime();
                if (dateFilter === "today") matchesDate = orderTime >= todayStart;
                else if (dateFilter === "weekly") matchesDate = orderTime >= weekStart;
                else if (dateFilter === "monthly") matchesDate = orderTime >= monthStart;
            }

            return matchesSearch && matchesPayment && matchesMethod && matchesType && matchesDate;
        });
    }, [orders, search, paymentFilter, methodFilter, typeFilter, dateFilter]);

    useEffect(() => {
        setCurrentPage(1);
        setExpandedId(null);
    }, [search, paymentFilter, methodFilter, typeFilter, dateFilter]);

    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
    const paginatedOrders = filteredOrders.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const toggleSelect = (id) => {
        setSelectedOrders(prev =>
            prev.includes(id) ? prev.filter(orderId => orderId !== id) : [...prev, id]
        );
    };

    const toggleSelectAll = () => {
        const validOrders = filteredOrders.filter((order) => {
            const isCancelled = order.status?.toLowerCase() === "cancelled" ||
                order.order_status?.toLowerCase() === "cancelled" ||
                order.payment_status?.toLowerCase() === "cancelled";
            return !isCancelled;
        });

        if (selectedOrders.length === validOrders.length && validOrders.length > 0) {
            setSelectedOrders([]);
        } else {
            setSelectedOrders(validOrders.map(o => o._id));
        }
    };

    const handlePrintBill = async (order) => {
        setPrintingId(order._id);
        try {
            await generateOrderBillPDF(order, storeProfile);
        } catch (err) {
            console.error("Failed to generate bill:", err);
        } finally {
            setPrintingId(null);
        }
    };

    const handleBulkPrint = async () => {
        setIsBulkPrinting(true);
        try {
            const ordersToPrint = orders.filter(o => selectedOrders.includes(o._id));

            if (ordersToPrint.length > 0) {
                await generateBulkBillsPDF(ordersToPrint, storeProfile);
            }
        } catch (err) {
            console.error("Bulk print failed:", err);
        } finally {
            setIsBulkPrinting(false);
            setSelectedOrders([]);
        }
    };

    const summary = useMemo(() => {
        return filteredOrders.reduce(
            (acc, order) => {
                if (order.payment_status?.toLowerCase() === "paid") {
                    acc.totalRevenue += order.total_amount || 0;
                    acc.totalTax += order.tax_amount || 0;

                    const method = (order.payment_method || "").toLowerCase();
                    if (method.includes("cash") || method.includes("cod")) {
                        acc.totalCash += order.total_amount || 0;
                    } else {
                        acc.totalOnline += order.total_amount || 0;
                    }
                } else if (order.payment_status?.toLowerCase() === "pending") {
                    acc.totalPending += order.total_amount || 0;
                }
                return acc;
            },
            { totalRevenue: 0, totalTax: 0, totalCash: 0, totalOnline: 0, totalPending: 0 }
        );
    }, [filteredOrders]);

    const expandedOrder = useMemo(
        () => orders.find((o) => o._id === expandedId) || null,
        [orders, expandedId]
    );

    const OrderReceiptDetails = ({ order }) => (
        <Card padding="p-4 md:p-5" className="w-full shadow-none border-0 !rounded-md">
            <Typography variant="small" weight="semibold" className="uppercase tracking-wider mb-3 pb-2 border-b border-slate-100">
                Order Items
            </Typography>
            <div className="space-y-3">
                {order.items?.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-start">
                        <div>
                            <Typography variant="p" weight="medium" className="text-slate-800 text-sm">
                                {item.quantity} x {item.product_id?.name || "Item"}
                            </Typography>
                            {(item.variant?.name || item.addons?.length > 0) && (
                                <Typography variant="small" className="text-xs mt-0.5">
                                    {item.variant?.name} {item.addons?.length > 0 && `(+ ${item.addons.map(a => a.name).join(", ")})`}
                                </Typography>
                            )}
                        </div>
                        <Typography variant="small" className="text-sm">₹{calculateItemTotal(item).toFixed(0)}</Typography>
                    </div>
                ))}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                <div className="flex justify-between text-sm text-slate-500">
                    <span>Subtotal</span>
                    <span>₹{order.subtotal?.toFixed(0) || 0}</span>
                </div>
                <div className="flex justify-between text-sm text-slate-500">
                    <span>GST (Tax)</span>
                    <span>₹{order.tax_amount?.toFixed(0) || 0}</span>
                </div>
                {order.discount_amount > 0 && (
                    <div className="flex justify-between text-sm text-[#1A4D2E]">
                        <span className="flex items-center gap-1"><Tag size={14} /> Discount</span>
                        <span>-₹{order.discount_amount.toFixed(0)}</span>
                    </div>
                )}
                <div className="flex justify-between text-base font-semibold text-slate-900 pt-2 border-t border-slate-200 mt-2">
                    <span>Total</span>
                    <span>₹{order.total_amount?.toFixed(0)}</span>
                </div>
            </div>
        </Card>
    );

    return (
        <div className="w-full space-y-6 pb-12 font-sans">
            <div className="max-w-7xl mx-auto space-y-6">

                <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-5">
                    <div className="shrink-0">
                        <div>
                            <Typography variant="h3">Billing Overview</Typography>
                            <Typography variant="p">Manage and print your customer bills efficiently.</Typography>
                        </div>
                    </div>

                    {activeTab === "overview" && (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 w-full gap-3">
                            <div className="col-span-2 md:col-span-1 lg:col-span-1 bg-[#16522D] px-4 py-3 rounded-lg shadow-sm border border-[#16522D]">
                                <p className="text-[11px] text-[#F4A202] font-semibold uppercase tracking-wide">Total Revenue (Paid)</p>
                                <p className="text-lg font-bold text-white flex items-center mt-0.5">
                                    <IndianRupee size={15} className="mr-0.5" />{summary.totalRevenue.toFixed(0)}
                                </p>
                            </div>
                            <div className="bg-white px-4 py-3 rounded-lg border border-slate-200 shadow-sm border-l-4 border-l-emerald-500">
                                <p className="text-[11px] text-slate-500 font-semibold uppercase tracking-wide">Cash Received</p>
                                <p className="text-lg font-bold text-slate-900 flex items-center mt-0.5">
                                    <IndianRupee size={15} className="mr-0.5" />{summary.totalCash.toFixed(0)}
                                </p>
                            </div>
                            <div className="bg-white px-4 py-3 rounded-lg border border-slate-200 shadow-sm border-l-4 border-l-blue-500">
                                <p className="text-[11px] text-slate-500 font-semibold uppercase tracking-wide">Online Received</p>
                                <p className="text-lg font-bold text-slate-900 flex items-center mt-0.5">
                                    <IndianRupee size={15} className="mr-0.5" />{summary.totalOnline.toFixed(0)}
                                </p>
                            </div>
                            <div className="bg-white px-4 py-3 rounded-lg border border-slate-200 shadow-sm border-l-4 border-l-purple-500">
                                <p className="text-[11px] text-slate-500 font-semibold uppercase tracking-wide">Collected GST</p>
                                <p className="text-lg font-bold text-slate-900 flex items-center mt-0.5">
                                    <IndianRupee size={15} className="mr-0.5" />{summary.totalTax.toFixed(0)}
                                </p>
                            </div>
                            <div className="bg-white px-4 py-3 rounded-lg border border-slate-200 shadow-sm border-l-4 border-l-[#F4A202]">
                                <p className="text-[11px] text-slate-500 font-semibold uppercase tracking-wide">Pending Amount</p>
                                <p className="text-lg font-bold text-slate-900 flex items-center mt-0.5">
                                    <IndianRupee size={15} className="mr-0.5" />{summary.totalPending.toFixed(0)}
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex border-b border-slate-200 overflow-x-auto hide-scrollbar">
                    <button
                        onClick={() => setActiveTab("overview")}
                        className={`flex items-center gap-2 px-6 py-3 font-medium text-sm transition-colors border-b-2 whitespace-nowrap ${activeTab === "overview"
                            ? "border-[#1A4D2E] text-[#1A4D2E]"
                            : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                            }`}
                    >
                        <FileText size={16} /> Order History
                    </button>
                    <button
                        onClick={() => setActiveTab("counter")}
                        className={`flex items-center gap-2 px-6 py-3 font-medium text-sm transition-colors border-b-2 whitespace-nowrap ${activeTab === "counter"
                            ? "border-[#1A4D2E] text-[#1A4D2E]"
                            : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                            }`}
                    >
                        <MonitorSmartphone size={16} /> Counter Billing (POS)
                    </button>
                </div>

                {activeTab === "counter" ? (
                    <CounterBilling onOrderSuccess={fetchBilling} />
                ) : (
                    <>
                        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex flex-col xl:flex-row gap-4 justify-between items-center">
                            <div className="flex w-full xl:w-auto items-center gap-3">
                                <div className="w-full xl:w-72">
                                    <Input
                                        type="text"
                                        placeholder="Search customer or phone..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        leftIcon={<Search size={16} />}
                                        className="!py-2.5 !text-sm"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 lg:flex flex-wrap w-full xl:w-auto gap-2 text-sm">
                                <select
                                    value={dateFilter}
                                    onChange={(e) => setDateFilter(e.target.value)}
                                    className="flex-1 lg:flex-none border border-slate-200 bg-slate-50 rounded-md px-3 py-2 outline-none focus:ring-1 focus:ring-[#1A4D2E] focus:border-[#1A4D2E] cursor-pointer"
                                >
                                    <option value="all">All Time</option>
                                    <option value="today">Today</option>
                                    <option value="weekly">Last 7 Days</option>
                                    <option value="monthly">Last 30 Days</option>
                                </select>
                                <select
                                    value={paymentFilter}
                                    onChange={(e) => setPaymentFilter(e.target.value)}
                                    className="flex-1 lg:flex-none border border-slate-200 bg-slate-50 rounded-md px-3 py-2 outline-none focus:ring-1 focus:ring-[#1A4D2E] focus:border-[#1A4D2E] cursor-pointer"
                                >
                                    <option value="all">All Status</option>
                                    <option value="Paid">Paid</option>
                                    <option value="Pending">Pending</option>
                                    <option value="Failed">Failed</option>
                                    <option value="Cancelled">Cancelled</option>
                                </select>
                                <select
                                    value={methodFilter}
                                    onChange={(e) => setMethodFilter(e.target.value)}
                                    className="flex-1 lg:flex-none border border-slate-200 bg-slate-50 rounded-md px-3 py-2 outline-none focus:ring-1 focus:ring-[#1A4D2E] focus:border-[#1A4D2E] cursor-pointer"
                                >
                                    <option value="all">All Methods</option>
                                    <option value="cash">Cash / COD</option>
                                    <option value="online">Online</option>
                                </select>
                                <select
                                    value={typeFilter}
                                    onChange={(e) => setTypeFilter(e.target.value)}
                                    className="flex-1 lg:flex-none border border-slate-200 bg-slate-50 rounded-md px-3 py-2 outline-none focus:ring-1 focus:ring-[#1A4D2E] focus:border-[#1A4D2E] cursor-pointer capitalize"
                                >
                                    <option value="all">All Types</option>
                                    <option value="delivery">Delivery</option>
                                    <option value="dine-in">Dine-in</option>
                                    <option value="takeaway">Takeaway</option>
                                </select>
                            </div>
                        </div>

                        {error && (
                            <div className="rounded-lg bg-red-50 p-4 flex items-center gap-3 text-red-700 border border-red-200">
                                <AlertCircle size={18} />
                                <Typography variant="small" className="text-sm">{error}</Typography>
                            </div>
                        )}

                        {loading && (
                            <div className="flex flex-col items-center justify-center py-16 space-y-2 bg-white rounded-lg border border-slate-200">
                                <Loader2 className="animate-spin text-[#1A4D2E]" size={28} />
                                <Typography variant="small">Loading orders...</Typography>
                            </div>
                        )}

                        {!loading && filteredOrders.length === 0 && (
                            <EmptyState
                                icon={FileText}
                                title="No orders found"
                                description="No orders found matching your criteria."
                                className="!border-slate-200"
                            />
                        )}

                        {!loading && filteredOrders.length > 0 && (
                            <div className="hidden md:block bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden relative">
                                {selectedOrders.length > 0 && (
                                    <div className="absolute top-0 left-0 right-0 h-12 bg-[#1A4D2E] flex items-center justify-between px-4 z-10">
                                        <Typography variant="small" weight="medium" color="text-white" className="text-sm">
                                            {selectedOrders.length} order(s) selected
                                        </Typography>
                                        <button
                                            onClick={toggleSelectAll}
                                            className="text-xs text-[#F4A300] hover:text-white underline mr-auto ml-4 transition-colors"
                                        >
                                            {selectedOrders.length === filteredOrders.filter(o => !(o.status?.toLowerCase() === "cancelled" || o.order_status?.toLowerCase() === "cancelled" || o.payment_status?.toLowerCase() === "cancelled")).length ? "Deselect All" : "Select All"}
                                        </button>
                                    </div>
                                )}

                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse text-sm">
                                        <thead>
                                            <tr className="border-b border-slate-200 bg-slate-50">
                                                <th className="py-3 pl-4 pr-2 w-12">
                                                    <button onClick={toggleSelectAll} className="text-slate-400 hover:text-[#1A4D2E] transition-colors">
                                                        {selectedOrders.length > 0 && selectedOrders.length === filteredOrders.filter(o => !(o.status?.toLowerCase() === "cancelled" || o.order_status?.toLowerCase() === "cancelled" || o.payment_status?.toLowerCase() === "cancelled")).length ? (
                                                            <CheckSquare size={18} className="text-[#1A4D2E]" />
                                                        ) : (
                                                            <Square size={18} />
                                                        )}
                                                    </button>
                                                </th>
                                                <th className="py-3 px-4 font-semibold text-slate-600">Customer Info</th>
                                                <th className="py-3 px-4 font-semibold text-slate-600">Date & Time</th>
                                                <th className="py-3 px-4 font-semibold text-slate-600">Type</th>
                                                <th className="py-3 px-4 font-semibold text-slate-600">Status</th>
                                                <th className="py-3 px-4 font-semibold text-slate-600">Total</th>
                                                <th className="py-3 px-4 font-semibold text-slate-600 text-right">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {paginatedOrders.map((order) => {
                                                const isSelected = selectedOrders.includes(order._id);
                                                const isCancelled = order.status?.toLowerCase() === "cancelled" ||
                                                    order.order_status?.toLowerCase() === "cancelled" ||
                                                    order.payment_status?.toLowerCase() === "cancelled";
                                                const isExpanded = expandedId === order._id;

                                                return (
                                                    <tr key={order._id} className={`hover:bg-slate-50 transition-colors ${isSelected ? 'bg-[#1A4D2E]/5' : ''} ${isCancelled ? 'opacity-60 bg-slate-50' : ''} ${isExpanded ? 'bg-[#1A4D2E]/5' : ''}`}>
                                                        <td className="py-3 pl-4 pr-2">
                                                            <button
                                                                onClick={() => !isCancelled && toggleSelect(order._id)}
                                                                disabled={isCancelled}
                                                                className={`text-slate-400 ${isCancelled ? 'cursor-not-allowed opacity-50' : 'hover:text-[#1A4D2E]'}`}
                                                            >
                                                                {isSelected ? <CheckSquare size={18} className="text-[#1A4D2E]" /> : <Square size={18} />}
                                                            </button>
                                                        </td>
                                                        <td className="py-3 px-4">
                                                            <p className={`font-medium text-slate-900 ${isCancelled ? 'line-through text-slate-500' : ''}`}>{order.customer_name || "Guest"}</p>
                                                            <p className="text-xs text-slate-500">{order.customer_phone || "No phone"}</p>
                                                        </td>
                                                        <td className="py-3 px-4 text-slate-600">{formatDate(order.createdAt)}</td>
                                                        <td className="py-3 px-4 capitalize text-slate-700">
                                                            <div className="flex items-center gap-2">
                                                                {getOrderTypeIcon(order.order_type)}
                                                                {order.order_type}
                                                            </div>
                                                        </td>
                                                        <td className="py-3 px-4">
                                                            <Badge
                                                                variant={isCancelled ? "danger" : getPaymentBadge(order.payment_status)}
                                                                size="sm"
                                                                className="!text-[11px] !uppercase"
                                                            >
                                                                {isCancelled ? "Cancelled" : order.payment_status}
                                                            </Badge>
                                                        </td>
                                                        <td className="py-3 px-4 font-semibold text-slate-900">
                                                            ₹{order.total_amount?.toFixed(0)}
                                                        </td>
                                                        <td className="py-3 px-4 text-right">
                                                            <div className="flex items-center justify-end gap-2">
                                                                <button
                                                                    onClick={(e) => { e.stopPropagation(); handlePrintBill(order); }}
                                                                    disabled={printingId === order._id || isBulkPrinting || isCancelled}
                                                                    className={`p-1.5 rounded-md transition-colors ${isCancelled ? 'text-slate-300 cursor-not-allowed' : 'text-slate-500 hover:text-[#1A4D2E] hover:bg-[#1A4D2E]/10'}`}
                                                                    title={isCancelled ? "Cannot print cancelled order" : "Quick Print"}
                                                                >
                                                                    {printingId === order._id ? <Loader2 size={16} className="animate-spin" /> : isCancelled ? <Ban size={16} /> : <Printer size={16} />}
                                                                </button>
                                                                <button
                                                                    onClick={() => setExpandedId(isExpanded ? null : order._id)}
                                                                    className={`p-1.5 rounded-md transition-colors ${isExpanded ? 'bg-[#1A4D2E]/10 text-[#1A4D2E]' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200'}`}
                                                                >
                                                                    {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {!loading && filteredOrders.length > 0 && (
                            <div className="block md:hidden space-y-3">
                                <div className="flex items-center justify-between px-1 mb-2">
                                    <span className="text-sm font-medium text-slate-600">All Orders</span>
                                    <button onClick={toggleSelectAll} className="text-sm font-semibold text-[#1A4D2E]">
                                        {selectedOrders.length > 0 && selectedOrders.length === filteredOrders.filter(o => !(o.status?.toLowerCase() === "cancelled" || o.order_status?.toLowerCase() === "cancelled" || o.payment_status?.toLowerCase() === "cancelled")).length ? "Deselect All" : "Select All"}
                                    </button>
                                </div>

                                {paginatedOrders.map((order) => {
                                    const isSelected = selectedOrders.includes(order._id);
                                    const isCancelled = order.status?.toLowerCase() === "cancelled" ||
                                        order.order_status?.toLowerCase() === "cancelled" ||
                                        order.payment_status?.toLowerCase() === "cancelled";
                                    const isExpanded = expandedId === order._id;

                                    return (
                                        <div
                                            key={order._id}
                                            className={`bg-white rounded-xl border transition-all ${isSelected || isExpanded ? 'border-[#1A4D2E] ring-1 ring-[#1A4D2E] shadow-md' : 'border-slate-200 shadow-sm'} ${isCancelled ? 'opacity-70' : ''}`}
                                        >
                                            <div className="p-4 flex flex-col gap-3">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <button
                                                            onClick={() => !isCancelled && toggleSelect(order._id)}
                                                            disabled={isCancelled}
                                                            className={`pt-0.5 ${isCancelled ? 'text-slate-300' : 'text-slate-400'}`}
                                                        >
                                                            {isSelected ? <CheckSquare size={20} className="text-[#1A4D2E]" /> : <Square size={20} />}
                                                        </button>
                                                        <div>
                                                            <p className={`font-semibold text-slate-900 text-base ${isCancelled ? 'line-through text-slate-500' : ''}`}>{order.customer_name || "Guest"}</p>
                                                            <p className="text-xs text-slate-500">{order.customer_phone || "No phone"}</p>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handlePrintBill(order); }}
                                                        disabled={printingId === order._id || isBulkPrinting || isCancelled}
                                                        className={`p-2 rounded-lg transition-colors ${isCancelled ? 'bg-slate-100 text-slate-300' : isSelected ? 'bg-[#1A4D2E]/10 text-[#1A4D2E]' : 'bg-slate-100 text-slate-600'} disabled:opacity-50`}
                                                    >
                                                        {printingId === order._id ? <Loader2 size={18} className="animate-spin" /> : isCancelled ? <Ban size={18} /> : <Printer size={18} />}
                                                    </button>
                                                </div>

                                                <div className="flex items-center justify-between pl-8">
                                                    <div className="flex items-center gap-2">
                                                        <Badge
                                                            variant={isCancelled ? "danger" : getPaymentBadge(order.payment_status)}
                                                            size="sm"
                                                            className="!text-[10px] !uppercase"
                                                        >
                                                            {isCancelled ? "Cancelled" : order.payment_status}
                                                        </Badge>
                                                        <span className="text-xs text-slate-500 capitalize flex items-center gap-1">
                                                            {getOrderTypeIcon(order.order_type)} {order.order_type}
                                                        </span>
                                                    </div>
                                                    <span className="text-xs text-slate-500">{formatDate(order.createdAt).split(',')[1]}</span>
                                                </div>

                                                <div className="flex items-center justify-between pl-8 pt-2 border-t border-slate-100">
                                                    <span className="font-bold text-slate-900 text-lg flex items-center">
                                                        <IndianRupee size={15} className="mr-0.5" />{order.total_amount?.toFixed(0)}
                                                    </span>
                                                    <button
                                                        onClick={() => setExpandedId(isExpanded ? null : order._id)}
                                                        className="flex items-center gap-1 text-sm font-medium text-[#1A4D2E]"
                                                    >
                                                        {isExpanded ? "Hide" : "Details"}
                                                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {!loading && filteredOrders.length > itemsPerPage && (
                            <div className="flex flex-col sm:flex-row items-center justify-between pt-4 pb-2 border-t border-slate-200 mt-6">
                                <Typography variant="small" className="text-sm mb-4 sm:mb-0">
                                    Showing <span className="font-semibold text-slate-900">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-semibold text-slate-900">{Math.min(currentPage * itemsPerPage, filteredOrders.length)}</span> of <span className="font-semibold text-slate-900">{filteredOrders.length}</span> orders
                                </Typography>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                        disabled={currentPage === 1}
                                        className="!h-9 !text-sm !font-medium !bg-white hover:!bg-slate-50"
                                    >
                                        Previous
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                        disabled={currentPage === totalPages}
                                        className="!h-9 !text-sm !font-medium !bg-white hover:!bg-slate-50"
                                    >
                                        Next
                                    </Button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {selectedOrders.length > 0 && activeTab === "overview" && (
                <div className="fixed bottom-0 left-0 right-0 bg-[#1A4D2E] border-t border-[#1A4D2E] shadow-[0_-10px_30px_rgba(26,77,46,0.2)] z-50 animate-in slide-in-from-bottom-4">
                    <div className="max-w-7xl mx-auto p-4 flex items-center justify-between gap-4">
                        <div className="text-white">
                            <p className="font-semibold">{selectedOrders.length} Selected</p>
                            <p className="text-xs text-slate-300 hidden md:block">Ready to print bills.</p>
                        </div>

                        <Button
                            variant="secondary"
                            onClick={handleBulkPrint}
                            disabled={isBulkPrinting}
                            className="!h-10 !text-sm shadow-md"
                        >
                            {isBulkPrinting ? (
                                <>
                                    <Loader2 size={18} className="animate-spin text-[#1A4D2E]" />
                                    Printing...
                                </>
                            ) : (
                                <>
                                    <Printer size={18} />
                                    Print Bills
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            )}

            <div
                className={`fixed inset-0 z-[60] transition-opacity duration-300 ${expandedOrder ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
            >
                <div
                    className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"
                    onClick={() => setExpandedId(null)}
                />
                <div
                    className={`absolute top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-out ${expandedOrder ? "translate-x-0" : "translate-x-full"}`}
                >
                    <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 shrink-0">
                        <div>
                            <Typography variant="h4" className="text-slate-900">Order Details</Typography>
                            {expandedOrder && (
                                <Typography variant="small" className="text-xs text-slate-500 mt-0.5">
                                    {expandedOrder.customer_name || "Guest"} · {formatDate(expandedOrder.createdAt)}
                                </Typography>
                            )}
                        </div>
                        <button
                            onClick={() => setExpandedId(null)}
                            className="p-2 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        {expandedOrder && <OrderReceiptDetails order={expandedOrder} />}
                    </div>

                    {expandedOrder && (
                        <div className="px-5 py-4 border-t border-slate-200 shrink-0">
                            <Button
                                variant="primary"
                                onClick={() => handlePrintBill(expandedOrder)}
                                disabled={printingId === expandedOrder._id}
                                className="!w-full !h-10 !text-sm"
                            >
                                {printingId === expandedOrder._id ? (
                                    <>
                                        <Loader2 size={16} className="animate-spin" />
                                        Printing...
                                    </>
                                ) : (
                                    <>
                                        <Printer size={16} />
                                        Print Bill
                                    </>
                                )}
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}