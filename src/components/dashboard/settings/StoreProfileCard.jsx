import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera,
  Save,
  Loader2,
  Lock,
  MapPin,
  LocateFixed,
  Check,
  Info,
  X,
  Palette,
  ShoppingCart,
  Bell,
  Home,
  UtensilsCrossed,
  Heart,
  User as UserIcon,
  ArrowRight,
  Gift,
  Lock as LockIcon,
  CheckCircle2,
  AlertCircle,
  Download,
} from "lucide-react";
import useSellerDashboardStore from "../../../store/sellerDashboardStore";

const HEX_REGEX = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;

const DEFAULT_THEME_COLORS = {
  primary: "#F97316",
  secondary: "#FFD685",
  accent: "#FFFFFF",
};

// Updated: Added subtle background accent colors to presets instead of basic white
const PRESET_PALETTES = [
  { name: "Classic Orange", primary: "#F97316", secondary: "#FFD685", accent: "#FFF7ED" },
  { name: "Fresh Tomato", primary: "#DC2626", secondary: "#FCA5A5", accent: "#FEF2F2" },
  { name: "Forest Green", primary: "#15803D", secondary: "#86EFAC", accent: "#F0FDF4" },
  { name: "Golden Mustard", primary: "#D97706", secondary: "#FDE68A", accent: "#FEFCE8" },
  { name: "Berry Punch", primary: "#BE185D", secondary: "#F9A8D4", accent: "#FDF2F8" },
  { name: "Ocean Blue", primary: "#1D4ED8", secondary: "#93C5FD", accent: "#EFF6FF" },
];

const SWATCH_GRID = [
  "#F97316", "#EA580C", "#DC2626", "#BE185D", "#DB2777", "#C026D3",
  "#7C3AED", "#4F46E5", "#1D4ED8", "#0284C7", "#0891B2", "#0D9488",
  "#059669", "#15803D", "#65A30D", "#CA8A04", "#D97706", "#78350F",
  "#57534E", "#334155", "#1E293B", "#000000", "#FFFFFF", "#F8FAFC",
];

const SQUARE_TOLERANCE = 0.05;

function checkIsSquare(width, height) {
  const ratio = width / height;
  return Math.abs(ratio - 1) <= SQUARE_TOLERANCE;
}

