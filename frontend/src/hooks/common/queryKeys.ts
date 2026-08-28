import { AnnouncementQueryType } from "src/types/announcement";

export const QUERY_KEYS = {
  announcements: {
    all: ["announcements"] as const,
    list: (query: AnnouncementQueryType) => ["announcements", query] as const,
    detail: (announcementId: number | undefined) =>
      ["announcement", announcementId] as const,
  },
  categories: {
    all: ["categories"] as const,
  },
} as const;
