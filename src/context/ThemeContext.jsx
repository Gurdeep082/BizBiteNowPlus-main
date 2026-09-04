import { createContext, useContext, useEffect, useMemo, useState } from "react";

const defaultTheme = {
  primary: "#16522D",
  secondary: "#ffd000",
  storeName: "BizBiteNow",
  logo: "",
};

const DARK_MODE_STORAGE_KEY = "customerDarkMode";
const DARK_PRIMARY = "#124224";

const ThemeContext = createContext(defaultTheme);

export const ThemeProvider = ({
  children,
  initialTheme = defaultTheme,
}) => {
  const [theme, setTheme] = useState(initialTheme);
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem(DARK_MODE_STORAGE_KEY) === "true",
  );

useEffect(() => {
  const root = document.documentElement;

  root.classList.toggle("dark", darkMode);

  const primary = darkMode ? DARK_PRIMARY : theme.primary;

  root.style.setProperty("--primary", primary);
  root.style.setProperty("--primary-color", primary);
  root.style.setProperty("--secondary-color", theme.secondary);

  root.style.setProperty("--secondary", "#CA8A04"); // Tailwind yellow-600

  root.style.setProperty(
    "--primary-light",
    `${primary}15`
  );

  root.style.setProperty(
    "--primary-border",
    `${primary}35`
  );

  root.style.setProperty(
    "--primary-shadow",
    `${primary}25`
  );
}, [theme, darkMode]);

  const updateTheme = (updates) => {
    setTheme((prev) => ({
      ...prev,
      ...updates,
    }));
  };

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const next = !prev;
      localStorage.setItem(DARK_MODE_STORAGE_KEY, String(next));
      return next;
    });
  };

  const value = useMemo(
    () => ({
      theme,
      updateTheme,
      darkMode,
      toggleDarkMode,
    }),
    [theme, darkMode]
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => useContext(ThemeContext);

export default ThemeProvider;
