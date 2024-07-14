import { DataSource } from 'typeorm'
import { Author, Book } from './schema'

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'db', // Ensure this matches the service name in docker-compose.yml
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'booklist',
  synchronize: true, // This will automatically synchronize your database schema
  logging: false,
  entities: [Author, Book],
  migrations: [],
  subscribers: []
})
