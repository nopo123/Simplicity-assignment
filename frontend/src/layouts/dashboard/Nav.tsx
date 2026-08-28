import Typography from "@mui/material/Typography";
import { useTranslation } from "react-i18next";
import NavItem from "./NavItem";
import { NAV_CONFIG, ORGANIZATION_NAME } from "./config-navigation";
import {
  NavBrandAvatarStyled,
  NavBrandStyled,
  NavRootStyled,
} from "src/styles/customStyledComponent";

interface NavProps {
  onNavigate?: () => void;
}

const Nav = ({ onNavigate }: NavProps) => {
  const { t } = useTranslation();

  return (
    <NavRootStyled>
      <NavBrandStyled>
        <NavBrandAvatarStyled>
          {ORGANIZATION_NAME.charAt(0)}
        </NavBrandAvatarStyled>
        <Typography variant="subtitle2" color="text.primary">
          {ORGANIZATION_NAME}
        </Typography>
      </NavBrandStyled>

      {NAV_CONFIG.map((item) => (
        <NavItem
          key={item.value}
          item={item}
          t={t}
          onNavigate={onNavigate}
        />
      ))}
    </NavRootStyled>
  );
};

export default Nav;
