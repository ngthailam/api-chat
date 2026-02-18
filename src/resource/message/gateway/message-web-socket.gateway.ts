import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Logger, UseGuards } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { HttpException } from '@nestjs/common';
import { MessageService } from '../message.service.js';
import { MessageEntity } from '../entities/message.entity.js';
import { WsAuthGuard } from '../../../common/guard/ws-auth.guard.js';
import { WsCurrentUserDecorator } from '../../../common/decorator/ws-current-user.decorator.js';
import { Message } from '../model/message.model.js';
import { mapMessageModelToResponse } from '../response/message.response.js';

/**
 * Gateway for:
 * - join chat
 * - sending messages
 * -
 */
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class MessageWebSocketGateway {
  @WebSocketServer()
  private server: Server;

  private logger = new Logger(MessageWebSocketGateway.name);

  constructor(private readonly messageService: MessageService) {}

  @SubscribeMessage('send-message')
  @UseGuards(WsAuthGuard)
  async handleMessage(
    @MessageBody()
    payload: {
      chatId: string;
      text: string;
      quoteMessageId?: string | null;
      quoteMessageText?: string | null;
    },
    @ConnectedSocket() client: Socket,
    @WsCurrentUserDecorator() user: any,
  ) {
    console.log(`Received message payload ${JSON.stringify(payload)} from user ${user?.userId} in chat ${client.data.chatId}`);

    const { text, quoteMessageId, quoteMessageText } = payload;
    const chatId = client.data.chatId;
    const senderId = user?.userId;

    if (!chatId || !senderId || !text) {
      throw new WsException('Invalid message payload');
    }

    try {
      const message: Message = await this.messageService.createTextMessage(
        chatId,
        senderId,
        text,
        quoteMessageId,
        quoteMessageText,
      );

      const response = mapMessageModelToResponse(message);
      this.server.to(chatId).emit('new-message', response);

      return response; // returned to sender as ack
    } catch (error: HttpException | any) {
      throw new WsException(error.message || 'Failed to send message');
    }
  }

  @SubscribeMessage('join-chat')
  @UseGuards(WsAuthGuard)
  async handleJoinChat(
    @MessageBody() payload: any,
    @ConnectedSocket() client: Socket,
  ) {
    const chatId = payload.chatId;

    if (!chatId) {
      throw new WsException('Invalid chat ID');
    }

    client.join(chatId);
    client.data.chatId = chatId;

    client.emit('join-chat-success', { chatId: chatId });

    return;
  }

  @SubscribeMessage('leave-chat')
  @UseGuards(WsAuthGuard)
  async handleLeaveChat(
    @MessageBody() payload: any,
    @ConnectedSocket() client: Socket,
  ) {
    const parsedPayload =
      typeof payload === 'string' ? JSON.parse(payload) : payload;
    const chatId = parsedPayload?.chatId || parsedPayload?.data?.chatId;

    if (!chatId) {
      throw new WsException('Invalid chat ID');
    }

    client.leave(chatId);
    client.data.chatId = null;

    client.emit('leave-chat-success', { chatId: chatId });

    return;
  }
}
