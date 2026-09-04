import { useNavigate } from "react-router-dom";
import { ChevronRight, Lock, Headphones } from "lucide-react";
import { motion } from "framer-motion";
import { policies } from "../../data/customer/policiesData";

const TermsPolicy = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="px-4 py-5 pb-28"
    >
      <div className="w-full min-w-0 max-w-[1780px]">
        {/* Our Commitment banner */}
        <div
          className="relative overflow-hidden rounded-2xl p-5 mb-6 flex items-center justify-between gap-4"
          style={{ backgroundColor: "var(--primary-color)" }}
        >
          <div>
            <p className="text-white font-bold text-lg">Our Commitment</p>
            <p className="text-white/80 text-sm mt-1 max-w-md leading-5">
              Your trust matters to us. Please read our terms and policies to
              understand how we protect you and your data.
            </p>
          </div>
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 bg-white/15">
            <Lock size={26} className="text-white" />
          </div>
        </div>

        {/* Our Policies */}
        <p className="font-bold text-slate-900 dark:text-white mb-3" style={{ fontSize: "15px" }}>
          Our Policies
        </p>

        <div className="bg-white dark:bg-[#181A1B] rounded-2xl shadow-sm overflow-hidden mb-6">
          {policies.map((policy, i) => {
            const Icon = policy.icon;
            return (
              <button
                key={policy.id}
                onClick={() => navigate(`/customer/profile/terms-policy/${policy.id}`)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer ${
                  i < policies.length - 1 ? "border-b border-gray-100 dark:border-[#A9BDCF]/20" : ""
                }`}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: "var(--accent-color)" }}
                >
                  <Icon size={18} style={{ color: "var(--primary-color)" }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-900 dark:text-white text-[14px]">
                    {policy.title}
                  </p>
                  <p className="text-gray-400 dark:text-slate-400 mt-0.5 text-[12px]">
                    {policy.desc}
                  </p>
                </div>
                <ChevronRight size={18} className="text-gray-300 dark:text-slate-600 shrink-0" />
              </button>
            );
          })}
        </div>

        {/* Need help */}
        <button
          onClick={() => navigate("/customer/profile/help-support")}
          className="w-full rounded-2xl p-4 flex items-center gap-4 text-left cursor-pointer transition-opacity hover:opacity-90"
          style={{
            backgroundColor: "var(--accent-color)",
            border: "1px solid var(--primary-color-border)",
          }}
        >
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
            style={{ backgroundColor: "var(--primary-color)" }}
          >
            <Headphones size={20} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-slate-900 dark:text-white text-[15px]">
              Need help?
            </p>
            <p className="text-slate-500 dark:text-slate-400 text-[13px] mt-0.5">
              We're here to assist you with any questions about our policies.
            </p>
          </div>
          <ChevronRight size={18} style={{ color: "var(--primary-color)" }} className="shrink-0" />
        </button>
      </div>
    </motion.div>
  );
};

export default TermsPolicy;
