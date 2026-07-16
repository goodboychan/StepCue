import { GoogleGenAI } from '@google/genai';
import { GenerationResponseSchema, ActionCardSchema, ActionCard, GenerationResponse } from '../types';

// Ensure the API key is available
const apiKey = process.env.GEMINI_API_KEY || '';

export const ai = new GoogleGenAI({ apiKey });

export function parseDataUrl(dataUrl: string) {
  const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
  if (!match) {
    throw new Error('Invalid file format. Please upload a valid image or PDF.');
  }
  return {
    mimeType: match[1],
    base64Data: match[2],
  };
}

export async function generateActionCards(params: {
  goal: string;
  guideText?: string;
  guideFile?: { data: string; mimeType: string };
  accessibilityMode: {
    simpleLanguage: boolean;
    largeText: boolean;
    stepByStep: boolean;
  };
}): Promise<GenerationResponse> {
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured on the server.');
  }

  const { goal, guideText, guideFile, accessibilityMode } = params;

  const prompt = `
You are an expert helper converting difficult guides into step-by-step action cards for older adults and digital beginners.

Goal: "${goal}"

Accessibility Preferences:
- Simple Language: ${accessibilityMode.simpleLanguage ? "Yes (use everyday words, translate technical jargon into simple Korean/English terms, keep sentences short, do not explain too much theory, focus on actions)" : "No"}
- Large Text Layout: ${accessibilityMode.largeText ? "Yes (structure the text to be short and punchy, keep items brief)" : "No"}
- Step-by-step guidance: ${accessibilityMode.stepByStep ? "Yes (strictly one specific physical action per step, maximum 8 steps, minimum 3 steps)" : "No"}

Rules:
1. Break down the guide into 3 to 8 step cards.
2. Each card must represent exactly one action.
3. Every card must have:
   - "stepNumber": The sequence index of the card starting at 1.
   - "action": What action the user should take right now. Keep it brief and clear.
   - "screenAnchor": What specific button, header, link, label, or location on the screen/device the user should look at to find/execute the action.
   - "expectedResult": What visual or physical result the user will observe if they succeed.
   - "completionQuestion": A verification question they can ask themselves (e.g., "3층에서 '오키드홀' 표지판이 보이나요?", "메뉴에 '확인' 버튼이 생겼나요?").
   - "recoveryInstruction": What the user should do if they get stuck or see something different. Provide a backup/fallback option.
   - "sourceEvidence": A direct quote of the original guide text that supports this card.
   - "sourceLocation": Where in the guide this step is located (e.g., "1페이지 첫 번째 문장", "Section 2, Paragraph 1").
4. WARNING: You must ONLY use the provided source guide. Do NOT make up, assume, or invent:
   - Buttons, links, menus
   - URLs, addresses
   - Deadlines, dates, times
   - Fees or costs
   - Document requirements
   If the guide is missing crucial details, leave them out of the card instructions and instead document it in "missingInformationWarning".
5. WARNING: Check if the action involves:
   - Financial transactions, payments, fees
   - Submitting applications, files, or sensitive information
   - Deletions, cancellations, or other irreversible actions
   If so, write a prominent warning warning the user in "safetyNotice" (e.g., "주의: 실제 결제가 발생합니다. 금액을 확인하세요."). Otherwise, set it to null or omit.
`;

  const contents: any[] = [];

  // Add guide file if provided
  if (guideFile && guideFile.data) {
    const { mimeType, base64Data } = parseDataUrl(guideFile.data);
    contents.push({
      inlineData: {
        data: base64Data,
        mimeType: mimeType,
      },
    });
  }

  // Add guide text if provided
  if (guideText) {
    contents.push(`Source Guide Text:\n${guideText}\n`);
  }

  contents.push(prompt);

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: contents,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: 'OBJECT',
          properties: {
            title: { type: 'STRING' },
            cards: {
              type: 'ARRAY',
              items: {
                type: 'OBJECT',
                properties: {
                  stepNumber: { type: 'INTEGER' },
                  action: { type: 'STRING' },
                  screenAnchor: { type: 'STRING' },
                  expectedResult: { type: 'STRING' },
                  completionQuestion: { type: 'STRING' },
                  recoveryInstruction: { type: 'STRING' },
                  sourceEvidence: { type: 'STRING' },
                  sourceLocation: { type: 'STRING' },
                  missingInformationWarning: { type: 'STRING' },
                  safetyNotice: { type: 'STRING' },
                },
                required: [
                  'stepNumber',
                  'action',
                  'screenAnchor',
                  'expectedResult',
                  'completionQuestion',
                  'recoveryInstruction',
                  'sourceEvidence',
                  'sourceLocation',
                ],
              },
            },
          },
          required: ['title', 'cards'],
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error('Gemini API returned an empty response.');
    }

    const json = JSON.parse(text);
    return GenerationResponseSchema.parse(json);
  } catch (error: any) {
    console.error('Error generating action cards:', error);
    throw new Error(`Failed to generate action cards: ${error.message}`);
  }
}

