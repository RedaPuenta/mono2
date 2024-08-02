import { MessagingService } from '@lib/modules';
import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { LoginUsersDto } from './dto/login-users.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Injectable()
export class UsersService {
  constructor(private messagingService: MessagingService) {}

  async login(loginParams: LoginUsersDto) {
    const { username, password, consumer, type } = loginParams;

    const { found, account } = await this.messagingService.send<any>({
      app: 'API_ACCOUNT',
      pattern: 'login',
      payload: {
        consumer,
        type,
        credential: { type: 'EMAIL', value: username },
        password,
      },
    });

    if (!found)
      throw new RpcException({
        code: 'ACTR_2',
        message: 'Incorrect credential',
      });

    // Get motorist informations
    const { user } = await this.messagingService.send<any>({
      app: 'MS_CONTROL',
      pattern: 'users:exists',
      payload: {
        accountId: account._id,
      },
    });

    if (!user)
      throw new RpcException({
        code: 'ACTR_2',
        message: 'Incorrect credential',
      });

    const { validationSteps } = account;

    return { user, status: account.state, validationSteps };
  }

  // --------------------
  // --------------------
  async updatePassword({
    currentPassword,
    newPassword,
    userId,
  }: UpdatePasswordDto): Promise<{ success: boolean }> {
    const { controlUser: user } = await this.messagingService.send<any>({
      app: 'MS_CONTROL',
      pattern: 'users:read',
      payload: {
        userId,
      },
    });

    const { success } = await this.messagingService.send<any>({
      app: 'API_ACCOUNT',
      pattern: 'password-update',
      payload: {
        currentPassword,
        newPassword,
        accountId: user.accountId,
      },
    });

    return { success };
  }
}
