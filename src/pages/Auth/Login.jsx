import { useState, useEffect, useMemo } from "react";
import { Phone, ShieldCheck, Lock, ArrowLeft, AlertCircle, Bike, Gift } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import logoHorizontal from "../../assets/bizbite_logo_horizontal.png";
const bgImage = "/bg.png";
import useAuthStore from "../../store/authStore";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";

const STEPS_SELLER = ["phone", "otp", "pin"];
const STEPS_CUSTOMER = ["phone", "pin"];

const DEFAULT_THEME_COLORS = {
  primary: "#16522d",
  secondary: "#14bb54",
  accent: "#ffc700",
};

// Maps a staff module name (from profile.modules) to the route they should
// land on after login. Adjust the paths on the right to match the actual
// seller-panel routes for each module.
const STAFF_MODULE_ROUTES = {
  billing: "/seller/billing",
  orders: "/seller/orders",
  products: "/seller/products",
  categories: "/seller/categories",
  "dine-in": "/seller/dine-in",
  dine_in: "/seller/dine-in",
  analytics: "/seller/analytics",
  delivery: "/seller/delivery",
  "special-offers": "/seller/special-offers",
  special_offers: "/seller/special-offers",
  settings: "/seller/settings",
  earnings: "/seller/earnings",
  customers: "/seller/customers",
  staff: "/seller/staff",
  festivemenu: "/seller/festivemenu",
  festive_deals: "/seller/festivemenu",
  "landing-page": "/seller/landing-page",
  landing_page: "/seller/landing-page",
  profile: "/seller/profile",
  dashboard: "/seller/dashboard",
};

const getStaffLandingRoute = (modules) => {
  if (!Array.isArray(modules) || modules.length === 0) {
    return "/seller/dashboard";
  }
  const firstKnownModule = modules.find((m) => STAFF_MODULE_ROUTES[m]);
  return firstKnownModule ? STAFF_MODULE_ROUTES[firstKnownModule] : "/seller/dashboard";
};

const normalizePhoneLocal = (phoneStr) => {
  if (!phoneStr) return "";
  let digits = String(phoneStr).replace(/\D/g, "").trim();
  if (digits.length === 12 && digits.startsWith("91")) {
    digits = digits.slice(2);
  } else if (digits.length > 10) {
    digits = digits.slice(-10);
  }
  return digits;
};

// loginInit returns a 404 specifically when no account exists for the
// entered number (confirmed via network logs). Any other failure
// (validation, 5xx, network error, etc.) should show as a normal error,
// not redirect to registration.
const isAccountNotFoundError = (err) => {
  return err?.response?.status === 404;
};

