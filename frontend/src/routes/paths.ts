export const PATHS = {
  announcements: {
    list: "/announcements",
    new: "/announcements/new",
    detail: (announcementId: number) => `/announcements/${announcementId}`,
  },
} as const;
