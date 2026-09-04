import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  X,
  Sparkles,
  ArrowRight,
} from "lucide-react";

export default function CreateFestiveMenuModal({
  open,
  onClose,
}) {
  const navigate = useNavigate();

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };

    if (open) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "auto";
    };
  }, [open, onClose]);

  if (!open) return null;

  const handleCreate = () => {
    onClose();

    navigate(
      "/seller/festivemenu/create"
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg rounded-2xl bg-white  shadow-2xl overflow-hidden"
      >
        {/* Header */}

<div className="grid grid-cols-[40px_1fr_40px] items-center bg-[#16522d] border-b px-6 py-6">

  {/* Left Icon */}

  <div className="flex justify-start">
    <div className="rounded-xl bg-orange-100/10 p-3">
      <Sparkles
        size={22}
        className="text-orange-500"
      />
    </div>
  </div>

  {/* Center Text */}

  <div className="text-center">
    <h2 className=" font-bold text-white font-inter">
      Create Festive Menu
    </h2>

    <p className="mt-1 text-sm text-slate-200 font-inter">
      Start building a new seasonal menu.
    </p>
  </div>

  {/* Right Close */}

  <div className="flex justify-end">
    <button
      onClick={onClose}
      className="rounded-lg p-2 text-slate-300 transition hover:bg-white/10 hover:text-white"
    >
      <X size={18} />
    </button>
  </div>

</div>

        {/* Body */}

        <div className="p-6 space-y-6">
          <div className="rounded-xl bg-orange-50 -orange-500/10 border border-orange-200 border-orange-800 p-5">
            <h3 className="font-bangers tracking-widest text-black mb-3">
              What happens next?
            </h3>

            <ul className="space-y-3 text-black text-slate-600 text-slate-300">

              <li className=" font-bangers tracking-widest text-black">
                • Add festive menu details.
              </li>

              <li className="font-bangers tracking-widest text-black">
                • Select products.
              </li>

              <li className="font-bangers tracking-widest text-black">
                • Configure schedule.
              </li>

              <li className="font-bangers tracking-widest text-black">
                • Review & publish.
              </li>

            </ul>
          </div>

          <div className="grid gap-4 md:grid-cols-2">

            <div className="rounded-xl border p-4">
              <h4 className="text-blue-600 font-bangers tracking-widest">
                Draft
              </h4>

              <p className="mt-2 text-sm font-bangers tracking-widest text-slate-900">
                Save progress and publish later.
              </p>
            </div>

            <div className="rounded-xl border p-4">
              <h4 className=" text-green-600 font-bangers tracking-widest">
                Scheduled
              </h4>


              <p className="mt2 text-sm font-bangers tracking-widest text-slate-900">
                Automatically activate on your chosen date.
              </p>
            </div>

          </div>
        </div>

        {/* Footer */}

        <div className="flex justify-end gap-3 border-t border-slate-700 px-6 py-5">

          <button
            onClick={onClose}
            className="rounded-xl border px-5 py-2.5 font-medium hover:bg-slate-100 hover:bg-slate-800 transition"
          >
            Cancel
          </button>

          <button
            onClick={handleCreate}
            className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 text-white font-medium hover:bg-orange-600 transition"
          >
            Continue

            <ArrowRight size={18} />
          </button>

        </div>
      </div>
    </div>
  );
}