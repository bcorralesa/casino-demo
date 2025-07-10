import { useState, useEffect, useRef, useCallback } from "react";
import type {
  StartPayload,
  StartResponse,
  VerificationEventDetail,
} from "../types/verification";

const SUBS_KEY = import.meta.env.VITE_SUBS_KEY!;

// En local dev usamos el proxy de Vite; en prod llamamos a nuestra Azure Function
const POST_URL = import.meta.env.DEV
  ? "/api/idv/idvpayload"
  : "/api/verify-age";
const GET_URL = (respId: string) =>
  import.meta.env.DEV
    ? `/api/idv/idvpayload/${respId}`
    : `/api/verify-age/${respId}`;

export function useAgeVerification() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [id, setId] = useState<string | null>(null);
  const respIdRef = useRef<string | null>(null);

  // useCallback para que startVerification no cambie en cada render
  const startVerification = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const payload: StartPayload = {
        documentVerification: {
          portraitLivenessPassive: "RG", // o "NT" según tu lógica
          // Aquí puedes cambiar a false si quieres simular un menor de edad
          ageOver18: true,
        },
      };
      const res = await fetch(POST_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Ocp-Apim-Subscription-Key": SUBS_KEY,
        },
        body: JSON.stringify({ payload }),
      });
      if (!res.ok) throw new Error(`POST failed: ${res.status}`);
      const json = (await res.json()) as StartResponse;
      setId(json.id);
      respIdRef.current = json.responseId;
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Si no hemos iniciado, no hacemos polling
    if (!respIdRef.current) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(GET_URL(respIdRef.current!), {
          headers: { "Ocp-Apim-Subscription-Key": SUBS_KEY },
        });
        if (res.status === 404) return; // aún pendiente → seguimos esperando
        clearInterval(interval);
        if (!res.ok) throw new Error(`GET failed: ${res.status}`);
        const detail = (await res.json()) as VerificationEventDetail;
        // Emitimos un evento con los resultados
        window.dispatchEvent(
          new CustomEvent<VerificationEventDetail>("ageVerificationResult", {
            detail,
          })
        );
      } catch (err) {
        clearInterval(interval);
        setError((err as Error).message);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [id]);

  return { startVerification, loading, error, id };
}
