import { createContext } from "react";
import useDarkMode from "../hooks/useDarkMode";

export const AppContext = createContext({});

export const AppProvider = ({ children }) => {
  const { darkMode, handleDarkModeSwitch } = useDarkMode();

  return (
    <AppContext.Provider value={{ darkMode, handleDarkModeSwitch }}>
      {children}
    </AppContext.Provider>
  );
};
