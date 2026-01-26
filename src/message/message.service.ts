import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { ChatMember } from 'src/chat/entities/chat-member';
import { CustomException } from 'src/common/errors/exception/custom.exception';
import { CustomErrors } from 'src/common/errors/error_codes';

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
      throw new CustomException(CustomErrors.CHAT_NOT_MEMBER);
    }

    return this.messageRepo.find({
      where: { chatId: chatId },
      order: { createdAt: 'DESC' },
    });
  }

  async remove(userId: any, messageId: number) {
    const message = await this.messageRepo.findOneBy({ id: messageId });
    if (!message) {
      throw new CustomException(CustomErrors.MSG_NOT_EXIST);
    }

    if (message.senderId != userId) {
      throw new CustomException(CustomErrors.MSG_NOT_SENDER);
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
      throw new CustomException(CustomErrors.CHAT_NOT_MEMBER);
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
