import React from 'react';

const StatsCards = ({ turnos, hoy, cardStyle }) => (
  <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', flexWrap: 'wrap' }}>
    <div style={{ ...cardStyle, borderTop: '5px solid #4CAF50' }}>
      <h4 style={{ margin: 0, fontSize: '12px', color: '#aaa' }}>TURNOS HOY</h4>
      <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '5px 0' }}>
        {turnos.filter(t => t.fecha === hoy).length}
      </p>
    </div>
    <div style={{ ...cardStyle, borderTop: '5px solid #2196F3' }}>
      <h4 style={{ margin: 0, fontSize: '12px', color: '#aaa' }}>ATENDIDOS HOY</h4>
      <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '5px 0', color: '#2196F3' }}>
        {turnos.filter(t => t.fecha === hoy && t.estado === 'Atendido').length}
      </p>
    </div>
    <div style={{ ...cardStyle, borderTop: '5px solid #FFC107' }}>
      <h4 style={{ margin: 0, fontSize: '12px', color: '#aaa' }}>POR ATENDER</h4>
      <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '5px 0', color: '#FFC107' }}>
        {turnos.filter(t => t.fecha === hoy && (t.estado === 'Pendiente' || t.estado === 'Confirmado')).length}
      </p>
    </div>
  </div>
);

export default StatsCards;