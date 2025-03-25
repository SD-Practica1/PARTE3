import React, { useState, useEffect } from "react";
import AttendanceTable from "./AttendanceTable";
import axios from "axios";

const horarios = {
  mañana: { inicio: { hora: 8, minutos: 30 }, fin: { hora: 12, minutos: 30 } },
  tarde: { inicio: { hora: 14, minutos: 30 }, fin: { hora: 18, minutos: 30 } },
};

const EmployeeList = () => {
  const [empleados, setEmpleados] = useState([]);
  const [selectedEmpleado, setSelectedEmpleado] = useState("");
  const [registrosAsistencia, setRegistrosAsistencia] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:9097/empleados")
      .then((response) => {
        setEmpleados(response.data.sort((a, b) => a.nombre.localeCompare(b.nombre)));
      })
      .catch((error) => console.error("Error al obtener los empleados:", error));
  }, []);

  useEffect(() => {
    if (selectedEmpleado) {
      axios.get(`http://localhost:9097/empleados/${selectedEmpleado}/asistencia`)
        .then((response) => {
          setRegistrosAsistencia(response.data);
        })
        .catch((error) => console.error("Error al obtener registros:", error));
    }
  }, [selectedEmpleado]);
  
  return (
    <div style={{ fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ color: "#2c3e50", textAlign: "center" }}>Seleccionar Empleado</h1>

      <div>
        <h2 style={{ textAlign: "center", color: "#34495e" }}>Horarios de Turnos</h2>
        <ul style={{ textAlign: "center", listStyle: "none", padding: 0 }}>
          {Object.entries(horarios).map(([nombre, turno], index) => (
            <li key={index} style={{ marginBottom: "5px", fontSize: "16px" }}>
              <strong>{nombre.charAt(0).toUpperCase() + nombre.slice(1)}:</strong>{" "}
              {turno.inicio.hora}:{turno.inicio.minutos.toString().padStart(2, "0")} -{" "}
              {turno.fin.hora}:{turno.fin.minutos.toString().padStart(2, "0")}
            </li>
          ))}
        </ul>
      </div>


      <select
        value={selectedEmpleado}
        onChange={(e) => setSelectedEmpleado(e.target.value)}
        style={{
          padding: "10px",
          fontSize: "16px",
          borderRadius: "5px",
          border: "1px solid #ccc",
          width: "100%",
          maxWidth: "300px",
          display: "block",
          margin: "0 auto",
          marginBottom: "20px",
        }}
      >
        <option value="">Seleccione un empleado</option>
        {empleados.map((empleado) => (
          <option key={empleado.id} value={empleado.id}>
            {empleado.nombre}
          </option>
        ))}
      </select>

      {selectedEmpleado && (
        <AttendanceTable registrosAsistencia={registrosAsistencia} />
      )}

    </div>
  );
};

export default EmployeeList;