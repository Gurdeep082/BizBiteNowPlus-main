import React, { useState, useEffect, useRef } from "react";
import { Plus, Pencil, Trash2, GripVertical, Search, Loader2, AlertCircle, LayoutList, CheckCircle2, XCircle, ImagePlus } from "lucide-react";
import API from "../../../api/axios";
import { notifySuccess } from "../../../utils/toast";

// UI Components
import Button from "../../../components/UI/Button";
import Typography from "../../../components/UI/Typography";
import Input from "../../../components/UI/Input";
import Modal from "../../../components/UI/Modal";
import EmptyState from "../../../components/UI/EmptyState";
import Badge from "../../../components/UI/Badge";

export default function ManageCategories() {
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState("All Categories");

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [formData, setFormData] = useState({ name: "", description: "", image: "", is_active: true });

    const fileInputRef = useRef(null);
    const dragItem = useRef(null);
    const dragOverItem = useRef(null);

    const fetchCategories = async () => {
        try {
            setIsLoading(true);
            const { data } = await API.get("/menu-categories/get");
            setCategories(data.categories || []);
            setError(null);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to load categories");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleOpenModal = (category = null) => {
        setError(null);
        if (category) {
            setEditingCategory(category);
            setFormData({
                name: category.name,
                description: category.description || "",
                image: category.image || "",
                is_active: category.is_active
            });
        } else {
            setEditingCategory(null);
            setFormData({ name: "", description: "", image: "", is_active: true });
        }
        setIsModalOpen(true);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                setError("Image size should be less than 2MB");
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, image: reader.result }));
                setError(null);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setFormData(prev => ({ ...prev, image: "" }));
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleSave = async (e) => {
        if (e) e.preventDefault();
        if (!formData.name.trim()) return;

        try {
            setIsSaving(true);
            setError(null);

            if (editingCategory) {
                await API.put(`/menu-categories/${editingCategory._id}`, formData, {
                    meta: { toastError: "Couldn't save the category" },
                });
            } else {
                await API.post("/menu-categories/create", {
                    name: formData.name,
                    description: formData.description,
                    image: formData.image,
                    display_order: categories.length
                }, {
                    meta: { toastError: "Couldn't save the category" },
                });
            }

            await fetchCategories();
            setIsModalOpen(false);
            notifySuccess(editingCategory ? "Category updated" : "Category created");
        } catch {
            // error toast 
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id, name) => {
        if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;
        try {
            setIsSaving(true);
            await API.delete(`/menu-categories/${id}`, {
                meta: { toastError: "Couldn't delete the category" },
            });
            setCategories(categories.filter(c => c._id !== id));
            notifySuccess("Category deleted");
        } catch {
            // error toast 
        } finally {
            setIsSaving(false);
        }
    };

    const handleToggleActive = async (category) => {
        const nextActive = !category.is_active;
        try {
            setCategories(categories.map(c => c._id === category._id ? { ...c, is_active: nextActive } : c));
            await API.put(`/menu-categories/${category._id}`, { is_active: nextActive }, {
                meta: { toastError: "Couldn't update the category" },
            });
            notifySuccess(nextActive ? "Category is now visible" : "Category hidden");
        } catch {
            setCategories(categories.map(c => c._id === category._id ? { ...c, is_active: category.is_active } : c));
        }
    };

    const handleDragStart = (index) => dragItem.current = index;
    const handleDragEnter = (e, index) => { e.preventDefault(); dragOverItem.current = index; };

    const handleDragEnd = async () => {
        if (dragItem.current === null || dragOverItem.current === null || dragItem.current === dragOverItem.current) return;

        const actualItems = [...categories];
        const draggedCategory = filteredCategories[dragItem.current];
        const targetCategory = filteredCategories[dragOverItem.current];

        const draggedActualIndex = actualItems.findIndex(c => c._id === draggedCategory._id);
        const targetActualIndex = actualItems.findIndex(c => c._id === targetCategory._id);

        const [moved] = actualItems.splice(draggedActualIndex, 1);
        actualItems.splice(targetActualIndex, 0, moved);
        const ordered_ids = actualItems.map(c => c._id);

        dragItem.current = null;
        dragOverItem.current = null;
        setCategories(actualItems);

        try {
            await API.put("/menu-categories/reorder", { ordered_ids }, {
                meta: { toastError: "Couldn't reorder categories" },
            });
        } catch {
            await fetchCategories();
        }
    };

    const totalCategories = categories.length;
    const activeCategories = categories.filter(c => c.is_active).length;
    const hiddenCategories = totalCategories - activeCategories;

    const filteredCategories = categories.filter(c => {
        const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesTab = activeTab === "All Categories" ? true : activeTab === "Active" ? c.is_active : !c.is_active;
        return matchesSearch && matchesTab;
    });

    return (
        <div className="w-full space-y-6 pb-12 font-sans">
            <div>
                <Typography variant="h3">Category Management</Typography>
                <Typography variant="p">Manage your menu categories, their order and visibility</Typography>
            </div>


            <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
                <div className="flex-1 w-full md:max-w-xl">
                    <Input
                        leftIcon={<Search size={18} />}
                        placeholder="Search by category name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="!rounded-xl !py-2.5"
                    />
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <Button
                        variant="primary"
                        onClick={() => handleOpenModal()}
                        className="w-full md:w-auto !text-sm"
                    >
                        <Plus size={18} /> Add Category
                    </Button>
                </div>
            </div>

            {error && (
                <div className="mb-6 bg-red-50 text-red-600 border border-red-100 p-4 rounded-xl flex items-start gap-3">
                    <AlertCircle size={20} className="shrink-0 mt-0.5" />
                    <Typography variant="small" weight="medium">{error}</Typography>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm relative overflow-hidden flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#1A4D2E] flex items-center justify-center text-white shrink-0 z-10">
                        <LayoutList size={22} />
                    </div>
                    <div className="z-10">
                        <Typography variant="small" weight="bold" color="text-[#1A4D2E]" className="mb-0.5 uppercase tracking-wide">Total Categories</Typography>
                        <Typography variant="h3">{totalCategories}</Typography>
                    </div>
                    <LayoutList className="absolute -right-4 -bottom-4 text-slate-50 w-32 h-32 opacity-50 z-0" />
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm relative overflow-hidden flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-600 flex items-center justify-center text-white shrink-0 z-10">
                        <CheckCircle2 size={24} />
                    </div>
                    <div className="z-10">
                        <Typography variant="small" weight="bold" color="text-emerald-600" className="mb-0.5 uppercase tracking-wide">Active Categories</Typography>
                        <Typography variant="h3">{activeCategories}</Typography>
                    </div>
                    <CheckCircle2 className="absolute -right-4 -bottom-4 text-emerald-50 w-32 h-32 opacity-50 z-0" />
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm relative overflow-hidden flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-rose-500 flex items-center justify-center text-white shrink-0 z-10">
                        <XCircle size={24} />
                    </div>
                    <div className="z-10">
                        <Typography variant="small" weight="bold" color="text-rose-500" className="mb-0.5 uppercase tracking-wide">Hidden Categories</Typography>
                        <Typography variant="h3">{hiddenCategories}</Typography>
                    </div>
                    <XCircle className="absolute -right-4 -bottom-4 text-rose-50 w-32 h-32 opacity-50 z-0" />
                </div>
            </div>

            <div className="flex items-center gap-2 border-b border-slate-200 pb-4 mb-6">
                {["All Categories", "Active", "Hidden"].map((tab) => (
                    <Button
                        key={tab}
                        variant={activeTab === tab ? "primary" : "outline"}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${activeTab === tab
                            ? "bg-[#007F5F] text-white"
                            : "bg-transparent text-slate-600 hover:bg-slate-100"
                            }`}
                    >
                        {tab}
                    </Button>
                ))}
            </div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                    <Loader2 size={32} className="animate-spin mb-4 text-[#1A4D2E]" />
                    <Typography variant="p" weight="medium">Loading categories...</Typography>
                </div>
            ) : filteredCategories.length === 0 ? (
                <EmptyState
                    icon={LayoutList}
                    title="No categories found"
                    description="You haven't created any categories matching this filter."
                />
            ) : (
                <div className="flex flex-col gap-3">
                    {filteredCategories.map((cat, index) => (
                        <div
                            key={cat._id}
                            draggable={activeTab === "All Categories" && searchQuery === ""}
                            onDragStart={() => handleDragStart(index)}
                            onDragEnter={(e) => handleDragEnter(e, index)}
                            onDragEnd={handleDragEnd}
                            onDragOver={(e) => e.preventDefault()}
                            className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-[0_1px_2px_rgba(0,0,0,0.02)] hover:border-slate-300 transition-colors"
                        >
                            <div className="flex items-center gap-4 flex-1">
                                {activeTab === "All Categories" && searchQuery === "" && (
                                    <div className="cursor-grab active:cursor-grabbing text-slate-300 hover:text-[#1A4D2E] transition-colors">
                                        <GripVertical size={20} />
                                    </div>
                                )}
                                <div className="w-14 h-14 rounded-xl border border-slate-100 bg-slate-50 overflow-hidden shrink-0 flex items-center justify-center">
                                    {cat.image ? (
                                        <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-xl font-bold text-slate-300">{cat.name.charAt(0)}</span>
                                    )}
                                </div>
                                <div>
                                    <Typography variant="h6" weight="bold" color="text-slate-900">{cat.name}</Typography>
                                    <Typography variant="small" weight="medium" className="mt-0.5 line-clamp-1">{cat.description || "No description provided"}</Typography>
                                </div>
                            </div>

                            <div className="flex items-center justify-between sm:justify-end gap-6 sm:w-auto w-full border-t sm:border-0 border-slate-100 pt-3 sm:pt-0">
                                <button
                                    onClick={() => handleToggleActive(cat)}
                                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold transition-all ${cat.is_active
                                        ? 'border-emerald-600 text-emerald-700 bg-emerald-50/50'
                                        : 'border-slate-300 text-slate-500 bg-slate-50'
                                        }`}
                                >
                                    <div className={`w-3 h-3 rounded-full shadow-sm ${cat.is_active ? 'bg-emerald-600' : 'bg-slate-400'}`}></div>
                                    {cat.is_active ? 'Available' : 'Hidden'}
                                </button>

                                <div className="flex items-center gap-1 border-l border-slate-200 pl-4">
                                    <Button
                                        onClick={() => handleOpenModal(cat)}
                                        className="!w-9 !h-9 !p-0 !bg-transparent !text-slate-400 hover:!text-[#1A4D2E] hover:!bg-emerald-50"
                                    >
                                        <Pencil size={18} />
                                    </Button>
                                    <Button
                                        onClick={() => handleDelete(cat._id, cat.name)}
                                        disabled={isSaving}
                                        className="!w-9 !h-9 !p-0 !bg-transparent !text-slate-400 hover:!text-red-600 hover:!bg-red-50"
                                    >
                                        <Trash2 size={18} />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingCategory ? "Edit Category" : "Add New Category"}
                footer={
                    <div className="flex gap-3 w-full">
                        <Button variant="outline" onClick={() => setIsModalOpen(false)} className="flex-1">
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={handleSave} disabled={isSaving || !formData.name.trim()} className="flex-1">
                            {isSaving && <Loader2 size={16} className="animate-spin" />}
                            {editingCategory ? "Save Changes" : "Save Category"}
                        </Button>
                    </div>
                }
            >
                <form onSubmit={handleSave} className="flex flex-col gap-5">
                    <div className="flex flex-col gap-1.5">
                        <Typography variant="small" weight="bold" color="text-slate-700">Category Image</Typography>
                        <div className="flex items-center gap-4 mt-1">
                            <div className="w-20 h-20 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden shrink-0 relative group">
                                {formData.image ? (
                                    <>
                                        <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <Button type="button" onClick={handleRemoveImage} className="!w-8 !h-8 !p-0 !bg-transparent !text-white hover:!text-red-400">
                                                <Trash2 size={18} />
                                            </Button>
                                        </div>
                                    </>
                                ) : (
                                    <ImagePlus size={24} className="text-slate-300" />
                                )}
                            </div>
                            <div className="flex-1">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    ref={fileInputRef}
                                    className="hidden"
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => fileInputRef.current.click()}
                                    className="!h-9 !px-4 !text-sm !text-slate-700 !border-slate-300 hover:!bg-slate-50"
                                >
                                    {formData.image ? "Change Image" : "Upload Image"}
                                </Button>
                                <Typography variant="small" className="mt-2 text-slate-400">Recommended: Square format (1:1), Max 2MB.</Typography>
                            </div>
                        </div>
                    </div>

                    <Input
                        label="Category Name"
                        required
                        placeholder="e.g. Burgers, Pizza, Beverages"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />

                    <div className="flex flex-col gap-1.5">
                        <Typography variant="small" weight="bold" color="text-slate-700">Description <span className="text-slate-400 font-medium">(Optional)</span></Typography>
                        <textarea
                            rows="3"
                            placeholder="Brief details about the items in this category"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-200 focus:border-[#1A4D2E] focus:ring-4 focus:ring-[#1A4D2E]/10 resize-none"
                        />
                    </div>
                </form>
            </Modal>
        </div>
    );
}