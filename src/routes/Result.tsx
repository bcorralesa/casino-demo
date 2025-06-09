import { useLocation, useNavigate } from 'react-router-dom';

type LocationState = { ageOver18: boolean };

export default function Result() {
  const { state } = useLocation() as { state?: LocationState };
  const navigate = useNavigate();

  if (state?.ageOver18) {
    window.location.replace('https://www.yocasino.es/');
    return null;
  }

  return (
    <div className="container">
      <div style={{
        background: 'var(--color-bg)',
        padding: '2rem',
        borderRadius: 'var(--radius)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        textAlign: 'center'
      }}>
        <h2 style={{ color: 'var(--color-primary)', marginBottom: '1rem' }}>
          Sorry
        </h2>
        <p style={{ marginBottom: '2rem' }}>
          You do not meet the minimum age requirement to enter.
        </p>
        <button className="btn-secondary" onClick={() => navigate('/')}>
          Try Again
        </button>
      </div>
    </div>
  );
}
