import { MessagingService } from '@lib/modules';
import { Injectable } from '@nestjs/common';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Injectable()
export class ControlUsersService {
  constructor(private messagingService: MessagingService) {}

  async read(userId: any): Promise<{ controlUser: any }> {
    const { controlUser } = await this.messagingService.send<any>({
      app: 'API_CONTROL',
      pattern: 'users:read',
      payload: { userId },
    });

    return { controlUser };
  }

  async updatePassword({
    userId,
    newPassword,
    currentPassword,
  }: { userId: string } & UpdatePasswordDto) {
    return this.messagingService.send<any>({
      app: 'API_CONTROL',
      pattern: `password:update`,
      payload: {
        userId,
        newPassword,
        currentPassword,
      },
    });
  }
}
