// src/context/DarkModeContext.jsx
import { createContext, useEffect, useState } from "react";

// ✅ Export this context so it can be used in the custom hook
export const DarkModeContext = createContext();

export const DarkModeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    const root = document.documentElement; // this is <html>
    if (darkMode) {
      root.classList.add("dark"); // ✅ required
      root.setAttribute("data-theme", "dark"); // for DaisyUI
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      root.setAttribute("data-theme", "light");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  return (
    <DarkModeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
};
