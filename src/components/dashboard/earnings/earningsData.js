// Summary Cards
export const earningsSummary = {
  todayEarnings: 18450,
  todayOrders: 24,
  averageOrderValue: 769,
  codPending: 6200,
  onlineReceived: 12250,
  monthlyRevenue: 468900,
  revenueGrowth: 18.4,
};

// Revenue Chart
export const earningsChartData = {
  "7d": [
    { day: "Mon", revenue: 8200 },
    { day: "Tue", revenue: 10400 },
    { day: "Wed", revenue: 9600 },
    { day: "Thu", revenue: 11800 },
    { day: "Fri", revenue: 13500 },
    { day: "Sat", revenue: 17100 },
    { day: "Sun", revenue: 18450 },
  ],

  "30d": [
    { day: "1", revenue: 9200 },
    { day: "5", revenue: 14800 },
    { day: "10", revenue: 17300 },
    { day: "15", revenue: 18200 },
    { day: "20", revenue: 21500 },
    { day: "25", revenue: 24600 },
    { day: "30", revenue: 22800 },
  ],

  "90d": [
    { day: "Jan", revenue: 246000 },
    { day: "Feb", revenue: 279000 },
    { day: "Mar", revenue: 301000 },
  ],

  all: [
    { day: "2022", revenue: 1850000 },
    { day: "2023", revenue: 2890000 },
    { day: "2024", revenue: 4120000 },
    { day: "2025", revenue: 5630000 },
    { day: "2026", revenue: 6420000 },
  ],
};

// Today's Orders
export const todaysOrders = [
  {
    id: "#ORD-1001",
    customer: "Rahul Sharma",
    amount: 680,
    payment: "COD",
    status: "Unpaid",
    time: "09:15 AM",
  },
  {
    id: "#ORD-1002",
    customer: "Priya Singh",
    amount: 920,
    payment: "Online",
    status: "Paid",
    time: "09:48 AM",
  },
  {
    id: "#ORD-1003",
    customer: "Arjun Verma",
    amount: 1350,
    payment: "COD",
    status: "Paid",
    time: "10:30 AM",
  },
  {
    id: "#ORD-1004",
    customer: "Neha Gupta",
    amount: 540,
    payment: "COD",
    status: "Unpaid",
    time: "11:42 AM",
  },
  {
    id: "#ORD-1005",
    customer: "Aman Kapoor",
    amount: 1100,
    payment: "Online",
    status: "Paid",
    time: "12:18 PM",
  },
];

// Earnings History
export const earningsHistory = [
  {
    date: "07 Jul 2026",
    orders: 24,
    revenue: 18450,
  },
  {
    date: "06 Jul 2026",
    orders: 21,
    revenue: 17120,
  },
  {
    date: "05 Jul 2026",
    orders: 19,
    revenue: 15890,
  },
  {
    date: "04 Jul 2026",
    orders: 27,
    revenue: 20140,
  },
  {
    date: "03 Jul 2026",
    orders: 22,
    revenue: 17650,
  },
  {
    date: "02 Jul 2026",
    orders: 18,
    revenue: 14980,
  },
  {
    date: "01 Jul 2026",
    orders: 20,
    revenue: 16320,
  },
];

// Regular Customers
export const regularCustomers = [
  {
    id: 1,
    name: "Rahul Sharma",
    orders: 18,
    spent: 28400,
    lastOrder: "Today",
    status: "Gold",
  },
  {
    id: 2,
    name: "Priya Singh",
    orders: 14,
    spent: 21650,
    lastOrder: "Yesterday",
    status: "Silver",
  },
  {
    id: 3,
    name: "Arjun Verma",
    orders: 11,
    spent: 18400,
    lastOrder: "2 Days Ago",
    status: "Gold",
  },
  {
    id: 4,
    name: "Neha Gupta",
    orders: 9,
    spent: 14320,
    lastOrder: "3 Days Ago",
    status: "Bronze",
  },
  {
    id: 5,
    name: "Aman Kapoor",
    orders: 8,
    spent: 12980,
    lastOrder: "5 Days Ago",
    status: "Bronze",
  },
];

// Filters
export const earningsFilters = [
  {
    label: "7 Days",
    value: "7d",
  },
  {
    label: "30 Days",
    value: "30d",
  },
  {
    label: "90 Days",
    value: "90d",
  },
  {
    label: "All Time",
    value: "all",
  },
];