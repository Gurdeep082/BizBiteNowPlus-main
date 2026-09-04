import { createContext, useContext, useState, useEffect } from "react";

const LANGUAGE_STORAGE_KEY = "customerLanguage";

// Extend this dictionary as you translate more screens
const translations = {
  en: {
    myProfile: "My Profile",
    manageAccount: "Manage your account, addresses, and preferences.",
    personalDetails: "Personal Details",
    savedAddresses: "Saved Addresses",
    paymentMethods: "Payment Methods",
    accountSettings: "Account Settings",
    appSettings: "App Settings",
    completeProfile: "Complete your profile",
    profileComplete: "Your profile is complete!",
    logout: "Log out",
    language: "Language",
    languageSubtitle: "Choose your preferred app language.",
  },
  hi: {
    myProfile: "मेरी प्रोफाइल",
    manageAccount: "अपना अकाउंट, पते और प्राथमिकताएं प्रबंधित करें।",
    personalDetails: "व्यक्तिगत विवरण",
    savedAddresses: "सहेजे गए पते",
    paymentMethods: "भुगतान के तरीके",
    accountSettings: "खाता सेटिंग्स",
    appSettings: "ऐप सेटिंग्स",
    completeProfile: "अपनी प्रोफ़ाइल पूरी करें",
    profileComplete: "आपकी प्रोफ़ाइल पूरी हो गई है!",
    logout: "लॉग आउट",
    language: "भाषा",
    languageSubtitle: "अपनी पसंदीदा ऐप भाषा चुनें।",
  },
};

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(
    () => localStorage.getItem(LANGUAGE_STORAGE_KEY) || "en"
  );

  useEffect(() => {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = (code) => {
    if (translations[code]) setLanguageState(code);
  };

  const t = (key) => translations[language]?.[key] ?? translations.en[key] ?? key;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within a LanguageProvider");
  return ctx;
}