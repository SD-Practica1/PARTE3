import React, { useState, useEffect } from "react";
import { useLanguage } from "../utils/translations";
import AttendanceTable from "./AttendanceTable";
import axios from "axios";

const EmployeeList = ({ language }) => {
  const t = useLanguage(language);
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
      <h1 style={{ color: "#2c3e50", textAlign: "center" }}>{t.employeeList.title}</h1>

      <div>
        <h2 style={{ textAlign: "center", color: "#34495e" }}>{t.employeeList.shifts}</h2>
        <ul style={{ textAlign: "center", listStyle: "none", padding: 0 }}>
          {Object.entries(t.employeeList.shiftTimes).map(([key, turno], index) => (
            <li key={index} style={{ marginBottom: "5px", fontSize: "16px" }}>
              <strong>{turno.name}:</strong>{" "}
              {turno.start} - {turno.end}
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
        <option value="">{t.employeeList.selectEmployee}</option>
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