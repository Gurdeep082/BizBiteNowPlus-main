import { useEffect, useState } from "react";
import {
  X,
  CalendarDays,
  Clock3,
  Save,
} from "lucide-react";

export default function ScheduleMenuModal({
  open,
  menu,
  onClose,
  onSave,
}) {
  const [form, setForm] = useState({
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    autoPublish: true,
    autoRevert: true,
  });

  useEffect(() => {
    if (menu) {
      setForm({
        startDate: menu.startDate || "",
        startTime: menu.startTime || "",
        endDate: menu.endDate || "",
        endTime: menu.endTime || "",
        autoPublish: menu.autoPublish ?? true,
        autoRevert: menu.autoRevert ?? true,
      });
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

  const update = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = () => {
    onSave?.({
      ...menu,
      ...form,
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
        className="w-full max-w-2xl rounded-2xl bg-white 900 shadow-2xl overflow-hidden"
      >
        {/* Header */}

        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-700">

          <div className="flex items-center gap-3">

            <div className="rounded-xl bg-blue-100 -blue-500/10 p-3">
              <CalendarDays
                size={22}
                className="text-blue-600"
              />
            </div>

            <div>

              <h2 className="text-lg font-semibold">
                Schedule Festive Menu
              </h2>

              <p className="text-sm text-slate-500">
                {menu?.name}
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

          <div className="grid md:grid-cols-2 gap-5">

            <div>

              <label className="block text-sm font-medium mb-2">
                Start Date
              </label>

              <input
                type="date"
                value={form.startDate}
                onChange={(e) =>
                  update("startDate", e.target.value)
                }
                className="w-full rounded-xl border px-4 py-3 bg-transparent"
              />

            </div>

            <div>

              <label className="block text-sm font-medium mb-2">
                Start Time
              </label>

              <input
                type="time"
                value={form.startTime}
                onChange={(e) =>
                  update("startTime", e.target.value)
                }
                className="w-full rounded-xl border px-4 py-3 bg-transparent"
              />

            </div>

            <div>

              <label className="block text-sm font-medium mb-2">
                End Date
              </label>

              <input
                type="date"
                value={form.endDate}
                onChange={(e) =>
                  update("endDate", e.target.value)
                }
                className="w-full rounded-xl border px-4 py-3 bg-transparent"
              />

            </div>

            <div>

              <label className="block text-sm font-medium mb-2">
                End Time
              </label>

              <input
                type="time"
                value={form.endTime}
                onChange={(e) =>
                  update("endTime", e.target.value)
                }
                className="w-full rounded-xl border px-4 py-3 bg-transparent"
              />

            </div>

          </div>

          <div className="space-y-4">

            <div className="flex items-center justify-between rounded-xl border p-4">

              <div>

                <p className="font-medium">
                  Auto Publish
                </p>

                <p className="text-sm text-slate-500">
                  Publish automatically.
                </p>

              </div>

              <input
                type="checkbox"
                checked={form.autoPublish}
                onChange={(e) =>
                  update(
                    "autoPublish",
                    e.target.checked
                  )
                }
              />

            </div>

            <div className="flex items-center justify-between rounded-xl border p-4">

              <div>

                <p className="font-medium">
                  Auto Revert
                </p>

                <p className="text-sm text-slate-500">
                  Restore regular menu automatically.
                </p>

              </div>

              <input
                type="checkbox"
                checked={form.autoRevert}
                onChange={(e) =>
                  update(
                    "autoRevert",
                    e.target.checked
                  )
                }
              />

            </div>

          </div>

          <div className="rounded-xl bg-slate-50 800 p-5">

            <div className="flex items-center gap-2 mb-3">

              <Clock3
                size={18}
                className="text-orange-500"
              />

              <span className="font-semibold">
                Summary
              </span>

            </div>

            <p className="text-sm text-slate-600 text-slate-300">
              This festive menu will automatically
              activate on the selected start date and
              revert after the selected end date.
            </p>

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
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-white hover:bg-blue-700"
          >
            <Save size={18} />
            Save Schedule
          </button>

        </div>

      </div>
    </div>
  );
}