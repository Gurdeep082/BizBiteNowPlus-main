import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  ShoppingBag,
  MapPin,
  KeyRound,
  Fingerprint,
  MonitorSmartphone,
  LogOut,
  Trash2,
  ShieldCheck,
  ChevronRight,
  Headphones,
  Check,
} from "lucide-react";
import { motion } from "framer-motion";
import Modal from "../../components/customer/common/Modal";

const VISIBILITY_STORAGE_KEY = "customerVisibilitySettings";
const visibilityOptions = ["Only Me", "Everyone"];

const defaultVisibility = {
  profile: "Only Me",
  orders: "Only Me",
  addresses: "Only Me",
};

const visibilityItems = [
  { key: "profile", icon: User, title: "Profile Visibility", subtitle: "Choose who can see your profile information" },
  { key: "orders", icon: ShoppingBag, title: "Order Visibility", subtitle: "Choose who can see your orders" },
  { key: "addresses", icon: MapPin, title: "Saved Addresses", subtitle: "Choose who can see your saved addresses" },
];

const securityItems = [
  { icon: KeyRound, title: "Change Password", subtitle: "Update your password regularly" },
  { icon: Fingerprint, title: "Two-Factor Authentication", subtitle: "Add an extra layer of security", badge: "Off" },
  { icon: MonitorSmartphone, title: "Login Activity", subtitle: "See all devices where you're logged in" },
  { icon: LogOut, title: "Manage Sessions", subtitle: "Log out from other devices" },
];

const dataItems = [
  { icon: Trash2, title: "Delete My Account", subtitle: "Permanently delete your account and data", danger: true },
];

const trustPoints = [
  "Data is encrypted",
  "Secure payments",
  "We never share your data",
];

