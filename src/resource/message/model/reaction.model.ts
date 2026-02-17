import { ReactionType } from './reaction-type.js';

export class Reaction {
  /**
   * @key ReactionType type of reaction
   * @value the total count of that ReactionType
   *
   */
  count: Record<ReactionType, number>;

  /**
   * @key userId in string
   * @value ReactionType type of reaction
   */
  sender: Record<string, ReactionType>;
}

export function mapReactionsToModel(
  reactions: Record<string, ReactionType> | null | undefined,
): Reaction {
  const count = {} as Record<ReactionType, number>;
  const sender = {} as Record<string, ReactionType>;

  if (!reactions) {
    return { count, sender };
  }

  for (const [userId, reaction] of Object.entries(reactions)) {
    // count
    count[reaction] = (count[reaction] ?? 0) + 1;

    // sender (store last sender; see note below)
    sender[userId] = reaction;
  }

  return { count, sender };
}
