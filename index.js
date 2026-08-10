const express = require('express');
const { query } = require('./src/db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Endpoint de salud del sistema (Health Check) para monitoreo en la nube
app.get('/health', async (req, res) => {
    try {
        const dbCheck = await query('SELECT NOW()');
        res.status(200).json({
            status: 'SUCCESS',
            message: 'Sistema CRM operando correctamente',
            database_time: dbCheck.rows[0].now,
            environment: process.env.NODE_ENV || 'development'
        });
    } catch (error) {
        console.error('Fallo en la prueba de salud:', error);
        res.status(500).json({
            status: 'ERROR',
            message: 'No se pudo establecer conexión con la base de datos GC',
            error: error.message
        });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 [Server]: Servidor CRM corriendo de forma óptima en el puerto ${PORT}`);
});