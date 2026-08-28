import { Request } from 'express';

export const formatErrorForLog = (
  exception: unknown,
  request: Request,
  status: number,
): string => {
  const route = `${request.method} ${request.url}`;
  const detail =
    exception instanceof Error
      ? `${exception.message}\n${exception.stack}`
      : JSON.stringify(exception);

  return `[${status}] ${route} — ${detail}`;
};
