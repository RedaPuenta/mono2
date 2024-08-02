import { Subscribe } from '@lib/decorators';
import { Controller } from '@nestjs/common';
import { Payload } from '@nestjs/microservices';
import { appConfig } from '../common/config/config';
import { Terminal } from './schemas/terminal.schema';
import { TerminalsService } from './terminals.service';

@Controller('terminals')
export class TerminalsController {
  constructor(private terminalsService: TerminalsService) {}

  @Subscribe(appConfig(), `terminals:search`)
  async search(
    @Payload() searchParams: any,
  ): Promise<{ list: any; paging: any }> {
    const { page, limit, order, ...searchData } = searchParams;
    const { list, paging } = await this.terminalsService.paging(searchData, {
      page,
      limit,
      order,
    });

    const renderedList = await this.terminalsService.render<Terminal[]>(list);

    return { list: renderedList, paging };
  }

  @Subscribe(appConfig(), `terminals:read`)
  async read(@Payload() readParams: any): Promise<{ terminal: Terminal }> {
    const terminal = await this.terminalsService.read<Terminal>(readParams);
    return { terminal };
  }

  @Subscribe(appConfig(), `terminals:update`)
  async update(@Payload() updateParams: any): Promise<{ terminal: Terminal }> {
    const { terminalId, ...dataToUpdate } = updateParams;

    const terminal = await this.terminalsService.update(
      terminalId,
      dataToUpdate,
    );

    const renderedTerminal = await this.terminalsService.render<Terminal>(
      terminal,
    );

    return { terminal: renderedTerminal };
  }

  @Subscribe(appConfig(), `terminals:create`)
  async create(
    @Payload() terminalParams: any,
  ): Promise<{ terminal: Terminal }> {
    const terminal = await this.terminalsService.createOne(terminalParams);
    const renderedTerminal = await this.terminalsService.render<Terminal>(
      terminal,
    );
    return { terminal: renderedTerminal };
  }
}
