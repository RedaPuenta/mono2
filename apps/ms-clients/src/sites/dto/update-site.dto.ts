import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { IsMongoId } from 'class-validator';
import { Site } from '../schemas/site.schema';

export class UpdateSiteDto extends PartialType(
  PickType(Site, [
    'terminalId',
    'name',
    'coordinates',
    'address1',
    'address2',
    'zipcode',
    'city',
    'country',
  ] as const),
) {
  @IsMongoId()
  @ApiProperty({ type: String })
  siteId!: string;
}
