// src/types/verification.ts

// Ahora el payload acepta sólo estas dos opciones:
export type LivenessMode = "NT" | "RG";

// Payload que enviamos al POST
export interface StartPayload {
  documentVerification: {
    portraitLivenessPassive: "NT" | "RG";
    ageOver18: boolean;
  };
}

// Respuesta que recibimos del POST inicial
export interface StartResponse {
  id: string;
  responseId: string;
}

export interface PortraitLiveness {
  similarityScore: number;
}

export interface VerificationResults {
  ageOver18: boolean;
  portraitLivenessPassive: PortraitLiveness;
}

export interface VerificationEventDetail {
  documentVerificationResults: {
    ageOver18: boolean;
    portraitLivenessPassive: {
      similarityScore: number;
    };
  };
}
