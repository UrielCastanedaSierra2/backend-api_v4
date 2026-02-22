import { Router } from 'express';
import { pool } from '../config/db.js';

const router = Router();

/**
 * POST /api/votos
 * Body esperado: { id_producto: number, id_votante: number }
 * Inserta voto con fecha actual.
 * Respuesta 201: { id_voto, id_producto, id_votante, fecha_voto }
 */
router.post('/', async (req, res) => {
  try {
    const { id_producto, id_votante } = req.body;

    if (!id_producto || !id_votante) {
      return res.status(400).json({ error: 'Datos incompletos' });
    }

    const fecha = new Date();

    // Si id_voto es AUTO_INCREMENT en BD, insertId funcionará.
    const [result] = await pool.query(
      `INSERT INTO detalle_votos (id_producto, fecha_voto, id_votante)
       VALUES (?, ?, ?)`,
      [id_producto, fecha, id_votante]
    );

    console.log(`✅ OK Voto registrado para el usuario...(${ id_votante }) --> producto (${ id_producto })`);

    return res.status(201).json({
      id_voto: result.insertId, // ← Será 0 si la PK no es AUTO_INCREMENT
      id_producto,
      id_votante,
      fecha_voto: fecha
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error registrando voto' });
  }
});

/**
 * (Opcional) GET /api/votos/usuario/:id_votante
 * Lista los votos de un usuario (para pruebas y verificación).
 */
router.get('/usuario/:id_votante', async (req, res) => {
  const id = parseInt(req.params.id_votante, 10);
  if (Number.isNaN(id)) return res.status(400).json({ error: 'id_votante inválido' });

  try {
    const [rows] = await pool.query(
      `SELECT id_voto, id_producto, fecha_voto, id_votante
       FROM detalle_votos
       WHERE id_votante = ?
       ORDER BY fecha_voto DESC`,
      [id]
    );
    if (rows.length === 0) console.log(`❌ usuario (${ id }) No tiene votos.`);
    else  console.log(`✅ OK Listado de Votos Consultado por id...(${ id })`);        
    return res.json(rows);

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error consultando votos' });
  }
});

export default router;