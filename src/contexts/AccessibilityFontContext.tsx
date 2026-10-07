import { createContext, useContext } from "react";

export type AccessibilityFontSizeOption = "base" | "large" | "xlarge";

type Ctx = {
  fontSize: AccessibilityFontSizeOption;
};

const AccessibilityFontContext = createContext<Ctx>({ fontSize: "base" });

export const AccessibilityFontProvider = AccessibilityFontContext.Provider;

export function useAccessibilityFontMultiplier(): number {
  const { fontSize } = useContext(AccessibilityFontContext);
  if (fontSize === "large") return 1.125;
  if (fontSize === "xlarge") return 1.25;
  return 1;
}
