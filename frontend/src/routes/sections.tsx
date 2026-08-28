import { lazy } from "react";

export const AnnouncementList = lazy(
  () => import("src/pages/announcement/AnnouncementList"),
);

export const AnnouncementDetail = lazy(
  () => import("src/pages/announcement/AnnouncementDetail"),
);

export const NotFoundPage = lazy(() => import("src/pages/NotFoundPage"));
