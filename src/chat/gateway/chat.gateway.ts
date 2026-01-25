import { Logger, UseGuards } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { WsAuthGuard } from 'src/common/guard/ws-auth.guard';

@WebSocketGateway(80, { namespace: 'chat' })
export class ChatWebSocketGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  private server: Server;

  private logger = new Logger(ChatWebSocketGateway.name);

  handleDisconnect(client: any) {
    throw new Error('Method not implemented.');
  }
  handleConnection(client: any, ...args: any[]) {
    throw new Error('Method not implemented.');
  }
}
