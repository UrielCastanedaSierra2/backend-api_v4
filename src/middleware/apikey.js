// -----  valida validez de la APIKey suministrada
export default function apiKey(req, res, next) {
  
  // ------  Se VERIFICA EL ENTORNO DE TRABAJO ACTUAL -----
  //         Si está en DESARROLLO o PRUEBAS,  se puede  excluir las validaciones 
  //         de RUTAS ORIGEN  y API-KEY

  // 1) Preflight CORS: nunca exigir API key
  if (req.method === 'OPTIONS') return res.sendStatus(204);


  // 2) Bypass explícito para /api/ping-public
  // Nota: cuando el middleware está montado con '/api', req.path es relativo a '/api'
  const isPublicPing =
    req.originalUrl === '/api/ping-public' ||
    req.path === '/ping-public';

  if (isPublicPing) {
    return next();
  }

  // 3) Bypass en desarrollo (solo local/labs)
  if (process.env.NODE_ENV === 'development' || process.env.SKIP_API_KEY === 'true') {
    return next();
  }

  // 3) Validación normal de API Key (producción)
  // en PRODUCCIÓN  son obligatorias las validaciones. 
  const EXPECTED = process.env.POWERAPPS_API_KEY || process.env.API_KEY || 'miClaveParaPowerApps';  
  const key = req.header('x-api-key');
  if (!key || key !== EXPECTED) {
    // ----- Genera Error 401,  correspondiene a Falla en validación de seguridad!
    return res.status(401).json({ error: 'Acceso No Autorizado', message: 'API key Inválida o errada...'});
  }
  next();   // No genera Error. Acepta la validación y da continuidad al programa
}

/* ---------------- tener en cuenta -----
En .env de producción:
POWERAPPS_API_KEY=miClaveParaPowerApps
En desarrollo puedes setear:
NODE_ENV=development (o) SKIP_API_KEY=true
---------------------

Operaciones públicas con security: []:

"/health" (para monitoreo)
"/api/ping-public" (para testear CORS/conectividad sin auth)

Operaciones protegidas (ejemplos):

"/api/ping" → requiere x-api-key (salvo bypass dev)
"/api/productos-db"
"/api/users", "/api/votos"

*/
