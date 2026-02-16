import {
  ConnectedSocket,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { PresenceService } from './presence.service.js';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { WsAuthGuard } from '../common/guard/ws-auth.guard.js';
import { WsCurrentUserDecorator } from '../common/decorator/ws-current-user.decorator.js';
import { WsDeviceIdDecorator } from '../common/decorator/ws-device-id.decorator.js';

/**
 * Gateway for managing user presence:
 * - handle user connections and disconnections
 * - broadcast presence updates
 */
@WebSocketGateway(80)
export class PresenceGateway implements OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly presenceService: PresenceService) {}
  handleDisconnect(client: Socket) {
    const userId = client.data.userId;
    const deviceId = client.data.deviceId;
    if (!userId || !deviceId) return;

    this.presenceService.markOffline({ userId, deviceId }).then((isOffline) => {
      if (isOffline) {
        this.server.emit('presence:update', { userId, status: 'offline' });
      }
    });
  }

  @SubscribeMessage('presence:ping')
  @UseGuards(WsAuthGuard)
  async handlePing(
    @ConnectedSocket() client: Socket,
    @WsCurrentUserDecorator() user: any,
    @WsDeviceIdDecorator() deviceId: string,
  ) {
    const userId = user?.userId;

    console.log('Presence ping from user:', userId, 'device:', deviceId);

    if (!userId || !deviceId) return;

    const isOnline = await this.presenceService.isOnline({ userId, deviceId });
    if (isOnline) {
      console.log('User is already online, refreshing presence:', userId, deviceId);
      await this.presenceService.refresh({ userId, deviceId });
      return;
    }

    console.log('Marking user as online:', userId, deviceId);
    await this.presenceService.markOnline({ userId, deviceId });
    this.server.emit('presence:update', { userId, status: 'online' });
  }
}
