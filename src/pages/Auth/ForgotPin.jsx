import { useState, useEffect } from "react";
import {
  Phone,
  ShieldCheck,
  Lock,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import { motion, AnimatePresence } from "framer-motion";

const STEPS = ["phone", "otp", "reset"];

const DEFAULT_THEME_COLORS = {
  primary: "#16522d",
  secondary: "#14bb54",
  accent: "#ffc700",
};

export default function ForgotPin() {
  const navigate = useNavigate();
  const { forgotPin, verifyOTP, resendOTP, resetPin, logout, loading } =
    useAuthStore();

  const [step, setStep] = useState("phone");
  const [error, setError] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [reqId, setReqId] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resendMessage, setResendMessage] = useState("");

  const [storeInfo, setStoreInfo] = useState({
    logo: "",
    store_name: "",
    theme_colors: DEFAULT_THEME_COLORS,
  });

  const [formData, setFormData] = useState({
    phoneNumber: "",
    otp: "",
    newPin: "",
    confirmPin: "",
  });

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
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const res = await response.json();

        if (res?.success && res?.data) {
          const storeData = res.data;
          const profile = storeData.store_profile || {};

          setStoreInfo({
            logo: profile.logo,
            store_name: profile.store_name || storeData.business_name,
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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(
      () => setResendCooldown((s) => Math.max(s - 1, 0)),
      1000
    );
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!/^[0-9]{10}$/.test(formData.phoneNumber.trim())) {
      setError("Enter a valid 10-digit phone number.");
      return;
    }

    try {
      const data = await forgotPin({ phoneNumber: formData.phoneNumber });

      setReqId(data.reqId || data.data?.reqId || data.data?.message || "");
      setStep("otp");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to continue.");
    }
  };

  const handleResendOtp = async () => {
    setError("");
    setResendMessage("");

    try {
      await resendOTP({ reqId });
      setResendMessage("OTP resent to your phone.");
      setResendCooldown(30);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to resend OTP.");
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!/^[0-9]{4,6}$/.test(formData.otp.trim())) {
      setError("Enter the OTP sent to your phone.");
      return;
    }

    try {
      await verifyOTP({ reqId, otp: formData.otp, purpose: "FORGOT_PIN" });
      setStep("reset");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP. Please try again.");
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!/^[0-9]{4}$/.test(formData.newPin.trim())) {
      setError("PIN must be exactly 4 digits.");
      return;
    }

    if (formData.newPin !== formData.confirmPin) {
      setError("PINs do not match.");
      return;
    }

    try {
      const verificationToken = useAuthStore.getState().verificationToken;

      await resetPin({
        verificationToken,
        newPin: formData.newPin,
        confirmPin: formData.confirmPin,
      });

      setStep("done");

      logout();

      setTimeout(() => navigate("/seller/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to reset PIN.");
    }
  };

  const goBack = () => {
    setError("");
    const idx = STEPS.indexOf(step);
    if (idx > 0) setStep(STEPS[idx - 1]);
  };

  const applyFocusBorder = (e) => {
    e.currentTarget.style.borderColor = "var(--primary-color)";
  };
  const resetFocusBorder = (e) => {
    e.currentTarget.style.borderColor = "";
  };
  const applyBrighten = (e) => {
    e.currentTarget.style.filter = "brightness(0.88)";
  };
  const resetBrighten = (e) => {
    e.currentTarget.style.filter = "brightness(1)";
  };
  const applyAccentText = (e) => {
    e.currentTarget.style.color = "var(--accent-color)";
  };
  const resetPrimaryText = (e) => {
    e.currentTarget.style.color = "var(--primary-color)";
  };

  return (
    <div
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-6"
      style={{
        background: `linear-gradient(to bottom right, color-mix(in srgb, var(--primary-color) 70%, black), var(--primary-color), color-mix(in srgb, var(--primary-color) 60%, black))`,
      }}
    >
      <div
        className="absolute -top-24 -left-24 h-80 w-80 rounded-full blur-3xl"
        style={{ backgroundColor: "color-mix(in srgb, var(--accent-color) 10%, transparent)" }}
      ></div>

      <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-white/5 blur-3xl"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className="relative z-10 w-full max-w-sm rounded-[28px] bg-white p-8 shadow-[0_40px_80px_rgba(22,82,45,0.2)]">
        <div className="mb-5 flex justify-center">
          <img
            src={storeInfo.logo}
            alt={storeInfo.store_name || "BizBiteNow"}
            className="h-20 object-contain"
            onError={(e) => {
              e.currentTarget.src = "";
            }}
          />
        </div>

        {step !== "done" && (
          <>
            <h2 className="text-center text-2xl font-semibold font-black" style={{ color: "var(--primary-color)" }}>
              {step === "phone" && "Forgot PIN"}
              {step === "otp" && "Verify OTP"}
              {step === "reset" && "Set New PIN"}
            </h2>

            <p className="mt-1 text-center text-sm text-gray-500 leading-6">
              {step === "phone" &&
                "Enter your registered phone number to reset your PIN."}
              {step === "otp" && (
                <>
                  Enter the code sent to{" "}
                  <span className="font-semibold" style={{ color: "var(--primary-color)" }}>
                    +91 {formData.phoneNumber}
                  </span>
                </>
              )}
              {step === "reset" && "Choose a new 4-digit security PIN."}
            </p>

            <div className="mt-4 mb-2 flex items-center gap-2">
              {STEPS.map((s, i) => (
                <div
                  key={s}
                  className="h-1.5 flex-1 rounded-full transition-colors duration-300"
                  style={{
                    backgroundColor: STEPS.indexOf(step) >= i ? "var(--primary-color)" : "#e5e7eb",
                  }}
                />
              ))}
            </div>
          </>
        )}

        {error && (
          <div className="mb-4 mt-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
            {error}
          </div>
        )}

        <AnimatePresence mode="wait">
          {step === "phone" && (
            <motion.form
              key="phone"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              onSubmit={handlePhoneSubmit}
              className="mt-4 space-y-4">
              <div>
                <label
                  htmlFor="phoneNumber"
                  className="mb-2 block w-full text-left text-sm font-semibold" style={{ color: "var(--primary-color)" }}>
                  Phone Number
                </label>

                <div
                  className="group flex items-center rounded-xl border border-gray-200 bg-white px-4 transition-all duration-300"
                  onFocus={applyFocusBorder}
                  onBlur={resetFocusBorder}
                >
                  <Phone size={18} className="text-gray-400" />

                  <input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    required
                    autoComplete="tel"
                    inputMode="numeric"
                    maxLength={10}
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="9876543210"
                    className="w-full bg-transparent px-4 py-2 outline-none placeholder:text-gray-400"
                    style={{ color: "var(--primary-color)" }}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                onMouseEnter={applyBrighten}
                onMouseLeave={resetBrighten}
                className="group flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold text-white shadow-lg transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-70"
                style={{ backgroundColor: "var(--primary-color)" }}>
                {loading ? (
                  <span>Sending OTP...</span>
                ) : (
                  <>
                    <span>Send OTP</span>
                    <ArrowRight
                      size={18}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </>
                )}
              </button>

              <Link
                to="/auth/login"
                onMouseEnter={applyAccentText}
                onMouseLeave={resetPrimaryText}
                className="flex items-center justify-center gap-1 text-sm font-semibold transition"
                style={{ color: "var(--primary-color)" }}>
                <ArrowLeft size={14} />
                Back to Login
              </Link>
            </motion.form>
          )}

          {step === "otp" && (
            <motion.form
              key="otp"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              onSubmit={handleOtpSubmit}
              className="mt-4 space-y-4">
              <div>
                <label
                  htmlFor="otp"
                  className="mb-2 block w-full text-left text-sm font-semibold" style={{ color: "var(--primary-color)" }}>
                  One-Time Password
                </label>

                <div
                  className="group flex items-center rounded-xl border border-gray-200 bg-white px-4 transition-all duration-300"
                  onFocus={applyFocusBorder}
                  onBlur={resetFocusBorder}
                >
                  <ShieldCheck size={18} className="text-gray-400" />

                  <input
                    id="otp"
                    name="otp"
                    type="text"
                    required
                    inputMode="numeric"
                    maxLength={6}
                    value={formData.otp}
                    onChange={handleChange}
                    placeholder="••••••"
                    className="w-full bg-transparent px-4 py-2 font-mono tracking-[0.35em] outline-none placeholder:text-gray-400"
                    style={{ color: "var(--primary-color)" }}
                  />
                </div>

                {resendMessage && (
                  <p className="mt-2 text-xs font-semibold" style={{ color: "var(--primary-color)" }}>
                    {resendMessage}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between text-sm">
                <button
                  type="button"
                  onClick={goBack}
                  onMouseEnter={applyAccentText}
                  onMouseLeave={resetPrimaryText}
                  className="flex items-center gap-1 font-semibold transition"
                  style={{ color: "var(--primary-color)" }}>
                  <ArrowLeft size={14} />
                  Change Number
                </button>

                <button
                  type="button"
                  onClick={handleResendOtp}
                  onMouseEnter={applyAccentText}
                  onMouseLeave={resetPrimaryText}
                  disabled={loading || resendCooldown > 0}
                  className="font-semibold transition disabled:cursor-not-allowed disabled:opacity-50"
                  style={{ color: "var(--primary-color)" }}>
                  {resendCooldown > 0
                    ? `Resend in ${resendCooldown}s`
                    : "Resend OTP"}
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                onMouseEnter={applyBrighten}
                onMouseLeave={resetBrighten}
                className="group flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold text-white shadow-lg transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-70"
                style={{ backgroundColor: "var(--primary-color)" }}>
                {loading ? (
                  <span>Verifying...</span>
                ) : (
                  <>
                    <span>Verify OTP</span>
                    <ArrowRight
                      size={18}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </>
                )}
              </button>
            </motion.form>
          )}

          {step === "reset" && (
            <motion.form
              key="reset"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              onSubmit={handleResetSubmit}
              className="mt-4 space-y-4">
              <div>
                <label
                  htmlFor="newPin"
                  className="mb-2 block w-full text-left text-sm font-semibold" style={{ color: "var(--primary-color)" }}>
                  New PIN
                </label>

                <div
                  className="group flex items-center rounded-xl border border-gray-200 bg-white px-4 transition-all duration-300"
                  onFocus={applyFocusBorder}
                  onBlur={resetFocusBorder}
                >
                  <Lock size={18} className="text-gray-400" />

                  <input
                    id="newPin"
                    name="newPin"
                    type={showPin ? "text" : "password"}
                    required
                    maxLength={4}
                    inputMode="numeric"
                    autoComplete="new-password"
                    value={formData.newPin}
                    onChange={handleChange}
                    placeholder="••••"
                    className="w-full bg-transparent px-4 py-2 font-mono tracking-[0.35em] outline-none placeholder:text-gray-400"
                    style={{ color: "var(--primary-color)" }}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPin(!showPin)}
                    onMouseEnter={applyAccentText}
                    onMouseLeave={resetPrimaryText}
                    className="text-xs font-semibold transition"
                    style={{ color: "var(--primary-color)" }}>
                    {showPin ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <div>
                <label
                  htmlFor="confirmPin"
                  className="mb-2 block w-full text-left text-sm font-semibold" style={{ color: "var(--primary-color)" }}>
                  Confirm PIN
                </label>

                <div
                  className="group flex items-center rounded-xl border border-gray-200 bg-white px-4 transition-all duration-300"
                  onFocus={applyFocusBorder}
                  onBlur={resetFocusBorder}
                >
                  <Lock size={18} className="text-gray-400" />

                  <input
                    id="confirmPin"
                    name="confirmPin"
                    type={showPin ? "text" : "password"}
                    required
                    maxLength={4}
                    inputMode="numeric"
                    autoComplete="new-password"
                    value={formData.confirmPin}
                    onChange={handleChange}
                    placeholder="••••"
                    className="w-full bg-transparent px-4 py-2 font-mono tracking-[0.35em] outline-none placeholder:text-gray-400"
                    style={{ color: "var(--primary-color)" }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <button
                  type="button"
                  onClick={goBack}
                  onMouseEnter={applyAccentText}
                  onMouseLeave={resetPrimaryText}
                  className="flex items-center gap-1 font-semibold transition"
                  style={{ color: "var(--primary-color)" }}>
                  <ArrowLeft size={14} />
                  Back
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                onMouseEnter={applyBrighten}
                onMouseLeave={resetBrighten}
                className="group flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold text-white shadow-lg transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-70"
                style={{ backgroundColor: "var(--primary-color)" }}>
                {loading ? (
                  <span>Resetting...</span>
                ) : (
                  <>
                    <span>Reset PIN</span>
                    <ArrowRight
                      size={18}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </>
                )}
              </button>
            </motion.form>
          )}

          {step === "done" && (
            <motion.div
              key="done"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
                <CheckCircle2 size={36} className="text-emerald-500" />
              </div>

              <h2 className="mt-4 text-2xl font-semibold font-black" style={{ color: "var(--primary-color)" }}>
                PIN Reset Successful
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Redirecting you to login...
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}