import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { IsMongoId, IsOptional } from 'class-validator';
import { ControlUser } from '../schemas/control-user.schema';

export class UpdateControlUserDto extends PartialType(
  PickType(ControlUser, [
    'username',
    'lastName',
    'firstName',
    'fpsAgentId',
    'fpsAgentName',
    'fpsOrderCount',
    'phone',
    'lang',
    'ups',
  ] as const),
) {
  @IsMongoId()
  @ApiProperty({ type: String })
  userId!: string;
}
