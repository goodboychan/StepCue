import { NextRequest, NextResponse } from 'next/server';
import { generateActionCards } from '@/lib/gemini';
import { GenerateRequest } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const body: GenerateRequest = await req.json();

    if (!body.goal) {
      return NextResponse.json(
        { success: false, error: 'Goal is required.' },
        { status: 400 }
      );
    }

    if (!body.guideText && !body.guideFile) {
      return NextResponse.json(
        { success: false, error: 'Either guide text or guide file is required.' },
        { status: 400 }
      );
    }

    const data = await generateActionCards({
      goal: body.goal,
      guideText: body.guideText,
      guideFile: body.guideFile,
      accessibilityMode: body.accessibilityMode || {
        simpleLanguage: false,
        largeText: false,
        stepByStep: false,
      },
    });

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('API Error in /api/generate:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error.' },
      { status: 500 }
    );
  }
}
