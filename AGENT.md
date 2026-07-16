## Mission
Turn difficult guides into evidence-backed, one-action-at-a-time cards
for older adults and digital beginners.

## Required user flow
1. Enter a goal.
2. Paste guide text or upload a PDF/image.
3. Generate 3-8 action cards.
4. Show one card at a time.
5. Let the user mark a card complete.
6. Let the user upload a screenshot when the screen is different.

## Card requirements
Every card must contain:
- one action
- visible screen anchor
- expected result
- completion question
- fallback action
- source evidence
- source location

## Safety
- Never request passwords, OTPs, card numbers, or identity numbers.
- Do not persist uploaded documents or screenshots.
- Do not invent steps missing from the source.
- Warn before payments, submissions, deletion, or irreversible actions.

## Technical constraints
- Next.js and TypeScript
- Server-side Gemini API calls only
- @google/genai
- Zod or JSON Schema validation
- No authentication
- No database
- Cloud Run deployable
- Mobile-first accessible UI

## Quality gates
- npm test passes
- npm run build passes
- Browser verification completes both fixture scenarios
- No API key is exposed in client code