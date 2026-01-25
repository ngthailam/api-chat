import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { ChatMember } from 'src/chat/entities/chat-member';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepo: Repository<Message>,
    @InjectRepository(ChatMember)
    private readonly chatMemberRepo: Repository<ChatMember>,
  ) {}

  private logger = new Logger(MessageService.name);

  async findAllInChat(userId: any, chatId: string) {
    this.logger.log(`findAllInChat for userId = ${userId}, chatId = ${chatId}`);
    const chatMember = await this.chatMemberRepo.findOne({
      where: {
        chat: { id: chatId },
        member: { id: userId },
      },
      relations: ['member', 'chat'],
    });

    this.logger.log(`findAllInChat Found chatMember = ${chatMember}`);
    if (!chatMember) {
      throw new HttpException(
        'You are not a member of this chat',
        HttpStatus.UNAUTHORIZED,
      );
    }

    return this.messageRepo.find({
      where: { chatId: chatId },
      order: { createdAt: 'DESC' },
    });
  }

  async remove(userId: any, messageId: number) {
    const message = await this.messageRepo.findOneBy({ id: messageId });
    if (!message) {
      throw new HttpException('Message does not exist', HttpStatus.NOT_FOUND);
    }

    if (message.senderId != userId) {
      throw new HttpException(
        'You are not the sender of this message',
        HttpStatus.UNAUTHORIZED,
      );
    }

    return this.messageRepo.delete(messageId);
  }

  async createMessage(
    chatId: string,
    senderId: string,
    text: string,
  ): Promise<Message> {
    const chatMember = await this.chatMemberRepo.findOne({
      where: {
        chat: { id: chatId },
        member: { id: senderId },
      },
      relations: ['member'],
    });

    if (!chatMember) {
      throw new HttpException(
        'User is not a member of the chat',
        HttpStatus.BAD_REQUEST,
      );
    }

    const message = this.messageRepo.create({
      text,
      senderId,
      chatId,
      createdAt: new Date(),
    });
    return this.messageRepo.save(message);
  }
}
