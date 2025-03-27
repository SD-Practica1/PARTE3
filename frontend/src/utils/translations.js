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
    }
  }
};

// Language selection hook
export const useLanguage = (lang = 'en') => {
  return translations[lang] || translations['en'];
};