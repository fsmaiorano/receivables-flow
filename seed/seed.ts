import { DataSource } from 'typeorm';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { randomUUID } from 'crypto';
import * as fs from 'fs';
import { faker } from '@faker-js/faker';

const env = process.env.NODE_ENV || 'development';
dotenv.config({ path: `.env.${env}` });

const dbUrl = process.env.DATABASE_URL;
const database = dbUrl?.startsWith('file:') ? dbUrl.substring(5) : dbUrl;

async function seed() {
  console.log(`Connecting to database at: ${database}`);

  const dataSource = new DataSource({
    type: 'sqlite',
    database,
    entities: [path.join(__dirname, '../dist/**/*.entity.js')],
    synchronize: false,
  });

  try {
    await dataSource.initialize();
    console.log('Database connection established successfully');

    const newAssignors = [];
    for (let i = 0; i < 3; i++) {
      newAssignors.push({
        id: randomUUID(),
        document: faker.string.numeric(11),
        email: faker.internet.email(),
        phone: faker.phone.number(),
        name: faker.company.name(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    console.log(`Generated ${newAssignors.length} assignors in memory`);

    for (const assignor of newAssignors) {
      await dataSource.query(
        `INSERT INTO assignor (id, document, email, phone, name, createdAt, updatedAt) 
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          assignor.id,
          assignor.document,
          assignor.email,
          assignor.phone,
          assignor.name,
          assignor.createdAt,
          assignor.updatedAt,
        ],
      );
    }

    console.log(`Created ${newAssignors.length} sample assignors`);

    const assignors = await dataSource.query('SELECT * FROM assignor');

    const payablesToCreate = [];

    for (const assignor of assignors) {
      for (let i = 0; i < Math.floor(Math.random() * 1000); i++) {
        const value = (Math.random() * 10000).toFixed(2);
        const emissionDate = new Date();

        payablesToCreate.push({
          id: randomUUID(),
          value,
          emissionDate: emissionDate.toISOString(),
          assignorId: assignor.id,
          assignorName: assignor.name,
          assignorDocument: assignor.document,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }
    }

    console.log(`Generated ${payablesToCreate.length} payables in memory`);

    const outputDir = path.join(__dirname, 'output');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
    }

    const jsonFilePath = path.join(outputDir, 'seed_payables.json');
    fs.writeFileSync(jsonFilePath, JSON.stringify(payablesToCreate, null, 2));
    console.log(`Saved payables to JSON file: ${jsonFilePath}`);

    const csvFilePath = path.join(outputDir, 'seed_payables.csv');

    const csvHeader =
      'id,value,emissionDate,assignorId,assignorName,assignorDocument,createdAt,updatedAt\n';

    const csvRows = payablesToCreate
      .map(
        (p) =>
          `${p.id},${p.value},"${p.emissionDate}","${p.assignorId}","${p.assignorName}","${p.assignorDocument}","${p.createdAt}","${p.updatedAt}"`,
      )
      .join('\n');

    fs.writeFileSync(csvFilePath, csvHeader + csvRows);

    console.log(`Saved payables to CSV file: ${csvFilePath}`);
    console.log('Seed completed successfully!');
  } catch (error) {
    console.error('Error during seeding:', error);
  } finally {
    if (dataSource.isInitialized) {
      await dataSource.destroy();
      console.log('Database connection closed');
    }
  }
}

seed().catch((error) => {
  console.error('Unhandled error during seeding:', error);
  process.exit(1);
});
