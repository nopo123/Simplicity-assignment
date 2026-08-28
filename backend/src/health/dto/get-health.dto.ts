import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsIn, IsNotEmpty, IsString } from 'class-validator';

export class GetHealthDto {
  @ApiProperty({
    example: 'ok',
    description:
      'Overall service state — ok when the database answers, degraded when it does not',
    enum: ['ok', 'degraded'],
    type: String,
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @IsIn(['ok', 'degraded'])
  @Type(() => String)
  readonly status: string;

  @ApiProperty({
    example: true,
    description: 'Whether a trivial query against the database succeeded',
    type: Boolean,
    required: true,
  })
  @IsNotEmpty()
  @IsBoolean()
  @Type(() => Boolean)
  readonly database: boolean;

  @ApiProperty({
    example: '2026-08-28T10:15:30.000Z',
    description: 'Moment the probe ran, in ISO 8601',
    type: String,
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @Type(() => String)
  readonly timestamp: string;
}
