export class Notification {
  title: string;
  body: string;
  data?: Record<string, string> | null;
}

export class NotificationWithToken {
  token: string;
  notification: Notification;
}
