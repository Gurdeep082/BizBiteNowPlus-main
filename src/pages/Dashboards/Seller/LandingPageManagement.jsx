import { useEffect, useRef, useState } from "react";
import { GripVertical, Pencil, Plus, Trash2, Globe, Store, Tag, Gift, LayoutGrid, Loader2, Info } from "lucide-react";

import useLandingPageStore from "../../../store/landingPageStore";

// UI Components
import Typography from "../../../components/UI/Typography";
import Button from "../../../components/UI/Button";
import Card from "../../../components/UI/Card";
import Toggle from "../../../components/UI/Toggle";
import Badge from "../../../components/UI/Badge";
import Input from "../../../components/UI/Input";

function EditableText({ value, placeholder, onSave, variant = "p", className = "", multiline = false }) {
    const [editing, setEditing] = useState(false);
    const [draft, setDraft] = useState(value || "");
    const inputRef = useRef(null);

    useEffect(() => {
        if (editing) inputRef.current?.focus();
    }, [editing]);

    if (editing) {
        if (multiline) {
            return (
                <textarea
                    ref={inputRef}
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onBlur={() => {
                        setEditing(false);
                        if (draft !== value) onSave(draft);
                    }}
                    rows={3}
                    className={`w-full rounded-xl border border-[#1A4D2E] bg-white p-3 text-sm font-medium text-slate-700 outline-none ring-4 ring-[#1A4D2E]/10 resize-none ${className}`}
                />
            );
        }
        return (
            <input
                ref={inputRef}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onBlur={() => {
                    setEditing(false);
                    if (draft !== value) onSave(draft);
                }}
                onKeyDown={(e) => {
                    if (e.key === "Enter") e.currentTarget.blur();
                    if (e.key === "Escape") {
                        setDraft(value || "");
                        setEditing(false);
                    }
                }}
                className={`w-full rounded-lg border border-[#1A4D2E] bg-white px-3 py-1.5 outline-none ring-4 ring-[#1A4D2E]/10 ${className}`}
            />
        );
    }

    return (
        <span
            onClick={() => setEditing(true)}
            className={`group/edit cursor-text rounded-md px-1.5 -mx-1.5 hover:bg-emerald-50 hover:ring-1 hover:ring-[#1A4D2E]/30 transition inline-flex items-center gap-2 ${className}`}
        >
            <Typography variant={variant} className={!value ? "text-slate-400 italic" : ""}>
                {value || placeholder}
            </Typography>
            <Pencil size={14} className="opacity-0 group-hover/edit:opacity-40 shrink-0 text-[#1A4D2E]" />
        </span>
    );
}

function EditableImage({ src, alt = "", onSave, className = "", ratio = "aspect-video" }) {
    const fileRef = useRef(null);

    const handleFile = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => onSave(reader.result);
        reader.readAsDataURL(file);
    };

    return (
        <div className={`relative group/img overflow-hidden rounded-xl bg-slate-100 border border-slate-200 ${ratio} ${className}`}>
            {src ? (
                <img src={src} alt={alt} className="w-full h-full object-cover" />
            ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                    <Typography variant="small" weight="medium">No image selected</Typography>
                </div>
            )}
            <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/50 transition flex items-center justify-center opacity-0 group-hover/img:opacity-100 backdrop-blur-[2px]">
                <Button
                    variant="outline"
                    onClick={() => fileRef.current?.click()}
                    className="!bg-white !text-slate-800 !border-transparent hover:!bg-slate-50 !h-9 !px-4 !text-xs"
                >
                    <Pencil size={14} /> Change image
                </Button>
            </div>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
        </div>
    );
}

