// src/hooks/useAgeVerification.ts
import { useState, useEffect, useRef } from 'react';

const SUBS_KEY = import.meta.env.VITE_SUBS_KEY!;
const DEV_PROXY   = '/api';
const PROD_BASE   = import.meta.env.VITE_APIM_BASE;
const API_BASE    = import.meta.env.DEV
  ? DEV_PROXY
  : PROD_BASE;

const POST_URL = `${API_BASE}/idv/idvpayload`;
const GET_URL  = (r: string) => `${API_BASE}/idv/idvpayload/${r}`;

export function useAgeVerification() {
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string|null>(null);
  const [id,      setId]      = useState<string|null>(null);
  const respIdRef = useRef<string|null>(null);

  const startVerification = async () => {
    setLoading(true);
    try {
      const res = await fetch(POST_URL, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Ocp-Apim-Subscription-Key': import.meta.env.VITE_SUBS_KEY
  },
  body: JSON.stringify({ payload: { documentVerification: { ageOver18: true } } })
});
      if (!res.ok) throw new Error(`POST fallido: ${res.status}`);
      const json = await res.json() as { id: string; responseId: string };
      setId(json.id);                            // guardamos el id
      respIdRef.current = json.responseId;       // guardamos el responseId
      setLoading(false);                         // ¡importantísimo parar loading!
    } catch (e: any) {
      setError(e.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!respIdRef.current) return;
    const interval = setInterval(async () => {
      try {
        const url = GET_URL(respIdRef.current!);
        const res = await fetch(
         url,
          { headers: { 'Ocp-Apim-Subscription-Key': SUBS_KEY } }
        );
        if (res.status === 404) return;
        clearInterval(interval);
        if (!res.ok) throw new Error(`GET fallido: ${res.status}`);
        const result = await res.json();
        window.dispatchEvent(
          new CustomEvent('ageVerificationResult', { detail: result })
        );
      } catch (e: any) {
        clearInterval(interval);
        setError(e.message);
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [id]);

  return { startVerification, loading, error, id };
}
