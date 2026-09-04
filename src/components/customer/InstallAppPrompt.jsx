import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { X, Smartphone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import useStoreStore from "../../api/stores/customerstore/storeStore";

const DISMISS_KEY = "pwa_install_dismissed_at";

export default function InstallAppPrompt() {
    const location = useLocation();

    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [showPrompt, setShowPrompt] = useState(false);
    const [installing, setInstalling] = useState(false);

    const store = useStoreStore((state) => state.store);
    const fetchStore = useStoreStore((state) => state.fetchStore);

    const storeInfo = {
        name:
            store?.store_profile?.store_name ||
            store?.business_name ||
            "BizBiteNow",
        logo: store?.store_profile?.logo || "",
    };

    useEffect(() => {
        fetchStore();
    }, [fetchStore]);

    useEffect(() => {
        const isStandalone =
            window.matchMedia("(display-mode: standalone)").matches ||
            window.navigator.standalone === true;

        if (isStandalone) return;

        if (localStorage.getItem(DISMISS_KEY)) {
            return;
        }

        if (window.__deferredInstallPrompt) {
            setDeferredPrompt(window.__deferredInstallPrompt);
        }

        const handleReady = () => {
            if (window.__deferredInstallPrompt) {
                setDeferredPrompt(window.__deferredInstallPrompt);
            }
        };

        const handleInstalled = () => {
            setDeferredPrompt(null);
            setShowPrompt(false);
        };

        window.addEventListener("pwa-install-ready", handleReady);
        window.addEventListener("pwa-app-installed", handleInstalled);

        return () => {
            window.removeEventListener("pwa-install-ready", handleReady);
            window.removeEventListener("pwa-app-installed", handleInstalled);
        };
    }, []);

    useEffect(() => {
        const onCustomerRoute = location.pathname.startsWith("/customer");

        if (onCustomerRoute && deferredPrompt) {
            const timer = setTimeout(() => setShowPrompt(true), 1200);
            return () => clearTimeout(timer);
        } else {
            setShowPrompt(false);
        }
    }, [location.pathname, deferredPrompt]);

    const handleInstall = async () => {
        if (!deferredPrompt) return;

        setInstalling(true);
        deferredPrompt.prompt();

        try {
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === "accepted") {
                setShowPrompt(false);
            } else {
                localStorage.setItem(DISMISS_KEY, String(Date.now()));
                setShowPrompt(false);
            }
        } catch (err) {
            console.warn("Install prompt error:", err);
        } finally {
            window.__deferredInstallPrompt = null;
            setDeferredPrompt(null);
            setInstalling(false);
        }
    };

    const handleDismiss = () => {
        localStorage.setItem(DISMISS_KEY, String(Date.now()));
        setShowPrompt(false);
        setDeferredPrompt(null);
    };

    return (
        <AnimatePresence>
            {showPrompt && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm px-5">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.92, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.92, y: 20 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                        className="relative w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl text-center"
                    >
                        <button
                            onClick={handleDismiss}
                            className="absolute top-3.5 right-3.5 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200 cursor-pointer"
                        >
                            <X size={16} />
                        </button>

                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl border border-slate-100 bg-slate-50 shadow-sm">
                            {storeInfo.logo ? (
                                <img
                                    src={storeInfo.logo}
                                    alt={storeInfo.name}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <Smartphone size={28} style={{ color: "var(--primary-color)" }} />
                            )}
                        </div>

                        <h2 className="text-lg font-bold text-slate-900">
                            Download the App
                        </h2>

                        <p className="mt-1.5 text-sm text-slate-500 leading-relaxed">
                            Install {storeInfo.name} for exclusive offers &amp; faster ordering!
                        </p>

                        <button
                            onClick={handleInstall}
                            disabled={installing}
                            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-white shadow-lg transition active:scale-[0.98] disabled:opacity-70 cursor-pointer"
                            style={{ backgroundColor: "var(--primary-color)" }}
                        >
                            {installing ? "Installing..." : "Download Now"}
                        </button>

                        <button
                            onClick={handleDismiss}
                            className="mt-3 w-full py-2 text-sm font-semibold text-slate-400 transition hover:text-slate-600 cursor-pointer"
                        >
                            Not Now
                        </button>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}