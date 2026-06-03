import { defineStore } from 'pinia'

export const useTurnosStore = defineStore('turnos', {
  state: () => ({
    usuario: { nombre: 'José Ernesto Sánchez', dni: '030', email: 'a@gmail.com', tel: '11-1234-5678' },
    centros: [
      { id: 1, nombre: 'Centro Médico Pepita', tel: '0800-123-1234', direccion: 'Avenida Pepito 113' },
      { id: 2, nombre: 'Hospital Juan Merangulto', tel: '0800-123-1234', direccion: 'Avenida Ciudad 456' },
      { id: 3, nombre: 'Clínica San Felipe', tel: '0800-23-1234', direccion: 'Avenida Pepito 789' }
    ],
    especialidades: ['Cardiología', 'Pediatría', 'Traumatología', 'Clínica Médica'],
    profesionales: [
      { id: 1, nombre: 'Dra. María Julia Pérez', especialidad: 'Cardiología' },
      { id: 2, nombre: 'Dr. Marcos Peyra', especialidad: 'Pediatría' }
    ],
    // Estado del turno en proceso de reserva
    turnoProceso: {
      centro: null,
      especialidad: null,
      profesional: null,
      fecha: '',
      hora: ''
    },
    turnosConfirmados: []
  }),
  actions: {
    confirmarTurnoActual() {
      this.turnosConfirmados.push({
        id: Date.now(),
        ...this.turnoProceso,
        paciente: this.usuario
      })
      // Resetear proceso
      this.turnoProceso = { centro: null, especialidad: null, profesional: null, fecha: '', hora: '' }
    }
  }
})