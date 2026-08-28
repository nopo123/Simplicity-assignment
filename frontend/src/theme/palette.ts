import { alpha } from "@mui/material/styles";
import { PaletteOptions } from "@mui/material/styles/createPalette";
import {
  errorDefault,
  infoDefault,
  primaryDefault,
  secondaryDefault,
  successDefault,
  warningDefault,
} from "./palette/palette-default";

export const grey = {
  0: "#FFFFFF",
  100: "#F7F8F9",
  150: "#F1F2F4",
  200: "#E7E9EC",
  300: "#DCDFE4",
  400: "#B9BEC7",
  500: "#8F97A3",
  600: "#5F6875",
  700: "#414958",
  800: "#2A303C",
  900: "#1F2A37",
} as const;

const common = {
  black: "#000000",
  white: "#FFFFFF",
} as const;

const action = {
  hover: alpha(grey[500], 0.08),
  selected: alpha(grey[500], 0.16),
  disabled: alpha(grey[500], 0.1),
  disabledBackground: alpha(grey[500], 0.24),
  focus: alpha(grey[500], 0.24),
  hoverOpacity: 0.08,
  disabledOpacity: 0.48,
} as const;

const baseColors = {
  grey,
  common,
  divider: alpha(grey[500], 0.2),
  action,
} as const;

export function palette(): PaletteOptions {
  return {
    mode: "light",
    ...baseColors,
    primary: primaryDefault,
    secondary: secondaryDefault,
    info: infoDefault,
    success: successDefault,
    warning: warningDefault,
    error: errorDefault,
    text: {
      primary: grey[900],
      secondary: grey[600],
      disabled: grey[500],
    },
    background: {
      paper: common.white,
      default: grey[100],
    },
    action: {
      ...baseColors.action,
      active: grey[600],
    },
  };
}
