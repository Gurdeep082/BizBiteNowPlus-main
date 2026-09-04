import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Store,
  Briefcase,
  Truck,
  IndianRupee,
  ShieldCheck,
  ChevronRight,
  Search,
  X,
} from "lucide-react";

import PageHeader from "../../../components/dashboard/PageHeader";
import StoreProfileCard from "../../../components/dashboard/settings/StoreProfileCard";
import BannerManagementCard from "../../../components/dashboard/settings/BannerManagementCard";
import BusinessInformationCard from "../../../components/dashboard/settings/BusinessInformationCard";
import ContactInformationCard from "../../../components/dashboard/settings/ContactInformationCard";
import BusinessHoursCard from "../../../components/dashboard/settings/BusinessHoursCard";
import DeliverySettingsCard from "../../../components/dashboard/settings/DeliverySettingsCard";
import PaymentSettingsCard from "../../../components/dashboard/settings/PaymentSettingsCard";
import TaxComplianceCard from "../../../components/dashboard/settings/TaxComplianceCard";
import NotificationsCard from "../../../components/dashboard/settings/NotificationsCard";
import SecurityCard from "../../../components/dashboard/settings/SecurityCard";

import useSettingStore from "../../../store/SettingStore";
import DineInSettingsCard from "../../../components/dashboard/settings/DineInSettingsCard";

// Single source of truth for every setting "page" — used to render the main
// tabs, the per-tab sub-tabs, AND the search index.
const TABS = [
  {
    id: "general",
    label: "General",
    icon: Store,
    description: "Store profile, branding, colors, banners",
    components: [
      { key: "store_profile", label: "Store Profile", keywords: "logo name tagline colors theme location" },
      { key: "banners", label: "Home Banners", keywords: "promotional offers deals images" },
    ],
  },
  {
    id: "business",
    label: "Business",
    icon: Briefcase,
    description: "Legal info, contact details, opening hours",
    components: [
      { key: "business_info", label: "Business Information", keywords: "gst pan fssai registration cuisine business type" },
      { key: "contact_info", label: "Contact Information", keywords: "phone email website whatsapp address city state" },
      { key: "business_hours", label: "Business Hours", keywords: "opening closing time schedule days" },
    ],
  },
  {
    id: "operations",
    label: "Operations",
    icon: Truck,
    description: "Delivery radius, charges, and dine-in",
    components: [
      { key: "delivery_settings", label: "Delivery Settings", keywords: "radius charge minimum order pickup delivery time" },
      { key: "dine_in_settings", label: "Dine-In & Tables", keywords: "dine in table booking amount reservation" },
    ],
  },
  {
    id: "financials",
    label: "Financials",
    icon: IndianRupee,
    description: "Payment methods, bank details, tax & invoicing",
    components: [
      { key: "payment_settings", label: "Payment Settings", keywords: "cod upi bank account ifsc payment methods" },
      { key: "tax_settings", label: "Tax & Compliance", keywords: "gst percentage invoice number tax" },
    ],
  },
  {
    id: "account",
    label: "Account & Security",
    icon: ShieldCheck,
    description: "Notifications, PIN, login security, delete store",
    components: [
      { key: "notifications", label: "Notifications", keywords: "email sms push alerts orders payments" },
      { key: "security", label: "Security & Access", keywords: "pin password two factor login delete deactivate" },
    ],
  },
];

// Flat, searchable index built once from TABS above.
const SEARCH_INDEX = TABS.flatMap((tab) =>
  tab.components.map((c) => ({
    tabId: tab.id,
    tabLabel: tab.label,
    componentKey: c.key,
    label: c.label,
    keywords: `${c.label} ${c.keywords} ${tab.label}`.toLowerCase(),
  }))
);

