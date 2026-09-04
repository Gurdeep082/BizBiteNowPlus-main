const profile = {
  id: 1,

  name: "Guest Customer",

  email: "guest@bizbitenow.com",

  phone: "+91 9876543210",

  avatar:
    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde",

  addresses: [
    {
      id: 1,
      title: "Home",
      address:
        "Saha, Ambala, Haryana",
      city: "Ambala",
      state: "Haryana",
      pincode: "133104",
      default: true,
    },

    {
      id: 2,
      title: "Work",
      address:
        "Chandigarh Road",
      city: "Ambala",
      state: "Haryana",
      pincode: "133001",
      default: false,
    },
  ],


  paymentMethods: [
    {
      id: 1,
      type: "UPI",
      title: "Google Pay",
      value: "guest@upi",
      default: true,
    },

    {
      id: 2,
      type: "Card",
      title: "Visa Card",
      value: "**** **** **** 1234",
      default: false,
    },
  ],


  preferences: {
    notifications: true,
    offers: true,
  },
};


module.exports = profile;