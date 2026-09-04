import React from "react";
import { AlertTriangle, Trash2, Loader2 } from "lucide-react";

// UI Components
import Modal from "../UI/Modal";
import Button from "../UI/Button";
import Typography from "../UI/Typography";

export default function DeleteProductModal({
  open,
  onClose,
  onDelete,
  product,
  deleting = false,
}) {
  if (!open) return null;

  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      title="Delete Product"
      size="md"
      footer={
        <div className="flex justify-end gap-3 w-full">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={deleting}
            className="!border-slate-300 !text-slate-700 hover:!bg-slate-100"
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={onDelete}
            disabled={deleting}
          >
            {deleting ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Trash2 size={18} />
            )}
            {deleting ? "Deleting..." : "Delete Product"}
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-6 pt-2">
        {/* Warning Message */}
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-100">
            <AlertTriangle className="text-red-600" size={24} />
          </div>
          <div>
            <Typography variant="p" className="leading-relaxed">
              Are you sure you want to delete{" "}
              <Typography variant="span" weight="bold" color="text-slate-900">
                {product?.name}
              </Typography>
              ? This action cannot be undone.
            </Typography>
          </div>
        </div>

        {/* Impact List */}
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <ul className="space-y-2">
            <li>
              <Typography variant="small" color="text-red-700 font-medium">
                • Product will be permanently removed.
              </Typography>
            </li>
            <li>
              <Typography variant="small" color="text-red-700 font-medium">
                • Product images will also be deleted.
              </Typography>
            </li>
            <li>
              <Typography variant="small" color="text-red-700 font-medium">
                • This action cannot be recovered.
              </Typography>
            </li>
          </ul>
        </div>
      </div>
    </Modal>
  );
}