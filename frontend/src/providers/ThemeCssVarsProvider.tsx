import { ReactNode, useEffect } from "react";
import { useTheme } from "@mui/material/styles";

interface ThemeCssVarsProviderProps {
  readonly children?: ReactNode;
}

export const ThemeCssVarsProvider = ({
  children,
}: ThemeCssVarsProviderProps) => {
  const theme = useTheme();

  useEffect(() => {
    const root = document.documentElement;

    const setCssVars = <T extends object>(prefix: string, obj: T): void => {
      Object.entries(obj).forEach(([key, value]) => {
        if (value && typeof value === "object") {
          setCssVars(`${prefix}-${key}`, value as Record<string, unknown>);
        } else if (typeof value === "string" || typeof value === "number") {
          const cssVarName = prefix ? `--${prefix}-${key}` : `--${key}`;
          root.style.setProperty(cssVarName, String(value));
        }
      });
    };

    setCssVars("", theme.palette);
  }, [theme]);

  return children ?? null;
};
