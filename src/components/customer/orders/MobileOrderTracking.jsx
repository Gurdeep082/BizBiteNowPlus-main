
import { MapPinned, Bike, Phone, UserCheck, ShieldCheck } from "lucide-react";
import MobileTimeline from "./MobileTimeline";

const MobileOrderTracking = ({
  tracking = {},
  status = "",
  order = null, // 👈 Added full order prop to extract delivery boy info
}) => {
  const safeTracking = tracking || {};

  // Status to Step Fallback Mapping
  const statusStepMap = {
    Unassigned: 1,
    Pending: 1,
    Preparing: 2,
    Assigned: 2,
    "Out for Delivery": 3,
    "Ready for Pickup": 3,
    Delivered: 4,
  };

  const currentStep =
    safeTracking.currentStep ??
    statusStepMap[status] ??
    1;

  // Fallback Timeline Steps
  const defaultSteps = [
    { title: "Order Placed", description: "Order received" },
    { title: "Preparing", description: "Kitchen is preparing" },
    { title: "Out for Delivery", description: "Partner on the way" },
    { title: "Delivered", description: "Order completed" },
  ];

  const steps =
    Array.isArray(safeTracking.steps) && safeTracking.steps.length > 0
      ? safeTracking.steps
      : defaultSteps;

  // 🚀 Safe Delivery Boy Extraction (Supports populated object or direct keys)
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

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
      {/* Header */}
      <div className="border-b border-slate-100 px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-800">
              <MapPinned size={20} />
            </div>

            <div>
              <h2 className="text-base font-bold text-slate-900">
                Order Tracking
              </h2>
              <p className="text-xs text-slate-500">Live order progress</p>
            </div>
          </div>

          <span className="rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-semibold text-emerald-800">
            {status || "Preparing"}
          </span>
        </div>
      </div>

      {/* 🚀 MOBILE DELIVERY BOY CARD */}
      {isAssigned && (
        <div className="mx-4 mt-4 rounded-xl border border-emerald-100 bg-emerald-50/70 p-3.5">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-700 text-white shadow-xs">
                <Bike size={20} />
              </div>

              <div className="space-y-0.5">
                <div className="flex items-center gap-1">
                  <h3 className="font-bold text-slate-900 text-sm">
                    {deliveryBoyName}
                  </h3>
                  <UserCheck size={14} className="text-emerald-700" />
                </div>

                <p className="text-[11px] font-medium text-slate-600">
                  Rider • <span className="font-semibold text-slate-700">{vehicleNumber}</span>
                </p>

                <p className="text-[10px] text-emerald-800 font-semibold flex items-center gap-1">
                  <ShieldCheck size={12} /> Out for delivery
                </p>
              </div>
            </div>

            {/* Quick Call Button */}
            {deliveryBoyPhone ? (
              <a
                href={`tel:${deliveryBoyPhone}`}
                className="flex items-center gap-1.5 rounded-lg bg-emerald-700 px-3 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-800 shrink-0"
              >
                <Phone size={13} />
                <span>Call</span>
              </a>
            ) : (
              <span className="text-[10px] font-semibold text-slate-500 bg-white/80 px-2.5 py-1 rounded-md border border-slate-200">
                Assigned
              </span>
            )}
          </div>
        </div>
      )}

      {/* Timeline */}
      <div className="px-4 py-5">
        <MobileTimeline timeline={steps} currentStep={currentStep} />
      </div>
    </section>
  );
};

export default MobileOrderTracking;