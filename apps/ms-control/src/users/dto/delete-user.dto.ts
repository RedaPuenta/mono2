import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId } from 'class-validator';

export class DeleteUserDto {
  @IsMongoId()
  @ApiProperty({ type: String })
  id!: string;
}
