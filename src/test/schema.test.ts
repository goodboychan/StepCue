import { test } from 'node:test';
import assert from 'node:assert';
import { ActionCardSchema } from '../types/index';

test('validates valid ActionCard', () => {
  const validCard = {
    stepNumber: 1,
    action: 'Click start',
    screenAnchor: 'Green button',
    expectedResult: 'Success screen shown',
    completionQuestion: 'Do you see success?',
    recoveryInstruction: 'If not, try again',
    sourceEvidence: 'Section 1.1',
    sourceLocation: 'Page 2',
    missingInformationWarning: null,
    safetyNotice: null,
  };
  
  const parsed = ActionCardSchema.parse(validCard);
  assert.strictEqual(parsed.stepNumber, 1);
  assert.strictEqual(parsed.action, 'Click start');
});

test('rejects ActionCard missing required fields', () => {
  const invalidCard = {
    stepNumber: 1,
    action: 'Click start',
  };
  
  assert.throws(() => {
    ActionCardSchema.parse(invalidCard);
  });
});
