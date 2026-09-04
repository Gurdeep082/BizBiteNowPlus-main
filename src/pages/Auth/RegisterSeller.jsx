import { useState } from "react";
import {
  User,
  Mail,
  Phone,
  Store,
  Lock,
  MapPin,
  Building,
  ArrowRight,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import logoHorizontal from "../../assets/bizbite_logo_horizontal.png";

export default function RegisterSeller() {
  const navigate = useNavigate();

  const [showOTPModal, setShowOTPModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    business_name: "",
    role: "Seller",
    pin: "",
    address: "",
    city: "",
    state: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleVerifyOTP = () => {
    setShowOTPModal(false);
    setOtp("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.phoneNumber.trim() ||
      !formData.business_name.trim() ||
      !formData.pin.trim() ||
      !formData.address.trim() ||
      !formData.city.trim() ||
      !formData.state.trim()
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    setLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    localStorage.setItem("pendingSeller", JSON.stringify(formData));

    setLoading(false);

    navigate("/seller/register-success");
  };

  return (
    <div className="relative flex h-full items-center justify-center px-4 py-0 bg-gradient-to-br from-[#0b2b18] via-[#16522d] to-[#07140d]">
      {/* Background */}
      <div className="absolute -top-32 -left-32 h-72 w-72 rounded-full bg-[#ffc700]/10 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-white/5 blur-3xl"></div>

      <div className="relative flex min-h-screen items-center justify-center px-4 py-2 sm:px-6 sm:py-4 lg:px-8 lg:py-4">
        {/* OTP Modal */}

        {showOTPModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
              <h2 className="text-center text-2xl font-bold sm:text-3xl">
                Verify OTP
              </h2>

              <p className="mt-3 text-center text-sm text-gray-500">
                We've sent a verification code to your registered email.
              </p>

              <p className="mt-2 break-all text-center font-semibold text-[#16522d]">
                {formData.email}
              </p>

              <input
                type="text"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
                className="mt-8 w-full rounded-xl border border-gray-300 py-4 text-center text-xl tracking-[10px] outline-none transition focus:border-[#16522d] focus:ring-4 focus:ring-green-100"
              />

              <button
                onClick={handleVerifyOTP}
                className="mt-8 w-full rounded-xl bg-gradient-to-r from-[#16522d] to-[#2d6a4f] py-4 font-semibold text-white transition hover:opacity-95">
                Verify OTP
              </button>

              <button
                onClick={() => {
                  setShowOTPModal(false);
                  setOtp("");
                }}
                className="mt-3 w-full rounded-xl border border-gray-300 py-3 font-medium transition hover:bg-gray-50">
                Cancel
              </button>
            </div>
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, x: 80 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -80 }}
          transition={{
            duration: 0.45,
            ease: "easeInOut",
          }}
          className="w-full h-4xl max-w-6xl">
          <div className="relative z-10 w-full max-w-6xl grid lg:grid-cols-2 rounded-[32px] overflow-hidden shadow-[0_40px_80px_rgba(22,82,45,0.15)]">
            {/* LEFT PANEL */}

            <div className="relative hidden lg:flex flex-col justify-between overflow-hidden bg-gradient-to-br from-[#16522d] via-[#124325] to-[#08160e] p-8 text-white">
              <div className="absolute right-0 top-0 h-56 w-56 rounded-full bg-[#ffc700]/10 blur-3xl"></div>

              <div className="relative z-10">
                <img
                  src={logoHorizontal}
                  alt="BizBiteNow"
                  className="h-10 object-contain"
                />

                <span className="mt-5 inline-flex rounded-full bg-[#ffc700] px-3 py-1 text-xs font-bold text-[#16522d]">
                  Plus Seller
                </span>

                <h1 className="mt-5 text-4xl font-black leading-tight">
                  Grow Your
                  <br />
                  Restaurant
                </h1>

                <p className="mt-4 max-w-xs text-sm leading-6 text-green-100">
                  Join thousands of restaurants using BizBiteNow to manage
                  customers, orders and revenue from one dashboard.
                </p>
              </div>

              <div className="space-y-3">
                {[
                  {
                    title: "Zero Commission",
                    desc: "Keep every customer.",
                  },
                  {
                    title: "Business Dashboard",
                    desc: "Orders, menus & analytics.",
                  },
                  {
                    title: "Instant Order Alerts",
                    desc: "Receive orders in real time.",
                  },
                  {
                    title: "Secure Seller Platform",
                    desc: "Enterprise-grade protection.",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-2.5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#ffc700] font-black text-[#16522d]">
                      ✓
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold">{item.title}</h3>

                      <p className="text-xs text-green-100">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT PANEL */}
            <div className="flex items-center justify-center bg-white px-10 py-6">
              <div className="w-full max-w-lg">
                {/* Mobile Logo */}

                <div className="mb-5 flex justify-center lg:hidden">
                  <img
                    src={logoHorizontal}
                    alt="BizBiteNow"
                    className="h-8 object-contain sm:h-10"
                  />
                </div>

                {/* Brand */}

                <h1 className="text-center text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl lg:text-center">
                  BizbitsNow
                  <span className="text-emerald-500">PLUS</span>
                </h1>

                {/* Title */}

                <h2 className="mt-3 text-center text-2xl font-black text-[#16522d] sm:text-m lg:text-center">
                  Create Seller Account
                </h2>

                {/* Error */}

                {error && (
                  <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                    {error}
                  </div>
                )}

                {/* Form */}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                    {/* Owner Name */}

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-[#16522d]">
                        Owner Name
                      </label>

                      <div className="group flex h-12 items-center rounded-xl border border-gray-200 bg-white px-4 transition-all duration-300 focus-within:border-[#16522d] focus-within:ring-2 focus-within:ring-[#16522d]/10">
                        <User size={18} className="text-gray-400" />

                        <input
                          type="text"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="John Doe"
                          className="w-full bg-transparent px-3 text-sm outline-none"
                        />
                      </div>
                    </div>

                    {/* Business Name */}

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-[#16522d]">
                        Business Name
                      </label>

                      <div className="group flex h-12 items-center rounded-xl border border-gray-200 bg-white px-4 transition-all duration-300 focus-within:border-[#16522d] focus-within:ring-2 focus-within:ring-[#16522d]/10">
                        <Store size={18} className="text-gray-400" />

                        <input
                          type="text"
                          name="business_name"
                          required
                          value={formData.business_name}
                          onChange={handleChange}
                          placeholder="Restaurant Name"
                          className="w-full bg-transparent px-3 text-sm outline-none"
                        />
                      </div>
                    </div>

                    {/* Email */}

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-[#16522d]">
                        Email Address
                      </label>

                      <div className="group flex h-12 items-center rounded-xl border border-gray-200 bg-white px-4 transition-all duration-300 focus-within:border-[#16522d] focus-within:ring-2 focus-within:ring-[#16522d]/10">
                        <Mail size={18} className="text-gray-400" />

                        <input
                          type="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="seller@email.com"
                          className="w-full bg-transparent px-3 text-sm outline-none"
                        />
                      </div>
                    </div>

                    {/* Phone Number */}

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-[#16522d]">
                        Phone Number
                      </label>

                      <div className="group flex h-12 items-center rounded-xl border border-gray-200 bg-white px-4 transition-all duration-300 focus-within:border-[#16522d] focus-within:ring-2 focus-within:ring-[#16522d]/10">
                        <Phone size={18} className="text-gray-400" />

                        <input
                          type="tel"
                          name="phoneNumber"
                          required
                          value={formData.phoneNumber}
                          onChange={handleChange}
                          placeholder="9876543210"
                          className="w-full bg-transparent px-3 text-sm outline-none"
                        />
                      </div>
                    </div>
                    {/* Security PIN */}

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-[#16522d]">
                        Security PIN
                      </label>

                      <div className="group flex h-12 items-center rounded-xl border border-gray-200 bg-white px-4 transition-all duration-300 focus-within:border-[#16522d] focus-within:ring-2 focus-within:ring-[#16522d]/10">
                        <Lock size={18} className="text-gray-400" />

                        <input
                          type="password"
                          name="pin"
                          required
                          maxLength={4}
                          value={formData.pin}
                          onChange={handleChange}
                          placeholder="••••"
                          className="w-full bg-transparent px-3 text-sm tracking-[0.3em] outline-none"
                        />
                      </div>
                    </div>

                    {/* Business Address */}

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-[#16522d]">
                        Business Address
                      </label>

                      <div className="group flex h-12 items-center rounded-xl border border-gray-200 bg-white px-4 transition-all duration-300 focus-within:border-[#16522d] focus-within:ring-2 focus-within:ring-[#16522d]/10">
                        <MapPin size={18} className="text-gray-400" />

                        <input
                          type="text"
                          name="address"
                          required
                          value={formData.address}
                          onChange={handleChange}
                          placeholder="Shop No. 4, Main Market"
                          className="w-full bg-transparent px-3 text-sm outline-none"
                        />
                      </div>
                    </div>

                    {/* City */}

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-[#16522d]">
                        City
                      </label>

                      <div className="group flex h-12 items-center rounded-xl border border-gray-200 bg-white px-4 transition-all duration-300 focus-within:border-[#16522d] focus-within:ring-2 focus-within:ring-[#16522d]/10">
                        <Building size={18} className="text-gray-400" />

                        <input
                          type="text"
                          name="city"
                          required
                          value={formData.city}
                          onChange={handleChange}
                          placeholder="Mumbai"
                          className="w-full bg-transparent px-3 text-sm outline-none"
                        />
                      </div>
                    </div>

                    {/* State */}

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-[#16522d]">
                        State
                      </label>

                      <div className="group flex h-12 items-center rounded-xl border border-gray-200 bg-white px-4 transition-all duration-300 focus-within:border-[#16522d] focus-within:ring-2 focus-within:ring-[#16522d]/10">
                        <Building size={18} className="text-gray-400" />

                        <input
                          type="text"
                          name="state"
                          required
                          value={formData.state}
                          onChange={handleChange}
                          placeholder="Maharashtra"
                          className="w-full bg-transparent px-3 text-sm outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Register Button */}

                  <button
                    type="submit"
                    disabled={loading}
                    className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#16522d] text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:bg-[#1d6438] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70">
                    {loading ? (
                      <>
                        <svg
                          className="h-5 w-5 animate-spin"
                          viewBox="0 0 24 24"
                          fill="none">
                          <circle
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="3"
                            className="opacity-30"
                          />

                          <path
                            d="M22 12A10 10 0 0 0 12 2"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeLinecap="round"
                          />
                        </svg>

                        <span>Creating Account...</span>
                      </>
                    ) : (
                      <>
                        <span>Create Seller Account</span>

                        <ArrowRight
                          size={18}
                          className="transition-transform duration-300 group-hover:translate-x-1"
                        />
                      </>
                    )}
                  </button>
                </form>

                {/* Divider */}

                <div className="my-5 flex items-center gap-3">
                  <div className="h-px flex-1 bg-gray-200"></div>

                  <span className="text-xs font-medium uppercase tracking-wider text-gray-400">
                    Already have an account?
                  </span>

                  <div className="h-px flex-1 bg-gray-200"></div>
                </div>

                {/* Login */}

                <Link
                  to="/seller/login"
                  className="group flex h-12 w-full items-center justify-center rounded-xl border-2 border-[#16522d] text-sm font-semibold text-[#16522d] transition-all duration-300 hover:bg-[#16522d] hover:text-white">
                  Login Instead
                  <ArrowRight
                    size={18}
                    className="ml-2 transition-transform duration-300 group-hover:translate-x-1"
                  />
                </Link>

                {/* Footer */}

                <div className="mt-6 border-t border-gray-200 pt-4 text-center">
                  <p className="text-xs text-gray-500">
                    Trusted by restaurants across India.
                  </p>

                  <p className="mt-2 text-[11px] text-gray-400">
                    © 2026 BizBiteNow. All rights reserved.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
