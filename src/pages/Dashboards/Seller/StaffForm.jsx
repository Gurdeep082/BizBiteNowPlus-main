import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Save, Loader2, Check } from "lucide-react";
import {
    getAllStaff,
    createStaff,
    updateStaff,
} from "../../../api/staffApi";
import { MODULE_OPTIONS } from "../../../constants/moduleOptions";
import { notifySuccess } from "../../../utils/toast";

// UI Components
import Typography from "../../../components/UI/Typography";
import Button from "../../../components/UI/Button";
import Input from "../../../components/UI/Input";
import Card from "../../../components/UI/Card";

export default function StaffForm() {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = !!id;

    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        pin: "",
        modules: [],
    });

    const [loading, setLoading] = useState(isEditMode);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!isEditMode) return;

        const fetchStaffMember = async () => {
            try {
                setLoading(true);
                const res = await getAllStaff();
                const match = (res.data?.staff || []).find((s) => s._id === id);

                if (!match) {
                    setError("Staff member not found.");
                    return;
                }

                setFormData({
                    name: match.name || "",
                    phone: match.phone || "",
                    pin: "",
                    modules: match.modules || [],
                });
            } catch (err) {
                setError(err.response?.data?.message || "Failed to load staff.");
            } finally {
                setLoading(false);
            }
        };

        fetchStaffMember();
    }, [id, isEditMode]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const toggleModule = (key) => {
        setFormData((prev) => {
            const has = prev.modules.includes(key);
            return {
                ...prev,
                modules: has
                    ? prev.modules.filter((m) => m !== key)
                    : [...prev.modules, key],
            };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!formData.name.trim() || !formData.phone.trim()) {
            setError("Name and phone are required.");
            return;
        }

        if (!isEditMode && !formData.pin.trim()) {
            setError("PIN is required for a new staff account.");
            return;
        }

        try {
            setSaving(true);

            if (isEditMode) {
                const payload = { name: formData.name, modules: formData.modules };
                if (formData.pin.trim()) payload.pin = formData.pin;
                await updateStaff(id, payload);
            } else {
                await createStaff({
                    name: formData.name,
                    phone: formData.phone,
                    pin: formData.pin,
                    modules: formData.modules,
                });
            }

            notifySuccess(isEditMode ? "Staff account updated" : "Staff account created");
            navigate("/seller/staff");
        } catch (err) {
            setError(err.response?.data?.message || "Failed to save staff account.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-slate-500 gap-3">
                <Loader2 size={32} className="animate-spin text-[#1A4D2E]" />
                <Typography variant="small" weight="medium">Loading staff details...</Typography>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-3xl mx-auto px-4 py-6 font-sans space-y-6"
        >
            <div>
                <Button
                    variant="outline"
                    onClick={() => navigate("/seller/staff")}
                    className="!h-8 !px-3 !border-transparent !text-slate-500 hover:!bg-slate-100 !text-xs mb-4"
                >
                    <ArrowLeft size={14} /> Back to Staff
                </Button>

                <Typography variant="h3" className="text-xl sm:text-2xl">
                    {isEditMode ? "Edit Staff Member" : "Add New Staff"}
                </Typography>
                <Typography variant="small" className="mt-1 text-sm">
                    {isEditMode
                        ? "Update details and module access for this staff member."
                        : "Create a login for a staff member and choose what they can access."}
                </Typography>
            </div>

            <form onSubmit={handleSubmit}>
                <Card padding="p-0" className="overflow-hidden shadow-sm">
                    <div className="p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <Input
                                label="Full Name"
                                required
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="e.g. Rahul Kumar"
                            />

                            <div>
                                <Input
                                    label="Phone Number"
                                    required
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    disabled={isEditMode}
                                    placeholder="10-digit mobile number"
                                    maxLength={10}
                                    className={isEditMode ? "!bg-slate-50 !text-slate-400" : ""}
                                />
                                {isEditMode && (
                                    <Typography variant="small" className="text-[10px] mt-1.5 text-slate-400">
                                        Phone number can't be changed after creation.
                                    </Typography>
                                )}
                            </div>

                            <Input
                                label={isEditMode ? "Reset PIN (optional)" : "Login PIN"}
                                required={!isEditMode}
                                type="password"
                                name="pin"
                                value={formData.pin}
                                onChange={handleChange}
                                placeholder={isEditMode ? "Leave blank to keep current PIN" : "4-6 digit PIN"}
                            />
                        </div>

                        <div className="pt-2 border-t border-slate-100">
                            <Typography variant="small" weight="bold" className="text-xs uppercase text-slate-700 mb-3 block">
                                Module Access
                            </Typography>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                {MODULE_OPTIONS.map(({ key, label, icon: Icon }) => {
                                    const checked = formData.modules.includes(key);
                                    return (
                                        <button
                                            type="button"
                                            key={key}
                                            onClick={() => toggleModule(key)}
                                            className={`flex items-center gap-3 rounded-xl border p-3 text-sm font-semibold transition cursor-pointer ${
                                                checked
                                                    ? "border-[#1A4D2E] bg-emerald-50 text-[#1A4D2E]"
                                                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                                            }`}
                                        >
                                            <div
                                                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${
                                                    checked
                                                        ? "bg-[#1A4D2E] border-[#1A4D2E] text-white"
                                                        : "bg-white border-slate-300"
                                                }`}
                                            >
                                                {checked && <Check size={12} strokeWidth={3} />}
                                            </div>
                                            <Icon size={16} className="shrink-0" />
                                            <span className="truncate">{label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {error && (
                            <Typography variant="small" weight="bold" color="text-rose-600" className="text-xs bg-rose-50 p-3 rounded-lg border border-rose-100">
                                {error}
                            </Typography>
                        )}
                    </div>

                    <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-4 bg-slate-50/50">
                        <Button
                            variant="outline"
                            type="button"
                            onClick={() => navigate("/seller/staff")}
                            className="!border-slate-300 hover:!bg-white"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="primary"
                            type="submit"
                            disabled={saving}
                        >
                            {saving ? (
                                <>
                                    <Loader2 size={16} className="animate-spin" /> Saving...
                                </>
                            ) : (
                                <>
                                    <Save size={16} /> {isEditMode ? "Save Changes" : "Create Staff"}
                                </>
                            )}
                        </Button>
                    </div>
                </Card>
            </form>
        </motion.div>
    );
}