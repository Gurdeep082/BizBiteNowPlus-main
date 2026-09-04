import { Plus, Download, Upload } from "lucide-react";

export default function ProductsHeader({
  onAdd,
  onImport,
  onExport,
}) {
  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
      {/* Left */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Product Management
        </h1>

        <p className="mt-2 text-base text-slate-600">
          Manage your products, inventory, variants and combos from one place.
        </p>
      </div>

      {/* Right */}
      <div className="flex flex-wrap items-center gap-3">
        {/* <button
          onClick={onImport}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          <Upload size={18} />
          Import
        </button>

        <button
          onClick={onExport}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          <Download size={18} />
          Export
        </button> */}

        <button
          onClick={onAdd}
          className="inline-flex items-center gap-2 rounded-xl bg-[#1A4D2E] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#163d25]"
        >
          <Plus size={18} />
          Add Product
        </button>
      </div>
    </div>
  );
}