import { useState } from "react";

const useDarkMode = () => {
  const darkModeValue = localStorage.getItem("darkMode");
  const [darkMode, setDarkMode] = useState(darkModeValue === "true");

  const handleDarkModeSwitch = () => {
    setDarkMode((prevDarkMode) => {
      const newState = !prevDarkMode;
      localStorage.setItem("darkMode", newState.toString());
      return newState;
    });
  };

  return { darkMode, handleDarkModeSwitch };
};

export default useDarkMode;
