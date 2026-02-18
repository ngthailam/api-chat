import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChatAddColUserIdPair1771400385197 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1️⃣ Add column
    await queryRunner.query(`
      ALTER TABLE "chats"
      ADD COLUMN "oneToOneUserIdPair" varchar;
    `);

    // 2️⃣ Add unique constraint
    await queryRunner.query(`
      ALTER TABLE "chats"
      ADD CONSTRAINT "UQ_chats_oneToOneUserIdPair"
      UNIQUE ("oneToOneUserIdPair");
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // 1️⃣ Drop unique constraint
    await queryRunner.query(`
      ALTER TABLE "chats"
      DROP CONSTRAINT "UQ_chats_oneToOneUserIdPair";
    `);

    // 2️⃣ Drop column
    await queryRunner.query(`
      ALTER TABLE "chats"
      DROP COLUMN "oneToOneUserIdPair";
    `);
  }
}
