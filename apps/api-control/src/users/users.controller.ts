import { Subscribe } from '@lib/decorators';
import { MessagingService } from '@lib/modules';
import { Controller } from '@nestjs/common';
import { Payload } from '@nestjs/microservices';
import { appConfig } from '../common/config/config';
import { DeleteUsersDto } from './dto/delete-users.dto';
import { LoginUsersDto, LoginUsersResponseDto } from './dto/login-users.dto';
import { ReadUserDto } from './dto/read-user.dto';
import {
  SearchControlUserDto,
  SearchControlUserResponseDto,
} from './dto/search-users.dto';
import {
  UpdatePasswordDto,
  UpdatePasswordResponseDto,
} from './dto/update-password.dto';
import { UpdateControlUserDto } from './dto/update-users.dto';
import { ControlUser } from './entities/controlUser.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(
    private messagingService: MessagingService,
    private service: UsersService,
  ) {}

  @Subscribe(appConfig(), `users:login`)
  async login(
    @Payload() loginParams: LoginUsersDto,
  ): Promise<LoginUsersResponseDto> {
    const { user, status, validationSteps } = await this.service.login(
      loginParams,
    );

    return { user, status, validationSteps };
  }

  @Subscribe(appConfig(), `users:reset-password`)
  async resetPassword(
    @Payload() resetParams: any,
  ): Promise<{ user: ControlUser; status: string }> {
    const { consumer, type, username, currentPassword, newPassword } =
      resetParams;

    // Try to login at first to verify account
    const { user, validationSteps } = await this.service.login({
      consumer,
      type,
      username,
      password: currentPassword,
    });

    // Remove PASSWORD_CHANGE_REQUESTED from validation steps
    const newSteps = validationSteps.filter(
      (step: any) => step !== 'PASSWORD_CHANGE_REQUESTED',
    );

    // Update password and states
    const { account } = await this.messagingService.send<any>({
      app: 'API_ACCOUNT',
      pattern: 'update',
      payload: {
        accountId: user.accountId,
        state: 'UNVERIFIED',
        password: newPassword,
        validationSteps: newSteps,
      },
    });

    return { user, status: account.state };
  }

  @Subscribe(appConfig(), `users:search`)
  async search(
    @Payload() searchParams: SearchControlUserDto,
  ): Promise<SearchControlUserResponseDto> {
    const { list, paging } =
      await this.messagingService.send<SearchControlUserResponseDto>({
        app: 'MS_CONTROL',
        pattern: 'users:search',
        payload: searchParams,
      });

    return { list, paging };
  }

  @Subscribe(appConfig(), `users:read`)
  async read(
    @Payload() readParams: ReadUserDto,
  ): Promise<{ controlUser: ControlUser }> {
    const { userId } = readParams;
    const { controlUser } = await this.messagingService.send<{
      controlUser: ControlUser;
    }>({
      app: 'MS_CONTROL',
      pattern: 'users:read',
      payload: {
        userId,
      },
    });
    return { controlUser };
  }

  @Subscribe(appConfig(), `users:create`)
  async create(
    @Payload() createParams: any,
  ): Promise<{ controlUser: ControlUser }> {
    const {
      username,
      lang,
      firstName,
      lastName,
      password,
      fpsAgentId,
      fpsAgentName,
      upsId,
      consumer,
      phone = '',
    } = createParams;

    // Create account
    const { account } = await this.messagingService.send<any>({
      app: 'API_ACCOUNT',
      pattern: 'create',
      payload: {
        // TODO: pour le moment en dur
        consumer,
        type: 'iem-presto-scan',
        state: 'UNVERIFIED',
        lang,
        credential: {
          type: 'EMAIL',
          value: username,
        },
        password,
        validationSteps: ['PASSWORD_CHANGE_REQUESTED'],
      },
    });

    const { user } = await this.messagingService.send<any>({
      app: 'MS_CONTROL',
      pattern: 'users:create',
      payload: {
        accountId: account._id,
        username,
        firstName,
        lang,
        lastName,
        fpsAgentId,
        phone,
        fpsAgentName,
        upsId,
      },
    });

    return { controlUser: user };
  }

  @Subscribe(appConfig(), `users:update`)
  async update(
    @Payload() updateParams: UpdateControlUserDto,
  ): Promise<{ controlUser: ControlUser }> {
    const { userId, ...updateData } = updateParams;

    const { controlUser } = await this.messagingService.send<{
      controlUser: ControlUser;
    }>({
      app: 'MS_CONTROL',
      pattern: 'users:update',
      payload: {
        userId,
        ...updateData,
      },
    });

    if (updateData.password || updateData.lang) {
      const { password, lang } = updateData;
      const { accountId } = controlUser;
      await this.messagingService.send({
        app: 'API_ACCOUNT',
        pattern: 'update',
        payload: {
          accountId,
          password,
          lang,
        },
      });
    }

    return { controlUser };
  }

  @Subscribe(appConfig(), `users:delete`)
  async delete(
    @Payload() params: DeleteUsersDto,
  ): Promise<{ controlUser: ControlUser }> {
    const { userId } = params;

    const { controlUser } = await this.messagingService.send<{
      controlUser: ControlUser;
    }>({
      app: 'MS_CONTROL',
      pattern: 'users:delete',
      payload: {
        id: userId,
      },
    });

    return { controlUser };
  }

  @Subscribe(appConfig(), `users:password:update`)
  async updatePassword(
    @Payload() params: UpdatePasswordDto,
  ): Promise<UpdatePasswordResponseDto> {
    const { success } = await this.service.updatePassword(params);
    return { success };
  }
}
