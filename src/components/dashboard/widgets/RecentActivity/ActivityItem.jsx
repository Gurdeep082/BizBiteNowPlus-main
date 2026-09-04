import { ACTIVITY_CONFIG } from "./activityConfig";

const ActivityItem = ({
  activity,
  isLast,
}) => {
  const config =
    ACTIVITY_CONFIG[activity.type] ||
    ACTIVITY_CONFIG.default;

  const Icon = config.icon;

  return (
    <div className="relative flex  gap-4">
      {!isLast && (
        <div className="absolute left-5 top-12 h-full w-px bg-gray-200" />
      )}

      <div
        className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full ${config.iconClass}`}
      >
        <Icon size={18} />
      </div>

      <div className="flex-1 pb-6">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-gray-900">
            {activity.title}
          </h4>

          <span className="text-xs text-gray-400">
            {activity.time}
          </span>
        </div>

        <p className="mt-1 text-sm text-gray-500">
          {activity.description}
        </p>
      </div>
    </div>
  );
};

export default ActivityItem;