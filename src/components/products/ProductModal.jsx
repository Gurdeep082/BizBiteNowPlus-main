import { useEffect, useRef, useState } from "react";
import {
  X,
  UploadCloud,
  Trash2,
  Settings2,
  Star,
  PlusCircle,
  Loader2,
} from "lucide-react";

const emptyForm = {
  id: null,
  sku: "",
  name: "",
  description: "",
  category: "",
  price: "",
  stock: "",
  image: "",

  isVeg: true,
  foodType: "Veg",
  rating: 4.5,

  available: true,
  featured: false,
  combo: false,
  delivery: true,

  variants: [],
  addons: [],
};

const buildFormData = (mode, product) => {
  if (mode === "edit" && product) {
    const currentFoodType =
      product.foodType ||
      (product.isVeg === false || product.isVeg === "false" ? "Non-Veg" : "Veg");
    const currentIsVeg = currentFoodType === "Veg";

    return {
      id: product.id || product._id,
      _id: product._id,
      sku: product.sku || product.sku_code || product.skuNumber || "",
      name: product.name || "",
      description: product.description || "",
      category: product.category || "",
      price: product.price || "",
      stock: product.stock || "",
      image: product.image || "",
      isVeg: currentIsVeg,
      foodType: currentFoodType,
      rating: product.rating ?? 4.5,
      available: product.available ?? product.is_available ?? true,
      featured: product.featured ?? false,
      combo: product.combo ?? false,
      delivery: product.delivery ?? true,
      variants: (product.variants || []).map((v) => ({
        id: v.id || v._id || Date.now() + Math.random(),
        name: v.name || "",
        price_delta: v.price_delta ?? v.price ?? 0,
      })),
      addons: (product.addons || []).map((a) => ({
        id: a.id || a._id || Date.now() + Math.random(),
        name: a.name || "",
        description: a.description || "",
        price: a.price ?? "",
      })),
    };
  }

  return { ...emptyForm, id: Date.now() };
};