export default function Settings() {
  const {
    sellerProfile,
    isLoading,
    error,
    fetchSellerProfile,
    updateProfileSection,
    updateBranding,
    updateLocation,
    changePin,
    deactivateAccount,
    logout,
  } = useSettingStore();

  const [activeTab, setActiveTab] = useState("general");
  const [activeComponent, setActiveComponent] = useState(TABS[0].components[0].key);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchSellerProfile();
  }, [fetchSellerProfile]);

  const saveSection = (section) => (data) => updateProfileSection(section, data);

  const currentTab = TABS.find((t) => t.id === activeTab);

  const goToTab = (tabId) => {
    setActiveTab(tabId);
    const tab = TABS.find((t) => t.id === tabId);
    setActiveComponent(tab.components[0].key);
  };

  const goToResult = (result) => {
    setActiveTab(result.tabId);
    setActiveComponent(result.componentKey);
    setSearchQuery("");
  };

  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return SEARCH_INDEX.filter((item) => item.keywords.includes(q));
  }, [searchQuery]);

  const renderComponent = (key) => {
    switch (key) {
      case "store_profile":
        return (
          <StoreProfileCard
            key={key}
            profile={sellerProfile}
            loading={isLoading}
            onSave={saveSection("store_profile")}
            onSaveBranding={updateBranding}
            onSaveLocation={updateLocation}
          />
        );
      case "banners":
        return <BannerManagementCard key={key} />;
      case "business_info":
        return (
          <BusinessInformationCard
            key={key}
            profile={sellerProfile}
            loading={isLoading}
            onSave={saveSection("business_info")}
          />
        );
      case "contact_info":
        return (
          <ContactInformationCard
            key={key}
            profile={sellerProfile}
            loading={isLoading}
            onSave={saveSection("contact_info")}
          />
        );
      case "business_hours":
        return (
          <BusinessHoursCard
            key={key}
            profile={sellerProfile}
            loading={isLoading}
            onSave={saveSection("business_hours")}
          />
        );
      case "delivery_settings":
        return (
          <DeliverySettingsCard
            key={key}
            profile={sellerProfile}
            loading={isLoading}
            onSave={saveSection("delivery_settings")}
          />
        );
      case "dine_in_settings":
        return (
          <DineInSettingsCard
            key={key}
            profile={sellerProfile}
            loading={isLoading}
            onSave={saveSection("dine_in_settings")}
          />
        );
      case "payment_settings":
        return (
          <PaymentSettingsCard
            key={key}
            profile={sellerProfile}
            loading={isLoading}
            onSave={saveSection("payment_settings")}
            onSaveDelivery={saveSection("delivery_settings")}
          />
        );
      case "tax_settings":
        return (
          <TaxComplianceCard
            key={key}
            profile={sellerProfile}
            loading={isLoading}
            onSave={saveSection("tax_settings")}
          />
        );
      case "notifications":
        return (
          <NotificationsCard
            key={key}
            profile={sellerProfile}
            loading={isLoading}
            onSave={saveSection("notifications")}
          />
        );
      case "security":
        return (
          <SecurityCard
            key={key}
            profile={sellerProfile}
            loading={isLoading}
            onSave={saveSection("security")}
            onChangePin={changePin}
            onDeactivate={deactivateAccount}
            onLogout={logout}
          />
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-7xl mx-auto space-y-6"
    >
      <PageHeader
        title="Store Settings"
        subtitle="Manage every aspect of your restaurant from one place."
      />

      {/* Global settings search */}
      <div className="relative">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search any setting — e.g. GST, delivery radius, PIN, banners..."
          className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-10 text-sm font-semibold text-slate-800 outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10 shadow-xs"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <X size={16} />
          </button>
        )}

        {/* Results dropdown */}
        {searchQuery && (
          <div className="absolute z-20 mt-2 w-full rounded-2xl border border-slate-200 bg-white shadow-lg overflow-hidden">
            {searchResults.length === 0 ? (
              <div className="px-4 py-3 text-xs text-slate-400 font-medium">
                No settings match "{searchQuery}".
              </div>
            ) : (
              searchResults.map((result) => (
                <button
                  key={`${result.tabId}-${result.componentKey}`}
                  type="button"
                  onClick={() => goToResult(result)}
                  className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-emerald-50/60 transition cursor-pointer border-b border-slate-50 last:border-b-0"
                >
                  <div>
                    <p className="text-xs font-bold text-slate-800">{result.label}</p>
                    <p className="text-[10px] text-slate-400">in {result.tabLabel}</p>
                  </div>
                  <ChevronRight size={14} className="text-slate-300 shrink-0" />
                </button>
              ))
            )}
          </div>
        )}
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* Vertical Sidebar */}
        <div className="w-full md:w-64 shrink-0 flex flex-col gap-2 md:sticky md:top-24">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => goToTab(tab.id)}
                className={`flex items-start gap-3 w-full px-4 py-3 text-left rounded-2xl transition-all cursor-pointer ${isActive
                    ? "bg-emerald-700 text-white shadow-md"
                    : "bg-white text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 border border-slate-100"
                  }`}
              >
                <Icon size={18} className="mt-0.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <span className="block text-sm font-bold">{tab.label}</span>
                  <span className={`block text-[10px] mt-0.5 leading-snug ${isActive ? "text-emerald-100" : "text-slate-400"}`}>
                    {tab.description}
                  </span>
                </div>
                {isActive && <ChevronRight size={16} className="mt-0.5 shrink-0" />}
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="flex-1 w-full min-w-0 space-y-4">
          {currentTab.components.length > 1 && (
            <div className="flex flex-wrap gap-2">
              {currentTab.components.map((c) => {
                const isActive = activeComponent === c.key;
                return (
                  <button
                    key={c.key}
                    type="button"
                    onClick={() => setActiveComponent(c.key)}
                    className={`rounded-xl px-4 py-2 text-xs font-bold transition cursor-pointer ${isActive
                        ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                        : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-50"
                      }`}
                  >
                    {c.label}
                  </button>
                );
              })}
            </div>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeTab}-${activeComponent}`}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderComponent(activeComponent)}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}