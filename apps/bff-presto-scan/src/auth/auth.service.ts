import { MessagingService, TokenService } from '@lib/modules';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(
    private messagingService: MessagingService,
    private tokenService: TokenService,
  ) {}

  async login({ username, password }: any) {
    const { user, status, validationSteps } =
      await this.messagingService.send<any>({
        app: 'API_CONTROL',
        pattern: 'users:login',
        payload: {
          username,
          password,
          consumer: 'iem',
          type: `iem-presto-scan`,
        },
      });

    // Generate token
    const token = this.tokenService.sign({
      userId: user._id,
      ups: user.ups,
      payload: {
        channels: { channel: 'ups', _id: user.ups },
      },
      createdAt: new Date(),
    });

    return {
      auth: {
        status,
        token,
        validationSteps,
      },
      user,
    };
  }

  async resetPassword({ username, newPassword, currentPassword }: any) {
    const { user, status } = await this.messagingService.send<any>({
      app: 'API_CONTROL',
      pattern: 'users:reset-password',
      payload: {
        consumer: 'iem',
        type: `iem-presto-scan`,
        username,
        currentPassword,
        newPassword,
      },
    });

    const token = this.tokenService.sign({
      userId: user._id,
      ups: user.ups,
      payload: {
        channels: { channel: 'ups', _id: user.ups },
      },
      createdAt: new Date(),
    });

    return {
      auth: {
        status,
        token,
      },
      user,
    };
  }
}
