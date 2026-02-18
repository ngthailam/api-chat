export function normalizeUserPair(
  userId1: string,
  userId2: string,
): { user1Id: string; user2Id: string } {
  return userId1 > userId2
    ? { user1Id: userId1, user2Id: userId2 }
    : { user1Id: userId2, user2Id: userId1 };
}

export function connectNormalizedUserPair(
  userId1: string,
  userId2: string,
): string {
  const normalizedPair = normalizeUserPair(userId1, userId2);
  return `${normalizedPair.user1Id}:${normalizedPair.user2Id}`;
}
