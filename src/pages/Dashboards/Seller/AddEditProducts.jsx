import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    ArrowLeft,
    ArrowRight,
    UploadCloud,
    Trash2,
    Star,
    PlusCircle,
    Loader2,
    Copy,
    AlertCircle,
    Check,
    Sparkles,
    Info,
    Circle,
    CheckCircle2,
    Leaf,
    Drumstick,
    Eye,
    Percent,
    PackageSearch,
    Plus,
    X,
    ImagePlus,
    Box
} from "lucide-react";

import Typography from "../../../components/UI/Typography";
import Button from "../../../components/UI/Button";
import Input from "../../../components/UI/Input";
import Card from "../../../components/UI/Card";
import Toggle from "../../../components/UI/Toggle";
import Badge from "../../../components/UI/Badge";

import useProductStore from "../../../store/productStore";
import useAuthStore from "../../../store/authStore";
import useCategoryStore from "../../../store/menuCategoryStore";
import { notifySuccess } from "../../../utils/toast";

const emptyForm = {
    id: null,
    sku: "",
    name: "",
    description: "",
    category_id: "",
    price: "",
    stock: "",
    image: "",
    isVeg: true,
    foodType: "Veg",
    rating: 4.5,
    available: true,
    featured: false,
    combo: false,
    comboItems: [],
    taxPercent: 0,
    delivery: true,
    variants: [],
    addons: [],
};

const buildFormData = (product, { keepIdentity = true, defaultTax = 0 } = {}) => {
    if (!product) return { ...emptyForm, id: Date.now(), taxPercent: defaultTax };

    const currentFoodType =
        product.foodType ||
        (product.isVeg === false || product.isVeg === "false" ? "Non-Veg" : "Veg");
    const currentIsVeg = currentFoodType === "Veg";

    const mappedVariants = (product.variants || []).map((v) => ({
        id: v.id || v._id || Date.now() + Math.random(),
        _id: v._id || undefined,
        name: v.name || "",
        price_delta: v.price_delta ?? v.price ?? 0,
    }));

    const variantNameById = {};
    mappedVariants.forEach((v) => {
        if (v._id) variantNameById[String(v._id)] = v.name;
    });

    return {
        id: keepIdentity ? product.id || product._id : Date.now(),
        _id: keepIdentity ? product._id : undefined,
        sku: keepIdentity ? product.sku || product.sku_code || product.skuNumber || "" : "",
        name: keepIdentity ? product.name || "" : "",
        description: product.description || "",
        category_id: product.category_id?._id || product.category_id || "",
        price: product.price || "",
        stock: product.stock || "",
        image: keepIdentity ? product.image || "" : "",
        isVeg: currentIsVeg,
        foodType: currentFoodType,
        rating: product.rating ?? 4.5,
        available: product.available ?? product.is_available ?? true,
        featured: product.featured ?? product.is_featured ?? false,
        combo: product.combo ?? product.is_combo ?? false,
        comboItems: (product.comboItems || product.combo_items || []).map((c) => ({
            id: c.id || c._id || Date.now() + Math.random(),
            product_id: c.product_id?._id || c.product_id || "",
            name: c.product_id?.name || c.name || "",
            quantity: c.quantity || 1,
        })),
        taxPercent: product.taxPercent ?? product.tax_percent ?? defaultTax,
        delivery: product.delivery ?? true,
        variants: mappedVariants,
        addons: (product.addons || []).map((a) => {
            const rawApplicable = Array.isArray(a.applicable_variants) ? a.applicable_variants : [];
            const applicableNames = rawApplicable
                .map((ref) => variantNameById[String(ref)] || (typeof ref === "string" ? ref : ""))
                .filter(Boolean);

            return {
                id: a.id || a._id || Date.now() + Math.random(),
                name: a.name || "",
                description: a.description || "",
                price: a.price ?? "",
                applicable_variants: applicableNames,
            };
        }),
    };
};

function PriceDial({ value, onChange, min = 0, max = 2000, step = 10, error }) {
    const knobRef = useRef(null);
    const draggingRef = useRef(false);

    const numeric = Number(value) || 0;
    const pct = Math.min(1, Math.max(0, (numeric - min) / (max - min)));
    const sweep = 270 * pct;

    const valueFromAngle = (angleDeg) => {
        const clamped = Math.min(135, Math.max(-135, angleDeg));
        const p = (clamped + 135) / 270;
        const raw = min + p * (max - min);
        return Math.max(min, Math.min(max, Math.round(raw / step) * step));
    };

    const updateFromEvent = (clientX, clientY) => {
        const el = knobRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        let angle = (Math.atan2(clientY - cy, clientX - cx) * 180) / Math.PI + 90;
        if (angle > 180) angle -= 360;
        if (angle < -180) angle += 360;
        onChange(valueFromAngle(angle));
    };

    const handleDown = (e) => {
        draggingRef.current = true;
        e.currentTarget.setPointerCapture?.(e.pointerId);
        updateFromEvent(e.clientX, e.clientY);
    };
    const handleMove = (e) => {
        if (!draggingRef.current) return;
        updateFromEvent(e.clientX, e.clientY);
    };
    const handleUp = () => {
        draggingRef.current = false;
    };

    return (
        <div className="flex flex-col items-center gap-2.5 select-none">
            <div
                ref={knobRef}
                onPointerDown={handleDown}
                onPointerMove={handleMove}
                onPointerUp={handleUp}
                onPointerLeave={handleUp}
                role="slider"
                aria-valuemin={min}
                aria-valuemax={max}
                aria-valuenow={numeric}
                tabIndex={0}
                onKeyDown={(e) => {
                    if (e.key === "ArrowUp" || e.key === "ArrowRight") onChange(Math.min(max, numeric + step));
                    if (e.key === "ArrowDown" || e.key === "ArrowLeft") onChange(Math.max(min, numeric - step));
                }}
                className={`relative h-28 w-28 sm:h-32 sm:w-32 rounded-full cursor-grab active:cursor-grabbing touch-none shadow-inner outline-none ${error ? "ring-2 ring-rose-300" : ""
                    }`}
                style={{
                    background: `conic-gradient(#1A4D2E 0deg ${sweep}deg, #e2e8f0 ${sweep}deg 270deg, transparent 270deg 360deg)`,
                    transform: "rotate(135deg)",
                }}
            >
                <div
                    className="absolute inset-2 rounded-full bg-white shadow-sm flex flex-col items-center justify-center"
                    style={{ transform: "rotate(-135deg)" }}
                >
                    <Typography variant="small" weight="bold" color="text-slate-400" className="text-[9px] -mb-0.5">PRICE</Typography>
                    <Typography variant="h4" weight="extrabold">₹{numeric}</Typography>
                </div>
                <div
                    className="absolute left-1/2 top-1/2 h-2.5 w-2.5 -ml-1.5 -mt-1.5 rounded-full bg-[#1A4D2E] ring-2 ring-white"
                    style={{ transform: `rotate(${sweep}deg) translate(50px)` }}
                />
            </div>
            <Input
                type="number"
                value={value}
                onChange={(e) => onChange(Math.max(min, Math.min(max, Number(e.target.value) || 0)))}
                placeholder="Or type price"
                className={`!w-28 text-center !py-1.5 !px-2.5 !text-sm font-bold ${error ? "!border-rose-400" : ""}`}
            />
            <Typography variant="small" className="text-[10px]">Drag the dial or type a price</Typography>
        </div>
    );
}

