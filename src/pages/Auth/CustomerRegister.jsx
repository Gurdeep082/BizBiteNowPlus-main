import { useState, useEffect, useMemo } from "react";
import useAuthStore from "../../store/authStore";
import {
  User,
  Phone,
  Lock,
  MapPin,
  CalendarDays,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  ShieldCheck,
  Bike,
  Gift,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import logoHorizontal from "../../assets/bizbite_logo_horizontal.png";
const bgImage = "/bg.png";

const API_BASE = import.meta.env.VITE_API_URL;

const DEFAULT_THEME_COLORS = {
  primary: "#16522d",
  secondary: "#14bb54",
  accent: "#ffc700",
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

// Steps: 1 = name (phone is fixed, brought over from the login page),
// 2 = OTP verification (its own step now, not a modal), 3 = remaining details.
const TOTAL_STEPS = 3;

export default function RegisterCustomer() {
  const navigate = useNavigate();
  const location = useLocation();

  // The phone number is handed over from the Login page's phone-entry step.
  // It is fixed here — the user only verifies it, never re-types it.
  const incomingPhone = normalizePhoneLocal(location.state?.phoneNumber || "");

  // Step State
  const [regStep, setRegStep] = useState(1);

  const [otp, setOtp] = useState("");
  const [reqId, setReqId] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [, setIsPhoneVerified] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resendMessage, setResendMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  useEffect(() => {
    if (resendMessage) toast.success(resendMessage);
  }, [resendMessage]);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const handleInputFocus = () => setIsKeyboardOpen(true);
  const handleInputBlur = () => setIsKeyboardOpen(false);

  const [loading, setLoading] = useState(false);

  const [storeInfo, setStoreInfo] = useState({
    logo: "",
    store_name: "",
    address: "",
    tagline: "Enjoy Great Food & Rewards",
    business_type: "Restaurant",
    is_open: true,
    theme_colors: DEFAULT_THEME_COLORS,
  });

  const [formData, setFormData] = useState({
    customer_name: "",
    birthday: "",
    pin: "",
    mohalla: "",
    delivery_address: "",
    verificationToken: "",
  });

  const isStoreOpen = useMemo(() => {
    return storeInfo?.is_open !== undefined ? Boolean(storeInfo.is_open) : true;
  }, [storeInfo]);

  const progressRatio = TOTAL_STEPS > 1 ? (regStep - 1) / (TOTAL_STEPS - 1) : 0;

  // If someone lands here directly without a phone number (e.g. refreshed the
  // page), send them back to enter it first — this page has nowhere to type it.
  useEffect(() => {
    if (!incomingPhone) {
      navigate("/auth/login", { replace: true });
    }
  }, [incomingPhone, navigate]);

  useEffect(() => {
    const fetchStoreBranding = async () => {
      const sellerId =
        import.meta.env.VITE_DEFAULT_SELLER_ID || localStorage.getItem("seller_id");

      if (!sellerId) return;

      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/customer/store/${sellerId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const res = await response.json();

        if (res?.success && res?.data) {
          const storeData = res.data;
          const profile = storeData.store_profile || {};
          const bizInfo = storeData.business_info || {};

          setStoreInfo({
            logo: profile.logo || logoHorizontal,
            store_name: profile.store_name || storeData.business_name || "BizBiteNow",
            // TODO: backend doesn't send a shop address yet — swap this
            // dummy value for the real field once that API is ready.
            address:
              bizInfo.address ||
              bizInfo.full_address ||
              [bizInfo.city, bizInfo.state].filter(Boolean).join(", ") ||
              "123 MG Road, Shahjahanpur, UP",
            tagline: profile.tagline || "Enjoy Great Food & Rewards",
            business_type: bizInfo.business_type || "Restaurant",
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
    const timer = setInterval(() => setResendCooldown((s) => Math.max(s - 1, 0)), 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSendOtp = async () => {
    setOtpError("");
    setOtpLoading(true);
    try {
      const res = await fetch(`${API_BASE}/users/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile: incomingPhone }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setOtpError(data.message || "Failed to send OTP.");
        return false;
      }

      setReqId(data.data?.reqId || data.reqId || data.data?.message || "");
      return true;
    } catch {
      setOtpError("Network error while sending OTP.");
      return false;
    } finally {
      setOtpLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    setOtpError("");

    if (!otp.trim()) {
      setOtpError("Enter the OTP.");
      return false;
    }

    setOtpLoading(true);
    try {
      const res = await fetch(`${API_BASE}/users/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reqId,
          otp: otp.trim(),
          purpose: "REGISTER",
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setOtpError(data.message || "Invalid OTP.");
        return false;
      }

      setFormData((prev) => ({
        ...prev,
        verificationToken: data.verificationToken,
      }));
      setIsPhoneVerified(true);
      setOtp("");
      return true;
    } catch {
      setOtpError("Network error while verifying OTP.");
      return false;
    } finally {
      setOtpLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setOtpError("");
    setResendMessage("");
    setOtpLoading(true);
    try {
      const res = await fetch(`${API_BASE}/users/resend-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reqId }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setOtpError(data.message || "Failed to resend OTP.");
      } else {
        setResendMessage("OTP resent successfully.");
        setResendCooldown(30);
      }
    } catch {
      setOtpError("Network error while resending OTP.");
    } finally {
      setOtpLoading(false);
    }
  };

  // STEP 1 -> STEP 2: validate name, then send the OTP and move on.
  const handleStep1Continue = async () => {
    setError("");
    if (!formData.customer_name.trim()) {
      setError("Please enter your full name.");
      return;
    }
    const sent = await handleSendOtp();
    if (sent) setRegStep(2);
  };

  // STEP 2 -> STEP 3: verify the OTP, then move on.
  const handleStep2Continue = async () => {
    setError("");
    const verified = await handleVerifyOTP();
    if (verified) setRegStep(3);
  };

  // Single Back control: inside the wizard it steps back; on the first step
  // it takes the user back to the phone-entry page (Login).
  const handleBack = () => {
    setError("");
    setOtpError("");
    if (regStep > 1) {
      setRegStep((s) => s - 1);
    } else {
      navigate("/auth/login");
    }
  };

  // Final Form Submission (Step 3 only)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (regStep === 1) {
      handleStep1Continue();
      return;
    }

    if (regStep === 2) {
      handleStep2Continue();
      return;
    }

    if (
      !formData.pin.trim() ||
      !formData.birthday ||
      !formData.mohalla.trim() ||
      !formData.delivery_address.trim()
    ) {
      setError("Please fill in all remaining fields to register.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/users/customer/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          customer_name: formData.customer_name,
          customer_phone: incomingPhone,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || "Registration failed.");
        return;
      }

      if (data.customer_token) {
        localStorage.setItem("customer_token", data.customer_token);
      }
      localStorage.setItem("customerId", data.customer?.id || "");

      useAuthStore.setState({
        token: data.customer_token,
        user: data.customer,
        role: "Customer",
        isAuthenticated: true,
        error: null,
      });

      toast.success("Account created successfully. Welcome to BizBite!");
      navigate("/customer");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
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
      {/* ============ DESKTOP / LAPTOP (lg and up) ============ */}
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
                    Store is offline, but you can still register your account and explore the menu.
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
              className="relative flex flex-col justify-center gap-10 overflow-hidden p-8 text-white"
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
                  Join {storeInfo.store_name}
                </h1>

                <p className="mt-2 max-w-sm text-xs sm:text-sm leading-relaxed text-white/90">
                  {storeInfo.tagline}
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
                    <h3 className="font-medium text-xs sm:text-sm">Safe & Secure Account</h3>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Panel: 3-Step Form */}
            <div className="flex items-center justify-center px-10 py-10">
              <div className="w-full max-w-sm">

                <div className="mb-1 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="flex items-center gap-1 text-xs sm:text-sm font-medium text-slate-500 hover:text-slate-800 transition -ml-1 px-1 py-1"
                  >
                    <ArrowLeft size={15} />
                    Back
                  </button>
                </div>

                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  Create an Account
                </h2>

                <p className="mt-1 mb-5 text-xs sm:text-sm text-slate-500 leading-relaxed">
                  {regStep === 1 && "Sign up below to start ordering your favorite meals."}
                  {regStep === 2 && (
                    <>
                      Enter the verification code sent to{" "}
                      <span className="font-medium text-slate-800">+91 {incomingPhone}</span>
                    </>
                  )}
                  {regStep === 3 && "Just a few more details to complete your profile."}
                </p>

                {/* Step Progress Indicator (3 steps) */}
                <div className="mb-6 flex items-center gap-1.5">
                  {[1, 2, 3].map((s) => (
                    <div
                      key={s}
                      className="h-1 flex-1 rounded-full transition-colors duration-300"
                      style={{ backgroundColor: regStep >= s ? "var(--primary-color)" : "#e2e8f0" }}
                    />
                  ))}
                </div>

                {error && (
                  <div className="mb-4 rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-xs font-medium text-red-600">
                    {error}
                  </div>
                )}

                {otpError && (
                  <div className="mb-4 rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-xs font-medium text-red-600">
                    {otpError}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <AnimatePresence mode="wait">

                    {/* --- STEP 1: Name (phone is fixed) --- */}
                    {regStep === 1 && (
                      <motion.div
                        key="step1-desktop"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-4"
                      >
                        <div>
                          <label className="mb-1 block text-xs sm:text-sm font-medium text-slate-700">
                            Full Name
                          </label>
                          <div
                            className="group flex items-center rounded-xl border border-slate-200 bg-white px-3 py-1.5 transition-all duration-200"
                            onFocus={(e) => { e.currentTarget.style.borderColor = "var(--primary-color)"; }}
                            onBlur={(e) => { e.currentTarget.style.borderColor = "#e2e8f0"; }}
                          >
                            <User size={16} className="text-slate-400 shrink-0" />
                            <input
                              type="text"
                              name="customer_name"
                              required
                              value={formData.customer_name}
                              onChange={handleChange}
                              placeholder="John Doe"
                              className="w-full bg-transparent px-2 py-1 text-slate-800 text-sm outline-none placeholder:text-slate-300 font-medium"
                            />
                          </div>
                        </div>

                        {/* Mobile Number — fixed, carried over from the login page.
                          Only verification happens here, not re-entry. */}
                        <div>
                          <label className="mb-1 block text-xs sm:text-sm font-medium text-slate-700">
                            Mobile Number
                          </label>
                          <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5">
                            <Phone size={16} className="text-slate-400 shrink-0" />
                            <span className="ml-2 font-medium text-slate-400 text-sm">+91</span>
                            <span className="w-full px-2 py-1 text-slate-600 text-sm font-medium">
                              {incomingPhone}
                            </span>
                            <span className="text-[10px] font-semibold text-slate-400 shrink-0">
                              Verify next
                            </span>
                          </div>
                        </div>

                        <button
                          type="submit"
                          disabled={otpLoading}
                          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-xs sm:text-sm font-medium text-white transition-all duration-200 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70 shadow-sm"
                          style={{ backgroundColor: "var(--primary-color)" }}
                          onMouseEnter={applyLightHover}
                          onMouseLeave={resetLightHover}
                        >
                          {otpLoading ? "Sending OTP..." : "Continue"} <ArrowRight size={16} />
                        </button>
                      </motion.div>
                    )}

                    {/* --- STEP 2: OTP verification (its own step, not a popup) --- */}
                    {regStep === 2 && (
                      <motion.div
                        key="step2-desktop"
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.2 }}
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
                              type="text"
                              inputMode="numeric"
                              maxLength={6}
                              value={otp}
                              onChange={(e) => setOtp(e.target.value)}
                              placeholder="••••••"
                              className="w-full bg-transparent px-3 py-1 font-mono text-base tracking-[0.3em] text-slate-800 outline-none placeholder:text-slate-300 font-medium"
                            />
                          </div>
                          {resendMessage && (
                            <p className="mt-1.5 text-xs font-medium text-green-600">{resendMessage}</p>
                          )}
                        </div>

                        <div className="flex items-center justify-end text-xs sm:text-sm">
                          <button
                            type="button"
                            onClick={handleResendOtp}
                            onMouseEnter={applyAccentText}
                            onMouseLeave={resetPrimaryText}
                            disabled={otpLoading || resendCooldown > 0}
                            className="font-medium transition disabled:cursor-not-allowed disabled:text-slate-400"
                            style={{ color: resendCooldown > 0 ? "" : "var(--primary-color)" }}
                          >
                            {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend OTP"}
                          </button>
                        </div>

                        <button
                          type="submit"
                          disabled={otpLoading}
                          onMouseEnter={applyLightHover}
                          onMouseLeave={resetLightHover}
                          className="flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-xs sm:text-sm font-medium text-white transition-all duration-200 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70 shadow-sm"
                          style={{ backgroundColor: "var(--primary-color)" }}
                        >
                          {otpLoading ? "Verifying..." : "Continue"}
                        </button>
                      </motion.div>
                    )}

                    {/* --- STEP 3: Remaining details --- */}
                    {regStep === 3 && (
                      <motion.div
                        key="step3-desktop"
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-4"
                      >
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="mb-1 block text-xs sm:text-sm font-medium text-slate-700">
                              Birthday
                            </label>
                            <div
                              className="group flex items-center rounded-xl border border-slate-200 bg-white px-3 py-1.5 transition-all duration-200"
                              onFocus={(e) => { e.currentTarget.style.borderColor = "var(--primary-color)"; }}
                              onBlur={(e) => { e.currentTarget.style.borderColor = "#e2e8f0"; }}
                            >
                              <CalendarDays size={16} className="text-slate-400 shrink-0" />
                              <input
                                type="date"
                                name="birthday"
                                required
                                value={formData.birthday}
                                onChange={handleChange}
                                className="w-full bg-transparent px-2 py-1 text-slate-800 text-xs sm:text-sm outline-none font-medium"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="mb-1 block text-xs sm:text-sm font-medium text-slate-700">
                              Set 4-Digit PIN
                            </label>
                            <div
                              className="group flex items-center rounded-xl border border-slate-200 bg-white px-3 py-1.5 transition-all duration-200"
                              onFocus={(e) => { e.currentTarget.style.borderColor = "var(--primary-color)"; }}
                              onBlur={(e) => { e.currentTarget.style.borderColor = "#e2e8f0"; }}
                            >
                              <Lock size={16} className="text-slate-400 shrink-0" />
                              <input
                                type="password"
                                name="pin"
                                required
                                maxLength={4}
                                inputMode="numeric"
                                value={formData.pin}
                                onChange={handleChange}
                                placeholder="••••"
                                className="w-full bg-transparent px-2 py-1 font-mono text-base tracking-[0.3em] text-slate-800 outline-none placeholder:text-slate-300 font-medium placeholder:tracking-normal"
                              />
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className="mb-1 block text-xs sm:text-sm font-medium text-slate-700">
                            Area / Locality
                          </label>
                          <div
                            className="group flex items-center rounded-xl border border-slate-200 bg-white px-3 py-1.5 transition-all duration-200"
                            onFocus={(e) => { e.currentTarget.style.borderColor = "var(--primary-color)"; }}
                            onBlur={(e) => { e.currentTarget.style.borderColor = "#e2e8f0"; }}
                          >
                            <MapPin size={16} className="text-slate-400 shrink-0" />
                            <input
                              type="text"
                              name="mohalla"
                              required
                              value={formData.mohalla}
                              onChange={handleChange}
                              placeholder="e.g. Civil Lines"
                              className="w-full bg-transparent px-2 py-1 text-slate-800 text-sm outline-none placeholder:text-slate-300 font-medium"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="mb-1 block text-xs sm:text-sm font-medium text-slate-700">
                            Complete Address
                          </label>
                          <div
                            className="group flex rounded-xl border border-slate-200 bg-white px-3 py-2 transition-all duration-200"
                            onFocus={(e) => { e.currentTarget.style.borderColor = "var(--primary-color)"; }}
                            onBlur={(e) => { e.currentTarget.style.borderColor = "#e2e8f0"; }}
                          >
                            <textarea
                              rows={2}
                              name="delivery_address"
                              required
                              value={formData.delivery_address}
                              onChange={handleChange}
                              placeholder="Flat No, Building Name, Street..."
                              className="w-full resize-none bg-transparent text-slate-800 text-sm outline-none placeholder:text-slate-300 font-medium"
                            />
                          </div>
                        </div>

                        <button
                          type="submit"
                          disabled={loading}
                          onMouseEnter={applyLightHover}
                          onMouseLeave={resetLightHover}
                          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-xs sm:text-sm font-medium text-white transition-all duration-200 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70 shadow-sm"
                          style={{ backgroundColor: "var(--primary-color)" }}
                        >
                          {loading ? "Creating Account..." : "Register & Continue"}
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </form>

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

      {/* ============ MOBILE / SMALL SCREENS (below lg) — same family as Login ============ */}
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
                  you can still register, orders open again soon.
                </p>
              </div>
            )}

            {/* Header: logo, store name, address — same as Login's mobile header */}
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

              {/* Back — steps back through the wizard, or to the login/phone
              page once on the first step. */}
              <button
                type="button"
                onClick={handleBack}
                className="mb-4 -ml-1 flex items-center gap-1 self-start rounded-lg px-1 py-1 text-xs font-medium text-slate-500 hover:text-slate-800 transition"
              >
                <ArrowLeft size={15} />
                Back
              </button>

              {/* Step progress line (3 steps) */}
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
                {regStep === 1 && !isKeyboardOpen && (
                  <motion.div
                    key="reg-hero"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10, transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] } }}
                    transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                    className="relative pt-2 overflow-hidden"
                  >
                    {/* Same family of abstract decoration as the Login hero */}
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
                        Create Account
                      </h2>
                      <p className="text-sm text-slate-500 mt-1">Join {storeInfo.store_name}</p>
                      <p
                        className="text-5xl font-black tracking-tight mt-2"
                        style={{ color: "var(--primary-color)" }}
                      >
                        TODAY
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

                {regStep === 2 && (
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
                      <span className="font-medium text-slate-800">+91 {incomingPhone}</span>
                    </p>
                  </motion.div>
                )}

                {regStep === 3 && (
                  <motion.div
                    key="details-hero"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2 }}
                    className="mb-5"
                  >
                    <h2 className="text-2xl font-extrabold text-slate-900">Almost Done</h2>
                    <p className="text-sm text-slate-500 mt-0.5">
                      Just a few more details to complete your profile
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Extra decorative curvy lines below the hero, filling the gap
              above the form — same family as the Login page. */}
              <AnimatePresence>
                {regStep === 1 && !isKeyboardOpen && (
                  <motion.div
                    key="reg-hero-lower-decoration"
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

              {otpError && (
                <div className="mb-4 rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-xs font-medium text-red-600">
                  {otpError}
                </div>
              )}

              {/* Collapses instantly once a field is focused, so the form can
              slide up ahead of the keyboard opening — same as Login. */}
              <div
                className="flex-1"
                style={{
                  flexGrow: isKeyboardOpen ? 0 : 1,
                  transition: "flex-grow 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              />

              <form onSubmit={handleSubmit}>
                <AnimatePresence mode="wait">
                  {/* --- STEP 1: Name (phone is fixed) --- */}
                  {regStep === 1 && (
                    <motion.div
                      key="step1-mobile"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                      className="space-y-3"
                    >
                      <div
                        className="flex items-center rounded-xl border border-slate-300 bg-white px-3 py-3 transition-all duration-200"
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = "var(--primary-color)";
                          handleInputFocus();
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = "#cbd5e1";
                          handleInputBlur();
                        }}
                      >
                        <User size={16} className="text-slate-400 shrink-0" />
                        <input
                          type="text"
                          name="customer_name"
                          required
                          value={formData.customer_name}
                          onChange={handleChange}
                          placeholder="Enter your full name"
                          className="w-full bg-transparent px-2 py-0.5 text-slate-800 text-sm outline-none placeholder:text-slate-400 font-medium"
                        />
                      </div>

                      {/* Fixed number — carried over from login, only verified here */}
                      <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 px-3 py-3">
                        <Phone size={16} className="text-slate-400 shrink-0" />
                        <span className="ml-2 font-medium text-slate-400 text-sm">+91</span>
                        <span className="w-full px-2 py-0.5 text-slate-600 text-sm font-medium">
                          {incomingPhone}
                        </span>
                        <span className="text-[10px] font-semibold text-slate-400 shrink-0">
                          Verify next
                        </span>
                      </div>

                      <button
                        type="submit"
                        disabled={otpLoading}
                        className="w-full rounded-xl py-3.5 text-sm font-bold transition-all duration-200 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
                        style={{ color: "white", backgroundColor: "var(--primary-color)" }}
                      >
                        {otpLoading ? "Sending OTP..." : "Continue"}
                      </button>
                    </motion.div>
                  )}

                  {/* --- STEP 2: OTP verification (its own step) --- */}
                  {regStep === 2 && (
                    <motion.div
                      key="step2-mobile"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-3"
                    >
                      <div
                        className="flex items-center rounded-xl border border-slate-300 bg-white px-3 py-2.5 transition-all duration-200"
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = "var(--primary-color)";
                          handleInputFocus();
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = "#cbd5e1";
                          handleInputBlur();
                        }}
                      >
                        <ShieldCheck size={16} className="text-slate-400 shrink-0" />
                        <input
                          type="text"
                          inputMode="numeric"
                          maxLength={6}
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          placeholder="Enter OTP"
                          className="w-full bg-transparent px-2 py-0.5 font-mono text-base tracking-[0.3em] text-slate-800 outline-none placeholder:text-sm placeholder:tracking-normal placeholder:text-slate-400 font-medium"
                        />
                      </div>

                      {resendMessage && (
                        <p className="text-xs font-medium text-green-600">{resendMessage}</p>
                      )}

                      <div className="flex items-center justify-end text-xs">
                        <button
                          type="button"
                          onClick={handleResendOtp}
                          disabled={otpLoading || resendCooldown > 0}
                          className="font-medium transition disabled:cursor-not-allowed disabled:text-slate-400"
                          style={{ color: resendCooldown > 0 ? undefined : "var(--primary-color)" }}
                        >
                          {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend OTP"}
                        </button>
                      </div>

                      <button
                        type="submit"
                        disabled={otpLoading}
                        className="w-full rounded-xl py-3.5 text-sm font-bold transition-all duration-200 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
                        style={{ color: "white", backgroundColor: "var(--primary-color)" }}
                      >
                        {otpLoading ? "Verifying..." : "Continue"}
                      </button>
                    </motion.div>
                  )}

                  {/* --- STEP 3: Remaining details --- */}
                  {regStep === 3 && (
                    <motion.div
                      key="step3-mobile"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-3"
                    >
                      <div className="grid grid-cols-2 gap-3">
                        <div
                          className="flex items-center rounded-xl border border-slate-300 bg-white px-3 py-2.5 transition-all duration-200"
                          onFocus={(e) => {
                            e.currentTarget.style.borderColor = "var(--primary-color)";
                            handleInputFocus();
                          }}
                          onBlur={(e) => {
                            e.currentTarget.style.borderColor = "#cbd5e1";
                            handleInputBlur();
                          }}
                        >
                          <CalendarDays size={16} className="text-slate-400 shrink-0" />
                          <input
                            type="date"
                            name="birthday"
                            required
                            value={formData.birthday}
                            onChange={handleChange}
                            className="w-full bg-transparent px-2 py-0.5 text-slate-800 text-xs outline-none font-medium"
                          />
                        </div>

                        <div
                          className="flex items-center rounded-xl border border-slate-300 bg-white px-3 py-2.5 transition-all duration-200"
                          onFocus={(e) => {
                            e.currentTarget.style.borderColor = "var(--primary-color)";
                            handleInputFocus();
                          }}
                          onBlur={(e) => {
                            e.currentTarget.style.borderColor = "#cbd5e1";
                            handleInputBlur();
                          }}
                        >
                          <Lock size={16} className="text-slate-400 shrink-0" />
                          <input
                            type="password"
                            name="pin"
                            required
                            maxLength={4}
                            inputMode="numeric"
                            value={formData.pin}
                            onChange={handleChange}
                            placeholder="PIN"
                            className="w-full bg-transparent px-2 py-0.5 font-mono text-sm tracking-[0.3em] text-slate-800 outline-none placeholder:text-xs placeholder:tracking-normal placeholder:text-slate-400 font-medium"
                          />
                        </div>
                      </div>

                      <div
                        className="flex items-center rounded-xl border border-slate-300 bg-white px-3 py-2.5 transition-all duration-200"
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = "var(--primary-color)";
                          handleInputFocus();
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = "#cbd5e1";
                          handleInputBlur();
                        }}
                      >
                        <MapPin size={16} className="text-slate-400 shrink-0" />
                        <input
                          type="text"
                          name="mohalla"
                          required
                          value={formData.mohalla}
                          onChange={handleChange}
                          placeholder="Area / Locality"
                          className="w-full bg-transparent px-2 py-0.5 text-slate-800 text-sm outline-none placeholder:text-slate-400 font-medium"
                        />
                      </div>

                      <div
                        className="flex rounded-xl border border-slate-300 bg-white px-3 py-2.5 transition-all duration-200"
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = "var(--primary-color)";
                          handleInputFocus();
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = "#cbd5e1";
                          handleInputBlur();
                        }}
                      >
                        <textarea
                          rows={2}
                          name="delivery_address"
                          required
                          value={formData.delivery_address}
                          onChange={handleChange}
                          placeholder="Flat No, Building Name, Street..."
                          className="w-full resize-none bg-transparent text-slate-800 text-sm outline-none placeholder:text-slate-400 font-medium"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-xl py-3.5 text-sm font-bold transition-all duration-200 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
                        style={{ color: "white", backgroundColor: "var(--primary-color)" }}
                      >
                        {loading ? "Creating Account..." : "Register & Continue"}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>

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
