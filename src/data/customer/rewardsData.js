

const loyaltyData = {
  active: true,
  threshold: 5,
  stampsCollected: 3,
  rewardType: "item", // "item" | "discount" | "delivery"
  rewardDetail: "Free dessert",
};
const rewardsData = [
  {
    id: 1,

    title: "Free Cold Coffee",

    description:
      "Redeem 250 points and enjoy a complimentary Cold Coffee.",

    image:
      "https://images.unsplash.com/photo-1517701604599-bb29b565090c",

    points: 250,

    available: true,

    featured: true,
  },

  {
    id: 2,

    title: "20% OFF Coupon",

    description:
      "Redeem for a discount on your next order.",

    image:
      "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f",

    points: 500,

    available: true,

    featured: true,
  },

  {
    id: 3,

    title: "Free Garlic Bread",

    description:
      "Enjoy complimentary Garlic Bread with your next meal.",

    image:
      "https://images.unsplash.com/photo-1509440159596-0249088772ff",

    points: 350,

    available: true,

    featured: false,
  },

  {
    id: 4,

    title: "Premium Dessert",

    description:
      "Redeem points for any premium dessert.",

    image:
      "https://images.unsplash.com/photo-1606313564200-e75d5e30476c",

    points: 700,

    available: false,

    featured: false,
  },
];

const achievementsData = [
  {
    id: 1,

    title: "First Order",

    description:
      "Complete your first order.",

    rarity: "Common",

    reward: "100 Points",

    progress: 100,

    unlocked: true,

    claimed: true,
  },

  {
    id: 2,

    title: "Food Explorer",

    description:
      "Order from 5 different categories.",

    rarity: "Rare",

    reward: "250 Points",

    progress: 100,

    unlocked: true,

    claimed: false,
  },

  {
    id: 3,

    title: "Weekend Lover",

    description:
      "Place 10 weekend orders.",

    rarity: "Epic",

    reward: "Free Dessert",

    progress: 70,

    unlocked: false,

    claimed: false,
  },

  {
    id: 4,

    title: "VIP Customer",

    description:
      "Spend ₹10,000 on orders.",

    rarity: "Legendary",

    reward: "₹500 Coupon",

    progress: 48,

    unlocked: false,

    claimed: false,
  },
];

const giftCardsData = [
  {
    id: 1,

    title: "₹250 Gift Card",

    value: 250,

    price: 250,

    image:
      "https://images.unsplash.com/photo-1556740749-887f6717d7e4",
  },

  {
    id: 2,

    title: "₹500 Gift Card",

    value: 500,

    price: 500,

    image:
      "https://images.unsplash.com/photo-1556740749-887f6717d7e4",
  },

  {
    id: 3,

    title: "₹1000 Gift Card",

    value: 1000,

    price: 1000,

    image:
      "https://images.unsplash.com/photo-1556740749-887f6717d7e4",
  },
];

export {
  loyaltyData,
  rewardsData,
  achievementsData,
  giftCardsData,
};

export default rewardsData;