export async function recoverStepAction(params: {
  goal: string;
  currentStep: ActionCard;
  problemOption: string;
  screenshot?: { data: string; mimeType: string };
}): Promise<{ 
  recoveryAction: string; 
  updatedStep?: Partial<ActionCard>; 
  elementCoordinates?: [number, number, number, number] | null;
}> {
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured on the server.');
  }

  const { goal, currentStep, problemOption, screenshot } = params;

  const prompt = `
The user is stuck while executing a guide step.
Original Goal: "${goal}"
Current Step Details:
- Step Number: ${currentStep.stepNumber}
- Action: "${currentStep.action}"
- Screen Anchor: "${currentStep.screenAnchor}"
- Expected Result: "${currentStep.expectedResult}"
- Recovery Instruction: "${currentStep.recoveryInstruction}"

The user reports this problem: "${problemOption}"

Provide:
1. "recoveryAction": A clear, helpful instruction explaining how to recover or bypass this problem. If there is a screenshot, analyze what the user is seeing and explain step-by-step how to navigate back or resolve the mismatch.
2. "updatedStep": (Optional) If the user's screen looks different and you can identify the correct button/menu/anchor from the screenshot, provide an updated "action" and "screenAnchor" to replace the current step's details.
3. "elementCoordinates": (Optional) If there is an uploaded screenshot, detect the bounding box of the physical element/button/input described in the Screen Anchor ("${currentStep.screenAnchor}") or the target button for the action. 
   Return the coordinates as a 4-element array [ymin, xmin, ymax, xmax] normalized to 1000 (0 to 1000 where 1000 is the full height/width). 
   For example, [350, 200, 410, 450] means the button is located in the middle left. Return null if you cannot find the element in the screenshot.

Return your response in JSON format.
`;

  const contents: any[] = [];

  if (screenshot && screenshot.data) {
    const { mimeType, base64Data } = parseDataUrl(screenshot.data);
    contents.push({
      inlineData: {
        data: base64Data,
        mimeType: mimeType,
      },
    });
  }

  contents.push(prompt);

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: contents,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: 'OBJECT',
          properties: {
            recoveryAction: { type: 'STRING' },
            updatedStep: {
              type: 'OBJECT',
              properties: {
                action: { type: 'STRING' },
                screenAnchor: { type: 'STRING' },
              },
              required: ['action', 'screenAnchor'],
            },
            elementCoordinates: {
              type: 'ARRAY',
              description: 'Coordinates [ymin, xmin, ymax, xmax] normalized between 0-1000.',
              items: { type: 'INTEGER' },
            },
          },
          required: ['recoveryAction'],
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error('Gemini API returned an empty response.');
    }

    return JSON.parse(text);
  } catch (error: any) {
    console.error('Error in recovery generation:', error);
    throw new Error(`Failed to generate recovery: ${error.message}`);
  }
}
