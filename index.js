// index.js - ARRANQUE Y VERIFICACIÓN DE CONEXIÓN POSTGRESQL
const express = require('express');
const path = require('path');
const db = require('./src/db'); // Módulo de conexión a Postgres que ya tienes en src/db.js
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Ruta de prueba para comprobar el servidor y PostgreSQL de un solo golpe
app.get('/health', async (req, res) => {
    try {
        const dbCheck = await db.query('SELECT NOW() AS database_time, CURRENT_DATABASE() AS db_name');
        res.status(200).json({
            status: 'ONLINE',
            message: 'Servidor y PostgreSQL conectados exitosamente',
            database: dbCheck.rows[0].db_name,
            tiempo_servidor_db: dbCheck.rows[0].database_time
        });
    } catch (error) {
        res.status(500).json({
            status: 'ERROR_DB',
            message: 'El servidor está activo, pero falló la conexión con PostgreSQL',
            error: error.message
        });
    }
});

app.listen(PORT, () => {
    console.log(`[Servidor GC]: Corriendo en http://localhost:${PORT}`);
    console.log(`[Base de Datos]: Conectando a PostgreSQL (${process.env.DB_HOST || 'localhost'})`);
});