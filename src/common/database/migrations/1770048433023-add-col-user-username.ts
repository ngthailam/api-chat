import { MigrationInterface, QueryRunner } from "typeorm";

export class AddColUserUsername1770048433023 implements MigrationInterface {
    name = 'AddColUserUsername1770048433023'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "username" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "username"`);
    }

}
