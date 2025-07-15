// src/routes/Result.tsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/idverifier-logo.png";
import "../styles/PageWithBackground.css";

type LocationState = {
  ageOver18: boolean;
  similarityScore?: number; // ya normalizado como porcentaje 0–100
};

export default function Result() {
  const { state } = useLocation() as { state?: LocationState };
  const navigate = useNavigate();

  // fuerza 0 si no viene
  const pct = state?.similarityScore ?? 0;

  // 1) Caso éxito completo: over-18 y pct>80 → al casino
  if (state?.ageOver18 && pct > 80) {
    window.location.replace("https://www.yocasino.es/");
    return null;
  }

  // 2) Under-age
  const isUnderAge = state?.ageOver18 === false;
  // 3) Over-age pero liveness FAIL
  // const isLivenessFail = state?.ageOver18 === true && pct <= 80;
  const isLivenessFail = pct <= 80;
  // Ahora mostramos la UI según cada uno de los dos errores
  return (
    <div className="page-wrapper">
      <div className="background-image" />
      <div className="modal">
        <img src={logo} alt="ID Verifier" className="logo" />

        <h2 style={{ marginBottom: "1rem", color: "var(--color-primary)" }}>
          {isUnderAge ? "Sorry" : "Liveness Check Failed"}
        </h2>

        <p style={{ marginBottom: "2rem" }}>
          {isUnderAge
            ? "You do not meet the minimum age required to enter."
            : "The document you scanned does not match the person using it."}
        </p>

        {isLivenessFail && (
          <p style={{ marginBottom: "1rem" }}>
            Your similarity score was: <strong>{pct.toFixed(2)}%</strong>
          </p>
        )}

        <button className="btn-secondary" onClick={() => navigate("/")}>
          Try Again
        </button>
      </div>
    </div>
  );
}
