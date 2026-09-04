
import { Bike, Phone, UserCheck, ShieldCheck } from "lucide-react";
import OrderTimeline from "./OrderTimeline";

const OrderTracking = ({
  tracking = [],
  status = "",
  currentStep = 1,
  order = null, // Full order object passed from parent component
}) => {
  // Safe extraction of Mongoose populated delivery partner details
  const deliveryPartner =
    order?.delivery_boy ||
    order?.delivery_partner ||
    order?.deliveryBoy ||
    (typeof order?.delivery_boy_id === "object" ? order?.delivery_boy_id : null);

  const deliveryBoyName =
    deliveryPartner?.name ||
    deliveryPartner?.fullName ||
    order?.delivery_boy_name ||
    order?.delivery_partner_name ||
    "Assigned Partner";

  const deliveryBoyPhone =
    deliveryPartner?.phoneNumber ||
    deliveryPartner?.phone ||
    deliveryPartner?.phone_number ||
    order?.delivery_boy_phone ||
    order?.delivery_partner_phone ||
    "";

  const vehicleNumber =
    deliveryPartner?.vehicleNumber ||
    deliveryPartner?.vehicle_number ||
    order?.vehicle_number ||
    "Bike";

  const isAssigned =
    Boolean(deliveryPartner) ||
    Boolean(order?.delivery_boy_name) ||
    Boolean(order?.delivery_boy_id) ||
    String(status).toLowerCase() === "assigned" ||
    String(status).toLowerCase() === "out for delivery";

  // Automatic Step Fallback Map if currentStep is missing
  const statusStepMap = {
    unassigned: 1,
    pending: 1,
    preparing: 2,
    assigned: 2,
    "out for delivery": 3,
    "ready for pickup": 3,
    delivered: 4,
  };

  const activeStep =
    tracking?.currentStep ??
    statusStepMap[String(status).toLowerCase()] ??
    currentStep ??
    1;

  const timelineSteps = Array.isArray(tracking)
    ? tracking
    : tracking?.steps || [];

  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
      {/* Header */}
      <div className="border-b border-slate-100 px-6 py-5 sm:px-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
              Order Tracking
            </h2>
            <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">
              Track your order in real-time.
            </p>
          </div>

          <span className="rounded-full bg-emerald-100 px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-emerald-800 shrink-0">
            {status || "Preparing"}
          </span>
        </div>
      </div>

      {/* 🚀 LIVE DELIVERY BOY CARD SECTION */}
      {isAssigned && (
        <div className="mx-6 mt-6 rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4 sm:mx-8 sm:p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3.5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-700 text-white shadow-xs">
                <Bike size={22} />
              </div>

              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                    {deliveryBoyName}
                  </h3>
                  <UserCheck size={16} className="text-emerald-700" />
                </div>

                <p className="text-xs font-medium text-slate-600">
                  Delivery Partner •{" "}
                  <span className="font-semibold text-slate-700">
                    {vehicleNumber}
                  </span>
                </p>

                <p className="text-[11px] text-emerald-800 font-medium flex items-center gap-1">
                  <ShieldCheck size={13} /> On the way with your order
                </p>
              </div>
            </div>

            {/* Call Partner Button */}
            {deliveryBoyPhone ? (
              <a
                href={`tel:${deliveryBoyPhone}`}
                className="flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-emerald-800 shadow-xs sm:self-center"
              >
                <Phone size={14} />
                <span>Call Partner</span>
              </a>
            ) : (
              <div className="rounded-xl bg-white/80 px-3 py-1.5 text-center text-xs font-semibold text-slate-500 border border-slate-200/60">
                Contact: Assigned
              </div>
            )}
          </div>
        </div>
      )}

      {/* Timeline */}
      <div className="px-6 py-8 sm:px-8 sm:py-10">
        <OrderTimeline timeline={timelineSteps} currentStep={activeStep} />
      </div>
    </section>
  );
};

export default OrderTracking;