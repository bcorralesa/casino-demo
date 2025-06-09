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
    //navigate('/result', { state: { ageOver18: ageOk } });
    navigate('/verified', { state: { ageOver18: ageOk } });
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
      {loading && <p style={{ fontSize: '1.2rem' }}>Verifying age… please wait</p>}
      {error   && <p className="error">Error: {error}</p>}

      {/* Cuando ya no estás cargando, no hay error, tienes id y es desktop */}
      {!loading && !error && id && !isMobile && (
        <div style={{ textAlign: 'center' }}>
          <p style={{ marginBottom: '1rem' }}>
            Scan with your mobile to continue:
          </p>
          <QRCodeCanvas value={`idverifier://?id=${id}`} size={400} />
          +   <p style={{
     marginTop: '1rem',
     fontSize: '0.9rem',
     color: 'var(--color-text)'
   }}>
     Do not close this page; once you complete the process on your mobile,<br/>
     the flow will automatically continue here.
 </p>
        </div>
      )}
    </div>
  );
}
