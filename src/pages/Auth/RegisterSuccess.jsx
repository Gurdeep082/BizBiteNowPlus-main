import { motion } from "framer-motion";
import {
  CheckCircle2,
  ArrowRight,
  Store,
  ShieldCheck,
  BarChart3,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import logoHorizontal from "../../assets/bizbite_logo_horizontal.png";

export default function RegisterSuccess() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#0b2b18] via-[#16522d] to-[#07140d]">
      {/* Background */}

      <div className="absolute -top-32 -left-32 h-72 w-72 rounded-full bg-[#ffc700]/10 blur-3xl"></div>

      <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-white/5 blur-3xl"></div>

      <div className="relative flex min-h-screen items-center justify-center px-6 py-5">
        <motion.div
          initial={{ opacity: 0, x: 70 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            duration: 0.45,
            ease: "easeInOut",
          }}
          className="w-full max-w-6xl">
          <div className="grid w-full max-w-6xl max-h-[800px] overflow-hidden rounded-[28px] bg-white shadow-[0_30px_60px_rgba(22,82,45,.18)] lg:min-h-[620px] lg:grid-cols-2">
            {/* LEFT PANEL */}

            <div className="relative hidden overflow-hidden bg-gradient-to-br from-[#16522d] via-[#124325] to-[#08160e] p-6 text-white lg:flex lg:flex-col">
              <div className="absolute right-0 top-0 h-60 w-60 rounded-full bg-[#ffc700]/10 blur-3xl"></div>

              <div className="relative z-10">
                <img
                  src={logoHorizontal}
                  alt="BizBiteNow"
                  className="h-10 object-contain"
                />

                <span className="mt-5 inline-flex rounded-full bg-[#ffc700] px-3 py-1 text-xs font-bold text-[#16522d]">
                  Seller Platform
                </span>

                <h1 className="mt-6 text-4xl font-black leading-tight">
                  Welcome to
                  <br />
                  BizBiteNow+
                </h1>

                <p className="mt-4 max-w-sm text-sm leading-7 text-green-100">
                  Your seller account has been created successfully. You're now
                  ready to manage products, orders, festive menus and analytics
                  from one dashboard.
                </p>
              </div>

              <div className="py-35">
                <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-2">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#ffc700] text-[#16522d]">
                    <Store size={22} />
                  </div>

                  <div>
                    <h3 className="font-semibold">Store Created</h3>

                    <p className="text-xs text-green-100">
                      Your restaurant profile is ready.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-2">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#ffc700] text-[#16522d]">
                    <ShieldCheck size={22} />
                  </div>

                  <div>
                    <h3 className="font-semibold">Seller Account Secured</h3>

                    <p className="text-xs text-green-100">
                      PIN and profile stored locally.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-2">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#ffc700] text-[#16522d]">
                    <BarChart3 size={22} />
                  </div>

                  <div>
                    <h3 className="font-semibold">Dashboard Ready</h3>

                    <p className="text-xs text-green-100">
                      Start managing your restaurant instantly.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT PANEL */}

            <div className="w-full text-center justify-center bg-white px-8 py-1">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50">
                <CheckCircle2 size={48} className="text-emerald-500" />
              </div>

              <div className="mt-6">
                <span className="inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-1 text-xs font-bold uppercase tracking-wider text-green-700">
                  <Sparkles size={14} />
                  Registration Successful
                </span>

                <h2 className="mt-5 text-4xl font-black text-[#16522d]">
                  Welcome Seller!
                </h2>

                <p className="mt-4 text-sm leading-7 text-slate-500">
                  Congratulations! Your BizBiteNow+ seller account has been
                  created successfully.
                </p>
              </div>

              {/* Status Cards */}

              <div className="mt-6 space-y-2.5">
                <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-5 py-3">
                  <span className="text-sm font-medium text-slate-600">
                    Account Status
                  </span>

                  <span className="rounded-lg bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                    ACTIVE
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-5 py-3">
                  <span className="text-sm font-medium text-slate-600">
                    Store Status
                  </span>

                  <span className="rounded-lg bg-[#ffc700]/20 px-3 py-1 text-xs font-bold text-[#16522d]">
                    READY
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-5 py-3">
                  <span className="text-sm font-medium text-slate-600">
                    Dashboard Access
                  </span>

                  <span className="rounded-lg bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
                    ENABLED
                  </span>
                </div>
              </div>

              {/* CTA */}

              <button
                onClick={() => navigate("/seller/dashboard")}
                className="group mt-8 flex w-full items-center justify-center gap-3 rounded-2xl bg-[#16522d] py-3 text-base font-bold text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#1b6337]">
                Go To Seller Dashboard
                <ArrowRight
                  size={20}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </button>

              <button
                onClick={() => navigate("/storefront")}
                className="mt-4 w-full rounded-2xl border border-[#16522d] py-3 font-semibold text-[#16522d] transition-all duration-300 hover:bg-[#16522d] hover:text-white">
                Visit Storefront
              </button>

              <div className="mt-10 border-t border-slate-200 pt-5">
                <p className="text-xs text-slate-500">
                  You're all set! Start adding products, managing orders,
                  creating festive menus, and tracking analytics from your
                  seller dashboard.
                </p>

                <p className="mt-4 text-[11px] text-slate-400">
                  © 2026 BizBiteNow+ • Seller Platform
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
