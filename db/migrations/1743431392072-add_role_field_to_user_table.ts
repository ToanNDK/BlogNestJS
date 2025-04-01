import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRoleFieldToUserTable1743431392072 implements MigrationInterface {
    name = 'AddRoleFieldToUserTable1743431392072'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`roles\` varchar(255) NOT NULL DEFAULT 'User'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`roles\``);
    }

}
