import { Router } from 'express';
import { pool } from '../config/db.js';

const router = Router();

/**
 * Base de este router (se monta en /api/productos-db desde index.js)
 * Endpoints:
 *  - GET    /              -> Lista todos los productos
 *  - PUT    /votar/:nombre -> Incrementa en +1 la votación del producto {nombre}
 */

// GET /api/productos-db
router.get('/', async (req, res) => {
  try {
    // ---- Aquí se lanzael Query con las instrucciones SQL
    //      que permiten obtener el listado de todos los productos
    const [rows] = await pool.query(
      'SELECT nombre, foto, votacion FROM productos'
    );
    console.log(`✅ OK consulta productos...`);
    // ----  Emite la respuesta convirtiendo y entregando los datos en formato json
    // Entrega JSON plano (ideal para Power Apps)
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al consultar MySQL Railway' });
  }
});


// ===============================
// PUT /api/productos-db/votar/:nombre
// Incrementa en +1 la votación
// ===============================
router.put('/votar/:nombre', async (req, res) => {
  const { nombre } = req.params

  try {
      // ====== Lanza el SQL hacia el servidor de la BD ======
      await pool.query(
        'UPDATE productos SET votacion = votacion + 1 WHERE nombre = ?',
        [nombre]
      )
      console.log(`✅ OK Update producto... ${ nombre }`);
      return res.json({ ok: true })


  } catch (error) {
    console.error('Error al votar:', error)
    res.status(500).json({ ok: false })
  }
})

export default router;
// 