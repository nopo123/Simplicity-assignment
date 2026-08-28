import { forwardRef } from "react";
import Box from "@mui/material/Box";
import { SxProps, Theme } from "@mui/system";

interface SvgColorProps {
  src: string;
  sx?: SxProps<Theme>;
}

const SvgColor = forwardRef<HTMLSpanElement, SvgColorProps>(
  ({ src, sx, ...other }, ref) => (
    <Box
      component="span"
      className="svg-color"
      ref={ref}
      sx={{
        width: 20,
        height: 20,
        display: "inline-block",
        flexShrink: 0,
        bgcolor: "currentColor",
        mask: `url(${src}) no-repeat center / contain`,
        WebkitMask: `url(${src}) no-repeat center / contain`,
        ...sx,
      }}
      {...other}
    />
  ),
);

SvgColor.displayName = "SvgColor";

export default SvgColor;
