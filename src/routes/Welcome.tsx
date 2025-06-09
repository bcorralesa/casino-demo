import { useNavigate } from 'react-router-dom';
import logo from '../assets/idverifier-logo.png';  // ① importa tu imagen

export default function Welcome() {
  const navigate = useNavigate();
  return (
    <div className="container">
      {/* ② logo centrado */}
      <img src={logo} alt="ID Verifier" className="logo" />

      {/* ③ título centrado */}
      <h1 className="text-center" style={{ fontSize: '2rem', marginBottom: '1rem' }}>
        ¡Bienvenido a YoCasino!
      </h1>

      <p className="text-center" style={{ marginBottom: '2rem' }}>
        Para continuar, por favor verifica tu edad.
      </p>
      <button className="btn-primary" onClick={() => navigate('/verify')}>
        Continuar
      </button>
    </div>
  );
}
