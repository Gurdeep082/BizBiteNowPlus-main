import {
  CheckSquare,
  CheckCircle2,
  ChefHat,
  PackageCheck,
  Bike,
  Trash2,
  X,
} from "lucide-react";

export default function BulkActions({
  selectedCount = 0,
  onClear,
  onAccept,
  onPreparing,
  onReady,
  onDelivery,
  onDelivered,
  onCancel,
}) {
  if (selectedCount === 0) return null;

  const btn =
    "flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium transition hover:bg-slate-50";

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#16522d]/20 bg-[#16522d]/5 p-4">

      <div className="flex items-center gap-3">

        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#16522d] text-white">
          <CheckSquare size={18} />
        </div>

        <div>

          <p className="font-semibold">
            {selectedCount} Orders Selected
          </p>

          <p className="text-sm text-slate-500">
            Perform bulk operations
          </p>

        </div>

      </div>

      <div className="flex flex-wrap gap-2">

        <button
          onClick={onAccept}
          className={btn}
        >
          <CheckCircle2
            size={16}
            className="text-green-600"
          />
          Accept
        </button>

        <button
          onClick={onPreparing}
          className={btn}
        >
          <ChefHat
            size={16}
            className="text-orange-600"
          />
          Preparing
        </button>

        <button
          onClick={onReady}
          className={btn}
        >
          <PackageCheck
            size={16}
            className="text-violet-600"
          />
          Ready
        </button>

        <button
          onClick={onDelivery}
          className={btn}
        >
          <Bike
            size={16}
            className="text-sky-600"
          />
          Delivery
        </button>

        <button
          onClick={onDelivered}
          className={btn}
        >
          <CheckCircle2
            size={16}
            className="text-green-600"
          />
          Delivered
        </button>

        <button
          onClick={onCancel}
          className={`${btn} text-red-600`}
        >
          <Trash2 size={16} />
          Cancel
        </button>

        <button
          onClick={onClear}
          className={`${btn} border-red-200 text-red-600`}
        >
          <X size={16} />
          Clear
        </button>

      </div>

    </div>
  );
}