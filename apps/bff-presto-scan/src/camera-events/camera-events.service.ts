import { MessagingService } from '@lib/modules';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CameraEventsService {
  constructor(private messagingService: MessagingService) {}

  // -------------------------
  // Search events
  // -------------------------
  async search(searchParams: any) {
    const { upsId, ...searchData } = searchParams;
    const channels = [{ channel: 'ups', _id: upsId }];

    const { list, paging } = await this.messagingService.send<any>({
      app: 'API_CONTROL',
      pattern: 'camera-events:search',
      payload: {
        ...searchData,
        channels,
      },
    });
    return { list, paging };
  }

  // -------------------------
  // Get an event
  // -------------------------
  async read(cameraEventId: any): Promise<{ cameraEvent: any }> {
    const { cameraEvent } = await this.messagingService.send<any>({
      app: 'API_CONTROL',
      pattern: 'camera-events:read',
      payload: {
        cameraEventId,
      },
    });
    return { cameraEvent };
  }
}
