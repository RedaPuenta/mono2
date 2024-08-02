import { MessagingService } from '@lib/modules';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ResourcesService {
  constructor(private messagingService: MessagingService) {}

  async search(resourcesIds: any): Promise<{ list: any; paging: any }> {
    const { list, paging } = await this.messagingService.send<any>({
      app: 'API_TOOLS',
      pattern: 'resources:search',
      payload: resourcesIds,
    });
    return { list, paging };
  }
}
