import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Check } from "lucide-react";
import { motion } from "framer-motion";
import { policies } from "../../data/customer/policiesData";

const PolicyDetail = () => {
  const navigate = useNavigate();
  const { policyId } = useParams();

  const policy = policies.find((p) => p.id === policyId);

  if (!policy) {
    return (
      <div className="px-4 py-5 pb-28">
        <div className="w-full min-w-0 max-w-[1780px]">
          <button
            onClick={() => navigate("/customer/profile/terms-policy")}
            className="flex items-center gap-2 text-slate-600 dark:text-slate-300 mb-6 cursor-pointer"
          >
            <ArrowLeft size={20} />
            Back
          </button>
          <p className="text-slate-500 dark:text-slate-400">Policy not found.</p>
        </div>
      </div>
    );
  }

  const Icon = policy.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="px-4 py-5 pb-28"
    >
      <div className="w-full min-w-0 max-w-[1780px]">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate("/customer/profile/terms-policy")}
            className="flex items-center justify-center rounded-full text-slate-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors cursor-pointer shrink-0"
            style={{ width: "40px", height: "40px" }}
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              {policy.title}
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Last updated: {policy.lastUpdated}
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-[#181A1B] rounded-2xl shadow-sm p-5">
          <div className="flex items-start justify-between gap-4 mb-4">
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-6 flex-1">
              {policy.intro}
            </p>
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: "var(--accent-color)" }}
            >
              <Icon size={20} style={{ color: "var(--primary-color)" }} />
            </div>
          </div>

          <div className="space-y-4 mb-5">
            {policy.sections.map((section, i) => (
              <div key={section.title} className="flex gap-3">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-white text-xs font-bold"
                  style={{ backgroundColor: "var(--primary-color)" }}
                >
                  {i + 1}
                </div>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white text-[14px]">
                    {section.title}
                  </p>
                  <p className="text-slate-500 dark:text-white text-[13px] leading-5 mt-0.5">
                    {section.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div
            className="rounded-2xl p-4 flex items-center justify-between gap-4 flex-wrap"
            style={{
              backgroundColor: "var(--accent-color)",
              border: "1px solid var(--primary-color-border)",
            }}
          >
            <p className="text-sm font-medium text-[var(--primary-color)] dark:text-white">
              By using BizBiteNow, you agree to these {policy.title}.
            </p>
            <button
              className="flex items-center gap-1.5 rounded-xl px-5 py-2.5 text-sm font-semibold text-white shrink-0 cursor-pointer transition-opacity hover:opacity-90"
              style={{ backgroundColor: "var(--primary-color)" }}
            >
              <Check size={15} />
              I Agree
            </button>
          </div>
        </div>

        {/* Footer */}
        <div
          className="mt-5 rounded-2xl p-5 flex items-center justify-between gap-4 flex-wrap"
          style={{
            backgroundColor: "var(--accent-color)",
            border: "1px solid var(--primary-color-border)",
          }}
        >
          <div>
            <p className="font-semibold text-slate-900 dark:text-white text-[15px]">
              Have questions?
            </p>
            <p className="text-slate-500 dark:text-slate-400 text-[13px] mt-0.5">
              If you have any questions about our policies, feel free to reach
              out to us.
            </p>
          </div>
          <button
            onClick={() => navigate("/customer/profile/help-support")}
            className="rounded-xl px-5 py-2.5 text-sm font-semibold shrink-0 cursor-pointer text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: "var(--primary-color)" }}
          >
            Contact Support
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default PolicyDetail;
