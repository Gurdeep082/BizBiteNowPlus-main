import { useState } from "react";
import {
  CalendarDays,
  Package,
  Boxes,
  IndianRupee,
  ShoppingBag,
  Pencil,
  CalendarClock,
  Copy,
  Trash2,
} from "lucide-react";

import useFestiveMenuStore from "../../../store/festiveMenuStore";
import Card from "../../../components/UI/Card";
import Typography from "../../../components/UI/Typography";
import Button from "../../../components/UI/Button";
import Modal from "../../../components/UI/Modal";
import Input from "../../../components/UI/Input";

const FestiveMenuTable = ({
  menus = [],
  onDuplicate,
  onDelete,
  onEdit,
}) => {
  const { updateMenu } = useFestiveMenuStore();

  const [selectedMenuForSchedule, setSelectedMenuForSchedule] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [togglingId, setTogglingId] = useState(null);

  if (!menus.length) return null;

  const handleScheduleClick = (menu) => {
    setSelectedMenuForSchedule(menu);
    setStartDate(menu.goLive ? menu.goLive.split("T")[0] : "");
    setEndDate(menu.endsOn ? menu.endsOn.split("T")[0] : "");
  };

  const handleSaveSchedule = async () => {
    if (!selectedMenuForSchedule) return;
    if (!startDate || !endDate) {
      alert("Please select both start and end dates.");
      return;
    }

    try {
      setIsUpdating(true);
      await updateMenu(selectedMenuForSchedule.id, {
        ...selectedMenuForSchedule,
        goLive: `${startDate}T00:00:00`,
        endsOn: `${endDate}T23:59:59`,
      });

      alert("Schedule updated successfully!");
      setSelectedMenuForSchedule(null);
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to update schedule");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleToggleStatus = async (menu) => {
    const isActive = menu.status?.toLowerCase() === "active" || menu.is_active === true;
    const nextIsActive = !isActive;

    try {
      setTogglingId(menu.id);
      await updateMenu(menu.id, {
        ...menu,
        status: nextIsActive ? "Active" : "Draft",
        is_active: nextIsActive,
      });
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to update status");
    } finally {
      setTogglingId(null);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? "-" : d.toLocaleDateString("en-IN");
  };

  return (
    <Card padding="p-0" className="overflow-hidden">
      <div className="border-b border-slate-200 px-6 py-5 bg-white">
        <Typography variant="h4" className="text-xl">Festive Menus</Typography>
        <Typography variant="small" className="mt-1">
          Manage all festive menus from one place.
        </Typography>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-slate-50">
            <tr className="text-left">
              <th className="px-6 py-4 text-sm font-semibold text-slate-600 whitespace-nowrap">
                Festival
              </th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600 whitespace-nowrap">
                Status
              </th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600 whitespace-nowrap">
                Products
              </th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600 whitespace-nowrap">
                Revenue
              </th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600 whitespace-nowrap">
                Orders
              </th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600 whitespace-nowrap">
                Schedule
              </th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-slate-600 whitespace-nowrap">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {menus.map((menu) => {
              const isActive = menu.status?.toLowerCase() === "active" || menu.is_active === true;
              const isToggling = togglingId === menu.id;

              return (
                <tr
                  key={menu.id}
                  className="border-t border-slate-100 transition hover:bg-slate-50 bg-white"
                >
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4 min-w-[220px]">
                      {menu.banner && menu.banner.trim() !== "" ? (
                        <img
                          src={menu.banner}
                          alt={menu.name}
                          className="h-14 w-14 shrink-0 rounded-xl object-cover"
                        />
                      ) : (
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-xs font-bold text-slate-400">
                          No Img
                        </div>
                      )}

                      <div>
                        <Typography variant="h6" className="text-sm">{menu.name}</Typography>
                        <Typography variant="small" className="mt-0.5 text-xs line-clamp-1">{menu.description}</Typography>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-5 whitespace-nowrap">
                    <label
                      className={`inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 py-1.5 pl-2.5 pr-3 ${isToggling ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                        }`}
                    >
                      <input
                        type="checkbox"
                        checked={isActive}
                        disabled={isToggling}
                        onChange={() => handleToggleStatus(menu)}
                        className="h-4 w-4 rounded border-slate-300 text-[#1A4D2E] accent-[#1A4D2E] focus:ring-[#1A4D2E]/30 disabled:cursor-not-allowed"
                      />
                      <Typography
                        variant="small"
                        weight="semibold"
                        className={`!text-xs ${isActive ? "text-[#1A4D2E]" : "text-slate-500"}`}
                      >
                        {isActive ? "Active" : "Draft"}
                      </Typography>
                    </label>
                  </td>

                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="space-y-1">
                      <Typography variant="small" weight="medium" color="text-slate-700" className="flex items-center gap-2">
                        <Package size={16} className="shrink-0" />
                        {menu.totalProducts || menu.products?.length || 0} Products
                      </Typography>
                      <Typography variant="small" color="text-slate-500" className="flex items-center gap-2 text-xs">
                        <Boxes size={14} className="shrink-0" />
                        {menu.totalCombos || 0} Combos
                      </Typography>
                    </div>
                  </td>

                  <td className="px-6 py-5 whitespace-nowrap">
                    <Typography variant="h6" color="text-[#1A4D2E]" className="flex items-center gap-1 text-sm">
                      <IndianRupee size={16} />
                      {(menu.revenue || 0).toLocaleString()}
                    </Typography>
                  </td>

                  <td className="px-6 py-5 whitespace-nowrap">
                    <Typography variant="small" weight="medium" className="flex items-center gap-2">
                      <ShoppingBag size={16} />
                      {menu.orders || 0}
                    </Typography>
                  </td>

                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="space-y-1">
                      <Typography variant="small" className="flex items-center gap-2">
                        <CalendarDays size={15} className="shrink-0 text-slate-400" />
                        {formatDate(menu.goLive)}
                      </Typography>
                      <Typography variant="small" className="flex items-center gap-2">
                        <CalendarClock size={15} className="shrink-0 text-slate-400" />
                        {formatDate(menu.endsOn)}
                      </Typography>
                    </div>
                  </td>

                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        variant="outline"
                        onClick={() => onEdit?.(menu)}
                        className="!w-9 !h-9 !p-0 !border-transparent !bg-blue-50 !text-blue-600 hover:!bg-blue-100"
                        title="Edit Menu"
                      >
                        <Pencil size={18} />
                      </Button>

                      <Button
                        variant="outline"
                        onClick={() => handleScheduleClick(menu)}
                        className="!w-9 !h-9 !p-0 !border-transparent !bg-amber-50 !text-amber-500 hover:!bg-amber-100"
                        title="Reschedule Menu"
                      >
                        <CalendarClock size={18} />
                      </Button>

                      <Button
                        variant="outline"
                        onClick={() => onDuplicate?.(menu)}
                        className="!w-9 !h-9 !p-0 !border-transparent !bg-emerald-50 !text-emerald-600 hover:!bg-emerald-100"
                        title="Duplicate Menu"
                      >
                        <Copy size={18} />
                      </Button>

                      <Button
                        variant="outline"
                        onClick={() => onDelete?.(menu)}
                        className="!w-9 !h-9 !p-0 !border-transparent !bg-rose-50 !text-rose-600 hover:!bg-rose-100"
                        title="Delete Menu"
                      >
                        <Trash2 size={18} />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={!!selectedMenuForSchedule}
        onClose={() => setSelectedMenuForSchedule(null)}
        title={`Reschedule: ${selectedMenuForSchedule?.name}`}
        size="sm"
        footer={
          <div className="flex justify-end gap-3 w-full">
            <Button
              variant="outline"
              onClick={() => setSelectedMenuForSchedule(null)}
              className="!border-slate-200 hover:!bg-slate-50"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSaveSchedule}
              disabled={isUpdating}
            >
              {isUpdating ? "Saving..." : "Save Schedule"}
            </Button>
          </div>
        }
      >
        <div className="space-y-4 pt-2">
          <div>
            <Typography variant="small" weight="semibold" className="text-xs mb-1 block">
              Start Date (Go Live)
            </Typography>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-[#1A4D2E] focus:ring-4 focus:ring-[#1A4D2E]/10"
            />
          </div>

          <div>
            <Typography variant="small" weight="semibold" className="text-xs mb-1 block">
              End Date (Ends On)
            </Typography>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-[#1A4D2E] focus:ring-4 focus:ring-[#1A4D2E]/10"
            />
          </div>
        </div>
      </Modal>
    </Card>
  );
};

export default FestiveMenuTable;