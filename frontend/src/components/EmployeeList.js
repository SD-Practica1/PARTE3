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

  // Función para convertir minutos en formato "horas:minutos"
const convertirAMinutosYHoras = (totalMinutos) => {
  const horas = Math.floor(totalMinutos / 60); // Obtener las horas
  const minutos = totalMinutos % 60; // Obtener los minutos restantes
  return `${horas} horas ${minutos} minutos`; // Retornar el formato "horas minutos"
};




// Función para calcular el anticipo de salida
const calcularRetrasoSalida = (hora, minutos, limiteHora, limiteMinutos) => {
  const tiempoSalida = hora * 60 + minutos; // Convertir todo a minutos
  const limiteTiempo = limiteHora * 60 + limiteMinutos;

  // Si la hora de salida es antes de la hora límite
  if (tiempoSalida < limiteTiempo) {
    return limiteTiempo - tiempoSalida; // Devuelve el anticipo en minutos
  }
  return 0; // Si no hay anticipo, retornamos 0
};
// Ajustamos la lógica para calcular el retraso de entrada
const calcularRetrasoEntrada = (hora, minutos, limiteHora, limiteMinutos) => {
  const tiempoEntrada = hora * 60 + minutos; // Convertir todo a minutos
  const limiteTiempo = limiteHora * 60 + limiteMinutos;

  // Si la hora de entrada es estrictamente mayor que la hora límite
  if (tiempoEntrada > limiteTiempo) {
    return tiempoEntrada - limiteTiempo; // Devuelve el retraso en minutos
  }
  return 0; // Si no hay retraso, retornamos 0
};

// Función para generar el reporte mensual
const generarReporteMensual = () => {
  let totalRetrasoMinutos = 0;
  let totalAnticiposMinutos = 0;
  let diasTrabajados = new Set();

  registrosAsistencia.forEach((registro) => {
    const tieneEntrada = registro.entrada && registro.entrada.trim() !== "";
    const tieneSalida = registro.salida && registro.salida.trim() !== "";

    // Cuenta el día trabajado si hay una firma de entrada o salida
    if (tieneEntrada || tieneSalida) {
      diasTrabajados.add(registro.fecha);
    }

    // Manejo de entradas y salidas de la mañana (8:30 - 12:30)
    if (tieneEntrada) {
      const [horaEntrada, minutosEntrada] = registro.entrada.split(":").map(Number);

      // Asegurarse de que la entrada sea válida antes de calcular
      if (!isNaN(horaEntrada) && !isNaN(minutosEntrada)) {
        if (horaEntrada < horarios.mañana.fin.hora || (horaEntrada === horarios.mañana.fin.hora && minutosEntrada <= horarios.mañana.fin.minutos)) {
          totalRetrasoMinutos += calcularRetrasoEntrada(horaEntrada, minutosEntrada, 8, 30); // Entrada mañana
        } else {
          totalRetrasoMinutos += calcularRetrasoEntrada(horaEntrada, minutosEntrada, 14, 30); // Entrada tarde
        }
      }
    }

    // Manejo de salidas de la mañana (12:30) y tarde (18:30)
    if (tieneSalida) {
      const [horaSalida, minutosSalida] = registro.salida.split(":").map(Number);
      
      // Salida de la mañana (antes de las 12:30)
      if (horaSalida < horarios.mañana.fin.hora || (horaSalida === horarios.mañana.fin.hora && minutosSalida <= horarios.mañana.fin.minutos)) {
        totalAnticiposMinutos += calcularRetrasoSalida(horaSalida, minutosSalida, 12, 30); // Salida mañana
      }
      // Salida de la tarde (antes de las 18:30)
      else {
        totalAnticiposMinutos += calcularRetrasoSalida(horaSalida, minutosSalida, 18, 30); // Salida tarde
      }
    }
  });

  // Convertir los retrasos y anticipos a formato "horas minutos"
  const retrasoTotal = convertirAMinutosYHoras(totalRetrasoMinutos);
  const anticiposTotal = convertirAMinutosYHoras(totalAnticiposMinutos);

  // Mostrar los datos del reporte en horas y minutos
  setReporteMensual([{
    nombre: empleados.find((emp) => emp.id === selectedEmpleado)?.nombre || "",
    retraso: anticiposTotal, // Anticipos de salida
    anticipos: retrasoTotal, // Retraso de entrada
    diasTrabajados: diasTrabajados.size, // Días únicos trabajados
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

                let entradaMañana = "-",
                  salidaMañana = "-",
                  entradaTarde = "-",
                  salidaTarde = "-";

                if (registro.entrada) {
                  if (hEntrada < horarios.mañana.fin.hora) {
                    entradaMañana = registro.entrada;
                  } else {
                    entradaTarde = registro.entrada;
                  }
                }

                if (registro.salida) {
                  if (hSalida <= horarios.mañana.fin.hora) {
                    salidaMañana = registro.salida;
                  } else {
                    salidaTarde = registro.salida;
                  }
                }

                // Retrasos y salidas anticipadas
                const retrasoMañana =
                  entradaMañana !== "-" &&
                  (hEntrada > horarios.mañana.inicio.hora ||
                    (hEntrada === horarios.mañana.inicio.hora && mEntrada > horarios.mañana.inicio.minutos));

                const retrasoTarde =
                  entradaTarde !== "-" &&
                  (hEntrada > horarios.tarde.inicio.hora ||
                    (hEntrada === horarios.tarde.inicio.hora && mEntrada > horarios.tarde.inicio.minutos));

                const salidaAntesMañana =
                  salidaMañana !== "-" &&
                  (hSalida < horarios.mañana.fin.hora ||
                    (hSalida === horarios.mañana.fin.hora && mSalida < horarios.mañana.fin.minutos));

                const salidaAntesTarde =
                  salidaTarde !== "-" &&
                  (hSalida < horarios.tarde.fin.hora ||
                    (hSalida === horarios.tarde.fin.hora && mSalida < horarios.tarde.fin.minutos));

                return (
                  <tr key={index} style={{ textAlign: "center" }}>
                    <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
                      {new Date(registro.fecha).toLocaleDateString("es-ES")}
                    </td>
                    <td
                      style={{
                        padding: "10px",
                        borderBottom: "1px solid #ddd",
                        color: retrasoMañana ? "#e74c3c" : "black",
                      }}
                    >
                      {entradaMañana}
                    </td>
                    <td
                      style={{
                        padding: "10px",
                        borderBottom: "1px solid #ddd",
                        color: salidaAntesMañana ? "#e74c3c" : "black",
                      }}
                    >
                      {salidaMañana}
                    </td>
                    <td
                      style={{
                        padding: "10px",
                        borderBottom: "1px solid #ddd",
                        color: retrasoTarde ? "#e74c3c" : "black",
                      }}
                    >
                      {entradaTarde}
                    </td>
                    <td
                      style={{
                        padding: "10px",
                        borderBottom: "1px solid #ddd",
                        color: salidaAntesTarde ? "#e74c3c" : "black",
                      }}
                    >
                      {salidaTarde}
                    </td>
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