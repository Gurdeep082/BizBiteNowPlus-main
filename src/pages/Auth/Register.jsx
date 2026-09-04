import { useState } from "react";
import {
  User,
  Mail,
  Phone,
  Store,
  Lock,
  MapPin,
  Building,
  ShieldCheck,
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { API } from "../../services/api";

export default function Register() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Schema ke exact fields ke hisaab se state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    business_name: "",
    role: "Seller", // Default enum value
    pin: "",
    address: "",
    city: "",
    state: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Backend registration endpoint par request
      const response = await API.post("/auth/register", formData);

      // Success hone par sidha login page par redirect kar do
      if (response.status === 201 || response.status === 200) {
        alert("Registration successful! Please login.");
        navigate("/login");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Something went wrong. Please check your details.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 py-12">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-2xl space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            BizbitsNow<span className="text-emerald-500">PLUS</span>
          </h1>
          <p className="text-sm text-black">
            Create your business account to get started.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Grid Layout for Forms */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <label className="text-sm font-semibold text-black block mb-1">
                Owner Name
              </label>
              <div className="relative">
                <User
                  className="absolute left-3 top-3 text-black-400"
                  size={18}
                />
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                  placeholder="John Doe"
                />
              </div>
            </div>

            {/* Business Name */}
            <div>
              <label className="text-sm font-semibold text-black block mb-1">
                Business Name
              </label>
              <div className="relative">
                <Store
                  className="absolute left-3 top-3 text-black-400"
                  size={18}
                />
                <input
                  type="text"
                  name="business_name"
                  required
                  value={formData.business_name}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                  placeholder="Meri Dukaan"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="text-sm font-semibold text-black block mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-3 text-black-400"
                  size={18}
                />
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                  placeholder="john@company.com"
                />
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label className="text-sm font-semibold text-black block mb-1">
                Phone Number
              </label>
              <div className="relative">
                <Phone
                  className="absolute left-3 top-3 text-black-400"
                  size={18}
                />
                <input
                  type="tel"
                  name="phoneNumber"
                  required
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                  placeholder="9876543210"
                />
              </div>
            </div>

            {/* Role Dropdown */}
            <div>
              <label className="text-sm font-semibold text-black block mb-1">
                Role
              </label>
              <div className="relative">
                <ShieldCheck
                  className="absolute left-3 top-3 text-black-400"
                  size={18}
                />
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none bg-white">
                  <option value="Seller">Seller</option>
                  <option value="Customer">Customer</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
            </div>

            {/* Security PIN */}
            <div>
              <label className="text-sm font-semibold text-black block mb-1">
                Security PIN (Password)
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-3 text-black-400"
                  size={18}
                />
                <input
                  type="password"
                  name="pin"
                  required
                  value={formData.pin}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                  placeholder="••••"
                />
              </div>
            </div>

            {/* Address (Full Width over-ride or single column) */}
            <div className="md:col-span-2">
              <label className="text-sm font-semibold text-black block mb-1">
                Full Address
              </label>
              <div className="relative">
                <MapPin
                  className="absolute left-3 top-3 text-black-400"
                  size={18}
                />
                <input
                  type="text"
                  name="address"
                  required
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                  placeholder="Shop No. 4, Main Market"
                />
              </div>
            </div>

            {/* City */}
            <div>
              <label className="text-sm font-semibold text-black block mb-1">
                City
              </label>
              <div className="relative">
                <Building
                  className="absolute left-3 top-3 text-black-400"
                  size={18}
                />
                <input
                  type="text"
                  name="city"
                  required
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                  placeholder="Mumbai"
                />
              </div>
            </div>

            {/* State */}
            <div>
              <label className="text-sm font-semibold text-black block mb-1">
                State
              </label>
              <div className="relative">
                <Building
                  className="absolute left-3 top-3 text-black-400"
                  size={18}
                />
                <input
                  type="text"
                  name="state"
                  required
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                  placeholder="Maharashtra"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 rounded-xl transition duration-200 shadow-lg shadow-emerald-500/20 disabled:opacity-50">
            {loading ? "Creating Account..." : "Register Business"}
          </button>
        </form>

        <div className="text-center text-sm text-black-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-emerald-500 font-semibold hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
