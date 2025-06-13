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

  // Kick off the POST as soon as we mount
  useEffect(() => {
    startVerification();
  }, [startVerification]);

  // Listen for our custom event, typed as VerificationEventDetail
  useEffect(() => {
    function handler(evt: Event) {
      const e = evt as CustomEvent<VerificationEventDetail>;
      const { ageOver18, portraitLivenessPassive } =
        e.detail.documentVerificationResults;
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
    }

    window.addEventListener("ageVerificationResult", handler);
    return () => {
      window.removeEventListener("ageVerificationResult", handler);
    };
  }, [navigate]);

  if (loading) {
    return (
      <div className="modal">
        <p>Loading… please wait</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="modal">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="background-image" />

      <div className="modal">
        {/* 1. Logo de ID Verifier */}
        <img
          src={logo}
          alt="ID Verifier"
          className="logo"
          style={{ marginBottom: "1rem" }}
        />

        {/* 2. Título */}
        <h3 style={{ marginBottom: "1rem" }}>
          Scan with your mobile to continue:
        </h3>

        {id ? (
          <>
            {/* Spacer */}
            <div style={{ height: 16 }} />

            {/* 3. QR code */}
            <QRCodeCanvas
              value={`idverifier://?id=${id}`}
              size={300}
              level="M"
              includeMargin={true}
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
