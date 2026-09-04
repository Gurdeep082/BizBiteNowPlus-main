// src/components/orders/OrdersTabs.jsx

import { ClipboardList, CheckCircle2 } from "lucide-react";

export default function OrdersTabs({
  activeTab,
  onChange,
  newOrders = 0,
  completedOrders = 0,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row">

        <button
          onClick={() => onChange("new")}
          className={`flex flex-1 items-center justify-between rounded-xl border px-5 py-4 transition-all duration-300 ${
            activeTab === "new"
              ? "border-[#16522d] bg-[#16522d] text-white shadow-lg"
              : "border-transparent bg-slate-50 text-slate-700 hover:bg-slate-100"
          }`}
        >
          <div className="flex items-center gap-3">
            <ClipboardList size={20} />
            <div className="text-left">
              <p className="text-sm font-semibold">
                New Orders
              </p>
              <p
                className={`text-xs ${
                  activeTab === "new"
                    ? "text-green-100"
                    : "text-slate-500"
                }`}
              >
                Orders awaiting processing
              </p>
            </div>
          </div>

          <span
            className={`rounded-full px-3 py-1 text-sm font-bold ${
              activeTab === "new"
                ? "bg-white text-[#16522d]"
                : "bg-[#16522d]/10 text-[#16522d]"
            }`}
          >
            {newOrders}
          </span>
        </button>

        <button
          onClick={() => onChange("completed")}
          className={`flex flex-1 items-center justify-between rounded-xl border px-5 py-4 transition-all duration-300 ${
            activeTab === "completed"
              ? "border-[#16522d] bg-[#16522d] text-white shadow-lg"
              : "border-transparent bg-slate-50 text-slate-700 hover:bg-slate-100"
          }`}
        >
          <div className="flex items-center gap-3">
            <CheckCircle2 size={20} />
            <div className="text-left">
              <p className="text-sm font-semibold">
                Completed Orders
              </p>
              <p
                className={`text-xs ${
                  activeTab === "completed"
                    ? "text-green-100"
                    : "text-slate-500"
                }`}
              >
                Successfully delivered
              </p>
            </div>
          </div>

          <span
            className={`rounded-full px-3 py-1 text-sm font-bold ${
              activeTab === "completed"
                ? "bg-white text-[#16522d]"
                : "bg-[#16522d]/10 text-[#16522d]"
            }`}
          >
            {completedOrders}
          </span>
        </button>

      </div>
    </div>
  );
}