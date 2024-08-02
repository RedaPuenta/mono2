import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsString } from 'class-validator';

export class HandleOldSessionsDto {
  @IsString()
  @ApiProperty({ type: String })
  lpn!: string;

  @IsMongoId()
  @ApiProperty({ type: String })
  upsId!: string;
}
