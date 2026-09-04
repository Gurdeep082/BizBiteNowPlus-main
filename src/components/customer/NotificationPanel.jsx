import { X, Bell, ChevronRight } from "lucide-react";
import { useState } from "react";

const ORANGE = "#E8622D";
const CREAM = "#FBE7DD";
const CHARCOAL = "#1C1C1C";

const NotificationPanel = ({ notifications, onClose, onBrowseMenu }) => {
  const [pushEnabled, setPushEnabled] = useState(true);

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40" onClick={onClose} />

      {/* Panel */}
      <div
        className="fixed top-20 left-1/2 -translate-x-1/2 sm:absolute sm:top-full sm:left-auto sm:right-0 sm:translate-x-0 sm:mt-2 z-50 bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        style={{ width: "min(380px, 92vw)", maxHeight: "76vh", fontFamily: "Arial, sans-serif" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <h2 className="font-bold" style={{ color: CHARCOAL, fontSize: "22px" }}>
            Notifications
          </h2>
          <button
            onClick={onClose}
            className="flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 transition-colors cursor-pointer"
            style={{ width: "32px", height: "32px" }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Push notifications toggle */}
        <div className="mx-4 mb-2 rounded-2xl px-4 py-3 flex items-center gap-3" style={{ backgroundColor: CREAM }}>
          <Bell size={18} style={{ color: ORANGE }} className="shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="font-bold" style={{ color: CHARCOAL, fontSize: "14px" }}>
              Push Notifications
            </p>
            <p className="text-gray-400" style={{ fontSize: "12px" }}>
              Automatically send new notifications
            </p>
          </div>
          <button
            onClick={() => setPushEnabled((v) => !v)}
            className="relative shrink-0 rounded-full transition-colors cursor-pointer"
            style={{ width: "40px", height: "22px", backgroundColor: pushEnabled ? ORANGE : "#D1D5DB" }}
          >
            <span
              className="absolute rounded-full bg-white transition-transform shadow-sm"
              style={{
                top: "2px",
                left: "2px",
                width: "18px",
                height: "18px",
                transform: pushEnabled ? "translateX(18px)" : "translateX(0)",
              }}
            />
          </button>
        </div>

        {/* Notification list */}
        <div className="flex-1 overflow-y-auto px-2 scrollbar-hide">
          {notifications.map((item, i) => (
            <div
              key={item.id}
              className={`flex items-center gap-3 px-3 py-3 ${i < notifications.length - 1 ? "border-b border-gray-100" : ""}`}
            >
              <div className="shrink-0 w-12 h-12 rounded-xl bg-gray-100 overflow-hidden">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="uppercase tracking-wide font-semibold" style={{ color: ORANGE, fontSize: "10px" }}>
                  {item.tag}
                </p>
                <p className="font-bold truncate" style={{ color: CHARCOAL, fontSize: "14px" }}>
                  {item.title}
                </p>
                <p className="text-gray-400 truncate" style={{ fontSize: "12px" }}>
                  {item.meta}
                </p>
              </div>
              <span className="shrink-0 font-bold" style={{ color: ORANGE, fontSize: "14px" }}>
                ₹{item.price}
              </span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="p-4">
          <button
            onClick={onBrowseMenu}
            className="w-full flex items-center justify-center gap-1.5 font-bold rounded-full text-white transition-opacity hover:opacity-90 cursor-pointer"
            style={{ minHeight: "48px", fontSize: "15px", backgroundColor: ORANGE }}
          >
            Browse Menu
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </>
  );
};

export default NotificationPanel;