import React, { useState } from "react";
import { useTranslation } from 'react-i18next';

const AttendanceTable = ({ registrosAsistencia }) => {
  const { t } = useTranslation();
  const [mostrarReporte, setMostrarReporte] = useState(false);
  const [reporteMensual, setReporteMensual] = useState([]);

  const convertirAHorasMinutos = (hora) => {
    const [h, m] = hora.split(":").map(Number);
    return h * 60 + m;
  };

  const calcularRetraso = (horaEntrada, turno) => {
    const minutosEntrada = convertirAHorasMinutos(horaEntrada);
    const minutosInicioTurno =
      turno === "mañana" 
        ? convertirAHorasMinutos(t('employeeList.shiftTimes.morning.start'))
        : convertirAHorasMinutos(t('employeeList.shiftTimes.afternoon.start'));

    const retraso = minutosEntrada - minutosInicioTurno;
    return retraso > 0 ? retraso : 0; // Si no hay retraso, retorna 0
  };

  const generarReporteMensual = () => {
    let totalRetraso = 0;
  
    registrosAsistencia.forEach((registro) => {
      let retrasoTotal = 0;
  
      if (registro.entrada) {
        const minutosEntrada = convertirAHorasMinutos(registro.entrada);
  
        if (minutosEntrada <= convertirAHorasMinutos(t('employeeList.shiftTimes.morning.end'))) {
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
        <h2 style={{ textAlign: "center", color: "#34495e" }}>{t('attendanceTable.title')}</h2>
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
              <th style={{ padding: "12px" }}>{t('attendanceTable.headers.date')}</th>
              <th style={{ padding: "12px" }}>{t('attendanceTable.headers.morningEntry')}</th>
              <th style={{ padding: "12px" }}>{t('attendanceTable.headers.morningExit')}</th>
              <th style={{ padding: "12px" }}>{t('attendanceTable.headers.afternoonEntry')}</th>
              <th style={{ padding: "12px" }}>{t('attendanceTable.headers.afternoonExit')}</th>
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

                if (minutosEntrada <= convertirAHorasMinutos(t('employeeList.shiftTimes.morning.end'))) {
                  entradaMañana = registro.entrada;
                } else {
                  entradaTarde = registro.entrada;
                }
              }

              if (registro.salida) {
                const minutosSalida = convertirAHorasMinutos(registro.salida);

                if (minutosSalida < convertirAHorasMinutos(t('employeeList.shiftTimes.morning.start'))) {
                  salidaTarde = registro.salida; // Madrugada
                } else if (minutosSalida <= convertirAHorasMinutos(t('employeeList.shiftTimes.morning.end'))) {
                  salidaMañana = registro.salida;
                } else if (minutosSalida <= convertirAHorasMinutos(t('employeeList.shiftTimes.afternoon.start'))) {
                  salidaMañana = registro.salida;
                } else {
                  salidaTarde = registro.salida;
                }
              }

              // Retrasos y salidas anticipadas
              const retrasoMañana =
                entradaMañana !== "-" &&
                (hEntrada > t('employeeList.shiftTimes.morning.start').split(":")[0] ||
                  (hEntrada === t('employeeList.shiftTimes.morning.start').split(":")[0] && mEntrada > t('employeeList.shiftTimes.morning.start').split(":")[1]));

              const retrasoTarde =
                entradaTarde !== "-" &&
                (hEntrada > t('employeeList.shiftTimes.afternoon.start').split(":")[0] ||
                  (hEntrada === t('employeeList.shiftTimes.afternoon.start').split(":")[0] && mEntrada > t('employeeList.shiftTimes.afternoon.start').split(":")[1]));

              const salidaAntesMañana =
                salidaMañana !== "-" &&
                (hSalida < t('employeeList.shiftTimes.morning.end').split(":")[0] ||
                  (hSalida === t('employeeList.shiftTimes.morning.end').split(":")[0] && mSalida < t('employeeList.shiftTimes.morning.end').split(":")[1]));

              const salidaAntesTarde =
                salidaTarde !== "-" &&
                ((hSalida < t('employeeList.shiftTimes.afternoon.end').split(":")[0] && hSalida > t('employeeList.shiftTimes.morning.start').split(":")[0]) ||
                  (hSalida === t('employeeList.shiftTimes.afternoon.end').split(":")[0] && mSalida < t('employeeList.shiftTimes.afternoon.end').split(":")[1]));

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
        {t('attendanceTable.generateReport')}
      </button>

      {/* Mostrar el reporte mensual */}
      {mostrarReporte && (
        <div>
          <h2 style={{ textAlign: "center", color: "#34495e" }}>{t('attendanceTable.monthlyReport')}</h2>
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
                <th style={{ padding: "12px" }}>{t('attendanceTable.headers.totalDelay')}</th>
                <th style={{ padding: "12px" }}>{t('attendanceTable.headers.workedDays')}</th>
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