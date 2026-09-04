import { Check } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "../../context/LanguageContext";

const languages = [
  { code: "en", label: "English", native: "English" },
  { code: "hi", label: "Hindi", native: "हिन्दी" },
];

const Language = () => {
  const { language, setLanguage } = useLanguage();

  const handleLanguageChange = (code) => {
    setLanguage(code); // Context state update karne ke liye

    // 🟢 Google Translate dropdown ko trigger karke poori website translate karein
    const translateDropdown = document.querySelector(".goog-te-combo");
    if (translateDropdown) {
      translateDropdown.value = code; // 'hi' ya 'en'
      translateDropdown.dispatchEvent(new Event("change"));
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
        <div className="bg-white dark:bg-[#181A1B] rounded-2xl shadow-sm overflow-hidden">
          {languages.map(({ code, label, native }, i) => {
            const active = language === code;
            return (
              <button
                key={code}
                onClick={() => handleLanguageChange(code)}
                className={`w-full flex items-center justify-between px-4 py-3.5 text-left hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer ${
                  i < languages.length - 1 ? "border-b border-gray-100 dark:border-[#A9BDCF]/20" : ""
                }`}
              >
                <div>
                  <p className="font-medium text-slate-900 dark:text-white" style={{ fontSize: "15px" }}>
                    {label}
                  </p>
                  <p className="text-gray-400 dark:text-slate-500 mt-0.5" style={{ fontSize: "13px" }}>
                    {native}
                  </p>
                </div>
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
      </div>
    </motion.div>
  );
};

export default Language;
