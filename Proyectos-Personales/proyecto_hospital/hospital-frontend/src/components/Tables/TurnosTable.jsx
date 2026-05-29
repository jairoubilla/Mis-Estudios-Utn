import React from 'react';

const TurnosTable = ({
  turnos,
  busquedaAdmin,
  hoy,
  idioma,
  actualizarEstadoTurno,
  enviarRecordatorio,
  eliminarTurno,
  tableStyle,
  selectEstadoStyle
}) => (
  <section>
    <input
      placeholder="Buscar paciente o médico..."
      style={{ padding: '12px', borderRadius: '8px', border: 'none', backgroundColor: '#fff', color: '#000', width: '100%', marginBottom: '15px' }}
      onChange={(e) => busquedaAdmin(e.target.value)}
    />

    <table border="1" style={tableStyle}>
      <thead>
        <tr>
          <th>Paciente</th>
          <th>Médico</th>
          <th>Fecha</th>
          <th>Estado</th>
          <th>Acción</th>
        </tr>
      </thead>
      <tbody>
        {turnos
          .filter(t =>
            t.paciente?.toLowerCase().includes(busquedaAdmin.toLowerCase()) ||
            t.medico?.toLowerCase().includes(busquedaAdmin.toLowerCase())
          )
          .map(t => {
            const esHoy = t.fecha === hoy;

            return (
              <tr
                key={t.id}
                style={{
                  backgroundColor: esHoy ? '#3d3d3d' : 'transparent',
                  borderLeft: esHoy ? '4px solid #4CAF50' : 'none'
                }}
              >
                <td style={{ padding: '10px' }}>{t.paciente}</td>
                <td
                  style={{
                    cursor: 'pointer',
                    color: '#4CAF50',
                    fontWeight: 'bold',
                    textDecoration: 'underline dotted'
                  }}
                  title={idioma === 'es' ? "Click para editar nota médica" : "Click to edit medical note"}
                  onClick={() => {
                    const nuevaNota = prompt(
                      idioma === 'es' ? "Evolucion / Nota médica para este turno:" : "Medical note for this appointment:",
                      t.motivo
                    );

                    if (nuevaNota !== null) {
                      actualizarEstadoTurno(t.id, t.estado, nuevaNota);
                    }
                  }}
                >
                  {t.medico}
                </td>
                <td>
                  <span style={{ fontWeight: esHoy ? 'bold' : 'normal'}}>
                    {t.fecha}
                  </span>
                </td>
                <td>
                  <select
                    value={t.estado}
                    onChange={(e) => actualizarEstadoTurno(t.id, e.target.value)}
                    style={selectEstadoStyle(t.estado)}
                  >
                    <option value="Pendiente">Pendiente</option>
                    <option value="Confirmado">Confirmado</option>
                    <option value="Atendido">Atendido</option>
                    <option value="Cancelado">Cancelado</option>
                  </select>
                </td>
                <td>
                  <button
                    onClick={() => enviarRecordatorio(t)}
                    style={{ backgroundColor: '#25D366', color: 'white', border: 'none', padding: '5px', borderRadius: '5px', marginRight: '5px', cursor: 'pointer' }}
                  >
                    📲 Avisar
                  </button>
                  <button
                    onClick={() => eliminarTurno(t.id)}
                    style={{ color: '#F44336', border: 'none', background: 'none', cursor: 'pointer' }}
                  >
                    Borrar
                  </button>
                </td>
              </tr>
            );
          })}
      </tbody>
    </table>
  </section>
);

export default TurnosTable;