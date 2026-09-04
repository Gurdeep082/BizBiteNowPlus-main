import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  Pencil,
  User,
  Mail,
  Phone,
  UserRound,
  Calendar,
  MapPin,
  ShieldCheck,
  ChevronRight,
  KeyRound,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import useAuthStore from "../../store/authStore";
import useCustomerProfileStore from "../../store/customerProfileStore";
import SecondaryButton from "../../components/customer/common/SecondaryButton";
import API from "../../api/axios";

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  gender: "",
  dob: "",
  city: "",
};

const fields = [
  {
    key: "name",
    label: "Full Name",
    icon: User,
    type: "text",
    placeholder: "Enter your full name",
  },
  {
    key: "email",
    label: "Email Address",
    icon: Mail,
    type: "email",
    placeholder: "you@example.com",
  },
  {
    key: "phone",
    label: "Phone Number",
    icon: Phone,
    type: "tel",
    placeholder: "10-digit mobile number",
  },
  { key: "gender", label: "Gender", icon: UserRound, type: "select" },
  { key: "dob", label: "Date of Birth", icon: Calendar, type: "date" },
  {
    key: "city",
    label: "Default City",
    icon: MapPin,
    type: "text",
    placeholder: "Enter your city",
  },
];

const genderOptions = ["Male", "Female", "Other", "Prefer not to say"];

