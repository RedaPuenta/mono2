import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId } from 'class-validator';

export class DeleteUsersDto {
  @ApiProperty({ type: String })
  @IsMongoId()
  userId!: string;
}