export default function ProductModal({
  open,
  onClose,
  mode = "add",
  product = null,
  onSave,
  products = [],
  saving = false,
}) {
  const [formData, setFormData] = useState(() => buildFormData(mode, product));
  const [imagePreview, setImagePreview] = useState(() =>
    typeof formData.image === "string" ? formData.image : ""
  );
  const objectUrlRef = useRef(null);

  // Sync state when editing product opens
  useEffect(() => {
    if (open) {
      const initialData = buildFormData(mode, product);
      setFormData(initialData);
      setImagePreview(typeof initialData.image === "string" ? initialData.image : "");
    }
  }, [open, mode, product]);

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    };
  }, []);

  const generateSKU = (category) => {
    const categoryMap = {
      Burger: "BRG",
      Snacks: "SNK",
      Pizza: "PZA",
      Sandwich: "SWD",
      "Wraps & Rolls": "WRP",
      Biryani: "BRY",
      Chinese: "CHN",
      "North Indian": "NIN",
      "South Indian": "SIN",
      Pasta: "PST",
      "Rice & Noodles": "RND",
      Salads: "SLD",
      Desserts: "DST",
      "Ice Cream": "ICR",
      Bakery: "BAK",
      Beverages: "BEV",
      Coffee: "COF",
      Tea: "TEA",
      Milkshake: "MLK",
      Juices: "JUC",
      Mocktails: "MCK",
      "Combo Meals": "COM",
      Starters: "STR",
      "Main Course": "MCR",
    };

    const prefix =
      categoryMap[category] ||
      (category
        ? category.replace(/[^A-Za-z]/g, "").substring(0, 3).toUpperCase()
        : "PRD");

    const count =
      products.filter((item) => (item.sku || item.sku_code)?.startsWith(prefix)).length + 1;

    return `${prefix}-${String(count).padStart(3, "0")}`;
  };

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => {
      let updated = {
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      };

      if (name === "foodType") {
        updated.isVeg = value === "Veg";
      } else if (name === "isVeg") {
        updated.foodType = checked ? "Veg" : "Non-Veg";
      }

      return updated;
    });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("Image size must be under 5MB.");
      return;
    }

    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
    }

    const url = URL.createObjectURL(file);
    objectUrlRef.current = url;

    setFormData((prev) => ({
      ...prev,
      image: file,
    }));
    setImagePreview(url);
  };

  const addVariant = () => {
    setFormData((prev) => ({
      ...prev,
      variants: [
        ...prev.variants,
        {
          id: Date.now(),
          name: "",
          price_delta: 0,
        },
      ],
    }));
  };

  const updateVariant = (id, field, value) => {
    setFormData((prev) => ({
      ...prev,
      variants: prev.variants.map((variant) =>
        variant.id === id ? { ...variant, [field]: value } : variant
      ),
    }));
  };

  const removeVariant = (id) => {
    setFormData((prev) => ({
      ...prev,
      variants: prev.variants.filter((variant) => variant.id !== id),
    }));
  };

  const addAddon = () => {
    setFormData((prev) => ({
      ...prev,
      addons: [
        ...prev.addons,
        {
          id: Date.now(),
          name: "",
          description: "",
          price: "",
        },
      ],
    }));
  };

  const updateAddon = (addonId, field, value) => {
    setFormData((prev) => ({
      ...prev,
      addons: prev.addons.map((addon) =>
        addon.id === addonId ? { ...addon, [field]: value } : addon
      ),
    }));
  };

  const removeAddon = (addonId) => {
    setFormData((prev) => ({
      ...prev,
      addons: prev.addons.filter((addon) => addon.id !== addonId),
    }));
  };

  const handleReset = () => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }

    const fresh = buildFormData(mode, product);
    setFormData(fresh);
    setImagePreview(typeof fresh.image === "string" ? fresh.image : "");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (saving) return;

    if (!formData.name || !formData.category || !formData.price) {
      alert("Please fill all required fields (Name, Category, Selling Price).");
      return;
    }

    const cleanedVariants = formData.variants
      .filter((v) => v.name?.trim())
      .map((v) => ({
        name: v.name.trim(),
        price_delta: Number(v.price_delta) || 0,
      }));

    const cleanedAddons = formData.addons
      .filter((addon) => addon.name?.trim() && addon.price !== "" && addon.price !== null)
      .map((a) => ({
        name: a.name.trim(),
        description: a.description || "",
        price: Number(a.price) || 0,
      }));

    const finalSku =
      mode === "edit" && formData.sku
        ? formData.sku
        : generateSKU(formData.category);

    const isVegBoolean = formData.foodType === "Veg";

    const productData = {
      ...formData,
      sku: finalSku,
      sku_code: finalSku,
      skuNumber: finalSku,
      price: Number(formData.price),
      rating: Number(formData.rating) || 4.5,
      isVeg: isVegBoolean,
      foodType: formData.foodType,
      variants: cleanedVariants,
      addons: cleanedAddons,
    };

    onSave(productData);
  };

  return (
    <>
      {/* Overlay Backdrop */}
      <div
        onClick={saving ? undefined : onClose}
        className="fixed inset-0 z-[9998] bg-black/50 backdrop-blur-sm transition-opacity"
      />

      {/* Modal Dialog */}
      <div className="fixed left-1/2 top-1/2 z-[9999] w-[95%] max-w-5xl -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-3xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5 bg-white">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              {mode === "add" ? "Add Product" : "Edit Product"}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Create and manage menu items for your restaurant.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition disabled:opacity-50 cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="max-h-[78vh] overflow-y-auto p-6 space-y-6 bg-[#F8FAFC]">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* LEFT COLUMN */}
            <div className="space-y-6">
              {/* Product Info */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
                <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
                  Basic Information
                </h3>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Cheese Burger / Paneer Tikka"
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs sm:text-sm outline-none transition focus:border-[#16522D] focus:ring-2 focus:ring-[#16522D]/10 font-medium"
                  />
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                      Category *
                    </label>
                    <input
                      type="text"
                      name="category"
                      value={formData.category}
                      onChange={(e) => {
                        let val = e.target.value;
                        if (val.length > 0) {
                          val = val.charAt(0).toUpperCase() + val.slice(1).toLowerCase();
                        }
                        handleChange({
                          target: {
                            name: "category",
                            value: val,
                          },
                        });
                      }}
                      placeholder="Enter category (e.g. Main course)"
                      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs sm:text-sm outline-none transition focus:border-[#16522D] font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                      Dietary Type *
                    </label>
                    <select
                      name="foodType"
                      value={formData.foodType}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs sm:text-sm outline-none transition focus:border-[#16522D] font-medium"
                    >
                      <option value="Veg">Veg</option>
                      <option value="Non-Veg">Non-Veg</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Write ingredients or dish taste profile..."
                    className="w-full resize-none rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs sm:text-sm outline-none transition focus:border-[#16522D]"
                  />
                </div>
              </div>

              {/* Pricing & Rating */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
                <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
                  Pricing & Ratings
                </h3>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                      Selling Price (₹) *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-xs">
                        ₹
                      </span>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        placeholder="299"
                        className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-8 pr-3 text-xs sm:text-sm font-bold text-slate-900 outline-none transition focus:border-[#16522D]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5 flex items-center gap-1">
                      <Star size={14} className="text-amber-500 fill-amber-500" />
                      Rating (1 - 5)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="1"
                      max="5"
                      name="rating"
                      value={formData.rating}
                      onChange={handleChange}
                      placeholder="4.5"
                      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs sm:text-sm outline-none font-semibold transition focus:border-[#16522D]"
                    />
                  </div>
                </div>
              </div>

              {/* Sizes / Variants */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <Settings2 size={18} className="text-[#16522D]" />
                    <h3 className="text-base font-bold text-slate-900">
                      Product Sizes
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={addVariant}
                    className="rounded-xl bg-emerald-50 border border-emerald-200 px-3 py-1.5 text-xs font-bold text-[#16522D] hover:bg-emerald-100 transition cursor-pointer"
                  >
                    + Add Size
                  </button>
                </div>

                <div className="space-y-2.5">
                  {formData.variants.length === 0 ? (
                    <p className="text-center py-4 text-xs text-slate-400 border border-dashed border-slate-200 rounded-xl">
                      No size variants added (e.g. Small, Medium, Large).
                    </p>
                  ) : (
                    formData.variants.map((variant) => (
                      <div
                        key={variant.id}
                        className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-2.5"
                      >
                        <input
                          type="text"
                          placeholder="Size Name (e.g. Medium)"
                          value={variant.name}
                          onChange={(e) =>
                            updateVariant(variant.id, "name", e.target.value)
                          }
                          className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs outline-none focus:border-[#16522D]"
                        />

                        <div className="relative w-28">
                          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                            +₹
                          </span>
                          <input
                            type="number"
                            placeholder="Price"
                            value={variant.price_delta}
                            onChange={(e) =>
                              updateVariant(
                                variant.id,
                                "price_delta",
                                Number(e.target.value)
                              )
                            }
                            className="w-full rounded-lg border border-slate-200 bg-white py-1.5 pl-7 pr-2 text-xs outline-none focus:border-[#16522D]"
                          />
                        </div>

                        <button
                          type="button"
                          onClick={() => removeVariant(variant.id)}
                          className="rounded-lg p-2 text-rose-500 hover:bg-rose-50 cursor-pointer transition"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Addons */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <PlusCircle size={18} className="text-[#16522D]" />
                    <h3 className="text-base font-bold text-slate-900">
                      Product Add-ons
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={addAddon}
                    className="rounded-xl bg-emerald-50 border border-emerald-200 px-3 py-1.5 text-xs font-bold text-[#16522D] hover:bg-emerald-100 transition cursor-pointer"
                  >
                    + Add Add-on
                  </button>
                </div>

                <div className="space-y-2.5">
                  {formData.addons.length === 0 ? (
                    <p className="text-center py-4 text-xs text-slate-400 border border-dashed border-slate-200 rounded-xl">
                      No extra add-ons configured (e.g. Extra Cheese, Mayo).
                    </p>
                  ) : (
                    formData.addons.map((addon) => (
                      <div
                        key={addon.id}
                        className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-2.5"
                      >
                        <input
                          type="text"
                          placeholder="Add-on Name"
                          value={addon.name}
                          onChange={(e) =>
                            updateAddon(addon.id, "name", e.target.value)
                          }
                          className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs outline-none focus:border-[#16522D]"
                        />

                        <div className="relative w-28">
                          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                            +₹
                          </span>
                          <input
                            type="number"
                            placeholder="Price"
                            value={addon.price}
                            onChange={(e) =>
                              updateAddon(
                                addon.id,
                                "price",
                                e.target.value === "" ? "" : Number(e.target.value)
                              )
                            }
                            className="w-full rounded-lg border border-slate-200 bg-white py-1.5 pl-7 pr-2 text-xs outline-none focus:border-[#16522D]"
                          />
                        </div>

                        <button
                          type="button"
                          onClick={() => removeAddon(addon.id)}
                          className="rounded-lg p-2 text-rose-500 hover:bg-rose-50 cursor-pointer transition"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="space-y-6">
              {/* Image Upload Box */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
                <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
                  Product Image
                </h3>

                <label className="group flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50/60 p-6 transition hover:border-[#16522D] hover:bg-emerald-50/20">
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleImageUpload}
                  />

                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#16522D]/10 text-[#16522D]">
                    <UploadCloud size={24} />
                  </div>

                  <p className="text-xs font-bold text-slate-800">
                    Click to browse image
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    PNG, JPG, WEBP (Max 5MB)
                  </p>
                </label>

                {/* Preview Frame */}
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="h-48 w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-48 items-center justify-center text-center text-slate-400">
                      <div>
                        <UploadCloud size={32} className="mx-auto mb-1 opacity-40" />
                        <p className="text-xs font-medium">Image Preview</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Status Toggles */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
                <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
                  Visibility & Settings
                </h3>

                <label className="flex items-center justify-between rounded-xl border border-slate-200 p-3.5 cursor-pointer hover:bg-slate-50 transition">
                  <div>
                    <p className="text-xs font-bold text-slate-800">Product Available</p>
                    <p className="text-[11px] text-slate-400">Customers can view and order this dish.</p>
                  </div>
                  <input
                    type="checkbox"
                    name="available"
                    checked={formData.available}
                    onChange={handleChange}
                    className="h-4 w-4 rounded accent-[#16522D] cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between rounded-xl border border-slate-200 p-3.5 cursor-pointer hover:bg-slate-50 transition">
                  <div>
                    <p className="text-xs font-bold text-slate-800">Featured Item</p>
                    <p className="text-[11px] text-slate-400">Highlight this item on the storefront header.</p>
                  </div>
                  <input
                    type="checkbox"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleChange}
                    className="h-4 w-4 rounded accent-[#16522D] cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between rounded-xl border border-slate-200 p-3.5 cursor-pointer hover:bg-slate-50 transition">
                  <div>
                    <p className="text-xs font-bold text-slate-800">Combo Meal</p>
                    <p className="text-[11px] text-slate-400">Mark if this dish is a combo package.</p>
                  </div>
                  <input
                    type="checkbox"
                    name="combo"
                    checked={formData.combo}
                    onChange={handleChange}
                    className="h-4 w-4 rounded accent-[#16522D] cursor-pointer"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Sticky Footer */}
          <div className="sticky bottom-0 z-20 -mx-6 -mb-6 border-t border-slate-200 bg-white/95 px-6 py-4 backdrop-blur flex items-center justify-between">
            <button
              type="button"
              onClick={handleReset}
              disabled={saving}
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
            >
              Reset
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                disabled={saving}
                className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 rounded-xl bg-[#16522D] px-6 py-2.5 text-xs font-bold text-white hover:bg-[#114125] transition disabled:opacity-60 cursor-pointer shadow-md shadow-[#16522D]/20"
              >
                {saving ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    {mode === "add" ? "Saving..." : "Updating..."}
                  </>
                ) : mode === "add" ? (
                  "Save Product"
                ) : (
                  "Update Product"
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}