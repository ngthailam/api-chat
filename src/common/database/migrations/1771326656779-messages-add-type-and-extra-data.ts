import { MigrationInterface, QueryRunner } from 'typeorm';

export class MessagesAddTypeAndExtraData1771326656779
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    console.log('Running migration: MessagesAddTypeAndExtraData1771326656779');
    // 1️⃣ Create enum type in Postgres
    // 1️⃣ Create enum type only if it does not exist
    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_type WHERE typname = 'message_type_enum'
        ) THEN
          CREATE TYPE "message_type_enum" AS ENUM ('TEXT', 'POLL');
        END IF;
      END$$;
    `);

    // 2️⃣ Add type column if not exists
    await queryRunner.query(`
      ALTER TABLE "messages"
      ADD COLUMN IF NOT EXISTS "type" "message_type_enum"
      NOT NULL DEFAULT 'TEXT';
    `);

    // 3️⃣ Add extraData column if not exists
    await queryRunner.query(`
      ALTER TABLE "messages"
      ADD COLUMN IF NOT EXISTS "extraData" jsonb
      NOT NULL DEFAULT '{}'::jsonb;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    console.log(
      'Reverting migration: MessagesAddTypeAndExtraData1771326656779',
    );

    // 1️⃣ Drop columns safely
    await queryRunner.query(`
    ALTER TABLE "messages"
    DROP COLUMN IF EXISTS "extraData";
  `);

    await queryRunner.query(`
    ALTER TABLE "messages"
    DROP COLUMN IF EXISTS "type";
  `);

    // 2️⃣ Drop enum type safely
    await queryRunner.query(`
    DROP TYPE IF EXISTS "message_type_enum";
  `);
  }
}
