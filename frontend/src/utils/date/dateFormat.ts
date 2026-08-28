import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { PUBLICATION_DATE_FORMAT } from "src/config/date.config";

dayjs.extend(customParseFormat);

export const formatPublicationDate = (isoDate: string): string =>
  dayjs(isoDate).format(PUBLICATION_DATE_FORMAT);
