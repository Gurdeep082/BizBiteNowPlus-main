import { useState } from "react";

const INK = "#1A4D2E";

// NOTE: the parent keys this component (mode/target + open state) so it
// remounts fresh each time it's opened, instead of syncing state from props
// via an effect.
export default function DeliveryBoyForm({
  isOpen,
  onClose,
  onSave,
  editData,
  saving = false,
}) {
  const [formData, setFormData] = useState(() =>
    editData
      ? {
        name: editData.name || "",
        phoneNumber: editData.phoneNumber || "",
        is_available: editData.is_available ?? true,
      }
      : { name: "", phoneNumber: "", is_available: true },
  );

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (saving) return;

    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="text-lg font-semibold text-slate-900">
          {editData ? "Edit Delivery Boy" : "Add Delivery Boy"}
        </h2>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-500">
              Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="Ravi Kumar"
              value={formData.name}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-[#1A4D2E] focus:ring-4 focus:ring-[#1A4D2E]/10"
              required
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-500">
              Phone Number
            </label>
            <input
              type="tel"
              name="phoneNumber"
              placeholder="9876543210"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-[#1A4D2E] focus:ring-4 focus:ring-[#1A4D2E]/10"
              required
            />
          </div>

          <label className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3">
            <span className="text-sm font-medium text-slate-700">
              Available
            </span>
            <input
              type="checkbox"
              name="is_available"
              checked={formData.is_available}
              onChange={handleChange}
              className="h-4 w-4 accent-[#1A4D2E]"
            />
          </label>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-xl bg-slate-100 px-5 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="rounded-xl px-5 py-2 text-sm font-medium text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
              style={{ backgroundColor: INK }}
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}