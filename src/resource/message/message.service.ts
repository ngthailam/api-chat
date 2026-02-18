import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  FindOptionsWhere,
  LessThan,
  LessThanOrEqual,
  MoreThan,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import { MessageEntity } from './entities/message.entity.js';
import { ChatMemberEntity } from '../chat/entities/chat-member.entity.js';
import { CustomException } from '../../common/errors/exception/custom.exception.js';
import { CustomErrors } from '../../common/errors/error_codes.js';
import { UpdateMessageDto } from './dto/update-message.dto.js';
import { mapMessageEntityToModel, Message } from './model/message.model.js';
import { MessageList } from './model/message-list.model.js';
import { MessageType } from './model/message-type.js';
import { MessageEntityPollExtraData } from './entities/message-poll-extra-data.entity.js';
import { timeConstants } from '../../common/constants/time.constants.js';
import { pollMessageExpireQueue } from '../../queue/poll-message/poll-message-expire.queue.js';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(MessageEntity)
    private readonly messageRepo: Repository<MessageEntity>,
    @InjectRepository(ChatMemberEntity)
    private readonly chatMemberRepo: Repository<ChatMemberEntity>,
  ) {}

  private logger = new Logger(MessageService.name);

  async findOne(messageId: string): Promise<MessageEntity> {
    return this.messageRepo.findOne({ where: { id: messageId } });
  }

  async findAll(): Promise<Message[]> {
    const messages = await this.messageRepo.find();
    return messages.map((e) => mapMessageEntityToModel(e));
  }

  private async findMessagesByCursor(
    userId: string,
    chatId: string,
    limit: number,
    direction: 'older' | 'newer',
    cursor?: string,
  ): Promise<MessageList> {
    await this.ensureChatMember(userId, chatId);

    const where: FindOptionsWhere<MessageEntity> = { chatId };

    if (cursor) {
      where.id =
        direction === 'older'
          ? LessThanOrEqual(cursor)
          : MoreThanOrEqual(cursor);
    }

    const orderDirection = direction === 'older' ? 'DESC' : 'ASC';

    const messages = await this.messageRepo.find({
      where,
      order: { id: orderDirection },
      take: limit + 1, // +1 to detect hasMore
    });

    const hasMore = messages.length > limit;
    const sliced = hasMore ? messages.slice(0, -1) : messages;
    const nextCursor = hasMore ? messages[messages.length - 1].id : null;

    return {
      messages: sliced.map(mapMessageEntityToModel),
      hasMore,
      nextCursor: nextCursor,
      total: sliced.length,
    };
  }

  async findOlderMessagesInChat(
    userId: string,
    chatId: string,
    limit: number,
    cursor?: string,
  ): Promise<MessageList> {
    return this.findMessagesByCursor(userId, chatId, limit, 'older', cursor);
  }

  async findNewerMessagesInChat(
    userId: string,
    chatId: string,
    limit: number,
    cursor?: string,
  ): Promise<MessageList> {
    return this.findMessagesByCursor(userId, chatId, limit, 'newer', cursor);
  }

  async findSurroundingMessages(
    userId: string,
    chatId: string,
    messageId: string,
    limit?: number,
  ): Promise<MessageList> {
    // 1️⃣ Ensure user is member (keep your existing check)
    await this.ensureChatMember(userId, chatId); // throws if not member

    const anchorId = messageId;
    const safeLimit =
      typeof limit === 'number' && Number.isFinite(limit) && limit > 0
        ? limit
        : 20;
    const twoWayLimit: number = Math.floor(safeLimit / 2); // number of messages to load before and after

    // Load anchor itself
    const anchor = await this.messageRepo.findOne({
      where: { id: anchorId, chatId },
    });

    if (!anchor) {
      throw new CustomException(CustomErrors.MSG_NOT_EXIST);
    }

    //  Load older messages (before anchor)
    const olderMessages = await this.messageRepo.find({
      where: {
        chatId,
        id: LessThan(anchorId),
      },
      order: { id: 'DESC' },
      take: twoWayLimit,
    });

    // Load newer messages (after anchor)
    const newerMessages = await this.messageRepo.find({
      where: {
        chatId,
        id: MoreThan(anchorId),
      },
      order: { id: 'ASC' }, // important!
      take: twoWayLimit + 1, // +1 to check if there's more after anchor
    });

    const hasMore = newerMessages.length > twoWayLimit;
    const slicedNewerMessages = hasMore
      ? newerMessages.slice(0, -1)
      : newerMessages;
    const nextCursor = hasMore
      ? newerMessages[newerMessages.length - 1].id
      : null;

    const fullMessageList = [
      ...olderMessages.reverse(), // oldest → newest
      anchor,
      ...slicedNewerMessages,
    ];

    // TODO: add has more, next cursor info if needed
    return {
      messages: fullMessageList.map(mapMessageEntityToModel),
      hasMore,
      nextCursor: nextCursor,
      total: fullMessageList.length,
    };
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

  async createTextMessage(
    chatId: string,
    senderId: string,
    text: string,
    quoteMessageId?: string | null,
    quoteMessageText?: string | null,
  ): Promise<MessageEntity> {
    await this.ensureChatMember(senderId, chatId); // throws if not member

    const message = this.messageRepo.create({
      text,
      senderId,
      chatId,
      createdAt: new Date(),
      type: MessageType.TEXT,
      quoteMessageId: quoteMessageId,
      quoteMessageText: quoteMessageText,
    });
    return this.messageRepo.save(message);
  }

  async createPollMessage(
    chatId: string,
    senderId: string,
    question: string,
    options: string[],
  ): Promise<Message> {
    await this.ensureChatMember(senderId, chatId); // throws if not member

    const pollExtraData = new MessageEntityPollExtraData();
    pollExtraData.question = question;
    pollExtraData.expireAt = new Date(Date.now() + timeConstants.fiveMinutes);
    pollExtraData.isExpired = false;
    pollExtraData.options = options
      .filter((option) => option && option.trim() !== '')
      .map((option) => {
        return {
          option: option,
          voters: [],
        };
      });

    const message = this.messageRepo.create({
      text: '',
      senderId,
      chatId,
      createdAt: new Date(),
      type: MessageType.POLL,
      extraData: pollExtraData,
    });
    const entity = await this.messageRepo.save(message);

    console.log(`Scheduled poll expiration for message ${entity.id} at ${pollExtraData.expireAt.toISOString()}`);
    await pollMessageExpireQueue.add(
      'expire-poll',
      { messageId: entity.id },
      {
        delay: timeConstants.fiveMinutes,
        removeOnComplete: true,
        removeOnFail: false,
      },
    );

    return mapMessageEntityToModel(entity);
  }

  async votePollMessage(
    chatId: string,
    messageId: string,
    userId: string,
    option: string,
  ) {
    await this.ensureChatMember(userId, chatId); // throws if not member

    const message = await this.messageRepo.findOne({
      where: { id: messageId, chatId },
    });

    if (!message || message.type !== MessageType.POLL) {
      throw new CustomException(CustomErrors.MSG_NOT_POLL);
    }

    const pollExtraData = message.extraData as MessageEntityPollExtraData;

    if (pollExtraData.isExpired) {  
      throw new CustomException(CustomErrors.MSG_POLL_EXPIRED);
    }
    const optionIndex = pollExtraData.options.findIndex(
      (opt) => opt.option === option,
    );

    if (optionIndex === -1) {
      throw new CustomException(CustomErrors.MSG_POLL_OPTION_NOT_EXIST);
    }

    pollExtraData.options.forEach((opt) => {
      const existingVoterIndex = opt.voters.findIndex((v) => v.id === userId);
      if (existingVoterIndex !== -1) {
        // If already voted, remove the vote
        opt.voters.splice(existingVoterIndex, 1);
      }
    });

    // Add new voter
    pollExtraData.options[optionIndex].voters.push({
      id: userId,
      username: '', // TODO: fill this
      avatarUrl: '', // TODO: fill this
    });

    message.extraData = pollExtraData;
    const entity = await this.messageRepo.save(message);
    return mapMessageEntityToModel(entity);
  }

  async update(
    userId: string,
    messageId: string,
    request: UpdateMessageDto,
  ): Promise<Message | null> {
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

    return mapMessageEntityToModel(message);
  }

  async searchInChat(
    userId: string,
    chatId: string,
    keyword: string,
  ): Promise<MessageEntity[]> {
    await this.ensureChatMember(userId, chatId); // throws if not member

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

  private async ensureChatMember(userId: string, chatId: string) {
    const chatMember = await this.chatMemberRepo.findOne({
      where: {
        chat: { id: chatId },
        member: { id: userId },
      },
    });

    if (!chatMember) {
      throw new CustomException(CustomErrors.CHAT_NOT_MEMBER);
    }
  }
}
