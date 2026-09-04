import { ClipboardList, Plus } from "lucide-react";

export default function EmptyOrders({
  onCreate,
  title = "No Orders Found",
  description = "No orders match your current filters. Try changing the filters or wait for new customer orders.",
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-8 py-20 text-center shadow-sm">

      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-green-50">

        <ClipboardList
          size={48}
          className="text-[#16522d]"
        />

      </div>

      <h2 className="mt-6 text-2xl font-bold text-slate-900">
        {title}
      </h2>

      <p className="mt-3 max-w-md text-sm leading-6 text-slate-500">
        {description}
      </p>

      {onCreate && (
        <button
          onClick={onCreate}
          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#16522d] px-6 py-3 font-semibold text-white transition hover:bg-[#124325]"
        >
          <Plus size={18} />

          Create Order

        </button>
      )}

    </div>
  );
}