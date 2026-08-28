import { TFunction } from "i18next";
import * as Yup from "yup";
import {
  ANNOUNCEMENT_BODY_MAX_LENGTH,
  ANNOUNCEMENT_TITLE_MAX_LENGTH,
} from "./config/announcement.config";
import { PUBLICATION_DATE_FORMAT } from "src/config/date.config";
import { isValidPublicationDate } from "src/utils/date/dateFormat";

export const createValidationSchema = (t: TFunction) =>
  Yup.object({
    title: Yup.string()
      .trim()
      .required(t("announcements.validations.title.required"))
      .max(
        ANNOUNCEMENT_TITLE_MAX_LENGTH,
        t("announcements.validations.title.maxLength", {
          max: ANNOUNCEMENT_TITLE_MAX_LENGTH,
        }),
      ),

    body: Yup.string()
      .trim()
      .required(t("announcements.validations.body.required"))
      .max(
        ANNOUNCEMENT_BODY_MAX_LENGTH,
        t("announcements.validations.body.maxLength", {
          max: ANNOUNCEMENT_BODY_MAX_LENGTH,
        }),
      ),

    categoryIds: Yup.array()
      .of(Yup.number().integer().positive())
      .min(1, t("announcements.validations.categoryIds.required"))
      .required(t("announcements.validations.categoryIds.required")),

    publicationDate: Yup.string()
      .required(t("announcements.validations.publicationDate.required"))
      .test(
        "publication-date-format",
        t("announcements.validations.publicationDate.format", {
          format: PUBLICATION_DATE_FORMAT,
        }),
        (value) => isValidPublicationDate(value ?? ""),
      ),
  });
