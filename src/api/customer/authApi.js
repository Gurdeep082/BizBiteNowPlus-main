// Mock customer auth API
// All functions return Promises — swap with real axios calls later without touching UI

const STORAGE_KEYS = {
  TOKEN: "customerToken",
  USER: "customerUser",
};

const MOCK_OTP = "1234";
const EXISTING_USER_PHONE = "9999999999";

// POST /api/customer/send-otp
export const sendOtp = (phone) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!phone || phone.length !== 10) {
        return reject({ message: "Enter a valid 10-digit mobile number" });
      }
      resolve({ success: true, phone });
    }, 800);
  });
};

// POST /api/customer/verify-otp
export const verifyOtp = (phone, otp) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (otp !== MOCK_OTP) {
        return reject({ message: "Invalid OTP. Please try again." });
      }

      const isNewUser = phone !== EXISTING_USER_PHONE;

      if (!isNewUser) {
        // Existing user — generate token and save mock profile
        const token = "mock_token_" + Date.now();
        const user = {
          id: "cust_existing",
          name: "Existing User",
          phone,
          address: "123, Mock Street, City",
        };
        localStorage.setItem(STORAGE_KEYS.TOKEN, token);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      }

      resolve({ success: true, isNewUser });
    }, 800);
  });
};

// POST /api/customer/save-profile
export const saveProfile = (updates) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (updates.name !== undefined && !updates.name.trim()) {
        return reject({ message: "Name is required" });
      }

      const existingRaw = localStorage.getItem(STORAGE_KEYS.USER);
      const existing = existingRaw ? JSON.parse(existingRaw) : {};

      const token = localStorage.getItem(STORAGE_KEYS.TOKEN) || "mock_token_" + Date.now();
      const user = {
        ...existing,
        id: existing.id || "cust_" + Date.now(),
        ...updates,
      };

      localStorage.setItem(STORAGE_KEYS.TOKEN, token);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));

      resolve({ token, user });
    }, 800);
  });
};

// GET /api/customer/me
export const getMyProfile = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
      const userRaw = localStorage.getItem(STORAGE_KEYS.USER);

      if (!token || !userRaw) {
        return reject({ message: "Not authenticated" });
      }

      try {
        const user = JSON.parse(userRaw);
        resolve(user);
      } catch {
        reject({ message: "Invalid session data" });
      }
    }, 400);
  });
};

// POST /api/customer/logout
export const logoutCustomer = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
      resolve({ success: true });
    }, 300);
  });
};

// Helper — check if customer is logged in (synchronous, no API call)
export const isCustomerLoggedIn = () => {
  return !!localStorage.getItem(STORAGE_KEYS.TOKEN);
};
