const rewards = [
  {
    id: "REWARD_001",

    title: "Welcome Reward",

    description:
      "Get ₹100 OFF on your first order.",

    pointsRequired: 0,

    couponCode: "WELCOME100",

    discount: 100,

    type: "Flat",

    active: true,
  },

  {
    id: "REWARD_002",

    title: "Free Dessert",

    description:
      "Redeem a complimentary dessert.",

    pointsRequired: 200,

    couponCode: "DESSERTFREE",

    discount: 179,

    type: "Free Item",

    active: true,
  },

  {
    id: "REWARD_003",

    title: "20% OFF",

    description:
      "Save 20% on your next order.",

    pointsRequired: 500,

    couponCode: "SAVE20",

    discount: 20,

    type: "Percentage",

    active: true,
  },

  {
    id: "REWARD_004",

    title: "₹250 OFF",

    description:
      "Flat ₹250 discount.",

    pointsRequired: 800,

    couponCode: "FLAT250",

    discount: 250,

    type: "Flat",

    active: true,
  },
];

// =======================================
// Get Rewards
// =======================================

const getRewards = () => rewards;

// =======================================
// Get Reward
// =======================================

const getReward = (id) =>
  rewards.find(
    (reward) => reward.id === id
  );

// =======================================
// Redeem Reward
// =======================================

const redeemReward = (
  customer,
  rewardId
) => {
  const reward =
    getReward(rewardId);

  if (!reward)
    return {
      success: false,
      message:
        "Reward not found.",
    };

  if (
    customer.loyalty.points <
    reward.pointsRequired
  ) {
    return {
      success: false,
      message:
        "Not enough points.",
    };
  }

  customer.loyalty.points -=
    reward.pointsRequired;

  customer.coupons.push({
    id:
      "CPN_" +
      Date.now(),

    code:
      reward.couponCode,

    rewardId,

    discount:
      reward.discount,

    type:
      reward.type,

    redeemedAt:
      new Date().toISOString(),

    used: false,
  });

  return {
    success: true,
    reward,
  };
};

module.exports = {
  getRewards,

  getReward,

  redeemReward,
};