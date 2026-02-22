// =================================
// =     SERVIDOR EXPRESS  app.js  =
// =================================

import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// 🧰🔑 ==== IMPORTS para Control y definición de APIs =====
// Herramientas intermediarias (middleware) .... 
// función apiKey() para validación de Password o Calve para acceder a las APIs
import apiKey from './middleware/apikey.js';

// Para conectar las rutas al servidor
// 👁️‍🗨️ Conservamos EXACTAMENTE imports de la versión funcional de API a productos
import productosRoutes from './routes/productos.routes.js';
import productosDbRoutes from './routes/productos.db.routes.js';

// 👇 NUEVOS IMPORTS 
// versión funcional de API a cliente_usuario
import usersRouter from './routes/users.routes.js';

// versión funcional de API para registrar y consultar votos
import votosRouter from './routes/votos.routes.js';  

const app = express();

// ───────────────────────────────────────────
// 1) Middlewares base (antes de las rutas)
// ───────────────────────────────────────────

// Configuración CORS desde variables de entorno:
// - CORS_ORIGINS: lista separada por coma. (para lista Blanca o URLs permitidas)
//   Ej: http://localhost:5173,https://apps.powerapps.com

//   Si no está definida, abrir a '*'.
const rawOrigins = process.env.CORS_ORIGINS || '*';
const allowedOrigins =
   (rawOrigins === '*')
      ? '*'
      : rawOrigins.split(',').map((o) => o.trim()).filter(Boolean);

// 🔹 CORS (dejamos activo CORS para cuando ralizamos pruebas desde el navegador o Power Apps)      
app.use(
   cors({
      origin: allowedOrigins, // 👉 Cambiar a lista blanca si quieres restringir: ['http://localhost:5173', ...]
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
app.use('/api', apiKey);     // La apiKey aplica a todas las APIs definidas en /api/*

// ───────────────────────────────────────────
// 4) Rutas de las APIs definidas en la aplicación
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
// por ejemplo...
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
(la clave debe estar registrada en .env → API_KEY)

Rutas:
👉 /api/productos            (productosRoutes)
👉 /api/productos-db         (productosDbRoutes)
👉 /api/users                (usersRouter)

*/
