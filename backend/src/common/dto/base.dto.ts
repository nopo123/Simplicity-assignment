import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsNumber, Min } from 'class-validator';

export class IdBaseDto {
  @ApiProperty({
    description: 'Id of the entity',
    example: 1,
    type: Number,
    required: true,
    minimum: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  readonly id: number;
}
