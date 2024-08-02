import { Controller } from '@nestjs/common';
import { Payload } from '@nestjs/microservices';
import { ClientsService } from '../clients/clients.service';

import { Subscribe } from '@lib/decorators';
import { Client } from '../clients/schemas/client.schema';
import { appConfig } from '../common/config/config';
import { Ups } from '../ups/schemas/ups.schema';
import { UpsService } from '../ups/ups.service';
import { UpdateSiteDto } from './dto/update-site.dto';
import { Site } from './schemas/site.schema';
import { SitesService } from './sites.service';

@Controller('sites')
export class SitesController {
  constructor(
    private sitesService: SitesService,
    private clientsService: ClientsService,
    private upsService: UpsService,
  ) {}

  @Subscribe(appConfig(), `sites:create`)
  async create(@Payload() createParams: any): Promise<{ site: Site }> {
    const { name = this.sitesService.generateSiteName(), ...createData } =
      createParams;

    const site = await this.sitesService.createOne({
      ...createData,
      name,
    });

    const renderedSite = await this.sitesService.render<Site>(site);
    return { site: renderedSite };
  }

  @Subscribe(appConfig(), `sites:read`)
  async read(@Payload() readParams: any): Promise<{ site: Site }> {
    const site = await this.sitesService.read<Site>(readParams);
    return { site };
  }

  @Subscribe(appConfig(), `sites:update`)
  async update(@Payload() updateParams: UpdateSiteDto): Promise<{ site: any }> {
    const { siteId, ...dataToUpdate } = updateParams;
    const site = await this.sitesService.update(siteId, dataToUpdate);
    const renderedSite = await this.sitesService.render<Site>(site);
    return { site: renderedSite };
  }

  @Subscribe(appConfig(), `sites:delete`)
  async delete(@Payload('siteId') siteId: string): Promise<{ delete: true }> {
    await this.sitesService.remove(siteId);
    return { delete: true };
  }

  @Subscribe(appConfig(), `sites:search`)
  async search(
    @Payload() searchParams: any,
  ): Promise<{ list: any; paging: any }> {
    const { page, limit, order, ...searchData } = searchParams;
    const { list, paging } = await this.sitesService.paging(searchData, {
      page,
      limit,
      order,
    });
    const renderedList = await this.sitesService.render<Site[]>(list);
    return { list: renderedList, paging };
  }

  @Subscribe(appConfig(), `sites:owned`)
  async owned(
    @Payload('clientId') clientId: string,
  ): Promise<{ siteIds: Array<string> }> {
    const ids = await this.sitesService.getIds({ clientId });
    return { siteIds: ids };
  }

  @Subscribe(appConfig(), `sites:config`)
  async config(@Payload('siteId') siteId: string) {
    // Get computed config
    const { site, config } = await this.sitesService.getSiteConfig(siteId);

    // Get separate entities
    const client = await this.clientsService.render<Client>(
      site.get('clientId'),
    );

    const ups = await this.upsService.render<Ups>(site.get('upsId'));

    const siteRendered = await this.sitesService.render<Site>(site, {
      fields: ['_id', 'config'],
    });

    return {
      computedConfig: config,
      site: siteRendered,
      ups,
      client,
    };
  }
}
