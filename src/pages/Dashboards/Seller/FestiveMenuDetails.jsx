import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  IndianRupee,
  ShoppingBag,
  Package,
  Layers3,
  Pencil,
  Copy,
  Eye,
  Trash2,
  PauseCircle,
} from "lucide-react";
import { motion } from "framer-motion";

import useFestiveMenuStore from "../../../store/festiveMenuStore";

export default function FestiveMenuDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    menus,
    loading,
    fetchMenus,
    deleteMenu,
    duplicateMenu,
    endMenu,
  } = useFestiveMenuStore();

  useEffect(() => {
    if (menus.length === 0) {
      fetchMenus().catch(() => {});
    }
  }, [menus.length, fetchMenus]);

  const menu = menus.find((item) => String(item.id || item._id) === String(id));

  const handleEdit = () => {
    if (menu) navigate(`/seller/festivemenu/edit/${menu.id}`);
  };

  const handleDuplicate = async () => {
    if (!menu) return;
    try {
      await duplicateMenu(menu.id);
      alert("Menu duplicated successfully!");
      navigate("/seller/festivemenu");
    } catch (err) {
      alert(err?.response?.data?.message || "Unable to duplicate menu");
    }
  };

  const handleDelete = async () => {
    if (!menu) return;
    if (window.confirm("Delete this festive menu?")) {
      try {
        await deleteMenu(menu.id);
        navigate("/seller/festivemenu");
      } catch (err) {
        alert(err?.response?.data?.message || "Unable to delete menu");
      }
    }
  };

  const handleEndMenu = async () => {
    if (!menu) return;
    if (window.confirm("End this festive menu?")) {
      try {
        await endMenu(menu.id);
        navigate("/seller/festivemenu");
      } catch (err) {
        alert(err?.response?.data?.message || "Unable to end menu");
      }
    }
  };

  if (loading && !menu) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-xs text-slate-400 font-medium">
        Loading deal details...
      </div>
    );
  }

  if (!menu) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="text-center space-y-3">
          <h2 className="text-xl font-bold text-slate-900">Menu Not Found</h2>
          <button
            onClick={() => navigate("/seller/festivemenu")}
            className="rounded-xl bg-emerald-700 px-5 py-2.5 text-xs font-bold text-white cursor-pointer"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const currentStatus = (menu.status || "draft").toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full space-y-6 pb-12 font-sans text-slate-900"
    >
      <button
        onClick={() => navigate("/seller/festivemenu")}
        className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
      >
        <ArrowLeft size={16} /> Back to Menus
      </button>

      {/* Hero Header */}
      <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">
        {menu.banner && menu.banner.trim() !== "" && (
          <img
            src={menu.banner}
            alt={menu.name || "Festive Banner"}
            className="h-64 w-full object-cover"
          />
        )}

        <div className="p-6 sm:p-8 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700">
                {currentStatus}
              </span>
              <h1 className="mt-2 text-2xl sm:text-3xl font-black text-slate-900">{menu.name}</h1>
              <p className="mt-1 text-xs sm:text-sm text-slate-500 max-w-2xl">{menu.description}</p>
            </div>

            <div className="flex items-center gap-2">
              <button onClick={handleEdit} className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer"><Pencil size={16} /></button>
              <button onClick={handleDuplicate} className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer"><Copy size={16} /></button>
              <button onClick={handleDelete} className="p-2 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 cursor-pointer"><Trash2 size={16} /></button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard title="Revenue" value={`₹${(menu.revenue || 0).toLocaleString()}`} icon={<IndianRupee size={18} />} />
        <StatCard title="Orders" value={menu.orders || 0} icon={<ShoppingBag size={18} />} />
        <StatCard title="Products" value={menu.totalProducts || 0} icon={<Package size={18} />} />
        <StatCard title="Combos" value={menu.totalCombos || 0} icon={<Layers3 size={18} />} />
      </div>

      {/* Actions & Details */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm lg:col-span-2 space-y-4">
          <h2 className="font-bold text-slate-900 text-base border-b border-slate-100 pb-3">Menu Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <DetailItem icon={<CalendarDays size={18} />} label="Festival" value={menu.festival || "N/A"} />
            <DetailItem icon={<Clock3 size={18} />} label="Status" value={menu.status || "N/A"} />
            <DetailItem icon={<CalendarDays size={18} />} label="Starts On" value={menu.goLive ? menu.goLive.split("T")[0] : "-"} />
            <DetailItem icon={<CalendarDays size={18} />} label="Ends On" value={menu.endsOn ? menu.endsOn.split("T")[0] : "-"} />
          </div>
        </div>

        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm space-y-4">
          <h2 className="font-bold text-slate-900 text-base border-b border-slate-100 pb-3">Quick Actions</h2>
          <div className="space-y-2.5">
            <button onClick={handleEdit} className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-700 py-2.5 text-xs font-bold text-white hover:bg-emerald-800 transition cursor-pointer"><Pencil size={14} /> Edit Menu</button>
            <button onClick={handleDuplicate} className="w-full flex items-center justify-center gap-2 rounded-xl border border-slate-200 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer"><Copy size={14} /> Duplicate</button>
            <button onClick={handleEndMenu} className="w-full flex items-center justify-center gap-2 rounded-xl border border-amber-200 bg-amber-50 py-2.5 text-xs font-bold text-amber-800 hover:bg-amber-100 transition cursor-pointer"><PauseCircle size={14} /> End Menu</button>
            <button onClick={handleDelete} className="w-full flex items-center justify-center gap-2 rounded-xl border border-rose-200 py-2.5 text-xs font-bold text-rose-600 hover:bg-rose-50 transition cursor-pointer"><Trash2 size={14} /> Delete</button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function StatCard({ title, value, icon }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold uppercase text-slate-400">{title}</span>
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">{icon}</div>
      </div>
      <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
    </div>
  );
}

function DetailItem({ icon, label, value }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4 space-y-1">
      <div className="text-emerald-700">{icon}</div>
      <p className="text-[10px] uppercase font-bold text-slate-400">{label}</p>
      <h3 className="text-sm font-bold text-slate-800">{value}</h3>
    </div>
  );
}