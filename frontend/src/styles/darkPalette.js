const darkPalette = {
  mode: "dark",
  background: {
    default: "#121212", // Dark gray for the main background
    paper: "#1A1A1A", // Slightly lighter dark gray for content areas
  },
  primary: {
    light: "#6DA8F5", // Brightened for a vivid accent
    main: "#448AFF", // High-contrast blue for main actions
    dark: "#1565C0", // Rich, deep blue for a strong focus
  },
  secondary: {
    light: "#99B4BD", // Slightly brighter gray-blue for balance
    main: "#607D8B", // Neutral tone for less dominant actions
    dark: "#34525D", // Darker, muted blue-gray for contrast
  },
  error: {
    light: "#F28BA0", // Noticeable red for light accents
    main: "#FF5252", // Bold red for error highlights
    dark: "#C6284C", // Dark red for emphasis
  },
  warning: {
    light: "#FFB74D", // Warm, vibrant yellow-orange for accents
    main: "#FF9800", // Strong amber for warnings
    dark: "#F57C00", // Deep orange for high contrast
  },
  success: {
    light: "#81C784", // Light green for secondary success indicators
    main: "#66BB6A", // Bright green for success notifications
    dark: "#388E3C", // Dark green for emphasis
  },
  info: {
    light: "#4FB3E5", // Calming blue for informational elements
    main: "#29B6F6", // Vivid blue for info highlights
    dark: "#0288D1", // Deep blue for high contrast
  },
  card: {
    shadow:
      "rgb(0 0 0 / 40%) 0px 4px 10px 0px, rgb(0 0 0 / 20%) 0px 10px 20px -5px",
  },
  disabled: {
    main: "#6E6E6E", // Medium gray for disabled states
  },
};

export default darkPalette;
