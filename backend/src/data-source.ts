import { DataSource } from 'typeorm'
import { Author, Book } from './schema'
require('dotenv').config()

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST, // Ensure this matches the service name in docker-compose.yml
  port: Number(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  synchronize: true, // This will automatically synchronize your database schema
  logging: false,
  entities: [Author, Book],
  migrations: [],
  subscribers: []
})
