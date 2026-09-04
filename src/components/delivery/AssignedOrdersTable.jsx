const INK = "#1A4D2E";

const DUMMY_ORDERS = [
  {
    id: 1,
    orderId: "10234",
    customer: "Aman Verma",
    items: "2x Paneer Tikka, 1x Butter Naan",
    address: "Shastri Nagar, Saharanpur",
    deliveryBoy: "Ravi Kumar",
    status: "Assigned",
  },
  {
    id: 2,
    orderId: "10235",
    customer: "Priya Singh",
    items: "1x Chicken Biryani",
    address: "Court Road, Saharanpur",
    deliveryBoy: "Sonu Yadav",
    status: "Out for Delivery",
  },
  {
    id: 3,
    orderId: "10236",
    customer: "Rohit Sharma",
    items: "1x Veg Burger, 1x Fries, 1x Coke",
    address: "Mission Compound, Saharanpur",
    deliveryBoy: "Ravi Kumar",
    status: "Assigned",
  },
];

export default function AssignedOrdersTable({
  assignedOrders,
  onComplete = () => { },
}) {
  // Default params don't kick in for an empty array (only for undefined),
  // so fall back to dummy rows explicitly when there's nothing real yet.
  const rows =
    Array.isArray(assignedOrders) && assignedOrders.length > 0
      ? assignedOrders
      : DUMMY_ORDERS;
  return (
    <div>
      <div className="border-b border-slate-100 px-6 py-4">
        <h2 className="text-base font-semibold text-slate-800">
          Assigned Orders
        </h2>
        <p className="mt-0.5 text-xs text-slate-500">
          Orders currently out with a delivery partner.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/60">
              <th className="px-6 py-3.5 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                Order ID
              </th>
              <th className="px-6 py-3.5 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                Customer
              </th>
              <th className="px-6 py-3.5 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                Food Item
              </th>
              <th className="px-6 py-3.5 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                Address
              </th>
              <th className="px-6 py-3.5 text-center text-xs font-medium uppercase tracking-wide text-slate-500">
                Delivery Boy
              </th>
              <th className="px-6 py-3.5 text-center text-xs font-medium uppercase tracking-wide text-slate-500">
                Status
              </th>
              <th className="px-6 py-3.5 text-center text-xs font-medium uppercase tracking-wide text-slate-500">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {rows.length > 0 ? (
              rows.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-slate-50 transition hover:bg-slate-50/60"
                >
                  <td className="px-6 py-4 text-sm font-medium text-slate-700">
                    #{order.orderId}
                  </td>

                  <td className="px-6 py-4 text-sm text-slate-600">
                    {order.customer}
                  </td>

                  <td className="px-6 py-4 text-sm text-slate-600">
                    {order.items}
                  </td>

                  <td className="px-6 py-4 text-sm text-slate-600">
                    {order.address}
                  </td>

                  <td className="px-6 py-4 text-center text-sm font-medium text-slate-700">
                    {order.deliveryBoy}
                  </td>

                  <td className="px-6 py-4 text-center">
                    <span
                      className="rounded-full px-3 py-1 text-xs font-medium"
                      style={{ backgroundColor: "#F8BD0D26", color: "#946600" }}
                    >
                      {order.status}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => onComplete(order.id)}
                      className="rounded-lg px-3.5 py-2 text-xs font-medium text-white transition hover:brightness-110"
                      style={{ backgroundColor: INK }}
                    >
                      Mark Complete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="py-12 text-center text-sm text-slate-400">
                  No assigned orders right now.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}