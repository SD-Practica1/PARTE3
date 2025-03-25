import React, { useState } from "react";

const horarios = {
  mañana: { inicio: { hora: 8, minutos: 30 }, fin: { hora: 12, minutos: 30 } },
  tarde: { inicio: { hora: 14, minutos: 30 }, fin: { hora: 18, minutos: 30 } },
};

const AttendanceTable = ({ registrosAsistencia }) => {
  const [mostrarReporte, setMostrarReporte] = useState(false);
  const [reporteMensual, setReporteMensual] = useState([]);

  const convertirAHorasMinutos = (hora) => {
    const [h, m] = hora.split(":").map(Number);
    return h * 60 + m;
  };

  const calcularRetraso = (horaEntrada, turno) => {
    const minutosEntrada = convertirAHorasMinutos(horaEntrada);
    const minutosInicioTurno =
      turno === "mañana" ? horarios.mañana.inicio.hora * 60 + horarios.mañana.inicio.minutos : horarios.tarde.inicio.hora * 60 + horarios.tarde.inicio.minutos;

    const retraso = minutosEntrada - minutosInicioTurno;
    return retraso > 0 ? retraso : 0; // Si no hay retraso, retorna 0
  };

  const generarReporteMensual = () => {
    let totalRetraso = 0;
  
    registrosAsistencia.forEach((registro) => {
      let retrasoTotal = 0;
  
      if (registro.entrada) {
        const minutosEntrada = convertirAHorasMinutos(registro.entrada);
  
        if (minutosEntrada <= horarios.mañana.fin.hora * 60 + horarios.mañana.fin.minutos) {
          // Calcular retraso para turno mañana
          retrasoTotal = calcularRetraso(registro.entrada, "mañana");
        } else {
          // Calcular retraso para turno tarde
          retrasoTotal = calcularRetraso(registro.entrada, "tarde");
        }
      }
  
      totalRetraso += retrasoTotal;
    });
  
    // Convertir los minutos totales a horas y minutos
    const horas = Math.floor(totalRetraso / 60);
    const minutos = totalRetraso % 60;
  
    const retrasoFormateado = `${horas} horas ${minutos < 10 ? "0" + minutos : minutos} minutos`;
  
    // El total de "días trabajados" es el número total de filas en la tabla
    const diasTrabajados = registrosAsistencia.length;
  
    setReporteMensual([
      {
        retraso: retrasoFormateado,
        diasTrabajados: diasTrabajados,
      },
    ]);
    setMostrarReporte(true);
  };
  

  return (
    <div style={{ fontFamily: "Arial, sans-serif" }}>
      {/* Tabla original de registros de asistencia */}
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
                const minutosEntrada = convertirAHorasMinutos(registro.entrada);

                if (minutosEntrada <= horarios.mañana.fin.hora * 60 + horarios.mañana.fin.minutos) {
                  entradaMañana = registro.entrada;
                } else {
                  entradaTarde = registro.entrada;
                }
              }

              if (registro.salida) {
                const minutosSalida = convertirAHorasMinutos(registro.salida);

                if (minutosSalida < horarios.mañana.inicio.hora * 60 + horarios.mañana.inicio.minutos) {
                  salidaTarde = registro.salida; // Madrugada
                } else if (minutosSalida <= horarios.mañana.fin.hora * 60 + horarios.mañana.fin.minutos) {
                  salidaMañana = registro.salida;
                } else if (minutosSalida <= horarios.tarde.inicio.hora * 60 + horarios.tarde.inicio.minutos) {
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
                ((hSalida < horarios.tarde.fin.hora && hSalida > horarios.mañana.inicio.hora) ||
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

export default AttendanceTable;