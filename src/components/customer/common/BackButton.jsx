import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function BackButton({
  fallback = "/customer",
  className = "",
}) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }

    navigate(fallback);
  };

  return (
    <button
      type="button"
      onClick={handleBack}
      aria-label="Go back"
      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:-translate-x-0.5 dark:border-white/10 dark:bg-[#181A1B] dark:text-slate-200 ${className}`}
      style={{
        boxShadow:
          "0 8px 20px color-mix(in srgb, var(--primary-color) 9%, transparent)",
      }}
    >
      <ArrowLeft size={19} />
    </button>
  );
}
