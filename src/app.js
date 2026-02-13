// =================================
// =    PRIMER SERVIDOR EXPRESS    =
// =================================

import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// Para conectar las rutas al servidor
import productosRoutes from './routes/productos.routes.js';
import productosDbRoutes from './routes/productos.db.routes.js';

const app = express();

// Habilita CORS para permitir que el Front consuma las APIs
app.use(cors());            // ← Añade cabeceras CORS automáticamente
app.use(express.json());    // ← Permite recibir JSON en el body (para futuros POST)


// ---- SERVIR ARCHIVOS ESTÁTICOS ----
// Esto permite acceder a /imagenes/productos/archivo.jpg desde el navegador.
// Ej: http://localhost:3000/imagenes/productos/elseve.jpg
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
app.use(express.static(path.resolve(__dirname, '../public')));
// -----------------------------------

// Todas las rutas del servidor se conectan en estos prefijos
// Rutas de la API (prefijo: /api/productos)
app.use('/api/productos', productosRoutes);

// Rutas de la API (prefijo: /api/productos-db)
app.use('/api/productos-db', productosDbRoutes);


export default app;

/* ====  EXPLICACIÓN =====
express()
👉 Crea la app servidor

app.use(cors())
👉 Permite que otros orígenes (frontend) accedan
   (Los navegadores respetan estas cabeceras CORS) 

app.use(express.json())
👉 Permite recibir datos JSON en futuras rutas POST/PUT

app.use('/api/productos', productosRoutes);
app.use('/api/productos-db', productosDbRoutes);
👉 Todas las rutas definidas en productos.routes.js 
   "viven" bajo /api/productos
👉 Todas las rutas definidas en productos.db.routes.js 
   "viven" bajo /api/productos   
*/