import { FaEdit, FaTrash } from "react-icons/fa";

const INK = "#1A4D2E";

export default function DeliveryBoyTable({
  deliveryBoys,
  onEdit,
  onDelete,
  onToggleStatus,
  onAssign,
}) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr className="border-b border-slate-100 bg-slate-50/60">
            <th className="px-6 py-3.5 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
              Delivery Boy
            </th>

            <th className="px-6 py-3.5 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
              Phone
            </th>

            <th className="px-6 py-3.5 text-center text-xs font-medium uppercase tracking-wide text-slate-500">
              Availability
            </th>

            <th className="px-6 py-3.5 text-center text-xs font-medium uppercase tracking-wide text-slate-500">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {deliveryBoys.length > 0 ? (
            deliveryBoys.map((boy) => (
              <tr
                key={boy._id}
                className="border-b border-slate-50 transition hover:bg-slate-50/60"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <span
                      className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium text-white"
                      style={{ backgroundColor: INK }}
                    >
                      {boy.name?.charAt(0).toUpperCase()}
                    </span>
                    <span className="text-sm font-medium text-slate-800">
                      {boy.name}
                    </span>
                  </div>
                </td>

                <td className="px-6 py-4 text-sm text-slate-600">
                  {boy.phoneNumber}
                </td>

                {/* Availability */}

                <td className="px-6 py-4">
                  <div className="flex flex-col items-center gap-1.5">
                    <button
                      onClick={() => onToggleStatus(boy._id)}
                      className="relative h-6 w-11 rounded-full transition"
                      style={{
                        backgroundColor: boy.is_available ? INK : "#cbd5e1",
                      }}
                    >
                      <span
                        className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-all duration-300 ${boy.is_available ? "left-6" : "left-1"
                          }`}
                      />
                    </button>

                    <span
                      className="text-xs font-medium"
                      style={{ color: boy.is_available ? INK : "#94a3b8" }}
                    >
                      {boy.is_available ? "Available" : "Unavailable"}
                    </span>
                  </div>
                </td>

                {/* Actions */}

                <td className="px-6 py-4">
                  <div className="flex justify-center gap-5">
                    <button
                      onClick={() => onAssign(boy)}
                      className="rounded-lg px-3 py-1.5 text-xs font-medium text-white transition hover:brightness-110"
                      style={{ backgroundColor: INK }}
                      title="Assign Order"
                    >
                      Assign
                    </button>

                    <button
                      onClick={() => onEdit(boy)}
                      className="text-slate-400 transition hover:text-amber-600"
                      title="Edit"
                    >
                      <FaEdit size={16} />
                    </button>

                    <button
                      onClick={() => onDelete(boy)}
                      className="text-slate-400 transition hover:text-red-600"
                      title="Delete"
                    >
                      <FaTrash size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="py-12 text-center text-sm text-slate-400">
                No delivery partner found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}