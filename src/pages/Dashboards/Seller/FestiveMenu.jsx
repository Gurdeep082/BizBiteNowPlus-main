import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";

// UI Components
import Typography from "../../../components/UI/Typography";
import Button from "../../../components/UI/Button";

import FestiveBanner from "../../../components/dashboard/festive/FestiveBanner";
import FestiveStats from "../../../components/dashboard/festive/FestiveStats";
import FestiveFilters from "../../../components/dashboard/festive/FestiveFilters";
import FestiveMenuTable from "../../../components/dashboard/festive/FestiveMenuTable";
import FestiveEmptyState from "../../../components/dashboard/festive/FestiveEmptyState";
import ScheduleMenuModal from "../../../components/dashboard/festive/modals/ScheduleMenuModal";
import DuplicateMenuModal from "../../../components/dashboard/festive/modals/DuplicateMenuModal";
import DeleteMenuModal from "../../../components/dashboard/festive/modals/DeleteMenuModal";

import useFestiveMenuStore from "../../../store/festiveMenuStore";

export default function FestiveMenu() {
  const navigate = useNavigate();

  const {
    menus,
    loading,
    error,
    fetchMenus,
    addMenu,
    updateMenu,
    deleteMenu,
    duplicateMenu,
  } = useFestiveMenuStore();

  const [search, setSearch] = useState("");
  const [festivalFilter, setFestivalFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedMenu, setSelectedMenu] = useState(null);

  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    fetchMenus().catch(() => { });
  }, [fetchMenus]);

  const handleCreate = () => {
    navigate("/seller/festivemenu/create");
  };

  const handleViewMenu = (menu) => {
    navigate(`/seller/festivemenu/${menu.id}`);
  };

  const handleEdit = (menu) => {
    navigate(`/seller/festivemenu/edit/${menu.id}`);
  };

  const handleSchedule = (menu) => {
    setSelectedMenu(menu);
    setShowScheduleModal(true);
  };

  const handleDuplicate = (menu) => {
    setSelectedMenu(menu);
    setShowDuplicateModal(true);
  };

  const handleDelete = (menu) => {
    setSelectedMenu(menu);
    setShowDeleteModal(true);
  };

  const handleSaveSchedule = async (updatedMenu) => {
    try {
      await updateMenu(updatedMenu.id, updatedMenu);
      setSelectedMenu(null);
      setShowScheduleModal(false);
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to save schedule");
    }
  };

  const handleDuplicateSave = async () => {
    if (!selectedMenu) return;
    try {
      await duplicateMenu(selectedMenu.id);
      setSelectedMenu(null);
      setShowDuplicateModal(false);
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to duplicate menu");
    }
  };

  const handleDeleteConfirm = async (menuToDelete) => {
    try {
      await deleteMenu(menuToDelete.id);
      setSelectedMenu(null);
      setShowDeleteModal(false);
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to delete menu");
    }
  };

  const filteredMenus = useMemo(() => {
    return menus.filter((menu) => {
      const query = search.toLowerCase();
      const matchesSearch =
        !query ||
        menu.name?.toLowerCase().includes(query) ||
        menu.festival?.toLowerCase().includes(query);

      const matchesFestival =
        festivalFilter === "All" || menu.festival === festivalFilter;

      const matchesStatus =
        statusFilter === "All" ||
        String(menu.status).toLowerCase() === String(statusFilter).toLowerCase();

      return matchesSearch && matchesFestival && matchesStatus;
    });
  }, [menus, search, festivalFilter, statusFilter]);

  const activeMenu = useMemo(() => {
    return menus.find((menu) => menu.status === "active");
  }, [menus]);

  const stats = useMemo(() => {
    return {
      totalMenus: menus.length,
      active: menus.filter((menu) => menu.status === "active").length,
      scheduled: menus.filter((menu) => menu.status === "scheduled").length,
      draft: menus.filter((menu) => menu.status === "draft").length,
      expired: menus.filter((menu) => menu.status === "expired").length,
    };
  }, [menus]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full space-y-6 pb-12 font-sans"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Typography variant="h3">Festive Menu & Campaigns</Typography>
          <Typography variant="p" className="mt-0.5">
            Manage seasonal menus, festival specials, and automated live timings
          </Typography>
        </div>

        <Button
          variant="primary"
          onClick={handleCreate}
          className="self-start sm:self-auto shadow-sm"
        >
          <Plus size={16} /> Create Festive Menu
        </Button>
      </div>

      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 shadow-xs">
          <Typography variant="small" weight="semibold" color="text-rose-600">{error}</Typography>
        </div>
      )}

      <FestiveBanner menu={activeMenu} onViewMenu={handleViewMenu} />

      <FestiveStats stats={stats} />

      <FestiveFilters
        search={search}
        setSearch={setSearch}
        festival={festivalFilter}
        setFestival={setFestivalFilter}
        status={statusFilter}
        setStatus={setStatusFilter}
      />

      {loading && menus.length === 0 ? (
        <div className="py-16 text-center">
          <Typography variant="small" weight="medium" color="text-slate-400">Loading festive deals...</Typography>
        </div>
      ) : filteredMenus.length === 0 ? (
        <FestiveEmptyState search={search} onCreate={handleCreate} />
      ) : (
        <FestiveMenuTable
          menus={filteredMenus}
          onEdit={handleEdit}
          onSchedule={handleSchedule}
          onDuplicate={handleDuplicate}
          onDelete={handleDelete}
        />
      )}

      <ScheduleMenuModal
        open={showScheduleModal}
        menu={selectedMenu}
        onSave={handleSaveSchedule}
        onClose={() => {
          setSelectedMenu(null);
          setShowScheduleModal(false);
        }}
      />

      <DuplicateMenuModal
        open={showDuplicateModal}
        menu={selectedMenu}
        onDuplicate={handleDuplicateSave}
        onClose={() => {
          setSelectedMenu(null);
          setShowDuplicateModal(false);
        }}
      />

      <DeleteMenuModal
        open={showDeleteModal}
        menu={selectedMenu}
        onDelete={handleDeleteConfirm}
        onClose={() => {
          setSelectedMenu(null);
          setShowDeleteModal(false);
        }}
      />
    </motion.div>
  );
}