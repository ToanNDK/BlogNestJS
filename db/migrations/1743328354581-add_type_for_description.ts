import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTypeForDescription1743328354581 implements MigrationInterface {
    name = 'AddTypeForDescription1743328354581'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`post\` DROP COLUMN \`description\``);
        await queryRunner.query(`ALTER TABLE \`post\` ADD \`description\` longtext NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`post\` DROP COLUMN \`description\``);
        await queryRunner.query(`ALTER TABLE \`post\` ADD \`description\` varchar(255) NOT NULL`);
    }

}
