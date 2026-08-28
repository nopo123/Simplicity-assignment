import { Theme } from "@mui/material/styles";
import { alpha } from "@mui/material/styles";

export type CustomShadows = {
  card: string;
  dropdown: string;
};

export const customShadows = (theme: Theme): CustomShadows => ({
  card: `0px 1px 2px 0px ${alpha(theme.palette.grey[900], 0.06)}, 0px 4px 12px 0px ${alpha(theme.palette.grey[900], 0.05)}`,
  dropdown: `0px 8px 24px 0px ${alpha(theme.palette.grey[900], 0.12)}`,
});
