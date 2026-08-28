import {
  AnnouncementType,
  CreateAnnouncementType,
} from "src/types/announcement";
import { AnnouncementFormValues } from "../types/announcementForm";
import {
  formatPublicationDate,
  publicationDateToIso,
} from "src/utils/date/dateFormat";

export const mapAnnouncementToFormValues = (
  announcement: AnnouncementType | undefined,
): AnnouncementFormValues => ({
  title: announcement?.title ?? "",
  body: announcement?.body ?? "",
  categoryIds: announcement?.categories.map((category) => category.id) ?? [],
  publicationDate: announcement
    ? formatPublicationDate(announcement.publicationDate)
    : "",
});

export const mapFormValuesToPayload = (
  values: AnnouncementFormValues,
): CreateAnnouncementType => ({
  title: values.title.trim(),
  body: values.body.trim(),
  categoryIds: values.categoryIds,
  publicationDate: publicationDateToIso(values.publicationDate),
});
