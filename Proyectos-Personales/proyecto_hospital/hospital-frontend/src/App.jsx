import { useEffect, useState } from 'react'
import apiClient from './lib/apiClient'
import React from 'react'
import logoAITurnos from './assets/logo.png'
import { SplashScreen, LanguageSelector, AdminLogin } from './components'
import { useData } from './hooks/useData'
import { TEXTOS, CODIGOS_PAIS } from './constants'
import * as styles from './styles'
import API_ENDPOINTS from './config/api.config'
import { AUTH_EXPIRED_EVENT, clearToken } from './lib/auth'
import './login.css'

const { inputStyle, btnLarge, btnTab, cardStyle, tableStyle, selectEstadoStyle, formStyle } = styles;

const PACIENTE_INICIAL = { id: null, nombre: '', dni: '', telefono: '', alergias: '' };
const MEDICO_INICIAL = { id: null, nombre: '', especialidad: '', telefono: '', matricula: '', consultorio: '' };
const TURNO_INICIAL = { paciente_id: '', medico_id: '', fecha: '', hora: '', motivo: '', estado: 'Pendiente' };

      // Token expirado o invalido

// ==========================================
// 1. ESTILOS (Ahora importados)
// ==========================================

function App() {
  const normalizarDocumento = (valor) => String(valor ?? '').trim();

  const backButtonStyle = {
    background: 'none',
    color: '#aaa',
    border: '1px solid #555',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '14px',
    padding: '10px 15px'
  };

  // ==========================================
  // 1. ESTADOS (Ahora usando hook para datos)
  // ==========================================
  const [rol, setRol] = useState(null);
  const [vista, setVista] = useState('turnos');
  const [busquedaDni, setBusquedaDni] = useState('');
  const [pacienteEncontrado, setPacienteEncontrado] = useState(null);
  const [mostrarPortada, setMostrarPortada] = useState(true);
  const [mostrarRegistro, setMostrarRegistro] = useState(false);
  const [nuevoPaciente, setNuevoPaciente] = useState(PACIENTE_INICIAL);
  const [nuevoMedico, setNuevoMedico] = useState(MEDICO_INICIAL);
  const [nuevoTurno, setNuevoTurno] = useState(TURNO_INICIAL);
  const [autenticado, setAutenticado] = useState(false);
  const [busquedaAdmin, setBusquedaAdmin] = useState('');
  const [prefijo, setPrefijo] = useState('549');

  const hoy = new Date().toISOString().split('T')[0]

  // Dicionario de traducciones (ahora importado)
  // const TEXTOS = ... (removido, importado)

  // Esado para el idioma
  const [idioma, setIdioma] = useState('es')

  // Estados para controlar que se ve
  const [cargando, setCargando] = useState(true) // Para el Splash Screen

  // Efecto para quitar la pantalla de carga despues de 3 segundos
  useEffect(() => {
    const timer = setTimeout(() => setCargando(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  // ==========================================
  // 2. CARGA DE DATOS (Ahora con hook)
  // ==========================================
  const { pacientes, medicos, turnos, obtenerDatos } = useData()

  // ==========================================
  // 3. FUNCIONES DE GESTIN
  // ==========================================
  const guardarPaciente = async (e) => {
    e.preventDefault();
    const dniNormalizado = normalizarDocumento(nuevoPaciente.dni);
    const datosActualizados = await obtenerDatos();
    if (!datosActualizados && pacientes.length === 0) {
      alert(
        idioma === 'es'
          ? 'No se pudo actualizar la lista de pacientes. Verifica que el backend este activo.'
          : 'The patient list could not be refreshed. Please check that the backend is running.'
      );
      return;
    }
    const pacientesDisponibles = datosActualizados?.pacientes ?? pacientes;

    // Verificamos duplicados de DNI 
    if (!nuevoPaciente.id && pacientesDisponibles.some((p) => normalizarDocumento(p.dni) === dniNormalizado)) {
      alert(TEXTOS[idioma].errorDni)
      return
    }

    // Procesamos los datos
    const numeroLimpio = nuevoPaciente.telefono.replace(/\D/g, '')
    const telefonoFinal = prefijo + numeroLimpio 
    const nombreFormateado = nuevoPaciente.nombre.replace(/\b\w/g, l => l.toUpperCase())

    // Preparamos el objeto 
    const datosLimpios = { 
      nombre: nombreFormateado, 
      dni: dniNormalizado,
      telefono: telefonoFinal 
    };
    
    try {
      if (nuevoPaciente.id) { 
        await apiClient.put(API_ENDPOINTS.PACIENTE_BY_ID(nuevoPaciente.id), datosLimpios);
        alert(TEXTOS[idioma].exitoUpdate); 
      } else { 
        // Usar endpoint de registro publico si no hay token, sino usar el endpoint admin
        const endpoint = autenticado && rol === 'admin'
          ? API_ENDPOINTS.PACIENTES
          : API_ENDPOINTS.PACIENTES_REGISTER;
        await apiClient.post(endpoint, datosLimpios); 
        alert(TEXTOS[idioma].exitoRegistro);
      }

      // Limpieza de estados
      setNuevoPaciente(PACIENTE_INICIAL);
      setMostrarRegistro(false);
      setMostrarPortada(true);
      obtenerDatos();
    } catch { alert(TEXTOS[idioma].errorPaciente) }
  };

  const eliminarPaciente = async (id) => {
    if (window.confirm("Eliminar este paciente?")) {
      try {
        await apiClient.delete(API_ENDPOINTS.PACIENTE_BY_ID(id));
        obtenerDatos();
      } catch { alert("Error al eliminar") }
    }
  };

  const guardarMedico = async (e) => {
    e.preventDefault();
    const datosParaEnviar = { 
      nombre: nuevoMedico.nombre, 
      especialidad: nuevoMedico.especialidad, 
      matricula: nuevoMedico.matricula, 
      telefono: nuevoMedico.telefono,
      consultorio: nuevoMedico.consultorio
    };
    try {
      if (nuevoMedico.id) { await apiClient.put(API_ENDPOINTS.MEDICO_BY_ID(nuevoMedico.id), datosParaEnviar); }
      else { await apiClient.post(API_ENDPOINTS.MEDICOS, datosParaEnviar); }
      alert("Medico procesado");
      setNuevoMedico(MEDICO_INICIAL);
      obtenerDatos();
    } catch { alert("Error en medico") }
  };

  const eliminarMedico = async (id) => {
    if (window.confirm("Eliminar este medico?")) {
      try {
        await apiClient.delete(API_ENDPOINTS.MEDICO_BY_ID(id));
        obtenerDatos();
      } catch { alert("Error al eliminar") }
    }
  };

  const normalizarHoraParaBackend = (hora) => {
    if (!hora) return hora;
    return /^\d{2}:\d{2}$/.test(hora) ? `${hora}:00` : hora;
  };

  const guardarTurno = async (e) => {
    e.preventDefault();
    const horaNormalizada = normalizarHoraParaBackend(nuevoTurno.hora);

    //Buscamos si ya existe un turno con ese medico, fecha y hora
    const turnoOcupado = turnos.find(t =>
      t.medico_id === Number(nuevoTurno.medico_id) &&
      t.fecha === nuevoTurno.fecha &&
      t.hora === horaNormalizada &&
      t.estado !== 'Cancelado' // Si esta cancelado, el horario queda libre
    )

    if (turnoOcupado) {
      alert(idioma === 'es'
        ? "Este horario ya esta ocupado para este medico. Por favor elige otro."
        : "This slot is already taken for this doctor. Please choose another one.")
      return // Cortamos la funcion aqui, no se envia nada al backend
    }

    //Si el horario esta libre, procedemos a guardar
    const datosFinales = { 
      ...nuevoTurno, 
      paciente_id: Number(pacienteEncontrado?.id),
      hora: horaNormalizada
    };
    try {
      await apiClient.post(API_ENDPOINTS.TURNOS, datosFinales);
      alert(idioma === 'es' ? "Turno agendado!" : "Appointment scheduled");
      setNuevoTurno(TURNO_INICIAL);
      obtenerDatos();
    } catch (err) {
      const status = err.response?.status;
      const mensajeBackend = err.response?.data?.mensaje;
      const erroresValidacion = err.response?.data?.errores;

      if (status === 401) {
        alert(
          idioma === 'es'
            ? "No se pudo autorizar la operacion. Si estabas en el panel admin, inicia sesion de nuevo."
            : "The operation could not be authorized. If you were using the admin panel, please sign in again."
        );
        return;
      }

      if (mensajeBackend) {
        alert(mensajeBackend);
        return;
      }

      if (erroresValidacion) {
        const detalle = Object.entries(erroresValidacion)
          .map(([campo, mensajes]) => `${campo}: ${Array.isArray(mensajes) ? mensajes.join(', ') : mensajes}`)
          .join('\n');
        alert(detalle);
        return;
      }

      alert(idioma === 'es' ? "Error al agendar" : "Error scheduling appointment");
    }
  };

  const actualizarEstadoTurno = async (id, nuevoEstado, nuevaNota = null) => {
    try {
      const datosAEnviar = { estado: nuevoEstado}
      // Si mandamos una nota, la incluimos en el objeto "motivo"
      if (nuevaNota !== null) datosAEnviar.motivo = nuevaNota

      await apiClient.put(API_ENDPOINTS.TURNO_BY_ID(id), datosAEnviar);
      obtenerDatos();
    } catch {
      alert("Error al cambiar estado") 
    }
  };

  const eliminarTurno = async (id) => {
    if (window.confirm("Eliminar turno?")) {
      try { await apiClient.delete(API_ENDPOINTS.TURNO_BY_ID(id)); obtenerDatos(); }
      catch { alert("Error al borrar") }
    }
  };

  const enviarRecordatorio = (turno) => {
    // Calculamos la fecha de manana para comparar
    const fechaManana = new Date()
    fechaManana.setDate(fechaManana.getDate() + 1)
    const mananaStr = fechaManana.toISOString().split('T')[0]

    let momento = "proximamente";
    if (turno.fecha === hoy) {
      momento = "HOY";
    }else if (turno.fecha === mananaStr) {
      momento = "MANANA";
    }

    const mensaje = `Hola ${turno.paciente}, te recordamos que tienes un turno agendado para ${momento}, el dia ${turno.fecha} a las ${turno.hora}hs con el Dr. ${turno.medico}. Te esperamos!`;

    const url = `https://wa.me/${turno.telefono_paciente}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
  };

  const buscarPaciente = async () => {
    const documento = normalizarDocumento(busquedaDni);

    if (documento.length < 6) {
      alert(
        idioma === 'es'
          ? 'Ingresa un DNI o pasaporte valido para continuar.'
          : 'Enter a valid ID or passport to continue.'
      );
      return;
    }

    const datosActualizados = await obtenerDatos();
    if (!datosActualizados && pacientes.length === 0) {
      alert(
        idioma === 'es'
          ? 'No se pudo consultar la lista de pacientes. Verifica que el backend este activo.'
          : 'The patient list could not be queried. Please check that the backend is running.'
      );
      return;
    }
    const pacientesDisponibles = datosActualizados?.pacientes ?? pacientes;
    const encontrado = pacientesDisponibles.find((p) => normalizarDocumento(p.dni) === documento);
    if (encontrado) { setPacienteEncontrado(encontrado); setRol('paciente'); }
    else if (window.confirm("DNI no registrado. Crear cuenta?")) {
      setNuevoPaciente({ ...PACIENTE_INICIAL, dni: documento });
      setMostrarRegistro(true);
    }
  };

  const abrirAccesoPaciente = () => {
    setRol('paciente');
    setMostrarPortada(false);
    setMostrarRegistro(false);
    setBusquedaDni('');
    setPacienteEncontrado(null);
  };

  const abrirAccesoAdmin = () => {
    setRol('admin_login');
    setMostrarPortada(false);
    setMostrarRegistro(false);
    setBusquedaDni('');
    setPacienteEncontrado(null);
  };

  const turnosFiltrados = turnos.filter(t =>
    t.paciente?.toLowerCase().includes(busquedaAdmin.toLowerCase()) ||
    t.medico?.toLowerCase().includes(busquedaAdmin.toLowerCase())
  );

  const esValido = () => {
    const dniValido = nuevoPaciente.dni.length >= 6 // Minimo 6 caracteres para DNI/Pasaporte
    const nombreValido = nuevoPaciente.nombre.trim().includes(' ') // Al menos nombre y apellido
    const telefonoValido = nuevoPaciente.telefono.replace(/\D/g, '').length >= 7 //Al menos 7 numeros

    return dniValido && nombreValido && telefonoValido
  }

  const exportarExcel = () => {
    // Definimos los titulos de las columnas
    const encabezados = "PACIENTE\tDNI/PASAPORTE\tTELEFONO\tMEDICO\tFECHA\tHORA\tESTADO\tNOTAS/MOTIVO\n";

    // Filtramos solo los turnos que se ven en pantalla (o todos los de hoy)
    const datosParaExportar = turnosFiltrados.length > 0 ? turnosFiltrados : turnos.filter(t => t.fecha === hoy)

    // Construimos las filas uniendo los datos con tabulaciones (\t)
    const filas = datosParaExportar.map(t => {
      // Buscamos el dni y el telefono extra si no vienen en el objeto turno
      const p = pacientes.find(pac => pac.nombre === t.paciente) || {}
      return `${t.paciente}\t${p.dni || 'N/A'}\t${p.telefono || 'N/A'}\t${t.medico}\t${t.fecha}\t${t.hora}\t${t.estado}\t${t.motivo || ''}`
    }).join("\n");

    // Creamos el archivo y lo descargamos
    const blob = new Blob(["\ufeff" + encabezados + filas], { type: 'application/vnd.ms-excel;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Planilla_Turnos_${hoy}.xls`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const volverATurnosAdmin = () => {
    setVista('turnos');
    setBusquedaAdmin('');
    setNuevoPaciente(PACIENTE_INICIAL);
    setNuevoMedico(MEDICO_INICIAL);
  };

  const resetearVistaInicial = () => {
    setAutenticado(false);
    setRol(null);
    setVista('turnos');
    setBusquedaAdmin('');
    setBusquedaDni('');
    setPacienteEncontrado(null);
    setMostrarPortada(true);
    setMostrarRegistro(false);
    setNuevoPaciente(PACIENTE_INICIAL);
    setNuevoMedico(MEDICO_INICIAL);
    setNuevoTurno(TURNO_INICIAL);
  };

  const volverAlInicio = () => {
    clearToken();
    resetearVistaInicial();
  };

  const volverAlInicioPaciente = () => {
    setRol(null);
    setBusquedaDni('');
    setPacienteEncontrado(null);
    setMostrarPortada(true);
    setMostrarRegistro(false);
    setNuevoTurno(TURNO_INICIAL);
  };

  useEffect(() => {
    const handleAuthExpired = () => {
      resetearVistaInicial();
    };

    window.addEventListener(AUTH_EXPIRED_EVENT, handleAuthExpired);
    return () => window.removeEventListener(AUTH_EXPIRED_EVENT, handleAuthExpired);
  }, []);

  useEffect(() => {
    if (rol === 'admin' && autenticado) {
      obtenerDatos();
    }
  }, [rol, autenticado, obtenerDatos]);

  const verHistoriaClinica = (pacienteNombre) => {
    const historial = turnos
      .filter(t => t.paciente === pacienteNombre && t.motivo)
      .sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

    if (historial.length === 0) {
      alert(TEXTOS[idioma].sinRegistros);
      return;
    }

    const titulo = ` ${TEXTOS[idioma].historiaClinica}: ${pacienteNombre}`;
  
    const detalle = historial.map(h => 
      ` ${h.fecha} | Dr. ${h.medico}:\n ${h.motivo}\n-------------------`
    ).join("\n\n");

    alert(`${titulo}\n\n${detalle}`);
  };

  const mostrarInicio = !rol || (rol === 'admin' && !autenticado) || (rol === 'paciente' && !pacienteEncontrado);
  const mostrarPanelAdmin = rol === 'admin' && autenticado;
  const mostrarVistaPaciente = rol === 'paciente' && pacienteEncontrado;
  const authHeroTitle = mostrarRegistro
    ? (idioma === 'es' ? 'Registro de paciente' : 'Patient registration')
    : mostrarPortada
      ? 'AITurnos Hospital Regional Malargue'
      : (idioma === 'es' ? 'Ingreso de pacientes' : 'Patient access');
  const authHeroDescription = mostrarRegistro
    ? (idioma === 'es'
      ? 'Completa tus datos.'
      : 'Complete your details.')
    : mostrarPortada
      ? (idioma === 'es'
        ? 'Turnos y administracion.'
        : 'Appointments and admin.')
      : (idioma === 'es'
        ? 'Ingresa tu documento.'
        : 'Enter your document.');
  const authCardTitle = mostrarRegistro
    ? TEXTOS[idioma].crear
    : mostrarPortada
      ? (idioma === 'es' ? 'Elige tu acceso' : 'Choose your access')
      : TEXTOS[idioma].ingresar;
  const authCardDescription = mostrarRegistro
    ? ''
    : mostrarPortada
      ? ''
      : '';

  // ==========================================
  // 4. RENDERIZADO
  // ==========================================
  return (
    <>
      {/* Capa de splash screen */}
      {cargando && <SplashScreen />}


      <div style={{ padding: '20px', fontFamily: 'Arial', backgroundColor: '#1a1a1a', color: 'white', minHeight: '100vh' }}>
        {mostrarInicio ? (
          <div className="login-container">
            <div className="login-background">
              <span className="login-orb login-orb--one" />
              <span className="login-orb login-orb--two" />
              <span className="login-orb login-orb--three" />
              <span className="login-grid" />
            </div>

            <div className="login-shell">
              <section className="login-showcase">
                <div className="login-showcase-top">
                  <span className="login-chip">
                    {idioma === 'es' ? 'Portal hospitalario' : 'Hospital portal'}
                  </span>
                  <div className="login-language">
                    <LanguageSelector idioma={idioma} setIdioma={setIdioma} />
                  </div>
                </div>

                <div className="login-brand-block">
                  <img
                    src={logoAITurnos}
                    alt="AITurnos Hospital Regional Malargue"
                    className="login-logo"
                  />
                </div>

                <div className="login-copy">
                  <h1 className="login-title">{authHeroTitle}</h1>
                  <p className="login-description">{authHeroDescription}</p>
                </div>
              </section>

              <section className="login-card">
                <div className="login-card-inner">
                  <div className="login-card-header">
                    <span className="login-card-badge">
                      {mostrarRegistro
                        ? (idioma === 'es' ? 'Alta de paciente' : 'Patient registration')
                        : mostrarPortada
                          ? (idioma === 'es' ? 'Acceso principal' : 'Main access')
                          : (idioma === 'es' ? 'Validacion de identidad' : 'Identity check')}
                    </span>
                    <h3>{authCardTitle}</h3>
                    <p>{authCardDescription}</p>
                  </div>
              {mostrarPortada ? (
                <div className="login-flow">
                  <h3 style={{ textAlign: 'center' }}>{idioma === 'es' ? 'Selecciona acceso' : 'Choose access'}</h3>
                  <button type="button" onClick={abrirAccesoPaciente} className="login-btn login-btn--primary">
                    {idioma === 'es' ? 'Ingresar como paciente' : 'Continue as patient'}
                  </button>
                  <div className="login-access-divider">
                    <span>{idioma === 'es' ? 'o' : 'or'}</span>
                  </div>
                  <button
                    type="button"
                    onClick={abrirAccesoAdmin}
                    className="login-btn login-btn--admin"
                  >
                    {idioma === 'es' ? 'Acceso Admin' : 'Admin Access'}
                  </button>
                </div>
              ) : !mostrarRegistro ? (

                // Vista de login
                <div className="login-flow">
                  <h3 style={{ textAlign: 'center' }}>{idioma === 'es' ? 'Paciente' : 'Patient'}</h3>
                  <input 
                    placeholder={TEXTOS[idioma].placeholderDni} 
                    className="login-input"
                    value={busquedaDni} 
                    onChange={(e) => setBusquedaDni(e.target.value)} 
                  />
                  <button onClick={buscarPaciente} className="login-btn login-btn--primary">{TEXTOS[idioma].ingresar}</button>
                  <button type="button" onClick={abrirAccesoAdmin} className="login-link-btn">Acceso Admin</button>
                  <button
                    type="button"
                    onClick={() => {
                      setMostrarPortada(true);
                      setBusquedaDni('');
                    }}
                    className="login-back-btn"
                  >
                    {TEXTOS[idioma].volver}
                  </button>
                </div>
              ) : (

                //Vista de registro
                <form onSubmit={guardarPaciente} className="login-flow">
                  <h3>{TEXTOS[idioma].crear}</h3>
                  <input 
                    placeholder={TEXTOS[idioma].nombre}
                    className="login-input"
                    value={nuevoPaciente.nombre} 
                    onChange={(e) => setNuevoPaciente({ ...nuevoPaciente, nombre: e.target.value })} 
                    required 
                  />
                  <input value={busquedaDni} readOnly className="login-input login-input--readonly" />
                
                  <div className="login-field-stack">
                    <div className="login-phone-row">   
                      {/* SELECTOR DE BANDERAS */}
                      <select 
                        value={prefijo} 
                        onChange={(e) => setPrefijo(e.target.value)}
                        className="login-input login-input--select"
                      >
                        {CODIGOS_PAIS.map(p => (
                          <option key={p.codigo} value={p.codigo}>{p.bandera} +{p.codigo}</option>
                        ))}
                      </select>
    
                      {/* CAMPO DE NUMERO */}
                      <input 
                        placeholder={TEXTOS[idioma].whatsapp}
                        className="login-input"
                        value={nuevoPaciente.telefono} 
                        onChange={(e) => setNuevoPaciente({ ...nuevoPaciente, telefono: e.target.value })} 
                        required 
                      />
                    </div>
                    <span className="login-help-text">
                      {TEXTOS[idioma].ayudaTel}
                    </span>
                  </div>

                  <input 
                    placeholder={idioma === 'es' ? "Alergias (Ej: Penicilina, ninguna)" : "Allergies (Ex: Penicillin, none)"} 
                    className="login-input"
                    style={{ border: nuevoPaciente.alergias ? '1px solid #ff4444' : '1px solid rgba(255,255,255,0.2)' }} 
                    value={nuevoPaciente.alergias} 
                    onChange={(e) => setNuevoPaciente({ ...nuevoPaciente, alergias: e.target.value })} 
                  />

                  <button 
                    type="submit" 
                    disabled={!esValido()} 
                    className="login-btn login-btn--primary"
                    style={!esValido() ? { opacity: 0.5 } : undefined}
                  >
                    {TEXTOS[idioma].confirmar}
                  </button>

                  {!esValido() && (
                    <span className="login-error-text">
                      {idioma === 'es'
                        ? '* Completa nombre, apellido y DNI (min. 6 carac.)'
                        : '* Fill in full name and ID (min. 6 char.)'}
                    </span>
                  )}

                  <button type="button" onClick={() => setMostrarRegistro(false)} className="login-back-btn">
                    {TEXTOS[idioma].volver}
                  </button>
                </form>
                  )}
                </div>
              </section>
            </div>
          </div>
        ) : rol === 'admin_login' ? (
          <AdminLogin setRol={setRol} setAutenticado={setAutenticado} idioma={idioma} setIdioma={setIdioma} volverAlInicio={volverAlInicio} />
        ) : mostrarPanelAdmin ? (
          <div>
            <div className="admin-section-container">
                {/* --- BARRA DE NAVEGACIN ADMIN (DENTRO DEL PANEL) --- */}
                <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap', width: '100%', maxWidth: '1200px', justifyContent: 'center' }}>
                  <button onClick={() => setVista('turnos')} style={btnTab(vista === 'turnos')}>
                    {idioma === 'es' ? 'Turnos' : 'Appointments'}
                  </button>
                  <button onClick={() => setVista('pacientes')} style={btnTab(vista === 'pacientes')}>
                    {idioma === 'es' ? 'Pacientes' : 'Patients'}
                  </button>
                  <button onClick={() => setVista('medicos')} style={btnTab(vista === 'medicos')}>
                    {idioma === 'es' ? 'Medicos' : 'Doctors'}
                  </button>
                  <button 
                    onClick={() => setVista('tv')} 
                    style={btnTab(vista === 'tv')}
                  >
                     {idioma === 'es' ? 'Modo TV' : 'TV Mode'}
                  </button>
                  <button 
                    onClick={volverAlInicio}
                    style={{ background: 'none', color: '#ff6b6b', border: 'none', cursor: 'pointer', fontSize: '14px', padding: '10px 15px', marginLeft: 'auto' }}
                  >
                     {idioma === 'es' ? 'Salir' : 'Logout'}
                  </button>
                </div>

                {/* --- ESTADISTICAS RAPIDAS Y HERRAMIENTAS (Admin) --- */}
                <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', flexWrap: 'wrap', width: '100%', maxWidth: '1200px' }}>
                  {/* Turnos totales del dia */}
                  <div style={{ ...cardStyle, borderTop: '5px solid #4CAF50' }}>
                    <h4 style={{ margin: 0, fontSize: '12px', color: '#aaa' }}>TURNOS HOY</h4>
                    <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '5px 0' }}>
                      {turnos.filter(t => t.fecha === hoy).length}
                    </p>
                  </div>

                  {/* Pacientes que ya pasaron por el consultorio hoy */}
                  <div style={{ ...cardStyle, borderTop: '5px solid #2196F3' }}>
                    <h4 style={{ margin: 0, fontSize: '12px', color: '#aaa' }}>ATENDIDOS HOY</h4>
                    <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '5px 0', color: '#2196F3' }}>
                      {turnos.filter(t => t.fecha === hoy && t.estado === 'Atendido').length}
                    </p>
                  </div>

                  {/* Lo que queda pendiente en la sala de espera */}
                  <div style={{ ...cardStyle, borderTop: '5px solid #FFC107' }}>
                    <h4 style={{ margin: 0, fontSize: '12px', color: '#aaa' }}>POR ATENDER</h4>
                    <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '5px 0', color: '#FFC107' }}>
                      {turnos.filter(t => t.fecha === hoy && (t.estado === 'Pendiente' || t.estado === 'Confirmado')).length}
                    </p>
                  </div>
                </div>

                {/* BOTN DE EXPORTACIN */}
                <button
                  onClick={exportarExcel}
                  style={{
                    ...btnLarge,
                    backgroundColor: '#2E7D32',
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px'
                  }}
                >
                  {idioma === 'es' ? 'Descargar Planilla Excel del Dia' : 'Download Today\'s Excel Sheet'}
                </button>

                {vista === 'turnos' && (
                  <div className="admin-section">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '15px', flexWrap: 'wrap', marginBottom: '15px' }}>
                      <button onClick={volverAlInicio} style={backButtonStyle}>
                        {idioma === 'es' ? ' Volver al inicio' : ' Back to home'}
                      </button>
                      <h3 style={{ margin: 0 }}>{idioma === 'es' ? 'Gestion de Turnos' : 'Appointments Management'}</h3>
                    </div>
                    <input 
                      placeholder="Buscar paciente o medico..." 
                      style={{ ...inputStyle, width: '100%', marginBottom: '15px' }} 
                      onChange={(e) => setBusquedaAdmin(e.target.value)} 
                    />

                    <table border="1" style={tableStyle}>
                      <thead>
                        <tr>
                          <th>Paciente</th>
                          <th>Medico</th>
                          <th>Fecha</th>
                          <th>Estado</th>
                          <th>Accion</th>
                        </tr>
                      </thead>
                      <tbody>
                        {turnos
                          .filter(t =>
                            t.paciente?.toLowerCase().includes(busquedaAdmin.toLowerCase()) ||
                            t.medico?.toLowerCase().includes(busquedaAdmin.toLowerCase)
                          )
                          .map(t => {
                            const esHoy = t.fecha === hoy

                          return (
                            <tr 
                              key={t.id} 
                              style={{ 
                                backgroundColor: esHoy ? '#3d3d3d' : 'transparent', // Un gris mas claro si es hoy
                                borderLeft: esHoy ? '4px solid #4CAF50' : 'none'    // Una sutil linea verde lateral
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
                                title={idioma === 'es' ? "Click para editar nota medica" : "Click to edit medical note"}
                                onClick={() => {
                                  const nuevaNota = prompt(
                                    idioma === 'es' ? "Evolucion / Nota medica para este turno:" : "Medical note for this appointment:",
                                    t.motivo
                                  )

                                  // Si el usuario no cancela el prompt, guardamos la nota
                                  if (nuevaNota !== null) {
                                    actualizarEstadoTurno(t.id, t.estado, nuevaNota)
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
                                 Avisar
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
                  </div>
                )}

                {vista === 'pacientes' && (
                  <div className="admin-section">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', gap: '15px', flexWrap: 'wrap' }}>
                      <button onClick={volverATurnosAdmin} style={backButtonStyle}>
                        {idioma === 'es' ? ' Volver a turnos' : ' Back to appointments'}
                      </button>
                      <h3>{idioma === 'es' ? 'Gestion de Pacientes' : 'Patient Management'}</h3>
                      <input 
                        placeholder=" Buscar..." 
                        style={{ ...inputStyle, width: '250px' }} 
                        onChange={(e) => setBusquedaAdmin(e.target.value)} 
                      />
                    </div>

                    {/* FORMULARIO MEJORADO CON ALERGIAS */}
                    <form onSubmit={guardarPaciente} style={formStyle}>
                      <input 
                        placeholder={TEXTOS[idioma].nombre} 
                        style={inputStyle} 
                        value={nuevoPaciente.nombre} 
                        onChange={(e) => setNuevoPaciente({ ...nuevoPaciente, nombre: e.target.value })} 
                        required 
                      />
                      <input 
                        placeholder={TEXTOS[idioma].placeholderDni} 
                        style={inputStyle} 
                        value={nuevoPaciente.dni} 
                        onChange={(e) => setNuevoPaciente({ ...nuevoPaciente, dni: e.target.value })} 
                        required 
                      />
      
                      <div style={{ display: 'flex', gap: '5px' }}>
                        <select 
                          value={prefijo} 
                          onChange={(e) => setPrefijo(e.target.value)}
                          style={{ ...inputStyle, width: '80px', padding: '5px' }}
                        >
                          {CODIGOS_PAIS.map(p => (
                            <option key={p.codigo} value={p.codigo}>{p.bandera} +{p.codigo}</option>
                          ))}
                        </select>
                        <input 
                          placeholder="WhatsApp" 
                          style={{ ...inputStyle, flex: 1 }} 
                          value={nuevoPaciente.telefono} 
                          onChange={(e) => setNuevoPaciente({ ...nuevoPaciente, telefono: e.target.value })} 
                          required 
                        />
                      </div>

                      {/* CAMPO DE ALERGIAS (Punto clave) */}
                      <input 
                        placeholder={idioma === 'es' ? "Alergias / Advertencias" : "Allergies / Warnings"} 
                        style={{ 
                          ...inputStyle, 
                          width: '100%', 
                          border: nuevoPaciente.alergias ? '1px solid #ff4444' : 'none',
                          backgroundColor: nuevoPaciente.alergias ? '#fff5f5' : '#fff' 
                        }} 
                        value={nuevoPaciente.alergias} 
                        onChange={(e) => setNuevoPaciente({ ...nuevoPaciente, alergias: e.target.value })} 
                      />

                      <button 
                        type="submit" 
                        disabled={!esValido()} 
                        style={{ ...btnLarge, backgroundColor: esValido() ? '#4CAF50' : '#555' }}
                      >
                        {nuevoPaciente.id 
                          ? ' ' + (idioma === 'es' ? 'Actualizar' : 'Update') 
                          : ' ' + (idioma === 'es' ? 'Anadir' : 'Add')}
                      </button>
      
                      {nuevoPaciente.id && (
                        <button 
                          type="button" 
                          onClick={() => setNuevoPaciente(PACIENTE_INICIAL)} 
                          style={{ marginLeft: '10px', background: 'none', color: 'gray', border: 'none', cursor: 'pointer' }}
                        >
                          {TEXTOS[idioma].volver}
                        </button>
                      )}
                    </form>

                    <table border="1" style={tableStyle}>
                      <thead>
                        <tr>
                          <th>{idioma === 'es' ? 'Nombre' : 'Name'}</th>
                          <th>{TEXTOS[idioma].placeholderDni}</th>
                          <th>{idioma === 'es' ? 'Acciones' : 'Actions'}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pacientes
                          .filter(p => p.nombre.toLowerCase().includes(busquedaAdmin.toLowerCase()) || p.dni.includes(busquedaAdmin))
                          .map(p => (
                            <tr key={p.id}>
                              <td style={{ padding: '10px' }}>{p.nombre}</td>
                              <td>{p.dni}</td>
                              <td>
                                <button 
                                  onClick={() => verHistoriaClinica(p.nombre)} 
                                  style={{ color: '#2196F3', marginRight: '10px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' }}
                                  title={idioma === 'es' ? "Ver Historia Clinica" : "View Medical History"}
                                >
                                  Historia
                                </button>
                                <button onClick={() => setNuevoPaciente(p)} style={{ color: 'orange', marginRight: '10px', background: 'none', border: 'none', cursor: 'pointer' }}>Editar</button>
                                <button onClick={() => eliminarPaciente(p.id)} style={{ color: 'red', background: 'none', border: 'none', cursor: 'pointer' }}>Eliminar</button>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {vista === 'medicos' && (
                  <div className="admin-section">
                    {/* CABECERA Y BUSCADOR */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', gap: '15px', flexWrap: 'wrap' }}>
                      <button onClick={volverATurnosAdmin} style={backButtonStyle}>
                        {idioma === 'es' ? 'Volver a turnos' : 'Back to appointments'}
                      </button>
                      <h3 style={{ color: '#4CAF50' }}>{idioma === 'es' ? 'Gestion de Medicos' : 'Doctor Management'}</h3>
                      <input 
                        placeholder="Buscar medico..." 
                        style={{ ...inputStyle, width: '250px' }} 
                        onChange={(e) => setBusquedaAdmin(e.target.value)} 
                      />
                    </div>

                    {/* FORMULARIO DE CARGA (Aqui es donde cargas los nuevos) */}
                    <div style={{ backgroundColor: '#2a2a2a', padding: '20px', borderRadius: '15px', marginBottom: '30px', border: '1px solid #444' }}>
                      <h4 style={{ marginTop: 0 }}>{nuevoMedico.id ? 'Editar Medico' : 'Registrar Nuevo Medico'}</h4>
                      <form onSubmit={guardarMedico} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        <input 
                          placeholder={idioma === 'es' ? "Nombre Completo" : "Full Name"} 
                          style={inputStyle} 
                          value={nuevoMedico.nombre} 
                          onChange={(e) => setNuevoMedico({ ...nuevoMedico, nombre: e.target.value })} 
                          required 
                        />
                        <input 
                          placeholder={idioma === 'es' ? "Especialidad" : "Specialty"} 
                          style={inputStyle} 
                          value={nuevoMedico.especialidad} 
                          onChange={(e) => setNuevoMedico({ ...nuevoMedico, especialidad: e.target.value })} 
                          required 
                        />
                        <input 
                          placeholder={idioma === 'es' ? "Matricula" : "License Number"} 
                          style={inputStyle} 
                          value={nuevoMedico.matricula} 
                          onChange={(e) => setNuevoMedico({ ...nuevoMedico, matricula: e.target.value })} 
                          required 
                        />
                        <input 
                          placeholder={idioma === 'es' ? "Consultorio / Piso" : "Office / Floor"} 
                          style={inputStyle} 
                          value={nuevoMedico.consultorio} 
                          onChange={(e) => setNuevoMedico({ ...nuevoMedico, consultorio: e.target.value })} 
                        />
                        <input 
                          placeholder={idioma === 'es' ? "Telefono" : "Phone"} 
                          style={inputStyle} 
                          value={nuevoMedico.telefono} 
                          onChange={(e) => setNuevoMedico({ ...nuevoMedico, telefono: e.target.value })} 
                          required 
                        />

                        <div style={{ gridColumn: 'span 2', display: 'flex', gap: '10px' }}>
                          <button type="submit" style={{ ...btnLarge, flex: 1 }}>
                            {nuevoMedico.id ? (idioma === 'es' ? 'Actualizar' : 'Update') : (idioma === 'es' ? 'Registrar' : 'Register')}
                          </button>
          
                          {nuevoMedico.id && (
                            <button 
                              type="button" 
                              onClick={() => setNuevoMedico(MEDICO_INICIAL)} 
                              style={{ padding: '10px', background: '#444', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer' }}
                            >
                              {idioma === 'es' ? 'Cancelar' : 'Cancel'}
                            </button>
                          )}
                        </div>
                      </form>
                    </div>

                    {/* TABLA DE MEDICOS EXISTENTES */}
                    <table border="1" style={tableStyle}>
                      <thead>
                        <tr>
                          <th>{idioma === 'es' ? 'Medico' : 'Doctor'}</th>
                          <th>{idioma === 'es' ? 'Especialidad' : 'Specialty'}</th>
                          <th>{idioma === 'es' ? 'Consultorio' : 'Office'}</th>
                          <th>{idioma === 'es' ? 'Acciones' : 'Actions'}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {medicos
                          .filter(m => m.nombre.toLowerCase().includes(busquedaAdmin.toLowerCase()))
                          .map(m => (
                            <tr key={m.id}>
                              <td style={{ padding: '10px' }}>{m.nombre}</td>
                              <td>{m.especialidad}</td>
                              <td style={{ textAlign: 'center' }}>{m.consultorio || '--'}</td>
                              <td>
                                <button onClick={() => { setNuevoMedico(m); window.scrollTo(0,0); }} style={{ color: 'orange', marginRight: '10px', background: 'none', border: 'none', cursor: 'pointer' }}>Editar</button>
                                <button onClick={() => eliminarMedico(m.id)} style={{ color: 'red', background: 'none', border: 'none', cursor: 'pointer' }}>Eliminar</button>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* --- VISTA SALA DE ESPERA (MODO TV) --- */}
                {/* --- BUSCA ESTA PARTE EN TU App.jsx --- */}
                {vista === 'tv' && (
                  <section style={{ backgroundColor: '#000', minHeight: '100vh', padding: '40px', textAlign: 'center', color: 'white' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '25px' }}>
                      <button onClick={volverATurnosAdmin} style={backButtonStyle}>
                        {idioma === 'es' ? ' Volver a turnos' : ' Back to appointments'}
                      </button>
                    </div>
                    <h2 style={{ color: '#4CAF50', fontSize: '50px', marginBottom: '40px' }}>SALA DE ESPERA</h2>
    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', fontSize: '35px' }}>
                      <div style={{ borderBottom: '2px solid #444', color: '#aaa' }}>PACIENTE</div>
                      <div style={{ borderBottom: '2px solid #444', color: '#aaa' }}>CONSULTORIO</div>

                      {/* FILTRO FLEXIBLE: Solo por fecha de hoy */}
                      {turnos
                        .filter(t => {
                          // 1. Limpiamos la fecha que viene de la base de datos (t.fecha)
                          const fechaTurno = t.fecha ? t.fecha.split('T')[0] : "";
                          // 2. Limpiamos la fecha de hoy
                          const fechaHoy = hoy.split('T')[0];
    
                          // Solo mostramos si coinciden las fechas Y el estado es Confirmado o Atendido
                          return fechaTurno === fechaHoy && (t.estado === 'Confirmado' || t.estado === 'Atendido');
                        }) 
                        .map(t => (
                          <React.Fragment key={t.id}>
                            <div style={{ padding: '25px', borderBottom: '2px solid #222', fontSize: '30px', fontWeight: 'bold' }}>
                              {t.paciente} 
                            </div>
                            <div style={{ padding: '25px', borderBottom: '2px solid #222', color: '#4CAF50', fontSize: '30px', fontWeight: 'bold' }}>
                              {t.consultorio || 'S/D'}
                            </div>
                          </React.Fragment>
                        ))
                      }
                    </div>

                    {/* AVISO SI NO HAY NADA (Para que no se vea negro total) */}
                    {turnos.filter(t => t.fecha === hoy).length === 0 && (
                      <div style={{ marginTop: '100px', color: '#444' }}>
                        <h3>No hay turnos para la fecha: {hoy}</h3>
                      </div>
                    )}
                  </section>
                )}
            </div>
          </div>
        ) : mostrarVistaPaciente ? (
          <div>
            <div className="appointment-container">
                <div className="appointment-card">
                  <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-start' }}>
                    <button onClick={volverAlInicioPaciente} style={backButtonStyle}>
                      {idioma === 'es' ? ' Volver al inicio' : ' Back to home'}
                    </button>
                  </div>
                  <div>
                    <h2 style={{ marginTop: 0, marginBottom: '30px', color: '#4CAF50' }}>{`Hola, ${pacienteEncontrado?.nombre}`}</h2>
                    <h3 style={{ marginTop: 0, marginBottom: '20px' }}>Agendar Turno</h3>
                    <form onSubmit={guardarTurno} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                      <select onChange={e => setNuevoTurno({ ...nuevoTurno, medico_id: e.target.value })} required className="appointment-input">
                        <option value="">Con que medico?</option>
                        {medicos.map(m => (<option key={m.id} value={m.id} style={{ color: 'black' }}>{m.nombre} - {m.especialidad}</option>))}
                      </select>
                      <input type="date" min={hoy} onChange={e => setNuevoTurno({ ...nuevoTurno, fecha: e.target.value })} required className="appointment-input" />
                      <input type="time" min="08:00" max="20:00" onChange={e => setNuevoTurno({ ...nuevoTurno, hora: e.target.value })} required className="appointment-input" />
                      <input placeholder="Motivo" onChange={e => setNuevoTurno({ ...nuevoTurno, motivo: e.target.value })} required className="appointment-input" />
                      <button type="submit" className="appointment-btn">Confirmar</button>
                    </form>
                  </div>
                  <div>
                    <h3 style={{ marginTop: 0, marginBottom: '20px' }}>Mis Turnos</h3>
                    <div className="appointment-list">
                      {turnos.filter(t => Number(t.paciente_id) === Number(pacienteEncontrado?.id)).length > 0 ? (
                        turnos.filter(t => Number(t.paciente_id) === Number(pacienteEncontrado?.id)).map(t => (
                          <div key={t.id} className="appointment-item">
                            <p className="appointment-item-date"> {t.fecha} - {t.hora}hs</p>
                            <p className="appointment-item-doc"> Dr. {t.medico}</p>
                            {t.consultorio && (
                              <p style={{ color: '#4CAF50', fontSize: '12px' }}>
                                 Consultorio: {t.consultorio}
                              </p>
                            )}
                            <p className="appointment-item-status">Estado: {t.estado || 'Pendiente'}</p>
                          </div>
                        ))
                      ) : (
                        <p style={{ color: '#aaa', textAlign: 'center' }}>Sin turnos agendados</p>
                      )}
                    </div>
                  </div>
                </div>
            </div>
          </div>
        ) : null}
      </div>
    </>
  )
}




export default App;
