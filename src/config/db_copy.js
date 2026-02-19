
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// Cargar variables de entorno desde .env
dotenv.config();

/**
 * Pool de conexiones MySQL
 * - Usa SSL con rejectUnauthorized:false (Railway lo requiere).
 * - Parsea el puerto a número para evitar comportamientos raros.
 */
export const pool = mysql.createPool({
  host: process.env.MYSQLHOST,
  port: Number(process.env.MYSQLPORT || 3306),
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  // NUEVO: SSL obligatorio en Railway. No quitar a menos que tu proveedor no lo requiera.
  ssl: { rejectUnauthorized: false },
  // Opcional: ajustes de pool
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// NUEVO: Helper opcional para probar conexión al arrancar
export async function testDbConnection() {
  const conn = await pool.getConnection();
  try {
    await conn.ping();
  } finally {
    conn.release();
  }
//  const [rows] = await pool.query('SELECT 1 as ok');
//  return rows[0]?.ok === 1;
}
