import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1746442156511 implements MigrationInterface {
    name = 'Init1746442156511'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL, "email" varchar NOT NULL, "username" varchar NOT NULL, "password" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"))`);
        await queryRunner.query(`CREATE TABLE "assignor" ("id" varchar PRIMARY KEY NOT NULL, "document" varchar NOT NULL, "email" varchar NOT NULL, "phone" varchar NOT NULL, "name" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "UQ_e14f2618da56beec41f9e127818" UNIQUE ("document"), CONSTRAINT "UQ_32da098b93c2936797955d496b9" UNIQUE ("email"))`);
        await queryRunner.query(`CREATE TABLE "payable" ("id" varchar PRIMARY KEY NOT NULL, "value" decimal(10,2) NOT NULL, "emissionDate" datetime NOT NULL, "assignorId" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')))`);
        await queryRunner.query(`CREATE TABLE "temporary_payable" ("id" varchar PRIMARY KEY NOT NULL, "value" decimal(10,2) NOT NULL, "emissionDate" datetime NOT NULL, "assignorId" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "FK_c5115d307cedc33206805b3df1d" FOREIGN KEY ("assignorId") REFERENCES "assignor" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_payable"("id", "value", "emissionDate", "assignorId", "createdAt", "updatedAt") SELECT "id", "value", "emissionDate", "assignorId", "createdAt", "updatedAt" FROM "payable"`);
        await queryRunner.query(`DROP TABLE "payable"`);
        await queryRunner.query(`ALTER TABLE "temporary_payable" RENAME TO "payable"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payable" RENAME TO "temporary_payable"`);
        await queryRunner.query(`CREATE TABLE "payable" ("id" varchar PRIMARY KEY NOT NULL, "value" decimal(10,2) NOT NULL, "emissionDate" datetime NOT NULL, "assignorId" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')))`);
        await queryRunner.query(`INSERT INTO "payable"("id", "value", "emissionDate", "assignorId", "createdAt", "updatedAt") SELECT "id", "value", "emissionDate", "assignorId", "createdAt", "updatedAt" FROM "temporary_payable"`);
        await queryRunner.query(`DROP TABLE "temporary_payable"`);
        await queryRunner.query(`DROP TABLE "payable"`);
        await queryRunner.query(`DROP TABLE "assignor"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
