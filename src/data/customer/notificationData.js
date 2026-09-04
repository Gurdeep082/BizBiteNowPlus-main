import {
  ShoppingBag,
  Gift,
  TicketPercent,
  Sparkles,
  Bell,
} from "lucide-react";

export const NOTIFICATION_TYPES = {
  ORDER: "order",
  REWARD: "reward",
  COUPON: "coupon",
  OFFER: "offer",
  GENERAL: "general",
};

export const NOTIFICATION_ICONS = {
  [NOTIFICATION_TYPES.ORDER]: ShoppingBag,
  [NOTIFICATION_TYPES.REWARD]: Gift,
  [NOTIFICATION_TYPES.COUPON]: TicketPercent,
  [NOTIFICATION_TYPES.OFFER]: Sparkles,
  [NOTIFICATION_TYPES.GENERAL]: Bell,
};

export const NOTIFICATION_COLORS = {
  [NOTIFICATION_TYPES.ORDER]: {
    bg: "#EFF6FF",
    icon: "#2563EB",
  },

  [NOTIFICATION_TYPES.REWARD]: {
    bg: "#ECFDF5",
    icon: "#16A34A",
  },

  [NOTIFICATION_TYPES.COUPON]: {
    bg: "#FEF3C7",
    icon: "#D97706",
  },

  [NOTIFICATION_TYPES.OFFER]: {
    bg: "#F3E8FF",
    icon: "#9333EA",
  },

  [NOTIFICATION_TYPES.GENERAL]: {
    bg: "#F1F5F9",
    icon: "#475569",
  },
};

export const DEMO_NOTIFICATIONS = [
  {
    id: 1,
    type: "order",
    title: "Order Confirmed",
    message: "Your Pizza Margherita order has been accepted.",
    time: "2 min ago",
    section: "Today",
    read: false,
    route: "/customer/orders/1024",
  },

  {
    id: 2,
    type: "reward",
    title: "Reward Unlocked",
    message: "Congratulations! You unlocked a Free Garlic Bread.",
    time: "18 min ago",
    section: "Today",
    read: false,
    route: "/customer/rewards",
  },

  {
    id: 3,
    type: "coupon",
    title: "Coupon Expiring",
    message: "WELCOME20 expires tonight.",
    time: "1 hour ago",
    section: "Today",
    read: true,
    route: "/customer/coupons",
  },

  {
    id: 4,
    type: "offer",
    title: "Weekend Offer",
    message: "Get Flat 20% OFF on all Burgers.",
    time: "Yesterday",
    section: "Yesterday",
    read: true,
    route: "/customer/offers",
  },

  {
    id: 5,
    type: "reward",
    title: "3 Stamps Earned",
    message: "You collected 3 loyalty stamps on your last purchase.",
    time: "Yesterday",
    section: "Yesterday",
    read: true,
    route: "/customer/rewards",
  },

  {
    id: 6,
    type: "order",
    title: "Order Delivered",
    message: "Hope you enjoyed your meal!",
    time: "2 days ago",
    section: "Earlier",
    read: true,
    route: "/customer/orders/1018",
  },

  {
    id: 7,
    type: "general",
    title: "Profile Updated",
    message: "Your profile information was updated successfully.",
    time: "3 days ago",
    section: "Earlier",
    read: true,
    route: "/customer/profile",
  },

  {
    id: 8,
    type: "offer",
    title: "Festival Special",
    message: "Buy 1 Get 1 Pizza this weekend.",
    time: "4 days ago",
    section: "Earlier",
    read: false,
    route: "/customer/offers",
  },
];

export const NOTIFICATION_TABS = [
  {
    id: "all",
    label: "All",
  },
  {
    id: "order",
    label: "Orders",
  },
  {
    id: "reward",
    label: "Rewards",
  },
  {
    id: "coupon",
    label: "Coupons",
  },
  {
    id: "offer",
    label: "Offers",
  },
];