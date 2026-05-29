import React from 'react';

const RegisterForm = ({ TEXTOS, idioma, nuevoPaciente, setNuevoPaciente, guardarPaciente, setMostrarRegistro, inputStyle, btnLarge, prefijo, setPrefijo, CODIGOS_PAIS, esValido }) => (
  <form onSubmit={guardarPaciente} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
    <h3>{TEXTOS[idioma].crear}</h3>
    <input
      placeholder={TEXTOS[idioma].nombre}
      style={inputStyle}
      value={nuevoPaciente.nombre}
      onChange={(e) => setNuevoPaciente({ ...nuevoPaciente, nombre: e.target.value })}
      required
    />
    <input value={nuevoPaciente.dni} readOnly style={{ ...inputStyle, backgroundColor: '#444' }} />

    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
      <div style={{ display: 'flex', gap: '5px' }}>
        <select
          value={prefijo}
          onChange={(e) => setPrefijo(e.target.value)}
          style={{ ...inputStyle, width: '90px', padding: '5px', fontSize: '14px' }}
        >
          {CODIGOS_PAIS.map(p => (
            <option key={p.codigo} value={p.codigo}>{p.bandera} +{p.codigo}</option>
          ))}
        </select>
        <input
          placeholder={TEXTOS[idioma].whatsapp}
          style={{ ...inputStyle, flex: 1 }}
          value={nuevoPaciente.telefono}
          onChange={(e) => setNuevoPaciente({ ...nuevoPaciente, telefono: e.target.value })}
          required
        />
      </div>
      <span style={{ fontSize: '10px', color: '#aaa' }}>
        {TEXTOS[idioma].ayudaTel}
      </span>
    </div>

    <input
      placeholder={idioma === 'es' ? "Alergias (Ej: Penicilina, ninguna)" : "Allergies (Ex: Penicillin, none)"}
      style={{ ...inputStyle, border: nuevoPaciente.alergias ? '1px solid #ff4444' : 'none' }}
      value={nuevoPaciente.alergias}
      onChange={(e) => setNuevoPaciente({ ...nuevoPaciente, alergias: e.target.value })}
    />

    <button
      type="submit"
      disabled={!esValido()}
      style={{ ...btnLarge, backgroundColor: esValido() ? '#4CAF50' : '#555', cursor: esValido() ? 'pointer' : 'not-allowed', opacity: esValido() ? 1 : 0.6 }}
    >
      {TEXTOS[idioma].confirmar}
    </button>

    {!esValido() && (
      <span style={{fontSize: '10px', color: '#ff4444', textAlign: 'center' }}>
        {idioma === 'es'
          ? '* Completa nombre, apellido y DNI (min. 6 carac.)'
          : '* Fill in full name and ID (min. 6 char.)'}
      </span>
    )}

    <button type="button" onClick={() => setMostrarRegistro(false)} style={{ background: 'none', color: 'gray', border: 'none', cursor: 'pointer' }}>
      {TEXTOS[idioma].volver}
    </button>
  </form>
);

export default RegisterForm;