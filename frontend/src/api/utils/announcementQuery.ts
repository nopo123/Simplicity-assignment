import { AnnouncementQueryType } from "src/types/announcement";

export const buildAnnouncementQueryString = (
  query: AnnouncementQueryType,
): string => {
  const searchParams = new URLSearchParams();

  if (query.search) {
    searchParams.set("search", query.search);
  }

  if (query.categoryIds?.length) {
    searchParams.set("categoryIds", query.categoryIds.join(","));
  }

  searchParams.set("sortBy", query.sortBy);
  searchParams.set("sortOrder", query.sortOrder);
  searchParams.set("page", String(query.page));
  searchParams.set("limit", String(query.limit));

  return `?${searchParams.toString()}`;
};
