// src/routes/Result.tsx
import { useLocation, useNavigate } from 'react-router-dom'
import logo from '../assets/idverifier-logo.png'
import '../styles/PageWithBackground.css'

type LocationState = { ageOver18: boolean }

export default function Result() {
  const { state } = useLocation() as { state?: LocationState }
  const navigate = useNavigate()

  if (state?.ageOver18) {
    window.location.replace('https://www.yocasino.es/')
    return null
  }

  return (
    <div className="page-wrapper">
      <div className="background-image" />

      <div className="modal">
        <img src={logo} alt="ID Verifier" className="logo" />
        <h2 style={{ marginBottom: '1rem', color: 'var(--color-primary)' }}>
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
  )
}
