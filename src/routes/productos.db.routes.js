import { Router } from 'express';
import { pool } from '../config/db.js';

const router = Router();
const API_BASE = process.env.API_URL; 
//const API_BASE = import.meta.env.API_URL;
const PATH_FOTOS = '/imagenes/productos'

/* ==========================================================
   FUNCIONES Utilitarias para tratamiento de URLs de imágenes
   ========================================================== */
/**
 * Normaliza el campo 'foto' de uno o varios registros de productos.
 * @param {Object|Array} data - Un objeto (fila) o un Array de objetos (filas).
 * @returns {Object|Array} - Los datos con la URL de la foto completa.
 */
function normalizarProducto(data) {
  const procesar = (item) => {
    let urlFinal = "";
    const foto = item.foto;

    if (!foto) {
      urlFinal = `${API_BASE}${PATH_FOTOS}/no-imagen.jpg`;
    } else if (/^https?:\/\//i.test(foto)) {
      urlFinal = foto; // Ya es absoluta
    } else {
      urlFinal = `${API_BASE}${PATH_FOTOS}/${foto}`; // Es local
    }

    return { ...item, foto: urlFinal };
  };

  // Si es un array, mapeamos; si es un objeto único, lo procesamos directo
  return Array.isArray(data) ? data.map(procesar) : procesar(data);
}


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



// ─────────────────────────────────────────────────────────────
// OBTENER POR ID: GET /api/productos-db/id
// ─────────────────────────────────────────────────────────────
// GET /api/productos-db/id
/*
router.get('/id', async (req, res) => {
  try {
    // ---- Aquí se lanzael Query con las instrucciones SQL
    //      que permiten obtener el listado de todos los productos
    const [rows] = await pool.query(
      'SELECT id_producto, nombre, foto, votacion FROM productos'
    );
    console.log(`✅ OK consulta productos (incluye id)...`);
    // ----  Emite la respuesta convirtiendo y entregando los datos en formato json
    // Entrega JSON plano (ideal para Power Apps)
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al consultar MySQL Railway' });
  }
});
*/
router.get('/id', async (req, res) => {
  try {
    // ---- Aquí se lanzael Query con las instrucciones SQL
    //      que permiten obtener el listado de todos los productos    
    const [rows] = await pool.query(
      'SELECT id_producto, nombre, foto, votacion FROM productos'
    );
    console.log(`✅ OK consulta productos (incluye id)...`);
    // ----  Emite la respuesta convirtiendo y entregando los datos en formato json
    // Entrega JSON plano (ideal para Power Apps)    
    // Normalizamos todo el array
    res.json(normalizarProducto(rows));
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al consultar MySQL' });
  }
});



// ─────────────────────────────────────────────────────────────
// OBTENER POR ID: GET /api/productos-db/id/:id_producto
// ─────────────────────────────────────────────────────────────
router.get('/id/:id_producto', async (req, res) => {
  const id = parseInt(req.params.id_producto, 10);
  if (Number.isNaN(id)) {
      return res.status(400).json({ error: 'id_producto inválido' });
  }

  try {
    // ---- Aquí se lanzael Query con las instrucciones SQL
    //      que permiten obtener el productos solicitado
    const [rows] = await pool.query(
      `SELECT id_producto, nombre, foto, votacion FROM productos
            WHERE id_producto = ?`,
            [id]      
    );

    if (rows.length === 0) return res.status(404).json({ error: 'producto No encontrado' });
    console.log(`✅ OK consulta producto...(${ id })`);     
    return res.json(rows[0]);

  } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Error consultando producto' });
  }
});

router.get('/id/:id_producto', async (req, res) => {
  const id = parseInt(req.params.id_producto, 10);
  if (Number.isNaN(id)) return res.status(400).json({ error: 'id_producto inválido' });

  try {
    // ---- Aquí se lanzael Query con las instrucciones SQL
    //      que permiten obtener el productos solicitado    
    const [rows] = await pool.query(
      `SELECT id_producto, nombre, foto, votacion FROM productos 
          WHERE id_producto = ?`,
          [id]      
    );

    if (rows.length === 0) {
      console.log(`Producto...(${ id }) No encontrado`);   
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    console.log(`✅ OK consulta producto...(${ id })`);     
    // Normalizamos solo el primer registro (rows[0])
    return res.json(normalizarProducto(rows[0]));

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error consultando producto' });
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

    //---------------------------
    // Ajuste  para  guardar integridad en los datos
    // Se guarda inserta registro  en la Tabla de detalle votos
    // tomando como cliente_usuario.id_usuario = 0  (Usuario Front_Vue)
    const fecha = new Date();
    const id_votante = 0;   // id_usuario asignado al Front_Vue

    const [result] = await pool.query(
      `INSERT INTO detalle_votos (id_producto, fecha_voto, id_votante)
       VALUES ((SELECT id_producto from productos WHERE nombre = '${nombre}' LIMIT 1), ?, ?)`,
      [ fecha, id_votante]
    );

      console.log(`✅ OK Update producto... ${ nombre }`);
      console.log(`✅ OK Voto registrado para el usuario...(${ id_votante } - Front_Vue)`);      
      return res.json({ ok: true })

  } catch (error) {
    console.error('Error al votar:', error)
    res.status(500).json({ ok: false })
  }
})

export default router;
// 