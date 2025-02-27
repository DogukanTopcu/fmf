import { DataSource } from 'typeorm';
import { Patient } from '../entities/patient.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5433,
  username: 'postgres',
  password: '11Mart2003',
  database: 'fmf',
  entities: [Patient],
  synchronize: true, // Set to false in production
  logging: true,
}); 