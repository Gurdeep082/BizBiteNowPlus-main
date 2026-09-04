const storeData = {
  id: "store-001",

  name: "BizBite Café",

  tagline: "Fresh Food • Fast Delivery",

  description:
    "Experience freshly prepared meals, premium coffee, and delicious desserts crafted with quality ingredients. Order online or dine in with BizBite Café.",


  // Store Images

  logo:
    "https://images.unsplash.com/photo-1555396273-367ea4eb4db5",

  coverImage:
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4",


  rating: 4.8,

  totalReviews: 2847,

  totalOrders: 18560,


  averageDeliveryTime: "25-35 min",

  distance: "2.4 km",


  isOpen: true,


  openingHours: {
    open: "09:00 AM",
    close: "11:00 PM",
  },


  address: {
    line1: "Sector 17 Market",

    city: "Chandigarh",

    state: "Punjab",

    country: "India",

    pincode: "160017",
  },


  contact: {

    phone:
      "+91 9876543210",

    email:
      "support@bizbite.com",

  },


  delivery: {

    available: true,

    minimumOrder: 199,

    deliveryCharge: 40,

    freeDeliveryAbove: 499,

  },


  offers: [

    {
      id: 1,

      title: "20% OFF",

      description:
        "Get 20% discount on orders above ₹499",

      code:
        "BIZ20",
    },


    {
      id: 2,

      title: "Free Delivery",

      description:
        "Free delivery above ₹499",

      code:
        "FREEDEL",
    },

  ],



  socialLinks: {

    instagram:
      "https://instagram.com/bizbitecafe",


    facebook:
      "https://facebook.com/bizbitecafe",


    website:
      "https://www.bizbite.com",

  },



  theme: {

    primary:
      "#16522D",

    secondary:
      "#FFC700",

    accent:
      "#F8FAFC",

  },

};



export default storeData;