import dayjs from "dayjs";
import { PUBLICATION_DATE_FORMAT } from "src/config/date.config";

export const formatPublicationDate = (isoDate: string): string =>
  dayjs(isoDate).format(PUBLICATION_DATE_FORMAT);
