import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { In, Repository } from 'typeorm';
import { Chat } from './entities/chat.entity';
import { User } from '../user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatMember } from './entities/chat-member';
import { ChatDto } from './dto/chat.dto';
import { ChatMemberDto } from './dto/chat-member.dto';

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

  async create(userId: string, createChatDto: CreateChatDto) {
    const chat = this.chatRepo.create();
    const savedChat = await this.chatRepo.save(chat);

    createChatDto.memberIds = createChatDto.memberIds || [];
    if (!createChatDto.memberIds.includes(userId)) {
      createChatDto.memberIds.push(userId);
    }

    const members = await this.userRepo.find({
      where: { id: In(createChatDto.memberIds) },
    });

    const chatMembers = members.map((member) => {
      const chatMember = new ChatMember();
      chatMember.chat = savedChat;
      chatMember.member = member;
      chatMember.role = member.id === userId ? 'admin' : 'member';
      return chatMember;
    });

    await this.chatMemberRepo.save(chatMembers);

    const chatDto = ChatDto.fromEntity(savedChat, chatMembers);
    return ChatDto.fromEntity(savedChat, chatMembers);
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

    const userInMembers = await this.chatMemberRepo.findOne({
      where: {
        chat: { id: chatId },
        member: { id: currentUserId },
      },
      relations: ['chat', 'member'],
    });

    if (!userInMembers) {
      throw new HttpException(
        'You are not a member of this chat',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!userInMembers.role || userInMembers.role !== 'admin') {
      throw new UnauthorizedException(
        'Only admins can add members to the chat',
      );
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

    const requestingUserChatMember = await this.chatMemberRepo.findOne({
      where: {
        chat: { id: chatId },
        member: { id: currentUserId },
      },
      relations: ['chat', 'member'],
    });

    if (!requestingUserChatMember) {
      throw new HttpException(
        'You are not a member of this chat',
        HttpStatus.BAD_REQUEST,
      );
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
    const chat = await this.chatRepo.findOne({ where: { id: id } });
    const chatMembers = await this.chatMemberRepo.find({
      where: {
        chat: { id: id },
      },
      relations: ['member'],
    });

    if (currentUserId! in chatMembers.map((cm) => cm.member.id)) {
      throw new HttpException(
        'You are not a member of this chat',
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.chatRepo.update({ id }, { name: newName });
  }

  async remove(currentUserId: string, id: string) {
    const chat = await this.chatRepo.findOne({ where: { id: id } });
    const currentUserMember = await this.chatMemberRepo.findOne({
      where: {
        chat: { id: id },
        member: { id: currentUserId },
      },
      relations: ['member'],
    });

    if (!currentUserMember) {
      throw new HttpException(
        'You are not a member of this chat',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (currentUserMember.role !== 'admin') {
      throw new UnauthorizedException('Only admins can delete the chat');
    }

    return this.chatRepo.delete({ id });
  }
}
