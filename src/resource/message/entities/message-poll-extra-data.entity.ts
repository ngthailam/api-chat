export class MessageEntityPollExtraData {
  question: string;
  expireAt?: Date;
  isExpired: boolean = false;
  options: {
    option: string;
    voters: { id: string; username: string; avatarUrl: string }[];
  }[];
}
