/*
  Maps raw backend Discount objects (GET /discounts/) onto the Coupon shape
  Coupons.jsx / CouponCard.jsx render (see couponsData.js for the reference
  shape). Field names confirmed against a real GET /discounts/ response on
  2026-07-20 — backend uses snake_case, no title field (falls back to code).
*/

const formatDisplayDate = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export function discountToCoupon(discount) {
  const expiryRaw = discount.valid_until;

  const expired =
    discount.is_active === false || (expiryRaw && new Date(expiryRaw) < new Date());

  return {
    id: discount._id,
    sellerId: discount.seller_id,
    code: discount.code,
    title: discount.description || `Save with ${discount.code}`,
    description: discount.description || `Use code ${discount.code} at checkout.`,
    discountType: discount.discount_type,
    discount: discount.discount_value,
    minOrder: discount.min_order_value,
    maxDiscount: discount.max_discount_cap,
    expiry: formatDisplayDate(expiryRaw),
    expired: Boolean(expired),
    featured: false,
  };
}

export function discountsToCoupons(discounts) {
  return Array.isArray(discounts) ? discounts.map(discountToCoupon) : [];
}