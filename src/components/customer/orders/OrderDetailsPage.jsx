import OrderHeader from "./OrderHeader";
import OrderStatusCard from "./OrderStatusCard";
import OrderTracking from "./OrderTracking";
import OrderSummary from "./OrderSummary";
import DeliveryDetails from "./DeliveryDetails";


const OrderDetailsPage = ({
  order,
  onBack,
  onShare,
}) => {
  return (
    <main className="hidden w-full lg:block">
      <div className="mx-auto w-full max-w-[1600px] space-y-6">
        {/* Header */}
        <OrderHeader
          order={order}
          onBack={onBack}
        />

        {/* Order Status */}
        <OrderStatusCard
          order={order}
        />

        {/* Tracking */}
        <OrderTracking
          tracking={order?.tracking}
          status={order?.status}
        />

        {/* Summary + Delivery */}
        <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <OrderSummary
            order={order}
          />

          <DeliveryDetails
            order={order}
          />
        </section>


      </div>
    </main>
  );
};

export default OrderDetailsPage;