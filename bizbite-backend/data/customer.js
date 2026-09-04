const STORE_ID = "STORE_001";
const SELLER_ID = "SELLER_001";

const customers = [
  {
    id: "CUSTOMER_001",

    storeId: STORE_ID,

    sellerId: SELLER_ID,

    firstName: "Gurdeep",

    lastName: "Singh",

    fullName: "Gurdeep Singh",

    email: "gurdeep@example.com",

    phone: "+91 9876543210",

    profileImage: "",

    joinedAt: "2026-01-01",

    lastLogin: new Date().toISOString(),

    status: "Active",

    loyalty: {
      points: 420,
      lifetimePoints: 820,
      tier: "Gold",
    },

    wallet: {
      balance: 0,
    },

    addresses: [
      {
        id: "ADDR_001",

        title: "Home",

        receiver: "Gurdeep Singh",

        phone: "+91 9876543210",

        address:
          "Sector 17, Ambala",

        city: "Ambala",

        state: "Haryana",

        pincode: "133001",

        landmark: "Near Bus Stand",

        default: true,
      },
    ],

    paymentMethods: [
      {
        id: "PAY_001",

        type: "UPI",

        provider: "Google Pay",

        value: "gurdeep@okhdfcbank",

        default: true,
      },
    ],

    favourites: [],

    coupons: [],

    notificationSettings: {
      orderUpdates: true,
      offers: true,
      rewards: true,
    },
  },
];

// =======================================
// Get Customer
// =======================================

const getCustomer = (customerId) =>
  customers.find(
    (customer) =>
      customer.id === customerId
  ) || null;

// =======================================
// Update Customer
// =======================================

const updateCustomer = (
  customerId,
  updates
) => {
  const customer =
    getCustomer(customerId);

  if (!customer) return null;

  Object.assign(
    customer,
    updates
  );

  return customer;
};

// =======================================
// Loyalty
// =======================================

const addPoints = (
  customerId,
  points
) => {
  const customer =
    getCustomer(customerId);

  if (!customer) return null;

  customer.loyalty.points +=
    points;

  customer.loyalty.lifetimePoints +=
    points;

  if (
    customer.loyalty.points >=
    1000
  ) {
    customer.loyalty.tier =
      "Platinum";
  } else if (
    customer.loyalty.points >=
    500
  ) {
    customer.loyalty.tier =
      "Gold";
  } else if (
    customer.loyalty.points >=
    200
  ) {
    customer.loyalty.tier =
      "Silver";
  } else {
    customer.loyalty.tier =
      "Bronze";
  }

  return customer;
};

// =======================================
// Favourites
// =======================================

const toggleFavourite = (
  customerId,
  productId
) => {
  const customer =
    getCustomer(customerId);

  if (!customer) return null;

  const index =
    customer.favourites.indexOf(
      productId
    );

  if (index >= 0) {
    customer.favourites.splice(
      index,
      1
    );
  } else {
    customer.favourites.push(
      productId
    );
  }

  return customer.favourites;
};

// =======================================
// Export
// =======================================

module.exports = {
  customers,

  getCustomer,

  updateCustomer,

  addPoints,

  toggleFavourite,
};