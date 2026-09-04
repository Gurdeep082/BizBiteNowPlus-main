import { useEffect, useState } from "react";
import {
  X,
  Copy,
  Sparkles,
  FilePlus,
} from "lucide-react";

export default function DuplicateMenuModal({
  open,
  menu,
  onClose,
  onDuplicate,
}) {
  const [menuName, setMenuName] = useState("");

  useEffect(() => {
    if (menu) {
      setMenuName(`${menu.name} Copy`);
    }
  }, [menu]);

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

  const handleSubmit = () => {
    onDuplicate?.({
      ...menu,
      id: Date.now(),
      name: menuName,
      status: "Draft",
    });

    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg rounded-2xl overflow-hidden bg-white 900 shadow-2xl"
      >
        {/* Header */}

        <div className="flex items-center justify-between border-b border-slate-700 px-6 py-5">

          <div className="flex items-center gap-3">

            <div className="rounded-xl bg-violet-100 -violet-500/10 p-3">

              <Copy
                size={22}
                className="text-violet-600"
              />

            </div>

            <div>

              <h2 className="text-lg font-semibold">
                Duplicate Festive Menu
              </h2>

              <p className="text-sm text-slate-500">
                Create a copy for another festival.
              </p>

            </div>

          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-slate-100 hover:bg-slate-800"
          >
            <X size={18} />
          </button>

        </div>

        {/* Body */}

        <div className="p-6 space-y-6">

          <div className="rounded-xl border bg-violet-50 -violet-500/10 border-violet-200 border-violet-800 p-5">

            <div className="flex items-center gap-3">

              <Sparkles
                size={22}
                className="text-violet-600"
              />

              <div>

                <h3 className="font-semibold">
                  Duplicate Menu
                </h3>

                <p className="text-sm text-slate-500 mt-1">
                  Products, schedule and settings
                  will be copied into a new draft.
                </p>

              </div>

            </div>

          </div>

          <div>

            <label className="block text-sm font-medium mb-2">
              New Menu Name
            </label>

            <input
              type="text"
              value={menuName}
              onChange={(e) =>
                setMenuName(e.target.value)
              }
              placeholder="Enter menu name"
              className="w-full rounded-xl border px-4 py-3 bg-transparent"
            />

          </div>

          <div className="rounded-xl border p-5">

            <div className="grid grid-cols-2 gap-5">

              <div>

                <p className="text-xs uppercase text-slate-500">
                  Festival
                </p>

                <p className="font-medium mt-1">
                  {menu?.festival}
                </p>

              </div>

              <div>

                <p className="text-xs uppercase text-slate-500">
                  Products
                </p>

                <p className="font-medium mt-1">
                  {Array.isArray(menu?.products) ? menu.products.length : menu?.products || 0}
                </p>

              </div>

              <div>

                <p className="text-xs uppercase text-slate-500">
                  Status
                </p>

                <p className="font-medium mt-1">
                  Draft
                </p>

              </div>

              <div>

                <p className="text-xs uppercase text-slate-500">
                  Source
                </p>

                <p className="font-medium mt-1">
                  {menu?.name}
                </p>

              </div>

            </div>

          </div>

        </div>

        {/* Footer */}

        <div className="flex justify-end gap-3 border-t border-slate-700 px-6 py-5">

          <button
            onClick={onClose}
            className="rounded-xl border px-5 py-2.5 hover:bg-slate-100 hover:bg-slate-800"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-white hover:bg-violet-700"
          >
            <FilePlus size={18} />
            Create Copy
          </button>

        </div>

      </div>
    </div>
  );
}