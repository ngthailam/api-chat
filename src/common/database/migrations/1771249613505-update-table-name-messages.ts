import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateTableNameMessages1771249613505
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.renameTable('message', 'messages');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.renameTable('messages', 'message');
  }
}
