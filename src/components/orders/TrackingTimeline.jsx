import {
  ShoppingBag,
  CheckCircle2,
  ChefHat,
  Bike,
  PackageCheck,
  UtensilsCrossed,
} from "lucide-react";

// ==============================
// Subscription
// Replace with backend later
// ==============================

const isPlusUser = true;

const deliverySteps = [
  { title: "Placed", icon: ShoppingBag },
  { title: "Confirmed", icon: CheckCircle2 },
  { title: "Preparing", icon: ChefHat },
  { title: "Out for Delivery", icon: Bike },
  { title: "Delivered", icon: PackageCheck },
];

const takeawaySteps = [
  { title: "Placed", icon: ShoppingBag },
  { title: "Confirmed", icon: CheckCircle2 },
  { title: "Preparing", icon: ChefHat },
  { title: "Ready for Pickup", icon: PackageCheck },
  { title: "Picked Up", icon: CheckCircle2 },
];

const dineInSteps = [
  { title: "Placed", icon: ShoppingBag },
  { title: "Confirmed", icon: CheckCircle2 },
  { title: "Preparing", icon: ChefHat },
  { title: "Served", icon: UtensilsCrossed },
];

const nonPlusSteps = [
  { title: "Preparing", icon: ChefHat },
  { title: "Delivered", icon: PackageCheck },
];

export default function TrackingTimeline({
  currentStep = 0,
  orderType = "delivery",
}) {
  let steps;

  if (!isPlusUser) {
    steps = nonPlusSteps;
  } else if (orderType === "dine-in") {
    steps = dineInSteps;
  } else if (orderType === "takeaway") {
    steps = takeawaySteps;
  } else {
    steps = deliverySteps;
  }

  const maxIndex = steps.length - 1;
  const clampedStep = Math.min(currentStep, maxIndex);

  const progressPercent = isPlusUser
    ? (clampedStep / maxIndex) * 100
    : currentStep >= 4
      ? 100
      : 50;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">

      <h3 className="mb-6 text-base font-semibold">
        Order Tracking
      </h3>

      <div className="relative flex items-start justify-between">

        <div className="absolute left-0 right-0 top-5 h-1 rounded-full bg-slate-200" />

        <div
          className="absolute left-0 top-5 h-1 rounded-full bg-[#16522d] transition-all duration-500"
          style={{ width: `${progressPercent}%` }}
        />

        {steps.map((step, index) => {
          const Icon = step.icon;

          const completed = isPlusUser
            ? index <= clampedStep
            : currentStep >= 4
              ? true
              : index === 0;

          return (
            <div
              key={step.title}
              className="relative z-10 flex w-24 flex-col items-center"
            >

              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300 ${completed
                    ? "border-[#16522d] bg-[#16522d] text-white"
                    : "border-slate-300 bg-white text-slate-400"
                  }`}
              >
                <Icon size={18} />
              </div>

              <p
                className={`mt-3 text-center text-xs font-medium ${completed
                    ? "text-[#16522d]"
                    : "text-slate-500"
                  }`}
              >
                {step.title}
              </p>

            </div>
          );
        })}

      </div>

    </div>
  );
}