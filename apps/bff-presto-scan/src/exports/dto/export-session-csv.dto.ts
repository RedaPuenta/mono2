import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsString } from 'class-validator';

export class ExportSessionCsvDto {
  @IsDateString()
  @ApiProperty({ type: String })
  startDate!: string;

  @IsDateString()
  @ApiProperty({ type: String })
  endDate!: string;

  @IsString()
  @ApiProperty({ type: String })
  upsId!: string;
}
