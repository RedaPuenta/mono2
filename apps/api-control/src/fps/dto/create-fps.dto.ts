import { ControlAgentComposeCV, FpsEntityCV } from '@lib/data';
import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsMongoId,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class Comment {
  @ApiProperty({ type: ControlAgentComposeCV })
  @Type(() => ControlAgentComposeCV)
  @ValidateNested({ each: true })
  agent!: ControlAgentComposeCV;

  @ApiProperty({ type: String })
  @IsDateString()
  creationDatetime!: string;

  @ApiProperty({ type: String })
  @IsString()
  text!: string;
}

export class Picture {
  @ApiProperty({ type: String })
  @IsString()
  data!: string; //flux de la photo encodé au format base 64

  @ApiProperty({ type: String })
  @IsString()
  mimeType!: string; // image/png ou image/jpeg ou image/jpg

  @ApiProperty({ type: String })
  @IsString()
  description!: string;

  @ApiProperty({ type: String })
  @IsString()
  @IsDateString()
  pictureDatetime!: string;

  @ApiProperty({ type: String })
  @IsString()
  contentURL!: string; // link to the picture, can replace the "data" field
}

export class CreateFpsDto extends PickType(FpsEntityCV, [
  'terminalId',
  'licensePlate',
  'vehicle',
  'parkId',
  'statementDatetime',
  'paymentStatus',
  'type',
  'rootFineLegalId',
] as const) {
  @ApiProperty({ type: String })
  @IsMongoId()
  sessionId!: string;

  @ApiProperty({ type: String })
  @IsMongoId()
  upsId!: string; //yoonite upsId used to get p1000 config

  @ApiProperty({ type: String })
  @IsMongoId()
  userId!: string; //id of connected user creating the fps

  @ApiProperty({ type: Array })
  @ValidateNested({ each: true })
  payments!: []; //Optionnel todo

  @ApiPropertyOptional({ type: [Comment] })
  @IsOptional()
  @ValidateNested({ each: true })
  comments?: [Comment] | null;

  @ApiPropertyOptional({ type: [Picture] })
  @IsOptional()
  @ValidateNested({ each: true })
  pictures?: [Picture] | null;
}