export default function StoreProfileCard({ profile, loading: parentLoading, onSave, onSaveBranding }) {
  const { fetchDashboardOverview, fetchSellerProfile } = useSellerDashboardStore();
  const logoInputRef = useRef(null);

  const [formData, setFormData] = useState({
    store_name: "",
    tagline: "",
    description: "",
    logo: "",
  });

  const [themeColors, setThemeColors] = useState(DEFAULT_THEME_COLORS);
  const [logoFile, setLogoFile] = useState(null);
  const [logoError, setLogoError] = useState("");
  const [saving, setSaving] = useState(false);

  const [storeLocation, setStoreLocation] = useState({ latitude: null, longitude: null });
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState("");

  const [customPanelOpen, setCustomPanelOpen] = useState(false);
  const [activeColorKey, setActiveColorKey] = useState("primary");
  const [colorErrors, setColorErrors] = useState({});
  const [previewScreen, setPreviewScreen] = useState("home");

  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  useEffect(() => {
    if (profile?.store_profile) {
      const sp = profile.store_profile;
      setFormData({
        store_name: sp.store_name || sp.name || profile.name || "",
        tagline: sp.tagline || "",
        description: sp.description || "",
        logo: sp.logo || "",
      });
      if (sp.theme_colors) {
        setThemeColors({
          primary: sp.theme_colors.primary || DEFAULT_THEME_COLORS.primary,
          secondary: sp.theme_colors.secondary || DEFAULT_THEME_COLORS.secondary,
          accent: sp.theme_colors.accent || DEFAULT_THEME_COLORS.accent,
        });
      } else if (sp.theme_color) {
        setThemeColors((prev) => ({ ...prev, primary: sp.theme_color }));
      }
    }

    if (profile?.store_location?.coordinates) {
      const [lng, lat] = profile.store_location.coordinates;
      if (lng !== 0 || lat !== 0) {
        setStoreLocation({ latitude: lat, longitude: lng });
      }
    }
  }, [profile]);

  const showToast = (type, message) => {
    setToast({ type, message });
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 3000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const applyPalette = (palette) => {
    setThemeColors({ primary: palette.primary, secondary: palette.secondary, accent: palette.accent });
    setColorErrors({});
  };

  const handleColorChange = (key, value) => {
    setThemeColors((prev) => ({ ...prev, [key]: value }));
    setColorErrors((prev) => ({ ...prev, [key]: !HEX_REGEX.test(value) }));
  };

  const isPaletteActive = (palette) =>
    themeColors.primary?.toUpperCase() === palette.primary.toUpperCase() &&
    themeColors.secondary?.toUpperCase() === palette.secondary.toUpperCase() &&
    themeColors.accent?.toUpperCase() === palette.accent.toUpperCase();

  const compressImage = (file, maxWidth = 800, quality = 0.85) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const scale = Math.min(1, maxWidth / img.width);
          canvas.width = img.width * scale;
          canvas.height = img.height * scale;

          const ctx = canvas.getContext("2d");
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          const outputType = file.type === "image/png" ? "image/png" : "image/jpeg";
          const outputQuality = outputType === "image/png" ? undefined : quality;

          canvas.toBlob(
            (blob) => {
              if (!blob) return reject(new Error("Compression failed"));
              const ext = outputType === "image/png" ? "png" : "jpg";
              const compressedFile = new File(
                [blob],
                file.name.replace(/\.[^.]+$/, `.${ext}`),
                { type: outputType, lastModified: Date.now() }
              );
              resolve(compressedFile);
            },
            outputType,
            outputQuality
          );
        };
        img.onerror = reject;
        img.src = event.target.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoError("");

    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = async () => {
      URL.revokeObjectURL(objectUrl);

      if (!checkIsSquare(img.width, img.height)) {
        setLogoError(
          `This image is ${img.width}×${img.height}px, which isn't square. Please upload a square logo (e.g. 512×512px) so it doesn't look stretched or cropped oddly on your storefront.`
        );
        if (logoInputRef.current) logoInputRef.current.value = "";
        return;
      }

      try {
        const compressedFile = await compressImage(file);
        setLogoFile(compressedFile);

        const reader = new FileReader();
        reader.onloadend = () => {
          setFormData((prev) => ({ ...prev, logo: reader.result }));
        };
        reader.readAsDataURL(compressedFile);
      } catch (err) {
        console.error("Image compression failed:", err);
        setLogoError("Something went wrong processing that image. Please try a different file.");
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      setLogoError("Couldn't read that image. Please try a different file.");
    };

    img.src = objectUrl;
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Location isn't supported on this browser.");
      return;
    }
    if (!window.isSecureContext) {
      setLocationError("Location access needs a secure connection (https).");
      return;
    }

    setLocating(true);
    setLocationError("");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setStoreLocation({ latitude: position.coords.latitude, longitude: position.coords.longitude });
        setLocating(false);
      },
      (err) => {
        console.error("Geolocation error:", err);
        let message = "Couldn't fetch your location. Please try again.";
        if (err.code === 1) message = "Location permission was denied. Please allow location access in your browser or phone settings.";
        else if (err.code === 2) message = "Location unavailable. Please turn on GPS or Wi-Fi and try again.";
        else if (err.code === 3) message = "That took too long. Try again somewhere with a clearer signal.";
        setLocationError(message);
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 60000 }
    );
  };

  const handleSaveProfile = async (e) => {
    e?.preventDefault?.();
    if (typeof onSave !== "function") return;

    const isPrimaryValid = HEX_REGEX.test(themeColors.primary);
    const isSecondaryValid = HEX_REGEX.test(themeColors.secondary);
    const isAccentValid = HEX_REGEX.test(themeColors.accent);

    if (!isPrimaryValid || !isSecondaryValid || !isAccentValid) {
      setColorErrors({ primary: !isPrimaryValid, secondary: !isSecondaryValid, accent: !isAccentValid });
      setCustomPanelOpen(true);
      showToast("error", "Fix the highlighted color codes first");
      return;
    }

    try {
      setSaving(true);

      const storeLocationPayload =
        storeLocation.latitude != null && storeLocation.longitude != null
          ? { type: "Point", coordinates: [storeLocation.longitude, storeLocation.latitude] }
          : undefined;

      if (logoFile) {
        const data = new FormData();
        data.append("tagline", formData.tagline);
        data.append("description", formData.description);
        data.append("logo", logoFile);
        data.append("theme_colors", JSON.stringify(themeColors));
        if (storeLocationPayload) data.append("store_location", JSON.stringify(storeLocationPayload));
        if (typeof onSaveBranding === "function") await onSaveBranding(data);
      } else {
        await onSave({
          tagline: formData.tagline,
          description: formData.description,
          theme_colors: themeColors,
          ...(storeLocationPayload ? { store_location: storeLocationPayload } : {}),
        });
      }

      if (typeof fetchDashboardOverview === "function") await fetchDashboardOverview();
      if (typeof fetchSellerProfile === "function") await fetchSellerProfile();
      showToast("success", "Store profile saved");
    } catch (err) {
      console.error("Failed to save store profile:", err);
      showToast("error", "Couldn't save your profile — try again");
    } finally {
      setSaving(false);
    }
  };

  const colorFields = [
    { key: "primary", label: "Primary", hint: "Buttons, tags, active icons" },
    { key: "secondary", label: "Secondary", hint: "Soft highlights, pills" },
    { key: "accent", label: "Accent", hint: "Text & card contrast" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="rounded-3xl border border-slate-100 bg-white shadow-sm overflow-hidden"
    >
      <div className="pointer-events-none fixed inset-x-0 top-4 z-[100] flex justify-center px-4">
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: -12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.96 }}
              className={`pointer-events-auto flex items-center gap-2 rounded-2xl px-4 py-3 text-xs font-bold shadow-lg ${toast.type === "success" ? "bg-emerald-700 text-white" : "bg-rose-600 text-white"
                }`}
            >
              {toast.type === "success" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
              {toast.message}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-slate-100 bg-white/95 px-6 py-4 backdrop-blur">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900">Store Profile</h2>
          <p className="mt-0.5 text-xs text-slate-500">
            This is what customers see when they visit your storefront.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSaveProfile}
          disabled={saving || parentLoading}
          className="flex shrink-0 items-center gap-2 rounded-xl bg-amber-400 px-4 sm:px-6 py-2.5 text-xs sm:text-sm font-bold text-emerald-950 shadow-sm transition hover:bg-amber-500 disabled:opacity-70 cursor-pointer"
        >
          {saving ? (
            <>
              <Loader2 size={16} className="animate-spin" /> Saving...
            </>
          ) : (
            <>
              <Save size={16} /> Save Profile
            </>
          )}
        </button>
      </div>

      <div className="space-y-6 p-6">
        <div className="flex flex-col sm:flex-row gap-6">
          <div className="shrink-0">
            <label className="mb-2 block text-xs font-bold text-slate-700 uppercase">Store Logo</label>
            <label
              htmlFor="logo-upload"
              className="group relative flex h-32 w-32 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 transition hover:border-emerald-600"
            >
              {formData.logo ? (
                <>
                  <img src={formData.logo} alt="Logo" className="h-full w-full object-cover" />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition group-hover:opacity-100">
                    <Camera size={22} className="text-white" />
                  </div>
                </>
              ) : (
                <>
                  <Camera size={26} className="mb-1.5 text-emerald-700" />
                  <p className="text-[11px] font-bold text-slate-700 text-center leading-tight px-2">Upload Logo</p>
                </>
              )}
            </label>
            <input
              id="logo-upload"
              ref={logoInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="hidden"
              onChange={handleImageChange}
            />
            <p className="mt-2 max-w-[8rem] text-[10px] leading-snug text-slate-400">
              Square image only (e.g. 512×512px). PNG or JPG.
            </p>
          </div>

          <div className="flex-1 space-y-4">
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase">
                Store Name
                <Lock size={11} className="text-slate-400" />
              </label>
              <input
                type="text"
                value={formData.store_name}
                disabled
                readOnly
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs sm:text-sm font-semibold text-slate-500 outline-none cursor-not-allowed"
              />
              <p className="mt-1.5 flex items-start gap-1.5 text-[11px] text-slate-400">
                <Info size={12} className="mt-0.5 shrink-0" />
                Your store name can't be changed here to keep your storefront link and customer trust consistent. Contact support if you really need to change it.
              </p>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold text-slate-700 uppercase">Store Tagline</label>
              <input
                type="text"
                name="tagline"
                value={formData.tagline}
                onChange={handleChange}
                maxLength={80}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs sm:text-sm font-semibold text-slate-800 outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10 shadow-xs"
                placeholder="Fresh Food • Fast Delivery"
              />
            </div>
          </div>
        </div>

        {logoError && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-[11px] font-semibold text-rose-700 flex items-start gap-2">
            <X size={14} className="mt-0.5 shrink-0" />
            {logoError}
          </div>
        )}

        <div>
          <label className="mb-1.5 block text-xs font-bold text-slate-700 uppercase">Description</label>
          <textarea
            rows={4}
            name="description"
            value={formData.description}
            onChange={handleChange}
            maxLength={300}
            className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs sm:text-sm font-semibold text-slate-800 outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10 shadow-xs"
            placeholder="Tell customers about your restaurant..."
          />
          <div className="mt-1 flex justify-end">
            <span className="text-[10px] font-bold text-slate-400">{formData.description.length}/300</span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-5 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <MapPin size={14} className="text-emerald-700" /> Store Location
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Helps customers know how far you are and if you deliver to them.
              </p>
            </div>
            <button
              type="button"
              onClick={handleUseCurrentLocation}
              disabled={locating}
              className="flex shrink-0 items-center gap-1.5 rounded-xl bg-emerald-700 px-3 py-2 text-[11px] font-bold text-white transition hover:bg-emerald-800 disabled:opacity-60"
            >
              {locating ? (
                <>
                  <Loader2 size={13} className="animate-spin" /> Locating...
                </>
              ) : (
                <>
                  <LocateFixed size={13} /> Use Current Location
                </>
              )}
            </button>
          </div>

          {storeLocation.latitude != null && storeLocation.longitude != null ? (
            <div className="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-2.5 text-[11px] font-semibold text-emerald-800 flex items-center gap-1.5">
              <Check size={13} /> Location set
            </div>
          ) : (
            <div className="rounded-xl border border-amber-100 bg-amber-50 px-4 py-2.5 text-[11px] font-semibold text-amber-800">
              Your store location isn't set yet.
            </div>
          )}

          {locationError && <p className="text-[11px] font-semibold text-red-500">{locationError}</p>}
        </div>

        <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-5 space-y-5">
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-slate-900">Storefront Colors</h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Pick a look for your storefront, then hit "Save Profile" above.
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-[1fr_auto]">
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {PRESET_PALETTES.map((palette) => {
                  const active = isPaletteActive(palette);
                  return (
                    <button
                      key={palette.name}
                      type="button"
                      onClick={() => applyPalette(palette)}
                      className={`relative flex items-center gap-2.5 rounded-xl border-2 bg-white p-3 text-left transition cursor-pointer ${active ? "border-emerald-600 ring-2 ring-emerald-600/15" : "border-slate-200 hover:border-slate-300"
                        }`}
                    >
                      {/* Updated: Now displaying all 3 colors (Primary, Secondary, Accent) */}
                      <div className="flex shrink-0 -space-x-1.5">
                        <span className="h-6 w-6 z-30 rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: palette.primary }} />
                        <span className="h-6 w-6 z-20 rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: palette.secondary }} />
                        <span className="h-6 w-6 z-10 rounded-full border-2 border-slate-200 shadow-sm" style={{ backgroundColor: palette.accent }} />
                      </div>
                      <span className="text-[11px] font-bold text-slate-700 truncate">{palette.name}</span>
                      {active && (
                        <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-white">
                          <Check size={11} />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => setCustomPanelOpen((v) => !v)}
                className={`flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl px-5 py-3 text-xs font-bold transition cursor-pointer ${customPanelOpen ? "bg-emerald-700 text-white hover:bg-emerald-800" : "border-2 border-emerald-600 text-emerald-700 hover:bg-emerald-50"
                  }`}
              >
                <Palette size={15} />
                {customPanelOpen ? "Hide Custom Colors" : "Set Custom Colors"}
              </button>

              {customPanelOpen && (
                <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-4">
                  <div className="flex gap-2">
                    {colorFields.map(({ key, label }) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setActiveColorKey(key)}
                        className={`flex flex-1 items-center gap-2 rounded-xl border-2 px-3 py-2.5 text-left transition cursor-pointer ${activeColorKey === key ? "border-emerald-600 bg-emerald-50/50" : "border-slate-200"
                          }`}
                      >
                        <span
                          className="h-6 w-6 shrink-0 rounded-full border border-slate-200 shadow-sm"
                          style={{ backgroundColor: HEX_REGEX.test(themeColors[key]) ? themeColors[key] : "#fff" }}
                        />
                        <span className="min-w-0">
                          <p className="text-[11px] font-bold text-slate-700">{label}</p>
                          <p className="text-[10px] text-slate-400 truncate">{themeColors[key]?.toUpperCase()}</p>
                        </span>
                      </button>
                    ))}
                  </div>

                  <div>
                    <p className="mb-2 text-[10px] font-bold uppercase text-slate-400">
                      Tap a color for {colorFields.find((f) => f.key === activeColorKey)?.label}
                    </p>
                    <div className="grid grid-cols-6 gap-2.5">
                      {SWATCH_GRID.map((hex) => {
                        const active = themeColors[activeColorKey]?.toUpperCase() === hex.toUpperCase();
                        return (
                          <button
                            key={hex}
                            type="button"
                            onClick={() => handleColorChange(activeColorKey, hex)}
                            className={`relative aspect-square rounded-full border-2 shadow-sm transition cursor-pointer ${active ? "border-emerald-600 ring-2 ring-emerald-600/20 scale-105" : "border-white"
                              }`}
                            style={{ backgroundColor: hex }}
                            aria-label={hex}
                          >
                            {active && (
                              <Check
                                size={14}
                                className={`absolute inset-0 m-auto ${hex === "#FFFFFF" || hex === "#F8FAFC" ? "text-slate-700" : "text-white"}`}
                              />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <p className="mb-1.5 text-[10px] font-bold uppercase text-slate-400">Or pick a color / enter code</p>
                    {/* Updated: Added native input type="color" picker side-by-side with hex input */}
                    <div className="flex gap-2 items-center">
                      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-slate-200 shadow-xs cursor-pointer">
                        <input
                          type="color"
                          value={HEX_REGEX.test(themeColors[activeColorKey]) ? themeColors[activeColorKey] : "#FFFFFF"}
                          onChange={(e) => handleColorChange(activeColorKey, e.target.value.toUpperCase())}
                          className="absolute -inset-2 h-14 w-14 cursor-pointer bg-transparent border-none p-0"
                        />
                      </div>
                      <input
                        type="text"
                        value={themeColors[activeColorKey]?.toUpperCase() || ""}
                        onChange={(e) => handleColorChange(activeColorKey, e.target.value)}
                        maxLength={7}
                        placeholder="#1A4D2E"
                        className={`w-full rounded-lg border bg-white px-3 py-2.5 text-xs font-bold text-slate-800 outline-none uppercase shadow-xs ${colorErrors[activeColorKey]
                          ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                          : "border-slate-200 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10"
                          }`}
                      />
                    </div>
                    {colorErrors[activeColorKey] && (
                      <p className="mt-1 text-[10px] font-semibold text-red-500">
                        Please enter a valid color code, like #1A4D2E.
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="mx-auto">
              <div className="mb-2 flex items-center justify-center gap-1.5">
                {[
                  { key: "home", label: "Home" },
                  { key: "loyalty", label: "Loyalty" },
                  { key: "rewards", label: "Rewards" },
                ].map((s) => (
                  <button
                    key={s.key}
                    type="button"
                    onClick={() => setPreviewScreen(s.key)}
                    className={`rounded-full px-2.5 py-1 text-[9px] font-bold transition cursor-pointer ${previewScreen === s.key ? "bg-emerald-700 text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                      }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
              <StorefrontPreview colors={themeColors} storeName={formData.store_name || "Your Store"} screen={previewScreen} />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function StorefrontPreview({ colors, storeName, screen }) {
  const { primary, secondary, accent } = colors;

  return (
    <div className="w-[190px] rounded-[22px] border border-slate-200 shadow-md overflow-hidden" style={{ backgroundColor: "#F8FAFC" }}>
      <div className="flex items-center justify-between px-3 py-2.5" style={{ backgroundColor: accent }}>
        <div className="flex items-center gap-1.5 min-w-0">
          <div className="h-7 w-7 shrink-0 rounded-full flex items-center justify-center text-white text-[10px] font-bold" style={{ backgroundColor: primary }}>
            {storeName?.[0]?.toUpperCase() || "S"}
          </div>
          <div className="min-w-0">
            <p className="text-[9px] font-bold text-slate-800 truncate leading-tight">{storeName}</p>
            <p className="text-[7px] text-slate-400 leading-tight truncate">Your City</p>
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <div className="h-5 w-5 rounded-md bg-slate-100 flex items-center justify-center">
            <Download size={10} className="text-slate-500" />
          </div>
          <div className="h-5 w-5 rounded-md bg-slate-100 flex items-center justify-center">
            <ShoppingCart size={10} className="text-slate-500" />
          </div>
          <div className="h-5 w-5 rounded-md bg-slate-100 flex items-center justify-center">
            <Bell size={10} className="text-slate-500" />
          </div>
        </div>
      </div>

      {screen === "home" && (
        <>
          <div className="px-2.5 pt-2">
            <div className="relative h-[68px] rounded-xl overflow-hidden bg-slate-800">
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <span className="absolute top-1.5 left-1.5 rounded-full px-1.5 py-0.5 text-[6px] font-bold text-white" style={{ backgroundColor: primary }}>
                FESTIVE DEAL
              </span>
              <div className="absolute bottom-1.5 left-1.5 right-1.5">
                <p className="text-[9px] font-bold text-white leading-tight">Delicious Food, Made Fresh</p>
                <button className="mt-1 flex items-center gap-1 rounded-full px-2 py-1 text-[6px] font-bold text-white" style={{ backgroundColor: primary }}>
                  View Deal Details <ArrowRight size={7} />
                </button>
              </div>
            </div>
          </div>

          <div className="px-2.5 pt-2 flex items-center gap-2">
            <div className="flex-1 rounded-lg bg-white border border-slate-100 px-2 py-1.5">
              <p className="text-[7px] font-bold text-slate-700">Scan Table QR</p>
              <p className="text-[6px] text-slate-400">Order Instantly</p>
            </div>
            <div className="flex-1 flex items-center justify-between rounded-lg bg-white border border-slate-100 px-2 py-1.5">
              <span className="text-[7px] font-bold text-slate-700">Sign In</span>
              <button className="rounded-full px-2 py-0.5 text-[6px] font-bold text-slate-900" style={{ backgroundColor: secondary }}>
                Sign In
              </button>
            </div>
          </div>

          <div className="mt-2.5 flex items-center justify-between px-2 py-1.5 border-t border-slate-100" style={{ backgroundColor: accent }}>
            <div className="h-5 w-5 rounded-lg flex items-center justify-center" style={{ backgroundColor: primary }}>
              <Home size={10} className="text-white" />
            </div>
            <UtensilsCrossed size={12} className="text-slate-400" />
            <Heart size={12} className="text-slate-400" />
            <Gift size={12} className="text-slate-400" />
            <UserIcon size={12} className="text-slate-400" />
          </div>
        </>
      )}

      {screen === "loyalty" && (
        <>
          <div className="px-2.5 pt-2">
            <div className="rounded-xl p-2.5" style={{ backgroundColor: primary }}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[8px] font-bold text-white">Loyalty Progress</span>
                <span className="text-[6px] font-bold text-white/80">View Details →</span>
              </div>
              <p className="text-[6px] text-white/80 mb-1.5">0 / 2 Stamps Collected</p>
              <div className="flex items-center gap-1.5">
                {[1, 2].map((n) => (
                  <span key={n} className="h-4 w-4 rounded-full flex items-center justify-center text-[6px] font-bold text-slate-900 shrink-0" style={{ backgroundColor: secondary }}>
                    {n}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="px-2.5 pt-2">
            <div className="rounded-xl p-2.5" style={{ backgroundColor: `${secondary}55` }}>
              <div className="flex items-center gap-1.5">
                <span className="flex h-4 w-4 items-center justify-center rounded-md text-[6px] font-bold text-white shrink-0" style={{ backgroundColor: primary }}>
                  %
                </span>
                <span className="text-[7px] font-bold text-slate-800">Active Deal</span>
              </div>
              <p className="mt-1 text-[6px] text-slate-500">Keep ordering to unlock your next reward!</p>
              <button className="mt-1.5 w-full rounded-full py-1 text-[6px] font-bold text-white" style={{ backgroundColor: primary }}>
                View All Rewards
              </button>
            </div>
          </div>
          <div className="mt-2.5 flex items-center justify-between px-2 py-1.5 border-t border-slate-100" style={{ backgroundColor: accent }}>
            <Home size={12} className="text-slate-400" />
            <UtensilsCrossed size={12} className="text-slate-400" />
            <Heart size={12} className="text-slate-400" />
            <Gift size={12} className="text-slate-400" />
            <UserIcon size={12} className="text-slate-400" />
          </div>
        </>
      )}

      {screen === "rewards" && (
        <>
          <div className="px-2.5 pt-2.5">
            <p className="text-[10px] font-bold text-slate-900">Rewards & Loyalty</p>
            <p className="text-[6px] text-slate-400 mt-0.5">Track stamps, unlock rewards</p>
          </div>
          <div className="px-2.5 pt-2">
            <div className="rounded-xl p-3" style={{ backgroundColor: primary }}>
              <p className="text-[8px] font-bold text-white">My Stamp Journey</p>
              <p className="text-[6px] text-white/80 mt-0.5">Unlock your Free Reward!</p>
              <span className="mt-1.5 inline-block rounded-full px-2 py-0.5 text-[6px] font-bold text-white" style={{ backgroundColor: `${accent}30` }}>
                Stamps 0 / 2
              </span>
              <div className="mt-2 flex items-center gap-1.5">
                {[1, 2].map((n) => (
                  <span key={n} className="h-4 w-4 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: `${accent}25` }}>
                    <LockIcon size={7} className="text-white/70" />
                  </span>
                ))}
                <span className="h-4 w-4 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: secondary }}>
                  <Gift size={7} className="text-slate-900" />
                </span>
              </div>
              <button className="mt-2 flex w-full items-center justify-center gap-1 rounded-full py-1 text-[6px] font-bold" style={{ backgroundColor: `${accent}25`, color: "#fff" }}>
                <LockIcon size={7} /> Keep Ordering to Unlock
              </button>
            </div>
          </div>
          <div className="mt-2.5 flex items-center justify-between px-2 py-1.5 border-t border-slate-100" style={{ backgroundColor: accent }}>
            <Home size={12} className="text-slate-400" />
            <UtensilsCrossed size={12} className="text-slate-400" />
            <Heart size={12} className="text-slate-400" />
            <div className="h-5 w-5 rounded-lg flex items-center justify-center" style={{ backgroundColor: primary }}>
              <Gift size={10} className="text-white" />
            </div>
            <UserIcon size={12} className="text-slate-400" />
          </div>
        </>
      )}
    </div>
  );
}