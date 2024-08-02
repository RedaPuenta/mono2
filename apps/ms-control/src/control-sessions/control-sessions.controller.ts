import { Subscribe } from '@lib/decorators';
import { Controller } from '@nestjs/common';
import { Payload } from '@nestjs/microservices';
import { appConfig } from '../common/config/config';
import { GenericController } from '../common/generics/generic.controller';
import {
  DeleteDto,
  ReadDto,
  SearchDto,
  UpdateDto,
} from '../common/types/generic.dto';
import { ControlSessionsService } from './control-sessions.service';
import { HandleOldSessionsDto } from './dto/handle-old-sessions.dto';
import { ControlSession } from './schemas/control-sessions.schema';

@Controller('sessions')
export class ControlSessionController extends GenericController<ControlSession> {
  constructor(protected service: ControlSessionsService) {
    super(service);
  }

  @Subscribe(appConfig(), `sessions:create`)
  async create2(@Payload() entity: ControlSession) {
    const { created } = await super.create(entity);
    return { session: created };
  }

  @Subscribe(appConfig(), `sessions:search`)
  async search2(@Payload() dto: SearchDto<ControlSession>) {
    return super.search(dto);
  }
  @Subscribe(appConfig(), `sessions:read`)
  async read2(@Payload() dto: ReadDto) {
    const session = await super.read(dto);
    return { session };
  }
  @Subscribe(appConfig(), `sessions:update`)
  async update2(@Payload() dto: UpdateDto<ControlSession>) {
    const { updated } = await super.update(dto);
    return { session: updated };
  }
  @Subscribe(appConfig(), `sessions:delete`)
  async delete2(@Payload() dto: DeleteDto) {
    return super.delete(dto);
  }

  @Subscribe(appConfig(), `sessions:handle-old-sessions`)
  async old(@Payload() handleParams: HandleOldSessionsDto) {
    const { lpn, upsId } = handleParams;
    await this.service.handleOldSessions(lpn, upsId);
    return { updated: true };
  }
}
