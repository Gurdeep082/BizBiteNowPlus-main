import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, ChevronRight, Check, Save, X } from "lucide-react";
import { motion } from "framer-motion";

import BasicInfoStep from "../../../components/dashboard/festive/builder/BasicInfoStep";
import ProductsStep from "../../../components/dashboard/festive/builder/ProductsStep";
import ScheduleStep from "../../../components/dashboard/festive/builder/ScheduleStep";
import ReviewStep from "../../../components/dashboard/festive/builder/ReviewStep";

import useFestiveMenuStore from "../../../store/festiveMenuStore";
import API from "../../../services/api";

const STEPS = [
  { id: 1, title: "Basic Info", subtitle: "Festival Details" },
  { id: 2, title: "Products", subtitle: "Offer Prices" },
  { id: 3, title: "Schedule", subtitle: "Publish Timing" },
  { id: 4, title: "Review", subtitle: "Publish" },
];

export default function CreateFestiveMenu() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const {
    menus,
    loading,
    fetchMenus,
    getMenuById,
  } = useFestiveMenuStore();

  const [availableProducts, setAvailableProducts] = useState([]);
  const [productsError, setProductsError] = useState("");

  useEffect(() => {
    API.get("/products/dashboard/all")
      .then((res) => {
        const raw = res.data.products || res.data.data || [];
        setAvailableProducts(Array.isArray(raw) ? raw : []);
        setProductsError("");
      })
      .catch(() => {
        setProductsError("Failed to load products. Please refresh and try again.");
      });
  }, []);

  useEffect(() => {
    if (isEdit && menus.length === 0) {
      fetchMenus().catch(() => { });
    }
  }, [isEdit, menus.length, fetchMenus]);

  const existingMenu = isEdit ? getMenuById(id) : null;
  const [currentStep, setCurrentStep] = useState(1);

  const [basicInfo, setBasicInfo] = useState(() => ({
    name: existingMenu?.title || existingMenu?.name || "",
    festival: existingMenu?.festival_name || existingMenu?.festival || "",
    description: existingMenu?.description || "",
    banner: existingMenu?.banner_image || existingMenu?.banner_url || "",
    banner_image: null,
  }));

  const [products, setProducts] = useState(() => existingMenu?.applicable_products || existingMenu?.products || []);

  const [schedule, setSchedule] = useState(() => {
    const rawStart = existingMenu?.start_date || existingMenu?.goLive;
    const rawEnd = existingMenu?.end_date || existingMenu?.endsOn;
    const startParts = rawStart ? rawStart.split("T") : ["", ""];
    const endParts = rawEnd ? rawEnd.split("T") : ["", ""];

    return {
      startDate: startParts[0] || "",
      startTime: startParts[1] ? startParts[1].slice(0, 5) : "",
      endDate: endParts[0] || "",
      endTime: endParts[1] ? endParts[1].slice(0, 5) : "",
    };
  });

  const [syncedId, setSyncedId] = useState(null);

  if (existingMenu && existingMenu.id !== syncedId) {
    setSyncedId(existingMenu.id);
    setBasicInfo({
      name: existingMenu.title || existingMenu.name || "",
      festival: existingMenu.festival_name || existingMenu.festival || "",
      description: existingMenu.description || "",
      banner: existingMenu.banner_image || existingMenu.banner_url || "",
      banner_image: null,
    });
    setProducts(existingMenu.applicable_products || existingMenu.products || []);

    const rawStart = existingMenu.start_date || existingMenu.goLive;
    const rawEnd = existingMenu.end_date || existingMenu.endsOn;
    const startParts = rawStart ? rawStart.split("T") : ["", ""];
    const endParts = rawEnd ? rawEnd.split("T") : ["", ""];

    setSchedule({
      startDate: startParts[0] || "",
      startTime: startParts[1] ? startParts[1].slice(0, 5) : "",
      endDate: endParts[0] || "",
      endTime: endParts[1] ? endParts[1].slice(0, 5) : "",
    });
  }

  const progress = (currentStep / STEPS.length) * 100;

  const validateStep = () => {
    switch (currentStep) {
      case 1:
        return Boolean(basicInfo.name && basicInfo.festival);
      case 2:
        return Array.isArray(products) && products.length > 0;
      case 3:
        return Boolean(schedule.startDate && schedule.startTime && schedule.endDate && schedule.endTime);
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (!validateStep()) {
      alert("Please complete all required fields for this step.");
      return;
    }
    if (currentStep < STEPS.length) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const previousStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const formatISO = (dateStr, timeStr) => {
    if (!dateStr) return "";
    const time = timeStr ? (timeStr.length === 5 ? `${timeStr}:00` : timeStr) : "00:00:00";
    return `${dateStr}T${time}`;
  };

  const sanitizeProducts = (prodList) => {
    return prodList.map((p) => ({
      product_id: p.product_id || p._id || p.id,
      offer_price: Number(p.offer_price) || 0,
      variants: Array.isArray(p.variants)
        ? p.variants.map((v) => ({
          variant_name: v.variant_name || v.name,
          offer_price: Number(v.offer_price) || 0,
        }))
        : [],
    }));
  };

  const handleSave = async (status) => {
    if (status === "active" && !validateStep()) {
      alert("Please fill all mandatory fields before publishing.");
      return;
    }

    try {
      const formData = new FormData();
      const sanitizedProducts = sanitizeProducts(products);

      const finalTitle = basicInfo.title || basicInfo.name || basicInfo.deal_name || "Festive Deal";
      formData.append("title", finalTitle);
      formData.append("festival_name", basicInfo.festival || "");
      formData.append("description", basicInfo.description || "");

      formData.append("applicable_products", JSON.stringify(sanitizedProducts));
      formData.append("applies_to_all_products", sanitizedProducts.length === 0);

      formData.append("start_date", formatISO(schedule.startDate, schedule.startTime));
      formData.append("end_date", formatISO(schedule.endDate, schedule.endTime));
      formData.append("status", status);

      if (basicInfo.banner_image) {
        formData.append("banner_image", basicInfo.banner_image);
      }

      if (isEdit && existingMenu) {
        const menuId = existingMenu.id || existingMenu._id;
        await API.put(`/festive-deals/${menuId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert(`Festive Menu ${status === 'active' ? 'Updated' : 'Draft Saved'} Successfully!`);
      } else {
        await API.post(`/festive-deals`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert(`Festive Menu ${status === 'active' ? 'Published' : 'Draft Saved'} Successfully!`);
      }

      await fetchMenus();
      navigate("/seller/festivemenu");

    } catch (err) {
      alert(err?.response?.data?.message || "Unable to process request.");
    }
  };

  const saveDraft = () => handleSave("draft");
  const publishMenu = () => handleSave("active");

  if (isEdit && loading && !existingMenu) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-xs text-slate-400 font-medium">
        Loading menu data...
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full space-y-6 pb-12 font-sans text-slate-900"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
            {isEdit ? "Edit Festive Menu" : "Create Festive Menu"}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {isEdit ? "Update your seasonal deal details." : "Create a festive offer in four simple steps."}
          </p>
        </div>

        <button
          onClick={() => navigate("/seller/festivemenu")}
          className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 shadow-xs hover:bg-slate-50 transition cursor-pointer self-start sm:self-auto"
        >
          <X size={16} /> Cancel
        </button>
      </div>

      <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
        <div
          className="h-full rounded-full bg-emerald-700 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {STEPS.map((step) => {
          const active = currentStep === step.id;
          const completed = currentStep > step.id;

          return (
            <div
              key={step.id}
              className={`rounded-2xl border p-4 transition-all ${active
                  ? "border-emerald-600 bg-emerald-50/40 shadow-xs ring-1 ring-emerald-600"
                  : completed
                    ? "border-emerald-200 bg-emerald-50/20"
                    : "border-slate-100 bg-white"
                }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-bold ${completed
                      ? "bg-emerald-700 text-white"
                      : active
                        ? "bg-emerald-700 text-white shadow-sm"
                        : "bg-slate-100 text-slate-500"
                    }`}
                >
                  {completed ? <Check size={14} /> : step.id}
                </div>
                <div className="min-w-0">
                  <h3 className="text-xs font-bold text-slate-900 truncate">{step.title}</h3>
                  <p className="text-[10px] text-slate-400 truncate">{step.subtitle}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {productsError && currentStep === 2 && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-semibold text-rose-700">
          {productsError}
        </div>
      )}

      <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
        {currentStep === 1 && (
          <BasicInfoStep
            data={basicInfo}
            onChange={(updatedData) => setBasicInfo((prev) => ({ ...prev, ...updatedData }))}
          />
        )}
        {currentStep === 2 && (
          <ProductsStep data={products} products={availableProducts} onChange={setProducts} />
        )}
        {currentStep === 3 && <ScheduleStep data={schedule} onChange={setSchedule} />}
        {currentStep === 4 && (
          <ReviewStep basicInfo={basicInfo} products={products} appearance={{}} schedule={schedule} />
        )}
      </div>

      <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm flex items-center justify-between">
        <button
          onClick={previousStep}
          disabled={currentStep === 1}
          className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 cursor-pointer transition"
        >
          <ChevronLeft size={16} /> Previous
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={saveDraft}
            disabled={loading}
            className="flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-xs font-bold text-emerald-800 hover:bg-emerald-100 transition cursor-pointer"
          >
            <Save size={16} /> {isEdit ? "Update Draft" : "Save Draft"}
          </button>

          {currentStep !== STEPS.length ? (
            <button
              onClick={nextStep}
              className="flex items-center gap-1.5 rounded-xl bg-emerald-700 px-5 py-2.5 text-xs font-bold text-white hover:bg-emerald-800 transition cursor-pointer shadow-xs"
            >
              Next <ChevronRight size={16} />
            </button>
          ) : (
            <button
              onClick={publishMenu}
              disabled={loading}
              className="flex items-center gap-1.5 rounded-xl bg-emerald-700 px-5 py-2.5 text-xs font-bold text-white hover:bg-emerald-800 transition cursor-pointer shadow-xs disabled:opacity-50"
            >
              <Check size={16} /> {isEdit ? "Update Menu" : "Publish Menu"}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}