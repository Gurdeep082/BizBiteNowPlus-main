import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ReceiptText,
  FileText,
  Save,
  Loader2,
  AlertCircle,
  Check,
} from "lucide-react";
import Toggle from "../../UI/Toggle";

const GST_SLABS = [0, 5, 12, 18, 28];

const GST_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

export default function TaxComplianceCard({ profile, loading: parentLoading, onSave }) {
  const [formData, setFormData] = useState({
    gst_number: "",
    gst_percentage: 5,
    invoice_prefix: "BBN",
    invoice_start_number: 1001,
    generate_gst_invoice: true,
    auto_generate_invoice: true,
  });

  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [gstError, setGstError] = useState(false);

  useEffect(() => {
    if (profile?.tax_settings) {
      const ts = profile.tax_settings;
      setFormData({
        gst_number: ts.gst_number || profile.business_info?.gst_number || "",
        gst_percentage: Number(ts.gst_percentage ?? 5),
        invoice_prefix: ts.invoice_prefix || "BBN",
        invoice_start_number: Number(ts.invoice_start_number ?? 1001),
        generate_gst_invoice: ts.generate_gst_invoice ?? true,
        auto_generate_invoice: ts.auto_generate_invoice ?? true,
      });
    }
  }, [profile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const upperFields = ["gst_number", "invoice_prefix"];
    const numFields = ["invoice_start_number"];
    const nextValue = upperFields.includes(name)
      ? value.toUpperCase()
      : numFields.includes(name)
        ? Number(value)
        : value;

    setFormData((prev) => ({ ...prev, [name]: nextValue }));

    if (name === "gst_number") {
      setGstError(!!value && !GST_REGEX.test(value.toUpperCase()));
    }
  };

  const setToggle = (name, val) => setFormData((prev) => ({ ...prev, [name]: val }));

  // Live sample invoice number so seller can see the format as they type
  const invoicePreview = `${formData.invoice_prefix || "BBN"}-${formData.invoice_start_number || 1001}`;

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (typeof onSave !== "function") return;

    if (formData.gst_number && !GST_REGEX.test(formData.gst_number)) {
      setGstError(true);
      return;
    }

    try {
      setSaving(true);
      setShowSuccess(false);

      await onSave(formData);

      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    } catch (err) {
      console.error("Failed to save tax settings:", err);
    } finally {
      setSaving(false);
    }
  };

  const inputClass = (hasError) =>
    `w-full rounded-xl border bg-white px-4 py-3 text-xs sm:text-sm font-semibold text-slate-800 outline-none transition shadow-xs ${hasError
      ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
      : "border-slate-200 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10"
    }`;

  return (
    <motion.section
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="rounded-3xl border border-slate-100 bg-white shadow-sm overflow-hidden"
    >
      <form onSubmit={handleFormSubmit}>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 px-6 py-5 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-700 shrink-0">
              <ReceiptText size={22} />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Tax & Compliance
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Configure taxes, invoices and legal compliance.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto">
            <AnimatePresence>
              {showSuccess && (
                <motion.span
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-emerald-600"
                >
                  <Check size={16} /> Saved
                </motion.span>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={saving || parentLoading}
              className="flex items-center gap-2 rounded-xl bg-amber-400 px-5 py-2.5 text-xs sm:text-sm font-bold text-emerald-950 shadow-sm transition hover:bg-amber-500 disabled:opacity-70 cursor-pointer"
            >
              {saving ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <Save size={16} /> <span className="hidden sm:inline">Save Tax Settings</span><span className="sm:hidden">Save</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* ── Section 1: GST ── */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase text-slate-500 flex items-center gap-1.5">
              <FileText size={13} /> GST Details
            </h3>

            <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-5 space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase text-slate-700">
                  GST Number
                </label>
                <input
                  type="text"
                  name="gst_number"
                  value={formData.gst_number}
                  onChange={handleChange}
                  maxLength={15}
                  placeholder="22ABCDE1234F1Z5"
                  className={`${inputClass(gstError)} uppercase tracking-widest`}
                />
                {gstError && (
                  <p className="mt-1.5 flex items-center gap-1.5 text-[11px] font-semibold text-red-500">
                    <AlertCircle size={12} /> Not a valid 15-character GSTIN. Example: 22ABCDE1234F1Z5
                  </p>
                )}
                {!gstError && formData.gst_number && (
                  <p className="mt-1.5 text-[11px] font-medium text-slate-500">
                    Synced from Business Information — update it there to change here.
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold uppercase text-slate-700">
                  GST Rate
                </label>
                <div className="flex flex-wrap gap-2">
                  {GST_SLABS.map((slab) => {
                    const active = formData.gst_percentage === slab;
                    return (
                      <button
                        key={slab}
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, gst_percentage: slab }))}
                        className={`rounded-xl px-5 py-2.5 text-sm font-bold transition cursor-pointer border-2 ${active
                            ? "bg-emerald-700 text-white border-emerald-700 shadow-sm"
                            : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
                          }`}
                      >
                        {slab}%
                      </button>
                    );
                  })}
                </div>
                {formData.gst_percentage === 0 && (
                  <p className="mt-2.5 text-[11px] font-semibold text-amber-600">
                    0% means no GST will be applied to orders.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* ── Section 2: Invoice Numbering ── */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase text-slate-500 flex items-center gap-1.5">
              <ReceiptText size={13} /> Invoice Numbering
            </h3>

            <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase text-slate-700">
                    Prefix
                  </label>
                  <input
                    type="text"
                    name="invoice_prefix"
                    value={formData.invoice_prefix}
                    onChange={handleChange}
                    placeholder="BBN"
                    maxLength={6}
                    className={`${inputClass(false)} uppercase tracking-widest`}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase text-slate-700">
                    Start Number
                  </label>
                  <input
                    type="number"
                    name="invoice_start_number"
                    value={formData.invoice_start_number}
                    onChange={handleChange}
                    placeholder="1001"
                    min={1}
                    className={inputClass(false)}
                  />
                </div>
              </div>

              {/* Live invoice preview */}
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 flex items-center justify-between mt-2">
                <p className="text-xs font-semibold text-emerald-700">
                  Your first invoice will be numbered:
                </p>
                <span className="rounded-lg bg-emerald-700 px-3 py-1 text-sm font-black text-white tracking-wider">
                  {invoicePreview}
                </span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </motion.section>
  );
}