import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Search,
  X,
  Loader2,
  Phone,
  MapPin,
  Star,
  ShoppingBag,
  IndianRupee,
  TrendingUp,
  Calendar,
  ChevronRight,
} from "lucide-react";

import useCustomerInsightsStore from "../../../store/customerInsightsStore";

export default function CustomersSection() {
  const customers = useCustomerInsightsStore((s) => s.customers);
  const loadingCustomers = useCustomerInsightsStore((s) => s.loadingCustomers);
  const customersError = useCustomerInsightsStore((s) => s.customersError);
  const fetchCustomers = useCustomerInsightsStore((s) => s.fetchCustomers);

  const customerDetails = useCustomerInsightsStore((s) => s.customerDetails);
  const loadingDetails = useCustomerInsightsStore((s) => s.loadingDetails);
  const detailsError = useCustomerInsightsStore((s) => s.detailsError);
  const fetchCustomerDetails = useCustomerInsightsStore((s) => s.fetchCustomerDetails);
  const clearCustomerDetails = useCustomerInsightsStore((s) => s.clearCustomerDetails);

  const [search, setSearch] = useState("");
  const [selectedPhone, setSelectedPhone] = useState(null);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const filteredCustomers = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return customers;
    return customers.filter(
      (c) => (c.name || "").toLowerCase().includes(q) || (c.phone || "").includes(q)
    );
  }, [customers, search]);

  const openCustomer = (phone) => {
    setSelectedPhone(phone);
    fetchCustomerDetails(phone);
  };

  const closeModal = () => {
    setSelectedPhone(null);
    clearCustomerDetails();
  };

  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-xs space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
            <Users size={18} />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">Customers</h3>
            <p className="text-[11px] text-slate-400">{customers.length} total customers</p>
          </div>
        </div>

        <div className="relative sm:w-64">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-xs font-medium outline-none focus:border-emerald-500 transition"
          />
        </div>
      </div>

      {loadingCustomers ? (
        <div className="flex items-center justify-center py-14">
          <Loader2 size={22} className="animate-spin text-emerald-600" />
        </div>
      ) : customersError ? (
        <div className="py-10 text-center">
          <p className="text-xs font-semibold text-rose-600">{customersError}</p>
          <button onClick={() => fetchCustomers()} className="mt-2 text-xs font-bold text-emerald-700 hover:underline cursor-pointer">
            Retry
          </button>
        </div>
      ) : filteredCustomers.length === 0 ? (
        <p className="py-10 text-center text-xs text-slate-400 font-medium">No customers found.</p>
      ) : (
        <div className="max-h-[420px] overflow-y-auto space-y-2 pr-1">
          {filteredCustomers.map((c) => (
            <button
              key={c.phone || c.id}
              onClick={() => openCustomer(c.phone)}
              className="w-full flex items-center justify-between gap-3 rounded-2xl border border-slate-100 p-3 text-left hover:bg-slate-50 transition cursor-pointer"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 font-bold text-sm">
                  {(c.name || "C").charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-900 truncate">{c.name || "Customer"}</p>
                  <p className="text-[11px] text-slate-400">{c.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-600">
                  {c.orders || c.orders_count || 0} orders
                </span>
                <ChevronRight size={15} className="text-slate-300" />
              </div>
            </button>
          ))}
        </div>
      )}

      {/* 🟢 Customer Details Modal */}
      <AnimatePresence>
        {selectedPhone && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl relative"
            >
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition cursor-pointer"
              >
                <X size={18} />
              </button>

              {loadingDetails ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 size={26} className="animate-spin text-emerald-600" />
                </div>
              ) : detailsError ? (
                <div className="py-20 text-center">
                  <p className="text-sm font-semibold text-rose-600">{detailsError}</p>
                </div>
              ) : customerDetails ? (
                <>
                  {/* Header */}
                  <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 font-black text-xl shrink-0">
                      {(customerDetails.customer?.name || "C").charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-lg font-black text-slate-900 truncate">
                        {customerDetails.customer?.name || "Customer"}
                      </h3>
                      <p className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mt-0.5">
                        <Phone size={12} /> {customerDetails.customer?.phone}
                      </p>
                    </div>
                  </div>

                  {/* Stat cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                    <StatCard icon={ShoppingBag} label="Total Orders" value={customerDetails.stats?.totalOrders ?? 0} color="blue" />
                    <StatCard icon={IndianRupee} label="Total Spent" value={`₹${customerDetails.stats?.totalSpent ?? 0}`} color="emerald" />
                    <StatCard icon={TrendingUp} label="Avg Order" value={`₹${customerDetails.stats?.avgOrderValue ?? 0}`} color="amber" />
                    <StatCard icon={Star} label="Loyalty Stamps" value={customerDetails.customer?.stamps_earned ?? 0} color="purple" />
                  </div>

                  {/* Address */}
                  {customerDetails.customer?.default_address && (
                    <div className="mt-4 flex items-start gap-2 rounded-2xl border border-slate-100 bg-slate-50/60 p-3.5">
                      <MapPin size={15} className="text-emerald-700 mt-0.5 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-800">
                          {customerDetails.customer?.default_mohalla || "Default Address"}
                        </p>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {customerDetails.customer.default_address}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Top ordered products */}
                  <div className="mt-5">
                    <h4 className="text-xs font-bold uppercase text-slate-400 mb-2">Most Ordered Items</h4>
                    {customerDetails.stats?.topProducts?.length > 0 ? (
                      <div className="space-y-2">
                        {customerDetails.stats.topProducts.map((p, idx) => (
                          <div key={idx} className="flex items-center justify-between rounded-xl border border-slate-100 px-3 py-2">
                            <p className="text-xs font-semibold text-slate-800">{idx + 1}. {p.name}</p>
                            <span className="text-[11px] font-bold text-emerald-700">
                              {p.quantityOrdered}x &middot; {p.timesOrdered} orders
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400">No product data yet.</p>
                    )}
                  </div>

                  {/* Last order */}
                  <div className="mt-5">
                    <h4 className="text-xs font-bold uppercase text-slate-400 mb-2">Last Order</h4>
                    {customerDetails.lastOrder ? (
                      <div className="rounded-2xl border border-slate-100 p-3.5">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-bold text-emerald-700">
                            #{String(customerDetails.lastOrder._id).slice(-6).toUpperCase()}
                          </p>
                          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                            {customerDetails.lastOrder.delivery_status}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                          <Calendar size={11} />
                          {customerDetails.lastOrder.createdAt
                            ? new Date(customerDetails.lastOrder.createdAt).toLocaleString("en-IN", {
                                day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
                              })
                            : "—"}
                        </p>
                        <p className="text-xs font-bold text-slate-900 mt-1.5">
                          ₹{customerDetails.lastOrder.total_amount} &middot; {(customerDetails.lastOrder.items || []).length} item(s)
                        </p>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400">No orders yet.</p>
                    )}
                  </div>

                  {/* Full order history (collapsed list) */}
                  {customerDetails.orders?.length > 1 && (
                    <div className="mt-5">
                      <h4 className="text-xs font-bold uppercase text-slate-400 mb-2">
                        All Orders ({customerDetails.orders.length})
                      </h4>
                      <div className="max-h-52 overflow-y-auto space-y-1.5 pr-1">
                        {customerDetails.orders.map((o) => (
                          <div key={o._id} className="flex items-center justify-between rounded-xl border border-slate-100 px-3 py-2">
                            <p className="text-[11px] font-bold text-slate-700">
                              #{String(o._id).slice(-6).toUpperCase()}
                            </p>
                            <p className="text-[11px] text-slate-500">
                              {o.createdAt ? new Date(o.createdAt).toLocaleDateString("en-IN") : ""}
                            </p>
                            <p className="text-[11px] font-bold text-slate-900">₹{o.total_amount}</p>
                            <span className="text-[10px] font-bold text-slate-500">{o.delivery_status}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : null}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }) {
  const colorMap = {
    blue: "bg-blue-50 text-blue-600",
    emerald: "bg-emerald-50 text-emerald-700",
    amber: "bg-amber-50 text-amber-600",
    purple: "bg-purple-50 text-purple-600",
  };
  return (
    <div className="rounded-2xl border border-slate-100 p-3">
      <div className={`flex h-8 w-8 items-center justify-center rounded-lg mb-2 ${colorMap[color]}`}>
        <Icon size={15} />
      </div>
      <p className="text-sm font-black text-slate-900">{value}</p>
      <p className="text-[10px] text-slate-400 font-semibold">{label}</p>
    </div>
  );
}