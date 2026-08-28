import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ExceptionBaseDto {
  @ApiProperty({
    description: 'Human readable description of what went wrong',
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

export class ExceptionBadRequestDto extends ExceptionBaseDto {
  @ApiProperty({ example: 400, type: Number, required: true })
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  readonly statusCode: number;
}

export class ExceptionNotFoundDto extends ExceptionBaseDto {
  @ApiProperty({ example: 404, type: Number, required: true })
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  readonly statusCode: number;
}

export class ExceptionInternalServerErrorDto extends ExceptionBaseDto {
  @ApiProperty({ example: 500, type: Number, required: true })
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  readonly statusCode: number;
}
