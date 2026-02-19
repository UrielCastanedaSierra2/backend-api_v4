// =================================
// =     SERVIDOR EXPRESS  app.js  =
// =================================
function apiKey(req, res, next) {
  const key = req.header('x-api-key');
  if (!key || key !== process.env.API_KEY) {
    return res.status(401).json({ error: 'API key inválida' });
  }
  next();
}

import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// Para conectar las rutas al servidor
// 👁️‍🗨️ Conservamos EXACTAMENTE imports de la versión funcional de API a productos
import productosRoutes from './routes/productos.routes.js';
import productosDbRoutes from './routes/productos.db.routes.js';

// 👇 NUEVOS IMPORTS 
// tener en cuenta la unicación real del middleware..  ajustar al path correcto:
//import apiKey from './middleware/apiKey.js';

// versión funcional de API a cliente_usuario
import usersRouter from './routes/users.routes.js';

// versión funcional de API para registrar y consultar votos
import votosRouter from './routes/votos.routes.js';  

const app = express();

// ───────────────────────────────────────────
// 1) Middlewares base (antes de las rutas)
// ───────────────────────────────────────────

// Configuración CORS desde variables de entorno:
// - CORS_ORIGINS: lista separada por coma. 
//   Ej: http://localhost:5173,https://apps.powerapps.com

//   Si no está definida, abrir a '*'.
const rawOrigins = process.env.CORS_ORIGINS || '*';
const allowedOrigins =
   (rawOrigins === '*')
      ? '*'
      : rawOrigins.split(',').map((o) => o.trim()).filter(Boolean);

app.use(
   cors({
      origin: allowedOrigins, // 👉 Cambia a lista blanca si quieres restringir: ['http://localhost:5173', ...]
      methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
      allowedHeaders: ['Content-Type', 'x-api-key', 'Authorization'],
      credentials: false, // poner true en caso de manejar cookies/sesiones con front
   })
);

app.use(express.json());                           // ← Body JSON
app.use(express.urlencoded({ extended: true }));   // ← Formularios (opcional)

// ───────────────────────────────────────────
// 2) Servir archivos estáticos (se conserva definición funcional - productos)
//    Permite acceder a /imagenes/productos/archivo.jpg
//    Ej: http://localhost:3000/imagenes/productos/elseve.jpg
// ───────────────────────────────────────────
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
app.use(express.static(path.resolve(__dirname, '../public')));

// ───────────────────────────────────────────
// 3) Seguridad básica: API Key para todas las rutas /api/*
//    (Debe ir ANTES del montaje de rutas /api/...)
// ───────────────────────────────────────────
app.use('/api', apiKey);

// ───────────────────────────────────────────
// 4) Rutas de la aplicación
// ───────────────────────────────────────────

// Rutas de la API (prefijo: /api/productos)
app.use('/api/productos', productosRoutes);     

// Rutas de la API (prefijo: /api/productos-db)
app.use('/api/productos-db', productosDbRoutes); 

// Rutas de la API (prefijo: /api/users)
app.use('/api/users', usersRouter);             // ← NUEVA: Usuarios (cliente_usuario)

// Rutas de la API de votos (prefijo: /api/votos)
app.use('/api/votos', votosRouter);             // ← NUEVA: detalle_votos

// ───────────────────────────────────────────
// 5) Health-check (opcional, útil para monitoreo)
// retorna  mensaje  de confirmación de  enlace correcta de la API  
// al invocar la cabecera 
// ───────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({ ok: true, msg: 'Servidor operativo' });
});

export default app;

/* ====  EXPLICACIÓN =====
express()
👉 Crea la app servidor

app.use(cors(...))
👉 Habilita CORS (configurable: origen, métodos, headers)

app.use(express.json())
👉 Permite recibir datos JSON en rutas POST/PUT

app.use(express.static(...))
👉 Sirve archivos estáticos desde /public

app.use('/api', apiKey)
👉 Exige x-api-key en todas las rutas que empiezan con /api/*

app.use('/api/productos', productosRoutes);
app.use('/api/productos-db', productosDbRoutes);
👉 Tus rutas de productos quedan intactas

app.use('/api/users', usersRouter);
👉 Se agregan las rutas de usuarios (tabla cliente_usuario)
*/
