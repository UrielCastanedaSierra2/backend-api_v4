// =================================
// =    Arranque del servidor      =
// =================================

import app from './src/app.js';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

/* ====  EXPLICACIÓN =====
listen(3000)
👉 El servidor queda “escuchando” peticiones

📌 Analogía:
Es como una tienda que abre la puerta y espera clientes.
*/