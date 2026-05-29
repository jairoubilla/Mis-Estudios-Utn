export const btnLarge = { padding: '15px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' };
export const inputStyle = {
  padding: '12px',
  borderRadius: '10px',
  border: '1px solid rgba(76, 175, 80, 0.18)',
  backgroundColor: '#fff',
  color: '#000',
  boxShadow: '0 10px 22px rgba(0, 0, 0, 0.18), 0 0 16px rgba(76, 175, 80, 0.08)'
};
export const btnTab = (active) => ({ padding: '10px 20px', cursor: 'pointer', backgroundColor: active ? '#4CAF50' : '#333', color: 'white', border: 'none', marginRight: '5px', borderRadius: '5px' });
export const tableStyle = { width: '100%', borderCollapse: 'collapse', textAlign: 'left', backgroundColor: '#333' };
export const formStyle = { display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' };
export const cardStyle = { backgroundColor: '#2a2a2a', padding: '15px', borderRadius: '10px', textAlign: 'center', flex: '1' };

export const containerLoginStyle = { display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' };
export const cardLoginStyle = { backgroundColor: 'rgba(42, 42, 42, 0.8)', padding: '40px', borderRadius: '25px', maxWidth: '400px', width: '100%', boxShadow: '0 20px 40px rgba(0,0,0,0.7)', textAlign: 'center', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' };
export const inputLoginStyle = { width: '100%', padding: '15px', marginBottom: '20px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.2)', backgroundColor: 'rgba(26,26,26,0.8)', color: 'white', fontSize: '16px', textAlign: 'center', outline: 'none', transition: 'border-color 0.3s ease', ':focus': { borderColor: '#4CAF50', boxShadow: '0 0 10px rgba(76, 175, 80, 0.5)' } };
export const btnIngresarStyle = { width: '100%', padding: '15px', background: 'linear-gradient(45deg, #4CAF50, #66BB6A)', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', transition: 'transform 0.2s ease, box-shadow 0.2s ease', ':hover': { transform: 'translateY(-2px)', boxShadow: '0 5px 15px rgba(76, 175, 80, 0.4)' } };

export const selectEstadoStyle = (estado) => ({
  padding: '6px 10px', borderRadius: '20px', border: 'none', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', color: 'white',
  backgroundColor: estado === 'Confirmado' ? '#2e7d32' : estado === 'Atendido' ? '#1565c0' : estado === 'Cancelado' ? '#c62828' : '#666'
});
