import { Navigate, Outlet, RouteObject } from "react-router-dom";
import {
  AnnouncementDetail,
  AnnouncementList,
  NotFoundPage,
} from "./sections";
import { PATHS } from "./paths";
import DashboardLayout from "src/layouts/dashboard/DashboardLayout";

const routes: RouteObject[] = [
  {
    element: (
      <DashboardLayout>
        <Outlet />
      </DashboardLayout>
    ),
    children: [
      {
        index: true,
        element: <Navigate to={PATHS.announcements.list} replace />,
      },
      {
        path: "announcements",
        children: [
          {
            index: true,
            element: <AnnouncementList />,
          },
          {
            path: "new",
            element: <AnnouncementDetail />,
          },
          {
            path: ":id",
            element: <AnnouncementDetail />,
          },
        ],
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
];

export default routes;
