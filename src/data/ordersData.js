// src/data/ordersData.js

export const STATUS = {
  PENDING: "Pending",
  PREPARING: "Preparing",
  READY: "Ready",
  DELIVERY: "Out for Delivery",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

export const PAYMENT = {
  COD: "COD",
  ONLINE: "Online",
};

export const TRACKING = [
  "Placed",
  "Confirmed",
  "Preparing",
  "Out for Delivery",
  "Delivered",
];

const createOrder = ({
  id,
  customer,
  phone,
  address,
  items,
  amount,
  payment,
  paymentStatus,
  status,
  trackingStep,
  createdAt,
  deliveryBoy = "",
  notes = "",
  autoCancelAt = "",
}) => ({
  id,
  orderId: `ORD-${1000 + id}`,
  customer,
  phone,
  address,
  items,
  amount,
  payment,
  paymentStatus,
  status,
 trackingStep,
  createdAt,
  autoCancelAt,
  deliveryBoy,
  notes,
});

export const orders = [

createOrder({
id:1,
customer:"Rahul Sharma",
phone:"9876543210",
address:"Model Town, Ambala",
items:[
{name:"Veg Burger",qty:2,price:120},
{name:"French Fries",qty:1,price:90}
],
amount:330,
payment:PAYMENT.COD,
paymentStatus:"Pending",
status:STATUS.PENDING,
trackingStep:0,
createdAt:"2026-07-05 10:15",
autoCancelAt:"2026-07-05 10:30",
notes:"Extra ketchup"
}),

createOrder({
id:2,
customer:"Priya Verma",
phone:"9898989898",
address:"Sector 21, Chandigarh",
items:[
{name:"Paneer Pizza",qty:1,price:420}
],
amount:420,
payment:PAYMENT.ONLINE,
paymentStatus:"Paid",
status:STATUS.PREPARING,
trackingStep:2,
createdAt:"2026-07-05 09:40",
deliveryBoy:""
}),

createOrder({
id:3,
customer:"Mohit Kumar",
phone:"9911223344",
address:"Kurukshetra",
items:[
{name:"Masala Dosa",qty:2,price:180}
],
amount:360,
payment:PAYMENT.ONLINE,
paymentStatus:"Paid",
status:STATUS.READY,
trackingStep:2,
createdAt:"2026-07-05 08:50"
}),

createOrder({
id:4,
customer:"Simran Kaur",
phone:"9988776655",
address:"Patiala",
items:[
{name:"Cold Coffee",qty:2,price:140}
],
amount:280,
payment:PAYMENT.COD,
paymentStatus:"Pending",
status:STATUS.DELIVERY,
trackingStep:3,
createdAt:"2026-07-05 08:20",
deliveryBoy:"Ravi"
}),

createOrder({
id:5,
customer:"Anjali Singh",
phone:"9870011223",
address:"Panchkula",
items:[
{name:"Veg Momos",qty:3,price:110}
],
amount:330,
payment:PAYMENT.COD,
paymentStatus:"Paid",
status:STATUS.DELIVERED,
trackingStep:4,
createdAt:"2026-07-05 07:15",
deliveryBoy:"Amit"
}),

createOrder({
id:6,
customer:"Karan Malhotra",
phone:"9123456780",
address:"Zirakpur",
items:[
{name:"Chowmein",qty:2,price:160}
],
amount:320,
payment:PAYMENT.ONLINE,
paymentStatus:"Paid",
status:STATUS.DELIVERED,
trackingStep:4,
createdAt:"2026-07-04 19:10",
deliveryBoy:"Deepak"
}),

createOrder({
id:7,
customer:"Ritika Sharma",
phone:"9011223344",
address:"Mohali",
items:[
{name:"Pasta",qty:1,price:260}
],
amount:260,
payment:PAYMENT.COD,
paymentStatus:"Pending",
status:STATUS.PENDING,
trackingStep:0,
createdAt:"2026-07-05 11:05",
autoCancelAt:"2026-07-05 11:20"
}),

createOrder({
id:8,
customer:"Harsh Gupta",
phone:"9877776655",
address:"Yamunanagar",
items:[
{name:"Paneer Roll",qty:2,price:150}
],
amount:300,
payment:PAYMENT.ONLINE,
paymentStatus:"Paid",
status:STATUS.PREPARING,
trackingStep:2,
createdAt:"2026-07-05 10:05"
}),

createOrder({
id:9,
customer:"Neha Kapoor",
phone:"9899112233",
address:"Delhi",
items:[
{name:"Farmhouse Pizza",qty:1,price:499}
],
amount:499,
payment:PAYMENT.ONLINE,
paymentStatus:"Paid",
status:STATUS.DELIVERY,
trackingStep:3,
createdAt:"2026-07-05 09:15",
deliveryBoy:"Suresh"
}),

createOrder({
id:10,
customer:"Aman Jain",
phone:"9876540000",
address:"Karnal",
items:[
{name:"Cheese Sandwich",qty:2,price:170}
],
amount:340,
payment:PAYMENT.COD,
paymentStatus:"Pending",
status:STATUS.CANCELLED,
trackingStep:0,
createdAt:"2026-07-03 14:00"
}),

];
createOrder({
id:11,
customer:"Pooja Mehta",
phone:"9811122233",
address:"Rohtak",
items:[
{name:"Veg Noodles",qty:2,price:180},
{name:"Coke",qty:2,price:40}
],
amount:440,
payment:PAYMENT.ONLINE,
paymentStatus:"Paid",
status:STATUS.DELIVERED,
trackingStep:4,
createdAt:"2026-07-02 18:40",
deliveryBoy:"Ajay"
}),

createOrder({
id:12,
customer:"Sahil Arora",
phone:"9822233344",
address:"Hisar",
items:[
{name:"Cheese Pizza",qty:1,price:520}
],
amount:520,
payment:PAYMENT.COD,
paymentStatus:"Pending",
status:STATUS.PENDING,
trackingStep:0,
createdAt:"2026-07-05 12:10",
autoCancelAt:"2026-07-05 12:25"
}),

createOrder({
id:13,
customer:"Komal Sharma",
phone:"9833344455",
address:"Panipat",
items:[
{name:"Veg Thali",qty:2,price:240}
],
amount:480,
payment:PAYMENT.ONLINE,
paymentStatus:"Paid",
status:STATUS.READY,
trackingStep:2,
createdAt:"2026-07-05 11:35"
}),

createOrder({
id:14,
customer:"Rohit Yadav",
phone:"9844455566",
address:"Sonipat",
items:[
{name:"Burger Combo",qty:2,price:250}
],
amount:500,
payment:PAYMENT.COD,
paymentStatus:"Pending",
status:STATUS.PREPARING,
trackingStep:2,
createdAt:"2026-07-05 09:55"
}),

createOrder({
id:15,
customer:"Sneha Kapoor",
phone:"9855566677",
address:"Delhi",
items:[
{name:"Paneer Wrap",qty:3,price:180}
],
amount:540,
payment:PAYMENT.ONLINE,
paymentStatus:"Paid",
status:STATUS.DELIVERY,
trackingStep:3,
createdAt:"2026-07-05 08:45",
deliveryBoy:"Vikas"
}),

createOrder({
id:16,
customer:"Aakash Singh",
phone:"9866677788",
address:"Kaithal",
items:[
{name:"Chole Bhature",qty:2,price:170}
],
amount:340,
payment:PAYMENT.COD,
paymentStatus:"Paid",
status:STATUS.DELIVERED,
trackingStep:4,
createdAt:"2026-07-01 13:30",
deliveryBoy:"Rohit"
}),

createOrder({
id:17,
customer:"Nitin Verma",
phone:"9877788899",
address:"Kurukshetra",
items:[
{name:"Spring Roll",qty:4,price:90}
],
amount:360,
payment:PAYMENT.ONLINE,
paymentStatus:"Paid",
status:STATUS.DELIVERED,
trackingStep:4,
createdAt:"2026-06-29 19:20",
deliveryBoy:"Rahul"
}),

createOrder({
id:18,
customer:"Manpreet Kaur",
phone:"9888899900",
address:"Ludhiana",
items:[
{name:"White Sauce Pasta",qty:2,price:260}
],
amount:520,
payment:PAYMENT.COD,
paymentStatus:"Pending",
status:STATUS.PENDING,
trackingStep:0,
createdAt:"2026-07-05 12:40",
autoCancelAt:"2026-07-05 12:55"
}),

createOrder({
id:19,
customer:"Deepak Sharma",
phone:"9899900011",
address:"Ambala Cantt",
items:[
{name:"Tandoori Momos",qty:2,price:190}
],
amount:380,
payment:PAYMENT.ONLINE,
paymentStatus:"Paid",
status:STATUS.PREPARING,
trackingStep:2,
createdAt:"2026-07-05 10:45"
}),

createOrder({
id:20,
customer:"Ishita Gupta",
phone:"9900011122",
address:"Noida",
items:[
{name:"Margherita Pizza",qty:2,price:350}
],
amount:700,
payment:PAYMENT.ONLINE,
paymentStatus:"Paid",
status:STATUS.DELIVERED,
trackingStep:4,
createdAt:"2026-06-28 20:15",
deliveryBoy:"Sanjay"
}),
createOrder({
id:21,
customer:"Vikas Arora",
phone:"9911001100",
address:"Chandigarh",
items:[
{name:"Paneer Tikka",qty:2,price:280}
],
amount:560,
payment:PAYMENT.COD,
paymentStatus:"Pending",
status:STATUS.READY,
trackingStep:2,
createdAt:"2026-07-05 12:55"
}),

createOrder({
id:22,
customer:"Riya Sharma",
phone:"9922002200",
address:"Mohali",
items:[
{name:"Veg Sandwich",qty:3,price:120}
],
amount:360,
payment:PAYMENT.ONLINE,
paymentStatus:"Paid",
status:STATUS.DELIVERY,
trackingStep:3,
createdAt:"2026-07-05 11:20",
deliveryBoy:"Ankit"
}),

createOrder({
id:23,
customer:"Harpreet Singh",
phone:"9933003300",
address:"Patiala",
items:[
{name:"Paneer Kulcha",qty:2,price:190}
],
amount:380,
payment:PAYMENT.ONLINE,
paymentStatus:"Paid",
status:STATUS.DELIVERED,
trackingStep:4,
createdAt:"2026-06-27 18:10",
deliveryBoy:"Amit"
}),

createOrder({
id:24,
customer:"Sonia Mehta",
phone:"9944004400",
address:"Delhi",
items:[
{name:"Veg Fried Rice",qty:2,price:180}
],
amount:360,
payment:PAYMENT.COD,
paymentStatus:"Pending",
status:STATUS.PENDING,
trackingStep:0,
createdAt:"2026-07-05 13:05",
autoCancelAt:"2026-07-05 13:20"
}),

createOrder({
id:25,
customer:"Arjun Kapoor",
phone:"9955005500",
address:"Noida",
items:[
{name:"Loaded Burger",qty:2,price:260}
],
amount:520,
payment:PAYMENT.ONLINE,
paymentStatus:"Paid",
status:STATUS.PREPARING,
trackingStep:2,
createdAt:"2026-07-05 10:10"
}),

createOrder({
id:26,
customer:"Nisha Verma",
phone:"9966006600",
address:"Karnal",
items:[
{name:"Cold Coffee",qty:4,price:140}
],
amount:560,
payment:PAYMENT.COD,
paymentStatus:"Paid",
status:STATUS.DELIVERED,
trackingStep:4,
createdAt:"2026-06-25 17:45",
deliveryBoy:"Ravi"
}),

createOrder({
id:27,
customer:"Raman Deep",
phone:"9977007700",
address:"Yamunanagar",
items:[
{name:"Veg Pizza",qty:2,price:420}
],
amount:840,
payment:PAYMENT.ONLINE,
paymentStatus:"Paid",
status:STATUS.DELIVERY,
trackingStep:3,
createdAt:"2026-07-05 09:40",
deliveryBoy:"Deepak"
}),

createOrder({
id:28,
customer:"Kritika Sharma",
phone:"9988008800",
address:"Ambala",
items:[
{name:"Pasta Alfredo",qty:2,price:260}
],
amount:520,
payment:PAYMENT.COD,
paymentStatus:"Pending",
status:STATUS.READY,
trackingStep:2,
createdAt:"2026-07-05 12:15"
}),

createOrder({
id:29,
customer:"Yash Bansal",
phone:"9999009900",
address:"Hisar",
items:[
{name:"Momos",qty:5,price:110}
],
amount:550,
payment:PAYMENT.ONLINE,
paymentStatus:"Paid",
status:STATUS.DELIVERED,
trackingStep:4,
createdAt:"2026-06-24 21:15",
deliveryBoy:"Mohit"
}),

createOrder({
id:30,
customer:"Muskan Jain",
phone:"9000112233",
address:"Panchkula",
items:[
{name:"Veg Supreme Pizza",qty:1,price:650}
],
amount:650,
payment:PAYMENT.COD,
paymentStatus:"Pending",
status:STATUS.PENDING,
trackingStep:0,
createdAt:"2026-07-05 13:15",
autoCancelAt:"2026-07-05 13:30"
})


export const orderStats = {
  totalOrders: orders.length,
  pendingOrders: orders.filter(o => o.status === STATUS.PENDING).length,
  preparingOrders: orders.filter(o => o.status === STATUS.PREPARING).length,
  readyOrders: orders.filter(o => o.status === STATUS.READY).length,
  deliveryOrders: orders.filter(o => o.status === STATUS.DELIVERY).length,
  deliveredOrders: orders.filter(o => o.status === STATUS.DELIVERED).length,
  cancelledOrders: orders.filter(o => o.status === STATUS.CANCELLED).length,
  totalRevenue: orders
    .filter(o => o.status === STATUS.DELIVERED)
    .reduce((sum, o) => sum + o.amount, 0),
};

export const getNewOrders = () =>
  orders.filter(o => o.status !== STATUS.DELIVERED);

export const getCompletedOrders = () =>
  orders.filter(o => o.status === STATUS.DELIVERED);

export const getTodayOrders = () =>
  orders.filter(o => o.createdAt.startsWith("2026-07-05"));

export const get30DaysOrders = () => orders;

export const getPendingCODOrders = () =>
  orders.filter(
    o =>
      o.payment === PAYMENT.COD &&
      o.paymentStatus === "Pending"
  );