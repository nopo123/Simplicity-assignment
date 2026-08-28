import { TFunction } from "i18next";
import { ANNOUNCEMENT_SORT_BY } from "src/types/announcement";

type AnnouncementColumnConfig = {
  readonly key: string;
  readonly labelKey: string;
  readonly sortBy?: ANNOUNCEMENT_SORT_BY;
};

const ANNOUNCEMENT_COLUMNS: readonly AnnouncementColumnConfig[] = [
  {
    key: "title",
    labelKey: "announcements.table.title",
    sortBy: ANNOUNCEMENT_SORT_BY.TITLE,
  },
  {
    key: "publicationDate",
    labelKey: "announcements.table.publicationDate",
    sortBy: ANNOUNCEMENT_SORT_BY.PUBLICATION_DATE,
  },
  {
    key: "lastUpdate",
    labelKey: "announcements.table.lastUpdate",
    sortBy: ANNOUNCEMENT_SORT_BY.LAST_UPDATE,
  },
  {
    key: "categories",
    labelKey: "announcements.table.categories",
  },
] as const;

export const buildAnnouncementColumns = (t: TFunction) =>
  ANNOUNCEMENT_COLUMNS.map((column) => ({
    key: column.key,
    label: t(column.labelKey),
    sortBy: column.sortBy,
  }));
