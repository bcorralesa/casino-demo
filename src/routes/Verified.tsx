// src/routes/Verified.tsx
import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import logo from '../assets/idverifier-logo.png'
import '../styles/PageWithBackground.css'

type LocationState = {
  ageOver18: boolean
  similarityScore?: number
}

export default function Verified() {
  const { state } = useLocation() as { state?: LocationState }
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setTimeout(() => {
      if (state?.ageOver18) {
        window.location.replace('https://www.yocasino.es/')
      } else {
        navigate('/result', { replace: true })
      }
    }, 2500)
    return () => clearTimeout(timer)
  }, [state, navigate])

  // Si no tenemos state, volvemos al inicio
  if (!state) {
    navigate('/', { replace: true })
    return null
  }

  return (
    <div className="page-wrapper">
      <div className="background-image" />

      <div className="modal">
        <img src={logo} alt="ID Verifier" className="logo" />
        <h2 style={{ marginBottom: '1rem', color: 'var(--color-primary)' }}>
          Age Verified
        </h2>

        <p style={{ marginBottom: '1rem' }}>
          Your age has been successfully verified!<br/>
          Redirecting you now… please wait.
        </p>

        {typeof state.similarityScore === 'number' && (
          <p style={{ marginBottom: '1rem' }}>
            Your liveness similarity score was{' '}
            <strong>{state.similarityScore.toFixed(2)}%</strong>.
          </p>
        )}
      </div>
    </div>
  )
}
