import { TFunction } from "i18next";
import * as Yup from "yup";
import {
  ANNOUNCEMENT_BODY_MAX_LENGTH,
  ANNOUNCEMENT_TITLE_MAX_LENGTH,
} from "./config/announcement.config";
import {
  PUBLICATION_DATE_DAY_MAX,
  PUBLICATION_DATE_DAY_MIN,
  PUBLICATION_DATE_ERROR_TRANSLATION_KEY,
  PUBLICATION_DATE_HOUR_MAX,
  PUBLICATION_DATE_MINUTE_MAX,
  PUBLICATION_DATE_MONTH_MAX,
  PUBLICATION_DATE_MONTH_MIN,
  validatePublicationDate,
} from "src/utils/date/publicationDateValidation";
import { PUBLICATION_DATE_FORMAT } from "src/config/date.config";

const padded = (value: number): string => String(value).padStart(2, "0");

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

    publicationDate: Yup.string().test(
      "publication-date",
      "",
      function publicationDateTest(value) {
        const violation = validatePublicationDate(value);
        if (!violation) return true;

        return this.createError({
          message: t(
            PUBLICATION_DATE_ERROR_TRANSLATION_KEY[violation.error],
            {
              format: PUBLICATION_DATE_FORMAT,
              monthMin: padded(PUBLICATION_DATE_MONTH_MIN),
              monthMax: PUBLICATION_DATE_MONTH_MAX,
              dayMin: padded(PUBLICATION_DATE_DAY_MIN),
              dayMax: PUBLICATION_DATE_DAY_MAX,
              hourMax: PUBLICATION_DATE_HOUR_MAX,
              minuteMax: PUBLICATION_DATE_MINUTE_MAX,
              maxDay: violation.maxDay,
            },
          ),
        });
      },
    ),
  });
