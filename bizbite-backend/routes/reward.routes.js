const router = require("express").Router();

const {
  getRewards,
  getReward,
  redeemReward,
} = require("../data/rewards");

const {
  getCustomer,
} = require("../data/customer");

// =======================================
// Get All Rewards
// =======================================

router.get("/", (req, res) => {
  res.json({
    success: true,
    data: getRewards(),
  });
});

// =======================================
// Get Reward By ID
// =======================================

router.get("/:rewardId", (req, res) => {
  const reward = getReward(req.params.rewardId);

  if (!reward) {
    return res.status(404).json({
      success: false,
      message: "Reward not found.",
    });
  }

  res.json({
    success: true,
    data: reward,
  });
});

// =======================================
// Customer Loyalty
// =======================================

router.get(
  "/customer/:customerId/loyalty",
  (req, res) => {
    const customer = getCustomer(
      req.params.customerId
    );

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found.",
      });
    }

    res.json({
      success: true,
      data: customer.loyalty,
    });
  }
);

// =======================================
// Customer Coupons
// =======================================

router.get(
  "/customer/:customerId/coupons",
  (req, res) => {
    const customer = getCustomer(
      req.params.customerId
    );

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found.",
      });
    }

    res.json({
      success: true,
      data: customer.coupons,
    });
  }
);

// =======================================
// Redeem Reward
// =======================================

router.post(
  "/:rewardId/redeem/:customerId",
  (req, res) => {
    const customer = getCustomer(
      req.params.customerId
    );

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found.",
      });
    }

    const result = redeemReward(
      customer,
      req.params.rewardId
    );

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.json({
      success: true,
      message: "Reward redeemed successfully.",
      reward: result.reward,
      loyalty: customer.loyalty,
      coupons: customer.coupons,
    });
  }
);

// =======================================
// Apply Coupon
// =======================================

router.post(
  "/customer/:customerId/coupons/:couponId/apply",
  (req, res) => {
    const customer = getCustomer(
      req.params.customerId
    );

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found.",
      });
    }

    const coupon = customer.coupons.find(
      (coupon) =>
        coupon.id === req.params.couponId
    );

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found.",
      });
    }

    if (coupon.used) {
      return res.status(400).json({
        success: false,
        message: "Coupon already used.",
      });
    }

    res.json({
      success: true,
      message: "Coupon applied.",
      data: coupon,
    });
  }
);

// =======================================
// Mark Coupon Used
// =======================================

router.patch(
  "/customer/:customerId/coupons/:couponId/use",
  (req, res) => {
    const customer = getCustomer(
      req.params.customerId
    );

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found.",
      });
    }

    const coupon = customer.coupons.find(
      (coupon) =>
        coupon.id === req.params.couponId
    );

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found.",
      });
    }

    if (coupon.used) {
      return res.status(400).json({
        success: false,
        message: "Coupon already used.",
      });
    }

    coupon.used = true;
    coupon.usedAt = new Date().toISOString();

    res.json({
      success: true,
      message: "Coupon marked as used.",
      data: coupon,
    });
  }
);

module.exports = router;