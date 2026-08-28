import { useCallback } from "react";
import ListItemText from "@mui/material/ListItemText";
import { useLocation, useNavigate } from "react-router-dom";
import { TFunction } from "i18next";
import { NavItemConfig } from "./config-navigation";
import { NavItemStyled } from "src/styles/customStyledComponent";
import { cssVar } from "src/utils/style/cssStyle";
import { icon } from "src/utils/style/svgIcon";

interface NavItemProps {
  item: NavItemConfig;
  t: TFunction;
}

const NavItem = ({ item, t }: NavItemProps) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const isSelected = pathname.startsWith(item.path);

  const handleClick = useCallback(
    () => navigate(item.path),
    [navigate, item.path],
  );

  return (
    <NavItemStyled selected={isSelected} onClick={handleClick}>
      {icon(
        item.iconName,
        22,
        22,
        isSelected ? cssVar("primary-darker") : cssVar("text-secondary"),
      )}
      <ListItemText
        primary={t(item.labelKey)}
        primaryTypographyProps={{ variant: "body1" }}
      />
    </NavItemStyled>
  );
};

export default NavItem;
