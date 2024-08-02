import { MessagingService } from '@lib/modules';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UpsService {
  constructor(private messagingService: MessagingService) {}

  async search(searchParams: any) {
    const { list, paging } = await this.messagingService.send<any>({
      app: 'API_ONSTREET',
      pattern: `ups:search`,
      payload: searchParams,
    });

    return { list, paging };
  }
}
