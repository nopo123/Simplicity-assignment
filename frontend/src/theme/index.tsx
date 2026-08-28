import { ReactNode, useMemo } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import {
  createTheme,
  ThemeProvider as MUIThemeProvider,
} from "@mui/material/styles";
import "./types/types";
import { customShadows } from "./custom-shadows";
import { overrides } from "./overrides";
import { palette } from "./palette";
import { shadows } from "./shadows";
import { typography } from "./typography";

interface ThemeProviderProps {
  readonly children: ReactNode;
}

export default function ThemeProvider({ children }: ThemeProviderProps) {
  const baseTheme = useMemo(() => {
    const tempTheme = createTheme({
      palette: palette(),
      typography,
      shadows: shadows(),
      shape: { borderRadius: 8 },
    });

    return createTheme({
      ...tempTheme,
      customShadows: customShadows(tempTheme),
    });
  }, []);

  const theme = useMemo(
    () =>
      createTheme(baseTheme, {
        components: overrides(baseTheme),
      }),
    [baseTheme],
  );

  return (
    <MUIThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MUIThemeProvider>
  );
}
