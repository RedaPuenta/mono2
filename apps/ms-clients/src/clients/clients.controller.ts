import { Subscribe } from '@lib/decorators';
import { Controller } from '@nestjs/common';
import { Payload } from '@nestjs/microservices';
import { appConfig } from '../common/config/config';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { Client } from './schemas/client.schema';

@Controller('clients')
export class ClientsController {
  constructor(private clientsService: ClientsService) {}

  @Subscribe(appConfig(), `search`)
  async search(
    @Payload() searchParams: any,
  ): Promise<{ list: any; paging: any }> {
    const { page, limit, order, ...searchData } = searchParams;
    const { list, paging } = await this.clientsService.paging(searchData, {
      page,
      limit,
      order,
    });

    const formatedList = await this.clientsService.render<Client[]>(list);

    return { list: formatedList, paging };
  }

  @Subscribe(appConfig(), `read`)
  async read(@Payload() readParams: any): Promise<{ client: Client }> {
    const client = await this.clientsService.read<Client>(readParams);
    return { client };
  }

  @Subscribe(appConfig(), `update`)
  async update(
    @Payload() updateParams: UpdateClientDto,
  ): Promise<{ client: Client }> {
    const { clientId, ...dataToUpdate } = updateParams;

    const clientUpdate = await this.clientsService.update(
      clientId,
      dataToUpdate,
    );

    const formatedClient = await this.clientsService.render<Client>(
      clientUpdate,
    );

    return { client: formatedClient };
  }

  @Subscribe(appConfig(), `upsert`)
  async upsert(
    @Payload() upsertParams: CreateClientDto | UpdateClientDto,
  ): Promise<{ client: Client }> {
    const { slug } = upsertParams;
    const existingClient = await this.clientsService.findOne({ slug });

    if (existingClient) {
      const clientId = existingClient.get('id');
      return this.update({ clientId, ...upsertParams } as UpdateClientDto);
    }

    return this.create(upsertParams as CreateClientDto);
  }

  @Subscribe(appConfig(), `create`)
  async create(
    @Payload() createParams: CreateClientDto,
  ): Promise<{ client: Client }> {
    const { config, ...createData } = createParams;
    const { ticketsHub = { system: 'iem' }, ...otherConfigs } = config || {};

    const client = await this.clientsService.createOne({
      ...createData,
      config: { ticketsHub, ...otherConfigs },
    });

    const formatedClient = await this.clientsService.render<Client>(client);

    return { client: formatedClient };
  }
}
