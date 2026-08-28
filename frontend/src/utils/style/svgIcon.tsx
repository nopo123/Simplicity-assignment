import { JSX } from "react";
import { SxProps, Theme } from "@mui/material";
import SvgColor from "src/components/svg-color/SvgColor";
import { DIMENSIONS } from "src/config/config";

export const icon = (
  name: string,
  width: number | string = DIMENSIONS.ICON_SIZE,
  height: number | string = DIMENSIONS.ICON_SIZE,
  color?: string,
): JSX.Element => (
  <SvgColor
    src={`/assets/icons/${name}.svg`}
    sx={{ width, height, color } as SxProps<Theme>}
  />
);
