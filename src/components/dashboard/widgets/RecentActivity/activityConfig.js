import {
  ShoppingBag,
  Package,
  CreditCard,
  Truck,
  AlertCircle,
} from "lucide-react";

export const ACTIVITY_CONFIG = {
  order: {
    icon: ShoppingBag,
    iconClass: "bg-blue-100 text-blue-600",
  },

  payment: {
    icon: CreditCard,
    iconClass: "bg-green-100 text-green-600",
  },

  product: {
    icon: Package,
    iconClass: "bg-amber-100 text-amber-600",
  },

  delivery: {
    icon: Truck,
    iconClass: "bg-purple-100 text-purple-600",
  },

  default: {
    icon: AlertCircle,
    iconClass: "bg-gray-100 text-gray-600",
  },
};