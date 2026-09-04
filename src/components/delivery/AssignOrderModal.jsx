import { useState } from "react";
import { X, Bike, User, ClipboardList } from "lucide-react";

const INK = "#1A4D2E";

// NOTE: the parent should key this component on open/close + delivery boy id
// so it remounts fresh each time the modal opens, instead of syncing state
// from props via an effect.
export default function AssignOrderModal({
  isOpen,
  onClose,
  onAssign,
  deliveryBoy,
  assigning = false,
}) {
  const [formData, setFormData] = useState({
    orderId: "",
    customer: "",
    address: "",
    items: "",
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = () => {
    if (assigning) return;

    const { orderId, customer, address, items } = formData;

    if (!orderId || !customer || !address || !items) {
      alert("Please fill all fields");
      return;
    }

    // Parent's onAssign handles the actual POST /orders/assign call
    // (with order_id + delivery_boy_id) and closes the modal on success.
    onAssign(formData);
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={assigning ? undefined : onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl rounded-3xl bg-white shadow-2xl"
      >
        <button
          onClick={onClose}
          disabled={assigning}
          className="absolute right-5 top-5 rounded-full p-2 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <X size={20} />
        </button>

        {/* Header */}

        <div className="border-b border-slate-100 p-8">
          <h2 className="text-xl font-semibold text-slate-900">
            Assign Order
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Assign this order to a delivery partner.
          </p>
        </div>

        <div className="grid gap-8 p-8 lg:grid-cols-2">
          {/* Delivery Boy */}

          <div>
            <h3 className="mb-5 text-sm font-semibold text-slate-800">
              Delivery Partner
            </h3>

            <div className="space-y-4 rounded-2xl border border-slate-200 p-5">
              <div className="flex items-center gap-3">
                <Bike size={18} style={{ color: INK }} />

                <span className="text-sm font-medium text-slate-800">
                  {deliveryBoy?.name}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <User size={18} className="text-slate-400" />

                <span className="text-sm text-slate-600">
                  {deliveryBoy?.phoneNumber || "Not available"}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <ClipboardList size={18} className="text-slate-400" />

                <span className="text-sm text-slate-600">
                  Status:{" "}
                  <strong
                    className="ml-1"
                    style={{
                      color: deliveryBoy?.is_available ? INK : "#94a3b8",
                    }}
                  >
                    {deliveryBoy?.is_available ? "Available" : "Unavailable"}
                  </strong>
                </span>
              </div>
            </div>
          </div>

          {/* Order Form */}

          <div>
            <h3 className="mb-5 text-sm font-semibold text-slate-800">
              Order Details
            </h3>

            <div className="space-y-4 rounded-2xl border border-slate-200 p-5">
              <input
                type="text"
                name="orderId"
                placeholder="Order ID"
                value={formData.orderId}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-[#1A4D2E]"
              />

              <input
                type="text"
                name="customer"
                placeholder="Customer Name"
                value={formData.customer}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-[#1A4D2E]"
              />

              <input
                type="text"
                name="items"
                placeholder="Food Items"
                value={formData.items}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-[#1A4D2E]"
              />

              <textarea
                rows={4}
                name="address"
                placeholder="Delivery Address"
                value={formData.address}
                onChange={handleChange}
                className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-[#1A4D2E]"
              />

              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={onClose}
                  disabled={assigning}
                  className="rounded-xl border border-slate-300 px-5 py-2 text-sm font-medium transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Cancel
                </button>

                <button
                  onClick={handleSubmit}
                  disabled={assigning}
                  className="rounded-xl px-5 py-2 text-sm font-medium text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
                  style={{ backgroundColor: INK }}
                >
                  {assigning ? "Assigning..." : "Assign Order"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}