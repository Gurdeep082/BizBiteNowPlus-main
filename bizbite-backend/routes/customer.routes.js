const router = require("express").Router();

const {
  getCustomer,
  updateCustomer,
  addPoints,
  toggleFavourite,
} = require("../data/customer");

// =======================================
// Get Customer Profile
// =======================================

router.get("/:customerId", (req, res) => {
  const customer = getCustomer(req.params.customerId);

  if (!customer) {
    return res.status(404).json({
      success: false,
      message: "Customer not found.",
    });
  }

  res.json({
    success: true,
    data: customer,
  });
});

// =======================================
// Update Customer Profile
// =======================================

router.patch("/:customerId", (req, res) => {
  const customer = updateCustomer(
    req.params.customerId,
    req.body
  );

  if (!customer) {
    return res.status(404).json({
      success: false,
      message: "Customer not found.",
    });
  }

  res.json({
    success: true,
    message: "Profile updated successfully.",
    data: customer,
  });
});

// =======================================
// Get Addresses
// =======================================

router.get("/:customerId/addresses", (req, res) => {
  const customer = getCustomer(req.params.customerId);

  if (!customer) {
    return res.status(404).json({
      success: false,
      message: "Customer not found.",
    });
  }

  res.json({
    success: true,
    data: customer.addresses,
  });
});

// =======================================
// Add Address
// =======================================

router.post("/:customerId/addresses", (req, res) => {
  const customer = getCustomer(req.params.customerId);

  if (!customer) {
    return res.status(404).json({
      success: false,
      message: "Customer not found.",
    });
  }

  const address = {
    id: `ADDR_${Date.now()}`,
    ...req.body,
  };

  customer.addresses.push(address);

  res.status(201).json({
    success: true,
    data: address,
  });
});

// =======================================
// Delete Address
// =======================================

router.delete(
  "/:customerId/addresses/:addressId",
  (req, res) => {
    const customer = getCustomer(req.params.customerId);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found.",
      });
    }

    customer.addresses =
      customer.addresses.filter(
        (address) =>
          address.id !== req.params.addressId
      );

    res.json({
      success: true,
      message: "Address removed.",
    });
  }
);

// =======================================
// Payment Methods
// =======================================

router.get("/:customerId/payments", (req, res) => {
  const customer = getCustomer(req.params.customerId);

  if (!customer) {
    return res.status(404).json({
      success: false,
      message: "Customer not found.",
    });
  }

  res.json({
    success: true,
    data: customer.paymentMethods,
  });
});

// =======================================
// Loyalty
// =======================================

router.get("/:customerId/loyalty", (req, res) => {
  const customer = getCustomer(req.params.customerId);

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
});

// =======================================
// Add Loyalty Points
// =======================================

router.patch(
  "/:customerId/loyalty",
  (req, res) => {
    const customer = addPoints(
      req.params.customerId,
      req.body.points || 0
    );

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found.",
      });
    }

    res.json({
      success: true,
      message: "Points added.",
      data: customer.loyalty,
    });
  }
);

// =======================================
// Toggle Favourite
// =======================================

router.post(
  "/:customerId/favourites/:productId",
  (req, res) => {
    const favourites =
      toggleFavourite(
        req.params.customerId,
        req.params.productId
      );

    if (!favourites) {
      return res.status(404).json({
        success: false,
        message: "Customer not found.",
      });
    }

    res.json({
      success: true,
      data: favourites,
    });
  }
);

// =======================================
// Get Favourite Products
// =======================================

router.get(
  "/:customerId/favourites",
  (req, res) => {
    const customer = getCustomer(req.params.customerId);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found.",
      });
    }

    res.json({
      success: true,
      data: customer.favourites,
    });
  }
);

module.exports = router;