// src/routes/AgeVerification.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import { useAgeVerification } from "../hooks/useAgeVerification";
import logo from "../assets/idverifier-logo.png";
import "../styles/PageWithBackground.css";
import type { VerificationEventDetail } from "../types/verification";

export default function AgeVerification() {
  const { startVerification, loading, error, id } = useAgeVerification();
  const navigate = useNavigate();

  // Detectamos si estamos en un dispositivo móvil
  const isMobile = /Mobi|Android|iPhone|iPad|iPod/.test(navigator.userAgent);

  // 1️⃣ Arrancamos la verificación al montar
  useEffect(() => {
    startVerification();
  }, [startVerification]);

  // 2️⃣ Si obtenemos un ID y estamos en móvil, lanzamos el deep link
  useEffect(() => {
    if (id && isMobile) {
      window.location.href = `idverifier://?id=${id}`;
    }
  }, [id, isMobile]);

  // 3️⃣ Nos suscribimos al resultado de la verificación
  useEffect(() => {
    const handler = (e: Event) => {
      const custom = e as CustomEvent<VerificationEventDetail>;
      const { ageOver18, portraitLivenessPassive } =
        custom.detail.documentVerificationResults;
      const similarity = portraitLivenessPassive.similarityScore;
      const liveOk = similarity > 80;

      if (ageOver18 && liveOk) {
        navigate("/verified", {
          state: { ageOver18, similarityScore: similarity },
        });
      } else {
        navigate("/result", {
          state: { ageOver18, similarityScore: similarity },
        });
      }
    };

    window.addEventListener("ageVerificationResult", handler);
    return () => window.removeEventListener("ageVerificationResult", handler);
  }, [navigate]);

  // 4️⃣ Estados intermedios
  if (loading)
    return (
      <div className="modal">
        <p>Loading… please wait</p>
      </div>
    );
  if (error)
    return (
      <div className="modal">
        <p>Error: {error}</p>
      </div>
    );

  // 5️⃣ Render para desktop (o fallback móvil si no abrió el deep-link)
  return (
    <div className="page-wrapper">
      <div className="background-image" />

      <div className="modal">
        {/* Logo */}
        <img src={logo} alt="ID Verifier" className="logo" />

        {/* Título */}
        <h3 style={{ margin: "1rem 0" }}>Scan with your mobile to continue:</h3>

        {id ? (
          <>
            {/* Solo para desktop mostramos el QR */}
            {!isMobile && (
              <>
                <div style={{ height: 16 }} />
                <QRCodeCanvas
                  value={`idverifier://?id=${id}`}
                  size={300}
                  level="M"
                  includeMargin
                />
                <p style={{ marginTop: "1rem" }}>
                  <strong>Do not close this page</strong>, your age verification
                  will resume here.
                </p>
                <button
                  className="btn-secondary"
                  style={{ marginTop: "1rem" }}
                  onClick={() => navigate("/")}
                >
                  Return
                </button>
              </>
            )}

            {/* En móvil, si por algún motivo el esquema no abre, ofrecemos fallback */}
            {isMobile && (
              <p style={{ marginTop: "1rem" }}>
                If the ID Verifier app didn’t open automatically, please scan
                this QR code with any QR-scanner.
              </p>
            )}
          </>
        ) : (
          <p>Preparing your verification…</p>
        )}
      </div>
    </div>
  );
}
