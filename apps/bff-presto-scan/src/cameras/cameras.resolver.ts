import { FrontGuard, LoginGuard } from '@lib/guards';
import { UseGuards } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { CamerasService } from './cameras.service';
import { SearchControlCamerasDto } from './dto/search-control-cameras.dto';
import { ControlCameraEntity } from './entities/camera.entity';

@UseGuards(FrontGuard, LoginGuard)
@Resolver()
export class CamerasResolver {
  constructor(private service: CamerasService) {}

  // -------------------------
  // Get cameras list
  // -------------------------
  @Query(() => [ControlCameraEntity])
  async cameras(
    @Args() searchParams: SearchControlCamerasDto,
  ): Promise<{ cameras: [ControlCameraEntity] }> {
    const { upsId } = searchParams;
    const { cameras } = await this.service.search({
      ups: upsId,
      limit: 300,
      page: 1,
      order: 'code',
    });
    return cameras;
  }
}
