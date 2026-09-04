import { NOTIFICATION_CONFIG } from "./notificationConfig.js";

const NotificationItem = ({ notification }) => {
  const config =
    NOTIFICATION_CONFIG[notification.type] ||
    NOTIFICATION_CONFIG.system;

  const Icon = config.icon;

  return (
    <div
      className={`
        flex items-start gap-4 rounded-2xl border p-4
        transition-all duration-200
        hover:border-[#1A4D2E]/20
        hover:bg-gray-50
        ${
          notification.read
            ? "border-gray-200"
            : "border-[#FFB703]/40 bg-[#FFFBEB]"
        }
      `}
    >
      <div
        className={`flex h-11 w-11 items-center justify-center rounded-xl ${config.iconClass}`}
      >
        <Icon size={20} />
      </div>

      <div className="flex-1">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-gray-900">
            {notification.title}
          </h4>

          {!notification.read && (
            <span className="h-2.5 w-2.5 rounded-full bg-[#FFB703]" />
          )}
        </div>

        <p className="mt-1 text-sm text-gray-500">
          {notification.message}
        </p>

        <p className="mt-3 text-xs text-gray-400">
          {notification.time}
        </p>
      </div>
    </div>
  );
};

export default NotificationItem;