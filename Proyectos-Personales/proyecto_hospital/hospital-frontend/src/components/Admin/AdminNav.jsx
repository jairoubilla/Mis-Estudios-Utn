import React from 'react';

const AdminNav = ({ vista, setVista, idioma, btnTab }) => (
  <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
    <button onClick={() => setVista('turnos')} style={btnTab(vista === 'turnos')}>
      {idioma === 'es' ? 'Turnos' : 'Appointments'}
    </button>
    <button onClick={() => setVista('pacientes')} style={btnTab(vista === 'pacientes')}>
      {idioma === 'es' ? 'Pacientes' : 'Patients'}
    </button>
    <button onClick={() => setVista('medicos')} style={btnTab(vista === 'medicos')}>
      {idioma === 'es' ? 'Médicos' : 'Doctors'}
    </button>
    <button
      onClick={() => setVista('tv')}
      style={btnTab(vista === 'tv')}
    >
      📺 {idioma === 'es' ? 'Modo TV' : 'TV Mode'}
    </button>
  </div>
);

export default AdminNav;