import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialMigration1714033125000 implements MigrationInterface {
  name = 'InitialMigration1714033125000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create Users table
    await queryRunner.query(`
            CREATE TABLE "user" (
                "id" varchar PRIMARY KEY NOT NULL,
                "name" varchar NOT NULL,
                "email" varchar NOT NULL UNIQUE,
                "username" varchar NOT NULL UNIQUE,
                "password" varchar NOT NULL,
                "createdAt" datetime NOT NULL DEFAULT (datetime('now')),
                "updatedAt" datetime NOT NULL DEFAULT (datetime('now'))
            )
        `);

    // Create Assignor table
    await queryRunner.query(`
            CREATE TABLE "assignor" (
                "id" varchar PRIMARY KEY NOT NULL,
                "document" varchar NOT NULL UNIQUE,
                "email" varchar NOT NULL UNIQUE,
                "phone" varchar NOT NULL,
                "name" varchar NOT NULL,
                "createdAt" datetime NOT NULL DEFAULT (datetime('now')),
                "updatedAt" datetime NOT NULL DEFAULT (datetime('now'))
            )
        `);

    // Create Payable table
    await queryRunner.query(`
            CREATE TABLE "payable" (
                "id" varchar PRIMARY KEY NOT NULL,
                "value" decimal(10,2) NOT NULL UNIQUE,
                "emissionDate" datetime NOT NULL,
                "assignorId" varchar NOT NULL,
                "createdAt" datetime NOT NULL DEFAULT (datetime('now')),
                "updatedAt" datetime NOT NULL DEFAULT (datetime('now')),
                CONSTRAINT "FK_payable_assignor" FOREIGN KEY ("assignorId") REFERENCES "assignor" ("id")
            )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "payable"`);
    await queryRunner.query(`DROP TABLE "assignor"`);
    await queryRunner.query(`DROP TABLE "user"`);
  }
}
