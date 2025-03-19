const express = require("express");
const cors = require("cors");  // Importa el middleware CORS
const path = require("path");
const fs = require("fs").promises;
const procesarCarpeta = require("./processFiles.js");  // Importa la función de procesamiento de archivos
const empleadosRoutes = require("./routes/empleados.js");  // Importa las rutas de empleados

const app = express();
const PORT = process.env.PORT || 9097;

// Habilitar CORS
app.use(cors({
  origin: "http://localhost:3000",  // Permitir solicitudes solo desde este origen
}));

// Middleware para JSON y URL-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas de empleados
app.use("/empleados", empleadosRoutes);  // Usando las rutas de empleados

// Endpoint para iniciar el procesamiento de archivos
app.post("/procesar-archivos", async (req, res) => {
    try {
        console.log("📂 Iniciando procesamiento de archivos...");
        await procesarCarpeta();
        res.status(200).send("✅ Archivos procesados con éxito.");
    } catch (error) {
        console.error("❌ Error al procesar archivos:", error);
        res.status(500).send("❌ Error al procesar los archivos.");
    }
});

// Ruta para verificar si el servidor está corriendo
app.get("/", (req, res) => {
    res.send("Servidor en funcionamiento");
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
