import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import SettingsCard from "../../components/customer/profile/SettingsCard";

const AccountSettings = () => {
  const navigate = useNavigate();

  const handleSettingsItemClick = (id) => {
    if (id === "support") navigate("/customer/profile/help-support");
    else if (id === "favorites") navigate("/customer/favorites");
    else if (id === "language") navigate("/customer/profile/language");
    else if (id === "appearance") navigate("/customer/profile/appearance");
    else if (id === "terms") navigate("/customer/profile/terms-policy");
    else if (id === "privacy") navigate("/customer/profile/privacy-security");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="w-full max-w-[1780px] mx-auto px-4 sm:px-6 py-6 space-y-6 pb-32 font-sans text-slate-800 dark:text-white"
    >
      {/* Brand New Categorized Settings Components */}
      <div className="space-y-6">
        <SettingsCard onItemClick={handleSettingsItemClick} />
      </div>
    </motion.div>
  );
};

export default AccountSettings;
