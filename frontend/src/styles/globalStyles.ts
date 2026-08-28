import {
  DIMENSIONS,
  MEDIA_DOWN_MD,
  MEDIA_DOWN_SM,
} from "src/config/config";
import { cssVar } from "src/utils/style/cssStyle";

export const BORDER = `1px solid ${cssVar("grey-200")}`;

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
  borderRadius50: { borderRadius: "50%" },
  overflowXAuto: { overflowX: "auto" },
  positionRelative: { position: "relative" },
  bgWhite: { backgroundColor: cssVar("common-white") },
  bgGrey100: { backgroundColor: cssVar("grey-100") },
  bgGrey150: { backgroundColor: cssVar("grey-150") },
  textOverflowEllipsis: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
} as const;

export const globalStyles = {
  pageWrapper: {
    ...commonStyles.flexColumn,
    ...commonStyles.gap24px,
    minWidth: 0,
    padding: "32px 40px",
    [MEDIA_DOWN_MD]: {
      padding: "24px",
    },
    [MEDIA_DOWN_SM]: {
      padding: "20px 16px",
      gap: "16px",
    },
  },
  tableContainer: {
    ...commonStyles.overflowXAuto,
    ...commonStyles.fullWidth,
    borderTop: BORDER,
  },
  table: {
    minWidth: `${DIMENSIONS.TABLE_MIN_WIDTH}px`,
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
    [MEDIA_DOWN_SM]: {
      padding: "6px 16px",
    },
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
    [MEDIA_DOWN_SM]: {
      padding: "6px 16px",
    },
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
  fieldStack: {
    ...commonStyles.flexColumn,
    ...commonStyles.gap8px,
  },
  formWrapper: {
    ...commonStyles.flexColumn,
    ...commonStyles.gap24px,
    ...commonStyles.fullWidth,
    maxWidth: `${DIMENSIONS.FORM_MAX_WIDTH}px`,
  },
  formPageWrapper: {
    ...commonStyles.flexColumn,
    ...commonStyles.gap16px,
    alignItems: "center",
    padding: "40px 24px",
    [MEDIA_DOWN_SM]: {
      padding: "24px 16px",
    },
  },
  filtersWrapper: {
    ...commonStyles.flexCenter,
    ...commonStyles.gap16px,
    ...commonStyles.flexWrap,
    [MEDIA_DOWN_SM]: {
      flexDirection: "column",
      alignItems: "stretch",
      gap: "12px",
    },
  },
  emptyState: {
    ...commonStyles.flexColumnCenterCenter,
    ...commonStyles.gap8px,
    padding: "48px 16px",
  },
} as const;
