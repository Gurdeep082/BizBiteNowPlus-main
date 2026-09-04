import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ImagePlus,
  Pencil,
  Trash2,
  X,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  Save,
  ImageOff,
  Eye,
  EyeOff,
} from "lucide-react";
import useBannerStore from "../../../store/bannerStore";
import API from "../../../services/api";

const MAX_FILE_SIZE_KB = 500;
const MAX_BANNERS = 6;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

const emptyForm = {
  title: "",
  subtitle: "",
  tag: "OFFER",
  cta_text: "View Deal Details",
  display_order: 0,
};

export default function BannerManagementCard() {
  const {
    banners,
    isLoading,
    error,
    fetchMyBanners,
    createBanner,
    updateBanner,
    deleteBanner,
    clearError,
  } = useBannerStore();

  const [form, setForm] = useState(emptyForm);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [fileError, setFileError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [bannerToDelete, setBannerToDelete] = useState(null);
  const [togglingId, setTogglingId] = useState(null);
  const fileInputRef = useRef(null);
  const formPanelRef = useRef(null);

  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  useEffect(() => {
    fetchMyBanners().catch(() => { });
  }, [fetchMyBanners]);

  const showToast = (type, message) => {
    setToast({ type, message });
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 3000);
  };

  const resetForm = () => {
    setForm(emptyForm);
    setFile(null);
    setPreview(null);
    setFileError("");
    setEditingId(null);
    setShowForm(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const openAddForm = () => {
    resetForm();
    setShowForm(true);
    requestAnimationFrame(() => {
      formPanelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    if (!ACCEPTED_TYPES.includes(selected.type)) {
      setFileError("Only JPG, PNG or WEBP images are allowed.");
      setFile(null);
      setPreview(null);
      return;
    }

    if (selected.size > MAX_FILE_SIZE_KB * 1024) {
      setFileError(`Image is too large. Max allowed size is ${MAX_FILE_SIZE_KB}KB.`);
      setFile(null);
      setPreview(null);
      return;
    }

    setFileError("");
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  const startEdit = (banner) => {
    setEditingId(banner._id);
    setForm({
      title: banner.title || "",
      subtitle: banner.subtitle || "",
      tag: banner.tag || "OFFER",
      cta_text: banner.cta_text || "View Deal Details",
      display_order: banner.display_order ?? 0,
    });
    setFile(null);
    setFileError("");
    setPreview(banner.image_url);
    setShowForm(true);
    requestAnimationFrame(() => {
      formPanelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setFileError("Banner title is required.");
      return;
    }
    if (!editingId && !file) {
      setFileError("Please choose a banner image.");
      return;
    }

    const formData = new FormData();
    if (file) formData.append("banner_image", file);
    formData.append("title", form.title);
    formData.append("subtitle", form.subtitle);
    formData.append("tag", form.tag);
    formData.append("cta_text", form.cta_text);
    formData.append("display_order", form.display_order);

    try {
      if (editingId) {
        await updateBanner(editingId, formData);
        showToast("success", "Banner updated successfully");
      } else {
        await createBanner(formData);
        showToast("success", "Banner added successfully");
      }
      resetForm();
    } catch (err) {
      showToast("error", "Couldn't save banner — try again");
    }
  };

  const confirmDelete = async () => {
    if (!bannerToDelete) return;
    setDeletingId(bannerToDelete._id);
    try {
      await deleteBanner(bannerToDelete._id);
      showToast("success", "Banner deleted successfully");
      setBannerToDelete(null);
    } catch (err) {
      showToast("error", "Couldn't delete banner — try again");
    } finally {
      setDeletingId(null);
    }
  };

  const toggleActive = async (banner) => {
    setTogglingId(banner._id);
    const formData = new FormData();
    formData.append("is_active", String(!banner.is_active));
    try {
      await updateBanner(banner._id, formData);
      showToast("success", banner.is_active ? "Banner is now hidden" : "Banner is now live");
    } catch (err) {
      showToast("error", "Couldn't update banner status — try again");
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <div className="relative rounded-3xl border border-slate-200/60 bg-white p-6 sm:p-8 shadow-sm space-y-8 font-sans">
      <div className="pointer-events-none fixed inset-x-0 top-6 z-[100] flex justify-center px-4">
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: -16, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -16, scale: 0.95 }}
              className={`pointer-events-auto flex items-center gap-2.5 rounded-full px-5 py-3 text-sm font-medium shadow-[0_8px_30px_rgb(0,0,0,0.12)] ${toast.type === "success" ? "bg-[#007A55] text-white" : "bg-rose-600 text-white"
                }`}
            >
              {toast.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
              {toast.message}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg sm:text-xl font-semibold tracking-tight text-slate-800">
            Home Banners
          </h3>
          <p className="text-sm text-slate-500 mt-1 leading-relaxed">
            Manage the promotional banners at the top of your storefront. Up to {MAX_BANNERS} banners &middot; JPG/PNG/WEBP &middot; Max {MAX_FILE_SIZE_KB}KB.
          </p>
        </div>
        {!showForm && banners.length < MAX_BANNERS && (
          <button
            onClick={openAddForm}
            className="flex shrink-0 items-center gap-2 rounded-full bg-[#007A55] px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-[#0f9b71] transition-colors focus:ring-4 focus:ring-[#007A55]/10 outline-none cursor-pointer"
          >
            <ImagePlus size={16} /> Add Banner
          </button>
        )}
      </div>

      {error && (
        <div className="flex items-center justify-between rounded-2xl border border-red-200/60 bg-red-50/50 px-5 py-4 text-sm text-red-600 font-medium">
          {error}
          <button onClick={clearError} className="text-red-400 hover:text-red-600 transition-colors cursor-pointer">
            <X size={16} />
          </button>
        </div>
      )}

      <div className={`grid gap-6 items-start ${showForm ? "lg:grid-cols-[1fr_400px]" : "grid-cols-1"}`}>
        <div className="space-y-6">
          {isLoading && banners.length === 0 ? (
            <div className="flex h-48 items-center justify-center rounded-3xl border border-slate-100 bg-slate-50/50">
              <Loader2 size={28} className="animate-spin text-slate-400" />
            </div>
          ) : banners.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-slate-200/80 bg-slate-50/30 py-20 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100/80 text-slate-400">
                <ImageOff size={28} strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-base font-medium text-slate-700">No banners yet</p>
                <p className="text-sm text-slate-500 mt-1">Add a banner to showcase your best deals.</p>
              </div>
            </div>
          ) : (
            <div className={`grid grid-cols-1 gap-5 ${showForm ? "sm:grid-cols-1 xl:grid-cols-2" : "sm:grid-cols-2 xl:grid-cols-3"}`}>
              {banners.map((banner) => (
                <div
                  key={banner._id}
                  className={`group flex flex-col overflow-hidden rounded-3xl border transition-all duration-300 bg-white ${editingId === banner._id
                      ? "border-slate-400 shadow-md ring-4 ring-slate-400/10"
                      : "border-slate-200/70 shadow-sm hover:shadow-md hover:border-slate-300"
                    }`}
                >
                  <div className="relative h-40 w-full bg-slate-50 overflow-hidden">
                    <img
                      src={banner.image_url}
                      alt={banner.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    {!banner.is_active && (
                      <span className="absolute top-3 left-3 rounded-full bg-white/90 backdrop-blur-sm px-3 py-1 text-[10px] font-semibold tracking-widest uppercase text-slate-700 shadow-sm">
                        Hidden
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col flex-1 p-5 space-y-4">
                    <div className="flex-1 min-w-0">
                      <h4 className="truncate text-base font-semibold tracking-tight text-slate-800">
                        {banner.title}
                      </h4>
                      {banner.subtitle ? (
                        <p className="truncate text-sm font-normal text-slate-500 mt-0.5">
                          {banner.subtitle}
                        </p>
                      ) : (
                        <p className="text-sm font-normal text-slate-400 italic mt-0.5">
                          No subtitle
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                      <button
                        onClick={() => startEdit(banner)}
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-2.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-[#007A55] cursor-pointer outline-none focus:ring-4 focus:ring-slate-100"
                      >
                        <Pencil size={14} /> Edit
                      </button>
                      <button
                        onClick={() => toggleActive(banner)}
                        disabled={togglingId === banner._id}
                        title={banner.is_active ? "Hide from storefront" : "Show on storefront"}
                        className={`flex flex-1 items-center justify-center gap-2 rounded-xl border py-2.5 text-xs font-medium transition-colors cursor-pointer outline-none focus:ring-4 disabled:opacity-60 ${banner.is_active
                            ? "border-emerald-200/70 bg-emerald-50/50 text-emerald-700 hover:bg-emerald-100/60 focus:ring-emerald-50"
                            : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 focus:ring-slate-100"
                          }`}
                      >
                        {togglingId === banner._id ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : banner.is_active ? (
                          <Eye size={14} />
                        ) : (
                          <EyeOff size={14} />
                        )}
                        {banner.is_active ? "Live" : "Hidden"}
                      </button>
                      <button
                        onClick={() => setBannerToDelete(banner)}
                        title="Delete banner"
                        className="flex h-[38px] w-[38px] items-center justify-center shrink-0 rounded-xl border border-rose-100 bg-rose-50 text-rose-600 transition-colors hover:bg-rose-100 hover:border-rose-200 cursor-pointer outline-none focus:ring-4 focus:ring-rose-50"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <AnimatePresence>
          {showForm && (
            <motion.div
              ref={formPanelRef}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="h-fit lg:sticky lg:top-6"
            >
              <form
                onSubmit={handleSubmit}
                className="rounded-3xl border border-slate-200/60 bg-white p-6 sm:p-7 shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
              >
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-lg font-semibold tracking-tight text-slate-800">
                    {editingId ? "Edit Banner" : "New Banner"}
                  </h4>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors cursor-pointer outline-none"
                  >
                    <X size={16} />
                  </button>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Banner Image {editingId && <span className="text-slate-400 font-normal">(Optional)</span>}
                    </label>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleFileChange}
                      className="block w-full text-sm text-slate-500 file:mr-4 file:cursor-pointer file:rounded-full file:border-0 file:bg-slate-100 file:px-5 file:py-2.5 file:text-sm file:font-medium file:text-slate-700 hover:file:bg-slate-200 transition-all outline-none"
                    />
                    {fileError && <p className="mt-2 text-sm font-medium text-rose-500">{fileError}</p>}
                    {preview && (
                      <div className="mt-4 h-32 w-full overflow-hidden rounded-2xl border border-slate-100 bg-slate-50">
                        <img src={preview} alt="Preview" className="h-full w-full object-cover" />
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Title</label>
                    <input
                      type="text"
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      maxLength={60}
                      className="w-full rounded-xl border border-slate-200/80 bg-slate-50/50 px-4 py-3 text-sm text-[#007A55] placeholder:text-slate-400 outline-none transition-all focus:border-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-400/10"
                      placeholder="e.g. Flat 25% OFF"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Subtitle</label>
                    <input
                      type="text"
                      value={form.subtitle}
                      onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                      maxLength={120}
                      className="w-full rounded-xl border border-slate-200/80 bg-slate-50/50 px-4 py-3 text-sm text-[#007A55] placeholder:text-slate-400 outline-none transition-all focus:border-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-400/10"
                      placeholder="e.g. On all orders above ₹199"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Tag</label>
                      <input
                        type="text"
                        value={form.tag}
                        onChange={(e) => setForm({ ...form, tag: e.target.value })}
                        className="w-full rounded-xl border border-slate-200/80 bg-slate-50/50 px-4 py-3 text-sm text-[#007A55] placeholder:text-slate-400 outline-none transition-all focus:border-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-400/10"
                        placeholder="WINTER"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Order</label>
                      <input
                        type="number"
                        value={form.display_order}
                        onChange={(e) => setForm({ ...form, display_order: e.target.value })}
                        min={0}
                        className="w-full rounded-xl border border-slate-200/80 bg-slate-50/50 px-4 py-3 text-sm text-[#007A55] placeholder:text-slate-400 outline-none transition-all focus:border-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-400/10"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Button Text</label>
                    <input
                      type="text"
                      value={form.cta_text}
                      onChange={(e) => setForm({ ...form, cta_text: e.target.value })}
                      className="w-full rounded-xl border border-slate-200/80 bg-slate-50/50 px-4 py-3 text-sm text-[#007A55] placeholder:text-slate-400 outline-none transition-all focus:border-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-400/10"
                      placeholder="e.g. Shop Now"
                    />
                  </div>
                </div>

                <div className="mt-8 flex items-center gap-3">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#007A55] px-5 py-3.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#0f9b71] disabled:opacity-70 focus:ring-4 focus:ring-[#007A55]/10 outline-none cursor-pointer"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 size={18} className="animate-spin" /> Saving...
                      </>
                    ) : (
                      <>
                        <Save size={18} /> {editingId ? "Save Changes" : "Create Banner"}
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-[#007A55] focus:ring-4 focus:ring-slate-100 outline-none cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {bannerToDelete && (
          <div
            className="fixed inset-0 z-[110] flex items-center justify-center bg-[#007A55]/40 p-4 backdrop-blur-sm"
            onClick={() => setBannerToDelete(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm rounded-[2rem] bg-white p-8 text-center shadow-2xl"
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-50 text-rose-500 mb-5">
                <AlertTriangle size={28} strokeWidth={2} />
              </div>
              <h3 className="text-xl font-semibold tracking-tight text-[#007A55] mb-2">Delete Banner?</h3>
              <p className="text-sm font-normal text-slate-500 mb-8 leading-relaxed">
                Are you sure you want to delete <span className="font-semibold text-slate-700">"{bannerToDelete.title}"</span>? This action cannot be undone.
              </p>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setBannerToDelete(null)}
                  disabled={deletingId === bannerToDelete._id}
                  className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 focus:ring-4 focus:ring-slate-100 outline-none cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmDelete}
                  disabled={deletingId === bannerToDelete._id}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-rose-600 px-4 py-3.5 text-sm font-medium text-white transition-colors hover:bg-rose-700 disabled:opacity-70 focus:ring-4 focus:ring-rose-500/20 outline-none cursor-pointer"
                >
                  {deletingId === bannerToDelete._id ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Trash2 size={18} />
                  )}
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}