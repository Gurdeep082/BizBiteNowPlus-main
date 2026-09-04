import {
  Clock3,
  ChefHat,
  PackageCheck,
  Bike,
  CheckCircle2,
  XCircle,
} from "lucide-react";

const STATUS_CONFIG = {
  Pending: {
    icon: Clock3,
    className:
      "bg-amber-100 text-amber-700 border border-amber-200",
  },

  Preparing: {
    icon: ChefHat,
    className:
      "bg-orange-100 text-orange-700 border border-orange-200",
  },

  Ready: {
    icon: PackageCheck,
    className:
      "bg-violet-100 text-violet-700 border border-violet-200",
  },

  "Out for Delivery": {
    icon: Bike,
    className:
      "bg-sky-100 text-sky-700 border border-sky-200",
  },

  Delivered: {
    icon: CheckCircle2,
    className:
      "bg-green-100 text-green-700 border border-green-200",
  },

  Cancelled: {
    icon: XCircle,
    className:
      "bg-red-100 text-red-700 border border-red-200",
  },
};

export default function OrderStatusBadge({
  status,
}) {
  const config =
    STATUS_CONFIG[status] ??
    STATUS_CONFIG.Pending;

  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${config.className}`}
    >
      <Icon size={14} />

      {status}
    </span>
  );
}