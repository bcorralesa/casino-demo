// src/routes/AgeVerification.tsx
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAgeVerification } from '../hooks/useAgeVerification'
import { QRCodeCanvas } from 'qrcode.react'
import logo from '../assets/idverifier-logo.png'
import '../styles/PageWithBackground.css'

export default function AgeVerification() {
  const { startVerification, loading, error, id } = useAgeVerification()
  const navigate = useNavigate()
  const [detail, setDetail] = useState<any>(null)

  useEffect(() => {
    startVerification()
    const handler = (e: any) => {
      setDetail(e.detail)
      const ageOk = e.detail.documentVerificationResults.ageOver18
      if (ageOk) navigate('/verified', { state: { ageOver18: ageOk } })
      else     navigate('/result',   { state: { ageOver18: ageOk } })
    }
    window.addEventListener('ageVerificationResult', handler)
    return () => window.removeEventListener('ageVerificationResult', handler)
  }, [])

  const isMobile = /Mobi|Android|iPhone|iPad|iPod/.test(navigator.userAgent)
  useEffect(() => {
    if (id && isMobile) window.location.href = `idverifier://?id=${id}`
  }, [id])

  // **Reload after 60s** if still on this page
  useEffect(() => {
    const timer = setTimeout(() => {
      window.location.reload()
    }, 60_000) // 60,000 ms = 60 s
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="page-wrapper">
      <div className="background-image" />

      <div className="modal">
        <img src={logo} alt="ID Verifier" className="logo" />
        {loading && <p>Verifying age… please wait</p>}
        {error   && <p className="error">Error: {error}</p>}
        {!loading && !error && id && !isMobile && (
          <>
            <p>Scan with your mobile to continue:</p>
            <div style={{ height: '1rem' }} />
            <QRCodeCanvas value={`idverifier://?id=${id}`} size={300} />
            <p style={{ marginTop: '1rem', fontSize:'0.9rem' }}>
              <strong>Do not close this page</strong> <br/> 
              Once you complete the process on your mobile,<br/>
              the flow will automatically continue here.
            </p>
                        {/* ← New Return button */}
            <button
              className="btn-secondary"
              style={{ marginTop: '2rem' }}
              onClick={() => navigate('/')}
            >
              Return
            </button>
          </>
        )}
      </div>
    </div>
  )
}
