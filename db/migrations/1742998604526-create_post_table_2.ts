import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatePostTable21742998604526 implements MigrationInterface {
    name = 'CreatePostTable21742998604526'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`post\` DROP COLUMN \`created_at\``);
        await queryRunner.query(`ALTER TABLE \`post\` ADD \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`post\` DROP COLUMN \`updated_at\``);
        await queryRunner.query(`ALTER TABLE \`post\` ADD \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`post\` DROP COLUMN \`updated_at\``);
        await queryRunner.query(`ALTER TABLE \`post\` ADD \`updated_at\` datetime(0) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`post\` DROP COLUMN \`created_at\``);
        await queryRunner.query(`ALTER TABLE \`post\` ADD \`created_at\` datetime(0) NOT NULL`);
    }

}
