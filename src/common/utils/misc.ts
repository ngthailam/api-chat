import { HttpException, HttpStatus } from '@nestjs/common';

export function normalizeUserPair(
  userId1: string,
  userId2: string,
): { user1Id: string; user2Id: string } {
  if (userId1 === userId2) {
    throw new HttpException(
      'Cannot normalize same user IDs',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  return userId1 > userId2
    ? { user1Id: userId1, user2Id: userId2 }
    : { user1Id: userId2, user2Id: userId1 };
}
