import { useMemo, useState } from "react";
import { Search, Filter, CreditCard, CheckCircle2, Clock3, IndianRupee, TrendingUp } from "lucide-react";

import Typography from "../../../components/UI/Typography";
import Card from "../../../components/UI/Card";
import Badge from "../../../components/UI/Badge";
import Input from "../../../components/UI/Input";

export default function CODPaymentTable({ orders = [] }) {
  const tableData = useMemo(() => orders ?? [], [orders]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");

  const filteredOrders = useMemo(() => {
    return tableData.filter((order) => {
      const matchesSearch = `${order.orderId} ${order.customer}`
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesStatus = statusFilter === "all" ? true : order.status === statusFilter;
      const matchesPayment = paymentFilter === "all" ? true : order.payment === paymentFilter;
      return matchesSearch && matchesStatus && matchesPayment;
    });
  }, [tableData, search, statusFilter, paymentFilter]);

  const stats = useMemo(() => {
    const total = tableData.length;
    const paid = tableData.filter((o) => o.status === "Paid").length;
    const unpaid = tableData.filter((o) => o.status !== "Paid").length;
    const totalRevenue = tableData.reduce((sum, item) => sum + (item.amount || 0), 0);
    const paidRevenue = tableData
      .filter((o) => o.status === "Paid")
      .reduce((sum, item) => sum + (item.amount || 0), 0);
    return { total, paid, unpaid, totalRevenue, paidRevenue };
  }, [tableData]);

  return (
    <Card padding="p-6" className="shadow-sm">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <Typography variant="h3" className="text-xl sm:text-2xl">COD Payment Tracking</Typography>
          <Typography variant="small" className="mt-1 text-sm">
            Payment status updates automatically when a COD order is marked Delivered.
          </Typography>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <div className="w-full sm:w-64">
            <Input
              type="text"
              placeholder="Search order or customer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              leftIcon={<Search size={16} />}
              className="!py-2"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-[42px] rounded-xl border border-slate-200 px-3 text-sm font-medium outline-none focus:border-[#1A4D2E] focus:ring-4 focus:ring-[#1A4D2E]/10 cursor-pointer transition-all"
          >
            <option value="all">All Status</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
          </select>
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="h-[42px] rounded-xl border border-slate-200 px-3 text-sm font-medium outline-none focus:border-[#1A4D2E] focus:ring-4 focus:ring-[#1A4D2E]/10 cursor-pointer transition-all"
          >
            <option value="all">All Payments</option>
            <option value="COD">COD</option>
            <option value="ONLINE">Online</option>
          </select>
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <Card padding="p-4" className="!bg-slate-50/60 !border-slate-100">
          <div className="flex items-center justify-between">
            <Typography variant="small" weight="medium" className="text-xs">Total Orders</Typography>
            <Filter size={15} className="text-slate-400" />
          </div>
          <Typography variant="h3" className="mt-2 text-xl">{stats.total}</Typography>
        </Card>
        <Card padding="p-4" className="!bg-slate-50/60 !border-slate-100">
          <div className="flex items-center justify-between">
            <Typography variant="small" weight="medium" className="text-xs">Paid</Typography>
            <CheckCircle2 size={15} className="text-emerald-600" />
          </div>
          <Typography variant="h3" className="mt-2 text-xl">{stats.paid}</Typography>
        </Card>
        <Card padding="p-4" className="!bg-slate-50/60 !border-slate-100">
          <div className="flex items-center justify-between">
            <Typography variant="small" weight="medium" className="text-xs">Pending</Typography>
            <Clock3 size={15} className="text-rose-600" />
          </div>
          <Typography variant="h3" className="mt-2 text-xl">{stats.unpaid}</Typography>
        </Card>
        <Card padding="p-4" className="!bg-slate-50/60 !border-slate-100">
          <div className="flex items-center justify-between">
            <Typography variant="small" weight="medium" className="text-xs">Revenue</Typography>
            <IndianRupee size={15} className="text-sky-600" />
          </div>
          <Typography variant="h3" className="mt-2 text-xl">₹{stats.totalRevenue.toLocaleString("en-IN")}</Typography>
        </Card>
        <Card padding="p-4" className="!bg-slate-50/60 !border-slate-100">
          <div className="flex items-center justify-between">
            <Typography variant="small" weight="medium" className="text-xs">Collected</Typography>
            <TrendingUp size={15} className="text-amber-600" />
          </div>
          <Typography variant="h3" className="mt-2 text-xl">₹{stats.paidRevenue.toLocaleString("en-IN")}</Typography>
        </Card>
      </div>

      <div className="mt-8 hidden overflow-x-auto xl:block border border-slate-100 rounded-2xl">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50">
              <th className="px-5 py-4 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wide">Order ID</th>
              <th className="px-5 py-4 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wide">Customer</th>
              <th className="px-5 py-4 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wide">Payment</th>
              <th className="px-5 py-4 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wide">Amount</th>
              <th className="px-5 py-4 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wide">Time</th>
              <th className="px-5 py-4 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wide">Delivery</th>
              <th className="px-5 py-4 text-right text-[11px] font-bold text-slate-500 uppercase tracking-wide">Payment Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order.orderId} className="border-b border-slate-50 transition hover:bg-slate-50 bg-white">
                <td className="px-5 py-4 text-sm font-semibold text-slate-900">{order.orderId?.slice(-8)}</td>
                <td className="px-5 py-4 text-sm text-slate-700">{order.customer}</td>
                <td className="px-5 py-4">
                  <Badge variant={order.payment === "COD" ? "warning" : "success"} size="sm" className="!text-[10px]">
                    {order.payment}
                  </Badge>
                </td>
                <td className="px-5 py-4 text-sm font-bold text-slate-900">₹{(order.amount || 0).toLocaleString("en-IN")}</td>
                <td className="px-5 py-4 text-sm text-slate-500">{order.time}</td>
                <td className="px-5 py-4 text-sm text-slate-500">{order.deliveryStatus}</td>
                <td className="px-5 py-4 text-right">
                  <Badge variant={order.status === "Paid" ? "success" : "danger"} size="md" className="!px-2.5 !py-1 !text-[11px]">
                    {order.status === "Paid" ? <CheckCircle2 size={12} className="mr-1" /> : <Clock3 size={12} className="mr-1" />}
                    {order.status}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 space-y-3 xl:hidden">
        {filteredOrders.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 p-10 text-center">
            <CreditCard size={36} className="mx-auto text-slate-300" />
            <Typography variant="h6" className="mt-3 text-sm">No orders found</Typography>
            <Typography variant="small" className="mt-1 text-xs">Try changing the search or filter.</Typography>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <Card key={order.orderId} padding="p-4" className="shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <Typography variant="h6" className="text-sm">{order.customer}</Typography>
                  <Typography variant="small" className="mt-0.5 text-xs">{order.orderId?.slice(-8)}</Typography>
                </div>
                <Badge variant={order.payment === "COD" ? "warning" : "success"} size="sm" className="!text-[10px]">
                  {order.payment}
                </Badge>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div>
                  <Typography variant="small" className="text-[10px]">Amount</Typography>
                  <Typography variant="h6" className="mt-0.5 text-sm">₹{(order.amount || 0).toLocaleString("en-IN")}</Typography>
                </div>
                <div>
                  <Typography variant="small" className="text-[10px]">Time</Typography>
                  <Typography variant="h6" className="mt-0.5 text-sm">{order.time}</Typography>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div>
                  <Typography variant="small" className="text-[10px]">Delivery</Typography>
                  <Typography variant="p" weight="medium" className="mt-0.5 text-xs">{order.deliveryStatus}</Typography>
                </div>
                <Badge variant={order.status === "Paid" ? "success" : "danger"} size="md" className="!px-2.5 !py-1 !text-[11px]">
                  {order.status === "Paid" ? <CheckCircle2 size={12} className="mr-1" /> : <Clock3 size={12} className="mr-1" />}
                  {order.status}
                </Badge>
              </div>
            </Card>
          ))
        )}
      </div>

      {filteredOrders.length === 0 && (
        <div className="mt-8 hidden rounded-2xl border border-dashed border-slate-200 p-14 text-center xl:block">
          <CreditCard size={40} className="mx-auto text-slate-300" />
          <Typography variant="h4" className="mt-4 text-lg">No orders found</Typography>
          <Typography variant="small" className="mt-1 text-sm">No payment records match your current filters.</Typography>
        </div>
      )}
    </Card>
  );
}