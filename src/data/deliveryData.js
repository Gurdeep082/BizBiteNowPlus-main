// src/data/deliveryData.js

export const DELIVERY_STATUS = {
  AVAILABLE: "Available",
  ASSIGNED: "Assigned",
  PICKUP: "Picking Up",
  DELIVERY: "Out for Delivery",
  OFFLINE: "Offline",
};

export const deliveryPartners = [
  {
    id: "DB001",
    name: "Ravi Kumar",
    phone: "9876500000",
    email: "ravi@bizbite.com",
    vehicle: "Bike",
    vehicleNumber: "HR01AB1234",
    rating: 4.8,
    completedOrders: 324,
    earningsToday: 1450,
    status: DELIVERY_STATUS.DELIVERY,
    currentOrder: "ORD-1004",
    avatar: "",
    joinedAt: "2025-04-12",
  },

  {
    id: "DB002",
    name: "Amit Sharma",
    phone: "9876500001",
    email: "amit@bizbite.com",
    vehicle: "Scooter",
    vehicleNumber: "HR26XZ2211",
    rating: 4.9,
    completedOrders: 512,
    earningsToday: 1820,
    status: DELIVERY_STATUS.AVAILABLE,
    currentOrder: null,
    avatar: "",
    joinedAt: "2024-10-20",
  },

  {
    id: "DB003",
    name: "Deepak Singh",
    phone: "9876500002",
    email: "deepak@bizbite.com",
    vehicle: "Bike",
    vehicleNumber: "PB10JK4412",
    rating: 4.7,
    completedOrders: 248,
    earningsToday: 1180,
    status: DELIVERY_STATUS.ASSIGNED,
    currentOrder: "ORD-1027",
    avatar: "",
    joinedAt: "2025-01-08",
  },

  {
    id: "DB004",
    name: "Suresh Kumar",
    phone: "9876500003",
    email: "suresh@bizbite.com",
    vehicle: "Bike",
    vehicleNumber: "DL08AA7711",
    rating: 4.6,
    completedOrders: 198,
    earningsToday: 860,
    status: DELIVERY_STATUS.PICKUP,
    currentOrder: "ORD-1009",
    avatar: "",
    joinedAt: "2025-03-11",
  },

  {
    id: "DB005",
    name: "Ajay Kumar",
    phone: "9876500004",
    email: "ajay@bizbite.com",
    vehicle: "Scooter",
    vehicleNumber: "HR05KL5522",
    rating: 4.9,
    completedOrders: 620,
    earningsToday: 2150,
    status: DELIVERY_STATUS.OFFLINE,
    currentOrder: null,
    avatar: "",
    joinedAt: "2023-12-18",
  },
];

export const deliveryStats = {
  totalPartners: deliveryPartners.length,

  availablePartners: deliveryPartners.filter(
    (p) => p.status === DELIVERY_STATUS.AVAILABLE
  ).length,

  assignedPartners: deliveryPartners.filter(
    (p) => p.status === DELIVERY_STATUS.ASSIGNED
  ).length,

  pickupPartners: deliveryPartners.filter(
    (p) => p.status === DELIVERY_STATUS.PICKUP
  ).length,

  deliveryPartnersOnRoad: deliveryPartners.filter(
    (p) => p.status === DELIVERY_STATUS.DELIVERY
  ).length,

  offlinePartners: deliveryPartners.filter(
    (p) => p.status === DELIVERY_STATUS.OFFLINE
  ).length,

  completedOrdersToday: deliveryPartners.reduce(
    (sum, rider) => sum + Math.floor(rider.completedOrders / 20),
    0
  ),

  todayEarnings: deliveryPartners.reduce(
    (sum, rider) => sum + rider.earningsToday,
    0
  ),
};

export const getAvailablePartners = () =>
  deliveryPartners.filter(
    (partner) => partner.status === DELIVERY_STATUS.AVAILABLE
  );

export const getAssignedPartners = () =>
  deliveryPartners.filter(
    (partner) => partner.status !== DELIVERY_STATUS.AVAILABLE
  );

export const getPartnerById = (id) =>
  deliveryPartners.find((partner) => partner.id === id);

export const searchPartners = (query) => {
  if (!query) return deliveryPartners;

  const search = query.toLowerCase();

  return deliveryPartners.filter(
    (partner) =>
      partner.name.toLowerCase().includes(search) ||
      partner.phone.includes(search) ||
      partner.vehicleNumber.toLowerCase().includes(search)
  );
};