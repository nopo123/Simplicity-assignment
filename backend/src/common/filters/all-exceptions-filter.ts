import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import dayjs from 'dayjs';
import { formatErrorForLog } from '../helpers/error-log.helper';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException ? exception.getStatus() : 500;
    const exceptionResponse =
      exception instanceof HttpException ? exception.getResponse() : null;

    let clientMessage = 'Internal server error';

    if (
      exception instanceof HttpException &&
      !(exception instanceof InternalServerErrorException) &&
      status !== 500
    ) {
      if (
        typeof exceptionResponse === 'object' &&
        exceptionResponse !== null &&
        'message' in exceptionResponse
      ) {
        clientMessage = (exceptionResponse as { message: string }).message;
      } else {
        clientMessage = exception.message;
      }
    }

    const shouldLog =
      process.env.APP_ENV !== 'test' ||
      process.env.CONSOLE_LOG_ERROR_IN_TESTS === 'true';
    if (shouldLog) {
      this.logger.error(formatErrorForLog(exception, request, status));
    }

    response.status(status).json({
      statusCode: status,
      message: clientMessage,
      timestamp: dayjs().toISOString(),
    });
  }
}
