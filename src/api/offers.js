const BASE = "/api/offers";

async function request(path, init) {
  const res = await fetch(`${BASE}${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (!res.ok) {
    throw new Error(`Offers API error (${res.status}): ${await res.text()}`);
  }
  return res.json();
}

// ---- Checkout (customer side) ----

export function saveCustomerBirthday(customerId, day, month) {
  return request(`/customers/${customerId}/birthday`, {
    method: "PUT",
    body: JSON.stringify({ day, month }),
  });
}

/** Offers currently valid (today between validityStart/End) that a
 * customer could redeem — for a banner/list on the storefront. */
export function getActiveOffers() {
  return request("/active");
}

/** Called when a customer enters a code at checkout. orderAmount lets the
 * backend compute the actual discountAmount (and enforce any minimum-order
 * rules) rather than the frontend guessing. */
export function validateOfferCode(code, orderAmount) {
  return request("/validate", {
    method: "POST",
    body: JSON.stringify({ code, orderAmount }),
  });
}

// ---- Dashboard (seller side) ----

export function getOccasionTemplates() {
  return request("/templates");
}

export function sendManualOffer(payload) {
  return request("/send", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getCampaigns() {
  return request("/campaigns");
}