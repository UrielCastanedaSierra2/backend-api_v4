import { Router } from 'express';
import { pool } from '../config/db.js';

const router = Router();

/**
 * Base de este router (se monta en /api/users desde app.js)
 * Endpoints:
 *  - GET    /           -> Lista todos
 *  - POST   /           -> Crea uno
 *  - GET    /:id        -> Obtiene por id
 *  - PUT    /:id        -> Actualiza parcial
 *  - DELETE /:id        -> Elimina
 *
 * Tabla urilizada:
 *  cliente_usuario(
        `id_usuario` int unsigned NOT NULL AUTO_INCREMENT,
        `nombres` varchar(50) NOT NULL,
        `apellidos` varchar(50) NOT NULL,
        `email` varchar(80) NOT NULL,
        `telefono` varchar(30) NOT NULL,
        `creado_en` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (`id_usuario`),
        UNIQUE KEY `email` (`email`) USING BTREE
    ) ENGINE=InnoDB
    DEFAULT CHARSET=utf8mb4 
    COLLATE=utf8mb4_spanish2_ci
 */

// Helper para validación...
// Verifica que la estructura de sintaxis de una dirección email sea correcta.
// realiza validación con "EXPRESIONES REGULARES".
const validarEmail = (correo) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);


// ─────────────────────────────────────────────────────────────
// LISTAR: GET /api/users
// ─────────────────────────────────────────────────────────────
router.get('/', async (_req, res) => {
    try {
        const [rows] = await pool.query(
            `SELECT id_usuario, nombres, apellidos, email, telefono
            FROM cliente_usuario
            ORDER BY id_usuario DESC`
        );
        console.log(`✅ OK consulta usuarios...`);        
        return res.json(rows);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Error listando usuarios' });
    }
});


// ─────────────────────────────────────────────────────────────
// OBTENER POR ID: GET /api/users/:id_usuario
// ─────────────────────────────────────────────────────────────
router.get('/:id_usuario', async (req, res) => {
    const id = parseInt(req.params.id_usuario, 10);
    if (Number.isNaN(id)) {
        return res.status(400).json({ error: 'id_usuario inválido' });
    }

    try {
        const [rows] = await pool.query(
            `SELECT id_usuario, nombres, apellidos, email, telefono
            FROM cliente_usuario
            WHERE id_usuario = ?`,
            [id]
        );
        if (rows.length === 0) return res.status(404).json({ error: 'usuario No encontrado' });
        console.log(`✅ OK consulta Usuario ...(${ id })`);        
        return res.json(rows[0]);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Error consultando usuario' });
    }
});

// ─────────────────────────────────────────────────────────────
// CREAR: POST /api/users
// (tu versión ya funcionó; la dejo aquí consolidada)
// ─────────────────────────────────────────────────────────────
router.post('/', async (req, res) => {
    try {
        const { nombres, apellidos, email, telefono } = req.body;

        if (!nombres || !apellidos || !email || !telefono || !validarEmail(email)) {
            return res.status(400).json({ error: 'Datos inválidos' });
        }

        const [result] = await pool.query(
            'INSERT INTO cliente_usuario (nombres, apellidos, email, telefono) VALUES (?, ?, ?, ?)',
            [nombres, apellidos, email, telefono]
        );

        const [rows] = await pool.query(
            `SELECT id_usuario, nombres, apellidos, email, telefono
            FROM cliente_usuario WHERE id_usuario = ?`,
            [result.insertId] // ✔️ insertId siempre es el valor autoincremental, sin importar el nombre de la PK
        );

        console.log(`✅ OK Nuevo usuario...(${ result.insertId }) ${ nombres } ${ apellidos }`);
        return res.status(201).json(rows[0]);

    } catch (err) {
        console.error(err);
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'El email de este usuario ya existe' });
        }
        return res.status(500).json({ error: 'Error creando usuario' });
    }
});

// ─────────────────────────────────────────────────────────────
// ACTUALIZAR: PUT /api/users/:id_usuario
// (actualización completa; requiere todos los campos)
// ─────────────────────────────────────────────────────────────
router.put('/:id_usuario', async (req, res) => {
    const id = parseInt(req.params.id_usuario, 10);
    if (Number.isNaN(id)) {
        return res.status(400).json({ error: 'id_usuario inválido' });
    }

    const { nombres, apellidos, email, telefono } = req.body;

    if (!nombres || !apellidos || !email || !telefono || !validarEmail(email)) {
        return res.status(400).json({ error: 'Datos inválidos' });
    }

    try {
        const [result] = await pool.query(
            `UPDATE cliente_usuario
            SET nombres = ?, apellidos = ?, email = ?, telefono = ?
            WHERE id_usuario = ?`,
            [nombres, apellidos, email, telefono, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        console.log(`✅ OK Update usuario...(${ id }) ${ nombres } ${ apellidos }`);
        const [rows] = await pool.query(
            `SELECT id_usuario, nombres, apellidos, email, telefono
            FROM cliente_usuario WHERE id_usuario = ?`,
            [id]
        );

        return res.json(rows[0]);

    } catch (err) {
        console.error(err);
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'El email ya existe' });
        }
        return res.status(500).json({ error: 'Error actualizando usuario' });
    }
});

// ─────────────────────────────────────────────────────────────
// ELIMINAR: DELETE /api/users/:id_usuario
// ─────────────────────────────────────────────────────────────
router.delete('/:id_usuario', async (req, res) => {
    const id = parseInt(req.params.id_usuario, 10);
    if (Number.isNaN(id)) {
        return res.status(400).json({ error: 'id_usuario inválido' });
    }

    try {
        const [result] = await pool.query(
            `DELETE FROM cliente_usuario
            WHERE id_usuario = ?`,
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        console.log(`✅ OK DELETE usuario...(${ id })`);
        return res.status(204).send(); // No Content

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Error eliminando usuario' });
    }
});

// ─────────────────────────────────────────────────────────────
// CONSULTAR USUARIO por email -  GET /api/users/email/:email
// ─────────────────────────────────────────────────────────────
router.get('/email/:email', async (req, res) => {
  const email = req.params.email;

  try {
    const [rows] = await pool.query(
      `SELECT id_usuario, nombres, apellidos, email, telefono
       FROM cliente_usuario
       WHERE email = ?`,
      [email]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    console.log(`✅ OK consulta Usuario ...(${ email })`);     
    return res.json(rows[0]);

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error consultando usuario por correo' });
  }
});

export default router;