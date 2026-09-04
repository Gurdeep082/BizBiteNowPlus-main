import { useEffect, useState } from "react";
import { Clock3, AlertTriangle } from "lucide-react";

function getRemaining(target) {
  if (!target) return 0;

  const diff =
    new Date(target).getTime() - Date.now();

  return Math.max(0, diff);
}

function format(ms) {
  const total = Math.floor(ms / 1000);

  const min = Math.floor(total / 60);

  const sec = total % 60;

  return `${String(min).padStart(2, "0")}:${String(
    sec
  ).padStart(2, "0")}`;
}

export default function AutoCancelTimer({
  order,
  onExpire,
}) {
  const [remaining, setRemaining] = useState(
    getRemaining(order.autoCancelAt)
  );

  useEffect(() => {
    if (
      order.status !== "Pending" ||
      !order.autoCancelAt
    ) {
      return;
    }

    const timer = setInterval(() => {
      const time = getRemaining(
        order.autoCancelAt
      );

      setRemaining(time);

      if (time <= 0) {
        clearInterval(timer);
        onExpire?.(order);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [order, onExpire]);

  if (
    order.status !== "Pending" ||
    !order.autoCancelAt
  ) {
    return null;
  }

  const danger = remaining <= 300000;

  return (
    <div
      className={`flex items-center justify-between rounded-xl border p-4 ${
        danger
          ? "border-red-200 bg-red-50"
          : "border-orange-200 bg-orange-50"
      }`}
    >
      <div className="flex items-center gap-3">
        {danger ? (
          <AlertTriangle
            size={20}
            className="text-red-600"
          />
        ) : (
          <Clock3
            size={20}
            className="text-orange-600"
          />
        )}

        <div>
          <p className="text-sm font-semibold">
            Auto Cancel Timer
          </p>

          <p className="text-xs text-slate-500">
            Accept before timer expires
          </p>
        </div>
      </div>

      <span
        className={`rounded-lg px-3 py-1 font-mono text-lg font-bold ${
          danger
            ? "text-red-600"
            : "text-orange-600"
        }`}
      >
        {format(remaining)}
      </span>
    </div>
  );
}