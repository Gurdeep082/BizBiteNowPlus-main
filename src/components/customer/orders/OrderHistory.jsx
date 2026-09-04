import { Clock3 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import ReorderButton from "./ReorderButton";
import useCartStore from "../../../api/stores/customerstore/cartStore";
const OrderHistoryCard = ({ order, onView }) => {
  const navigate = useNavigate();
  if (!order) return null;
    const [reordering, setReordering] = useState(null);
  
const addToCart = useCartStore((state) => state.addToCart);

const handleReorder = async (order) => {
  setReordering(order.id);

  try {
    for (const item of order.items) {
      await addToCart({
        ...item,
        quantity: item.quantity,
      });
    }

    navigate("/customer/cart");
  } finally {
    setReordering(null);
  }
};
  return (
    <div
      onClick={() => onView?.(order)}
      className="
        rounded-[28px]

        border
        border-slate-200

        bg-white

        p-5
        hover:shadow-lg
        shadow-sm
      "
    >
      <div
        className="
          flex
          gap-4
        "
      >
        {/* Image */}

        <img
          src={order.items?.[0]?.image}
          alt={order.items?.[0]?.name}
          className="
            h-20
            w-20

            shrink-0

            rounded-2xl

            object-cover
          "
        />

{/* Content */}

<div className="flex-1">
  <div className="flex items-start justify-between gap-3">
<div>
  <h3 className="text-lg font-bold text-slate-900">
    {order.items?.[0]?.name}
  </h3>

  <div
    className="
      mt-2
      flex
      flex-wrap
      items-center
      gap-2
      text-xs
      text-slate-500
    "
  >
    <span>
      {order.createdAt
        ? new Date(order.createdAt).toLocaleDateString(
            "en-IN",
            {
              day: "numeric",
              month: "short",
              year: "numeric",
            }
          )
        : order.date}
    </span>

    <span>•</span>

    <span>
      {order.createdAt
        ? new Date(order.createdAt).toLocaleTimeString(
            "en-IN",
            {
              hour: "2-digit",
              minute: "2-digit",
            }
          )
        : "--:--"}
    </span>

    {order.items?.length > 1 && (
      <>
        <span>•</span>

        <span>
          +{order.items.length - 1} more{" "}
          {order.items.length - 1 === 1
            ? "item"
            : "items"}
        </span>
      </>
    )}
  </div>
</div>

    <span
      className="
        rounded-full
        bg-slate-100
        px-3
        py-1.5
        text-xs
        font-semibold
        text-slate-700
      "
    >
      {order.status}
    </span>
  </div>

  <div className="mt-1 flex items-center justify-between">
    <div className="flex items-center gap-2 text-sm text-slate-500">

      {order.items?.reduce(
        (sum, item) => sum + item.quantity,
        0
      )}{" "}
      Items
    </div>

    <p className="text-lg font-bold text-slate-900">
      ₹{order.summary?.total || order.total}
    </p>
  </div>

<div className="mt-5 flex items-center justify-between">
  <button
    onClick={(e) => {
      e.stopPropagation();
      onView?.(order);
    }}
    className="
      text-sm
      font-semibold
      text-green-700
      transition
      hover:underline
    "
  >
    View Order
  </button>

<div
  onClick={(e) => e.stopPropagation()}
>
  <ReorderButton
    order={order}
    loading={reordering === order.id}
    onReorder={() => handleReorder(order)}
  />
</div>
</div>
   
</div>
      </div>
    </div>
  );
};

export default OrderHistoryCard;
