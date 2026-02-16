import { Inject, Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { NotificationWithToken } from '../../model/notification.model.js';

@Injectable()
export class FirebaseService {
  constructor(
    @Inject('FIREBASE_ADMIN')
    private readonly firebaseAdmin: typeof admin,
  ) {}

  verifyToken(token: string) {
    admin.auth().verifyIdToken(token);
  }

  send(data: NotificationWithToken) {
    admin.messaging().send({
      token: data.token,
      notification: {
        title: data.notification.title,
        body: data.notification.body,
      },
      data: data.notification.data,
    });
  }

  async sendToMany(messages: NotificationWithToken[]) {
    const BATCH_SIZE = 50; // safe concurrency (NOT Firebase limit)

    for (let i = 0; i < messages.length; i += BATCH_SIZE) {
      const batch = messages.slice(i, i + BATCH_SIZE);

      await Promise.all(
        batch.map((msg) =>
          this.firebaseAdmin
            .messaging()
            .send({
              token: msg.token,
              notification: msg.notification,
              data: msg.notification.data,
            })
            .catch((error) => {
              // log & continue
              console.error('FCM send failed', msg.token, error?.message);
            }),
        ),
      );
    }
  }

  async sendTopic(topic: string, title: string, body: string, data: {} = null) {
    admin.messaging().send({
      topic: topic,
      notification: {
        title: title,
        body: body,
      },
      data: data,
    });
  }
}
