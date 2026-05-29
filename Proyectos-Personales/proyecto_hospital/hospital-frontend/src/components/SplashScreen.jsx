import React from 'react';

const SplashScreen = () => (
  <div style={{
    position: 'fixed',
    top: 0, left: 0, width: '100%', height: '100%',
    background: 'radial-gradient(circle at center, #0f0f0f 0%, #1a1a1a 30%, #2a2a2a 70%, #0f0f0f 100%)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
    overflow: 'hidden'
  }}>
    {/* Partículas animadas de fondo */}
    <div style={{
      position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
      backgroundImage: 'radial-gradient(circle at 20% 80%, #4CAF50 1px, transparent 1px), radial-gradient(circle at 80% 20%, #66BB6A 1px, transparent 1px), radial-gradient(circle at 40% 40%, #4CAF50 1px, transparent 1px)',
      backgroundSize: '100px 100px, 150px 150px, 200px 200px',
      animation: 'moveParticles 20s linear infinite'
    }}></div>

    <div style={{
      fontSize: '90px',
      fontWeight: 'bold',
      color: '#4CAF50',
      letterSpacing: '8px',
      animation: 'bounceIn 2s ease-out, glow 2s infinite alternate, rotateSlow 15s linear infinite',
      textShadow: '0 0 30px #4CAF50, 0 0 60px #4CAF50',
      zIndex: 1
    }}>
      AI TURNOS
    </div>
    <div style={{
      fontSize: '35px',
      fontWeight: 'bold',
      color: '#fff',
      letterSpacing: '3px',
      marginTop: '25px',
      animation: 'slideUp 1.5s ease-out 0.5s both, fadeInOut 4s infinite 2s, colorChange 6s infinite',
      zIndex: 1
    }}>
      Hospital Regional Malargüe
    </div>
    <div style={{
      width: '400px',
      height: '8px',
      background: 'linear-gradient(90deg, #4CAF50, #66BB6A, #4CAF50, #66BB6A)',
      borderRadius: '4px',
      marginTop: '40px',
      animation: 'expandWidth 1s ease-out 1s both, pulseBar 3s infinite 2s, rainbow 5s infinite',
      zIndex: 1
    }}></div>
    <div style={{
      marginTop: '50px',
      fontSize: '20px',
      color: '#aaa',
      animation: 'fadeIn 2s ease-out 1.5s both, blink 2s infinite 3s',
      zIndex: 1
    }}>
      Inicializando sistema médico...
    </div>
    <div style={{
      position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)',
      fontSize: '14px', color: '#666',
      animation: 'fadeIn 3s ease-out 2s both',
      zIndex: 1
    }}>
      Powered by AI Technology
    </div>
  </div>
);

export default SplashScreen;