import { FrontGuard, LoginGuard } from '@lib/guards';
import { MessagingService } from '@lib/modules';
import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CreateFpsDto } from './dto/create-fps.dto';
import { FpsEntity } from './entities/fps.entity';

@UseGuards(FrontGuard, LoginGuard)
@Resolver(() => FpsEntity)
export class FpsResolver {
  constructor(private messagingService: MessagingService) {}

  @Mutation(() => FpsEntity)
  async createFps(
    @Args('input') input: CreateFpsDto,
  ): Promise<FpsEntity | null> {
    try {
      const { fps } = await this.messagingService.send<any>({
        app: 'API_CONTROL',
        pattern: 'fps:create',
        payload: input,
      });

      const { sessionId } = input;

      await this.messagingService.send({
        app: 'API_CONTROL',
        pattern: 'sessions:update',
        payload: {
          _id: sessionId,
          update: {
            controlState: 'FINED',
          },
        },
      });

      return fps;
    } catch (error) {
      console.error('shit happnd while creating a fine', error);
    }

    return null;
  }
}
