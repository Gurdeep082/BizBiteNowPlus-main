import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import useCustomerProfileStore from "../../store/customerProfileStore";
import { useTheme } from "../../context/ThemeContext";
import {
  ChevronRight,
  Check,
  User,
  MapPin,
  Settings as SettingsIcon,
  LogIn,
  LogOut,
  AlertCircle,
  Lock,
  ShieldCheck,
  Unlock,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PrimaryButton from "../../components/customer/common/PrimaryButton";

const STEP_COUNT = 3;

// 🟢 Decorative-only preview of the setup journey shown to signed-out visitors
const SETUP_TEASER_STEPS = [
  { label: "User Details", icon: User },
  { label: "Set Password", icon: Lock },
  { label: "Verify Identity", icon: ShieldCheck },
  { label: "Account Settings", icon: SettingsIcon },
  { label: "Access Granted", icon: Unlock, isFinal: true },
];

const Profile = () => {
  const navigate = useNavigate();
  const { darkMode } = useTheme();

  const authUser = useAuthStore((state) => state.user);
  const profile = useAuthStore((state) => state.profile);
  const logoutAction = useAuthStore((state) => state.logout);
  const sellerId = profile?.seller_id || localStorage.getItem("seller_id");

  const addresses = useCustomerProfileStore((state) => state.addresses);
  const fetchAddresses = useCustomerProfileStore(
    (state) => state.fetchAddresses,
  );

  const [user, setUser] = useState({
    name: "",
    phone: "",
  });

  // 🟢 Modal State for Logout Confirmation Before Logging Out
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  useEffect(() => {
    const fetchedName = profile?.customer_name || authUser?.name;
    const fetchedPhone = profile?.customer_phone || authUser?.phone || "";

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUser((prev) => ({
      name:
        prev.name && prev.name !== "Customer"
          ? prev.name
          : fetchedName && fetchedName !== "Customer"
            ? fetchedName
            : "",
      phone: fetchedPhone,
    }));
  }, [authUser, profile]);

  useEffect(() => {
    if (user?.phone) fetchAddresses(user.phone, sellerId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.phone, sellerId]);

  // 🟢 Step 1: Open Confirmation Popup
  const handleLogoutClick = () => {
    setIsLogoutModalOpen(true);
  };

  // 🟢 Step 2: User Confirms -> Clear Auth -> Refresh Screen
  const confirmLogout = () => {
    localStorage.removeItem("bizbite-auth");
    localStorage.removeItem("token");
    localStorage.removeItem("customer_phone");
    localStorage.removeItem("user");
    localStorage.removeItem("profile");

    if (typeof logoutAction === "function") {
      logoutAction();
    }

    // 🔥 Page refresh so all stale React states and hooks clear cleanly
    window.location.reload();
  };

  // 🟢 Reusable Confirmation Modal
  const renderLogoutModal = () => (
    <AnimatePresence>
      {isLogoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 15 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="w-full max-w-sm rounded-3xl bg-white dark:bg-[#181A1B] p-6 sm:p-7 shadow-2xl text-center space-y-5 border border-slate-100 dark:border-white/10"
          >
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400">
              <AlertCircle size={28} />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                Confirm Logout
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
                Are you sure you want to log out of your account?
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
              <button
                onClick={() => setIsLogoutModalOpen(false)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 py-3 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 transition active:scale-[0.99] cursor-pointer"
              >
                Cancel
              </button>

              <button
                onClick={confirmLogout}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-rose-600 hover:bg-rose-700 py-3 text-xs sm:text-sm font-semibold text-white shadow-sm transition active:scale-[0.99] cursor-pointer"
              >
                <LogOut size={16} />
                <span>Yes, Log Out</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  // 🟢 FALLBACK UI: When user is not logged in
  if (!user.phone && !user.name) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="flex min-h-[80vh] w-full flex-col items-center justify-center px-4 py-8 text-center"
      >
        <div className="w-full max-w-md rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xl dark:border-white/10 dark:bg-[#181A1B] flex flex-col items-center">
          <div
            className="mb-4 flex h-16 w-16 sm:h-18 sm:w-18 items-center justify-center rounded-full border-2"
            style={{
              borderColor:
                "color-mix(in srgb, var(--primary-color) 45%, transparent)",
              backgroundColor:
                "color-mix(in srgb, var(--primary-color) 6%, transparent)",
              color: "var(--primary-color)",
            }}
          >
            <User size={28} />
          </div>

          <h2 className="mb-1 text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            You're not logged in
          </h2>

          <p className="mb-6 text-xs sm:text-sm leading-relaxed text-slate-500 dark:text-slate-400 font-medium">
            Log in to view your profile, manage saved addresses, and access
            account settings.
          </p>

          <button
            onClick={() => navigate("/auth/login")}
            onMouseEnter={(e) => {
              e.currentTarget.style.filter = "brightness(0.85)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.filter = "brightness(1)";
            }}
            className="group flex w-full items-center justify-center gap-2 rounded-xl py-3 text-xs sm:text-sm font-semibold text-white shadow-sm transition-all duration-300 active:scale-[0.99] cursor-pointer"
            style={{ backgroundColor: "var(--primary-color)" }}
          >
            <LogIn size={16} />
            <span>Log In Now</span>
          </button>
        </div>

        {/* Decorative preview of the account setup journey */}
        <div className="w-full max-w-2xl mt-10 px-1">
          <div className="flex items-center justify-between mb-6">
            <span className="text-[10px] sm:text-[11px] font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase">
              Account Setup
            </span>
            <span className="text-[10px] sm:text-[11px] font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase">
              Step 1 of {SETUP_TEASER_STEPS.length}
            </span>
          </div>

          <div className="flex items-start">
            {SETUP_TEASER_STEPS.map((step, i) => {
              const isActive = i === 0;
              const Icon = step.icon;
              return (
                <div
                  key={step.label}
                  className="flex items-start flex-1 last:flex-none"
                >
                  <div className="flex flex-col items-center gap-2 shrink-0">
                    <div className="relative">
                      <div
                        className="rounded-full flex items-center justify-center h-9 w-9 sm:h-11 sm:w-11 border-2 transition-all"
                        style={
                          isActive
                            ? {
                                borderColor: "var(--primary-color)",
                                color: "var(--primary-color)",
                                backgroundColor:
                                  "color-mix(in srgb, var(--primary-color) 8%, transparent)",
                              }
                            : undefined
                        }
                      >
                        <Icon
                          size={16}
                          className={
                            isActive
                              ? ""
                              : "text-slate-300 dark:text-slate-600"
                          }
                        />
                      </div>
                      <span
                        className={`absolute -top-1 -right-1 flex h-4 w-4 sm:h-[18px] sm:w-[18px] items-center justify-center rounded-full text-[9px] font-bold ${
                          isActive
                            ? "text-white"
                            : "bg-slate-200 text-slate-500 dark:bg-slate-700 dark:text-slate-400"
                        }`}
                        style={
                          isActive
                            ? { backgroundColor: "var(--primary-color)" }
                            : undefined
                        }
                      >
                        {i + 1}
                      </span>
                    </div>
                    <span
                      className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-wide text-center leading-tight px-0.5 flex items-center gap-1 ${
                        isActive
                          ? ""
                          : "text-slate-400 dark:text-slate-500"
                      }`}
                      style={isActive ? { color: "var(--primary-color)" } : undefined}
                    >
                      {step.label}
                      {step.isFinal && (
                        <Sparkles
                          size={10}
                          style={{ color: "var(--primary-color)" }}
                        />
                      )}
                    </span>
                  </div>

                  {i < SETUP_TEASER_STEPS.length - 1 && (
                    <div className="flex-1 border-t-2 border-dashed border-slate-200 dark:border-slate-700 mx-1 sm:mx-2 mt-[18px] sm:mt-[22px]" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>
    );
  }

  const steps = [
    {
      key: "name",
      done: !!user.name && user.name !== "Customer",
      action: () => navigate("/customer/profile/personal-details"),
    },
    {
      key: "phone",
      done: !!user.phone,
      action: () => navigate("/customer/profile/personal-details"),
    },
    {
      key: "address",
      done: addresses.length > 0,
      action: () => navigate("/customer/profile/addresses"),
    },
  ];
  const completedCount = steps.filter((s) => s.done).length;
  const percent = Math.round((completedCount / STEP_COUNT) * 100);
  const nextStep = steps.find((s) => !s.done);
  const stepMarks = [0, 33, 66, 100];
  const defaultAddress =
    addresses.find((a) => a.is_default || a.default) || addresses[0] || null;

  const menuItems = [
    {
      icon: User,
      label: "Personal Details",
      action: () => navigate("/customer/profile/personal-details"),
    },
    {
      icon: MapPin,
      label: "Saved Addresses",
      action: () => navigate("/customer/profile/addresses"),
    },
    {
      icon: SettingsIcon,
      label: "Account Settings",
      action: () => navigate("/customer/profile/account-settings"),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="w-full max-w-[1780px] mx-auto px-4 sm:px-6 py-6 space-y-5 pb-32 font-sans text-slate-800"
    >
      {/* Completion Progress Card */}
      {percent < 100 ? (
        <div className="bg-white dark:bg-[#181A1B] rounded-2xl border border-slate-200/80 dark:border-white/10 shadow-2xs p-4 sm:p-5 space-y-4">
          <div className="flex items-center">
            {stepMarks.map((mark, i) => (
              <div
                key={mark}
                className="flex items-center flex-1 last:flex-none"
              >
                <div className="flex flex-col items-center">
                  <div
                    className="rounded-full flex items-center justify-center shrink-0 transition-all"
                    style={{
                      width: "18px",
                      height: "18px",
                      backgroundColor:
                        mark <= percent
                          ? "var(--primary-color)"
                          : darkMode
                            ? "#374151"
                            : "#E5E7EB",
                    }}
                  >
                    {mark <= percent && mark > 0 && (
                      <Check size={11} color="#fff" strokeWidth={3} />
                    )}
                  </div>
                  <span
                    className="text-slate-400 dark:text-slate-500 mt-1 font-medium"
                    style={{ fontSize: "10px" }}
                  >
                    {mark}%
                  </span>
                </div>
                {i < stepMarks.length - 1 && (
                  <div
                    className="flex-1 h-[2px] mx-1 mb-4 transition-all"
                    style={{
                      backgroundColor:
                        stepMarks[i + 1] <= percent
                          ? "var(--primary-color)"
                          : darkMode
                            ? "#374151"
                            : "#E5E7EB",
                    }}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between gap-4 flex-wrap pt-1">
            <div>
              <p className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
                Complete your profile
              </p>
              <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-medium mt-0.5">
                {STEP_COUNT - completedCount} step
                {STEP_COUNT - completedCount > 1 ? "s" : ""} left — unlock
                faster checkout and personalized offers.
              </p>
            </div>
            <PrimaryButton size="sm" onClick={nextStep?.action}>
              Continue
            </PrimaryButton>
          </div>
        </div>
      ) : (
        <div
          className="rounded-2xl p-4 sm:p-5 flex items-center gap-3 shadow-2xs"
          style={{
            backgroundColor: "var(--accent-color)",
            border: "1px solid var(--primary-color-border)",
          }}
        >
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
            style={{ backgroundColor: "var(--primary-color)" }}
          >
            <Check size={16} color="#fff" strokeWidth={3} />
          </div>
          <p
            className="font-semibold text-xs sm:text-sm"
            style={{ color: "var(--primary-color)" }}
          >
            Your profile is complete!
          </p>
        </div>
      )}

      {/* Menu Navigation Card */}
      <div className="bg-white dark:bg-[#181A1B] rounded-2xl border border-slate-200/80 dark:border-white/10 shadow-2xs overflow-hidden">
        {menuItems.map(({ icon: Icon, label, action }, i) => (
          <button
            key={label}
            onClick={action}
            className={`w-full flex items-center gap-3.5 px-4 sm:px-5 py-4 text-left hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer ${i < menuItems.length - 1
              ? "border-b border-slate-100 dark:border-slate-800"
              : ""
              }`}
          >
            <Icon
              size={18}
              className="text-slate-500 dark:text-slate-400 shrink-0"
            />
            <span className="flex-1 font-semibold text-slate-900 dark:text-white text-xs sm:text-sm">
              {label}
            </span>
            {label === "Saved Addresses" && defaultAddress && (
              <span className="text-[11px] text-slate-400 max-w-[140px] sm:max-w-[200px] truncate mr-1 font-medium">
                {defaultAddress.delivery_address || defaultAddress.address}
              </span>
            )}
            <ChevronRight
              size={17}
              className="text-slate-300 dark:text-slate-600 shrink-0"
            />
          </button>
        ))}
      </div>

      {/* Log Out Button */}
      <div className="bg-white dark:bg-[#181A1B] rounded-2xl border border-slate-200/80 dark:border-white/10 shadow-2xs overflow-hidden">
        <button
          onClick={handleLogoutClick}
          className="w-full flex items-center justify-between px-4 sm:px-5 py-4 text-left text-rose-600 dark:text-rose-400 hover:bg-rose-50/50 dark:hover:bg-rose-950/10 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3.5">
            <LogOut size={18} className="shrink-0 text-rose-500" />
            <span className="font-semibold text-xs sm:text-sm">Log Out</span>
          </div>
          <ChevronRight
            size={17}
            className="text-rose-300 dark:text-rose-600 shrink-0"
          />
        </button>
      </div>

      {/* Confirmation Modal */}
      {renderLogoutModal()}
    </motion.div>
  );
};

export default Profile;
