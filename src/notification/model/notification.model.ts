export type NotificationModel = {
  title: string;
  body: string;
  data?: Record<string, string> | null;
};

export type NotificationWithTokenModel = {
  token: string;
  notification: NotificationModel;
};
