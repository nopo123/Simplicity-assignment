import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import ListItemButton from "@mui/material/ListItemButton";
import { styled } from "@mui/material/styles";
import { commonStyles } from "./globalStyles";
import { DIMENSIONS } from "src/config/config";
import { cssVar } from "src/utils/style/cssStyle";

export const DashboardRootStyled = styled(Box)({
  ...commonStyles.flexCenter,
  alignItems: "stretch",
  minHeight: "100vh",
});

export const DashboardContentStyled = styled("main")({
  ...commonStyles.flexColumn,
  ...commonStyles.bgWhite,
  flexGrow: 1,
  minWidth: 0,
});

export const NavRootStyled = styled("nav")({
  ...commonStyles.flexColumn,
  ...commonStyles.bgGrey100,
  ...commonStyles.overflowHidden,
  width: `${DIMENSIONS.NAV_WIDTH}px`,
  flexShrink: 0,
  borderRight: `1px solid ${cssVar("grey-200")}`,
  paddingTop: "20px",
});

export const NavBrandStyled = styled(Box)({
  ...commonStyles.flexCenter,
  ...commonStyles.gap12px,
  padding: "0 20px 28px 20px",
});

export const NavBrandAvatarStyled = styled(Box)({
  ...commonStyles.flexCenterCenter,
  ...commonStyles.borderRadius50,
  width: "34px",
  height: "34px",
  flexShrink: 0,
  backgroundColor: cssVar("primary-main"),
  color: cssVar("primary-contrastText"),
  fontSize: "15px",
  fontWeight: 700,
});

export const NavItemStyled = styled(ListItemButton)({
  ...commonStyles.gap12px,
  flexGrow: 0,
  minHeight: "48px",
  marginRight: "12px",
  paddingLeft: "20px",
  color: cssVar("text-secondary"),
  borderRadius: "0 100% 100% 0 / 0 50% 50% 0",
  "&:hover": {
    backgroundColor: cssVar("primary-lighter"),
  },
  "&.Mui-selected": {
    flexGrow: 1,
    backgroundColor: cssVar("primary-light"),
    color: cssVar("text-primary"),
    borderRadius: "0 100% 100% 0 / 0 32% 32% 0",
  },
  "&.Mui-selected:hover": {
    backgroundColor: cssVar("primary-light"),
  },
});

export const PageHeaderStyled = styled(Box)({
  ...commonStyles.flexSpaceBetweenCenter,
  ...commonStyles.gap16px,
  ...commonStyles.flexWrap,
  borderBottom: `1px solid ${cssVar("grey-200")}`,
  padding: "20px 40px",
});

export const CategoryChipStyled = styled(Chip)({
  ...commonStyles.bgGrey150,
  borderRadius: "6px",
  color: cssVar("text-primary"),
  fontSize: "13px",
  height: "26px",
});

export const FormActionsStyled = styled(Box)({
  ...commonStyles.flexEndCenter,
  ...commonStyles.gap12px,
  width: "100%",
  maxWidth: "560px",
});

export const AnnouncementCategoryFilterStyled = styled(Box)({
  width: "320px",
  maxWidth: "100%",
});
