import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateTableNameToPlural1771250880196
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.renameTable('user', 'users');
    await queryRunner.renameTable('user_token', 'user_tokens');
    await queryRunner.renameTable('friend_request', 'friend_requests');
    await queryRunner.renameTable('friend', 'friends');
    await queryRunner.renameTable('chat_member', 'chat_members');
    await queryRunner.renameTable('chat', 'chats');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.renameTable('users', 'user');
    await queryRunner.renameTable('user_tokens', 'user_token');
    await queryRunner.renameTable('friend_requests', 'friend_request');
    await queryRunner.renameTable('friends', 'friend');
    await queryRunner.renameTable('chat_members', 'chat_member');
    await queryRunner.renameTable('chats', 'chat');
  }
}
