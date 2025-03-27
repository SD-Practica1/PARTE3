// File: src/utils/translations.js
export const translations = {
  en: {
    login: {
      title: "Access Control",
      accessKey: "Enter Access Key",
      accessButton: "Access",
      incorrectKey: "Incorrect key. Access denied."
    },
    employeeList: {
      title: "Select Employee",
      shifts: "Shift Schedules",
      selectEmployee: "Select an employee",
      shiftTimes: {
        morning: {
          name: "Morning",
          start: "08:30",
          end: "12:30"
        },
        afternoon: {
          name: "Afternoon",
          start: "14:30",
          end: "18:30"
        }
      }
    },
    reportGeneration: {
      title: "Generate Report",
      selectDateRange: "Select Date Range",
      startDate: "Start Date",
      endDate: "End Date",
      generateButton: "Generate Report",
      downloadButton: "Download Report",
      noDataAvailable: "No data available for the selected period",
      reportTypes: {
        attendance: "Attendance Report",
        workHours: "Work Hours Report",
        shiftSummary: "Shift Summary"
      }
    },
    attendanceTable: {
      title: "Attendance Records",
      generateReport: "Generate Monthly Report",
      monthlyReport: "Monthly Report",
      headers: {
        date: "Date",
        morningEntry: "Morning Entry",
        morningExit: "Morning Exit",
        afternoonEntry: "Afternoon Entry",
        afternoonExit: "Afternoon Exit",
        totalDelay: "Total Delay",
        workedDays: "Worked Days"
      }
    },
    attendanceReport: {
      title: "Attendance Report",
      employee: "Employee",
      daysWorked: "Days Worked",
      totalDelays: "Total Delays",
      downloadButton: "Download Report",
      noEmployeesWarning: "No employees available to generate the report."
    }
  },
  es: {
    login: {
      title: "Control de Acceso",
      accessKey: "Introduce la clave de acceso",
      accessButton: "Acceder",
      incorrectKey: "Clave incorrecta. Acceso denegado."
    },
    employeeList: {
      title: "Seleccionar Empleado",
      shifts: "Horarios de Turnos",
      selectEmployee: "Seleccione un empleado",
      shiftTimes: {
        morning: {
          name: "Mañana",
          start: "08:30",
          end: "12:30"
        },
        afternoon: {
          name: "Tarde",
          start: "14:30",
          end: "18:30"
        }
      }
    },
    reportGeneration: {
      title: "Generar Informe",
      selectDateRange: "Seleccionar Rango de Fechas",
      startDate: "Fecha de Inicio",
      endDate: "Fecha de Fin",
      generateButton: "Generar Informe",
      downloadButton: "Descargar Informe",
      noDataAvailable: "No hay datos disponibles para el período seleccionado",
      reportTypes: {
        attendance: "Informe de Asistencia",
        workHours: "Informe de Horas Trabajadas",
        shiftSummary: "Resumen de Turnos"
      }
    },
    attendanceTable: {
      title: "Registros de Asistencia",
      generateReport: "Generar Reporte Mensual",
      monthlyReport: "Reporte Mensual",
      headers: {
        date: "Fecha",
        morningEntry: "Entrada (Mañana)",
        morningExit: "Salida (Mañana)",
        afternoonEntry: "Entrada (Tarde)",
        afternoonExit: "Salida (Tarde)",
        totalDelay: "Retraso Total",
        workedDays: "Días Trabajados"
      }
    },
    attendanceReport: {
      title: "Reporte de Asistencia",
      employee: "Empleado",
      daysWorked: "Días Trabajados",
      totalDelays: "Total de Retrasos",
      downloadButton: "Descargar Reporte",
      noEmployeesWarning: "No hay empleados para generar el reporte."
    }
  },
  ko: {
    login: {
      title: "접근 제어",
      accessKey: "접근 키 입력",
      accessButton: "접근",
      incorrectKey: "잘못된 키. 접근이 거부되었습니다."
    },
    employeeList: {
      title: "직원 선택",
      shifts: "교대 일정",
      selectEmployee: "직원 선택",
      shiftTimes: {
        morning: {
          name: "오전",
          start: "08:30",
          end: "12:30"
        },
        afternoon: {
          name: "오후",
          start: "14:30",
          end: "18:30"
        }
      }
    },
    reportGeneration: {
      title: "보고서 생성",
      selectDateRange: "날짜 범위 선택",
      startDate: "시작 날짜",
      endDate: "종료 날짜",
      generateButton: "보고서 생성",
      downloadButton: "보고서 다운로드",
      noDataAvailable: "선택한 기간에 대한 데이터가 없습니다.",
      reportTypes: {
        attendance: "출근 보고서",
        workHours: "근무 시간 보고서",
        shiftSummary: "교대 요약"
      }
    },
    attendanceTable: {
      title: "출근 기록",
      generateReport: "월간 보고서 생성",
      monthlyReport: "월간 보고서",
      headers: {
        date: "날짜",
        morningEntry: "오전 출근",
        morningExit: "오전 퇴근",
        afternoonEntry: "오후 출근",
        afternoonExit: "오후 퇴근",
        totalDelay: "총 지연",
        workedDays: "근무일"
      }
    },
    attendanceReport: {
      title: "출석 보고서",
      employee: "직원",
      daysWorked: "근무일",
      totalDelays: "총 지연",
      downloadButton: "보고서 다운로드",
      noEmployeesWarning: "보고서를 생성할 직원이 없습니다."
    }
  }
};

// Language selection hook (kept for backward compatibility)
export const useLanguage = (lang = 'en') => {
  return translations[lang] || translations['en'];
};