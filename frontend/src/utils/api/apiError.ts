import { AxiosError } from "axios";

const NOT_FOUND_STATUS = 404;

export const isNotFoundError = (error: unknown): boolean =>
  error instanceof AxiosError && error.response?.status === NOT_FOUND_STATUS;
