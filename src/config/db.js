// src/config/db.js
import mysql from 'mysql2/promise';

const {
  MYSQLHOST,
  MYSQLPORT,
  MYSQLUSER,
  MYSQLPASSWORD,
  MYSQLDATABASE
} = process.env;

// (Opcional) compatibilidad si algún día usas nombres DB_*:
const host = MYSQLHOST || process.env.DB_HOST || 'localhost';
const port = Number(MYSQLPORT || process.env.DB_PORT || 3306);
const user = MYSQLUSER || process.env.DB_USER || 'root';
const password = MYSQLPASSWORD || process.env.DB_PASS || '';
const database = MYSQLDATABASE || process.env.DB_NAME || 'test';

export const pool = mysql.createPool({
  host,
  port,
  user,
  password,
  database,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4', // ya estás unificado en BD, pero sumamos defensa
});

export async function testDbConnection() {
  const conn = await pool.getConnection();
  try {
    await conn.ping();
  } finally {
    conn.release();
  }
}