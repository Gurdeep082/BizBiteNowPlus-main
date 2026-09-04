const restaurantData = {
  name: "BizBiteNow Kitchen",

  image:
    "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=800&q=80",

  rating: 4.8,

  location: "Ambala, Haryana",
};



const currentOrder = {
  id: "ORD-2026-001",

  status: "Out for Delivery",

  createdAt:
"2026-07-11T12:10:00",

  estimatedDelivery: "15 mins",

  restaurant: restaurantData,


  deliveryPartner: {
    name: "Rahul Sharma",
    phone: "+91 9876543210",
    vehicle: "HR 01 AB 1234",
  },


  tracking: {
    currentStep: 3,

    steps: [
      {
        id: 1,
        title: "Order Placed",
        completed: true,
        time: "12:10 PM",
      },
      {
        id: 2,
        title: "Preparing Food",
        completed: true,
        time: "12:18 PM",
      },
      {
        id: 3,
        title: "Out for Delivery",
        completed: true,
        time: "12:45 PM",
      },
      {
        id: 4,
        title: "Delivered",
        completed: false,
        time: "",
      },
    ],
  },


  items: [
    {
      id: 1,
      name: "Margherita Pizza",
      quantity: 2,
      price: 299,
      total: 598,
      image:
        "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=600&q=80",
    },

    {
      id: 2,
      name: "Cold Coffee",
      quantity: 2,
      price: 149,
      total: 298,
      image:
        "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=600&q=80",
    },
  ],


  summary: {
    subtotal: 896,
    delivery: 40,
    tax: 81,
    discount: 100,
    total: 917,
  },
};





const orderHistory = [

  {
    id: "ORD-2026-0001",

    status: "Delivered",

    createdAt:
"2026-05-11T12:10:00",

    restaurant: restaurantData,


    items: [
      {
        id: 1,
        name: "Chocolate Lava Cake",
        quantity: 2,
        price: 179,
        total: 358,
        image:
          "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80",
      },

      {
        id: 2,
        name: "Cold Coffee",
        quantity: 1,
        price: 149,
        total: 149,
        image:
          "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=600&q=80",
      },
    ],


    summary: {
      subtotal: 507,
      delivery: 40,
      tax: 28,
      discount: 100,
      total: 475,
    },
  },



  {
    id: "ORD-2026-0002",

    status: "Delivered",

    createdAt:
"2026-06-11T12:10:00",

    restaurant: restaurantData,


    items: [
      {
        id: 3,
        name: "Classic Chicken Burger",
        quantity: 2,
        price: 249,
        total: 498,
        image:
          "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80",
      },


      {
        id: 4,
        name: "Creamy Alfredo Pasta",
        quantity: 2,
        price: 279,
        total: 558,
        image:
          "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=600&q=80",
      },
    ],


    summary: {
      subtotal: 1056,
      delivery: 40,
      tax: 53,
      discount: 0,
      total: 1149,
    },
  },



  {
    id: "ORD-2026-0003",

    status: "Cancelled",

    createdAt:
"2026-07-11T12:10:00",

    restaurant: restaurantData,


    items: [
      {
        id: 5,
        name: "Veg Pizza",
        quantity: 1,
        price: 499,
        total: 499,
        image:
          "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80",
      },
    ],


    summary: {
      subtotal: 499,
      delivery: 40,
      tax: 25,
      discount: 0,
      total: 564,
    },
  },

];




export const getCurrentOrder = () => {
  let savedOrders = [];

  try {
    savedOrders =
      JSON.parse(
        localStorage.getItem("customerOrders")
      ) || [];
  } catch {
    savedOrders = [];
  }


  const activeOrder =
    savedOrders
      .filter((order) =>
        [
          "Placed",
          "Confirmed",
          "Preparing",
          "Out for Delivery",
        ].includes(order.status)
      )
      .sort(
        (a, b) =>
          new Date(b.createdAt) -
          new Date(a.createdAt)
      )[0];


  return activeOrder || currentOrder;
};



export const getOrderHistory = () => {

  let savedOrders = [];

  try {
    savedOrders =
      JSON.parse(
        localStorage.getItem("customerOrders")
      ) || [];

  } catch {
    savedOrders = [];
  }


  const completedOrders =
    savedOrders.filter(
      (order) =>
        [
          "Delivered",
          "Cancelled",
        ].includes(order.status)
    );


  const mergedOrders = [
    ...completedOrders,
    ...orderHistory,
  ];


  return Array.from(
    new Map(
      mergedOrders.map(
        (order) => [
          order.id,
          order,
        ]
      )
    ).values()
  ).sort(
    (a,b) =>
      new Date(b.createdAt) -
      new Date(a.createdAt)
  );

};



export {
  currentOrder,
  orderHistory,
};


export default orderHistory;