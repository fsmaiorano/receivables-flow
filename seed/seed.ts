import { DataSource } from 'typeorm';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { randomUUID } from 'crypto';

// Load environment variables
const env = process.env.NODE_ENV || 'development';
dotenv.config({ path: `.env.${env}` });

// Get database URL from environment
const dbUrl = process.env.DATABASE_URL;
// Remove file: prefix if it exists
const database = dbUrl?.startsWith('file:') ? dbUrl.substring(5) : dbUrl;

// Sample data for creating assignors
const sampleAssignors = [
  {
    id: randomUUID(),
    document: '12345678901',
    email: 'company1@example.com',
    phone: '11999998888',
    name: 'Company One Ltd',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: randomUUID(),
    document: '98765432109',
    email: 'company2@example.com',
    phone: '11888889999',
    name: 'Company Two Inc',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: randomUUID(),
    document: '56789012345',
    email: 'company3@example.com',
    phone: '11777776666',
    name: 'Company Three Corp',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

async function seed() {
  console.log(`Connecting to database at: ${database}`);

  // Create a connection to the database
  const dataSource = new DataSource({
    type: 'sqlite',
    database,
    entities: [path.join(__dirname, '../dist/**/*.entity.js')],
    synchronize: false,
  });

  try {
    // Initialize the connection
    await dataSource.initialize();
    console.log('Database connection established successfully');

    // Get all assignors
    let assignors = await dataSource.query('SELECT * FROM assignor');
    console.log(`Found ${assignors.length} existing assignors`);

    // Create assignors if none exist
    if (assignors.length === 0) {
      console.log('No assignors found. Creating sample assignors...');

      for (const assignor of sampleAssignors) {
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

      console.log(`Created ${sampleAssignors.length} sample assignors`);

      // Get the newly created assignors
      assignors = await dataSource.query('SELECT * FROM assignor');
    }

    // Create payables for each assignor
    const payablesToCreate = [];

    for (const assignor of assignors) {
      // Create 3 payables per assignor
      for (let i = 0; i < 3; i++) {
        const value = (Math.random() * 10000).toFixed(2);
        const emissionDate = new Date();

        payablesToCreate.push({
          id: randomUUID(),
          value,
          emissionDate: emissionDate.toISOString(),
          assignorId: assignor.id,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }
    }

    // Insert payables
    console.log(`Creating ${payablesToCreate.length} payables...`);

    for (const payable of payablesToCreate) {
      await dataSource.query(
        `INSERT INTO payable (id, value, emissionDate, assignorId, createdAt, updatedAt) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          payable.id,
          payable.value,
          payable.emissionDate,
          payable.assignorId,
          payable.createdAt,
          payable.updatedAt,
        ],
      );
    }

    console.log('Seed completed successfully!');
  } catch (error) {
    console.error('Error during seeding:', error);
  } finally {
    // Close the connection
    if (dataSource.isInitialized) {
      await dataSource.destroy();
      console.log('Database connection closed');
    }
  }
}

// Run the seed function
seed().catch((error) => {
  console.error('Unhandled error during seeding:', error);
  process.exit(1);
});
