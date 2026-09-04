import React, { useState } from "react";
import { FileDown, CalendarDays, Download } from "lucide-react";

// UI Components
import Modal from "../UI/Modal";
import Button from "../UI/Button";
import Typography from "../UI/Typography";

export default function ExportModal({
  open,
  onClose,
  onExport,
}) {
  const [month, setMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );

  if (!open) return null;

  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      title={
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-[#1A4D2E]/10 p-3">
            <FileDown size={22} className="text-[#1A4D2E]" />
          </div>
          <div>
            <Typography variant="h4" className="text-lg">Export Orders</Typography>
            <Typography variant="small">Monthly PDF Report</Typography>
          </div>
        </div>
      }
      showCloseButton={true}
      footer={
        <div className="flex justify-end gap-3 w-full">
          <Button
            variant="outline"
            onClick={onClose}
            className="!border-slate-300 hover:!bg-slate-50"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              onExport?.(month);
              onClose();
            }}
          >
            <Download size={18} /> Export PDF
          </Button>
        </div>
      }
    >
      <div className="space-y-6 pt-2">
        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-medium">
            <CalendarDays size={16} /> Select Month
          </label>
          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="h-12 w-full rounded-xl border border-slate-200 px-4 outline-none focus:border-[#1A4D2E] focus:ring-4 focus:ring-[#1A4D2E]/10 transition"
          />
        </div>

        <div className="rounded-xl border border-[#1A4D2E]/20 bg-[#1A4D2E]/5 p-4">
          <Typography variant="h6" className="text-sm">Export Includes</Typography>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            <li>• Complete Order History</li>
            <li>• Customer Details</li>
            <li>• Payment Summary</li>
            <li>• Revenue Report</li>
            <li>• Order Status Summary</li>
          </ul>
        </div>
      </div>
    </Modal>
  );
}