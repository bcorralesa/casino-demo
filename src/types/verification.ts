// src/types/verification.ts

// Ahora el payload acepta sólo estas dos opciones:
export type LivenessMode = 'NT' | 'RG'

export interface StartPayload {
  documentVerification: {
    portraitLivenessPassive: LivenessMode
    ageOver18: boolean
  }
}

export interface StartResponse {
  id: string
  responseId: string
}

export interface PortraitLiveness {
  similarityScore: number
}

export interface VerificationResults {
  ageOver18: boolean
  portraitLivenessPassive: PortraitLiveness
}

export interface VerificationEventDetail {
  documentVerificationResults: VerificationResults
}
