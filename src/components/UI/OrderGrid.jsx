import OrderCard from "./OrderCard";

const OrderGrid = ({ orders, activeTab, markAsDelivered}) => {
  if (!orders.length) {
    return (
      <div className="flex h-72 items-center justify-center rounded-3xl border border-dashed border-gray-300 bg-white/60 backdrop-blur-xl">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-black">
            No Orders Found
          </h2>

          <p className="mt-2 text-black">
            There are no {activeTab} orders right now.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
      {orders.map((order) => (
        <OrderCard
          key={order.id}
          order={order}
          activeTab={activeTab}
          markAsDelivered={markAsDelivered}
        />
      ))}
    </div>
  );
};

export default OrderGrid;