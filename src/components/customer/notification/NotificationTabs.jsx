import { motion } from "framer-motion";
import { NOTIFICATION_TABS } from "../../../data/customer/notificationData";

const NotificationTabs = ({
  activeTab,
  onTabChange,
}) => {
  return (
    <div className="overflow-x-auto scrollbar-hide">
      <div className="flex w-max gap-2 rounded-2xl bg-slate-100 p-1">

        {NOTIFICATION_TABS.map((tab) => {
          const active = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="relative rounded-xl px-4 py-2 text-sm font-medium transition-colors"
            >
              {active && (
                <motion.div
                  layoutId="notification-tab"
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 30,
                  }}
                  className="absolute inset-0 rounded-xl bg-white shadow-sm"
                />
              )}

              <span
                className={`relative z-10 ${
                  active
                    ? "text-[var(--primary)]"
                    : "text-slate-500"
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}

      </div>
    </div>
  );
};

export default NotificationTabs;