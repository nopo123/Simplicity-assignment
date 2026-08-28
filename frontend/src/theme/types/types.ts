import { CustomShadows } from "../custom-shadows";

declare module "@mui/material/styles" {
  interface Theme {
    customShadows: CustomShadows;
  }

  interface ThemeOptions {
    customShadows?: CustomShadows;
  }

  interface PaletteColor {
    lighter?: string;
    darker?: string;
    mark?: string;
    states?: {
      hover?: string;
      selected?: string;
      focus?: string;
      focusVisible?: string;
      outlinedBorder?: string;
    };
  }

  interface SimplePaletteColorOptions {
    lighter?: string;
    darker?: string;
    mark?: string;
    states?: {
      hover?: string;
      selected?: string;
      focus?: string;
      focusVisible?: string;
      outlinedBorder?: string;
    };
  }
}

export {};
