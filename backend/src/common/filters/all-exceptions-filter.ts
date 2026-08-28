import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import dayjs from 'dayjs';
import { formatErrorForLog } from '../helpers/error-log.helper';

const INTERNAL_SERVER_ERROR_MESSAGE = 'Internal server error';

const resolveClientMessage = (exception: unknown, status: number): string => {
  if (status === 500 || !(exception instanceof HttpException)) {
    return INTERNAL_SERVER_ERROR_MESSAGE;
  }

  const exceptionResponse = exception.getResponse();
  if (
    typeof exceptionResponse === 'object' &&
    exceptionResponse !== null &&
    'message' in exceptionResponse
  ) {
    return String((exceptionResponse as { message: unknown }).message);
  }

  return exception.message;
};

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException ? exception.getStatus() : 500;

    const shouldLog =
      process.env.APP_ENV !== 'test' ||
      process.env.CONSOLE_LOG_ERROR_IN_TESTS === 'true';
    if (shouldLog) {
      this.logger.error(formatErrorForLog(exception, request, status));
    }

    response.status(status).json({
      statusCode: status,
      message: resolveClientMessage(exception, status),
      timestamp: dayjs().toISOString(),
    });
  }
}
