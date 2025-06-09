// src/routes/AgeVerification.tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAgeVerification } from '../hooks/useAgeVerification';
import { QRCodeCanvas } from 'qrcode.react';

export default function AgeVerification() {
  const { startVerification, loading, error, id } = useAgeVerification();
  const navigate = useNavigate();
  const isMobile = /Mobi|Android|iPhone|iPad|iPod/.test(navigator.userAgent);

  useEffect(() => {
    startVerification();
    const handler = (e: CustomEvent) => {
    const ageOk = e.detail.documentVerificationResults.ageOver18;
    navigate('/result', { state: { ageOver18: ageOk } });
    };
    window.addEventListener('ageVerificationResult', handler as any);
    return () => window.removeEventListener('ageVerificationResult', handler as any);
  }, []);

  useEffect(() => {
    if (!id || !isMobile) return;
    window.location.href = `idverifier://?id=${id}`;
  }, [id]);

  return (
    <div className="container">
      {loading && <p style={{ fontSize: '1.2rem' }}>Verificando edad… espera un momento</p>}
      {error   && <p className="error">Error: {error}</p>}

      {/* Cuando ya no estás cargando, no hay error, tienes id y es desktop */}
      {!loading && !error && id && !isMobile && (
        <div style={{ textAlign: 'center' }}>
          <p style={{ marginBottom: '1rem' }}>
            Escanea con tu móvil para continuar:
          </p>
          <QRCodeCanvas value={`idverifier://?id=${id}`} size={200} />
        </div>
      )}
    </div>
  );
}
