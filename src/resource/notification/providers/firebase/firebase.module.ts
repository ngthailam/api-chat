import { Module } from '@nestjs/common';
import { FirebaseService } from './firebase.service.js';
import { FirebaseAdminProvider } from './firebase-admin.provider.js';

@Module({
  imports: [],
  providers: [FirebaseAdminProvider, FirebaseService],
  exports: [FirebaseService],
})
export class FirebaseModule {}
