import { useLocation, useNavigate } from 'react-router-dom'
import logo from '../assets/idverifier-logo.png'
import '../styles/PageWithBackground.css'

type LocationState = { similarityScore: number }

export default function LivenessError() {
  const { state } = useLocation() as { state?: LocationState }
  const navigate = useNavigate()

  if (!state) {
    navigate('/', { replace: true })
    return null
  }

  const { similarityScore } = state

  return (
    <div className="page-wrapper">
      <div className="background-image" />

      <div className="modal">
        <img src={logo} alt="ID Verifier" className="logo" />
        <h2 style={{ marginBottom: '1rem', color: 'var(--color-primary)' }}>
          Verification Failed
        </h2>
        <p style={{ marginBottom: '1rem' }}>
          The document does not appear to belong to you.
        </p>
        <p style={{ marginBottom: '2rem' }}>
          Your liveness similarity score was{' '}
          <strong>{similarityScore.toFixed(2)}%</strong>, which is below the{' '}
          <strong>80%</strong> threshold.
        </p>
        <button className="btn-secondary" onClick={() => navigate('/')}>
          Try Again
        </button>
      </div>
    </div>
  )
}
// This component handles the case where the liveness check fails
// due to a low similarity score, indicating the document does not match the user.