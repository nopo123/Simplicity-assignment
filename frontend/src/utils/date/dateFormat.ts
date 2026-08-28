import dayjs, { Dayjs } from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { PUBLICATION_DATE_FORMAT } from "src/config/date.config";

dayjs.extend(customParseFormat);

export const formatPublicationDate = (isoDate: string): string =>
  dayjs(isoDate).format(PUBLICATION_DATE_FORMAT);

export const parsePublicationDate = (input: string): Dayjs =>
  dayjs(input, PUBLICATION_DATE_FORMAT, true);

export const isValidPublicationDate = (input: string): boolean =>
  parsePublicationDate(input).isValid();

export const publicationDateToIso = (input: string): string =>
  parsePublicationDate(input).toISOString();
