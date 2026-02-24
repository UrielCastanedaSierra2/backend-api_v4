// -----  valida validez de la APIKey suministrada
export default function apiKey(req, res, next) {
  
  // ------  Se VERIFICA EL ENTORNO DE TRABAJO ACTUAL -----
  //         Si está en DESARROLLO o PRUEBAS,  se puede  excluir las validaciones 
  //         de RUTAS ORIGEN  y API-KEY

  // Permitir preflight CORS
  if (req.method === 'OPTIONS') return res.sendStatus(204);

  // Bypass en desarrollo
  if (process.env.NODE_ENV === 'development' || process.env.SKIP_API_KEY === 'true') {
    return next();
  }

  // en PRODUCCIÓN  se dejan obligatorias las validaciones. 
  const EXPECTED = process.env.POWERAPPS_API_KEY || process.env.API_KEY || 'miClaveParaPowerApps';  
  const key = req.header('x-api-key');
  if (!key || key !== EXPECTED) {
    // ----- Genera Error 401,  correspondiene a Falla en validación de seguridad!
    return res.status(401).json({ error: 'Acceso No Autorizado', message: 'API key Inválida o errada...'});
  }
  next();   // No genera Error. Acepta la validación y da continuidad al programa
}
