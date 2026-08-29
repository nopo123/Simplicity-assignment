import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import utc from "dayjs/plugin/utc";
import { PUBLICATION_DATE_FORMAT } from "src/config/date.config";

dayjs.extend(customParseFormat);
dayjs.extend(utc);

const DAY_FORMAT_OPTIONS: Intl.DateTimeFormatOptions = {
  day: "numeric",
  month: "short",
  year: "numeric",
};

const TIME_FORMAT_OPTIONS: Intl.DateTimeFormatOptions = {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
};

export const formatPublicationDate = (
  publicationDate: string,
  language: string,
): string => {
  const parsed = dayjs.utc(publicationDate, PUBLICATION_DATE_FORMAT, true);

  if (!parsed.isValid()) {
    return publicationDate;
  }

  return new Intl.DateTimeFormat(language, {
    ...DAY_FORMAT_OPTIONS,
    ...TIME_FORMAT_OPTIONS,
  }).format(parsed.toDate());
};

export const formatLastUpdate = (isoDate: string, language: string): string =>
  new Intl.DateTimeFormat(language, DAY_FORMAT_OPTIONS).format(
    new Date(isoDate),
  );

export const publicationDateToLocalInput = (
  publicationDate: string,
): string => {
  const parsed = dayjs.utc(publicationDate, PUBLICATION_DATE_FORMAT, true);

  if (!parsed.isValid()) {
    return publicationDate;
  }

  return parsed.local().format(PUBLICATION_DATE_FORMAT);
};

export const currentPublicationDateInput = (): string =>
  dayjs().format(PUBLICATION_DATE_FORMAT);

export const publicationDateToUtcPayload = (localInput: string): string => {
  const parsed = dayjs(localInput, PUBLICATION_DATE_FORMAT, true);

  if (!parsed.isValid()) {
    return localInput;
  }

  return parsed.utc().format(PUBLICATION_DATE_FORMAT);
};