const PersonalDetails = () => {
  const authUser = useAuthStore((state) => state.user);
  const profile = useAuthStore((state) => state.profile);
  const setProfile = useAuthStore((state) => state.setProfile);
  const updateProfile = useCustomerProfileStore((state) => state.updateProfile);

  const customerId =
    profile?._id || profile?.id || authUser?._id || authUser?.id;

  const [user, setUser] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [editing, setEditing] = useState(false);

  // Change PIN Modal States
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [currentPin, setCurrentPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [pinLoading, setPinLoading] = useState(false);
  const [pinError, setPinError] = useState("");
  const [pinSuccess, setPinSuccess] = useState("");

  useEffect(() => {
    const u = {
      name: profile?.customer_name || authUser?.name || "",
      email: profile?.email || authUser?.email || "",
      phone: profile?.customer_phone || authUser?.phone || "",
      gender: profile?.gender || authUser?.gender || "",
      dob:
        (typeof profile?.birthday === "string" && profile.birthday) ||
        profile?.dob ||
        authUser?.dob ||
        "",
      city: profile?.city || authUser?.city || "",
    };
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUser(u);
    setForm(u);
    setEditing(!u.name);
  }, [authUser, profile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    setSaved(false);
  };

  const handleEdit = () => {
    setForm({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      gender: user.gender || "",
      dob: user.dob || "",
      city: user.city || "",
    });
    setErrors({});
    setSaved(false);
    setEditing(true);
  };

  const handleCancel = () => {
    setForm({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      gender: user.gender || "",
      dob: user.dob || "",
      city: user.city || "",
    });
    setErrors({});
    setEditing(false);
  };
  const themeColor = {
    color: "var(--primary-color)",
  };
  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (form.phone.trim() && !/^[6-9]\d{9}$/.test(form.phone.trim()))
      errs.phone = "Enter a valid 10-digit mobile number";
    if (
      form.email.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())
    )
      errs.email = "Enter a valid email address";
    return errs;
  };

  const handleSave = async () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      toast.warn("Please correct the highlighted profile details.");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        gender: form.gender,
        dob: form.dob,
        city: form.city.trim(),
      };
      await updateProfile(customerId, payload);
      setProfile({ customer_name: payload.name, ...payload });
      setUser(form);
      setSaved(true);
      setEditing(false);
      toast.success("Profile details updated successfully.");
    } catch (err) {
      setErrors({
        name: err.response?.data?.message || "Could not save details",
      });
      toast.error(err.response?.data?.message || "Could not save profile details.");
    }
    setSaving(false);
  };

  // Handle Change PIN API integration
  const handleChangePinSubmit = async (e) => {
    e.preventDefault();
    setPinError("");
    setPinSuccess("");

    if (!currentPin || !newPin || !confirmPin) {
      setPinError("Please fill all the fields.");
      return;
    }

    if (newPin.length !== 4) {
      setPinError("New PIN must be exactly 4 digits.");
      return;
    }

    if (newPin !== confirmPin) {
      setPinError("New PIN and Confirm PIN do not match!");
      return;
    }

    setPinLoading(true);
    try {
      const res = await API.post("/users/change-pin", {
        currentPin,
        newPin,
        confirmPin,
      });

      if (res.data?.success) {
        setPinSuccess("PIN changed successfully!");
        setTimeout(() => {
          setIsPinModalOpen(false);
          setCurrentPin("");
          setNewPin("");
          setConfirmPin("");
          setPinSuccess("");
        }, 1500);
      }
    } catch (err) {
      setPinError(
        err.response?.data?.message || "Failed to change PIN. Try again."
      );
    } finally {
      setPinLoading(false);
    }
  };

  if (!user) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      // 🟢 OPTIMIZED CONTAINER: Matched max-w-4xl with Profile.jsx for perfect layout consistency
      className="w-full max-w-[1780px] mx-auto px-4 sm:px-6 py-6 space-y-5 pb-32 font-sans text-slate-800"
    >
      {/* Profile Information Card */}
      <div className="bg-white dark:bg-[#181A1B] rounded-2xl border border-slate-200/80 dark:border-white/10 shadow-2xs p-5 space-y-5">
        <div
          className="
    flex
    items-center
    gap-2.5
    pb-4
    border-b
    border-slate-100
    dark:border-slate-800
  "
        >
          <User
            size={18}
            style={{
              color: "var(--primary-color)",
            }}
          />

          <h2
            className="
      font-bold
      text-base
    "
            style={{
              color: "var(--primary-color)",
            }}
          >
            Profile Information
          </h2>
        </div>

        {!editing ? (
          <>
            <div className="grid sm:grid-cols-2 gap-x-6 gap-y-4">
              {fields.map(({ key, label, icon: Icon }) => (
                <div key={key} className="flex items-center gap-3">
                  <Icon
                    size={20}
                    className="shrink-0"
                    style={{
                      color: "var(--primary-color)",
                    }}
                  />

                  <div className="flex-1 min-w-0">
                    <label
                      className="
        block
        text-xs
        font-semibold
        mb-1
        text-slate-500
        dark:text-slate-400
      "
                    >
                      {label}
                    </label>

                    <div
                      className="
        w-full
        border
        rounded-xl
        px-3.5
        flex
        items-center
        min-h-[44px]
        border-slate-200
        dark:border-slate-800
        bg-slate-50
        dark:bg-white/5
      "
                    >
                      <span className="text-sm font-semibold truncate text-slate-900 dark:text-white">
                        {form[key] || "—"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {saved && (
              <p
                className="text-xs sm:text-sm font-semibold mt-2"
                style={{ color: "var(--primary-color)" }}
              >
                Saved successfully.
              </p>
            )}

            <div className="flex justify-start pt-2">
              <SecondaryButton icon={Pencil} onClick={handleEdit}>
                Edit
              </SecondaryButton>
            </div>
          </>
        ) : (
          <>
            <div className="grid sm:grid-cols-2 gap-x-6 gap-y-4">
              {fields.map(({ key, label, icon: Icon, type, placeholder }) => (
                <div key={key} className="flex items-center gap-3">
                  <Icon
                    size={20}
                    className="shrink-0"
                    style={{
                      color: "var(--primary-color)",
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                      {label}
                      {key === "name" && " *"}
                    </label>
                    {type === "select" ? (
                      <select
                        name={key}
                        value={form[key]}
                        onChange={handleChange}
                        className="w-full border rounded-xl px-3 text-sm font-semibold outline-none transition-colors border-slate-200 dark:border-slate-800 bg-transparent text-slate-900 dark:text-white min-h-[44px] focus:border-[#16522D]"
                      >
                        <option value="">Select gender</option>
                        {genderOptions.map((g) => (
                          <option
                            key={g}
                            value={g}
                            className="text-slate-900"
                          >
                            {g}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={type}
                        name={key}
                        value={form[key]}
                        onChange={handleChange}
                        placeholder={placeholder}
                        maxLength={key === "phone" ? 10 : undefined}
                        className={`w-full border rounded-xl px-3 text-sm font-semibold outline-none transition-colors bg-transparent text-slate-900 dark:text-white min-h-[44px] focus:border-[#16522D] ${errors[key]
                          ? "border-red-400"
                          : "border-slate-200 dark:border-slate-800"
                          }`}
                      />
                    )}
                    {errors[key] && (
                      <p className="text-red-500 text-xs font-semibold mt-1">
                        {errors[key]}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-start gap-3 pt-3">
              {user.name && (
                <SecondaryButton onClick={handleCancel}>
                  Cancel
                </SecondaryButton>
              )}
              <SecondaryButton onClick={handleSave} loading={saving}>
                Save Changes
              </SecondaryButton>
            </div>
          </>
        )}
      </div>

      {/* Account Security Card */}
      <div className="bg-white dark:bg-[#181A1B] rounded-2xl border border-slate-200/80 dark:border-white/10 shadow-2xs overflow-hidden">
        <div className="flex items-center gap-2.5 px-5 pt-5 pb-4 border-b border-slate-100 dark:border-slate-800">
          <ShieldCheck
            size={18}
            style={themeColor}
          />

          <h2
            className="font-bold text-base"
            style={themeColor}
          >
            Account Security
          </h2>
        </div>
        <button
          onClick={() => setIsPinModalOpen(true)}
          className="w-full flex items-center gap-3.5 px-5 py-4 text-left hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer"
        >
          <KeyRound
            size={19}
            className="text-slate-500 dark:text-slate-400 shrink-0"
          />
          <div className="flex-1">
            <p className="font-semibold text-sm sm:text-base text-slate-900 dark:text-white">
              Change PIN
            </p>
            <p className="text-slate-400 dark:text-slate-500 text-xs font-medium mt-0.5">
              Update your security PIN to keep your account safe.
            </p>
          </div>
          <ChevronRight
            size={18}
            className="text-slate-300 dark:text-slate-600 shrink-0"
          />
        </button>
      </div>

      {/* CHANGE PIN MODAL */}
      <AnimatePresence>
        {isPinModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md rounded-3xl bg-white dark:bg-[#181A1B] p-6 sm:p-7 shadow-2xl space-y-4 relative text-slate-900 dark:text-white border border-slate-100 dark:border-white/10"
            >
              <button
                onClick={() => {
                  setIsPinModalOpen(false);
                  setCurrentPin("");
                  setNewPin("");
                  setConfirmPin("");
                  setPinError("");
                }}
                className="absolute top-5 right-5 h-8 w-8 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition cursor-pointer"
              >
                <X size={18} />
              </button>

              <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/30 text-[#16522D] dark:text-emerald-400 shrink-0">
                  <KeyRound size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Change Security PIN</h3>
                  <p className="text-xs text-slate-400 font-medium">
                    Enter your current and new 4-digit PIN
                  </p>
                </div>
              </div>

              <form onSubmit={handleChangePinSubmit} className="space-y-4 pt-1">
                {/* Current PIN */}
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
                    Current PIN
                  </label>
                  <input
                    type="password"
                    value={currentPin}
                    onChange={(e) => setCurrentPin(e.target.value)}
                    placeholder="••••"
                    maxLength={4}
                    className="w-full border rounded-xl px-3.5 py-2.5 text-sm font-semibold tracking-[0.2em] border-slate-200 dark:border-slate-800 bg-transparent outline-none focus:border-[#16522D]"
                    required
                  />
                </div>

                {/* New PIN */}
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
                    New PIN
                  </label>
                  <input
                    type="password"
                    value={newPin}
                    onChange={(e) => setNewPin(e.target.value)}
                    placeholder="••••"
                    maxLength={4}
                    className="w-full border rounded-xl px-3.5 py-2.5 text-sm font-semibold tracking-[0.2em] border-slate-200 dark:border-slate-800 bg-transparent outline-none focus:border-[#16522D]"
                    required
                  />
                </div>

                {/* Confirm PIN */}
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
                    Confirm New PIN
                  </label>
                  <input
                    type="password"
                    value={confirmPin}
                    onChange={(e) => setConfirmPin(e.target.value)}
                    placeholder="••••"
                    maxLength={4}
                    className="w-full border rounded-xl px-3.5 py-2.5 text-sm font-semibold tracking-[0.2em] border-slate-200 dark:border-slate-800 bg-transparent outline-none focus:border-[#16522D]"
                    required
                  />
                </div>

                {pinError && (
                  <p className="text-red-500 text-xs font-semibold">{pinError}</p>
                )}

                {pinSuccess && (
                  <p className="text-emerald-600 text-xs font-bold">
                    {pinSuccess}
                  </p>
                )}

                <div className="flex justify-end gap-3 pt-3">
                  <SecondaryButton
                    type="button"
                    onClick={() => {
                      setIsPinModalOpen(false);
                      setCurrentPin("");
                      setNewPin("");
                      setConfirmPin("");
                      setPinError("");
                    }}
                  >
                    Cancel
                  </SecondaryButton>
                  <SecondaryButton type="submit" loading={pinLoading}>
                    Update PIN
                  </SecondaryButton>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default PersonalDetails;
