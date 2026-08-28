import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class TranslationDto {
  @ApiProperty({
    example: 'City',
    description: 'English translation',
    type: String,
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @Type(() => String)
  readonly en: string;

  @ApiProperty({
    example: 'Mesto',
    description: 'Slovak translation',
    type: String,
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @Type(() => String)
  readonly sk: string;
}
