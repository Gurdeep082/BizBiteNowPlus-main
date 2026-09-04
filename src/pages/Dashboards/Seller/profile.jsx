import { useMemo, useRef, useState } from "react";
import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Camera,
  Crown,
  BadgeCheck,
  Sparkles,
  Save,
  X,
  Loader2,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import Input from "../../../components/UI/Input";

function InputField({ icon: Icon, label, ...props }) {
  return (
    <Input
      leftIcon={Icon ? <Icon size={16} /> : null}
      label={label}
      {...props}
    />
  );
}

function SelectField({ label, name, value, onChange }) {
  return (
    <div>
      {label && (
        <label className="mb-1.5 block text-xs font-bold text-slate-700 uppercase">
          {label}
        </label>
      )}

      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-800 shadow-xs focus:outline-none focus:border-emerald-600"
      >
        <option>Male</option>
        <option>Female</option>
        <option>Other</option>
      </select>
    </div>
  );
}

export default function Profile() {
  const fileInputRef = useRef(null);

  const initialData = {
    avatar: "",
    fullName: "Seller",
    email: "Seller@example.com",
    phone: "+91 9876543210",
    dob: "2003-07-12",
    gender: "Male",
    address: "Bareilly, Uttar Pradesh",
    bio: "Passionate food entrepreneur building memorable customer experiences with BizBiteNow+.",
  };

  const [profile, setProfile] = useState(initialData);
  const [savedProfile, setSavedProfile] = useState(initialData);

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const completion = useMemo(() => {
    const values = Object.values(profile);
    const filled = values.filter((v) => String(v).trim() !== "").length;
    return Math.round((filled / values.length) * 100);
  }, [profile]);

  const hasChanges = JSON.stringify(profile) !== JSON.stringify(savedProfile);

  const updateField = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const uploadAvatar = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setProfile((prev) => ({
      ...prev,
      avatar: url,
    }));
  };

  const cancelChanges = () => {
    setProfile(savedProfile);
  };

  const saveProfile = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 1200));
    setSavedProfile(profile);
    setSaving(false);
    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full space-y-6 pb-28 font-sans text-slate-900"
    >
      {/* HERO SECTION */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-100 bg-white p-6 sm:p-8 shadow-sm">
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-emerald-500/5 blur-3xl" />

        <div className="relative flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-col items-center gap-5 md:flex-row">
            <div className="group relative">
              <div className="h-28 w-28 overflow-hidden rounded-full border-4 border-white shadow-md">
                {profile.avatar ? (
                  <img
                    src={profile.avatar}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-emerald-700 text-2xl font-bold text-white">
                    GS
                  </div>
                )}
              </div>

              <button
                onClick={() => fileInputRef.current.click()}
                className="absolute inset-0 flex items-center justify-center rounded-full bg-black/45 opacity-0 transition-all duration-300 group-hover:opacity-100 cursor-pointer"
              >
                <Camera size={24} className="text-white" />
              </button>

              <input
                hidden
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={uploadAvatar}
              />
            </div>

            <div className="text-center md:text-left">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                  {profile.fullName}
                </h1>
                <div className="flex items-center gap-1 rounded-full bg-emerald-700 px-3 py-0.5 text-xs font-bold text-white">
                  <Crown size={13} /> Plus Seller
                </div>
              </div>

              <p className="mt-1.5 max-w-xl text-xs sm:text-sm text-slate-500">
                Keep your personal information updated so customers and the BizBiteNow team always have the latest details.
              </p>

              <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-2.5">
                <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-bold text-emerald-700">
                  <BadgeCheck size={14} /> Verified
                </div>
                <div className="flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-200 px-3 py-1 text-xs font-bold text-amber-700">
                  <Sparkles size={14} /> {completion}% Complete
                </div>
              </div>
            </div>
          </div>

          <div className="w-full max-w-xs self-center xl:self-auto">
            <div className="mb-1.5 flex justify-between text-xs font-bold text-slate-600">
              <span>Profile Completion</span>
              <span>{completion}%</span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
              <motion.div
                animate={{ width: `${completion}%` }}
                transition={{ duration: 0.8 }}
                className="h-full rounded-full bg-emerald-700"
              />
            </div>
          </div>
        </div>
      </div>

      {/* PERSONAL INFORMATION CARD */}
      <div className="rounded-3xl border border-slate-100 bg-white p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">Personal Information</h2>
            <p className="text-xs text-slate-500 mt-0.5">Update your personal details.</p>
          </div>

          {hasChanges && (
            <span className="rounded-full bg-amber-50 border border-amber-200 px-3 py-1 text-xs font-bold text-amber-800">
              Unsaved Changes
            </span>
          )}
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <InputField
            icon={User}
            label="Full Name"
            name="fullName"
            value={profile.fullName}
            onChange={updateField}
            placeholder="Full Name"
          />

          <InputField
            icon={Mail}
            label="Email Address"
            type="email"
            name="email"
            value={profile.email}
            onChange={updateField}
            placeholder="Email Address"
          />

          <InputField
            icon={Phone}
            label="Phone Number"
            name="phone"
            value={profile.phone}
            onChange={updateField}
            placeholder="+91 XXXXX XXXXX"
          />

          <InputField
            icon={Calendar}
            label="Date of Birth"
            type="date"
            name="dob"
            value={profile.dob}
            onChange={updateField}
          />

          <SelectField
            label="Gender"
            name="gender"
            value={profile.gender}
            onChange={updateField}
          />

          <InputField
            icon={MapPin}
            label="Address"
            name="address"
            value={profile.address}
            onChange={updateField}
            placeholder="Your Address"
          />
        </div>

        <div className="pt-2">
          <label className="mb-1.5 block text-xs font-bold text-slate-700 uppercase">
            About Me
          </label>
          <textarea
            name="bio"
            rows={4}
            value={profile.bio}
            onChange={updateField}
            maxLength={300}
            placeholder="Tell customers something about yourself..."
            className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50/50 p-4 text-xs sm:text-sm font-medium text-slate-800 outline-none transition focus:border-emerald-600 focus:bg-white shadow-xs"
          />
          <div className="mt-1 flex justify-end">
            <span className="text-[11px] font-bold text-slate-400">
              {profile.bio.length}/300
            </span>
          </div>
        </div>
      </div>

      {/* FLOATING ACTION BAR */}
      <AnimatePresence>
        {hasChanges && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 left-1/2 z-[999] flex -translate-x-1/2 items-center gap-3 rounded-2xl border border-slate-200/80 bg-white/90 px-5 py-3 shadow-xl backdrop-blur-md"
          >
            <button
              onClick={cancelChanges}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
            >
              <X size={16} /> Cancel
            </button>

            <button
              disabled={saving}
              onClick={saveProfile}
              className="flex min-w-[150px] items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-800 disabled:opacity-70 transition cursor-pointer"
            >
              {saving ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <Save size={16} /> Save Changes
                </>
              )}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SUCCESS TOAST */}
      <AnimatePresence>
        {saved && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed right-6 top-20 z-[999] rounded-2xl border border-emerald-200 bg-emerald-700 px-5 py-3 text-xs font-bold text-white shadow-lg"
          >
            Profile updated successfully 🎉
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}