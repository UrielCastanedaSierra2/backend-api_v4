// =================================
// =    Primer endpoint (GET)      =
// =================================

import { Router } from 'express';

const router = Router();

// GET /api/productos/
// 👉 Devuelve un listado estático de productos (JSON)
router.get('/', (req, res) => {
  res.json([
    { nombre: 'Revitalift',     foto: 'revitalift.avif',  votacion: 120 },
    { nombre: 'Elseve',         foto: 'elseve.jpg',       votacion: 98  },
    { nombre: 'Infallible',     foto: 'infallible.jfif',  votacion: 150 },
    { nombre: 'Elvive',         foto: 'elvive.avif',      votacion: 87  },
    { nombre: 'True Match',     foto: 'truematch.webp',   votacion: 110 },
    { nombre: 'Preference',     foto: 'preference.jpg',   votacion: 65  },
    { nombre: 'Men Expert',     foto: 'menexpert.jpg',    votacion: 45  },
    { nombre: 'Age Perfect',    foto: 'ageperfect.webp',  votacion: 72  },
    { nombre: 'Casting Crème',  foto: 'castingcreme.webp',votacion: 90  },
    { nombre: 'Studio Line',    foto: 'studioline.jpg',   votacion: 30  }
  ]);
});

export default router;

/* ====  EXPLICACIÓN =====
¿Qué es un endpoint?
👉 Es una URL específica que hace algo.
Ej: GET http://localhost:3000/api/productos

router.get()
👉 Atiende peticiones GET

req  (request)
👉 Lo que llega

res  (response)
👉 Lo que respondemos

res.json()
👉 Devuelve datos en formato JSON
*/