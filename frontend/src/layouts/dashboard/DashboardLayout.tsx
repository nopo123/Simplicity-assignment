import { ReactNode } from "react";
import ContentHeader from "./ContentHeader";
import Nav from "./Nav";
import { useAnnouncementNotifications } from "src/hooks/announcements/useAnnouncementNotifications";
import {
  DashboardContentStyled,
  DashboardRootStyled,
  NavSidebarStyled,
} from "src/styles/customStyledComponent";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  useAnnouncementNotifications();

  return (
    <DashboardRootStyled>
      <NavSidebarStyled>
        <Nav />
      </NavSidebarStyled>
      <DashboardContentStyled>
        <ContentHeader />
        {children}
      </DashboardContentStyled>
    </DashboardRootStyled>
  );
};

export default DashboardLayout;