function SectionShell({ section, dragHandleProps, onToggleActive, children, label }) {
    return (
        <Card
            padding="p-0"
            className={`group relative transition-all duration-300 ${section.is_active ? "border-slate-200" : "border-dashed border-slate-300 opacity-60 hover:opacity-100"}`}
        >
            {/* Drag Handle */}
            <div className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <div
                    {...dragHandleProps}
                    className="cursor-grab active:cursor-grabbing bg-white border border-slate-200 rounded-lg p-2 shadow-md text-slate-400 hover:text-[#1A4D2E] hover:border-[#1A4D2E]"
                    title="Drag to reorder"
                >
                    <GripVertical size={18} />
                </div>
            </div>

            {/* Header / Visibility Toggle */}
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-5 py-3 rounded-t-2xl">
                <Typography variant="small" weight="bold" color="text-slate-500" className="uppercase tracking-wider text-[10px]">
                    {label}
                </Typography>
                <div className="flex items-center gap-2">
                    <Typography variant="small" weight="semibold" className="text-[11px] text-slate-400">
                        {section.is_active ? "Visible" : "Hidden"}
                    </Typography>
                    <Toggle checked={section.is_active} onChange={onToggleActive} />
                </div>
            </div>

            <div className="p-5 sm:p-6">{children}</div>
        </Card>
    );
}

function HeroEditor({ data, save }) {
    const banner = data.banners?.[0];
    return (
        <div className="space-y-5">
            <EditableImage
                src={banner?.image}
                onSave={(image) => save({ banners: [{ ...(banner || {}), image }] })}
                ratio="aspect-[21/9]"
            />
            <div className="space-y-1">
                <EditableText variant="h2" value={data.heading} placeholder="Add a main heading…" onSave={(heading) => save({ heading })} className="block" />
                <EditableText variant="p" value={data.subheading} placeholder="Add a supporting subheading…" onSave={(subheading) => save({ subheading })} className="block text-slate-500" />
            </div>
        </div>
    );
}

