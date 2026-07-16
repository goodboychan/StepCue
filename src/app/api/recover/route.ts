import { NextRequest, NextResponse } from 'next/server';
import { recoverStepAction } from '@/lib/gemini';
import { RecoverRequest } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const body: RecoverRequest = await req.json();

    if (!body.goal || !body.currentStep || !body.problemOption) {
      return NextResponse.json(
        { success: false, error: 'Missing required parameters: goal, currentStep, and problemOption are required.' },
        { status: 400 }
      );
    }

    const data = await recoverStepAction({
      goal: body.goal,
      currentStep: body.currentStep,
      problemOption: body.problemOption,
      screenshot: body.screenshot,
    });

    return NextResponse.json({ success: true, ...data });
  } catch (error: any) {
    console.error('API Error in /api/recover:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error.' },
      { status: 500 }
    );
  }
}
