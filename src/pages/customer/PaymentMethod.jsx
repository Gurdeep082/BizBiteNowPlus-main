import { Check, Banknote, Smartphone } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import PrimaryButton from "../../components/customer/common/PrimaryButton";

const PAYMENT_STORAGE_KEY = "customerPaymentMethod";

const PaymentMethod = () => {
  const { darkMode } = useTheme();
  const [paymentMethod, setPaymentMethod] = useState(() => localStorage.getItem(PAYMENT_STORAGE_KEY) || "upi");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    localStorage.setItem(PAYMENT_STORAGE_KEY, paymentMethod);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const options = [
    { key: "cod", label: "Cash on Delivery", desc: "Pay when your order arrives", Icon: Banknote },
    { key: "upi", label: "UPI", desc: "Pay instantly via UPI apps", Icon: Smartphone },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="px-4 py-5 pb-28"
    >
      <div className="w-full min-w-0 max-w-[1780px]">
        <div className="bg-white dark:bg-[#181A1B] rounded-2xl shadow-sm p-5 max-w-xl space-y-3">
          {options.map(({ key, label, desc, Icon }) => {
            const active = paymentMethod === key;
            return (
              <button
                key={key}
                onClick={() => setPaymentMethod(key)}
                className="w-full flex items-center gap-3 rounded-2xl p-4 text-left transition-colors cursor-pointer"
                style={{
                  border: `2px solid ${active ? "var(--primary)" : darkMode ? "#374151" : "#E5E7EB"}`,
                  backgroundColor: active ? "var(--primary-light)" : darkMode ? "#181A1B" : "#FFFFFF",
                }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: active ? "var(--primary)" : darkMode ? "#232627" : "#F3F4F6" }}
                >
                  <Icon size={18} style={{ color: active ? "#FFFFFF" : darkMode ? "#94A3B8" : "#6B7280" }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-900 dark:text-white" style={{ fontSize: "15px" }}>{label}</p>
                  <p className="text-gray-400 dark:text-slate-500" style={{ fontSize: "12px" }}>{desc}</p>
                </div>
                {active && (
                  <span
                    className="shrink-0 rounded-full flex items-center justify-center"
                    style={{ width: "22px", height: "22px", backgroundColor: "var(--primary)" }}
                  >
                    <Check size={13} color="#fff" strokeWidth={3} />
                  </span>
                )}
              </button>
            );
          })}

          <PrimaryButton fullWidth className="mt-2" onClick={handleSave}>
            {saved ? "Saved ✓" : "Save"}
          </PrimaryButton>
        </div>
      </div>
    </motion.div>
  );
};

export default PaymentMethod;
