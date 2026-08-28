import { cssVar } from "src/utils/style/cssStyle";

export const BORDER_COLOR = cssVar("grey-300");

export const BORDER = `1px solid ${cssVar("grey-200")}`;

export const BOX_SHADOW = "0px 8px 24px 0px rgba(31, 42, 55, 0.12)";

export const commonStyles = {
  flexCenter: { display: "flex", alignItems: "center" },
  flexCenterCenter: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  flexColumn: { display: "flex", flexDirection: "column" },
  flexColumnCenterCenter: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  flexSpaceBetweenCenter: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  flexEndCenter: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  flexWrap: { flexWrap: "wrap" },
  gap4px: { gap: "4px" },
  gap8px: { gap: "8px" },
  gap12px: { gap: "12px" },
  gap16px: { gap: "16px" },
  gap24px: { gap: "24px" },
  fullWidth: { width: "100%" },
  fullHeight: { height: "100%" },
  borderRadius8: { borderRadius: "8px" },
  borderRadius16: { borderRadius: "16px" },
  borderRadius50: { borderRadius: "50%" },
  cursorPointer: { cursor: "pointer" },
  cursorDefault: { cursor: "default" },
  overflowHidden: { overflow: "hidden" },
  overflowAuto: { overflow: "auto" },
  overflowXAuto: { overflowX: "auto" },
  positionRelative: { position: "relative" },
  positionAbsolute: { position: "absolute" },
  fontWeight700: { fontWeight: 700 },
  fontWeight900: { fontWeight: 900 },
  bgWhite: { backgroundColor: cssVar("common-white") },
  bgGrey100: { backgroundColor: cssVar("grey-100") },
  bgGrey150: { backgroundColor: cssVar("grey-150") },
  colorTextPrimary: { color: cssVar("text-primary") },
  colorTextSecondary: { color: cssVar("text-secondary") },
  textOverflowEllipsis: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  height40: { height: "40px" },
  height56: { height: "56px" },
} as const;

export const globalStyles = {
  pageWrapper: {
    ...commonStyles.flexColumn,
    ...commonStyles.gap24px,
    padding: "32px 40px",
  },
  tableContainer: {
    borderTop: BORDER,
    overflowX: "auto",
    width: "100%",
  },
  headerCell: {
    height: "52px",
    padding: "6px 24px",
    whiteSpace: "nowrap",
  },
  headerCellFirst: {
    height: "52px",
    padding: "6px 24px 6px 48px",
    whiteSpace: "nowrap",
  },
  bodyCell: {
    height: "48px",
    padding: "6px 24px",
    ...commonStyles.textOverflowEllipsis,
    maxWidth: "360px",
  },
  bodyCellFirst: {
    height: "48px",
    padding: "6px 24px 6px 48px",
    ...commonStyles.textOverflowEllipsis,
    maxWidth: "360px",
  },
  actionCell: {
    height: "48px",
    padding: "6px 24px",
    width: "72px",
    textAlign: "right",
  },
  pagination: {
    ".MuiToolbar-root": {
      minHeight: "52px",
      paddingLeft: "16px",
    },
  },
  formWrapper: {
    ...commonStyles.flexColumn,
    ...commonStyles.gap24px,
    width: "100%",
    maxWidth: "560px",
  },
  filtersWrapper: {
    ...commonStyles.flexCenter,
    ...commonStyles.gap16px,
    ...commonStyles.flexWrap,
  },
  emptyState: {
    ...commonStyles.flexColumnCenterCenter,
    ...commonStyles.gap8px,
    padding: "48px 16px",
  },
} as const;
