const formatPrice = (amount = 0) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

const PriceRow = ({

  label,
  value,
  positive = false,
  bold = false,
  muted = false,
}) => (
  <div
    className={`flex items-center justify-between ${bold ? "pt-4 text-base font-bold" : "text-sm"
      }`}
  >
    <span
      className={
        muted
          ? "text-gray-500 dark:text-slate-400"
          : bold
            ? "text-gray-900 dark:text-white"
            : "text-gray-700 dark:text-slate-300"
      }
    >
      {label}
    </span>

    <span
      className={
        positive
          ? "font-semibold text-green-600"
          : bold
            ? "text-gray-900 dark:text-white"
            : "font-medium text-gray-900 dark:text-slate-200"
      }
    >
      {positive ? "-" : ""}
      {formatPrice(value)}
    </span>
  </div>
);

const PriceBreakdown = ({
  deliveryType = "delivery",
  subtotal = 0,
  discount = 0,
  deliveryFee = 0,
  additionalCharges = [],
  taxes = 0,
  total = 0,
}) => {
  return (
    <div className="space-y-4">
      <PriceRow
        label="Subtotal"
        value={subtotal}
      />

      <PriceRow
        label="Discount"
        value={discount}
        positive
      />
      {deliveryType === "delivery" && (
        <PriceRow
          label="Delivery Fee"
          value={deliveryFee}
        />
      )}
      {additionalCharges.map((charge, index) => (
        <PriceRow
          key={index}
          label={charge.label}
          value={charge.value}
        />
      ))}
      <PriceRow
        label="Taxes & Charges"
        value={taxes}
        muted
      />

      <hr className="border-dashed border-gray-200 dark:border-slate-700" />

      <PriceRow
        label="Grand Total"
        value={total}
        bold
      />
    </div>
  );
};

export default PriceBreakdown;