import { ImagePlus } from "lucide-react";

const FESTIVALS = [
  "Diwali",
  "Holi",
  "Eid",
  "Christmas",
  "Navratri",
  "Raksha Bandhan",
  "Ganesh Chaturthi",
  "Durga Puja",
  "New Year",
  "Other",
];

const THEMES = [
  "Traditional",
  "Modern",
  "Premium",
  "Family Feast",
  "Street Food",
  "Sweets Special",
];

export default function BasicInfoStep({ data = {}, onChange }) {
  // Derive preview URL directly without useEffect / setState
  const getPreviewUrl = () => {
    const fileObj =
      data.banner_image instanceof File
        ? data.banner_image
        : data.banner instanceof File
        ? data.banner
        : null;

    if (fileObj) {
      return URL.createObjectURL(fileObj);
    }
    if (typeof data.banner === "string" && data.banner.trim() !== "") {
      return data.banner;
    }
    return "";
  };

  const preview = getPreviewUrl();

  const updateField = (field, value) => {
    onChange?.({
      ...data,
      [field]: value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      onChange?.({
        ...data,
        banner_image: file,
        banner: URL.createObjectURL(file),
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Basic Information</h2>
        <p className="mt-1 text-sm text-slate-500">
          Enter the basic details for your festive menu.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Menu Name */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-800">
            Menu Name
          </label>
          <input
            maxLength={60}
            type="text"
            value={data.name || ""}
            onChange={(e) => updateField("name", e.target.value)}
            placeholder="Diwali Special Menu"
            className="h-12 w-full rounded-xl border border-slate-200 bg-transparent px-4 outline-none transition focus:border-[#1A4D2E] focus:ring-4 focus:ring-[#1A4D2E]/10"
          />
          <p className="mt-1 text-right text-xs text-slate-500">
            {(data.name || "").length}/60
          </p>
        </div>

        {/* Festival */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-800">
            Festival
          </label>
          <select
            value={data.festival || ""}
            onChange={(e) => updateField("festival", e.target.value)}
            className="h-12 w-full rounded-xl border border-slate-200 bg-transparent px-4 outline-none transition focus:border-[#1A4D2E] focus:ring-4 focus:ring-[#1A4D2E]/10"
          >
            <option value="">Select Festival</option>
            {FESTIVALS.map((festival) => (
              <option key={festival} value={festival}>
                {festival}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Theme */}
      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-800">
          Theme
        </label>
        <select
          value={data.theme || ""}
          onChange={(e) => updateField("theme", e.target.value)}
          className="h-12 w-full rounded-xl border border-slate-200 bg-transparent px-4 outline-none transition focus:border-[#1A4D2E] focus:ring-4 focus:ring-[#1A4D2E]/10"
        >
          <option value="">Select Theme</option>
          {THEMES.map((theme) => (
            <option key={theme} value={theme}>
              {theme}
            </option>
          ))}
        </select>
      </div>

      {/* Description */}
      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-800">
          Description
        </label>
        <textarea
          rows={4}
          maxLength={300}
          value={data.description || ""}
          onChange={(e) => updateField("description", e.target.value)}
          placeholder="Describe your festive menu..."
          className="w-full rounded-xl border border-slate-200 bg-transparent p-4 outline-none transition focus:border-[#1A4D2E] focus:ring-4 focus:ring-[#1A4D2E]/10"
        />
        <p className="mt-2 text-right text-xs text-slate-500">
          {(data.description || "").length}/300
        </p>
      </div>

      {/* Banner Upload */}
      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-800">
          Festival Banner
        </label>

        <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 p-8 transition-all hover:border-[#1A4D2E] hover:bg-[#1A4D2E]/5">
          <ImagePlus size={42} className="text-[#1A4D2E]" />
          <h3 className="mt-3 font-semibold text-slate-800">
            Upload Festival Banner
          </h3>
          <p className="mt-1 text-center text-sm text-slate-500">
            JPG, PNG or WEBP <br /> Recommended 1600 × 600
          </p>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>

        {preview ? (
          <div className="mt-5">
            <img
              src={preview}
              alt="Festival Banner Preview"
              className="h-48 w-full rounded-2xl border border-slate-200 object-cover"
            />
            <p className="mt-2 text-sm font-medium text-emerald-600">
              ✓ Banner attached successfully
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}