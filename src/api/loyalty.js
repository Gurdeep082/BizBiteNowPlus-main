import API from "./axios";

const SELLER_BASE = "/loyalty";
const CUSTOMER_BASE = "/customer/loyalty";

// Seller
export const getLoyaltySettings = async () => {
  const { data } = await API.get(`${SELLER_BASE}/settings`);
  return data;
};

export const updateLoyaltySettings = async (settings) => {
  const { data } = await API.patch(`${SELLER_BASE}/settings`, settings);
  return data;
};

export const getStampLevelBreakdown = async () => {
  const { data } = await API.get(`${SELLER_BASE}/engagement`);
  return data;
};

// Customer

export const getCustomerLoyaltyStatus = async (sellerId, customerPhone) => {
  const { data } = await API.post(`${CUSTOMER_BASE}/status`, {
    seller_id: sellerId,
    customer_phone: customerPhone,
  });
  return data;
};

export const claimLoyaltyReward = async (sellerId, customerPhone) => {
  const { data } = await API.post(`${CUSTOMER_BASE}/claim`, {
    seller_id: sellerId,
    customer_phone: customerPhone,
  });
  return data;
};
