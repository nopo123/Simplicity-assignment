import { useCallback, useState } from "react";
import Drawer from "@mui/material/Drawer";
import Nav from "./Nav";
import { DIMENSIONS } from "src/config/config";
import {
  ContentHeaderStyled,
  MobileMenuButtonStyled,
} from "src/styles/customStyledComponent";
import { icon } from "src/utils/style/svgIcon";

const ContentHeader = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);

  const handleOpenNav = useCallback(() => setIsNavOpen(true), []);

  const handleCloseNav = useCallback(() => setIsNavOpen(false), []);

  return (
    <ContentHeaderStyled>
      <MobileMenuButtonStyled aria-label="open navigation" onClick={handleOpenNav}>
        {icon("menu", DIMENSIONS.ICON_SIZE, DIMENSIONS.ICON_SIZE)}
      </MobileMenuButtonStyled>

      <Drawer open={isNavOpen} onClose={handleCloseNav}>
        <Nav onNavigate={handleCloseNav} />
      </Drawer>
    </ContentHeaderStyled>
  );
};

export default ContentHeader;
