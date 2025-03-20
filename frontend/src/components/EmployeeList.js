import React, { useState, useEffect } from "react";
import axios from "axios";

const horarios = {
  mañana: { inicio: { hora: 8, minutos: 30 }, fin: { hora: 12, minutos: 30 } },
  tarde: { inicio: { hora: 14, minutos: 30 }, fin: { hora: 18, minutos: 30 } },
};

const EmployeeList = () => {
  const [empleados, setEmpleados] = useState([]);
  const [selectedEmpleado, setSelectedEmpleado] = useState("");
  const [registrosAsistencia, setRegistrosAsistencia] = useState([]);
  const [reporteMensual, setReporteMensual] = useState([]);
  const [mostrarReporte, setMostrarReporte] = useState(false);

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
          setMostrarReporte(false);
        })
        .catch((error) => console.error("Error al obtener registros:", error));
    }
  }, [selectedEmpleado]);

  // Función para generar reporte mensual
  const generarReporteMensual = () => {
    let totalSegundosRetraso = 0; // Usamos segundos para precisión
    let diasTrabajados = new Set();
  
    registrosAsistencia.forEach((registro) => {
      const tieneEntrada = registro.entrada && registro.entrada.trim() !== "";
      const tieneSalida = registro.salida && registro.salida.trim() !== "";
  
      // Cuenta el día trabajado si hay una firma de entrada o salida
      if (tieneEntrada || tieneSalida) {
        diasTrabajados.add(registro.fecha);
      }
  
      // Si solo hay salida registrada
      if (!tieneEntrada && tieneSalida) {
        const [horaSalida, minutosSalida] = registro.salida.split(":").map(Number);
        if (!isNaN(horaSalida) && !isNaN(minutosSalida)) {
          // Si la salida es antes de las 17:30
          if (horaSalida < 17 || (horaSalida === 17 && minutosSalida < 30)) {
            const retrasoEnSegundos = (17 - horaSalida) * 3600 + (30 - minutosSalida) * 60;
            totalSegundosRetraso += retrasoEnSegundos;
          }
        }
      }
  
      // Si solo hay entrada registrada
      if (tieneEntrada && !tieneSalida) {
        const [horaEntrada, minutosEntrada] = registro.entrada.split(":").map(Number);
        if (!isNaN(horaEntrada) && !isNaN(minutosEntrada)) {
          // Si la entrada es después de las 08:30
          if (horaEntrada > 8 || (horaEntrada === 8 && minutosEntrada > 30)) {
            const retrasoEnSegundos = (horaEntrada - 8) * 3600 + (minutosEntrada - 30) * 60;
            totalSegundosRetraso += retrasoEnSegundos;
          }
        }
      }
  
      // Si ambos, entrada y salida están presentes
      if (tieneEntrada && tieneSalida) {
        const [horaEntrada, minutosEntrada] = registro.entrada.split(":").map(Number);
        const [horaSalida, minutosSalida] = registro.salida.split(":").map(Number);
  
        // Calcula el retraso de la entrada si es posterior a las 08:30
        if (horaEntrada > 8 || (horaEntrada === 8 && minutosEntrada > 30)) {
          const retrasoEntrada = (horaEntrada - 8) * 3600 + (minutosEntrada - 30) * 60;
          totalSegundosRetraso += retrasoEntrada;
        }
  
        // Calcula el retraso de la salida si es anterior a las 17:30
        if (horaSalida < 17 || (horaSalida === 17 && minutosSalida < 30)) {
          const retrasoSalida = (17 - horaSalida) * 3600 + (30 - minutosSalida) * 60;
          totalSegundosRetraso += retrasoSalida;
        }
      }
    });
  
    // Convertir el retraso total a horas, minutos y segundos
    const horasRetraso = Math.floor(totalSegundosRetraso / 3600); // Calcular horas
    const minutosRetraso = Math.floor((totalSegundosRetraso % 3600) / 60); // Calcular minutos
    const segundosRetraso = totalSegundosRetraso % 60; // Calcular segundos restantes
  
    // Formatear el retraso en horas:minutos:segundos
    const retrasoFormateado = `${horasRetraso}:${minutosRetraso < 10 ? '0' + minutosRetraso : minutosRetraso}:${segundosRetraso < 10 ? '0' + segundosRetraso : segundosRetraso}`;
  
    // Mostrar los datos del reporte
    setReporteMensual([{
      nombre: empleados.find((emp) => emp.id === selectedEmpleado)?.nombre || "",
      retraso: retrasoFormateado, // Formato de retraso en hh:mm:ss
      diasTrabajados: diasTrabajados.size, // Cantidad de días únicos trabajados
    }]);
    setMostrarReporte(true);
  };

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

      {registrosAsistencia.length > 0 && (
        <div>
          <h2 style={{ textAlign: "center", color: "#34495e" }}>Registros de Asistencia</h2>
          <table
            style={{
              width: "100%",
              marginTop: "10px",
              borderCollapse: "collapse",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "#2c3e50", color: "white", textAlign: "center" }}>
                <th style={{ padding: "12px" }}>Fecha</th>
                <th style={{ padding: "12px" }}>Entrada (Mañana)</th>
                <th style={{ padding: "12px" }}>Salida (Mañana)</th>
                <th style={{ padding: "12px" }}>Entrada (Tarde)</th>
                <th style={{ padding: "12px" }}>Salida (Tarde)</th>
              </tr>
            </thead>
            <tbody>
              {registrosAsistencia.map((registro, index) => {
                const [hEntrada, mEntrada] = registro.entrada?.split(":").map(Number) || [];
                const [hSalida, mSalida] = registro.salida?.split(":").map(Number) || [];
                let entradaMañana = "-", salidaMañana = "-", entradaTarde = "-", salidaTarde = "-";

                if (hEntrada !== undefined) {
                  if (hEntrada < 8 || (hEntrada === 8 && mEntrada < 30)) {
                    entradaMañana = registro.entrada;
                  } else if (hEntrada > 12 || (hEntrada === 12 && mEntrada > 30)) {
                    entradaTarde = registro.entrada;
                  }
                }

                if (hSalida !== undefined) {
                  if (hSalida < 8 || (hSalida === 8 && mSalida < 30)) {
                    salidaTarde = registro.salida;
                  } else if (hSalida < 14 || (hSalida === 14 && mSalida < 30)) {
                    salidaMañana = registro.salida;
                  } else {
                    salidaTarde = registro.salida;
                  }
                }

                const retrasoMañana = entradaMañana !== "-" && hEntrada >= 8 && mEntrada > 30;
                const retrasoTarde = entradaTarde !== "-" && hEntrada >= 14 && mEntrada > 30;
                const salidaAntesMañana = salidaMañana !== "-" && (hSalida < 12 || (hSalida === 12 && mSalida < 30));
                const salidaAntesTarde = salidaTarde !== "-" && (hSalida < 18 || (hSalida === 18 && mSalida < 30));

                return (
                  <tr key={index} style={{ textAlign: "center" }}>
                    <td style={{ padding: "10px",
                      borderBottom: "1px solid #ddd"}}>{new Date(registro.fecha).toLocaleDateString("es-ES")}</td>
                    <td style={{ padding: "10px",
                      borderBottom: "1px solid #ddd", color: retrasoMañana ? "#e74c3c" : "black" }}>{entradaMañana}</td>
                    <td style={{ padding: "10px",
                      borderBottom: "1px solid #ddd", color: salidaAntesMañana ? "#e74c3c" : "black" }}>{salidaMañana}</td>
                    <td style={{ padding: "10px",
                      borderBottom: "1px solid #ddd", color: retrasoTarde ? "#e74c3c" : "black" }}>{entradaTarde}</td>
                    <td style={{ padding: "10px",
                      borderBottom: "1px solid #ddd", color: salidaAntesTarde ? "#e74c3c" : "black" }}>{salidaTarde}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Botón para generar reporte */}
      <button
        onClick={generarReporteMensual}
        style={{
          backgroundColor: "#3498db",
          color: "white",
          border: "none",
          padding: "10px 20px",
          fontSize: "16px",
          cursor: "pointer",
          borderRadius: "5px",
          display: "block",
          margin: "20px auto",
        }}
      >
        Generar Reporte Mensual
      </button>

      {/* Mostrar el reporte mensual */}
      {mostrarReporte && (
        <div>
          <h2 style={{ textAlign: "center", color: "#34495e" }}>Reporte Mensual</h2>
          <table
            style={{
              width: "100%",
              marginTop: "10px",
              borderCollapse: "collapse",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "#2c3e50", color: "white", textAlign: "center" }}>

                <th style={{ padding: "12px" }}>Retraso Total</th>
                <th style={{ padding: "12px" }}>Días Trabajados</th>
              </tr>
            </thead>
            <tbody>
              {reporteMensual.map((reporte, index) => (
                <tr key={index} style={{ textAlign: "center" }}>

                  <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>{reporte.retraso}</td>
                  <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>{reporte.diasTrabajados}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};



export default EmployeeList;