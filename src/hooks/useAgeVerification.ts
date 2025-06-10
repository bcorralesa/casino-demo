// src/hooks/useAgeVerification.ts
import { useState, useEffect, useRef } from 'react';

// Subscription key (always injected by Vite in both envs)
const SUBS_KEY = import.meta.env.VITE_SUBS_KEY!;

// POST goes to Vite proxy in dev, to your Function in prod
const POST_URL = import.meta.env.DEV
  ? '/api/idv/idvpayload'
  : '/api/verify-age';

// GET polling uses the Vite proxy in dev, the real APIM in prod
const GET_URL = (respId: string) =>
  import.meta.env.DEV
    ? `/api/idv/idvpayload/${respId}`                             // dev proxy
    : `${import.meta.env.VITE_APIM_BASE}/idv/idvpayload/${respId}`; // prod APIM

export function useAgeVerification() {
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string|null>(null);
  const [id,      setId]      = useState<string|null>(null);
  const respIdRef = useRef<string|null>(null);

  const startVerification = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(POST_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Ocp-Apim-Subscription-Key': SUBS_KEY,
        },
        body: JSON.stringify({
          payload: { documentVerification: { ageOver18: true } }
        }),
      });

      if (!res.ok) throw new Error(`POST failed: ${res.status}`);

      const json = (await res.json()) as { id: string; responseId: string };
      setId(json.id);
      respIdRef.current = json.responseId;
      setLoading(false);
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
        const res = await fetch(url, {
          headers: { 'Ocp-Apim-Subscription-Key': SUBS_KEY }
        });

        // Still pending
        if (res.status === 404) return;

        clearInterval(interval);
        if (!res.ok) throw new Error(`GET failed: ${res.status}`);

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
