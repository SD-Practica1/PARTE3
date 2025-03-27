// empleados.js
const express = require("express");
const router = express.Router();
const pool = require("../db.js"); // Importamos el pool de conexiones desde db.js
// Ruta para obtener todos los empleados
router.get("/", async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT id, nombre, departamento_id FROM Empleado");

        if (rows.length > 0) {
            res.json(rows); // Devuelve los empleados como respuesta en formato JSON
        } else {
            res.status(404).json({ message: "No se encontraron empleados." });
        }
    } catch (error) {
        console.error("❌ Error al obtener empleados:", error);
        res.status(500).json({ message: "Error al obtener empleados" });
    }
});

// 🔹 Ruta para obtener los registros de asistencia de un empleado
router.get("/:id/asistencia", async (req, res) => {
    const empleadoId = req.params.id;  // ID del empleado desde los parámetros de la URL

    try {
        // Consulta SQL para obtener los registros de entrada y salida de un empleado específico
        const [rows] = await pool.query(
            `SELECT fecha, 
                    MAX(CASE WHEN tipo = 'Entrada' THEN hora ELSE NULL END) AS entrada,
                    MAX(CASE WHEN tipo = 'Salida' THEN hora ELSE NULL END) AS salida
            FROM Registro_Entrada_Salida 
            WHERE empleado_id = ? 
            GROUP BY fecha
            ORDER BY fecha DESC`, [empleadoId]
        );

        // Verificar si se encontraron registros
        if (rows.length > 0) {
            res.json(rows); // Devuelve los registros como respuesta en formato JSON
        } else {
            res.status(404).json({ message: "No se encontraron registros de asistencia para este empleado." });
        }
    } catch (error) {
        console.error("❌ Error al obtener los registros de asistencia:", error);
        res.status(500).json({ message: "Error al obtener los registros de asistencia" });
    }
});

router.get("/asistencia", async (req, res) => {
    try {
        // Consulta SQL para obtener todos los registros de asistencia
        const [rows] = await pool.query(
            `SELECT e.nombre, fecha, 
                    MAX(CASE WHEN tipo = 'Entrada' THEN hora ELSE NULL END) AS entrada,
                    MAX(CASE WHEN tipo = 'Salida' THEN hora ELSE NULL END) AS salida
            FROM Registro_Entrada_Salida r
            INNER JOIN empleado e ON r.empleado_id = e.id
            GROUP BY empleado_id, fecha
            ORDER BY e.nombre`
        );

        // Verificar si se encontraron registros
        if (rows.length > 0) {
            res.json(rows); // Devuelve los registros como respuesta en formato JSON
        } else {
            res.status(404).json({ message: "No se encontraron registros de asistencia." });
        }
    } catch (error) {
        console.error("❌ Error al obtener la lista de asistencia:", error);
        res.status(500).json({ message: "Error al obtener la lista de asistencia" });
    }
});

module.exports = router;
