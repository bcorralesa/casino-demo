import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

export default function Verified() {
  const navigate = useNavigate()
  // Recuperamos el estado que pasamos desde AgeVerification
  const { state } = useLocation() as { state?: { ageOver18: boolean } }

  useEffect(() => {
    // En 2.5 segundos redirigimos según resultado
    const timer = setTimeout(() => {
      if (state?.ageOver18) {
        // Si es mayor, vamos al casino real
        window.location.replace('https://www.yocasino.es/')
      } else {
        // Si no, volvemos a la pantalla de “denegado”
        navigate('/result', { replace: true })
      }
    }, 2500)

    return () => clearTimeout(timer)
  }, [state, navigate])

  return (
    <div className="container">
      <h2 style={{ color: 'var(--color-primary)', marginBottom: '1rem' }}>
        Age Verified
      </h2>
      <p>
        Your age has been successfully verified!<br/>
        Redirecting you now… please wait
      </p>
    </div>
  )
}
