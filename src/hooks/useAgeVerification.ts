// src/hooks/useAgeVerification.ts
import { useState, useEffect, useRef } from "react";
import type {
  StartPayload,
  StartResponse,
  VerificationEventDetail,
} from "../types/verification";

const SUBS_KEY = import.meta.env.VITE_SUBS_KEY!;
const POST_URL = "/api/idv/idvpayload";
const GET_URL = (respId: string) => `/api/idv/idvpayload/${respId}`;

export function useAgeVerification() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [id, setId] = useState<string | null>(null);
  const respIdRef = useRef<string | null>(null);

  const startVerification = async () => {
    setLoading(true);
    setError(null);

    try {
      const payload: StartPayload = {
        documentVerification: {
          portraitLivenessPassive: "NT",
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
      if (!res.ok) throw new Error(`POST fallo: ${res.status}`);
      const json = (await res.json()) as StartResponse;
      setId(json.id);
      respIdRef.current = json.responseId;
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError(String(e));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!respIdRef.current) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(GET_URL(respIdRef.current!), {
          headers: { "Ocp-Apim-Subscription-Key": SUBS_KEY },
        });
        if (res.status === 404) return;
        clearInterval(interval);
        if (!res.ok) throw new Error(`GET fallo: ${res.status}`);
        const detail = (await res.json()) as VerificationEventDetail;
        window.dispatchEvent(
          new CustomEvent<VerificationEventDetail>("ageVerificationResult", {
            detail,
          })
        );
      } catch (e: unknown) {
        clearInterval(interval);
        if (e instanceof Error) setError(e.message);
        else setError(String(e));
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [id]);

  return { startVerification, loading, error, id };
}
