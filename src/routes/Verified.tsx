// src/routes/Verified.tsx
import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import logo from '../assets/idverifier-logo.png'
import '../styles/PageWithBackground.css'

export default function Verified() {
  const { state } = useLocation() as { state?: { ageOver18: boolean } }
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

  return (
    <div className="page-wrapper">
      <div className="background-image" />

      <div className="modal">
        <img src={logo} alt="ID Verifier" className="logo" />
        <h2 style={{ marginBottom: '1rem', color: 'var(--color-primary)' }}>
          Age Verified
        </h2>
        <p>Your age has been successfully verified!<br/>
           Redirecting you now… please wait.
        </p>
      </div>
    </div>
  )
}
