import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CalendarHeart,
  IndianRupee,
  ShoppingBag,
  Layers3,
  Search,
  Eye,
  Copy,
  Trash2,
} from "lucide-react";
import { motion } from "framer-motion";

import useFestiveMenuStore from "../../../store/festiveMenuStore";

export default function FestiveMenuHistory() {
  const navigate = useNavigate();
  const { menus, loading, fetchMenus, duplicateMenu, deleteMenu } = useFestiveMenuStore();
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchMenus().catch(() => {});
  }, [fetchMenus]);

  const historyMenus = useMemo(() => {
    return menus.filter((menu) => String(menu.status).toLowerCase() === "expired");
  }, [menus]);

  const filteredMenus = useMemo(() => {
    return historyMenus.filter((menu) => {
      const query = search.toLowerCase();
      return (
        (menu.name && menu.name.toLowerCase().includes(query)) ||
        (menu.festival && menu.festival.toLowerCase().includes(query))
      );
    });
  }, [historyMenus, search]);

  const totalRevenue = filteredMenus.reduce((sum, m) => sum + (m.revenue || 0), 0);
  const totalOrders = filteredMenus.reduce((sum, m) => sum + (m.orders || 0), 0);
  const averageRevenue = filteredMenus.length > 0 ? Math.round(totalRevenue / filteredMenus.length) : 0;

  const handleDuplicate = async (id) => {
    try {
      await duplicateMenu(id);
      alert("Menu duplicated successfully as draft.");
      navigate("/seller/festivemenu");
    } catch (err) {
      alert(err?.response?.data?.message || "Unable to duplicate menu.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this festive menu?")) {
      try {
        await deleteMenu(id);
      } catch (err) {
        alert(err?.response?.data?.message || "Unable to delete menu.");
      }
    }
  };

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

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Festive Menu History</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">View previous expired menus and performance stats.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <HistoryCard title="Historic Menus" value={filteredMenus.length} icon={<Layers3 size={18} />} />
        <HistoryCard title="Revenue" value={`₹${totalRevenue.toLocaleString()}`} icon={<IndianRupee size={18} />} />
        <HistoryCard title="Orders" value={totalOrders} icon={<ShoppingBag size={18} />} />
        <HistoryCard title="Avg Revenue" value={`₹${averageRevenue.toLocaleString()}`} icon={<IndianRupee size={18} />} />
      </div>

      <div className="relative">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search history by name or festival..."
          className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-xs sm:text-sm focus:border-emerald-600 focus:outline-none shadow-xs font-medium"
        />
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">
        <table className="w-full border-collapse text-left">
          <thead className="bg-slate-50/70 border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            <tr>
              <th className="px-5 py-3.5">Festival</th>
              <th className="px-5 py-3.5">Duration</th>
              <th className="px-5 py-3.5">Revenue</th>
              <th className="px-5 py-3.5">Orders</th>
              <th className="px-5 py-3.5">Status</th>
              <th className="px-5 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
            {loading && menus.length === 0 ? (
              <tr><td colSpan={6} className="py-12 text-center text-slate-400">Loading history...</td></tr>
            ) : filteredMenus.length === 0 ? (
              <tr><td colSpan={6} className="py-12 text-center text-slate-400">No festive menu history found.</td></tr>
            ) : (
              filteredMenus.map((menu) => {
                const menuId = menu.id || menu._id;
                return (
                  <tr key={menuId} className="hover:bg-slate-50 transition">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {menu.banner && menu.banner.trim() !== "" && (
                          <img src={menu.banner} alt="Banner" className="h-10 w-10 rounded-xl object-cover shrink-0 border border-slate-200" />
                        )}
                        <div>
                          <h3 className="font-bold text-slate-900">{menu.name}</h3>
                          <p className="text-[11px] text-slate-400">{menu.festival}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-slate-500">
                      <p>{menu.goLive ? menu.goLive.split("T")[0] : "-"}</p>
                      <p className="text-[10px] text-slate-400">to {menu.endsOn ? menu.endsOn.split("T")[0] : "-"}</p>
                    </td>
                    <td className="px-5 py-4 font-bold text-emerald-700">₹{(menu.revenue || 0).toLocaleString()}</td>
                    <td className="px-5 py-4">{menu.orders || 0}</td>
                    <td className="px-5 py-4">
                      <span className="rounded-full bg-rose-50 border border-rose-200 px-2.5 py-0.5 text-[10px] font-bold text-rose-600">
                        {menu.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex justify-end gap-1.5">
                        <button onClick={() => navigate(`/seller/festivemenu/${menuId}`)} className="p-2 text-slate-400 hover:text-slate-700 cursor-pointer"><Eye size={16} /></button>
                        <button onClick={() => handleDuplicate(menuId)} className="p-2 text-slate-400 hover:text-emerald-700 cursor-pointer"><Copy size={16} /></button>
                        <button onClick={() => handleDelete(menuId)} className="p-2 text-slate-400 hover:text-rose-600 cursor-pointer"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

function HistoryCard({ title, value, icon }) {
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