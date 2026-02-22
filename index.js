// =================================
// =      ENTRADA DEL SERVIDOR     =
// =            index.js           =
// =================================

// 1) -------- Carga variables de entorno desde .env (antes que todo)
import 'dotenv/config';

import http from 'http';
import app from './src/app.js';
import { testDbConnection } from './src/config/db.js';

// 2) --------- (Opcional) Log mínimo de entorno
console.log(`🌱 Entorno: ${process.env.NODE_ENV || 'development'}`);
console.log(`🗄️  Base de datos: ${process.env.MYSQLDATABASE || '(sin DB_NAME definido)'}`);
console.log(`🔌 Host: ${process.env.MYSQLHOST}:${process.env.MYSQLPORT}`);

// 3) --------- Función encargada de verificar la conexión a la BD al iniciar
testDbConnection()
  .then(() => console.log('✅ Conexión a BD OK'))
  .catch((err) => {
    console.error('❌ Error al conectar a BD:', err?.message || err);
    // En caso de requerir abortar el arranque ante un error, descomenta:
    // process.exit(1);
  });

// 4) ---------- 🏁🚦🟢 Crear y levantar servidor HTTP (dar inicio) ✅
const PORT = Number(process.env.PORT) || 3000;
const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`🚀 Servidor escuchando en http://localhost:${PORT} ✅`);
});

/* ====  EXPLICACIÓN =====
listen(PORT)
👉 El servidor queda “escuchando” peticiones  

📌 Analogía:
Es como una tienda que abre la puerta y espera clientes.
*/
