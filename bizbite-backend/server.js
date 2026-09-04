const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());

const allowedOrigins = [
  "https://biz-bite-now-plus.vercel.app",
  "http://localhost:5173",
  "http://localhost:4173",
  "http://192.168.1.16:5173",
];

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

// =======================================
// Store
// =======================================

app.use(
  "/api/store",
  require("./routes/store.routes")
);

// =======================================
// Customer
// =======================================

app.use(
  "/api/customer",
  require("./routes/customer.routes")
);

// =======================================
// Menu
// =======================================

app.use(
  "/api/menu",
  require("./routes/menu.routes")
);

// =======================================
// Search
// =======================================

app.use(
  "/api/search",
  require("./routes/search.routes")
);

// =======================================
// Favorites
// =======================================

app.use(
  "/api/favorites",
  require("./routes/favorites.routes")
);

// =======================================
// Cart
// =======================================

app.use(
  "/api/cart",
  require("./routes/cart.routes")
);

// =======================================
// Orders
// =======================================

app.use(
  "/api/orders",
  require("./routes/order.routes")
);

// =======================================
// Profile
// =======================================

app.use(
  "/api/profile",
  require("./routes/profile.routes")
);

// =======================================
// Rewards
// =======================================

app.use(
  "/api/rewards",
  require("./routes/reward.routes")
);

// =======================================
// Reviews
// =======================================

app.use(
  "/api/reviews",
  require("./routes/reviews.routes")
);

// =======================================
// Notifications
// =======================================

app.use(
  "/api/notifications",
  require("./routes/notification.routes")
);

// =======================================

app.listen(5000, () => {
  console.log("BizBite backend running on 5000");
});