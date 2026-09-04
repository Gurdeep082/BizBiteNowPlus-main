/*
  Bridges seller-generated offers (ActiveOffer, from api/customer/offers.js)
  onto the Coupon shape Coupons.jsx / CouponCard.jsx actually render
  (couponsData.js's shape). Two different data sources, one display format.
*/

const formatDisplayDate = (iso) =>
  new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

export function offerToCoupon(offer) {
  const expired =
    new Date(offer.validityEnd) < new Date(new Date().toDateString());

  return {
    id: offer.id,
    code: offer.code,
    title: offer.label,
    description: offer.description || `Use code ${offer.code} at checkout.`,
    discountType: offer.discount.type, // "percentage" | "flat" | "delivery"
    discount: offer.discount.value,
    minOrder: offer.minOrder,
    maxDiscount: offer.maxDiscount,
    expiry: formatDisplayDate(offer.validityEnd),
    expired,
    featured: false,
  };
}

export function offersToCoupons(offers) {
  return offers.map(offerToCoupon);
}