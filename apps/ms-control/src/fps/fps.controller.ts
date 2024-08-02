import { Subscribe } from '@lib/decorators';
import { Controller } from '@nestjs/common';
import { Payload } from '@nestjs/microservices';
import { appConfig } from '../common/config/config';
import { GenericController } from '../common/generics/generic.controller';
import { FpsService } from './fps.service';
import { Fps } from './schemas/fps.schema';

@Controller('fps')
export class FpsController extends GenericController<Fps> {
  constructor(protected service: FpsService) {
    super(service as any);
  }

  @Subscribe(appConfig(), `fps:create`)
  async create(@Payload() entity: Fps) {
    return super.create(entity);
  }
}
