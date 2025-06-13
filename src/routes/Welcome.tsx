// src/routes/Welcome.tsx
import { useNavigate } from "react-router-dom";
import "../styles/WelcomeModal.css";
import logo from "../assets/idverifier-logo.png";

export default function Welcome() {
  const navigate = useNavigate();
  return (
    <div className="welcome-wrapper">
      {/* Fondo con imagen responsive */}
      <div className="background-image" />

      {/* Tu modal encima */}
      <div className="modal">
        <img src={logo} alt="ID Verifier" className="logo" />
        <h1 style={{ margin: "1rem 0" }}>Welcome to YoCasino!</h1>
        <p style={{ marginBottom: "2rem" }}>
          To continue, please verify your age.
        </p>
        <button className="btn-primary" onClick={() => navigate("/verify")}>
          Continue
        </button>
      </div>
    </div>
  );
}
