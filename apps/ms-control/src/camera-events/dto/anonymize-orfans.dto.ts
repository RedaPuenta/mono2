import { PrestoScanConfigDeletionDelayComposeCV } from '@lib/data';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsMongoId,
  IsNotEmpty,
  ValidateNested,
} from 'class-validator';
export class UpsDeletionDelays {
  @IsMongoId()
  @ApiProperty({ type: String })
  upsId!: string;

  @Type(() => PrestoScanConfigDeletionDelayComposeCV)
  @ValidateNested({ each: true })
  @ApiProperty({ type: PrestoScanConfigDeletionDelayComposeCV })
  delays!: PrestoScanConfigDeletionDelayComposeCV;
}

export class AnonymizeOrfansDto {
  @IsArray()
  @IsNotEmpty()
  @ApiProperty({ type: [UpsDeletionDelays] })
  deletionDelays!: UpsDeletionDelays[];
}
