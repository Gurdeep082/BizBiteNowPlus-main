const profileData = {
  id: "USR001",

  name: "Customer",

  email: "customer@example.com",

  phone: "+91 9876543210",

  avatar:
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",

  membership: "Gold Member",

  joined: "January 2024",

  city: "Ambala, Haryana",

  totalOrders: 48,

  favouriteItems: 17,

  loyaltyPoints: 1860,
};

const addresses = [
  {
    id: 1,

    type: "Home",

    address:
      "House No. 245, Sector 9",

    landmark:
      "Near Community Park",

    city: "Ambala",

    state: "Haryana",

    pincode: "133001",

    phone: "+91 9876543210",

    default: true,
  },


];

const paymentMethods = [

  {
    id: 1,

    type: "upi",

    title: "Google Pay",

    subtitle: "UPI Payment",

    value: "gurdeep@okaxis",

    default: true,
  },


  {
    id: 2,

    type: "cod",

    title: "Cash on Delivery",

    subtitle: "Pay when order arrives",

    value: "Enabled",

    default: false,
  },

];

const notificationSettings = {
  orders: true,

  offers: true,

  rewards: true,

  email: false,

  security: true,
};

const appSettings = {
  darkMode: false,

  language: "English",

  currency: "INR",

  biometricLogin: false,

  locationAccess: true,
};

export {
  profileData,
  addresses,
  paymentMethods,
  notificationSettings,
  appSettings,
};

export default profileData;