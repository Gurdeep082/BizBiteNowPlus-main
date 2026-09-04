import { Activity } from "lucide-react";

export default function RecentActivity({ activity = [] }) {
  if (!activity || activity.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-bold text-slate-900">Business Activity</h3>
        <div className="flex h-24 items-center justify-center text-sm text-slate-400">
          No recent activity logged yet.
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-bold text-slate-900">Business Activity</h3>
      <div className="space-y-3">
        {activity.map((item) => (
          <div key={item.id} className="flex items-center gap-3 text-xs text-slate-600">
            <Activity size={14} className="text-emerald-600" />
            <div>
              <p className="font-semibold text-slate-800">{item.title}</p>
              <p className="text-slate-500">{item.subtitle}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}