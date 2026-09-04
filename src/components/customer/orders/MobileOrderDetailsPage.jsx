import MobileOrderHeader from "./MobileOrderHeader";
import MobileOrderStatusCard from "./MobileOrderStatusCard";
import MobileOrderTracking from "./MobileOrderTracking";
import MobileOrderSummary from "./MobileOrderSummary";
import MobileDeliveryDetails from "./MobileDeliveryDetails";


const MobileOrderDetailsPage = ({
  order,
  onBack,
  onShare,
  onDownloadInvoice,
  onPrint,
}) => {
  return (
    <main className="min-h-screen bg-slate-50 lg:hidden">
      <div className="mx-auto max-w-md space-y-3 px-3 py-3">
        {/* Header */}
        <MobileOrderHeader
          order={order}
          onBack={onBack}
        />

        {/* Status */}
        <MobileOrderStatusCard
          order={order}
        />

        {/* Tracking */}
        <MobileOrderTracking
          tracking={order?.tracking}
          status={order?.status}
        />

        {/* Summary */}
        <MobileOrderSummary
          order={order}
        />

        {/* Delivery */}
        <MobileDeliveryDetails
          order={order}
        />

        {/* Share */}

      </div>
    </main>
  );
};

export default MobileOrderDetailsPage;