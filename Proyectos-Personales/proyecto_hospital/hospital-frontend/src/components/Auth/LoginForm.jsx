import React from 'react';

const LoginForm = ({ TEXTOS, idioma, busquedaDni, setBusquedaDni, buscarPaciente, setRol, inputStyle, btnLarge }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
    <h3>{TEXTOS[idioma].ingresar}</h3>
    <input
      placeholder={TEXTOS[idioma].placeholderDni}
      style={inputStyle}
      value={busquedaDni}
      onChange={(e) => setBusquedaDni(e.target.value)}
    />
    <button onClick={buscarPaciente} style={btnLarge}>{TEXTOS[idioma].ingresar}</button>
    <button onClick={() => setRol('admin_login')} style={{ background: 'none', color: '#4CAF50', border: 'none', cursor: 'pointer' }}>Acceso Admin</button>
  </div>
);

export default LoginForm;