export default function Login() {
  const navigate = useNavigate();
  const { loginInit, verifyOTP, resendOTP, login, loading } = useAuthStore();

  const [step, setStep] = useState("phone");
  const [error, setError] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [reqId, setReqId] = useState("");
  const [loginRole, setLoginRole] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resendMessage, setResendMessage] = useState("");

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  useEffect(() => {
    if (resendMessage) toast.success(resendMessage);
  }, [resendMessage]);
  const [isInputFocused, setIsInputFocused] = useState(false);

  const [storeInfo, setStoreInfo] = useState({
    logo: "",
    store_name: "",
    address: "",
    is_open: true,
    theme_colors: DEFAULT_THEME_COLORS,
  });

  const [formData, setFormData] = useState({
    phoneNumber: "",
    otp: "",
    pin: "",
  });

  const STEPS = loginRole === "seller" ? STEPS_SELLER : STEPS_CUSTOMER;
  const stepIndex = STEPS.indexOf(step);
  const progressRatio = STEPS.length > 1 ? stepIndex / (STEPS.length - 1) : 0;

  const isStoreOpen = useMemo(() => {
    return storeInfo?.is_open !== undefined ? Boolean(storeInfo.is_open) : true;
  }, [storeInfo]);

  useEffect(() => {
    const fetchStoreBranding = async () => {
      const sellerId =
        import.meta.env.VITE_DEFAULT_SELLER_ID ||
        localStorage.getItem("seller_id");

      if (!sellerId) return;

      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/customer/store/${sellerId}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );

        const res = await response.json();

        if (res?.success && res?.data) {
          const storeData = res.data;
          const profile = storeData.store_profile || {};
          const bizInfo = storeData.contact_info || {};

          setStoreInfo({
            logo: profile.logo || logoHorizontal,
            store_name: profile.store_name || storeData.business_name,
            // TODO: backend doesn't send a shop address yet — swap this
            // dummy value for the real field (e.g. bizInfo.address) once
            // that API is ready.
            address:
              bizInfo.address ||
              bizInfo.address ||
              [bizInfo.city, bizInfo.state].filter(Boolean).join(", ") ||
              "123 MG Road, Shahjahanpur, UP",
            is_open: storeData.is_open !== undefined ? storeData.is_open : true,
            theme_colors: {
              primary: profile.theme_colors?.primary || DEFAULT_THEME_COLORS.primary,
              secondary: profile.theme_colors?.secondary || DEFAULT_THEME_COLORS.secondary,
              accent: profile.theme_colors?.accent || DEFAULT_THEME_COLORS.accent,
            },
          });
        }
      } catch (err) {
        console.warn("Store fetch warning handled safely:", err);
      }
    };

    fetchStoreBranding();
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--primary-color", storeInfo.theme_colors.primary);
    root.style.setProperty("--secondary-color", storeInfo.theme_colors.secondary);
    root.style.setProperty("--accent-color", storeInfo.theme_colors.accent);
  }, [storeInfo.theme_colors]);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(
      () => setResendCooldown((s) => Math.max(s - 1, 0)),
      1000
    );
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const cleanPhone = normalizePhoneLocal(formData.phoneNumber);
    if (!/^[0-9]{10}$/.test(cleanPhone)) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    try {
      const responseData = await loginInit({ identifier: cleanPhone });

      // Customer & Staff, PIN-only flow (no OTP step). Note: the OTP branch
      // below (for Seller) is served by sendOtp(), whose response has no
      // `role` field at all — so this check must stay a positive match on
      // "Customer"/"Staff", never a `!== "Seller"` negation, or an
      // undefined role would wrongly fall into this branch for Sellers too.
      if (
        responseData.requiresOtp === false ||
        responseData.role === "Customer" ||
        responseData.role === "Staff"
      ) {
        setLoginRole(responseData.role === "Staff" ? "staff" : "customer");
        setStep("pin");
        return;
      }

      // Seller flow: OTP -> PIN
      setLoginRole("seller");
      const incomingReqId = responseData.data?.message || responseData.reqId || "";
      setReqId(incomingReqId);
      setStep("otp");
    } catch (err) {
      // New / unregistered number -> send straight to account creation
      if (isAccountNotFoundError(err)) {
        navigate("/customer/register", { state: { phoneNumber: cleanPhone } });
        return;
      }
      setError(err.response?.data?.message || "Unable to continue. Please try again.");
    }
  };

  const handleResendOtp = async () => {
    setError("");
    setResendMessage("");

    try {
      await resendOTP({ reqId });
      setResendMessage("OTP resent successfully.");
      setResendCooldown(30);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to resend OTP.");
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!/^[0-9]{4,6}$/.test(formData.otp.trim())) {
      setError("Please enter the valid OTP sent to your phone.");
      return;
    }

    try {
      await verifyOTP({ reqId, otp: formData.otp, purpose: "LOGIN" });
      setStep("pin");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP. Please try again.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.pin.trim()) {
      setError("Please enter your PIN.");
      return;
    }

    try {
      const verificationToken = useAuthStore.getState().verificationToken;

      // 🟢 FIX: redirect based on the role the backend actually returns,
      // not the locally-guessed `loginRole` state. Previously Staff was
      // bucketed into the same branch as Customer (both skip OTP), so
      // `loginRole` ended up as "customer" and Staff got sent to
      // /customer/home instead of the seller dashboard — they had to
      // navigate there manually every time.
      const loginResponse = await login({
        identifier: normalizePhoneLocal(formData.phoneNumber),
        pin: formData.pin,
        fcm_token: null,
        verificationToken,
      });

      const actualRole = loginResponse?.user?.role;

      toast.success("Welcome back! You are signed in.");

      if (actualRole === "Staff") {
        // 🟢 Staff must land on whichever module they were actually
        // assigned (profile.modules), not the full seller dashboard —
        // otherwise they can see/perform actions outside their scope.
        const assignedModules = loginResponse?.profile?.modules;
        navigate(getStaffLandingRoute(assignedModules));
      } else if (actualRole === "Seller") {
        navigate("/seller/dashboard");
      } else {
        navigate("/customer");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid PIN. Please try again.");
    }
  };

  const goBack = () => {
    setError("");
    const idx = STEPS.indexOf(step);
    if (idx > 0) setStep(STEPS[idx - 1]);
    else setStep("phone");
  };

  const applyLightHover = (e) => {
    e.currentTarget.style.opacity = "0.9";
  };
  const resetLightHover = (e) => {
    e.currentTarget.style.opacity = "1";
  };
  const applyAccentText = (e) => {
    e.currentTarget.style.color = "var(--accent-color)";
  };
  const resetPrimaryText = (e) => {
    e.currentTarget.style.color = "var(--primary-color)";
  };

  return (
    <>
      {/* ============ DESKTOP / LAPTOP (lg and up) — original split branding layout ============ */}
      <div
        className="relative hidden lg:flex min-h-screen w-full items-center justify-center overflow-x-hidden p-6 font-sans"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div
          className="absolute inset-0 z-0 pointer-events-none"
          style={{ backgroundColor: "var(--primary-color)", opacity: 0.2 }}
        />

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="relative z-10 w-full max-w-4xl space-y-3"
        >
          {!isStoreOpen && (
            <div className="w-full rounded-2xl bg-rose-50 border border-rose-100 p-3.5 text-rose-700 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <AlertCircle size={20} className="text-rose-500 shrink-0" />
                <div>
                  <h4 className="text-xs sm:text-sm font-semibold">{storeInfo.store_name} is Currently Closed</h4>
                  <p className="text-[11px] sm:text-xs text-rose-600/80 mt-0.5">
                    We are not accepting orders right now, but you can still explore our menu.
                  </p>
                </div>
              </div>
              <span className="bg-rose-500 text-white text-[10px] font-bold uppercase px-2 py-0.5 rounded-full shrink-0 tracking-wide">
                Closed
              </span>
            </div>
          )}

          <div className="w-full grid lg:grid-cols-2 rounded-2xl sm:rounded-[24px] overflow-hidden shadow-xl bg-white">
            {/* Left Panel: Clean Professional Branding */}
            <div
              className="relative flex flex-col justify-between overflow-hidden p-8 text-white"
              style={{ backgroundColor: "var(--primary-color)" }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>

              <div className="relative z-10">
                <div className="inline-flex items-center justify-center px-3 py-2 rounded-xl mb-4">
                  <img
                    src={storeInfo.logo}
                    alt={storeInfo.store_name}
                    className="h-18 object-contain rounded-full"
                  />
                </div>

                <h1 className="mt-2 text-2xl font-bold leading-tight text-white">
                  {storeInfo.store_name}
                </h1>

                <p className="mt-2 max-w-sm text-xs sm:text-sm leading-relaxed text-white/90">
                  {storeInfo.address}
                </p>
              </div>

              <div className="relative z-10 text-left space-y-2 mt-8">
                <div className="flex items-center gap-3 p-2 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10 text-white">
                    <Bike size={18} />
                  </div>
                  <div>
                    <h3 className="font-medium text-xs sm:text-sm">Lightning Fast Delivery</h3>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-2 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10 text-white">
                    <Gift size={18} />
                  </div>
                  <div>
                    <h3 className="font-medium text-xs sm:text-sm">Exclusive Offers & Rewards</h3>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-2 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10 text-white">
                    <ShieldCheck size={18} />
                  </div>
                  <div>
                    <h3 className="font-medium text-xs sm:text-sm">Safe & Secure Payments</h3>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Panel: Login Form */}
            <div className="flex items-center justify-center px-10 py-10">
              <div className="w-full max-w-sm">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  {step === "phone" && "Welcome Back"}
                  {step === "otp" && "Verify OTP"}
                  {step === "pin" && "Enter Your PIN"}
                </h2>

                <p className="mt-1 text-xs sm:text-sm text-slate-500 leading-relaxed">
                  {step === "phone" && "Sign in to order your favorite meals."}
                  {step === "otp" && (
                    <>
                      Enter the verification code sent to{" "}
                      <span className="font-medium text-slate-800">+91 {formData.phoneNumber}</span>
                    </>
                  )}
                  {step === "pin" && "Enter your 4-digit security PIN to continue."}
                </p>

                <div className="mt-5 mb-4 flex items-center gap-1.5">
                  {STEPS.map((s, i) => (
                    <div
                      key={s}
                      className="h-1 flex-1 rounded-full transition-colors duration-300"
                      style={{
                        backgroundColor: STEPS.indexOf(step) >= i ? "var(--primary-color)" : "#e2e8f0",
                      }}
                    />
                  ))}
                </div>

                {error && (
                  <div className="mb-4 mt-2 rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-xs font-medium text-red-600">
                    {error}
                  </div>
                )}

                <AnimatePresence mode="wait">
                  {/* PHONE STEP */}
                  {step === "phone" && (
                    <motion.form
                      key="phone-desktop"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                      onSubmit={handlePhoneSubmit}
                      className="space-y-4"
                    >
                      <div>
                        <label className="mb-1 block text-xs sm:text-sm font-medium text-slate-700">
                          Mobile Number
                        </label>
                        <div
                          className="group flex items-center rounded-xl border border-slate-200 bg-white px-3 py-1.5 transition-all duration-200"
                          onFocus={(e) => { e.currentTarget.style.borderColor = "var(--primary-color)"; }}
                          onBlur={(e) => { e.currentTarget.style.borderColor = "#e2e8f0"; }}
                        >
                          <Phone size={16} className="text-slate-400 shrink-0" />
                          <span className="ml-2 font-medium text-slate-400 text-sm">+91</span>
                          <input
                            name="phoneNumber"
                            type="tel"
                            required
                            autoComplete="tel"
                            inputMode="numeric"
                            maxLength={10}
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            placeholder="9876543210"
                            className="w-full bg-transparent px-2 py-1 text-slate-800 text-sm outline-none placeholder:text-slate-300 font-medium"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        onMouseEnter={applyLightHover}
                        onMouseLeave={resetLightHover}
                        className="flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-xs sm:text-sm font-medium text-white transition-all duration-200 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70 shadow-sm"
                        style={{ backgroundColor: "var(--primary-color)" }}
                      >
                        {loading ? "Checking..." : "Continue"}
                      </button>
                    </motion.form>
                  )}

                  {/* OTP STEP (seller only) */}
                  {step === "otp" && (
                    <motion.form
                      key="otp-desktop"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                      onSubmit={handleOtpSubmit}
                      className="space-y-4"
                    >
                      <div>
                        <label className="mb-1 block text-xs sm:text-sm font-medium text-slate-700">
                          One-Time Password
                        </label>
                        <div
                          className="group flex items-center rounded-xl border border-slate-200 bg-white px-3 py-1.5 transition-all duration-200"
                          onFocus={(e) => { e.currentTarget.style.borderColor = "var(--primary-color)"; }}
                          onBlur={(e) => { e.currentTarget.style.borderColor = "#e2e8f0"; }}
                        >
                          <ShieldCheck size={16} className="text-slate-400 shrink-0" />
                          <input
                            name="otp"
                            type="text"
                            required
                            inputMode="numeric"
                            maxLength={6}
                            value={formData.otp}
                            onChange={handleChange}
                            placeholder="••••••"
                            className="w-full bg-transparent px-3 py-1 font-mono text-base tracking-[0.3em] text-slate-800 outline-none placeholder:text-slate-300 font-medium"
                          />
                        </div>
                        {resendMessage && (
                          <p className="mt-1.5 text-xs font-medium text-green-600">{resendMessage}</p>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-xs sm:text-sm">
                        <button
                          type="button"
                          onClick={goBack}
                          className="flex items-center gap-1 font-medium text-slate-500 hover:text-slate-800 transition"
                        >
                          <ArrowLeft size={14} />
                          Back
                        </button>
                        <button
                          type="button"
                          onClick={handleResendOtp}
                          onMouseEnter={applyAccentText}
                          onMouseLeave={resetPrimaryText}
                          disabled={loading || resendCooldown > 0}
                          className="font-medium transition disabled:cursor-not-allowed disabled:text-slate-400"
                          style={{ color: resendCooldown > 0 ? "" : "var(--primary-color)" }}
                        >
                          {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend OTP"}
                        </button>
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        onMouseEnter={applyLightHover}
                        onMouseLeave={resetLightHover}
                        className="flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-xs sm:text-sm font-medium text-white transition-all duration-200 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70 shadow-sm"
                        style={{ backgroundColor: "var(--primary-color)" }}
                      >
                        {loading ? "Verifying..." : "Verify OTP"}
                      </button>
                    </motion.form>
                  )}

                  {/* PIN STEP */}
                  {step === "pin" && (
                    <motion.form
                      key="pin-desktop"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                      onSubmit={handleSubmit}
                      className="space-y-4"
                    >
                      <div>
                        <label className="mb-1 block text-xs sm:text-sm font-medium text-slate-700">
                          Security PIN
                        </label>
                        <div
                          className="group flex items-center rounded-xl border border-slate-200 bg-white px-3 py-1.5 transition-all duration-200"
                          onFocus={(e) => { e.currentTarget.style.borderColor = "var(--primary-color)"; }}
                          onBlur={(e) => { e.currentTarget.style.borderColor = "#e2e8f0"; }}
                        >
                          <Lock size={16} className="text-slate-400 shrink-0" />
                          <input
                            name="pin"
                            type={showPin ? "text" : "password"}
                            required
                            maxLength={4}
                            inputMode="numeric"
                            autoComplete="current-password"
                            value={formData.pin}
                            onChange={handleChange}
                            placeholder="••••"
                            className="w-full bg-transparent px-3 py-1 font-mono text-base tracking-[0.3em] text-slate-800 outline-none placeholder:text-slate-300 font-medium"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPin(!showPin)}
                            className="text-xs font-medium text-slate-500 hover:text-slate-800 px-1 transition"
                          >
                            {showPin ? "Hide" : "Show"}
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs sm:text-sm">
                        <button
                          type="button"
                          onClick={goBack}
                          className="flex items-center gap-1 font-medium text-slate-500 hover:text-slate-800 transition"
                        >
                          <ArrowLeft size={14} />
                          Back
                        </button>
                        <Link
                          to="/auth/forgot-pin"
                          onMouseEnter={applyAccentText}
                          onMouseLeave={resetPrimaryText}
                          className="font-medium transition"
                          style={{ color: "var(--primary-color)" }}
                        >
                          Forgot PIN?
                        </Link>
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        onMouseEnter={applyLightHover}
                        onMouseLeave={resetLightHover}
                        className="flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-xs sm:text-sm font-medium text-white transition-all duration-200 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70 shadow-sm"
                        style={{ backgroundColor: "var(--primary-color)" }}
                      >
                        {loading ? "Authenticating..." : "Start Ordering"}
                      </button>
                    </motion.form>
                  )}
                </AnimatePresence>

                <div className="mt-6 border-t border-slate-100 pt-4 text-center">
                  <p className="mt-0.5 text-[10px] text-slate-500">
                    © {new Date().getFullYear()} {storeInfo.store_name}. All rights reserved.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ============ MOBILE / SMALL SCREENS (below lg) — new single-screen design ============ */}
      <div className="lg:hidden">
        <div
          className="min-h-screen w-full font-sans flex flex-col"
          style={{ backgroundColor: "color-mix(in srgb, var(--primary-color) 4%, white)" }}
        >
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="mx-auto w-full max-w-sm min-h-screen flex flex-col"
          >
            {!isStoreOpen && (
              <div className="w-full bg-rose-50 border-b border-rose-100 px-5 py-2.5 text-rose-700 flex items-center gap-2">
                <AlertCircle size={16} className="text-rose-500 shrink-0" />
                <p className="text-[11px] leading-snug">
                  <span className="font-semibold">{storeInfo.store_name}</span> is currently closed —
                  you can still browse, orders open again soon.
                </p>
              </div>
            )}

            {/* Header: logo, store name, address — same padding as the sides of the page.
            Flexible so a long store name wraps instead of being clipped. */}
            <div className="flex items-start gap-4 px-5 pt-5">
              <div
                className="h-16 w-16 shrink-0 rounded-xl overflow-hidden flex items-center justify-center bg-white"
                style={{ border: `1.5px solid color-mix(in srgb, var(--primary-color) 45%, #cbd5e1)` }}
              >
                <img src={storeInfo.logo} alt={storeInfo.store_name} className="h-full w-full object-contain" />
              </div>
              <div className="min-w-0 flex-1 py-0.5">
                <h1 className="text-lg font-extrabold text-slate-900 leading-snug break-words">
                  {storeInfo.store_name}
                </h1>
                <div className="mt-1.5 inline-block max-w-full rounded-2xl border border-slate-300 px-2.5 py-1">
                  <p className="text-[10px] text-slate-500 break-words leading-snug">
                    {storeInfo.address}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex-1 flex flex-col px-5 pt-6 pb-6">
              {/* Step progress line */}
              <div className="mb-5 flex items-center gap-0">
                <span
                  className="h-2 w-2 rounded-full shrink-0"
                  style={{ backgroundColor: "var(--primary-color)" }}
                />
                <div className="relative h-[2px] flex-1 bg-slate-200 rounded-full overflow-hidden">
                  <motion.div
                    className="absolute inset-y-0 left-0 rounded-full"
                    style={{ backgroundColor: "var(--primary-color)" }}
                    animate={{ width: `${progressRatio * 100}%` }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  />
                </div>
              </div>

              <AnimatePresence mode="wait">
                {step === "phone" && !isInputFocused && (
                  <motion.div
                    key="phone-hero"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10, transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] } }}
                    transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                    className="relative pt-2 overflow-hidden"
                  >
                    {/* Generic abstract decoration — not tied to any specific cuisine/item */}
                    <svg
                      className="pointer-events-none absolute -top-6 -right-4 w-32 h-32 z-0"
                      viewBox="0 0 120 120"
                      fill="none"
                    >
                      <path
                        d="M60 8C78 4 100 16 106 36C112 56 104 78 86 90C68 102 42 104 26 90C10 76 4 52 12 34C20 16 42 12 60 8Z"
                        fill="var(--accent-color)"
                        opacity="0.2"
                      />
                      <circle cx="98" cy="22" r="4" fill="var(--secondary-color)" opacity="0.6" />
                      <circle cx="108" cy="40" r="2.5" fill="var(--primary-color)" opacity="0.5" />
                    </svg>

                    <svg
                      className="pointer-events-none absolute top-16 -left-4 w-16 h-16 z-0"
                      viewBox="0 0 80 80"
                      fill="none"
                    >
                      <path
                        d="M8 40C8 22 22 8 40 8C58 8 72 22 72 40"
                        stroke="var(--secondary-color)"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        opacity="0.35"
                      />
                      <circle cx="10" cy="60" r="3" fill="var(--accent-color)" opacity="0.5" />
                      <circle cx="24" cy="70" r="1.8" fill="var(--primary-color)" opacity="0.45" />
                    </svg>

                    <div className="relative z-10">
                      <h2 className="text-3xl font-extrabold text-slate-900 leading-tight">
                        Start Ordering
                      </h2>
                      <p className="text-sm text-slate-500 mt-1">Your favourite food</p>
                      <p
                        className="text-5xl font-black tracking-tight mt-2"
                        style={{ color: "var(--primary-color)" }}
                      >
                        ONLINE
                      </p>
                    </div>

                    <svg
                      className="pointer-events-none absolute -bottom-2 right-0 w-20 h-20 z-0"
                      viewBox="0 0 100 100"
                      fill="none"
                    >
                      <circle cx="70" cy="70" r="26" fill="var(--primary-color)" opacity="0.14" />
                      <circle cx="20" cy="85" r="3" fill="var(--secondary-color)" opacity="0.5" />
                      <path
                        d="M10 20C20 10 34 10 40 20"
                        stroke="var(--accent-color)"
                        strokeWidth="2"
                        strokeLinecap="round"
                        opacity="0.4"
                      />
                    </svg>
                  </motion.div>
                )}

                {step === "otp" && (
                  <motion.div
                    key="otp-hero"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2 }}
                    className="mb-5"
                  >
                    <h2 className="text-2xl font-extrabold text-slate-900">Verify OTP</h2>
                    <p className="text-sm text-slate-500 mt-0.5">
                      Code sent to{" "}
                      <span className="font-medium text-slate-800">+91 {formData.phoneNumber}</span>
                    </p>
                  </motion.div>
                )}

                {step === "pin" && (
                  <motion.div
                    key="pin-hero"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2 }}
                    className="mb-5"
                  >
                    <h2 className="text-2xl font-extrabold text-slate-900">Enter Your PIN</h2>
                    <p className="text-sm text-slate-500 mt-0.5">
                      4-digit security PIN to continue
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Extra decorative curvy lines, placed BELOW the hero block so they fill
                the empty space between the hero text and the phone form, without
                sitting inside/behind the hero content itself. Only shown on the
                phone step, before the input is focused (fades with everything else). */}
              <AnimatePresence>
                {step === "phone" && !isInputFocused && (
                  <motion.div
                    key="hero-lower-decoration"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] } }}
                    transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                    className="relative w-full h-16 mb-2 overflow-hidden"
                  >
                    <svg
                      className="pointer-events-none absolute top-0 left-6 w-40 h-10 z-0"
                      viewBox="0 0 160 40"
                      fill="none"
                    >
                      <path
                        d="M2 30C24 8 46 34 68 16C90 -2 112 22 134 10C146 4 152 6 158 12"
                        stroke="var(--primary-color)"
                        strokeWidth="2"
                        strokeLinecap="round"
                        opacity="0.2"
                      />
                    </svg>

                    <svg
                      className="pointer-events-none absolute bottom-0 left-0 w-full h-16 z-0"
                      viewBox="0 0 300 60"
                      fill="none"
                      preserveAspectRatio="none"
                    >
                      <path
                        d="M0 50C40 20 70 55 110 30C150 5 180 40 220 20C250 6 270 24 300 8"
                        stroke="var(--primary-color)"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        opacity="0.15"
                      />
                    </svg>
                  </motion.div>
                )}
              </AnimatePresence>

              {error && (
                <div className="mb-4 rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-xs font-medium text-red-600">
                  {error}
                </div>
              )}

              {/* Pushes the phone number / OTP / PIN entry toward the bottom of the screen.
                Collapses instantly (no flex animation lag) once the phone input is
                focused so the form below can slide up ahead of the keyboard opening. */}
              <div
                className="flex-1"
                style={{
                  flexGrow: step === "phone" && isInputFocused ? 0 : 1,
                  transition: "flex-grow 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              />

              <AnimatePresence mode="wait">
                {/* PHONE STEP */}
                {step === "phone" && (
                  <motion.form
                    key="phone"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0, y: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                    onSubmit={handlePhoneSubmit}
                    className="space-y-3"
                  >
                    <div
                      className="flex items-center rounded-xl border border-slate-300 bg-white px-3 py-3 transition-all duration-200"
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = "var(--primary-color)";
                        setIsInputFocused(true);
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = "#cbd5e1";
                        setIsInputFocused(false);
                      }}
                    >
                      <Phone size={16} className="text-slate-400 shrink-0" />
                      <span className="ml-2 font-medium text-slate-400 text-sm">+91</span>
                      <input
                        name="phoneNumber"
                        type="tel"
                        required
                        autoComplete="tel"
                        inputMode="numeric"
                        maxLength={10}
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        placeholder="Enter your mobile number"
                        className="w-full bg-transparent px-2 py-0.5 text-slate-800 text-sm outline-none placeholder:text-slate-400 font-medium"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full rounded-xl py-3.5 text-sm font-bold transition-all duration-200 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
                      style={{
                        // border: "2px solid var(--primary-color)",
                        color: "white",
                        backgroundColor: "var(--primary-color)",
                      }}
                    >
                      {loading ? "Checking..." : "Submit"}
                    </button>
                  </motion.form>
                )}

                {/* OTP STEP (seller only) */}
                {step === "otp" && (
                  <motion.form
                    key="otp"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    onSubmit={handleOtpSubmit}
                    className="space-y-3"
                  >
                    <div
                      className="flex items-center rounded-xl border border-slate-300 bg-white px-3 py-2.5 transition-all duration-200"
                      onFocus={(e) => (e.currentTarget.style.borderColor = "var(--primary-color)")}
                      onBlur={(e) => (e.currentTarget.style.borderColor = "#cbd5e1")}
                    >
                      <ShieldCheck size={16} className="text-slate-400 shrink-0" />
                      <input
                        name="otp"
                        type="text"
                        required
                        inputMode="numeric"
                        maxLength={6}
                        value={formData.otp}
                        onChange={handleChange}
                        placeholder="Enter OTP"
                        className="w-full bg-transparent px-2 py-0.5 font-mono text-base tracking-[0.3em] text-slate-800 outline-none placeholder:text-sm placeholder:tracking-normal placeholder:text-slate-400 font-medium"
                      />
                    </div>

                    {resendMessage && (
                      <p className="text-xs font-medium text-green-600">{resendMessage}</p>
                    )}

                    <div className="flex items-center justify-between text-xs">
                      <button
                        type="button"
                        onClick={goBack}
                        className="flex items-center gap-1 font-medium text-slate-500 hover:text-slate-800 transition"
                      >
                        <ArrowLeft size={14} /> Back
                      </button>
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        disabled={loading || resendCooldown > 0}
                        className="font-medium transition disabled:cursor-not-allowed disabled:text-slate-400"
                        style={{ color: resendCooldown > 0 ? undefined : "var(--primary-color)" }}
                      >
                        {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend OTP"}
                      </button>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full rounded-xl py-3.5 text-sm font-bold transition-all duration-200 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
                      style={{
                        border: "2px solid var(--primary-color)",
                        color: "var(--primary-color)",
                        backgroundColor: "white",
                      }}
                    >
                      {loading ? "Verifying..." : "Verify OTP"}
                    </button>
                  </motion.form>
                )}

                {/* PIN STEP */}
                {step === "pin" && (
                  <motion.form
                    key="pin"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    onSubmit={handleSubmit}
                    className="space-y-3"
                  >
                    <div
                      className="flex items-center rounded-xl border border-slate-300 bg-white px-3 py-2.5 transition-all duration-200"
                      onFocus={(e) => (e.currentTarget.style.borderColor = "var(--primary-color)")}
                      onBlur={(e) => (e.currentTarget.style.borderColor = "#cbd5e1")}
                    >
                      <Lock size={16} className="text-slate-400 shrink-0" />
                      <input
                        name="pin"
                        type={showPin ? "text" : "password"}
                        required
                        maxLength={4}
                        inputMode="numeric"
                        autoComplete="current-password"
                        value={formData.pin}
                        onChange={handleChange}
                        placeholder="Enter your PIN"
                        className="w-full bg-transparent px-2 py-0.5 font-mono text-base tracking-[0.3em] text-slate-800 outline-none placeholder:text-sm placeholder:tracking-normal placeholder:text-slate-400 font-medium"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPin(!showPin)}
                        className="text-xs font-medium text-slate-500 hover:text-slate-800 px-1 transition"
                      >
                        {showPin ? "Hide" : "Show"}
                      </button>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <button
                        type="button"
                        onClick={goBack}
                        className="flex items-center gap-1 font-medium text-slate-500 hover:text-slate-800 transition"
                      >
                        <ArrowLeft size={14} /> Back
                      </button>
                      <Link
                        to="/auth/forgot-pin"
                        className="font-medium transition"
                        style={{ color: "var(--primary-color)" }}
                      >
                        Forgot PIN?
                      </Link>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full rounded-xl py-3.5 text-sm font-bold transition-all duration-200 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
                      style={{
                        border: "2px solid var(--primary-color)",
                        color: "var(--primary-color)",
                        backgroundColor: "white",
                      }}
                    >
                      {loading ? "Authenticating..." : "Start Ordering"}
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>

              {/* mt-auto pins this to the bottom regardless of how the spacer/hero
                above collapse or expand, so it never shifts position. */}
              <div className="mt-auto pt-6">
                <p className="text-center text-[10px] text-slate-400">
                  © {new Date().getFullYear()} {storeInfo.store_name}. All rights reserved.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}