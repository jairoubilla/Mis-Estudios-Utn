import React, { useState } from 'react';
import API_ENDPOINTS from '../../config/api.config';
import LanguageSelector from '../LanguageSelector';
import logoAITurnos from '../../assets/logo.png';
import { setToken } from '../../lib/auth';
import '../../login.css';

const AdminLogin = ({ setRol, setAutenticado, idioma, setIdioma, volverAlInicio }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!username.trim() || !password.trim()) {
      setError(idioma === 'es' ? 'Completa usuario y contrasena' : 'Fill in username and password');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(API_ENDPOINTS.LOGIN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        setToken(data.access_token);
        setRol('admin');
        setAutenticado(true);
        setUsername('');
        setPassword('');
      } else {
        setError(idioma === 'es' ? 'Credenciales invalidas' : 'Invalid credentials');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(idioma === 'es' ? 'Error de conexion' : 'Connection error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container admin-container">
      <div className="login-background">
        <span className="login-orb login-orb--one" />
        <span className="login-orb login-orb--two" />
        <span className="login-orb login-orb--three" />
        <span className="login-grid" />
      </div>

      <div className="login-shell login-shell--admin">
        <section className="login-showcase admin-showcase">
          <div className="login-showcase-top">
            <span className="login-chip">
              {idioma === 'es' ? 'Acceso administrativo' : 'Administrative access'}
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
            <h1 className="login-title">
              {idioma === 'es' ? 'Acceso administrativo' : 'Administrative access'}
            </h1>
            <p className="login-description">
              {idioma === 'es'
                ? 'Credenciales del sistema.'
                : 'System credentials.'}
            </p>
          </div>
        </section>

        <section className="login-card admin-card">
          <div className="login-card-inner">
            <div className="login-card-header">
              <span className="login-card-badge">
                {idioma === 'es' ? 'Validacion interna' : 'Internal validation'}
              </span>
              <h3>{idioma === 'es' ? 'Iniciar sesion' : 'Sign in'}</h3>
            </div>

            <form onSubmit={handleLogin} className="login-flow">
              <input
                type="text"
                placeholder={idioma === 'es' ? 'Usuario' : 'Username'}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="login-input admin-input"
              />

              <input
                type="password"
                placeholder={idioma === 'es' ? 'Contrasena' : 'Password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="login-input admin-input"
              />

              {error && <p className="login-error-banner">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="login-btn login-btn--primary admin-btn"
              >
                {loading
                  ? (idioma === 'es' ? 'Ingresando...' : 'Signing in...')
                  : (idioma === 'es' ? 'Entrar al panel' : 'Enter dashboard')}
              </button>

              <button
                type="button"
                onClick={() => (volverAlInicio ? volverAlInicio() : setRol(null))}
                className="login-back-btn"
              >
                {idioma === 'es' ? 'Volver al inicio' : 'Back to home'}
              </button>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminLogin;
