import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ExceptionDto {
  @ApiProperty({
    example: 400,
    description: 'Http status code of the failure',
    type: Number,
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  readonly statusCode: number;

  @ApiProperty({
    description:
      'Human readable description of what went wrong. Validation failures list every violated rule, separated by commas.',
    type: String,
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @Type(() => String)
  readonly message: string;

  @ApiProperty({
    example: '2026-08-28T10:15:30.000Z',
    description: 'Moment the error was produced, in ISO 8601',
    type: String,
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @Type(() => String)
  readonly timestamp: string;
}
