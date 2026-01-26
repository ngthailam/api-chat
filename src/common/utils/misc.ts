import { HttpException, HttpStatus } from '@nestjs/common';
import { CustomException } from '../errors/exception/custom.exception';
import { CustomErrors } from '../errors/error_codes';

export function normalizeUserPair(
  userId1: string,
  userId2: string,
): { user1Id: string; user2Id: string } {
  if (userId1 === userId2) {
    throw new CustomException(CustomErrors.CANNOT_NORMALIZE_SAME_ID);
  }

  return userId1 > userId2
    ? { user1Id: userId1, user2Id: userId2 }
    : { user1Id: userId2, user2Id: userId1 };
}
