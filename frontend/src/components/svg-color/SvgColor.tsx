import Box from "@mui/material/Box";
import { SxProps, Theme } from "@mui/system";
import { DIMENSIONS } from "src/config/config";

interface SvgColorProps {
  readonly src: string;
  readonly sx?: SxProps<Theme>;
}

const SvgColor = ({ src, sx }: SvgColorProps) => (
  <Box
    component="span"
    sx={{
      width: DIMENSIONS.ICON_SIZE,
      height: DIMENSIONS.ICON_SIZE,
      display: "inline-block",
      flexShrink: 0,
      bgcolor: "currentColor",
      mask: `url(${src}) no-repeat center / contain`,
      WebkitMask: `url(${src}) no-repeat center / contain`,
      ...sx,
    }}
  />
);

export default SvgColor;
