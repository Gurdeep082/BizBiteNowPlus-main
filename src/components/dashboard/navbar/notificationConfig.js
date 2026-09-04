import {
  ShoppingBag,
  AlertTriangle,
  Megaphone,
  Bell,
  CreditCard,
} from "lucide-react";

export const NOTIFICATION_CONFIG = {
  order: {
    icon: ShoppingBag,
    iconClass: "bg-blue-100 text-blue-700",
  },

  inventory: {
    icon: AlertTriangle,
    iconClass: "bg-red-100 text-red-700",
  },

  marketing: {
    icon: Megaphone,
    iconClass: "bg-purple-100 text-purple-700",
  },

  payment: {
    icon: CreditCard,
    iconClass: "bg-green-100 text-green-700",
  },

  system: {
    icon: Bell,
    iconClass: "bg-gray-100 text-gray-700",
  },
};