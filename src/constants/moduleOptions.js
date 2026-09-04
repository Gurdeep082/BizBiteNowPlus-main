// Mirrors backend constants/modules.js — keep this list in sync manually,
// since it also carries display labels + icons for the checkbox UI.
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  ReceiptIndianRupee,
  Truck,
  TicketPercent,
  Gift,
  IndianRupee,
  Users,
  Settings,
} from "lucide-react";
import { BiDish } from "react-icons/bi";

export const MODULE_OPTIONS = [
  { key: "home", label: "Home", icon: LayoutDashboard },
  { key: "products", label: "Products", icon: Package },
  { key: "orders", label: "Orders", icon: ShoppingCart },
  { key: "billing", label: "Billing", icon: ReceiptIndianRupee },
  { key: "delivery", label: "Delivery", icon: Truck },
  { key: "coupons_rewards", label: "Coupons & Rewards", icon: TicketPercent },
  { key: "festive_menu", label: "Festive Menu", icon: Gift },
  { key: "earnings", label: "Earnings", icon: IndianRupee },
  { key: "customers", label: "Customers", icon: Users },
  { key: "table_qr", label: "Table & QR", icon: BiDish },
  { key: "store_settings", label: "Store Settings", icon: Settings },
];
