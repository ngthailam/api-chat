import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { ChatMember } from 'src/chat/entities/chat-member';
import { CustomException } from 'src/common/errors/exception/custom.exception';
import { CustomErrors } from 'src/common/errors/error_codes';
import { UpdateMessageDto } from './dto/update-message.dto';
import { mapMessageModel, MessageModel } from './model/message.model';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepo: Repository<Message>,
    @InjectRepository(ChatMember)
    private readonly chatMemberRepo: Repository<ChatMember>,
  ) {}

  private logger = new Logger(MessageService.name);

  async findOne(messageId: number) {
    return this.messageRepo.findOne({ where: { id: messageId } });
  }

  async findAll(): Promise<MessageModel[]> {
    const messages = await this.messageRepo.find();
    return messages.map((e) => mapMessageModel(e));
  }

  async findAllInChat(userId: any, chatId: string): Promise<MessageModel[]> {
    console.log(`findAllInChat for userId = ${userId}, chatId = ${chatId}`);
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

    const messages = await this.messageRepo.find({
      where: { chatId: chatId },
      order: { createdAt: 'DESC' },
    });

    return messages.map((e) => mapMessageModel(e));
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

  async update(
    userId: string,
    messageId: number,
    request: UpdateMessageDto,
  ): Promise<MessageModel | null> {
    const message = await this.findOne(messageId);

    if (userId != message.senderId) {
      throw new CustomException(CustomErrors.MSG_NOT_SENDER);
    }

    // Handle null reaction: remove the user's reaction instead of storing null
    if (!(request.reaction === undefined)) {
      const newReactions = { ...message.reactions };
      if (request.reaction === null) {
        delete newReactions[userId];
      } else {
        newReactions[userId] = request.reaction;
      }

      message.reactions = newReactions;
      await this.messageRepo.save(message);
    }

    return mapMessageModel(message);
  }

  async searchInChat(userId: string, chatId: string, keyword: string) {
    const chatMember = await this.chatMemberRepo.findOne({
      where: {
        chat: { id: chatId },
        member: { id: userId },
      },
    });

    if (!chatMember) {
      throw new CustomException(CustomErrors.CHAT_NOT_MEMBER);
    }

    return this.messageRepo
      .createQueryBuilder('m')
      .select([
        'm.id',
        'm.text',
        'm.createdAt',
        `ts_rank("m"."searchVector", websearch_to_tsquery('english', :query)) AS rank`,
      ])
      .where('"m"."chatId" = :chatId', { chatId })
      .andWhere(`"m"."searchVector" @@ websearch_to_tsquery('english', :query)`)
      .setParameter('query', keyword)
      .orderBy('rank', 'DESC')
      .addOrderBy('"m"."createdAt"', 'DESC')
      .getRawMany();
  }
}
