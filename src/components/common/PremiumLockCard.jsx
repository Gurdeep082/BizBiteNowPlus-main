import { Crown, Lock } from "lucide-react";

export default function PremiumLockCard({
  title,
  description,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">

      <div className="flex flex-col items-center text-center">

        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100">

          <Crown
            size={32}
            className="text-yellow-600"
          />

        </div>

        <h3 className="text-xl font-bold text-slate-800">
          {title}
        </h3>

        <p className="mt-3 text-slate-500">
          {description}
        </p>

        <button className="mt-6 flex items-center gap-2 rounded-xl bg-[#16522d] px-6 py-3 text-white hover:bg-[#124324]">

          <Lock size={18} />

          Upgrade to Plus

        </button>

      </div>

    </div>
  );
}