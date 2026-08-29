import {
  AnnouncementType,
  CreateAnnouncementType,
} from "src/types/announcement";
import { AnnouncementFormValues } from "../types/announcementForm";
import {
  currentPublicationDateInput,
  publicationDateToLocalInput,
  publicationDateToUtcPayload,
} from "src/utils/date/dateFormat";

export const mapAnnouncementToFormValues = (
  announcement: AnnouncementType | undefined,
): AnnouncementFormValues => ({
  title: announcement?.title ?? "",
  body: announcement?.body ?? "",
  categoryIds: announcement?.categories.map((category) => category.id) ?? [],
  publicationDate: announcement
    ? publicationDateToLocalInput(announcement.publicationDate)
    : currentPublicationDateInput(),
});

export const mapFormValuesToPayload = (
  values: AnnouncementFormValues,
): CreateAnnouncementType => ({
  title: values.title.trim(),
  body: values.body.trim(),
  categoryIds: values.categoryIds,
  publicationDate: publicationDateToUtcPayload(values.publicationDate.trim()),
});
