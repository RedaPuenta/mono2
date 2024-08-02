import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsMongoId } from 'class-validator';

export class AnonymizeCameraEventsDto {
  @IsArray()
  @IsMongoId({ each: true })
  @ApiProperty({ type: [String] })
  ids!: string[];
}
