import { applyDecorators } from '@nestjs/common';
import { Type } from '@nestjs/common/interfaces/type.interface';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import {
  ExceptionBadRequestDto,
  ExceptionInternalServerErrorDto,
  ExceptionNotFoundDto,
} from '../dto/exception.dto';

export const RestApiResponseArray = <TModel extends Type<any>>(
  model: TModel,
  description: string,
  okDescription: string,
  summary: string,
  groupName: string,
) => {
  return applyDecorators(
    ApiOperation({ summary, description }),
    ApiTags(groupName),
    ApiOkResponse({
      description: okDescription,
      isArray: true,
      type: model,
    }),
    ApiBadRequestResponse({
      description: 'Bad Request',
      type: ExceptionBadRequestDto,
    }),
    ApiNotFoundResponse({
      description: 'Not Found',
      type: ExceptionNotFoundDto,
    }),
    ApiInternalServerErrorResponse({
      description: 'Internal Server Error',
      type: ExceptionInternalServerErrorDto,
    }),
  );
};
