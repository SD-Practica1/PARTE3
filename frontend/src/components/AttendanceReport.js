import React from "react";

const horarios = {
  mañana: { inicio: { hora: 8, minutos: 30 } },
  tarde: { inicio: { hora: 14, minutos: 30 } },
};

const convertirAHorasMinutos = (hora) => {
  const [h, m] = hora.split(":").map(Number);
  return h * 60 + m;
};

const calcularRetraso = (horaEntrada, turno) => {
  const minutosEntrada = convertirAHorasMinutos(horaEntrada);
  const minutosInicioTurno =
    turno === "mañana"
      ? horarios.mañana.inicio.hora * 60 + horarios.mañana.inicio.minutos
      : horarios.tarde.inicio.hora * 60 + horarios.tarde.inicio.minutos;

  const retraso = minutosEntrada - minutosInicioTurno;
  return retraso > 0 ? retraso : 0;
};

const formatoHorasMinutos = (minutos) => {
    const horas = Math.floor(minutos / 60);
    const mins = minutos % 60;
    return `${horas}h ${mins}m`;
  };
  
  const generarTextoReporte = (listaEmpleados) => {
    let reporte = "Reporte de Asistencia\n\n";
  
    listaEmpleados.forEach((empleado) => {
      let totalRetraso = 0;
      let diasTrabajados = empleado.registrosAsistencia.length;
  
      empleado.registrosAsistencia.forEach((registro) => {
        if (registro.entrada) {
          const minutosEntrada = convertirAHorasMinutos(registro.entrada);
  
          if (minutosEntrada <= horarios.mañana.inicio.hora * 60 + 240) {
            totalRetraso += calcularRetraso(registro.entrada, "mañana");
          } else {
            totalRetraso += calcularRetraso(registro.entrada, "tarde");
          }
        }
      });
  
      reporte += `Empleado: ${empleado.nombre}\n`;
      reporte += `Días trabajados: ${diasTrabajados}\n`;
      reporte += `Total de retrasos: ${formatoHorasMinutos(totalRetraso)}\n\n`;
    });
  
    return reporte;
  };  

const agruparPorEmpleado = (registros) => {
    const empleados = {};
  
    registros.forEach((registro) => {
      if (!empleados[registro.nombre]) {
        empleados[registro.nombre] = {
          nombre: registro.nombre,
          registrosAsistencia: [],
        };
      }
      empleados[registro.nombre].registrosAsistencia.push({
        fecha: registro.fecha,
        entrada: registro.entrada,
        salida: registro.salida,
      });
    });
  
    return Object.values(empleados);
  };
  

const DownloadAttendanceReport = ({ listaEmpleados }) => {
    const descargarReporte = () => {
        console.log("Lista de empleados original:", listaEmpleados);
      
        if (!Array.isArray(listaEmpleados) || listaEmpleados.length === 0) {
          console.warn("No hay empleados para generar el reporte.");
          return;
        }
      
        // Agrupar registros por empleado
        const empleadosAgrupados = agruparPorEmpleado(listaEmpleados);
        console.log("Empleados agrupados:", empleadosAgrupados);
      
        const texto = generarTextoReporte(empleadosAgrupados);
      
        const blob = new Blob([texto], { type: "text/plain" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "reporte_asistencia.txt";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      };
      

  return (
    <button onClick={descargarReporte} style={{ padding: "10px", background: "#3498db", color: "white", border: "none", cursor: "pointer", borderRadius: "5px" }}>
      Descargar Reporte
    </button>
  );
};

export default DownloadAttendanceReport;
