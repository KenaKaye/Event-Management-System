import { applyDecorators } from '@nestjs/common';
import { ApiResponse, ApiOperation } from '@nestjs/swagger';

export const ApiStandardResponse = (description: string) => {
  return applyDecorators(
    ApiOperation({ description }),
    ApiResponse({
      status: 200,
      description: 'Request was successful',
    }),
    ApiResponse({
      status: 400,
      description: 'Bad Request',
    }),
    ApiResponse({
      status: 500,
      description: 'Internal Server Error',
    }),
  );
};