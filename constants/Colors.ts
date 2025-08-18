export type ThemeColors = {
  text: string;
  background: string;
  tint: string;
  header: string;
  card: string;

  // Light theme colors
  tagBgLight: string;
  tagTextLight: string;
  deleteIconLight: string;
  successLight: string;
  checkboxEmptyLight: string;
  textPrimaryLight: string;
  textSecondaryLight: string;

  // Dark theme colors
  tagBgDark: string;
  tagTextDark: string;
  deleteIconDark: string;
  successDark: string;
  checkboxEmptyDark: string;
  textPrimaryDark: string;
  textSecondaryDark: string;

  textMuted: string;
};

// Your color object
export const Colors: Record<"light" | "dark", ThemeColors> = {
  light: {
    text: "#000",
    background: "#fff",
    tint: "#2f95dc",
    header: "#f8f8f8",
    card: "#ffffff",

    tagBgLight: "#f0f0f0",
    tagTextLight: "#333",
    deleteIconLight: "#ff4444",
    successLight: "#4caf50",
    checkboxEmptyLight: "#ccc",
    textPrimaryLight: "#000",
    textSecondaryLight: "#555",

    // Dark variants still need to exist here to match the type
    tagBgDark: "#333",
    tagTextDark: "#fff",
    deleteIconDark: "#ff6666",
    successDark: "#4caf50",
    checkboxEmptyDark: "#555",
    textPrimaryDark: "#fff",
    textSecondaryDark: "#aaa",

    textMuted: "#888",
  },
  dark: {
    text: "#fff",
    background: "#121212",
    tint: "#0a84ff",
    header: "#1e1e1e",
    card: "#1e1e1e",

    tagBgLight: "#f0f0f0",
    tagTextLight: "#333",
    deleteIconLight: "#ff4444",
    successLight: "#4caf50",
    checkboxEmptyLight: "#ccc",
    textPrimaryLight: "#000",
    textSecondaryLight: "#555",

    tagBgDark: "#333",
    tagTextDark: "#fff",
    deleteIconDark: "#ff6666",
    successDark: "#4caf50",
    checkboxEmptyDark: "#555",
    textPrimaryDark: "#fff",
    textSecondaryDark: "#aaa",

    textMuted: "#888",
  },
};
