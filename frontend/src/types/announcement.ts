import { CategoryType } from "./category";

export enum ANNOUNCEMENT_SORT_BY {
  LAST_UPDATE = "LAST_UPDATE",
  PUBLICATION_DATE = "PUBLICATION_DATE",
  TITLE = "TITLE",
}

export enum SORT_ORDER {
  ASC = "ASC",
  DESC = "DESC",
}

export type AnnouncementType = {
  readonly id: number;
  readonly title: string;
  readonly body: string;
  readonly publicationDate: string;
  readonly categories: CategoryType[];
  readonly created: string;
  readonly updated: string;
};

export type AnnouncementListType = {
  readonly items: AnnouncementType[];
  readonly total: number;
  readonly page: number;
  readonly limit: number;
};

export type AnnouncementQueryType = {
  readonly search?: string;
  readonly categoryIds?: number[];
  readonly sortBy: ANNOUNCEMENT_SORT_BY;
  readonly sortOrder: SORT_ORDER;
  readonly page: number;
  readonly limit: number;
};

export type CreateAnnouncementType = {
  readonly title: string;
  readonly body: string;
  readonly publicationDate: string;
  readonly categoryIds: number[];
};

export type UpdateAnnouncementType = Partial<CreateAnnouncementType>;
