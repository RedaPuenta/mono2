import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsString } from 'class-validator';

export class ReadUserDto {
  @IsMongoId()
  @ApiProperty({ type: String })
  userId!: string;
}
