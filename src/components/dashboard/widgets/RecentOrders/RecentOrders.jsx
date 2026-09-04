import OrderItem from "./OrderItem";

export default function RecentOrders({ orders = [], loading = false }) {
  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="h-40 animate-pulse rounded-xl bg-slate-100" />
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-base font-semibold text-slate-900">Recent Purchases</h3>
        <div className="flex h-32 items-center justify-center text-sm text-slate-400">
          No recent customer purchases recorded yet.
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-base font-semibold text-slate-900">Recent Purchases</h3>
      <div className="space-y-2">
        {orders.slice(0, 5).map((order) => (
          <OrderItem key={order._id || order.id} order={order} />
        ))}
      </div>
    </div>
  );
}