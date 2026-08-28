import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import utc from "dayjs/plugin/utc";
import { PUBLICATION_DATE_FORMAT } from "src/config/date.config";

dayjs.extend(customParseFormat);
dayjs.extend(utc);

export enum PUBLICATION_DATE_ERROR {
  REQUIRED = "REQUIRED",
  FORMAT = "FORMAT",
  MONTH = "MONTH",
  DAY = "DAY",
  DAY_IN_MONTH = "DAY_IN_MONTH",
  HOUR = "HOUR",
  MINUTE = "MINUTE",
}

export type PublicationDateViolation = {
  readonly error: PUBLICATION_DATE_ERROR;
  readonly maxDay?: number;
};

export const PUBLICATION_DATE_PATTERN =
  /^(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2})$/;

export const PUBLICATION_DATE_MONTH_MIN = 1;
export const PUBLICATION_DATE_MONTH_MAX = 12;
export const PUBLICATION_DATE_DAY_MIN = 1;
export const PUBLICATION_DATE_DAY_MAX = 31;
export const PUBLICATION_DATE_HOUR_MAX = 23;
export const PUBLICATION_DATE_MINUTE_MAX = 59;

export const validatePublicationDate = (
  value: unknown,
): PublicationDateViolation | null => {
  if (typeof value !== "string" || value.trim().length === 0) {
    return { error: PUBLICATION_DATE_ERROR.REQUIRED };
  }

  const match = PUBLICATION_DATE_PATTERN.exec(value.trim());
  if (!match) {
    return { error: PUBLICATION_DATE_ERROR.FORMAT };
  }

  const month = Number(match[1]);
  const day = Number(match[2]);
  const hour = Number(match[4]);
  const minute = Number(match[5]);

  if (
    month < PUBLICATION_DATE_MONTH_MIN ||
    month > PUBLICATION_DATE_MONTH_MAX
  ) {
    return { error: PUBLICATION_DATE_ERROR.MONTH };
  }

  if (day < PUBLICATION_DATE_DAY_MIN || day > PUBLICATION_DATE_DAY_MAX) {
    return { error: PUBLICATION_DATE_ERROR.DAY };
  }

  const maxDay = dayjs
    .utc(`${match[3]}-${match[1]}-01`, "YYYY-MM-DD", true)
    .daysInMonth();
  if (day > maxDay) {
    return { error: PUBLICATION_DATE_ERROR.DAY_IN_MONTH, maxDay };
  }

  if (hour > PUBLICATION_DATE_HOUR_MAX) {
    return { error: PUBLICATION_DATE_ERROR.HOUR };
  }

  if (minute > PUBLICATION_DATE_MINUTE_MAX) {
    return { error: PUBLICATION_DATE_ERROR.MINUTE };
  }

  return null;
};

export const PUBLICATION_DATE_ERROR_TRANSLATION_KEY: Record<
  PUBLICATION_DATE_ERROR,
  string
> = {
  [PUBLICATION_DATE_ERROR.REQUIRED]:
    "announcements.validations.publicationDate.required",
  [PUBLICATION_DATE_ERROR.FORMAT]:
    "announcements.validations.publicationDate.format",
  [PUBLICATION_DATE_ERROR.MONTH]:
    "announcements.validations.publicationDate.month",
  [PUBLICATION_DATE_ERROR.DAY]: "announcements.validations.publicationDate.day",
  [PUBLICATION_DATE_ERROR.DAY_IN_MONTH]:
    "announcements.validations.publicationDate.dayInMonth",
  [PUBLICATION_DATE_ERROR.HOUR]:
    "announcements.validations.publicationDate.hour",
  [PUBLICATION_DATE_ERROR.MINUTE]:
    "announcements.validations.publicationDate.minute",
};
