import mysql from 'mysql2/promise';

const connectionConfig = {
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '3306', 10),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

export default async function createConnection(): Promise<mysql.Connection> {
    return await mysql.createConnection(connectionConfig);
};