export default function AddEditProduct() {
    const navigate = useNavigate();
    const { id } = useParams();
    const mode = id ? "edit" : "add";

    const profile = useAuthStore((state) => state.profile || state.user);

    const defaultTaxPercent = useMemo(() => {
        return Number(profile?.tax_settings?.gst_percentage ?? 0);
    }, [profile]);

    const {
        products: productList = [],
        addProduct,
        updateProduct,
        fetchDashboardProducts,
    } = useProductStore();

    const {
        categories: categoryList = [],
        fetchCategories,
        createCategory,
    } = useCategoryStore();

    const [isAddingCategory, setIsAddingCategory] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState("");
    const [newCategoryImage, setNewCategoryImage] = useState("");
    const [isSavingCategory, setIsSavingCategory] = useState(false);

    useEffect(() => {
        if (!productList.length) {
            fetchDashboardProducts().catch(() => { });
        }
        if (!categoryList.length) {
            fetchCategories?.().catch(() => { });
        }
    }, []);

    const existingProduct = useMemo(() => {
        if (mode !== "edit") return null;
        return productList.find((p) => String(p._id || p.id) === String(id)) || null;
    }, [mode, productList, id]);

    const [formData, setFormData] = useState(() => buildFormData(existingProduct, { defaultTax: defaultTaxPercent }));

    const [imagePreview, setImagePreview] = useState(() =>
        typeof formData.image === "string" ? formData.image : ""
    );
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState({});
    const [dirty, setDirty] = useState(false);
    const [usedTemplate, setUsedTemplate] = useState(false);
    const [showPreviewMobile, setShowPreviewMobile] = useState(false);
    const objectUrlRef = useRef(null);
    const topRef = useRef(null);

    const [step, setStep] = useState(0);

    const STEPS = useMemo(() => {
        const steps = [
            { key: "type", label: "Type", hint: "Single or Combo" },
        ];

        if (formData.combo) {
            steps.push({ key: "combo", label: "Combo", hint: "Bundle items" });
        }

        steps.push(
            { key: "basics", label: "Basics", hint: "Name, category & description" },
            { key: "pricing", label: "Price", hint: "What it costs" },
            { key: "extras", label: "Extras", hint: "Sizes & add-ons (optional)" },
            { key: "photo", label: "Photo", hint: "Image & final touches" }
        );

        return steps;
    }, [formData.combo]);

    const currentStepKey = STEPS[step]?.key;

    useEffect(() => {
        if (mode === "edit" && existingProduct) {
            const initial = buildFormData(existingProduct, { defaultTax: defaultTaxPercent });
            setFormData(initial);
            setImagePreview(typeof initial.image === "string" ? initial.image : "");
        } else if (mode === "add" && !dirty) {
            setFormData(prev => ({ ...prev, taxPercent: defaultTaxPercent }));
        }
    }, [existingProduct, defaultTaxPercent]);

    useEffect(() => {
        return () => {
            if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
        };
    }, []);

    useEffect(() => {
        const handler = (e) => {
            if (!dirty) return;
            e.preventDefault();
            e.returnValue = "";
        };
        window.addEventListener("beforeunload", handler);
        return () => window.removeEventListener("beforeunload", handler);
    }, [dirty]);

    const selectedCategory = useMemo(() => {
        return categoryList.find((c) => String(c._id) === String(formData.category_id)) || null;
    }, [categoryList, formData.category_id]);

    const comboEligibleProducts = useMemo(() => {
        return productList.filter(
            (p) =>
                !(p.combo ?? p.is_combo) &&
                String(p._id || p.id) !== String(formData._id || formData.id)
        );
    }, [productList, formData._id, formData.id]);

    const comboOriginalTotal = useMemo(() => {
        return formData.comboItems.reduce((sum, item) => {
            const matched = comboEligibleProducts.find(
                (p) => String(p._id || p.id) === String(item.product_id)
            );
            return sum + (matched?.price || 0) * (item.quantity || 1);
        }, 0);
    }, [formData.comboItems, comboEligibleProducts]);

    const generateSKU = (categoryName) => {
        const prefix = categoryName
            ? categoryName.replace(/[^A-Za-z]/g, "").substring(0, 3).toUpperCase()
            : "PRD";

        const count =
            productList.filter((item) => (item.sku || item.sku_code)?.startsWith(prefix)).length + 1;

        return `${prefix}-${String(count).padStart(3, "0")}`;
    };

    const markDirty = () => setDirty(true);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        markDirty();
        setErrors((prev) => ({ ...prev, [name]: undefined }));

        setFormData((prev) => {
            let updated = { ...prev, [name]: type === "checkbox" ? checked : value };

            if (name === "foodType") {
                updated.isVeg = value === "Veg";
            } else if (name === "isVeg") {
                updated.foodType = checked ? "Veg" : "Non-Veg";
            }

            if (name === "combo" && !checked) {
                updated.comboItems = [];
            }

            return updated;
        });
    };

    const setField = (name, value) => {
        markDirty();
        setErrors((prev) => ({ ...prev, [name]: undefined }));
        setFormData((prev) => {
            const updated = { ...prev, [name]: value };
            if (name === "foodType") updated.isVeg = value === "Veg";
            if (name === "combo" && !value) updated.comboItems = [];
            return updated;
        });
    };

    const handleNewCategoryImageUpload = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
            setErrors((prev) => ({ ...prev, category_id: "Image size must be under 2MB." }));
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setNewCategoryImage(reader.result);
            setErrors((prev) => ({ ...prev, category_id: undefined }));
        };
        reader.readAsDataURL(file);
    };

    const handleSaveCategory = async () => {
        if (!newCategoryName.trim()) {
            setErrors((prev) => ({ ...prev, category_id: "Category name cannot be empty." }));
            return;
        }
        try {
            setIsSavingCategory(true);
            setErrors((prev) => ({ ...prev, category_id: undefined }));

            const payload = { name: newCategoryName };
            if (newCategoryImage) {
                payload.image = newCategoryImage;
            }

            const newCat = await createCategory(payload);
            const newCatId = newCat?._id || newCat?.category?._id || newCat?.data?.category?._id;

            if (newCatId) {
                setField("category_id", newCatId);
                await fetchCategories();
            }

            setIsAddingCategory(false);
            setNewCategoryName("");
            setNewCategoryImage("");
            notifySuccess("Category created");
        } catch (error) {
            setErrors((prev) => ({ ...prev, category_id: "Failed to create category. Try again." }));
        } finally {
            setIsSavingCategory(false);
        }
    };

    const handleImageUpload = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            setErrors((prev) => ({ ...prev, image: "Image size must be under 5MB." }));
            return;
        }

        if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);

        const url = URL.createObjectURL(file);
        objectUrlRef.current = url;

        markDirty();
        setErrors((prev) => ({ ...prev, image: undefined }));
        setFormData((prev) => ({ ...prev, image: file }));
        setImagePreview(url);
    };

    const addVariant = () => {
        markDirty();
        setFormData((prev) => ({
            ...prev,
            variants: [...prev.variants, { id: Date.now(), name: "", price_delta: 0 }],
        }));
    };

    const updateVariant = (varId, field, value) => {
        markDirty();
        setFormData((prev) => {
            const target = prev.variants.find((v) => v.id === varId);
            const oldName = target?.name;

            const updatedVariants = prev.variants.map((v) =>
                v.id === varId ? { ...v, [field]: value } : v
            );

            let updatedAddons = prev.addons;
            if (field === "name" && oldName && oldName !== value) {
                updatedAddons = prev.addons.map((a) => ({
                    ...a,
                    applicable_variants: (a.applicable_variants || []).map((n) =>
                        n === oldName ? value : n
                    ),
                }));
            }

            return { ...prev, variants: updatedVariants, addons: updatedAddons };
        });
    };

    const removeVariant = (varId) => {
        markDirty();
        setFormData((prev) => {
            const target = prev.variants.find((v) => v.id === varId);
            const removedName = target?.name;

            const updatedVariants = prev.variants.filter((v) => v.id !== varId);
            const updatedAddons = prev.addons.map((a) => ({
                ...a,
                applicable_variants: (a.applicable_variants || []).filter(
                    (n) => n !== removedName
                ),
            }));

            return { ...prev, variants: updatedVariants, addons: updatedAddons };
        });
    };

    const addAddon = () => {
        markDirty();
        setFormData((prev) => ({
            ...prev,
            addons: [
                ...prev.addons,
                { id: Date.now(), name: "", description: "", price: "", applicable_variants: [] },
            ],
        }));
    };

    const updateAddon = (addonId, field, value) => {
        markDirty();
        setFormData((prev) => ({
            ...prev,
            addons: prev.addons.map((a) => (a.id === addonId ? { ...a, [field]: value } : a)),
        }));
    };

    const toggleAddonVariant = (addonId, variantName) => {
        markDirty();
        setFormData((prev) => ({
            ...prev,
            addons: prev.addons.map((a) => {
                if (a.id !== addonId) return a;
                const current = a.applicable_variants || [];
                const exists = current.includes(variantName);
                return {
                    ...a,
                    applicable_variants: exists
                        ? current.filter((n) => n !== variantName)
                        : [...current, variantName],
                };
            }),
        }));
    };

    const removeAddon = (addonId) => {
        markDirty();
        setFormData((prev) => ({
            ...prev,
            addons: prev.addons.filter((a) => a.id !== addonId),
        }));
    };

    const clearAddonVariants = (addonId) => {
        markDirty();
        setFormData((prev) => ({
            ...prev,
            addons: prev.addons.map((a) => (a.id === addonId ? { ...a, applicable_variants: [] } : a)),
        }));
    };

    const handleQuickAddSize = (sizeName) => {
        if (!formData.variants.some((v) => v.name.toLowerCase() === sizeName.toLowerCase())) {
            markDirty();
            setFormData((prev) => ({
                ...prev,
                variants: [...prev.variants, { id: Date.now() + Math.random(), name: sizeName, price_delta: "" }],
            }));
        }
    };

    const addComboItem = () => {
        markDirty();
        setFormData((prev) => ({
            ...prev,
            comboItems: [...prev.comboItems, { id: Date.now(), product_id: "", name: "", quantity: 1 }],
        }));
    };

    const updateComboItem = (itemId, field, value) => {
        markDirty();
        setFormData((prev) => ({
            ...prev,
            comboItems: prev.comboItems.map((c) => {
                if (c.id !== itemId) return c;
                if (field === "product_id") {
                    const matched = comboEligibleProducts.find((p) => String(p._id || p.id) === String(value));
                    return { ...c, product_id: value, name: matched?.name || "" };
                }
                return { ...c, [field]: value };
            }),
        }));
    };

    const removeComboItem = (itemId) => {
        markDirty();
        setFormData((prev) => ({
            ...prev,
            comboItems: prev.comboItems.filter((c) => c.id !== itemId),
        }));
    };

    const lastProduct = useMemo(() => {
        if (!productList.length) return null;
        return [...productList].sort((a, b) => {
            const aDate = new Date(a.createdAt || a.updatedAt || 0).getTime();
            const bDate = new Date(b.createdAt || b.updatedAt || 0).getTime();
            return bDate - aDate;
        })[0];
    }, [productList]);

    const handleUseTemplate = () => {
        if (!lastProduct) return;
        const templated = buildFormData(lastProduct, { keepIdentity: false });
        templated.id = Date.now();
        setFormData(templated);
        setImagePreview(typeof templated.image === "string" ? templated.image : "");
        setUsedTemplate(true);
        setDirty(true);
        setErrors({});
        setStep(0);
        topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    const handleReset = () => {
        if (objectUrlRef.current) {
            URL.revokeObjectURL(objectUrlRef.current);
            objectUrlRef.current = null;
        }
        const fresh = buildFormData(existingProduct, { defaultTax: defaultTaxPercent });
        setFormData(fresh);
        setImagePreview(typeof fresh.image === "string" ? fresh.image : "");
        setErrors({});
        setDirty(false);
        setUsedTemplate(false);
        setStep(0);
    };

    const handleBack = () => {
        if (dirty && !window.confirm("You have unsaved changes. Discard them and go back?")) {
            return;
        }
        navigate("/seller/products");
    };

    const validate = () => {
        const nextErrors = {};
        if (!formData.name?.trim()) nextErrors.name = "Product name is required.";
        if (!formData.category_id) nextErrors.category_id = "Category is required.";
        if (!formData.description?.trim()) nextErrors.description = "Description is required.";
        if (!formData.price || Number(formData.price) <= 0)
            nextErrors.price = "Enter a valid selling price.";

        if (formData.taxPercent !== "" && (Number(formData.taxPercent) < 0 || Number(formData.taxPercent) > 100)) {
            nextErrors.taxPercent = "Tax percent must be between 0 and 100.";
        }

        if (formData.combo) {
            const validComboItems = formData.comboItems.filter((c) => c.product_id);
            if (!validComboItems.length) {
                nextErrors.comboItems = "Add at least 1 item to the combo.";
            } else if (comboOriginalTotal > 0 && Number(formData.price) >= comboOriginalTotal) {
                nextErrors.price = `Combo price must be less than total of items (₹${comboOriginalTotal}).`;
            }
        }

        setErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    };

    const validateStep = (targetStepIndex) => {
        const nextErrors = {};
        const key = STEPS[targetStepIndex]?.key;

        if (key === "type") {
            // Default is always valid
        } else if (key === "combo") {
            const validComboItems = formData.comboItems.filter((c) => c.product_id);
            if (!validComboItems.length) {
                nextErrors.comboItems = "Add at least 1 item to the combo.";
            }
        } else if (key === "basics") {
            if (!formData.name?.trim()) nextErrors.name = "Product name is required.";
            if (!formData.category_id) nextErrors.category_id = "Category is required.";
            if (!formData.description?.trim()) nextErrors.description = "Description is required.";
        } else if (key === "pricing") {
            if (!formData.price || Number(formData.price) <= 0)
                nextErrors.price = "Enter a valid selling price.";
            if (formData.combo && comboOriginalTotal > 0 && Number(formData.price) >= comboOriginalTotal) {
                nextErrors.price = `Combo price must be less than total of items (₹${comboOriginalTotal}).`;
            }
        }

        setErrors((prev) => ({ ...prev, ...nextErrors }));
        return Object.keys(nextErrors).length === 0;
    };

    const goNext = () => {
        if (!validateStep(step)) return;
        setStep((s) => Math.min(STEPS.length - 1, s + 1));
        topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    const goPrev = () => {
        setStep((s) => Math.max(0, s - 1));
        topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    const handleFormKeyDown = (e) => {
        if (e.key !== "Enter") return;
        if (e.target.tagName === "TEXTAREA" || isAddingCategory) return;
        e.preventDefault();
        if (!isLastStep) goNext();
    };

    const getStepIndex = (keyToFind) => STEPS.findIndex(s => s.key === keyToFind);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (saving) return;

        if (!validate()) {
            if (errors.comboItems) {
                setStep(getStepIndex("combo"));
            } else if (!formData.name?.trim() || !formData.category_id || !formData.description?.trim()) {
                setStep(getStepIndex("basics"));
            } else if (!formData.price || Number(formData.price) <= 0 || errors.price) {
                setStep(getStepIndex("pricing"));
            } else {
                setStep(getStepIndex("type"));
            }
            topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
            return;
        }

        const cleanedVariants = formData.variants
            .filter((v) => v.name?.trim())
            .map((v) => ({ name: v.name.trim(), price_delta: Number(v.price_delta) || 0 }));

        const validVariantNames = new Set(cleanedVariants.map((v) => v.name));

        const cleanedAddons = formData.addons
            .filter((a) => a.name?.trim() && a.price !== "" && a.price !== null)
            .map((a) => ({
                name: a.name.trim(),
                description: a.description || "",
                price: Number(a.price) || 0,
                applicable_variants: (a.applicable_variants || []).filter((n) =>
                    validVariantNames.has(n)
                ),
            }));

        const cleanedComboItems = formData.combo
            ? formData.comboItems
                .filter((c) => c.product_id)
                .map((c) => ({ product_id: c.product_id, quantity: Number(c.quantity) || 1 }))
            : [];

        const finalSku =
            mode === "edit" && formData.sku ? formData.sku : generateSKU(selectedCategory?.name);

        const productData = {
            ...formData,
            sku: finalSku,
            sku_code: finalSku,
            skuNumber: finalSku,
            price: Number(formData.price),
            rating: Number(formData.rating) || 4.5,
            isVeg: formData.foodType === "Veg",
            variants: cleanedVariants,
            addons: cleanedAddons,
        };

        setSaving(true);
        try {
            const fd = new FormData();
            fd.append("name", productData.name);
            fd.append("description", productData.description || "");
            fd.append("category_id", productData.category_id);

            const selectedCatObj = categoryList.find(c => String(c._id) === String(productData.category_id));
            if (selectedCatObj) {
                fd.append("category", selectedCatObj.name);
            }

            fd.append("price", Number(productData.price));
            fd.append("stock", Number(productData.stock || 0));
            fd.append("is_available", productData.available);
            fd.append("available", productData.available);
            fd.append("is_featured", productData.featured || false);
            fd.append("is_combo", productData.combo || false);
            fd.append("combo_items", JSON.stringify(cleanedComboItems));
            fd.append("tax_percent", Number(productData.taxPercent) || 0);
            fd.append("delivery", productData.delivery || true);

            if (productData.sku) {
                fd.append("sku", productData.sku);
                fd.append("sku_code", productData.sku);
            }

            fd.append("isVeg", productData.isVeg ?? true);
            fd.append("is_veg", productData.isVeg ?? true);
            fd.append("foodType", productData.foodType || (productData.isVeg ? "Veg" : "Non-Veg"));
            fd.append("rating", productData.rating ?? 4.5);
            fd.append("variants", JSON.stringify(productData.variants));
            fd.append("addons", JSON.stringify(productData.addons));

            if (productData.image instanceof File) {
                fd.append("image", productData.image);
            }

            if (mode === "add") {
                await addProduct(fd);
            } else {
                await updateProduct(productData._id || productData.id, fd);
            }

            setDirty(false);
            notifySuccess(mode === "add" ? "Product added" : "Product updated");
            navigate("/seller/products");
        } catch (err) {
            setErrors((prev) => ({
                ...prev,
                form: err.response?.data?.message || "Unable to save product. Please try again.",
            }));
            topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        } finally {
            setSaving(false);
        }
    };

    const isLastStep = step === STEPS.length - 1;

    const namedVariants = formData.variants.filter((v) => v.name?.trim());

    const fillStatus = {
        type: true,
        combo: formData.comboItems.filter(c => c.product_id).length > 0,
        name: !!formData.name?.trim(),
        category: !!formData.category_id,
        description: !!formData.description?.trim(),
        price: !!formData.price && Number(formData.price) > 0,
        variants: formData.variants.length > 0,
        addons: formData.addons.length > 0,
        image: !!imagePreview,
    };

    const previewGroups = [
        {
            stepIndex: getStepIndex("type"),
            label: "Type",
            items: [
                { key: "type", label: formData.combo ? "Combo Meal" : "Single Product", done: true },
            ],
        },
        ...(formData.combo ? [{
            stepIndex: getStepIndex("combo"),
            label: "Combo Elements",
            items: [
                { key: "comboItems", label: fillStatus.combo ? `${formData.comboItems.filter(c => c.product_id).length} items added` : "No items selected", done: fillStatus.combo },
            ],
        }] : []),
        {
            stepIndex: getStepIndex("basics"),
            label: "Basics",
            items: [
                { key: "name", label: formData.name?.trim() || "Product name", done: fillStatus.name },
                { key: "category", label: selectedCategory?.name || "Category", done: fillStatus.category },
                { key: "description", label: fillStatus.description ? "Description added" : "Description", done: fillStatus.description },
            ],
        },
        {
            stepIndex: getStepIndex("pricing"),
            label: "Price",
            items: [
                { key: "price", label: fillStatus.price ? `₹${formData.price}` : "Selling price", done: fillStatus.price },
            ],
        },
        {
            stepIndex: getStepIndex("extras"),
            label: "Extras",
            items: [
                {
                    key: "variants",
                    label: fillStatus.variants ? `${formData.variants.length} size(s) added` : "Sizes (optional)",
                    done: fillStatus.variants,
                    optional: true,
                },
                {
                    key: "addons",
                    label: fillStatus.addons ? `${formData.addons.length} add-on(s) added` : "Add-ons (optional)",
                    done: fillStatus.addons,
                    optional: true,
                },
            ],
        },
        {
            stepIndex: getStepIndex("photo"),
            label: "Photo",
            items: [{ key: "image", label: fillStatus.image ? "Photo added" : "Product photo", done: fillStatus.image, optional: true }],
        },
    ];

    const PreviewPanel = (
        <Card padding="p-4" className="space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <Eye size={16} className="text-[#1A4D2E]" />
                <Typography variant="h6" className="text-sm">Live Preview</Typography>
            </div>

            <div className="overflow-hidden rounded-xl border border-slate-200">
                <div className="h-28 w-full bg-slate-100">
                    {imagePreview ? (
                        <img src={imagePreview} alt="preview" className="h-full w-full object-cover" />
                    ) : (
                        <div className="flex h-full items-center justify-center text-slate-300">
                            <UploadCloud size={22} />
                        </div>
                    )}
                </div>
                <div className="p-2.5">
                    <Typography variant="h6" className="text-xs truncate">
                        {formData.name?.trim() || "Your product name"}
                    </Typography>
                    <div className="mt-1 flex items-center justify-between">
                        <Typography variant="small" className="text-[10px]">{selectedCategory?.name || "Category"}</Typography>
                        <Typography variant="small" weight="bold" color="text-[#1A4D2E]" className="text-xs">
                            {fillStatus.price ? `₹${formData.price}` : "₹--"}
                        </Typography>
                    </div>
                    {Number(formData.taxPercent) > 0 && (
                        <Typography variant="small" className="mt-1 text-[10px]">+{formData.taxPercent}% tax</Typography>
                    )}
                    {formData.combo && (
                        <Typography variant="small" weight="bold" color="text-amber-600" className="mt-1 text-[10px]">Combo Meal</Typography>
                    )}
                    {formData.featured && (
                        <Typography variant="small" weight="bold" color="text-[#1A4D2E]" className="mt-1 text-[10px]">Featured</Typography>
                    )}
                </div>
            </div>

            <div className="space-y-3">
                {previewGroups.map((group) => (
                    <div key={group.label}>
                        <button
                            type="button"
                            onClick={() => setStep(group.stepIndex)}
                            className={`mb-1.5 text-[10px] font-bold uppercase tracking-wide cursor-pointer hover:underline ${step === group.stepIndex ? "text-[#1A4D2E]" : "text-slate-400"
                                }`}
                        >
                            {group.label}
                        </button>
                        <div className="space-y-1">
                            {group.items.map((item) => (
                                <div
                                    key={item.key}
                                    className={`flex items-center gap-2 text-xs ${item.done ? "text-slate-700" : "text-slate-400"
                                        }`}
                                >
                                    {item.done ? (
                                        <CheckCircle2 size={14} className="shrink-0 text-[#1A4D2E]" />
                                    ) : (
                                        <Circle size={14} className="shrink-0 text-slate-300" />
                                    )}
                                    <span className="truncate">{item.label}</span>
                                    {item.optional && !item.done && (
                                        <span className="ml-auto shrink-0 text-[9px] text-slate-300">optional</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {usedTemplate && (
                <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-[10px] font-semibold text-[#1A4D2E]">
                    Filled from your last product. Complete the grey items above, then save as a new item.
                </div>
            )}
        </Card>
    );

    return (
        <div className="w-full font-sans" ref={topRef}>
            <div className="sticky top-0 z-30 -mx-4 mb-4 border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                        <Button
                            variant="outline"
                            onClick={handleBack}
                            className="!w-9 !h-9 !p-0 !border-slate-200 !text-slate-500 hover:!bg-slate-100 hover:!text-slate-800"
                        >
                            <ArrowLeft size={18} />
                        </Button>
                        <div className="min-w-0">
                            <Typography variant="h4" className="text-lg sm:text-xl truncate">
                                {mode === "add" ? "Add Product" : "Edit Product"}
                            </Typography>
                            <Typography variant="small" className="text-[11px] sm:text-xs truncate">
                                {mode === "add" ? "Just a few quick steps and you're done." : `Editing "${existingProduct?.name || "product"}"`}
                            </Typography>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {mode === "add" && lastProduct && (
                            <Button
                                variant="outline"
                                onClick={handleUseTemplate}
                                title="Prefill this form using your last added product"
                                className="hidden sm:flex !h-9 !px-3 !text-xs !bg-emerald-50 !border-emerald-200 !text-[#1A4D2E] hover:!bg-emerald-100"
                            >
                                <Copy size={14} /> Duplicate Last Product
                            </Button>
                        )}
                        <Button
                            variant="outline"
                            onClick={handleReset}
                            disabled={saving}
                            className="hidden sm:flex !h-9 !px-3.5 !text-xs !bg-slate-50 !border-slate-200 !text-slate-600 hover:!bg-slate-100"
                        >
                            Reset
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => setShowPreviewMobile((v) => !v)}
                            className="flex lg:hidden !h-9 !px-3 !text-xs !border-slate-200 !text-slate-600 !bg-white"
                        >
                            <Eye size={14} /> Preview
                        </Button>
                    </div>
                </div>

                <div className="mt-3">
                    <div className="flex items-center overflow-x-auto hide-scrollbar pb-1">
                        {STEPS.map((s, i) => {
                            const isDone = i < step;
                            const isActive = i === step;
                            return (
                                <div key={s.key} className="flex flex-1 items-center last:flex-none min-w-[50px]">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (i <= step) setStep(i);
                                            else if (validateStep(step)) setStep(i);
                                        }}
                                        className="flex flex-col items-center gap-1 shrink-0 cursor-pointer group"
                                    >
                                        <div
                                            className={`flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full text-[11px] font-bold border-2 transition ${isDone
                                                ? "border-[#1A4D2E] bg-[#1A4D2E] text-white"
                                                : isActive
                                                    ? "border-[#1A4D2E] bg-emerald-50 text-[#1A4D2E] ring-4 ring-emerald-100"
                                                    : "border-slate-200 bg-white text-slate-400 group-hover:border-slate-300"
                                                }`}
                                        >
                                            {isDone ? <Check size={14} /> : i + 1}
                                        </div>
                                        <span
                                            className={`text-[9px] sm:text-[10px] font-bold whitespace-nowrap ${isActive ? "text-[#1A4D2E]" : isDone ? "text-slate-600" : "text-slate-400"
                                                }`}
                                        >
                                            {s.label}
                                        </span>
                                    </button>
                                    {i < STEPS.length - 1 && (
                                        <div className={`mx-1.5 sm:mx-2 h-1 flex-1 rounded-full transition ${i < step ? "bg-[#1A4D2E]" : "bg-slate-200"}`} />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {errors.form && (
                    <div className="mt-3 flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2 text-xs font-semibold text-rose-600">
                        <AlertCircle size={14} />
                        {errors.form}
                    </div>
                )}
            </div>

            {showPreviewMobile && <div className="mb-4 px-4 sm:px-6 lg:hidden">{PreviewPanel}</div>}

            <div className="px-4 sm:px-6 pb-28 lg:pb-10">
                <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1fr_320px] lg:items-start">
                    <div id="product-form" onKeyDown={handleFormKeyDown} className="min-w-0 space-y-4">
                        <div className="flex gap-2 sm:hidden">
                            {mode === "add" && lastProduct && (
                                <Button
                                    variant="outline"
                                    onClick={handleUseTemplate}
                                    className="flex-1 !h-9 !px-3 !text-xs !bg-emerald-50 !border-emerald-200 !text-[#1A4D2E]"
                                >
                                    <Copy size={14} /> Duplicate Last
                                </Button>
                            )}
                            <Button
                                variant="outline"
                                onClick={handleReset}
                                className="flex-1 !h-9 !px-3.5 !text-xs !bg-slate-50 !border-slate-200 !text-slate-600"
                            >
                                Reset
                            </Button>
                        </div>

                        {currentStepKey === "type" && (
                            <Card padding="p-4 sm:p-5" className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-[#1A4D2E]">
                                        <PackageSearch size={18} />
                                    </div>
                                    <div>
                                        <Typography variant="h5" className="text-base">What are you creating?</Typography>
                                        <Typography variant="small" className="text-[11px]">Choose the type of product.</Typography>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                                    <button
                                        type="button"
                                        onClick={() => setField("combo", false)}
                                        className={`flex flex-col items-start gap-2 p-4 rounded-xl border-2 transition text-left cursor-pointer ${!formData.combo
                                            ? "border-[#1A4D2E] bg-emerald-50/50"
                                            : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                                            }`}
                                    >
                                        <div className="flex items-center justify-between w-full">
                                            <span className={`font-bold ${!formData.combo ? "text-[#1A4D2E]" : "text-slate-700"}`}>Single Product</span>
                                            <span className={`flex h-4 w-4 items-center justify-center rounded-full border-2 ${!formData.combo ? "border-[#1A4D2E]" : "border-slate-300"}`}>
                                                {!formData.combo && <span className="h-2 w-2 rounded-full bg-[#1A4D2E]" />}
                                            </span>
                                        </div>
                                        <Typography variant="small" className="text-[11px] font-medium">A standard menu item like a burger, pizza, or beverage.</Typography>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setField("combo", true)}
                                        className={`flex flex-col items-start gap-2 p-4 rounded-xl border-2 transition text-left cursor-pointer ${formData.combo
                                            ? "border-[#1A4D2E] bg-emerald-50/50"
                                            : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                                            }`}
                                    >
                                        <div className="flex items-center justify-between w-full">
                                            <span className={`font-bold ${formData.combo ? "text-[#1A4D2E]" : "text-slate-700"}`}>Combo Meal</span>
                                            <span className={`flex h-4 w-4 items-center justify-center rounded-full border-2 ${formData.combo ? "border-[#1A4D2E]" : "border-slate-300"}`}>
                                                {formData.combo && <span className="h-2 w-2 rounded-full bg-[#1A4D2E]" />}
                                            </span>
                                        </div>
                                        <Typography variant="small" className="text-[11px] font-medium">A bundle of existing items sold together at a set price.</Typography>
                                    </button>
                                </div>
                            </Card>
                        )}

                        {currentStepKey === "combo" && (
                            <Card padding="p-4 sm:p-5" className="!border-amber-200 !bg-amber-50/40 space-y-4">
                                <h3 className="text-base font-bold text-slate-900 border-b border-amber-200 pb-3 flex items-center gap-2">
                                    <PackageSearch size={18} className="text-amber-600" /> Build your Combo
                                </h3>

                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <Typography variant="small" weight="bold" color="text-amber-700" className="text-xs">
                                            Items in this Combo
                                        </Typography>
                                        <Button
                                            variant="outline"
                                            onClick={addComboItem}
                                            className="!h-8 !px-2.5 !text-xs !border-amber-300 !bg-white !text-amber-700 hover:!bg-amber-100"
                                        >
                                            + Add Item
                                        </Button>
                                    </div>

                                    {formData.comboItems.length === 0 ? (
                                        <button
                                            type="button"
                                            onClick={addComboItem}
                                            className="w-full py-6 text-xs font-semibold text-amber-600 border-2 border-dashed border-amber-300 bg-white rounded-xl hover:bg-amber-100/50 transition cursor-pointer"
                                        >
                                            + Select products to include in this combo
                                        </button>
                                    ) : (
                                        <div className="space-y-2">
                                            {formData.comboItems.map((item) => (
                                                <div key={item.id} className="flex items-center gap-2 rounded-xl border border-amber-200 bg-white p-2.5">
                                                    <select
                                                        value={item.product_id}
                                                        onChange={(e) => updateComboItem(item.id, "product_id", e.target.value)}
                                                        className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#1A4D2E]"
                                                    >
                                                        <option value="">Select product...</option>
                                                        {comboEligibleProducts.map((p) => (
                                                            <option key={p._id || p.id} value={p._id || p.id}>
                                                                {p.name} (₹{p.price})
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <Input
                                                        type="number"
                                                        min="1"
                                                        value={item.quantity}
                                                        onChange={(e) => updateComboItem(item.id, "quantity", Number(e.target.value) || 1)}
                                                        className="!w-20 !py-2 !pl-8 !pr-2 !text-sm"
                                                        leftIcon={<span className="text-xs text-slate-400">Qty</span>}
                                                    />
                                                    <Button
                                                        variant="outline"
                                                        onClick={() => removeComboItem(item.id)}
                                                        className="!w-9 !h-9 !p-0 !border-transparent !text-rose-500 hover:!bg-rose-50"
                                                    >
                                                        <Trash2 size={18} />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {comboOriginalTotal > 0 && (
                                        <div className="pt-2">
                                            <Typography variant="small" weight="semibold" color="text-amber-700" className="bg-amber-100/50 p-2 rounded-lg text-[11px]">
                                                Total value of items: ₹{comboOriginalTotal}. You will set the final combo price in the next steps.
                                            </Typography>
                                        </div>
                                    )}

                                    {errors.comboItems && (
                                        <Typography variant="small" weight="semibold" color="text-rose-500" className="text-[11px]">{errors.comboItems}</Typography>
                                    )}
                                </div>
                            </Card>
                        )}

                        {currentStepKey === "basics" && (
                            <Card padding="p-4 sm:p-5" className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-[#1A4D2E]">
                                        <Sparkles size={18} />
                                    </div>
                                    <div>
                                        <Typography variant="h5" className="text-base">What are you selling?</Typography>
                                        <Typography variant="small" className="text-[11px]">Name, category and a short description.</Typography>
                                    </div>
                                </div>

                                <Input
                                    label="Product Name"
                                    required
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    error={errors.name}
                                    placeholder={formData.combo ? "e.g. Family Saver Combo" : "e.g. Cheese Burger / Paneer Tikka"}
                                    autoFocus
                                    className="!py-3 !text-sm sm:!text-base"
                                />

                                <div>
                                    <div className="flex items-center justify-between mb-1.5">
                                        <label className="block text-xs font-bold text-slate-700 uppercase">Category <span className="ml-1 text-red-500">*</span></label>
                                        {!isAddingCategory && (
                                            <button
                                                type="button"
                                                onClick={() => setIsAddingCategory(true)}
                                                className="text-[10px] font-bold text-[#1A4D2E] hover:underline flex items-center gap-1 transition"
                                            >
                                                <Plus size={12} strokeWidth={3} /> Add New
                                            </button>
                                        )}
                                    </div>

                                    {isAddingCategory ? (
                                        <div className="flex flex-col gap-2">
                                            <div className="flex items-center gap-2">
                                                <label className="flex items-center justify-center h-11 w-11 sm:h-12 sm:w-12 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100 transition shrink-0 cursor-pointer overflow-hidden relative" title="Upload Category Image">
                                                    {newCategoryImage ? (
                                                        <img src={newCategoryImage} alt="Preview" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <ImagePlus size={18} strokeWidth={2} />
                                                    )}
                                                    <input type="file" accept="image/*" hidden onChange={handleNewCategoryImageUpload} />
                                                </label>
                                                <div className="flex-1">
                                                    <Input
                                                        type="text"
                                                        placeholder="New Category Name..."
                                                        value={newCategoryName}
                                                        onChange={(e) => setNewCategoryName(e.target.value)}
                                                        onKeyDown={(e) => {
                                                            if (e.key === "Enter") {
                                                                e.preventDefault();
                                                                handleSaveCategory();
                                                            }
                                                        }}
                                                        autoFocus
                                                    />
                                                </div>
                                                <Button
                                                    variant="primary"
                                                    onClick={handleSaveCategory}
                                                    disabled={isSavingCategory}
                                                    className="!w-11 !h-11 sm:!w-12 sm:!h-12 !p-0 shrink-0"
                                                >
                                                    {isSavingCategory ? <Loader2 size={16} className="animate-spin" /> : <Check size={18} strokeWidth={3} />}
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    onClick={() => {
                                                        setIsAddingCategory(false);
                                                        setNewCategoryName("");
                                                        setNewCategoryImage("");
                                                        setErrors((prev) => ({ ...prev, category_id: undefined }));
                                                    }}
                                                    className="!w-11 !h-11 sm:!w-12 sm:!h-12 !p-0 shrink-0 !bg-slate-50 !border-slate-200 !text-slate-500 hover:!bg-slate-100"
                                                >
                                                    <X size={18} strokeWidth={2.5} />
                                                </Button>
                                            </div>
                                            {newCategoryImage && (
                                                <Typography variant="small" className="text-[10px]">Category image attached. Click the image icon to change.</Typography>
                                            )}
                                        </div>
                                    ) : categoryList.length === 0 ? (
                                        <div className="rounded-xl border border-dashed border-amber-300 bg-amber-50 px-3.5 py-3 text-xs font-semibold text-amber-700 flex justify-between items-center">
                                            <span>No categories yet.</span>
                                            <button
                                                onClick={() => setIsAddingCategory(true)}
                                                className="underline hover:text-amber-900 cursor-pointer"
                                            >
                                                Create one now
                                            </button>
                                        </div>
                                    ) : (
                                        <select
                                            name="category_id"
                                            value={formData.category_id}
                                            onChange={handleChange}
                                            className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-200 ${errors.category_id ? "border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-100" : "border-slate-300 focus:border-[#1A4D2E] focus:ring-4 focus:ring-[#1A4D2E]/10"}`}
                                        >
                                            <option value="">Select a category</option>
                                            {categoryList.map((cat) => (
                                                <option key={cat._id} value={cat._id}>
                                                    {cat.name}
                                                </option>
                                            ))}
                                        </select>
                                    )}
                                    {errors.category_id && <p className="mt-2 text-sm text-red-600">{errors.category_id}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Dietary Type <span className="ml-1 text-red-500">*</span></label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setField("foodType", "Veg")}
                                            className={`flex items-center justify-center gap-2 rounded-xl border-2 py-3 text-sm font-bold transition cursor-pointer ${formData.foodType === "Veg"
                                                ? "border-emerald-600 bg-emerald-50 text-emerald-700"
                                                : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"
                                                }`}
                                        >
                                            <span className="flex h-4 w-4 items-center justify-center rounded-full border-2 border-emerald-600">
                                                {formData.foodType === "Veg" && <span className="h-2 w-2 rounded-full bg-emerald-600" />}
                                            </span>
                                            <Leaf size={16} /> Veg
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setField("foodType", "Non-Veg")}
                                            className={`flex items-center justify-center gap-2 rounded-xl border-2 py-3 text-sm font-bold transition cursor-pointer ${formData.foodType === "Non-Veg"
                                                ? "border-rose-600 bg-rose-50 text-rose-700"
                                                : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"
                                                }`}
                                        >
                                            <span className="flex h-4 w-4 items-center justify-center rounded-full border-2 border-rose-600">
                                                {formData.foodType === "Non-Veg" && <span className="h-2 w-2 rounded-full bg-rose-600" />}
                                            </span>
                                            <Drumstick size={16} /> Non-Veg
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Description <span className="ml-1 text-red-500">*</span></label>
                                    <textarea
                                        rows={3}
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        placeholder="Write ingredients or dish taste profile..."
                                        className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-200 resize-none ${errors.description ? "border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-100" : "border-slate-300 focus:border-[#1A4D2E] focus:ring-4 focus:ring-[#1A4D2E]/10"
                                            }`}
                                    />
                                    {errors.description && (
                                        <p className="mt-2 text-sm text-red-600">{errors.description}</p>
                                    )}
                                </div>
                            </Card>
                        )}

                        {currentStepKey === "pricing" && (
                            <Card padding="p-4 sm:p-5" className="space-y-5">
                                <div className="flex items-center gap-2">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-[#1A4D2E]">
                                        <span className="text-base font-bold">₹</span>
                                    </div>
                                    <div>
                                        <Typography variant="h5" className="text-base">What's the price?</Typography>
                                        <Typography variant="small" className="text-[11px]">Turn the dial or type it directly.</Typography>
                                    </div>
                                </div>

                                <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-around">
                                    <PriceDial
                                        value={Number(formData.price) || 0}
                                        onChange={(v) => setField("price", v)}
                                        error={!!errors.price}
                                    />

                                    <div className="w-full sm:w-40">
                                        <Input
                                            type="number"
                                            step="0.1"
                                            min="1"
                                            max="5"
                                            name="rating"
                                            label={<span className="flex items-center gap-1"><Star size={14} className="text-amber-500 fill-amber-500" /> Rating (1 - 5)</span>}
                                            value={formData.rating}
                                            onChange={handleChange}
                                            placeholder="4.5"
                                            className="font-semibold"
                                        />
                                    </div>
                                </div>
                                {errors.price && (
                                    <Typography variant="small" weight="semibold" color="text-rose-500" align="text-center" className="text-[11px]">{errors.price}</Typography>
                                )}

                                <div className="border-t border-slate-100 pt-4">
                                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5 flex items-center justify-between gap-1">
                                        <span className="flex items-center gap-1">
                                            <Percent size={14} className="text-slate-400" />
                                            Tax Percent (optional)
                                        </span>
                                        {defaultTaxPercent > 0 && Number(formData.taxPercent) === defaultTaxPercent && (
                                            <span className="text-[9px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">Store Default</span>
                                        )}
                                    </label>
                                    <div className="w-full sm:w-40">
                                        <Input
                                            type="number"
                                            min="0"
                                            max="100"
                                            step="0.5"
                                            name="taxPercent"
                                            value={formData.taxPercent}
                                            onChange={handleChange}
                                            placeholder="0"
                                            rightIcon={<span className="text-xs">%</span>}
                                            error={errors.taxPercent}
                                            className="font-semibold"
                                        />
                                    </div>
                                    <Typography variant="small" className="mt-1 text-[10px]">
                                        Applied on top of the selling price at checkout.
                                    </Typography>
                                </div>
                            </Card>
                        )}

                        {currentStepKey === "extras" && (
                            <div className="space-y-6">
                                <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50/70 p-4">
                                    <Info size={18} className="shrink-0 text-emerald-600 mt-0.5" />
                                    <div>
                                        <Typography variant="h6" className="text-sm text-emerald-900">Customize your product</Typography>
                                        <Typography variant="small" className="text-xs text-emerald-700 mt-1">
                                            Totally optional. Skip this step if your item has standard pricing. Use this to add <b>Sizes</b> (like Half/Full) or <b>Extras</b> (like Extra Cheese).
                                        </Typography>
                                    </div>
                                </div>

                                <Card padding="p-0" className="overflow-hidden">
                                    <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                                        <div>
                                            <Typography variant="h5" className="text-base flex items-center gap-2">
                                                <Box size={18} className="text-[#1A4D2E]" /> Product Sizes
                                            </Typography>
                                            <Typography variant="small" className="text-[11px] mt-1">Offer different portions for this item.</Typography>
                                        </div>
                                    </div>

                                    <div className="p-4 sm:p-5 space-y-4">
                                        {formData.variants.length === 0 && (
                                            <div className="flex flex-wrap items-center gap-2 mb-4">
                                                <span className="text-[10px] font-bold uppercase text-slate-400">Quick Add:</span>
                                                {["Regular", "Medium", "Large", "Half", "Full"].map(size => (
                                                    <Button
                                                        key={size}
                                                        variant="outline"
                                                        onClick={() => handleQuickAddSize(size)}
                                                        className="!h-7 !px-3 !py-1.5 !text-xs !bg-slate-50 !border-slate-200 !text-slate-600 hover:!border-[#1A4D2E] hover:!text-[#1A4D2E]"
                                                    >
                                                        + {size}
                                                    </Button>
                                                ))}
                                            </div>
                                        )}

                                        <div className="space-y-3">
                                            {formData.variants.map((variant) => (
                                                <div key={variant.id} className="flex items-end gap-3 rounded-xl border border-slate-200 p-3 bg-slate-50/50">
                                                    <div className="flex-1">
                                                        <Input
                                                            label={<span className="text-[10px] uppercase">Size Name</span>}
                                                            type="text"
                                                            placeholder="e.g. Medium"
                                                            value={variant.name}
                                                            onChange={(e) => updateVariant(variant.id, "name", e.target.value)}
                                                            className="!py-2 !text-sm"
                                                        />
                                                    </div>
                                                    <div className="w-28 sm:w-32">
                                                        <Input
                                                            label={<span className="text-[10px] uppercase">Price (+₹)</span>}
                                                            type="number"
                                                            placeholder="0"
                                                            value={variant.price_delta}
                                                            onChange={(e) => updateVariant(variant.id, "price_delta", e.target.value)}
                                                            leftIcon={<span className="text-sm">₹</span>}
                                                            className="!py-2 !text-sm"
                                                        />
                                                    </div>
                                                    <Button
                                                        variant="outline"
                                                        onClick={() => removeVariant(variant.id)}
                                                        className="!w-[42px] !h-[42px] !p-0 !border-rose-100 !bg-rose-50 !text-rose-500 hover:!bg-rose-100 hover:!text-rose-600 shrink-0"
                                                    >
                                                        <Trash2 size={16} />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>

                                        <Button
                                            variant="outline"
                                            onClick={addVariant}
                                            className="w-full justify-center mt-2 !py-3 !border-dashed !border-[#1A4D2E]/30 !bg-emerald-50/30 !text-[#1A4D2E] hover:!bg-emerald-50"
                                        >
                                            <PlusCircle size={16} /> Add {formData.variants.length > 0 ? "Another Size" : "a Size"}
                                        </Button>
                                    </div>
                                </Card>

                                <Card padding="p-0" className="overflow-hidden">
                                    <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                                        <div>
                                            <Typography variant="h5" className="text-base flex items-center gap-2">
                                                <PlusCircle size={18} className="text-blue-600" /> Extras & Add-ons
                                            </Typography>
                                            <Typography variant="small" className="text-[11px] mt-1">Offer toppings, dips, or extra items.</Typography>
                                        </div>
                                    </div>

                                    <div className="p-4 sm:p-5 space-y-4">
                                        <div className="space-y-4">
                                            {formData.addons.map((addon) => {
                                                const tagged = addon.applicable_variants || [];
                                                return (
                                                    <div key={addon.id} className="rounded-xl border border-slate-200 bg-slate-50/50 p-3 sm:p-4">
                                                        <div className="flex items-end gap-3">
                                                            <div className="flex-1">
                                                                <Input
                                                                    label={<span className="text-[10px] uppercase">Add-on Name</span>}
                                                                    type="text"
                                                                    placeholder="e.g. Extra Cheese"
                                                                    value={addon.name}
                                                                    onChange={(e) => updateAddon(addon.id, "name", e.target.value)}
                                                                    className="!py-2 !text-sm"
                                                                />
                                                            </div>
                                                            <div className="w-28 sm:w-32">
                                                                <Input
                                                                    label={<span className="text-[10px] uppercase">Price (+₹)</span>}
                                                                    type="number"
                                                                    placeholder="0"
                                                                    value={addon.price}
                                                                    onChange={(e) => updateAddon(addon.id, "price", e.target.value === "" ? "" : Number(e.target.value))}
                                                                    leftIcon={<span className="text-sm">₹</span>}
                                                                    className="!py-2 !text-sm"
                                                                />
                                                            </div>
                                                            <Button
                                                                variant="outline"
                                                                onClick={() => removeAddon(addon.id)}
                                                                className="!w-[42px] !h-[42px] !p-0 !border-rose-100 !bg-rose-50 !text-rose-500 hover:!bg-rose-100 hover:!text-rose-600 shrink-0"
                                                            >
                                                                <Trash2 size={16} />
                                                            </Button>
                                                        </div>

                                                        {namedVariants.length > 0 && (
                                                            <div className="mt-4 pt-4 border-t border-slate-200">
                                                                <label className="text-[10px] font-bold text-slate-500 uppercase mb-2.5 block">
                                                                    Available for which sizes?
                                                                </label>
                                                                <div className="flex flex-wrap items-center gap-3">
                                                                    <label className="flex items-center gap-1.5 cursor-pointer text-xs font-semibold text-slate-700 hover:text-blue-600 transition">
                                                                        <input
                                                                            type="checkbox"
                                                                            checked={tagged.length === 0}
                                                                            onChange={() => clearAddonVariants(addon.id)}
                                                                            className="h-4 w-4 rounded border-slate-300 accent-blue-600 cursor-pointer"
                                                                        />
                                                                        All Sizes
                                                                    </label>
                                                                    <div className="h-4 w-px bg-slate-300 mx-1"></div>
                                                                    {namedVariants.map((v) => (
                                                                        <label key={v.id} className="flex items-center gap-1.5 cursor-pointer text-xs font-medium text-slate-600 hover:text-blue-600 transition">
                                                                            <input
                                                                                type="checkbox"
                                                                                checked={tagged.includes(v.name)}
                                                                                onChange={() => {
                                                                                    if (tagged.length === 0 && !tagged.includes(v.name)) {
                                                                                        markDirty();
                                                                                        setFormData(prev => ({
                                                                                            ...prev,
                                                                                            addons: prev.addons.map(a => a.id === addon.id ? { ...a, applicable_variants: [v.name] } : a)
                                                                                        }));
                                                                                    } else {
                                                                                        toggleAddonVariant(addon.id, v.name);
                                                                                    }
                                                                                }}
                                                                                className="h-4 w-4 rounded border-slate-300 accent-blue-600 cursor-pointer"
                                                                            />
                                                                            {v.name}
                                                                        </label>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        <Button
                                            variant="outline"
                                            onClick={addAddon}
                                            className="w-full justify-center mt-2 !py-3 !border-dashed !border-blue-500/30 !bg-blue-50/30 !text-blue-600 hover:!bg-blue-50"
                                        >
                                            <PlusCircle size={16} /> Add {formData.addons.length > 0 ? "Another Extra" : "an Extra (e.g. Cheese)"}
                                        </Button>
                                    </div>
                                </Card>
                            </div>
                        )}

                        {currentStepKey === "photo" && (
                            <div className="space-y-4">
                                <Card padding="p-4 sm:p-5" className="space-y-4">
                                    <Typography variant="h5" className="text-base">
                                        Add a photo <Typography variant="span" weight="medium" className="text-slate-400 text-xs">(optional, but recommended)</Typography>
                                    </Typography>

                                    <label className="group flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50/60 p-6 transition hover:border-[#1A4D2E] hover:bg-emerald-50/20">
                                        <input type="file" accept="image/*" hidden onChange={handleImageUpload} />
                                        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#1A4D2E]/10 text-[#1A4D2E]">
                                            <UploadCloud size={24} />
                                        </div>
                                        <Typography variant="h6" className="text-xs">Click to browse image</Typography>
                                        <Typography variant="small" className="text-[11px] mt-0.5">PNG, JPG, WEBP (Max 5MB)</Typography>
                                    </label>
                                    {errors.image && <Typography variant="small" weight="semibold" color="text-rose-500" className="text-[11px]">{errors.image}</Typography>}

                                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
                                        {imagePreview ? (
                                            <img src={imagePreview} alt="Preview" className="h-40 w-full object-cover" />
                                        ) : (
                                            <div className="flex h-40 items-center justify-center text-center text-slate-400">
                                                <div>
                                                    <UploadCloud size={28} className="mx-auto mb-1 opacity-40" />
                                                    <Typography variant="h6" className="text-xs">Image Preview</Typography>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </Card>

                                <Card padding="p-4 sm:p-5" className="space-y-3">
                                    <Typography variant="h5" className="text-base border-b border-slate-100 pb-3">Final Touches</Typography>

                                    <Typography variant="small" className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-3.5 text-[11px]">
                                        💡 To mark this product <Typography variant="span" weight="bold">Available</Typography> or{" "}
                                        <Typography variant="span" weight="bold">Out of Stock</Typography>, use the switch on its card in the Products list.
                                    </Typography>

                                    <label className="flex items-center justify-between rounded-xl border border-slate-200 p-3.5 cursor-pointer hover:bg-slate-50 transition">
                                        <div>
                                            <Typography variant="h6" className="text-xs">Trending Item</Typography>
                                            <Typography variant="small" className="text-[11px]">Highlight this item on the storefront header.</Typography>
                                        </div>
                                        <Toggle
                                            checked={formData.featured}
                                            onChange={(checked) => setFormData(prev => ({ ...prev, featured: checked }))}
                                        />
                                    </label>
                                </Card>

                                <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-3 text-xs font-bold text-[#1A4D2E]">
                                    <Sparkles size={16} />
                                    You're all set! Hit "{mode === "add" ? "Save Product" : "Update Product"}" below to finish.
                                </div>
                            </div>
                        )}

                        <div className="hidden sm:flex items-center justify-between gap-3 pt-1">
                            <Button
                                variant="outline"
                                onClick={goPrev}
                                disabled={step === 0}
                                className="!px-5 !py-3 !text-sm !border-slate-200 !bg-white !text-slate-600 hover:!bg-slate-50 disabled:opacity-0 disabled:pointer-events-none"
                            >
                                <ArrowLeft size={16} /> Back
                            </Button>

                            {!isLastStep ? (
                                <Button
                                    variant="primary"
                                    onClick={goNext}
                                    className="!px-7 !py-3 !text-sm shadow-lg shadow-[#1A4D2E]/25"
                                >
                                    Continue <ArrowRight size={17} />
                                </Button>
                            ) : (
                                <Button
                                    variant="primary"
                                    onClick={handleSubmit}
                                    disabled={saving}
                                    className="!px-7 !py-3 !text-sm shadow-lg shadow-[#1A4D2E]/25"
                                >
                                    {saving ? (
                                        <>
                                            <Loader2 size={17} className="animate-spin" />
                                            {mode === "add" ? "Saving..." : "Updating..."}
                                        </>
                                    ) : (
                                        <>
                                            <Check size={17} />
                                            {mode === "add" ? "Save Product" : "Update Product"}
                                        </>
                                    )}
                                </Button>
                            )}
                        </div>
                    </div>

                    <div className="hidden lg:block lg:sticky lg:top-28">{PreviewPanel}</div>
                </div>
            </div>

            <div className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-between gap-2 border-t border-slate-200 bg-white/95 px-4 py-3 backdrop-blur sm:hidden">
                <Button
                    variant="outline"
                    onClick={step === 0 ? handleBack : goPrev}
                    disabled={saving}
                    className="flex-1 !px-4 !py-3 !text-xs !bg-white !border-slate-200 !text-slate-600 hover:!bg-slate-50"
                >
                    {step === 0 ? "Cancel" : "Back"}
                </Button>

                {!isLastStep ? (
                    <Button
                        variant="primary"
                        onClick={goNext}
                        className="flex-1 !px-4 !py-3 !text-xs"
                    >
                        Continue <ArrowRight size={15} />
                    </Button>
                ) : (
                    <Button
                        variant="primary"
                        onClick={handleSubmit}
                        disabled={saving}
                        className="flex-1 !px-4 !py-3 !text-xs"
                    >
                        {saving ? <Loader2 size={16} className="animate-spin" /> : mode === "add" ? "Save Product" : "Update"}
                    </Button>
                )}
            </div>
        </div>
    );
}