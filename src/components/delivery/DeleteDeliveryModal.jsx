export default function DeleteDeliveryModal({
  isOpen,
  onClose,
  onDelete,
  deliveryBoy,
  deleting = false,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="text-lg font-semibold text-red-600">
          Delete Delivery Boy
        </h2>

        <p className="mt-3 text-sm text-slate-600">
          Are you sure you want to remove{" "}
          <span className="font-medium text-slate-900">
            {deliveryBoy?.name}
          </span>
          ? This can't be undone.
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={deleting}
            className="rounded-xl bg-slate-100 px-5 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancel
          </button>

          <button
            onClick={onDelete}
            disabled={deleting}
            className="rounded-xl bg-red-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}