import { applyDecorators, Type } from '@nestjs/common';
import { ApiResponse, getSchemaPath } from '@nestjs/swagger';
import { ResponseDto } from '../../auth/dto/generic-response.dto';

export interface GenericApiResponseOption<TModel extends Type<any>> {
  model: TModel;
  // type: 'object' | 'array';
  statusCode?: number;
  description?: string;
  isArray?: boolean;
}

export const GenericApiResponse = (option: GenericApiResponseOption<Type>) => {
  const isArray = option.isArray || false;

  return applyDecorators(
    ApiResponse({
      status: option.statusCode,
      description: option.description,
      schema: {
        allOf: [
          { $ref: getSchemaPath(ResponseDto) },
          isArray
            ? {
                properties: {
                  data: {
                    type: 'array',
                    items: { $ref: getSchemaPath(option.model) },
                  },
                },
              }
            : {
                properties: {
                  data: {
                    type: 'object',
                    $ref: getSchemaPath(option.model),
                  },
                },
              },
        ],
      },
    }),
  );
};
