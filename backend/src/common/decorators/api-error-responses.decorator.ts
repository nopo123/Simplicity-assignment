import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { ExceptionDto } from '../dto/exception.dto';

export const apiErrorResponses = () => [
  ApiBadRequestResponse({
    description: 'Bad Request',
    type: ExceptionDto,
  }),
  ApiNotFoundResponse({
    description: 'Not Found',
    type: ExceptionDto,
  }),
  ApiInternalServerErrorResponse({
    description: 'Internal Server Error',
    type: ExceptionDto,
  }),
];
