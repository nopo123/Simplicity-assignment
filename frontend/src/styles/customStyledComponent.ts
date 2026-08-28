import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import ListItemButton from "@mui/material/ListItemButton";
import { styled } from "@mui/material/styles";
import { commonStyles } from "./globalStyles";
import { DIMENSIONS, MEDIA_DOWN_MD } from "src/config/config";
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
  width: `${DIMENSIONS.NAV_WIDTH}px`,
  flexShrink: 0,
  borderRight: `1px solid ${cssVar("grey-200")}`,
});

export const NavBrandStyled = styled(Box)({
  ...commonStyles.flexCenter,
  ...commonStyles.gap8px,
  height: `${DIMENSIONS.CONTENT_HEADER_HEIGHT}px`,
  paddingLeft: "12px",
});

export const NavBrandAvatarStyled = styled(Box)({
  ...commonStyles.flexCenterCenter,
  ...commonStyles.borderRadius50,
  width: "20px",
  height: "20px",
  flexShrink: 0,
  backgroundColor: cssVar("primary-main"),
  color: cssVar("primary-contrastText"),
  fontSize: "10px",
  fontWeight: 700,
});

export const NavItemStyled = styled(ListItemButton)({
  ...commonStyles.gap8px,
  flexGrow: 0,
  minHeight: "34px",
  paddingLeft: "14px",
  paddingRight: "14px",
  color: cssVar("text-primary"),
  "&:hover": {
    backgroundColor: cssVar("primary-lighter"),
  },
  "&.Mui-selected": {
    backgroundColor: cssVar("primary-light"),
    color: cssVar("text-primary"),
  },
  "&.Mui-selected:hover": {
    backgroundColor: cssVar("primary-light"),
  },
});

export const PageTitleRowStyled = styled(Box)({
  ...commonStyles.flexSpaceBetweenCenter,
  ...commonStyles.gap16px,
  ...commonStyles.flexWrap,
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
  ...commonStyles.fullWidth,
  paddingTop: "8px",
});

export const AnnouncementCategoryFilterStyled = styled(Box)({
  width: `${DIMENSIONS.FILTER_WIDTH}px`,
  maxWidth: "100%",
  [MEDIA_DOWN_MD]: {
    width: "100%",
  },
});

export const AutocompleteTagsStyled = styled(Box)({
  ...commonStyles.flexCenter,
  ...commonStyles.gap4px,
  ...commonStyles.flexWrap,
  maxWidth: "100%",
  overflow: "hidden",
});

export const ContentHeaderStyled = styled("header")({
  ...commonStyles.flexCenter,
  ...commonStyles.gap8px,
  height: `${DIMENSIONS.CONTENT_HEADER_HEIGHT}px`,
  flexShrink: 0,
  borderBottom: `1px solid ${cssVar("grey-200")}`,
  paddingLeft: "12px",
});

export const NavSidebarStyled = styled(Box)({
  display: "flex",
  [MEDIA_DOWN_MD]: {
    display: "none",
  },
});

export const MobileMenuButtonStyled = styled(IconButton)({
  display: "none",
  [MEDIA_DOWN_MD]: {
    display: "inline-flex",
  },
});
