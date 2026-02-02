import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config(); // 👈 VERY important for CLI

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABSE_HOST,
  port: Number(process.env.DATABSE_PORT),
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,

  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/common/database/migrations/*.js'],
  migrationsTableName: 'migrations',

  synchronize: false, // 🚫 always false
});