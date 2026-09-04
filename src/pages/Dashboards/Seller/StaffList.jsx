import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    Users,
    Plus,
    Pencil,
    Trash2,
    Loader2,
    Phone,
    ShieldCheck,
    ShieldOff,
    AlertCircle,
} from "lucide-react";
import {
    getAllStaff,
    toggleStaffStatus,
    deleteStaff,
} from "../../../api/staffApi";
import { MODULE_OPTIONS } from "../../../constants/moduleOptions";
import { notifySuccess } from "../../../utils/toast";

// UI Components
import Typography from "../../../components/UI/Typography";
import Button from "../../../components/UI/Button";
import Card from "../../../components/UI/Card";
import Badge from "../../../components/UI/Badge";
import EmptyState from "../../../components/UI/EmptyState";
import Modal from "../../../components/UI/Modal";

const moduleLabel = (key) =>
    MODULE_OPTIONS.find((m) => m.key === key)?.label || key;

export default function StaffList() {
    const navigate = useNavigate();

    const [staffList, setStaffList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [togglingId, setTogglingId] = useState(null);
    const [deletingId, setDeletingId] = useState(null);

    // Replaced inline confirm with Modal state
    const [deleteModal, setDeleteModal] = useState({ show: false, staff: null });

    const fetchStaff = async () => {
        try {
            setLoading(true);
            setError("");
            const res = await getAllStaff();
            setStaffList(res.data?.staff || []);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to load staff.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStaff();
    }, []);

    const handleToggle = async (staff) => {
        try {
            setTogglingId(staff._id);
            const newStatus = !staff.is_active;
            await toggleStaffStatus(staff._id, newStatus);
            setStaffList((prev) =>
                prev.map((s) =>
                    s._id === staff._id ? { ...s, is_active: newStatus } : s,
                ),
            );
            notifySuccess(newStatus ? "Staff activated" : "Staff deactivated");
        } catch {
            // error toast 
        } finally {
            setTogglingId(null);
        }
    };

    const handleDelete = async () => {
        if (!deleteModal.staff) return;
        const id = deleteModal.staff._id;

        try {
            setDeletingId(id);
            await deleteStaff(id);
            setStaffList((prev) => prev.filter((s) => s._id !== id));
            setConfirmDeleteId(null);
            notifySuccess("Staff member removed");
        } catch {
            // error toast 
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full space-y-6 pb-16 font-sans"
        >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-2">
                <div className="flex items-center gap-3">
                    <div>
                        <Typography variant="h3" className="text-lg sm:text-xl">
                            Staff Management
                        </Typography>
                        <Typography variant="small" className="mt-0.5">
                            Add staff and control which sections they can access.
                        </Typography>
                    </div>
                </div>

                <Button
                    variant="primary"
                    onClick={() => navigate("/seller/staff/new")}
                    className="!h-11 shadow-sm shrink-0"
                >
                    <Plus size={18} /> Add Staff
                </Button>
            </div>

            {error && (
                <div className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-rose-700 shadow-sm">
                    <AlertCircle size={18} className="shrink-0 mt-0.5 text-rose-600" />
                    <Typography variant="small" weight="medium" color="text-rose-700">
                        {error}
                    </Typography>
                </div>
            )}

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 text-slate-500 gap-3">
                    <Loader2 size={32} className="animate-spin text-[#1A4D2E]" />
                    <Typography variant="small" weight="medium">Loading staff...</Typography>
                </div>
            ) : staffList.length === 0 && !error ? (
                <EmptyState
                    icon={Users}
                    title="No staff accounts yet"
                    description="Add your first staff member to give them limited dashboard access."
                    primaryAction={{ label: "Add Staff Member", onClick: () => navigate("/seller/staff/new") }}
                    className="!py-20"
                />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {staffList.map((staff) => (
                        <Card
                            key={staff._id}
                            padding="p-5"
                            className="shadow-sm flex flex-col justify-between"
                        >
                            <div className="flex items-start justify-between gap-3 mb-4">
                                <div className="min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <Typography variant="h5" className="truncate text-base">
                                            {staff.name}
                                        </Typography>
                                        <Badge
                                            variant={staff.is_active ? "success" : "secondary"}
                                            size="sm"
                                            className="!px-2 !py-0.5 !text-[10px]"
                                        >
                                            {staff.is_active ? "Active" : "Deactivated"}
                                        </Badge>
                                    </div>
                                    <Typography variant="small" className="flex items-center gap-1.5 text-xs mt-1.5">
                                        <Phone size={12} className="text-slate-400" /> {staff.phone}
                                    </Typography>
                                </div>

                                <div className="flex items-center gap-1.5 shrink-0">
                                    <Button
                                        variant="outline"
                                        onClick={() => handleToggle(staff)}
                                        disabled={togglingId === staff._id}
                                        title={staff.is_active ? "Deactivate" : "Activate"}
                                        className={`p-2 rounded-xl transition cursor-pointer disabled:opacity-50 ${staff.is_active
                                            ? "text-amber-600 hover:bg-amber-50"
                                            : "text-emerald-600 hover:bg-emerald-50"
                                            }`}
                                    >
                                        {togglingId === staff._id ? (
                                            <Loader2 size={14} className="animate-spin" />
                                        ) : staff.is_active ? (
                                            <ShieldOff size={14} />
                                        ) : (
                                            <ShieldCheck size={14} />
                                        )}
                                    </Button>

                                    <Button
                                        variant="outline"
                                        onClick={() => navigate(`/seller/staff/${staff._id}/edit`)}
                                        title="Edit"
                                        className="!h-8 !w-8 !p-0 !border-transparent !bg-slate-50 !text-slate-500 hover:!bg-slate-100 hover:!text-[#1A4D2E]"
                                    >
                                        <Pencil size={14} />
                                    </Button>

                                    <Button
                                        variant="outline"
                                        onClick={() => setDeleteModal({ show: true, staff })}
                                        title="Delete"
                                        className="!h-8 !w-8 !p-0 !border-transparent !bg-rose-50 !text-rose-500 hover:!bg-rose-100"
                                    >
                                        <Trash2 size={14} />
                                    </Button>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-slate-100">
                                <Typography variant="small" weight="semibold" className="text-[10px] uppercase text-slate-400 tracking-wider mb-2 block">
                                    Assigned Modules
                                </Typography>
                                <div className="flex flex-wrap gap-2">
                                    {(staff.modules || []).length === 0 ? (
                                        <Typography variant="small" className="text-[11px] italic text-slate-400">
                                            No modules assigned
                                        </Typography>
                                    ) : (
                                        staff.modules.map((m) => (
                                            <Badge key={m} variant="secondary" size="sm" className="!bg-slate-100 !text-slate-600 !border-slate-200">
                                                {moduleLabel(m)}
                                            </Badge>
                                        ))
                                    )}
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            {/* DELETE CONFIRMATION MODAL */}
            <Modal
                isOpen={deleteModal.show}
                onClose={() => setDeleteModal({ show: false, staff: null })}
                size="sm"
                showCloseButton={false}
            >
                <div className="flex flex-col items-center text-center space-y-4 pt-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-100 text-rose-600">
                        <Trash2 size={24} />
                    </div>
                    <div>
                        <Typography variant="h4" className="text-xl">Delete Staff Account?</Typography>
                        <Typography variant="small" className="mt-2 text-sm text-slate-600">
                            Are you sure you want to permanently delete <strong>{deleteModal.staff?.name}</strong>'s account? They will lose all access immediately.
                        </Typography>
                    </div>
                    <div className="flex items-center justify-center gap-3 pt-2 w-full">
                        <Button
                            variant="outline"
                            onClick={() => setDeleteModal({ show: false, staff: null })}
                            className="flex-1 !border-slate-200 hover:!bg-slate-50"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="danger"
                            onClick={handleDelete}
                            disabled={deletingId === deleteModal.staff?._id}
                            className="flex-1"
                        >
                            {deletingId === deleteModal.staff?._id ? <Loader2 size={16} className="animate-spin" /> : "Delete"}
                        </Button>
                    </div>
                </div>
            </Modal>
        </motion.div>
    );
}