import { Subscribe } from '@lib/decorators';
import { UtilService } from '@lib/modules';
import { Controller } from '@nestjs/common';
import { Payload } from '@nestjs/microservices';
import { appConfig } from '../common/config/config';
import { UpdateOccupancyDto } from './dto/update-occupancy.dto';
import { Ups } from './schemas/ups.schema';
import { UpsDeletionDelays } from './types/ups-deletion-delays';
import { UpsWithConfig } from './types/ups-with-config.entity';
import { UpsService } from './ups.service';

@Controller('ups')
export class UpsController {
  constructor(
    private upsService: UpsService,
    private utilService: UtilService,
  ) {}

  @Subscribe(appConfig(), `ups:upsert`)
  async upsert(@Payload() upsertParams: any): Promise<{ ups: Ups }> {
    const { code } = upsertParams;
    const ups = await this.upsService.upsert({ code }, upsertParams);
    const renderedUps = await this.upsService.render<Ups>(ups);
    return { ups: renderedUps };
  }

  @Subscribe(appConfig(), `ups:read`)
  async read(@Payload() readParams: any): Promise<{ ups: Ups }> {
    const ups = await this.upsService.read<Ups>(readParams);
    return { ups };
  }

  @Subscribe(appConfig(), `ups:delete`)
  async delete(@Payload('upsId') upsId: any): Promise<{ delete: true }> {
    await this.upsService.remove(upsId);
    return { delete: true };
  }

  @Subscribe(appConfig(), `ups:create`)
  async create(@Payload() createParams: any): Promise<{ ups: Ups }> {
    const ups = await this.upsService.createOne(createParams);
    const renderedUps = await this.upsService.render<Ups>(ups);
    return { ups: renderedUps };
  }

  @Subscribe(appConfig(), `ups:update`)
  async update(@Payload() updateParams: any): Promise<{ ups: Ups }> {
    const { upsId, ...dataToUpdate } = updateParams;
    const upsOld = await this.upsService.read<Ups>(upsId);
    const mergedDataToUpdate = this.utilService.deepMerge(upsOld, dataToUpdate);
    const ups = await this.upsService.update(upsId, mergedDataToUpdate);
    const renderedUps = await this.upsService.render<Ups>(ups);
    return { ups: renderedUps };
  }

  @Subscribe(appConfig(), `ups:search`)
  async search(
    @Payload() searchParams: any,
  ): Promise<{ list: Array<Ups>; paging: any }> {
    const { page, limit, order, ...searchData } = searchParams;
    const { list, paging } = await this.upsService.paging(searchData, {
      page,
      limit,
      order,
    });
    const renderedUps = await this.upsService.render<Ups[]>(list);
    return { list: renderedUps, paging };
  }

  // --------------------
  // Geo search UPS (without paging)
  // Rendered with "computedConfig"
  // --------------------
  @Subscribe(appConfig(), `ups:find`)
  async find(
    @Payload() findParams: any,
  ): Promise<{ list: Array<UpsWithConfig> }> {
    const list = (await this.upsService.findWithConfig(findParams)) as any;
    return { list };
  }

  // --------------------
  // Get UPS final configuration
  // --------------------
  @Subscribe(appConfig(), `ups:config`)
  async config(@Payload('upsId') upsId: string): Promise<UpsWithConfig> {
    // Get computed config
    const { ups, client, computedConfig } =
      (await this.upsService.getUpsWithConfig(upsId)) as any;

    return {
      ups,
      client,
      computedConfig,
    };
  }

  @Subscribe(appConfig(), `ups:deletion-delays`)
  async fetchDeletionDelays(): Promise<UpsDeletionDelays[]> {
    return this.upsService.fetchDeletionDelays();
  }

  @Subscribe(appConfig(), `ups:update-occupancy`)
  async updateOccupancy(
    @Payload() { upsId, delta }: UpdateOccupancyDto,
  ): Promise<boolean> {
    const { occupancy } = await this.upsService.read<Ups>(upsId);
    let newOccupancy = (occupancy || 0) + delta;
    if (newOccupancy < 0) newOccupancy = 0;
    await this.upsService.update(upsId, {
      occupancy: newOccupancy,
    });
    return true;
  }
}
