/*
  Demo customer list — stand-in for a real customer directory until the
  backend endpoint (e.g. GET /api/customers) is ready. Shape matches what a
  real API would plausibly return, so swapping this for a fetch() later is
  a drop-in change: just replace the import with a hook that fetches the
  same shape.
*/

export const DEMO_CUSTOMERS = [
  { id: "c1", name: "Rahul Sharma", phone: "+91 98765 43210", orders: 12 },
  { id: "c2", name: "Priya Verma", phone: "+91 91234 56780", orders: 8 },
  { id: "c3", name: "Amit Yadav", phone: "+91 99887 66554", orders: 3 },
  { id: "c4", name: "Sneha Gupta", phone: "+91 90909 11223", orders: 21 },
  { id: "c5", name: "Vikram Singh", phone: "+91 98123 44556", orders: 5 },
  { id: "c6", name: "Anjali Mehta", phone: "+91 97654 32109", orders: 15 },
  { id: "c7", name: "Rohan Kapoor", phone: "+91 93456 78901", orders: 2 },
  { id: "c8", name: "Neha Joshi", phone: "+91 96543 21098", orders: 9 },
  { id: "c9", name: "Karan Malhotra", phone: "+91 92345 67890", orders: 6 },
  { id: "c10", name: "Pooja Iyer", phone: "+91 95678 90123", orders: 18 },
];