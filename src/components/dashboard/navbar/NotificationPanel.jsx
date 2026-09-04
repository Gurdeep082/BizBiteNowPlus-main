import {
  ShoppingBag,
  CreditCard,
  AlertTriangle,
  Bell,
  CheckCheck,
} from "lucide-react";
import { notifications } from "./notificationData.js";

const iconMap = {
  order: {
    icon: ShoppingBag,
    bg: "bg-blue-100",
    color: "text-blue-600",
  },
  payment: {
    icon: CreditCard,
    bg: "bg-green-100",
    color: "text-green-600",
  },
  inventory: {
    icon: AlertTriangle,
    bg: "bg-red-100",
    color: "text-red-600",
  },
  system: {
    icon: Bell,
    bg: "bg-gray-100",
    color: "text-gray-600",
  },
};

export default function NotificationPanel() {
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div
      className="
        absolute
        -right-28.5
        mt-3
        w-[380px]
        overflow-hidden
        rounded-2xl
        border
        border-slate-200
        bg-white
        shadow-2xl
        animate-in
        fade-in
        slide-in-from-top-2
        duration-200
      "
    >
      {/* Header */}

      <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
        <div>
          <h3 className="font-semibold text-slate-900">
            Notifications
          </h3>

          <p className="text-sm text-slate-500">
            {unreadCount} unread notifications
          </p>
        </div>

        <button
          className="
            flex
            items-center
            gap-2
            rounded-lg
            px-3
            py-2
            text-sm
            text-[#1A4D2E]
            transition
            hover:bg-[#1A4D2E]/10
          "
        >
          <CheckCheck size={18} />

          Mark all
        </button>
      </div>

      {/* List */}

      <div className="max-h-[420px] overflow-y-auto scrollbar-hide">
        {notifications.map((notification) => {
          const config =
            iconMap[notification.type] || iconMap.system;

          const Icon = config.icon;

          return (
            <button
              key={notification.id}
              className="
                flex
                w-full
                items-start
                gap-4
                border-b
                border-slate-100
                px-5
                py-4
                text-left
                transition
                hover:bg-slate-50
              "
            >
              <div
                className={`
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-xl
                  ${config.bg}
                `}
              >
                <Icon
                  size={20}
                  className={config.color}
                />
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-slate-900">
                    {notification.title}
                  </h4>

                  {!notification.read && (
                    <span className="h-2.5 w-2.5 rounded-full bg-[#FFB703]" />
                  )}
                </div>

                <p className="mt-1 text-sm text-slate-500">
                  {notification.message}
                </p>

                <span className="mt-2 block text-xs text-slate-400">
                  {notification.time}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Footer */}

      <button
        className="
          w-full
          border-t
          border-slate-200
          py-4
          text-center
          font-medium
          text-[#1A4D2E]
          transition
          hover:bg-slate-50
        "
      >
        View All Notifications
      </button>
    </div>
  );
}