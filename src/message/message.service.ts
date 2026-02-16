import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, LessThan, MoreThan, Repository } from 'typeorm';
import { Message } from './entities/message.entity.js';
import { ChatMember } from '../chat/entities/chat-member.js';
import { CustomException } from '../common/errors/exception/custom.exception.js';
import { CustomErrors } from '../common/errors/error_codes.js';
import { UpdateMessageDto } from './dto/update-message.dto.js';
import { mapMessageModel, MessageModel } from './model/message.model.js';
import { MessageListModel } from './model/message-list.model.js';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepo: Repository<Message>,
    @InjectRepository(ChatMember)
    private readonly chatMemberRepo: Repository<ChatMember>,
  ) {}

  private logger = new Logger(MessageService.name);

  async findOne(messageId: string): Promise<Message> {
    return this.messageRepo.findOne({ where: { id: messageId } });
  }

  async findAll(): Promise<MessageModel[]> {
    const messages = await this.messageRepo.find();
    return messages.map((e) => mapMessageModel(e));
  }

  async findAllInChat(
    userId: string,
    chatId: string,
    cursor?: string,
    limit = 20,
  ): Promise<MessageListModel> {
    const chatMember = await this.chatMemberRepo.findOne({
      where: {
        chat: { id: chatId },
        member: { id: userId },
      },
    });

    if (!chatMember) {
      throw new CustomException(CustomErrors.CHAT_NOT_MEMBER);
    }

    const where: FindOptionsWhere<Message> = { chatId };

    if (cursor) {
      where.id = LessThan(cursor);
    }

    const messages = await this.messageRepo.find({
      where,
      order: { id: 'DESC' },
      take: limit + 1,
    });

    const hasMore = messages.length > limit;
    if (hasMore) messages.pop();

    return {
      messages: messages.map(mapMessageModel),
      hasMore,
      nextCursor: hasMore ? messages[messages.length - 1].id : null,
      total: messages.length,
    };
  }

  async findSurroundingMessages(
    userId: string,
    chatId: string,
    messageId: string,
  ): Promise<Message[]> {
    // 1️⃣ Ensure user is member (keep your existing check)

    const chatMember = await this.chatMemberRepo.findOne({
      where: {
        chat: { id: chatId },
        member: { id: userId },
      },
    });

    if (!chatMember) {
      throw new CustomException(CustomErrors.CHAT_NOT_MEMBER);
    }

    const anchorId = messageId;
    const limit = 10; // number of messages to load before and after

    // Load anchor itself
    const anchor = await this.messageRepo.findOne({
      where: { id: anchorId, chatId },
    });

    if (!anchor) {
      throw new CustomException(CustomErrors.MSG_NOT_EXIST);
    }

    //  Load older messages (before anchor)
    const older = await this.messageRepo.find({
      where: {
        chatId,
        id: LessThan(anchorId),
      },
      order: { id: 'DESC' },
      take: limit,
    });

    // Load newer messages (after anchor)
    const newer = await this.messageRepo.find({
      where: {
        chatId,
        id: MoreThan(anchorId),
      },
      order: { id: 'ASC' }, // important!
      take: limit,
    });

    return [
      ...older.reverse(), // oldest → newest
      anchor,
      ...newer,
    ];
  }

  async remove(userId: string, messageId: string) {
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
    quoteMessageId?: string | null,
    quoteMessageText?: string | null,
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
      quoteMessageId: quoteMessageId,
      quoteMessageText: quoteMessageText,
    });
    return this.messageRepo.save(message);
  }

  async update(
    userId: string,
    messageId: string,
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
