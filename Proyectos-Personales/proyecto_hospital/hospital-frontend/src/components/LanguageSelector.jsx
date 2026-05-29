import React from 'react';
import '../login.css';

const LanguageSelector = ({ idioma, setIdioma }) => (
  <div className="language-selector">
    <button
      type="button"
      onClick={() => setIdioma('es')}
      className={`language-btn ${idioma === 'es' ? 'language-btn--active' : ''}`}
    >
      ES
    </button>
    <button
      type="button"
      onClick={() => setIdioma('en')}
      className={`language-btn ${idioma === 'en' ? 'language-btn--active' : ''}`}
    >
      EN
    </button>
  </div>
);

export default LanguageSelector;
