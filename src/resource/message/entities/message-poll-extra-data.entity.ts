export class MessageEntityPollExtraData {
  question: string;
  options: {
    option: string;
    voters: { id: string; username: string; avatarUrl: string }[];
  }[];
}
