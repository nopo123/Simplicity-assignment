import { useCallback } from "react";
import ListItemText from "@mui/material/ListItemText";
import { useLocation, useNavigate } from "react-router-dom";
import { TFunction } from "i18next";
import { NavItemConfig } from "./config-navigation";
import { DIMENSIONS } from "src/config/config";
import { NavItemStyled } from "src/styles/customStyledComponent";
import { cssVar } from "src/utils/style/cssStyle";
import { icon } from "src/utils/style/svgIcon";

interface NavItemProps {
  item: NavItemConfig;
  t: TFunction;
  onNavigate?: () => void;
}

const NavItem = ({ item, t, onNavigate }: NavItemProps) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const isSelected = pathname.startsWith(item.path);

  const handleClick = useCallback(() => {
    navigate(item.path);
    onNavigate?.();
  }, [navigate, item.path, onNavigate]);

  return (
    <NavItemStyled selected={isSelected} onClick={handleClick}>
      {icon(
        item.iconName,
        DIMENSIONS.NAV_ICON_SIZE,
        DIMENSIONS.NAV_ICON_SIZE,
        cssVar("text-primary"),
      )}
      <ListItemText
        primary={t(item.labelKey)}
        primaryTypographyProps={{ variant: "caption", color: "text.primary" }}
      />
    </NavItemStyled>
  );
};

export default NavItem;
