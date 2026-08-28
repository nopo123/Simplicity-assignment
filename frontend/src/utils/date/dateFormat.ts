import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import utc from "dayjs/plugin/utc";
import { PUBLICATION_DATE_FORMAT } from "src/config/date.config";

dayjs.extend(customParseFormat);
dayjs.extend(utc);

const DISPLAY_LOCALE = "en-US";
const DISPLAY_TIME_ZONE = "UTC";

const dayFormatter = new Intl.DateTimeFormat(DISPLAY_LOCALE, {
  timeZone: DISPLAY_TIME_ZONE,
  month: "short",
  day: "numeric",
  year: "numeric",
});

const timeFormatter = new Intl.DateTimeFormat(DISPLAY_LOCALE, {
  timeZone: DISPLAY_TIME_ZONE,
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

export const formatPublicationDate = (publicationDate: string): string => {
  const parsed = dayjs.utc(publicationDate, PUBLICATION_DATE_FORMAT, true);

  if (!parsed.isValid()) {
    return publicationDate;
  }

  const date = parsed.toDate();

  return `${dayFormatter.format(date)} ${timeFormatter.format(date)}`;
};

export const formatLastUpdate = (isoDate: string): string =>
  dayFormatter.format(new Date(isoDate));
