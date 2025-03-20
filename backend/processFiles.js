// processFiles.js
const path = require("path");
const fs = require("fs").promises;
const readline = require("readline");
const pool = require("./db");

const UPLOAD_DIR = path.join(__dirname, "../leer");

async function obtenerArchivos() {
    try {
        const files = await fs.readdir(UPLOAD_DIR);
        const txtFiles = files.filter(file => file.endsWith(".txt"));
        return txtFiles.map(file => path.join(UPLOAD_DIR, file)); 
    } catch (error) {
        console.error("❌ Error leyendo la carpeta de archivos:", error);
        return [];
    }
}

async function insertarDepartamentos(connection, departamentos) {
    for (const [nombre] of departamentos) {
        const [rows] = await connection.execute("SELECT id FROM Departamento WHERE nombre = ?", [nombre]);

        let departamentoId;
        if (rows.length > 0) {
            departamentoId = rows[0].id;
        } else {
            const [result] = await connection.execute("INSERT INTO Departamento (nombre) VALUES (?)", [nombre]);
            departamentoId = result.insertId;
        }
        departamentos.set(nombre, departamentoId);
    }
}

async function insertarEmpleados(connection, empleados, departamentos) {
    if (empleados.length === 0) return;

    const query = `
        INSERT INTO Empleado (nombre, departamento_id) 
        VALUES ? 
        ON DUPLICATE KEY UPDATE nombre = VALUES(nombre), departamento_id = VALUES(departamento_id)`;

    const values = empleados.map(e => [e.nombre, departamentos.get(e.departamento)]);

    try {
        // Insertar empleados
        await connection.query(query, [values]);
        console.log(`✅ ${empleados.length} empleados insertados/actualizados.`);
    } catch (error) {
        console.error("❌ Error insertando empleados:", error);
    }
}

async function insertarAsistencias(connection, asistencia) {
    if (asistencia.length === 0) return;

    const query = `INSERT INTO Registro_Entrada_Salida (empleado_id, fecha, hora, tipo) VALUES ?`;

    const values = asistencia.map(a => [a.empleado_id, a.fecha, a.hora, a.tipo]);

    try {
        await connection.query(query, [values]);
        console.log(`✅ ${asistencia.length} registros de asistencia insertados.`);
    } catch (error) {
        console.error("❌ Error insertando registros de asistencia:", error);
    }
}

async function procesarArchivo(filePath) {
    let connection;
    try {
        console.log(`📄 Procesando archivo: ${path.basename(filePath)}`);

        connection = await pool.getConnection();
        await connection.beginTransaction();

        // Verificar y crear tablas si no existen
        await crearTablasSiNoExisten(connection);

        const empleados = [];
        const asistencia = [];
        const departamentos = new Map();

        const fileStream = await fs.open(filePath);
        const rl = readline.createInterface({ input: fileStream.createReadStream() });

        let currentEmployee = null;

        for await (const line of rl) {
            const parts = line.split(",").map(p => p.trim()).filter(p => p !== "");
            if (parts[0].startsWith("ID") && parts.length >= 3) {
                currentEmployee = {
                    nombre: parts[3] || "Desconocido",
                    departamento: parts[5] || "Sin departamento",
                };

                empleados.push(currentEmployee);
                if (!departamentos.has(currentEmployee.departamento)) {
                    departamentos.set(currentEmployee.departamento, null);
                }
            } else if (currentEmployee && parts.length > 1) {
                for (let i = 0; i < parts.length; i += 2) {
                    if (parts[i] && parts[i + 1]) {
                        try {
                            const { fecha, hora } = convertirFecha(parts[i]);
                            // Verificar si el empleado existe, si no existe, insertar
                            const [rows] = await connection.execute("SELECT id FROM Empleado WHERE nombre = ?", [currentEmployee.nombre]);

                            let empleado_id;
                            if (rows.length > 0) {
                                // El empleado ya existe
                                empleado_id = rows[0].id;
                            } else {
                                // Si el empleado no existe, insertarlo
                                const [result] = await connection.execute("INSERT INTO Empleado (nombre, departamento_id) VALUES (?, ?)", 
                                    [currentEmployee.nombre, departamentos.get(currentEmployee.departamento)]);
                                empleado_id = result.insertId;
                            }

                            // Ahora que tenemos el empleado_id, registramos la asistencia
                            asistencia.push({
                                empleado_id: empleado_id,
                                fecha: fecha,
                                hora: hora,
                                tipo: parts[i + 1].toLowerCase() === "entrada" ? "Entrada" : "Salida"
                            });

                        } catch (error) {
                            console.error(`❌ Error al procesar la fecha: ${parts[i]}.`, error.message);
                        }
                    }
                }
            }
        }

        // Insertar departamentos, empleados y asistencias
        await insertarDepartamentos(connection, departamentos);
        await insertarEmpleados(connection, empleados, departamentos);
        await insertarAsistencias(connection, asistencia);

        await connection.commit();
        console.log(`✅ Archivo procesado con éxito: ${path.basename(filePath)}`);
    } catch (error) {
        console.error(`❌ Error procesando archivo ${path.basename(filePath)}:`, error);
        if (connection) await connection.rollback();
    } finally {
        if (connection) connection.release();
    }
}



async function crearTablasSiNoExisten(connection) {
    try {
        await connection.query(`
            CREATE TABLE IF NOT EXISTS Departamento (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nombre VARCHAR(255) UNIQUE NOT NULL
            )
        `);

        await connection.query(`
            CREATE TABLE IF NOT EXISTS Empleado (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nombre VARCHAR(255) NOT NULL,
                departamento_id INT,
                FOREIGN KEY (departamento_id) REFERENCES Departamento(id) ON DELETE SET NULL,
                UNIQUE (nombre)  -- Agregamos unicidad en nombre
            )
        `);

        await connection.query(`
            CREATE TABLE IF NOT EXISTS Registro_Entrada_Salida (
                id INT AUTO_INCREMENT PRIMARY KEY,
                empleado_id INT NOT NULL,
                fecha DATE NOT NULL,
                hora TIME NOT NULL,
                tipo ENUM('Entrada', 'Salida') NOT NULL,
                FOREIGN KEY (empleado_id) REFERENCES Empleado(id) ON DELETE CASCADE
            )
        `);

        console.log("✅ Tablas verificadas/creadas correctamente.");
    } catch (error) {
        console.error("❌ Error al crear las tablas:", error);
    }
}


function convertirFecha(fechaStr) {
    const regex = /^(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2})$/;
    const match = fechaStr.match(regex);

    if (match) {
        let [, dia, mes, año, hora, minuto] = match;
        mes = parseInt(mes) - 1;

        const fechaObj = new Date(Date.UTC(año, mes, dia, hora, minuto));

        if (isNaN(fechaObj.getTime())) {
            throw new Error(`Fecha no válida: ${fechaStr}`);
        }

        const fechaFormateada = fechaObj.toISOString().split("T")[0];
        const horaFormateada = hora && minuto ? `${hora}:${minuto}:00` : null;

        return { fecha: fechaFormateada, hora: horaFormateada };
    } else {
        throw new Error(`Formato de fecha incorrecto: ${fechaStr}`);
    }
}

async function procesarCarpeta() {
    console.log("📂 Buscando archivos en la carpeta...");
    
    const archivos = await obtenerArchivos();

    if (archivos.length === 0) {
        console.log("⚠️ No se encontraron archivos para procesar.");
        return;
    }

    for (const archivo of archivos) {
        await procesarArchivo(archivo);
    }

    console.log("✅ Todos los archivos han sido procesados.");
}

module.exports = procesarCarpeta;