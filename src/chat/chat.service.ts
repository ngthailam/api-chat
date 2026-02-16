import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto.js';
import { In, Not, Repository } from 'typeorm';
import { Chat } from './entities/chat.entity.js';
import { User } from '../user/entities/user.entity.js';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatMember } from './entities/chat-member.js';
import { ChatDto } from './dto/chat.dto.js';
import { ChatMemberDto } from './dto/chat-member.dto.js';
import { ChatType } from './dto/chat-type.js';
import { CustomException } from '../common/errors/exception/custom.exception.js';
import { CustomErrors } from '../common/errors/error_codes.js';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat)
    private readonly chatRepo: Repository<Chat>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(ChatMember)
    private readonly chatMemberRepo: Repository<ChatMember>,
  ) {}

  private readonly logger = new Logger(ChatService.name);

  async create(userId: string, createChatDto: CreateChatDto) {
    if (createChatDto.type == ChatType.ONE_ONE) {
      if (createChatDto.memberIds.length != 1) {
        throw new CustomException(CustomErrors.CHAT_INVALID_MEM_COUNT);
      }

      const existingChat = await this.findExistingOneToOneChat(
        userId,
        createChatDto.memberIds.at(0),
      );
      if (existingChat) {
        this.logger.log(`Chat already exist ${existingChat}`);
        return existingChat;
      }
    }

    const chat = this.chatRepo.create();
    if (createChatDto.type != ChatType.ONE_ONE) {
      chat.name = createChatDto.name;
    }
    const savedChat = await this.chatRepo.save(chat);
    const membersToAdd = createChatDto.memberIds || [];
    if (!membersToAdd.includes(userId)) {
      membersToAdd.push(userId);
    }

    const members = await this.userRepo.find({
      where: { id: In(createChatDto.memberIds) },
    });

    this.logger.log(
      `Creating a new chat with members = ${members.map((e) => e.id)}`,
    );

    const chatMembers = members.map((member) => {
      const chatMember = new ChatMember();
      chatMember.chat = savedChat;
      chatMember.member = member;
      chatMember.role = member.id === userId ? 'admin' : 'member';
      return chatMember;
    });

    await this.chatMemberRepo.save(chatMembers);

    return ChatDto.fromEntity(savedChat, chatMembers);
  }

  async findExistingOneToOneChat(
    userAId: string,
    userBId: string,
  ): Promise<Chat | null> {
    const chatMembers = await this.chatMemberRepo.find({
      where: { member: { id: userAId } },
      relations: ['member', 'chat'],
    });

    let targetChat: Chat | null = null;

    chatMembers.forEach(async (e) => {
      const chatId = e.chat.id;

      if (e.chat.type == ChatType.ONE_ONE) {
        const otherChatMember = await this.chatMemberRepo.findOne({
          where: { chat: { id: chatId }, member: { id: Not(userAId) } },
        });

        if (otherChatMember.member.id == userBId) {
          targetChat = e.chat;
          return targetChat;
        }
      }
    });

    return targetChat;
  }

  async findAll() {
    const chatEntities = await this.chatRepo.find();
    const chatDtos = await Promise.all(
      chatEntities.map(async (chat) => {
        const chatMembers = await this.chatMemberRepo.find({
          where: { chat: { id: chat.id } },
          relations: ['member'],
        });

        return ChatDto.fromEntity(chat, chatMembers);
      }),
    );

    return chatDtos;
  }

  async findOne(id: string) {
    const chat = await this.chatRepo.findOne({ where: { id } });
    if (!chat) {
      throw new NotFoundException(`Chat with id ${id} not found`);
    }
    const chatMembers = await this.chatMemberRepo.find({
      where: { chat: { id: chat.id } },
      relations: ['member'],
    });
    return ChatDto.fromEntity(chat, chatMembers);
  }

  async addMembers(currentUserId: string, chatId: string, memberIds: string[]) {
    const chat = await this.chatRepo.findOne({ where: { id: chatId } });
    if (!chat) {
      throw new NotFoundException(`Chat with id ${chatId} not found`);
    }

    const members = await this.userRepo.find({
      where: { id: In(memberIds) },
    });

    const userInMembers = await this.getMemberInChat(chatId, currentUserId, [
      'member',
      'chat',
    ]);

    if (!userInMembers) {
      throw new CustomException(CustomErrors.CHAT_NOT_MEMBER);
    }

    if (!userInMembers.role || userInMembers.role !== 'admin') {
      throw new CustomException(CustomErrors.CHAT_NOT_ADMIN);
    }

    const currentChatMembers = await this.chatMemberRepo.find({
      where: { chat: { id: chatId } },
      relations: ['member'],
    });
    const existingMemberIds = currentChatMembers.map((cm) => cm.member.id);
    const chatMembers = members
      .filter((member) => member.id! in existingMemberIds)
      .map((member) => {
        const chatMember = new ChatMember();
        chatMember.chat = chat;
        chatMember.member = member;
        chatMember.role = 'member';
        return chatMember;
      });

    const savedChatMembers = await this.chatMemberRepo.save(chatMembers);
    return savedChatMembers.map((cm) => ChatMemberDto.fromEntity(cm));
  }

  async removeMember(currentUserId: string, chatId: string, memberId: string) {
    const chatMember = await this.chatMemberRepo.findOne({
      where: {
        chat: { id: chatId },
        member: { id: memberId },
      },
      relations: ['chat', 'member'],
    });
    if (!chatMember) {
      throw new NotFoundException(
        `Member with id ${memberId} not found in chat ${chatId}`,
      );
    }

    const requestingUserChatMember = await this.getMemberInChat(
      chatId,
      currentUserId,
      ['member', 'chat'],
    );

    if (!requestingUserChatMember) {
      throw new CustomException(CustomErrors.CHAT_NOT_MEMBER);
    }

    if (
      requestingUserChatMember.role !== 'admin' &&
      currentUserId !== memberId
    ) {
      throw new UnauthorizedException(
        'Only admins can remove other members from the chat',
      );
    }

    await this.chatMemberRepo.delete(chatMember.id);
    return ChatMemberDto.fromEntity(chatMember);
  }

  async renameChat(currentUserId: string, id: string, newName: string) {
    const chatMembers = await this.chatMemberRepo.find({
      where: {
        chat: { id: id },
      },
      relations: ['member'],
    });

    if (currentUserId! in chatMembers.map((cm) => cm.member.id)) {
      throw new CustomException(CustomErrors.CHAT_NOT_MEMBER);
    }

    return this.chatRepo.update({ id }, { name: newName });
  }

  async remove(currentUserId: string, id: string) {
    const currentUserMember = await this.getMemberInChat(id, currentUserId, [
      'member',
    ]);

    if (!currentUserMember) {
      throw new CustomException(CustomErrors.CHAT_NOT_MEMBER);
    }

    if (currentUserMember.role !== 'admin') {
      throw new UnauthorizedException('Only admins can delete the chat');
    }

    return this.chatRepo.delete({ id });
  }

  async removeAll() {
    return this.chatRepo.deleteAll();
  }

  async getMemberInChat(
    chatId: string,
    memberId: string,
    relations: string[] = ['member', 'chat'],
  ): Promise<ChatMember | null> {
    const chatMember = await this.chatMemberRepo.findOne({
      where: {
        chat: { id: chatId },
        member: { id: memberId },
      },
      relations: relations,
    });

    return chatMember;
  }
}
