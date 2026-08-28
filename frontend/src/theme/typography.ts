import { TypographyOptions } from "@mui/material/styles/createTypography";
import { cssVar } from "src/utils/style/cssStyle";

const primaryFont = "'Lato', 'Helvetica Neue', Arial, sans-serif";

function pxToRem(value: number): string {
  return `${value / 16}rem`;
}

export const typography: TypographyOptions = {
  fontFamily: primaryFont,
  fontWeightRegular: 400,
  fontWeightMedium: 700,
  fontWeightBold: 900,
  h1: {
    fontWeight: 900,
    lineHeight: 1.25,
    fontSize: pxToRem(36),
    letterSpacing: "-0.2px",
    color: cssVar("text-primary"),
  },
  h2: {
    fontWeight: 900,
    lineHeight: 1.3,
    fontSize: pxToRem(30),
    letterSpacing: "-0.2px",
    color: cssVar("text-primary"),
  },
  h3: {
    fontWeight: 700,
    lineHeight: 1.35,
    fontSize: pxToRem(26),
    letterSpacing: "-0.1px",
    color: cssVar("text-primary"),
  },
  h4: {
    fontWeight: 700,
    lineHeight: 1.4,
    fontSize: pxToRem(22),
    letterSpacing: "-0.1px",
    color: cssVar("text-primary"),
  },
  h5: {
    fontWeight: 700,
    lineHeight: 1.45,
    fontSize: pxToRem(19),
    color: cssVar("text-primary"),
  },
  h6: {
    fontWeight: 700,
    lineHeight: 1.5,
    fontSize: pxToRem(17),
    color: cssVar("text-primary"),
  },
  subtitle1: {
    fontWeight: 700,
    lineHeight: 1.5,
    fontSize: pxToRem(16),
    color: cssVar("text-primary"),
  },
  subtitle2: {
    fontWeight: 700,
    lineHeight: 22 / 14,
    fontSize: pxToRem(14),
    color: cssVar("text-primary"),
  },
  body1: {
    lineHeight: 1.5,
    fontSize: pxToRem(15),
    color: cssVar("text-primary"),
  },
  body2: {
    lineHeight: 22 / 14,
    fontSize: pxToRem(14),
    color: cssVar("text-primary"),
  },
  caption: {
    lineHeight: 1.5,
    fontSize: pxToRem(12),
    color: cssVar("text-secondary"),
  },
  overline: {
    fontWeight: 700,
    lineHeight: 1.5,
    fontSize: pxToRem(12),
    letterSpacing: "0.5px",
    textTransform: "uppercase" as const,
    color: cssVar("text-secondary"),
  },
  button: {
    fontWeight: 700,
    lineHeight: 24 / 14,
    fontSize: pxToRem(14),
    letterSpacing: "0.15px",
    textTransform: "none" as const,
  },
} as const;
