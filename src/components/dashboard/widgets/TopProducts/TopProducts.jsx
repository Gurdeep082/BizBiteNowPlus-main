

export default function TopProducts({ products = [], loading = false }) {
  if (loading) {
    return <div className="p-4 text-sm text-slate-400">Loading products...</div>;
  }

  // ❌ Pehle yahan fallback demo array use ho raha tha
  // ✅ Ab strict check: Agar products nahi hain toh clean empty state dikhao
  if (!products || products.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-bold text-slate-900">Top Products</h3>
        <div className="flex h-40 items-center justify-center text-sm text-slate-400">
          No top performing products recorded yet.
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-bold text-slate-900">Top Products</h3>
      <div className="space-y-3">
        {products.map((item, idx) => (
          <div key={item.id || idx} className="flex items-center justify-between border-b pb-2 text-sm">
            <span className="font-medium text-slate-700">{item.name}</span>
            <span className="font-bold text-slate-900">₹{item.revenue}</span>
          </div>
        ))}
      </div>
    </div>
  );
}