function TopSellingEditor({ data, save, availableData }) {
    const products = availableData?.products || [];
    const selectedIds = data.product_ids || [];

    const toggleProduct = (id) => {
        if (selectedIds.includes(id)) {
            save({ product_ids: selectedIds.filter((pid) => pid !== id) });
        } else {
            save({ product_ids: [...selectedIds, id] });
        }
    };

    return (
        <div className="space-y-4">
            <EditableText variant="h4" value={data.title} placeholder="Section title…" onSave={(title) => save({ title })} className="block" />

            <div className="flex items-center gap-2">
                <Button
                    variant={data.mode === "auto" ? "primary" : "outline"}
                    onClick={() => save({ mode: "auto" })}
                    className="!h-9 !px-4 !text-xs !rounded-full"
                >
                    Auto (Best Sellers)
                </Button>
                <Button
                    variant={data.mode !== "auto" ? "primary" : "outline"}
                    onClick={() => save({ mode: "manual" })}
                    className="!h-9 !px-4 !text-xs !rounded-full"
                >
                    Manually Select
                </Button>
            </div>

            {data.mode !== "auto" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-72 overflow-y-auto p-3 border border-slate-200 rounded-xl bg-slate-50">
                    {products.length === 0 ? (
                        <Typography variant="small" className="col-span-full text-center py-4">No active products found in database.</Typography>
                    ) : (
                        products.map((p) => (
                            <label key={p._id} className="flex items-center gap-3 p-2 bg-white rounded-xl border border-slate-200 cursor-pointer hover:border-[#1A4D2E] transition">
                                <input type="checkbox" checked={selectedIds.includes(p._id)} onChange={() => toggleProduct(p._id)} className="w-4 h-4 text-[#1A4D2E] rounded focus:ring-[#1A4D2E] accent-[#1A4D2E]" />
                                {p.image ? (
                                    <img src={p.image} alt={p.name} className="w-12 h-12 rounded-lg object-cover" />
                                ) : (
                                    <div className="w-12 h-12 rounded-lg bg-slate-100" />
                                )}
                                <div className="flex-1 min-w-0">
                                    <Typography variant="h6" className="text-sm truncate">{p.name}</Typography>
                                    <Typography variant="small" weight="bold" color="text-[#1A4D2E]" className="text-xs">₹{p.offer_price || p.price}</Typography>
                                </div>
                            </label>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}

function OffersEditor({ data, save, availableData }) {
    const discounts = availableData?.discounts || [];
    return (
        <div className="space-y-4">
            <EditableText variant="h4" value={data.title} placeholder="Offers Section Title" onSave={(title) => save({ title })} className="block" />

            <div className="bg-blue-50/50 border border-blue-100 p-3 rounded-xl flex items-start gap-2.5">
                <Tag size={16} className="shrink-0 mt-0.5 text-blue-600" />
                <Typography variant="small" color="text-blue-800" className="text-xs">
                    All active discounts from your database are automatically shown to customers in this section.
                </Typography>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 opacity-80">
                {discounts.map(d => (
                    <div key={d._id} className="p-3 border border-dashed border-slate-300 rounded-xl bg-slate-50">
                        <Typography variant="h6" className="text-sm">{d.code}</Typography>
                        <Badge variant="secondary" size="sm" className="mt-1 !text-[10px]">
                            {d.discount_type === 'percentage' ? `${d.discount_value}% OFF` : `₹${d.discount_value} OFF`}
                        </Badge>
                    </div>
                ))}
                {discounts.length === 0 && (
                    <Typography variant="small" className="col-span-full text-center py-2">No active discounts available.</Typography>
                )}
            </div>
        </div>
    );
}

function FestiveDealsEditor({ data, save, availableData }) {
    const deals = availableData?.festiveDeals || [];
    return (
        <div className="space-y-4">
            <EditableText variant="h4" value={data.title} placeholder="Festive Deals Title" onSave={(title) => save({ title })} className="block" />

            <div className="bg-purple-50/50 border border-purple-100 p-3 rounded-xl flex items-start gap-2.5">
                <Gift size={16} className="shrink-0 mt-0.5 text-purple-600" />
                <Typography variant="small" color="text-purple-800" className="text-xs">
                    Your active festive deals are automatically pulled here. No manual entry needed.
                </Typography>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 opacity-80">
                {deals.map(d => (
                    <div key={d._id} className="flex gap-3 p-2.5 border border-slate-200 rounded-xl items-center bg-slate-50">
                        {d.banner_image ? (
                            <img src={d.banner_image} alt={d.title} className="w-20 h-12 object-cover rounded-lg" />
                        ) : (
                            <div className="w-20 h-12 bg-slate-200 rounded-lg" />
                        )}
                        <div className="flex-1 min-w-0">
                            <Typography variant="h6" className="text-sm truncate">{d.title}</Typography>
                            <Typography variant="small" className="text-xs truncate">Valid till {new Date(d.end_date).toLocaleDateString()}</Typography>
                        </div>
                    </div>
                ))}
                {deals.length === 0 && (
                    <Typography variant="small" className="col-span-full text-center py-2">No active festive deals.</Typography>
                )}
            </div>
        </div>
    );
}

function CategoriesEditor({ data, save, availableData }) {
    const categories = availableData?.categories || [];
    return (
        <div className="space-y-4">
            <EditableText variant="h4" value={data.title} placeholder="Categories Title" onSave={(title) => save({ title })} className="block" />

            <div className="bg-emerald-50/50 border border-emerald-100 p-3 rounded-xl flex items-start gap-2.5">
                <LayoutGrid size={16} className="shrink-0 mt-0.5 text-emerald-600" />
                <Typography variant="small" color="text-emerald-800" className="text-xs">
                    Active menu categories are synced directly from your database.
                </Typography>
            </div>

            <div className="flex flex-wrap gap-2 opacity-80">
                {categories.map(c => (
                    <Badge key={c._id} variant="secondary" size="md" className="!bg-slate-100 !border-slate-200">
                        {c.name}
                    </Badge>
                ))}
                {categories.length === 0 && (
                    <Typography variant="small" className="text-center w-full py-2">No categories available.</Typography>
                )}
            </div>
        </div>
    );
}

function StoreInfoEditor({ availableData }) {
    const info = availableData?.storeInfo?.contact_info || {};
    return (
        <div className="space-y-4">
            <Typography variant="h4">Store Information</Typography>

            <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl flex items-start gap-2.5">
                <Store size={16} className="shrink-0 mt-0.5 text-slate-500" />
                <Typography variant="small" className="text-xs">
                    This section automatically displays your store address, phone, and timings based on your main Store Settings.
                </Typography>
            </div>

            <div className="space-y-2 bg-white p-4 border border-slate-100 rounded-xl shadow-sm">
                <Typography variant="small" className="flex flex-col">
                    <span className="font-bold uppercase text-[10px] text-slate-400 tracking-wider">Address</span>
                    <span className="text-sm font-medium text-slate-800">{info.address || "Not set"}, {info.city || ""}</span>
                </Typography>
                <div className="h-px bg-slate-100 w-full my-2" />
                <Typography variant="small" className="flex flex-col">
                    <span className="font-bold uppercase text-[10px] text-slate-400 tracking-wider">Phone</span>
                    <span className="text-sm font-medium text-slate-800">{info.primary_phone || "Not set"}</span>
                </Typography>
                <div className="h-px bg-slate-100 w-full my-2" />
                <Typography variant="small" className="flex flex-col">
                    <span className="font-bold uppercase text-[10px] text-slate-400 tracking-wider">Email</span>
                    <span className="text-sm font-medium text-slate-800">{info.business_email || "Not set"}</span>
                </Typography>
            </div>
        </div>
    );
}

function ListEditor({ title, items, itemLabel, onAdd, onRemove, renderItem }) {
    return (
        <div>
            <Typography variant="h6" className="text-sm mb-3">{title}</Typography>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {items.map((item, i) => (
                    <div key={i} className="relative rounded-xl border border-slate-200 p-4 bg-slate-50">
                        <button onClick={() => onRemove(i)} className="absolute top-3 right-3 text-slate-400 hover:text-rose-500 transition">
                            <Trash2 size={16} />
                        </button>
                        {renderItem(item, i)}
                    </div>
                ))}
            </div>
            <Button variant="outline" onClick={onAdd} className="mt-3 !h-9 !px-4 !text-xs !border-dashed !border-slate-300 hover:!border-[#1A4D2E] hover:!text-[#1A4D2E]">
                <Plus size={14} /> Add {itemLabel}
            </Button>
        </div>
    );
}

function AboutEditor({ data, save }) {
    const features = data.features || [];
    const updateFeature = (i, patch) => save({ features: features.map((f, idx) => (idx === i ? { ...f, ...patch } : f)) });

    return (
        <div className="space-y-5">
            <div className="space-y-1">
                <EditableText variant="h4" value={data.title} placeholder="Section title…" onSave={(title) => save({ title })} className="block" />
                <EditableText variant="p" multiline value={data.description} placeholder="Tell customers your story…" onSave={(description) => save({ description })} className="block text-slate-500" />
            </div>
            <ListEditor
                title="Highlights (fast delivery, hygiene, etc.)"
                items={features}
                itemLabel="highlight"
                onAdd={() => save({ features: [...features, { title: "", text: "" }] })}
                onRemove={(i) => save({ features: features.filter((_, idx) => idx !== i) })}
                renderItem={(f, i) => (
                    <div className="space-y-2 pr-6">
                        <EditableText variant="h6" value={f.title} placeholder="Highlight title" onSave={(v) => updateFeature(i, { title: v })} className="block text-sm" />
                        <EditableText variant="small" multiline value={f.text} placeholder="Short description" onSave={(v) => updateFeature(i, { text: v })} className="block text-xs text-slate-500" />
                    </div>
                )}
            />
        </div>
    );
}

function AboutUsEditor({ data, save }) {
    const features = data.features || [];
    const updateFeature = (i, patch) => save({ features: features.map((f, idx) => (idx === i ? { ...f, ...patch } : f)) });

    const stats = data.stats || [];
    const updateStat = (i, patch) => save({ stats: stats.map((s, idx) => (idx === i ? { ...s, ...patch } : s)) });

    return (
        <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <EditableText variant="small" value={data.eyebrow} placeholder="Eyebrow label (e.g. About Us)" onSave={(eyebrow) => save({ eyebrow })} className="block text-[10px] font-bold uppercase tracking-widest text-[#1A4D2E]" />
                    <EditableText variant="h4" value={data.title} placeholder="Section heading…" onSave={(title) => save({ title })} className="block" />
                    <EditableText variant="p" multiline value={data.description} placeholder="Tell customers about your story…" onSave={(description) => save({ description })} className="block text-slate-500" />
                </div>
                <EditableImage src={data.image} onSave={(image) => save({ image })} ratio="aspect-video" />
            </div>

            <ListEditor
                title="Highlights"
                items={features}
                itemLabel="highlight"
                onAdd={() => save({ features: [...features, { title: "", text: "" }] })}
                onRemove={(i) => save({ features: features.filter((_, idx) => idx !== i) })}
                renderItem={(f, i) => (
                    <div className="space-y-2 pr-6">
                        <EditableText variant="h6" value={f.title} placeholder="Highlight title" onSave={(v) => updateFeature(i, { title: v })} className="block text-sm" />
                        <EditableText variant="small" multiline value={f.text} placeholder="Short description" onSave={(v) => updateFeature(i, { text: v })} className="block text-xs text-slate-500" />
                    </div>
                )}
            />

            <div className="pt-4 border-t border-slate-100">
                <Typography variant="h6" className="text-sm mb-3">Stats</Typography>
                <div className="flex flex-wrap gap-3">
                    {stats.map((s, i) => (
                        <div key={i} className="relative rounded-xl border border-slate-200 p-4 text-center bg-slate-50 min-w-[130px]">
                            <button onClick={() => save({ stats: stats.filter((_, idx) => idx !== i) })} className="absolute top-2 right-2 text-slate-300 hover:text-rose-500">
                                <Trash2 size={14} />
                            </button>
                            <EditableText variant="h3" value={s.value} placeholder="9+" onSave={(v) => updateStat(i, { value: v })} className="block text-[#1A4D2E]" />
                            <EditableText variant="small" value={s.label} placeholder="Years Serving" onSave={(v) => updateStat(i, { label: v })} className="block text-xs mt-1 uppercase tracking-wider font-semibold text-slate-400" />
                        </div>
                    ))}
                    <button
                        onClick={() => save({ stats: [...stats, { value: "", label: "" }] })}
                        className="rounded-xl border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-400 hover:border-[#1A4D2E] hover:bg-emerald-50 hover:text-[#1A4D2E] min-w-[130px] min-h-[100px] transition"
                    >
                        <Plus size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
}

function TestimonialsEditor({ data, save }) {
    const reviews = data.reviews || [];
    const updateItem = (i, patch) => save({ reviews: reviews.map((r, idx) => (idx === i ? { ...r, ...patch } : r)) });

    return (
        <ListEditor
            title={<EditableText variant="h4" value={data.title} placeholder="Section title…" onSave={(title) => save({ title })} className="block" />}
            items={reviews}
            itemLabel="review"
            onAdd={() => save({ reviews: [...reviews, { name: "", comment: "", rating: 5, photo: "" }] })}
            onRemove={(i) => save({ reviews: reviews.filter((_, idx) => idx !== i) })}
            renderItem={(r, i) => (
                <div className="flex gap-4 pr-6">
                    <EditableImage src={r.photo} onSave={(photo) => updateItem(i, { photo })} className="w-16 h-16 shrink-0 rounded-full" ratio="aspect-square" />
                    <div className="flex-1 space-y-1 min-w-0">
                        <EditableText variant="h6" value={r.name} placeholder="Customer name" onSave={(v) => updateItem(i, { name: v })} className="block text-sm truncate" />
                        <EditableText variant="small" multiline value={r.comment} placeholder="What they said…" onSave={(v) => updateItem(i, { comment: v })} className="block text-xs text-slate-500 w-full" />
                    </div>
                </div>
            )}
        />
    );
}

function GalleryEditor({ data, save }) {
    const images = data.images || [];
    return (
        <div className="space-y-4">
            <EditableText variant="h4" value={data.title} placeholder="Section title…" onSave={(title) => save({ title })} className="block" />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {images.map((img, i) => (
                    <div key={i} className="relative group/gal rounded-xl overflow-hidden">
                        <EditableImage src={img} onSave={(v) => save({ images: images.map((im, idx) => (idx === i ? v : im)) })} ratio="aspect-square" className="!rounded-none" />
                        <button
                            onClick={() => save({ images: images.filter((_, idx) => idx !== i) })}
                            className="absolute top-2 right-2 bg-white/90 backdrop-blur rounded-lg p-1.5 text-slate-400 hover:text-rose-500 hover:bg-white shadow-sm transition opacity-0 group-hover/gal:opacity-100"
                        >
                            <Trash2 size={14} />
                        </button>
                    </div>
                ))}
                <button
                    onClick={() => save({ images: [...images, ""] })}
                    className="aspect-square rounded-xl border-2 border-dashed border-slate-200 flex flex-col gap-2 items-center justify-center text-slate-400 hover:border-[#1A4D2E] hover:bg-emerald-50 hover:text-[#1A4D2E] transition"
                >
                    <Plus size={24} />
                    <Typography variant="small" weight="semibold" className="text-xs">Add Image</Typography>
                </button>
            </div>
        </div>
    );
}

function StatsEditor({ data, save }) {
    const items = data.items || [];
    const updateItem = (i, patch) => save({ items: items.map((s, idx) => (idx === i ? { ...s, ...patch } : s)) });

    return (
        <div className="flex flex-wrap gap-3">
            {items.map((s, i) => (
                <div key={i} className="relative rounded-xl border border-slate-200 p-4 text-center bg-slate-50 min-w-[140px]">
                    <button onClick={() => save({ items: items.filter((_, idx) => idx !== i) })} className="absolute top-2 right-2 text-slate-300 hover:text-rose-500 transition">
                        <Trash2 size={14} />
                    </button>
                    <EditableText variant="h3" value={s.value} placeholder="500+" onSave={(v) => updateItem(i, { value: v })} className="block text-[#1A4D2E]" />
                    <EditableText variant="small" value={s.label} placeholder="Orders" onSave={(v) => updateItem(i, { label: v })} className="block text-xs mt-1 font-semibold uppercase tracking-wider text-slate-400" />
                </div>
            ))}
            <button
                onClick={() => save({ items: [...items, { value: "", label: "" }] })}
                className="rounded-xl border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-400 hover:border-[#1A4D2E] hover:bg-emerald-50 hover:text-[#1A4D2E] min-w-[140px] min-h-[100px] transition"
            >
                <Plus size={20} />
            </button>
        </div>
    );
}

function FAQEditor({ data, save }) {
    const items = data.items || [];
    const updateItem = (i, patch) => save({ items: items.map((f, idx) => (idx === i ? { ...f, ...patch } : f)) });

    return (
        <ListEditor
            title={<EditableText variant="h4" value={data.title} placeholder="Section title…" onSave={(title) => save({ title })} className="block" />}
            items={items}
            itemLabel="question"
            onAdd={() => save({ items: [...items, { question: "", answer: "" }] })}
            onRemove={(i) => save({ items: items.filter((_, idx) => idx !== i) })}
            renderItem={(f, i) => (
                <div className="space-y-2 pr-6">
                    <EditableText variant="h6" value={f.question} placeholder="Question…" onSave={(v) => updateItem(i, { question: v })} className="block text-sm" />
                    <EditableText variant="small" multiline value={f.answer} placeholder="Answer…" onSave={(v) => updateItem(i, { answer: v })} className="block text-xs text-slate-500" />
                </div>
            )}
        />
    );
}

function NewsletterEditor({ data, save }) {
    return (
        <div className="space-y-2 p-6 bg-slate-50 rounded-2xl border border-slate-200 text-center max-w-2xl mx-auto">
            <EditableText variant="h3" value={data.title} placeholder="e.g. Get exclusive offers" onSave={(title) => save({ title })} className="block" />
            <EditableText variant="p" value={data.subtitle} placeholder="Short subtitle…" onSave={(subtitle) => save({ subtitle })} className="block text-slate-500 mt-1" />
            <div className="mt-6 flex w-full opacity-60 pointer-events-none">
                <input type="email" placeholder="Email address" className="flex-1 rounded-l-xl border border-slate-300 px-4 py-2 text-sm outline-none" disabled />
                <button className="bg-slate-800 text-white px-6 py-2 rounded-r-xl text-sm font-semibold">Subscribe</button>
            </div>
        </div>
    );
}

function FooterEditor({ data, save }) {
    const links = data.links || [];
    const updateLink = (i, patch) => save({ links: links.map((l, idx) => (idx === i ? { ...l, ...patch } : l)) });

    return (
        <div className="space-y-6">
            <EditableText variant="small" multiline value={data.about_text} placeholder="Short footer about text…" onSave={(about_text) => save({ about_text })} className="block text-slate-500" />

            <ListEditor
                title="Footer Links"
                items={links}
                itemLabel="link"
                onAdd={() => save({ links: [...links, { label: "", url: "" }] })}
                onRemove={(i) => save({ links: links.filter((_, idx) => idx !== i) })}
                renderItem={(l, i) => (
                    <div className="flex flex-col gap-2 pr-6">
                        <EditableText variant="h6" value={l.label} placeholder="Link Label" onSave={(v) => updateLink(i, { label: v })} className="block text-sm" />
                        <EditableText variant="small" value={l.url} placeholder="/url" onSave={(v) => updateLink(i, { url: v })} className="block text-xs text-slate-400 font-mono" />
                    </div>
                )}
            />

            <div className="pt-4 border-t border-slate-100">
                <EditableText variant="small" value={data.copyright_text} placeholder="© 2026 Your Store. All rights reserved." onSave={(copyright_text) => save({ copyright_text })} className="block text-[10px] uppercase tracking-wide text-slate-400 text-center" />
            </div>
        </div>
    );
}

const SECTION_EDITORS = {
    hero: { label: "Hero Banner", Component: HeroEditor },
    top_selling: { label: "Top Selling", Component: TopSellingEditor },
    offers: { label: "Offers & Deals", Component: OffersEditor },
    festive_deals: { label: "Festive Deals", Component: FestiveDealsEditor },
    categories: { label: "Categories", Component: CategoriesEditor },
    about_us: { label: "About Us", Component: AboutUsEditor },
    about: { label: "Why Choose Us", Component: AboutEditor },
    testimonials: { label: "Testimonials", Component: TestimonialsEditor },
    gallery: { label: "Gallery", Component: GalleryEditor },
    store_info: { label: "Store Info", Component: StoreInfoEditor },
    stats: { label: "Stats", Component: StatsEditor },
    faq: { label: "FAQ", Component: FAQEditor },
    newsletter: { label: "Newsletter", Component: NewsletterEditor },
    footer: { label: "Footer", Component: FooterEditor },
};

export default function SellerLandingPageEditor() {
    const {
        landingPage,
        availableData,
        isLoading,
        isSaving,
        error,
        fetchLandingPage,
        updateLandingPage,
        toggleSectionActive,
        updateSection,
    } = useLandingPageStore();

    const [order, setOrder] = useState([]);
    const dragIndex = useRef(null);

    useEffect(() => {
        fetchLandingPage();
    }, [fetchLandingPage]);

    useEffect(() => {
        if (landingPage?.sections) {
            setOrder([...landingPage.sections].sort((a, b) => a.order - b.order));
        }
    }, [landingPage]);

    const handleDrop = async (dropIndex) => {
        const from = dragIndex.current;
        if (from === null || from === dropIndex) return;

        const reordered = [...order];
        const [moved] = reordered.splice(from, 1);
        reordered.splice(dropIndex, 0, moved);
        const withOrders = reordered.map((s, i) => ({ ...s, order: i + 1 }));

        setOrder(withOrders);
        dragIndex.current = null;
        await updateLandingPage({ sections: withOrders });
    };

    const saveSectionData = (section, patch) => {
        const nextData = { ...section.data, ...patch };
        setOrder((prev) => prev.map((s) => (s.section_key === section.section_key ? { ...s, data: nextData } : s)));
        updateSection(section.section_key, { is_active: section.is_active, order: section.order, data: nextData });
    };

    if (isLoading && !landingPage) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-slate-500 gap-3">
                <Loader2 className="animate-spin text-[#1A4D2E]" size={32} />
                <Typography variant="small" weight="medium">Loading landing page editor...</Typography>
            </div>
        );
    }

    return (
        <div className="w-full space-y-6 pb-12 font-sans">
            {/* 🔴 Yahan z-30 ko z-10 kar diya hai taaki main header ke niche slide ho */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-0 bg-slate-50/90 backdrop-blur-md z-10 py-4 border-b border-slate-200/50">
                <div>
                    <Typography variant="h3">Landing Page Editor</Typography>
                    <Typography variant="small" className="mt-1">
                        Click any text or image to edit. Drag <GripVertical size={14} className="inline text-slate-400" /> to reorder sections.
                    </Typography>
                </div>
                <Button
                    variant={landingPage?.is_published ? "primary" : "outline"}
                    onClick={() => updateLandingPage({ is_published: !landingPage?.is_published })}
                    disabled={isSaving}
                    className={`shadow-sm shrink-0 ${!landingPage?.is_published ? "!border-slate-300 !text-slate-700 hover:!bg-slate-100" : ""}`}
                >
                    {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Globe size={16} />}
                    {landingPage?.is_published ? "Published (Live)" : "Publish Page"}
                </Button>
            </div>

            {error && (
                <div className="rounded-xl bg-rose-50 border border-rose-100 p-4 flex items-start gap-3 text-rose-700">
                    <Info size={18} className="shrink-0 mt-0.5" />
                    <Typography variant="small" weight="medium">{error}</Typography>
                </div>
            )}

            <div className="space-y-6 sm:pl-4">
                {order.map((section, index) => {
                    const entry = SECTION_EDITORS[section.section_key];
                    if (!entry) return null;
                    const { label, Component } = entry;

                    return (
                        <div
                            key={section.section_key}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={() => handleDrop(index)}
                        >
                            <SectionShell
                                section={section}
                                label={label}
                                onToggleActive={(isActive) => {
                                    setOrder((prev) => prev.map((s) => (s.section_key === section.section_key ? { ...s, is_active: isActive } : s)));
                                    toggleSectionActive(section.section_key, isActive);
                                }}
                                dragHandleProps={{
                                    draggable: true,
                                    onDragStart: () => (dragIndex.current = index),
                                }}
                            >
                                <Component data={section.data || {}} save={(patch) => saveSectionData(section, patch)} availableData={availableData} />
                            </SectionShell>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}