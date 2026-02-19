// -----  valida validez de la APIKey suministrada
export default function apiKey(req, res, next) {
  const key = req.header('x-api-key');
  if (!key || key !== process.env.API_KEY) {
    return res.status(401).json({ error: 'API key inválida' });
  }
  next();
}
