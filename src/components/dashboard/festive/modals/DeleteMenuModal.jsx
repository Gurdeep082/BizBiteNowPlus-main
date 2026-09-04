import { useEffect } from "react";
import {
  Trash2,
  AlertTriangle,
  X,
} from "lucide-react";

export default function DeleteMenuModal({
  open,
  menu,
  onClose,
  onDelete,
}) {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };

    if (open) {
      document.body.style.overflow = "hidden";
      document.addEventListener("keydown", handleEsc);
    }

    return () => {
      document.body.style.overflow = "auto";
      document.removeEventListener("keydown", handleEsc);
    };
  }, [open, onClose]);

  if (!open) return null;

  const handleDelete = () => {
    onDelete?.(menu);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl 900"
      >
        {/* Header */}

        <div className="flex items-center justify-between border-b px-6 py-5 border-slate-700">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-red-100 p-3 -red-500/10">
              <Trash2
                size={22}
                className="text-red-600"
              />
            </div>

            <div>
              <h2 className="text-lg font-semibold">
                Delete Festive Menu
              </h2>

              <p className="text-sm text-slate-500">
                This action cannot be undone.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 transition hover:bg-slate-100 hover:bg-slate-800"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}

        <div className="space-y-6 p-6">
          <div className="rounded-xl border border-red-200 bg-red-50 p-5 border-red-900 -red-900/20">
            <div className="flex items-start gap-3">
              <AlertTriangle
                className="mt-0.5 text-red-600"
                size={22}
              />

              <div>
                <h3 className="font-semibold text-red-700 text-red-400">
                  Permanent Deletion
                </h3>

                <p className="mt-2 text-sm text-slate-600 text-slate-300">
                  Deleting this festive menu will
                  permanently remove all associated
                  schedule, products and settings.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border p-5">
            <p className="text-xs uppercase text-slate-500">
              Menu Name
            </p>

            <p className="mt-1 font-semibold">
              {menu?.name}
            </p>

            <div className="mt-5 grid grid-cols-2 gap-5">
              <div>
                <p className="text-xs uppercase text-slate-500">
                  Festival
                </p>

                <p className="mt-1 font-medium">
                  {menu?.festival}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase text-slate-500">
                  Products
                </p>

                <p className="mt-1 font-medium">
                  {Array.isArray(menu?.products) ? menu.products.length : menu?.products || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}

        <div className="flex justify-end gap-3 border-t px-6 py-5 border-slate-700">
          <button
            onClick={onClose}
            className="rounded-xl border px-5 py-2.5 transition hover:bg-slate-100 hover:bg-slate-800"
          >
            Cancel
          </button>

          <button
            onClick={handleDelete}
            className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 font-medium text-white transition hover:bg-red-700"
          >
            <Trash2 size={18} />
            Delete Menu
          </button>
        </div>
      </div>
    </div>
  );
}