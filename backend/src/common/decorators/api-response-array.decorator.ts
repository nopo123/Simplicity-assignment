import { applyDecorators } from '@nestjs/common';
import { Type } from '@nestjs/common/interfaces/type.interface';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { apiErrorResponses } from './api-error-responses.decorator';

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
    ...apiErrorResponses(),
  );
};
