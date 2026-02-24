// -----  valida validez de la APIKey suministrada
export default function apiKey(req, res, next) {
  const EXPECTED = process.env.POWERAPPS_API_KEY || process.env.API_KEY || 'miClaveParaPowerApps';  
  const key = req.header('x-api-key');
  if (!key || key !== EXPECTED) {
    // ----- Genera Error 401,  correspondiene a Falla en validación de seguridad!
    return res.status(401).json({ error: 'Unauthorized', message: 'Invalid or missing API key (x-api-key)'});
  }
  next();   // No genera Error. Acepta la validación y da continuidad al programa
}
