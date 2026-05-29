// Configuración centralizada de URLs del backend
// En producción, cambiar según el entorno (desarrollo, staging, producción)

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000';

export const API_ENDPOINTS = {
  // Autenticación
  LOGIN: `${API_BASE_URL}/auth/login`,
  LOGOUT: `${API_BASE_URL}/auth/logout`,
  
  // Pacientes
  PACIENTES: `${API_BASE_URL}/pacientes`,
  PACIENTES_REGISTER: `${API_BASE_URL}/pacientes/register`,
  PACIENTE_BY_ID: (id) => `${API_BASE_URL}/pacientes/${id}`,
  
  // Médicos
  MEDICOS: `${API_BASE_URL}/medicos`,
  MEDICO_BY_ID: (id) => `${API_BASE_URL}/medicos/${id}`,
  
  // Turnos
  TURNOS: `${API_BASE_URL}/turnos`,
  TURNO_BY_ID: (id) => `${API_BASE_URL}/turnos/${id}`,
  REPORTES_MEDICO: (medicId) => `${API_BASE_URL}/reportes/medico/${medicId}`,
};

export default API_ENDPOINTS;
