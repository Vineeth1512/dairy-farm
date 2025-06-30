// src/hooks/useDarkMode.js
import { useContext } from "react";
import { DarkModeContext } from "../Context/DarkModeContext";

export const useDarkMode = () => useContext(DarkModeContext);
