import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { pool } from './db.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Crear tabla si no existe
const createTableIfNotExists = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS entregas (
        id SERIAL PRIMARY KEY,
        foto TEXT,
        firma TEXT,
        comentario TEXT,
        checklist JSONB,
        fecha TEXT
      )
    `);
    console.log('Tabla "entregas" verificada o creada.');
  } catch (error) {
    console.error('Error creando tabla:', error);
  }
};

app.post('/api/entregas', async (req, res) => {
  const { foto, firma, comentario, checklist, fecha } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO entregas (foto, firma, comentario, checklist, fecha)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [foto, firma, comentario, checklist, fecha]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al guardar entrega' });
  }
});

app.get('/api/entregas', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM entregas ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener entregas' });
  }
});

app.listen(PORT, async () => {
  console.log(`API escuchando en puerto ${PORT}`);
  await createTableIfNotExists();
});
