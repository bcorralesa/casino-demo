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

  // Arrancamos la verificación al montar
  useEffect(() => {
    startVerification();
  }, [startVerification]);

  // Escuchamos el evento que dispara useAgeVerification cuando acaba el polling
  useEffect(() => {
    const handler = (e: Event) => {
      const custom = e as CustomEvent<VerificationEventDetail>;
      const results = custom.detail.documentVerificationResults;
      const ageOk = results.ageOver18;
      const similarity = results.portraitLivenessPassive.similarityScore;
      const liveOk = similarity > 80;

      if (ageOk && liveOk) {
        navigate("/verified", {
          state: { ageOver18: ageOk, similarityScore: similarity },
        });
      } else {
        navigate("/result", {
          state: { ageOver18: ageOk, similarityScore: similarity },
        });
      }
    };
    window.addEventListener("ageVerificationResult", handler);
    return () => window.removeEventListener("ageVerificationResult", handler);
  }, [navigate]);

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

  return (
    <div className="page-wrapper">
      <div className="background-image" />

      <div className="modal">
        {/* 1️⃣ Logo */}
        <img src={logo} alt="ID Verifier" className="logo" />

        {/* 2️⃣ Título */}
        <h3 style={{ margin: "1rem 0" }}>Scan with your mobile to continue:</h3>

        {id ? (
          <>
            {/* Espacio extra */}
            <div style={{ height: 16 }} />

            {/* 3️⃣ QR code */}
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
        ) : (
          <p>Preparing your verification…</p>
        )}
      </div>
    </div>
  );
}
