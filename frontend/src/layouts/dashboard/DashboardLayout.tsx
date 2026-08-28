import { ReactNode } from "react";
import Nav from "./Nav";
import { useAnnouncementNotifications } from "src/hooks/announcements/useAnnouncementNotifications";
import {
  DashboardContentStyled,
  DashboardRootStyled,
} from "src/styles/customStyledComponent";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  useAnnouncementNotifications();

  return (
    <DashboardRootStyled>
      <Nav />
      <DashboardContentStyled>
        {children}
      </DashboardContentStyled>
    </DashboardRootStyled>
  );
};

export default DashboardLayout;
