import { MessagingService } from '@lib/modules';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UpdateUPSOccupancyDto } from './dto/update-ups-occupancy.dto';
import { UpsEntity } from './entities/ups.entity';

@Resolver(() => UpsEntity)
export class UpsResolver {
  constructor(private messagingService: MessagingService) {}

  @Query(() => UpsEntity)
  async ups(@Args('id') id: string): Promise<UpsEntity> {
    const { ups } = await this.messagingService.send<{ ups: UpsEntity }>({
      app: 'API_ONSTREET',
      pattern: 'ups:read',
      payload: {
        _id: id,
      },
    });
    return ups;
  }

  @Mutation(() => Boolean)
  async updateUpsOccupancy(@Args() updateOccupancyDto: UpdateUPSOccupancyDto) {
    await this.messagingService.send({
      app: 'API_ONSTREET',
      pattern: 'ups:update-occupancy',
      payload: updateOccupancyDto,
    });

    return true;
  }
}
