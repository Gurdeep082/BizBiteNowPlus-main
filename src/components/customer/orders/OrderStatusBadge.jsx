const statusConfig = {
  Placed: {
    label: "Placed",
    bg: "#FEF3C7",
    color: "#B45309",
  },

  Confirmed: {
    label: "Confirmed",
    bg: "#DBEAFE",
    color: "#1D4ED8",
  },

  Preparing: {
    label: "Preparing",
    bg: "#EDE9FE",
    color: "#6D28D9",
  },

  Ready: {
    label: "Ready",
    bg: "#DCFCE7",
    color: "#15803D",
  },

  "Out for Delivery": {
    label: "Out for Delivery",
    bg: "#E0F2FE",
    color: "#0369A1",
  },

  Delivered: {
    label: "Delivered",
    bg: "#DCFCE7",
    color: "#15803D",
  },

  Cancelled: {
    label: "Cancelled",
    bg: "#FEE2E2",
    color: "#B91C1C",
  },

  Refunded: {
    label: "Refunded",
    bg: "#F3F4F6",
    color: "#4B5563",
  },
};

const OrderStatusBadge = ({
  status = "Placed",
  size = "default",
}) => {
  const current =
    statusConfig[status] ||
    statusConfig.Placed;

  const sizes = {
    small: "px-3 py-1 text-xs",

    default: "px-4 py-2 text-sm",

    large: "px-5 py-2.5 text-base",
  };

  return (
    <span
      className={`
        inline-flex
        items-center
        justify-center
        rounded-full
        font-semibold
        whitespace-nowrap
        ${sizes[size]}
      `}
      style={{
        background: current.bg,
        color: current.color,
      }}
    >
      {current.label}
    </span>
  );
};

export default OrderStatusBadge;