const Row = ({ icon: Icon, title, subtitle, badge, danger, onClick, isLast }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer ${
      isLast ? "" : "border-b border-gray-100 dark:border-[#A9BDCF]/20"
    }`}
  >
    <Icon
      size={19}
      className="shrink-0"
      style={{ color: danger ? "#EF4444" : "var(--primary-color)" }}
    />
    <div className="flex-1 min-w-0">
      <p
        className={`font-semibold text-[14px] ${danger ? "" : "text-slate-900 dark:text-white"}`}
        style={danger ? { color: "#EF4444" } : undefined}
      >
        {title}
      </p>
      <p className="text-gray-400 dark:text-slate-400 mt-0.5 text-[12px]">{subtitle}</p>
    </div>
    {badge && (
      <span className="text-[12px] font-medium text-gray-400 dark:text-slate-500 shrink-0">
        {badge}
      </span>
    )}
    <ChevronRight size={16} className="text-gray-300 dark:text-slate-600 shrink-0" />
  </button>
);

const PrivacySecurity = () => {
  const navigate = useNavigate();
  const [visibility, setVisibility] = useState(() => {
    const stored = localStorage.getItem(VISIBILITY_STORAGE_KEY);
    if (!stored) return defaultVisibility;
    try {
      return JSON.parse(stored);
    } catch {
      return defaultVisibility;
    }
  });
  const [activeKey, setActiveKey] = useState(null);

  const activeItem = visibilityItems.find((item) => item.key === activeKey);

  const handleSelectVisibility = (value) => {
    setVisibility((prev) => {
      const next = { ...prev, [activeKey]: value };
      localStorage.setItem(VISIBILITY_STORAGE_KEY, JSON.stringify(next));
      return next;
    });
    setActiveKey(null);
  };

  const handleStub = (title) => {
    alert(`${title} isn't available yet.`);
  };

  const handleDeleteAccount = () => {
    if (
      window.confirm(
        "Are you sure you want to delete your account? This can't be undone.",
      )
    ) {
      alert("Account deletion isn't available yet.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="px-4 py-5 pb-28"
    >
      <div className="w-full min-w-0 max-w-[1780px]">
        <div className="grid lg:grid-cols-2 gap-5 items-start">
          {/* Privacy Settings */}
          <div className="bg-white dark:bg-[#181A1B] rounded-2xl shadow-sm overflow-hidden">
            <p className="px-4 pt-4 pb-2 font-bold text-slate-900 dark:text-white text-[15px]">
              Privacy Settings
            </p>
            {visibilityItems.map((item, i) => (
              <Row
                key={item.key}
                {...item}
                badge={visibility[item.key]}
                onClick={() => setActiveKey(item.key)}
                isLast={i === visibilityItems.length - 1}
              />
            ))}
          </div>

          {/* Security Settings */}
          <div className="bg-white dark:bg-[#181A1B] rounded-2xl shadow-sm overflow-hidden">
            <p className="px-4 pt-4 pb-2 font-bold text-slate-900 dark:text-white text-[15px]">
              Security Settings
            </p>
            {securityItems.map((item, i) => (
              <Row
                key={item.title}
                {...item}
                onClick={() => handleStub(item.title)}
                isLast={i === securityItems.length - 1}
              />
            ))}
          </div>

          {/* Data & Privacy */}
          <div className="bg-white dark:bg-[#181A1B] rounded-2xl shadow-sm overflow-hidden">
            <p className="px-4 pt-4 pb-2 font-bold text-slate-900 dark:text-white text-[15px]">
              Data & Privacy
            </p>
            {dataItems.map((item, i) => (
              <Row
                key={item.title}
                {...item}
                onClick={item.title === "Delete My Account" ? handleDeleteAccount : () => handleStub(item.title)}
                isLast={i === dataItems.length - 1}
              />
            ))}
          </div>

          {/* Trust card */}
          <div
            className="rounded-2xl p-6 flex flex-col items-center text-center"
            style={{ backgroundColor: "var(--primary-color-light)", border: "1px solid var(--primary-color-border)" }}
          >
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
              style={{ backgroundColor: "var(--primary-color)" }}
            >
              <ShieldCheck size={30} className="text-white" />
            </div>
            <p className="font-bold text-slate-900 dark:text-white text-[16px]">
              Your privacy is our priority
            </p>
            <p className="text-slate-500 dark:text-slate-400 text-[13px] mt-1.5 max-w-xs">
              We use industry-standard security measures to protect your data
              and ensure a safe experience.
            </p>
            <div className="mt-4 space-y-2 text-left">
              {trustPoints.map((point) => (
                <div key={point} className="flex items-center gap-2">
                  <span
                    className="w-4 h-4 rounded-full flex items-center justify-center shrink-0"
                    style={{ backgroundColor: "var(--primary-color)" }}
                  >
                    <Check size={10} color="#fff" strokeWidth={3} />
                  </span>
                  <span className="text-slate-600 dark:text-slate-300 text-[13px]">{point}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Need help */}
        <div
          className="mt-5 rounded-2xl p-5 flex items-center justify-between gap-4 flex-wrap"
          style={{ backgroundColor: "var(--primary-color-light)", border: "1px solid var(--primary-color-border)" }}
        >
          <div className="flex items-center gap-3">
            <Headphones size={20} style={{ color: "var(--primary-color)" }} className="shrink-0" />
            <div>
              <p className="font-semibold text-slate-900 dark:text-white text-[15px]">
                Need help?
              </p>
              <p className="text-slate-500 dark:text-slate-400 text-[13px] mt-0.5">
                Learn more about privacy and security.
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate("/customer/profile/help-support")}
            className="rounded-xl px-5 py-2.5 text-sm font-semibold shrink-0 cursor-pointer text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: "var(--primary-color)" }}
          >
            Visit Help Center
          </button>
        </div>

        {/* Visibility modal */}
        <Modal
          open={!!activeKey}
          onClose={() => setActiveKey(null)}
          title={activeItem?.title}
          size="sm"
        >
          <div className="space-y-3">
            {visibilityOptions.map((option) => {
              const active = activeKey && visibility[activeKey] === option;
              return (
                <button
                  key={option}
                  onClick={() => handleSelectVisibility(option)}
                  className="w-full flex items-center justify-between rounded-2xl p-4 text-left transition-colors cursor-pointer"
                  style={{
                    border: `2px solid ${active ? "var(--primary-color)" : "#E5E7EB"}`,
                    backgroundColor: active ? "var(--primary-color-light)" : "transparent",
                  }}
                >
                  <span className="font-medium text-slate-900 dark:text-white text-[15px]">
                    {option}
                  </span>
                  {active && (
                    <span
                      className="shrink-0 rounded-full flex items-center justify-center"
                      style={{ width: "22px", height: "22px", backgroundColor: "var(--primary-color)" }}
                    >
                      <Check size={13} color="#fff" strokeWidth={3} />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </Modal>
      </div>
    </motion.div>
  );
};

export default PrivacySecurity;
