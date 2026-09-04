/*
  Demo active offers — stand-in for GET /api/offers/active until that
  endpoint is live.

  Discount structure:
  discount: {
    type: "percentage" | "flat" | "delivery",
    value: number,
  }
*/

const today = new Date();

const iso = (date) => date.toISOString().slice(0, 10);

const addDays = (days) => {
  const copy = new Date(today);
  copy.setDate(copy.getDate() + days);
  return iso(copy);
};

export const DEMO_ACTIVE_OFFERS = [
  {
    id: "diwali-2026",
    label: "Diwali Dhamaka",
    description: "Diwali ki hardik shubhkamnayein! Festive season discount.",
    discount: {
      type: "percentage",
      value: 20,
    },
    minOrder: 299,
    maxDiscount: 150,
    code: "DIWALI20",
    validityStart: addDays(-1),
    validityEnd: addDays(4),
  },
  {
    id: "weekend-flat",
    label: "Weekend Special",
    description: "Flat discount on weekend orders.",
    discount: {
      type: "flat",
      value: 50,
    },
    minOrder: 499,
    maxDiscount: 50,
    code: "WEEKEND50",
    validityStart: addDays(-2),
    validityEnd: addDays(2),
  },
  {
    id: "free-delivery",
    label: "Free Delivery",
    description: "No delivery fee, no minimum fuss.",
    discount: {
      type: "delivery",
      value: 0,
    },
    minOrder: 199,
    maxDiscount: 40,
    code: "FREEDEL",
    validityStart: addDays(-1),
    validityEnd: addDays(6),
  },
];