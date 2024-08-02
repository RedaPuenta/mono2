import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsString } from 'class-validator';

export class ReadUserDto {
  @ApiProperty({ type: String })
  @IsMongoId()
  userId!: string;
}
