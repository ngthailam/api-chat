import { HttpStatus } from '@nestjs/common';

export const CustomErrors = {
  // Chat
  CHAT_INVALID_MEM_COUNT: {
    code: 100001,
    message: 'One to one chat should contains exactly 1 other memberId',
    status: HttpStatus.BAD_REQUEST,
  },
  CHAT_NOT_MEMBER: {
    code: 100002,
    message: 'You are not a member of this chat',
    status: HttpStatus.BAD_REQUEST,
  },
  CHAT_NOT_ADMIN: {
    code: 100003,
    message: 'Only admins can execute this action',
    status: HttpStatus.BAD_REQUEST,
  },

  // Misc
  CANNOT_NORMALIZE_SAME_ID: {
    code: 101001,
    message: 'Cannot normalize same user IDs',
    status: HttpStatus.INTERNAL_SERVER_ERROR,
  },

  // Friend request
  FR_ALREADY_EXIST: {
    code: 102001,
    message: 'Friend request already exist',
    status: HttpStatus.BAD_REQUEST,
  },
  FR_NOT_EXIST: {
    code: 102002,
    message: 'Friend request does not exist',
    status: HttpStatus.BAD_REQUEST,
  },
  FR_NOT_OWNER: {
    code: 102003,
    message: 'This is not your request',
    status: HttpStatus.BAD_REQUEST,
  },

  // Message
  MSG_NOT_EXIST: {
    code: 103001,
    message: 'Message does not exist',
    status: HttpStatus.BAD_REQUEST,
  },
  MSG_NOT_SENDER: {
    code: 103002,
    message: 'You are not the sender of this message',
    status: HttpStatus.BAD_REQUEST,
  },
};

export type CustomError = (typeof CustomErrors)[keyof typeof CustomErrors];
