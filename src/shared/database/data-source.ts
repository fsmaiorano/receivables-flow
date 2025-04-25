import { DataSource } from 'typeorm';
import { join } from 'path';
import * as dotenv from 'dotenv';

// Load the appropriate .env file
const env = process.env.NODE_ENV || 'development';
dotenv.config({ path: `.env.${env}` });

// Get database URL from environment
const dbUrl = process.env.DATABASE_URL;
// Remove file: prefix if it exists
const database = dbUrl.startsWith('file:') ? dbUrl.substring(5) : dbUrl;

export default new DataSource({
  type: 'sqlite',
  database,
  entities: [join(__dirname, '../../**', '*.entity.{ts,js}')],
  migrations: [join(__dirname, 'migrations', '*.{ts,js}')],
  synchronize: false,
});
