import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { IsMongoId } from 'class-validator';
import { Client } from '../schemas/client.schema';

export class UpdateClientDto extends PartialType(
  PickType(Client, [
    'slug',
    'code',
    'name',
    'defaultContractTag',
    'defaultCurrency',
    'timezone',
    'locale',
    'siret',
    'config',
  ] as const),
) {
  @IsMongoId()
  @ApiProperty({ type: String })
  clientId!: string;
}
