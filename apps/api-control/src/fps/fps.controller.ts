import { FpsEntityType } from '@lib/data';
import { Subscribe } from '@lib/decorators';
import { WorkflowService } from '@lib/modules';
import { Controller } from '@nestjs/common';
import { Payload, RpcException } from '@nestjs/microservices';
import { appConfig } from '../common/config/config';
import { CreateFpsService } from '../common/flows/create-fps/create-fps.service';
import { CreateFpsDto } from './dto/create-fps.dto';

@Controller('fps')
export class FpsController {
  constructor(private workflowService: WorkflowService) {}

  @Subscribe(appConfig(), `fps:create`)
  async create(
    @Payload() createParams: CreateFpsDto,
  ): Promise<{ fps: FpsEntityType }> {
    const {
      state,
      context: { fps },
      errors,
    } = await this.workflowService.run<any>(createParams, [CreateFpsService]);

    // Handle errors
    if (state === 'failed') {
      const error = errors.length ? { ...errors[0]?.error } : null;

      throw new RpcException({
        code: error?.code,
        pattern: 'api:control:fps:create',
        message: error?.message,
        payload: error?.payload,
        tags: [],
      });
    }

    return { fps };
  }
}
