import { SUBSCRIPTION } from "../constants/subscription";

export const FEATURES = Object.freeze({
  FESTIVE_MENU: "festiveMenu",
  DELIVERY_MANAGEMENT: "deliveryManagement",
  ANALYTICS: "analytics",
  STAFF: "staff",
  LOYALTY: "loyalty",
  WHATSAPP: "whatsapp",
  AI: "ai",
  REPORTS: "reports",
  MARKETING: "marketing",
});

const PLUS_FEATURES = new Set([
  FEATURES.FESTIVE_MENU,
  FEATURES.DELIVERY_MANAGEMENT,
  FEATURES.ANALYTICS,
  FEATURES.STAFF,
  FEATURES.LOYALTY,
  FEATURES.WHATSAPP,
  FEATURES.AI,
  FEATURES.REPORTS,
  FEATURES.MARKETING,
]);

export const isPlusUser = (user) =>
  user?.subscription === SUBSCRIPTION.PLUS;

export const hasAccess = (user, feature) => {
  if (!PLUS_FEATURES.has(feature)) return true;

  return isPlusUser(user);
};