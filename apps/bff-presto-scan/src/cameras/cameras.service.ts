import { MessagingService } from '@lib/modules';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CamerasService {
  constructor(private messagingService: MessagingService) {}

  // -------------------------
  // Search cameras
  // -------------------------
  async search(searchParams: any) {
    const { list } = await this.messagingService.send<any>({
      app: 'API_CONTROL',
      pattern: 'cameras:search',
      payload: searchParams,
    });
    return { cameras: list };
  }

  // -------------------------
  // Get a camera
  // -------------------------
  async read(cameraId: any): Promise<{ camera: any }> {
    const { camera } = await this.messagingService.send<any>({
      app: 'API_CONTROL',
      pattern: 'cameras:read',
      payload: { cameraId },
    });
    return { camera };
  }
}
