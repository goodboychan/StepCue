import { z } from 'zod';

export const ActionCardSchema = z.object({
  stepNumber: z.number(),
  action: z.string(),
  screenAnchor: z.string(),
  expectedResult: z.string(),
  completionQuestion: z.string(),
  recoveryInstruction: z.string(),
  sourceEvidence: z.string(),
  sourceLocation: z.string(),
  missingInformationWarning: z.string().nullable().optional(),
  safetyNotice: z.string().nullable().optional(),
});

export const GenerationResponseSchema = z.object({
  title: z.string(),
  cards: z.array(ActionCardSchema),
});

export type ActionCard = z.infer<typeof ActionCardSchema>;
export type GenerationResponse = z.infer<typeof GenerationResponseSchema>;

export interface GenerateRequest {
  goal: string;
  guideText?: string;
  guideFile?: {
    data: string; // Base64 data URL
    mimeType: string;
  };
  accessibilityMode: {
    simpleLanguage: boolean;
    largeText: boolean;
    stepByStep: boolean;
  };
}

export interface RecoverRequest {
  goal: string;
  currentStep: ActionCard;
  problemOption: string;
  screenshot?: {
    data: string; // Base64 data URL
    mimeType: string;
  };
}
