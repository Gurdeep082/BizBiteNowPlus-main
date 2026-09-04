const couponsData = [
  {
    id: 1,

    code: "WELCOME20",

    title: "20% OFF for New Users",

    description:
      "Get 20% off on your first order.",

    discountType: "percentage",

    discount: 20,

    minimumOrder: 299,

    maximumDiscount: 150,

    expiry: "31 Dec 2026",

    expired: false,

    featured: true,
  },

  {
    id: 2,

    code: "FREEDEL",

    title: "Free Delivery",

    description:
      "Enjoy free delivery on eligible orders.",

    discountType: "delivery",

    discount: 0,

    minimumOrder: 499,

    maximumDiscount: 40,

    expiry: "31 Dec 2026",

    expired: false,

    featured: true,
  },

  {
    id: 3,

    code: "SAVE100",

    title: "Flat ₹100 OFF",

    description:
      "Flat ₹100 discount on orders above ₹699.",

    discountType: "flat",

    discount: 100,

    minimumOrder: 699,

    maximumDiscount: 100,

    expiry: "15 Nov 2026",

    expired: false,

    featured: false,
  },

  {
    id: 4,

    code: "PIZZA50",

    title: "Pizza Special",

    description:
      "₹50 off on all pizza orders.",

    discountType: "flat",

    discount: 50,

    minimumOrder: 299,

    maximumDiscount: 50,

    expiry: "30 Oct 2026",

    expired: false,

    featured: false,
  },

  {
    id: 5,

    code: "WEEKEND25",

    title: "Weekend Feast",

    description:
      "25% OFF every weekend.",

    discountType: "percentage",

    discount: 25,

    minimumOrder: 599,

    maximumDiscount: 250,

    expiry: "31 Dec 2026",

    expired: false,

    featured: true,
  },

  {
    id: 6,

    code: "EXPIRED50",

    title: "Expired Coupon",

    description:
      "Example of an expired coupon.",

    discountType: "flat",

    discount: 50,

    minimumOrder: 300,

    maximumDiscount: 50,

    expiry: "01 Jan 2025",

    expired: true,

    featured: false,
  },
];

export default couponsData;

export {
  couponsData,
};