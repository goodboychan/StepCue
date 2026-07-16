'use client';

import React, { useState, useRef } from 'react';
import { ActionCard, GenerationResponse } from '@/types';

type AppState = 'INPUT' | 'ANALYZING' | 'CARDS' | 'COMPLETION';

// Pre-defined demo fixtures for quick testing
const DEMO_FIXTURE_1_INPUT = {
  goal: '행사 당일 준비부터 최종 제출까지 빠뜨리지 않고 완료하고 싶어요.',
  guideText: `[Google Cloud Study Jam Hackathon 참가자 안내 가이드]
- 행사 장소: 서울 신라호텔 본관 3층 오키드룸 (동대입구역 5번 출구에서 이동 가능)
- 행사 일시: 2026년 7월 16일 목요일 12:00까지 입장
- 개발 시간: 13:20 ~ 15:20 (120분간) 프로젝트 구현 진행
- 필수 조건: Google AI Studio 또는 Antigravity 등 Google AI 기술을 필수적으로 사용해야 합니다.
- 제출물 종류: 1. 프로젝트 소개, 2. 공개 GitHub 저장소, 3. 데모 영상 링크 (세 가지 모두 제출 필수)
- 주의 사항:
  1. 주차 지원이 불가하오니 대중교통 이동을 준비해주십시오.
  2. 개발용 행사 계정(Cloud ID 및 비밀번호)은 현장 등록 데스크에서 배부해 드립니다.
  3. 개인정보가 보이는 화면은 절대 다른 사람에게 공유하지 마십시오.`,
  accessibilityMode: {
    simpleLanguage: false,
    largeText: true,
    stepByStep: true,
  }
};

const DEMO_FIXTURE_1_CARDS: GenerationResponse = {
  title: 'Google Cloud Study Jam Hackathon 참가자 안내 가이드',
  cards: [
    {
      stepNumber: 1,
      action: '준비물을 가방에 넣으세요.',
      screenAnchor: '가방 안 (노트북 및 충전기)',
      expectedResult: '가방 안에 노트북과 충전기가 모두 있습니다.',
      completionQuestion: '가방 안에 노트북과 충전기가 모두 있나요?',
      recoveryInstruction: '주차 지원이 되지 않으므로 대중교통으로 가시는 길을 미리 지도 앱에서 확인하세요.',
      sourceEvidence: '1. 주차 지원이 불가하오니 대중교통 이동을 준비해주십시오.',
      sourceLocation: '가이드 문서 주의 사항 1번',
      missingInformationWarning: null,
      safetyNotice: '주의: 주차 지원이 없으므로 대중교통 이동을 준비하세요.'
    },
    {
      stepNumber: 2,
      action: '행사장에 도착하세요.',
      screenAnchor: '서울 신라호텔 본관 3층 오키드룸',
      expectedResult: '3층에서 ‘오키드룸’ 표지판이 보입니다.',
      completionQuestion: '3층에서 ‘오키드룸’ 표지판이 보이나요?',
      recoveryInstruction: '동대입구역 5번 출구에서 신라호텔 본관 방향으로 이동하세요.',
      sourceEvidence: '- 행사 장소: 서울 신라호텔 본관 3층 오키드룸 (동대입구역 5번 출구에서 이동 가능) - 행사 일시: 2026년 7월 16일 목요일 12:00까지 입장',
      sourceLocation: '가이드 문서 1페이지 기본정보',
      missingInformationWarning: null,
      safetyNotice: null
    },
    {
      stepNumber: 3,
      action: '행사 계정을 받으세요.',
      screenAnchor: '현장 등록 데스크',
      expectedResult: 'Cloud ID와 임시 비밀번호를 수령했습니다.',
      completionQuestion: '등록 데스크에서 해커톤 전용 Cloud ID와 비밀번호를 받으셨나요?',
      recoveryInstruction: '행사 계정은 현장에서 배부됩니다. 개인정보가 보이는 화면은 절대 다른 사람에게 공유하지 마세요.',
      sourceEvidence: '2. 개발용 행사 계정(Cloud ID 및 비밀번호)은 현장 등록 데스크에서 배부해 드립니다. 3. 개인정보가 보이는 화면은 절대 다른 사람에게 공유하지 마십시오.',
      sourceLocation: '가이드 문서 주의 사항 2번, 3번',
      missingInformationWarning: null,
      safetyNotice: '주의: 행사 계정은 현장에서 배부됩니다. 개인정보가 보이는 화면은 다른 사람에게 공유하지 마세요.'
    },
    {
      stepNumber: 4,
      action: '개발 범위를 확인하세요.',
      screenAnchor: '개발 완료 및 프로젝트 구현',
      expectedResult: '개발 프로젝트 구현 완료',
      completionQuestion: '개발 프로젝트에 Google AI Studio 또는 Antigravity 등 Google AI 기술을 적용했나요?',
      recoveryInstruction: '13시 20분부터 15시 20분까지 프로젝트 구현을 완료해야 합니다.',
      sourceEvidence: '- 개발 시간: 13:20 ~ 15:20 (120분간) - 필수 조건: Google AI Studio 또는 Antigravity 등 Google AI 기술을 필수적으로 사용해야 합니다.',
      sourceLocation: '가이드 문서 1페이지 개발 요건',
      missingInformationWarning: '필수 조건: Google AI Studio 또는 Antigravity 등 Google AI 기술을 사용하세요.',
      safetyNotice: null
    },
    {
      stepNumber: 5,
      action: '세 가지 제출물을 준비하세요.',
      screenAnchor: '해커톤 최종 제출 폼',
      expectedResult: '세 가지 링크 및 내용의 제출 완료',
      completionQuestion: '세 링크(프로젝트 소개, GitHub 저장소, 데모 영상 링크)를 모두 제출 폼에 입력했나요?',
      recoveryInstruction: '제출 마감 시간 15시 20분 전에 세 가지 제출물 링크를 모두 확인 및 입력하세요.',
      sourceEvidence: '- 제출물 종류: 1. 프로젝트 소개, 2. 공개 GitHub 저장소, 3. 데모 영상 링크 (세 가지 모두 제출 필수)',
      sourceLocation: '가이드 문서 1페이지 제출 규정',
      missingInformationWarning: null,
      safetyNotice: null
    }
  ]
};

const DEMO_FIXTURE_2_INPUT = {
  goal: '기후동행카드 미사용 잔액을 내 통장 계좌로 돌려받고 싶어요.',
  guideText: `[서울시 기후동행카드 미사용 잔액 환급 가이드]
- 이용 사이트: 티머니 카드&페이 홈페이지 (또는 모바일티머니 앱)
- 환급 신청 절차:
  1. 티머니 홈페이지에 로그인한 뒤 마이페이지로 이동합니다.
  2. 메뉴 중에서 '기후동행카드 환급신청'을 찾아서 누릅니다.
  3. 환급금을 돌려받을 본인 명의의 환급 은행과 계좌번호를 정확히 적어줍니다.
  4. 바로 아래 '예금주 조회' 버튼을 눌러 본인 실명 인증이 정상 처리되었는지 확인합니다.
  5. 화면 맨 하단의 '환급 신청하기' 버튼을 누르면 접수가 성공적으로 처리됩니다.
- 주의 사항:
  1. 반드시 기후동행카드 등록자 실사용자 본인 명의의 은행 계좌만 등록 가능합니다. 자녀 등 타인 계좌는 인증 실패 처리됩니다.`,
  accessibilityMode: {
    simpleLanguage: true,
    largeText: true,
    stepByStep: true,
  }
};

const DEMO_FIXTURE_2_CARDS: GenerationResponse = {
  title: '기후동행카드 미사용 잔액 환급 신청',
  cards: [
    {
      stepNumber: 1,
      action: '티머니 홈페이지에 로그인하세요.',
      screenAnchor: '로그인 영역 및 비밀번호 입력창',
      expectedResult: '로그인이 성공하고 마이페이지 화면이 나타났나요?',
      completionQuestion: '티머니 카드&페이 로그인을 성공하셨나요?',
      recoveryInstruction: '아이디와 패스워드가 기억나지 않으시면 가입 시 등록한 정보를 다시 찾아보세요.',
      sourceEvidence: '1. 티머니 홈페이지에 로그인한 뒤 마이페이지로 이동합니다.',
      sourceLocation: '환급 가이드 1단계',
      missingInformationWarning: null,
      safetyNotice: null
    },
    {
      stepNumber: 2,
      action: '‘기후동행카드 환급신청’ 메뉴를 누르세요.',
      screenAnchor: '마이페이지 환급/환불 메뉴 링크',
      expectedResult: '은행명과 계좌번호를 적을 수 있는 입력 상자들이 보이나요?',
      completionQuestion: '기후동행카드 환급신청 메뉴를 잘 찾아서 입장하셨나요?',
      recoveryInstruction: '마이페이지 전체 메뉴판을 찬찬히 훑어보시고, \'기후동행카드 환급신청\' 문구를 터치해 보세요.',
      sourceEvidence: '2. 메뉴 중에서 \'기후동행카드 환급신청\'을 찾아서 누릅니다.',
      sourceLocation: '환급 가이드 2단계',
      missingInformationWarning: null,
      safetyNotice: null
    },
    {
      stepNumber: 3,
      action: '환급금을 받을 은행을 선택하세요.',
      screenAnchor: '환급 은행 선택 목록 상자',
      expectedResult: '선택하신 주거래 은행 이름이 상자에 올바르게 선택되었나요?',
      completionQuestion: '환급받으실 은행명을 목록에서 찾아서 선택하셨나요?',
      recoveryInstruction: '농협, 국민, 신한, 우리 등 자주 쓰시는 은행 목록 상자를 누르고 본인의 은행을 선택하세요.',
      sourceEvidence: '3. 환급금을 돌려받을 본인 명의의 환급 은행과...',
      sourceLocation: '환급 가이드 3단계',
      missingInformationWarning: null,
      safetyNotice: null
    },
    {
      stepNumber: 4,
      action: '계좌번호를 입력하고 ‘예금주 조회’를 누르세요.',
      screenAnchor: '계좌번호 입력칸 및 예금주 조회 버튼',
      expectedResult: '조회 버튼을 눌렀을 때 오류 창 없이 예금주명이 정상적으로 뜨나요?',
      completionQuestion: '계좌번호 숫자들을 틀림없이 입력한 뒤 예금주 조회 단추를 누르셨나요?',
      recoveryInstruction: '반드시 기후동행카드 가입자 본인의 통장 계좌여야만 조회에 성공합니다. 숫자만 공백 없이 적고 조회 버튼을 누르세요.',
      sourceEvidence: '...\'예금주 조회\' 버튼을 눌러 본인 실명 인증이 정상 처리되었는지 확인합니다. - 주의 사항: 1. 반드시 기후동행카드 등록자 실사용자 본인 명의의 은행 계좌만 등록 가능합니다.',
      sourceLocation: '환급 가이드 4단계 및 주의사항 1번',
      missingInformationWarning: null,
      safetyNotice: '주의: 다른 가족(자녀 등) 명의의 계좌를 적으시면 예금주 조회 오류가 발생해 진행되지 않습니다.'
    },
    {
      stepNumber: 5,
      action: '‘환급 신청하기’ 버튼을 누르세요.',
      screenAnchor: '화면 맨 아래 신청하기 녹색 단추',
      expectedResult: '환급 신청 접수 완료 안내 팝업이나 완료 문구가 표시되었나요?',
      completionQuestion: '‘환급 신청하기’ 버튼을 눌러 최종 접수를 마쳤나요?',
      recoveryInstruction: '화면 아래로 내려서 초록색 버튼으로 크게 쓰여진 \'환급 신청하기\'를 꾹 눌러 완료하세요.',
      sourceEvidence: '5. 화면 맨 하단의 \'환급 신청하기\' 버튼을 누르면 접수가 성공적으로 처리됩니다.',
      sourceLocation: '환급 가이드 5단계',
      missingInformationWarning: null,
      safetyNotice: null
    }
  ]
};

export default function Home() {
  // Application States
  const [appState, setAppState] = useState<AppState>('INPUT');
  const [goal, setGoal] = useState('');
  const [guideText, setGuideText] = useState('');
  const [guideFile, setGuideFile] = useState<{ data: string; mimeType: string } | null>(null);
  const [accessibilityMode, setAccessibilityMode] = useState({
    simpleLanguage: true,
    largeText: true,
    stepByStep: true,
  });

  // Cards State
  const [generatedData, setGeneratedData] = useState<GenerationResponse | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [showSource, setShowSource] = useState<boolean>(false);

  // Recovery Bottom Sheet State
  const [showRecoverySheet, setShowRecoverySheet] = useState(false);
  const [selectedProblem, setSelectedProblem] = useState('');
  const [screenshotFile, setScreenshotFile] = useState<{ data: string; mimeType: string } | null>(null);
  const [isRecovering, setIsRecovering] = useState(false);
  const [recoveryError, setRecoveryError] = useState('');
  
  // Custom Recovery Guidance (returned from API)
  const [customRecoveryGuidance, setCustomRecoveryGuidance] = useState<string | null>(null);

  // Concept 2 & 3: Voice Coach and Coordinate Highlighting
  const [isVoiceCoachActive, setIsVoiceCoachActive] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [recoveryCoordinates, setRecoveryCoordinates] = useState<[number, number, number, number] | null>(null);
  const [sosCopied, setSosCopied] = useState<boolean>(false);
  const [availableVoices, setAvailableVoices] = useState<any[]>([]);
  const [selectedVoiceName, setSelectedVoiceName] = useState<string>('');

  // General Loading & Error
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  // Refs for file inputs
  const guideFileInputRef = useRef<HTMLInputElement>(null);
  const screenshotFileInputRef = useRef<HTMLInputElement>(null);

  // Populate available Korean voices
  React.useEffect(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      const updateVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        const koVoices = voices.filter(v => v.lang.includes('ko') || v.lang.includes('KO'));
        setAvailableVoices(koVoices);
        if (koVoices.length > 0 && !selectedVoiceName) {
          // Find Heami, Google, Yuna or fall back to first Korean voice
          const bestVoice = koVoices.find(v => v.name.includes('Google') || v.name.includes('Yuna') || v.name.includes('Heami')) || koVoices[0];
          setSelectedVoiceName(bestVoice.name);
        }
      };

      updateVoices();
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
  }, []);

  // Voice Coach Text-To-Speech Effect
  React.useEffect(() => {
    if (appState === 'CARDS' && isVoiceCoachActive && generatedData && generatedData.cards[currentStepIndex]) {
      const card = generatedData.cards[currentStepIndex];
      let text = `현재 단계는 ${currentStepIndex + 1}단계입니다. 해야 할 행동은, ${card.action} 입니다. 화면에서 ${card.screenAnchor}를 찾아 완료 기준을 확인해 보세요.`;
      
      if (customRecoveryGuidance) {
        text = `화면 맞춤 처방이 등록되었습니다. ${customRecoveryGuidance}`;
      }

      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'ko-KR';
        utterance.rate = 1.0;
        
        if (selectedVoiceName && availableVoices.length > 0) {
          const matchedVoice = availableVoices.find(v => v.name === selectedVoiceName);
          if (matchedVoice) {
            utterance.voice = matchedVoice;
          }
        }
        
        window.speechSynthesis.speak(utterance);
      }
    } else {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    }
  }, [currentStepIndex, appState, isVoiceCoachActive, generatedData, customRecoveryGuidance, selectedVoiceName, availableVoices]);

  // Voice Commands Control (Speech Recognition)
  React.useEffect(() => {
    let recognition: any = null;
    
    if (appState === 'CARDS' && isListening && typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        try {
          recognition = new SpeechRecognition();
          recognition.continuous = true;
          recognition.interimResults = false;
          recognition.lang = 'ko-KR';
          
          recognition.onresult = (event: any) => {
            const last = event.results.length - 1;
            const command = event.results[last][0].transcript.trim();
            console.log('Voice Command received:', command);
            
            const speakConfirmation = (msg: string) => {
              if (typeof window !== 'undefined' && window.speechSynthesis) {
                window.speechSynthesis.cancel();
                const utterance = new SpeechSynthesisUtterance(msg);
                utterance.lang = 'ko-KR';
                
                if (selectedVoiceName && availableVoices.length > 0) {
                  const matchedVoice = availableVoices.find(v => v.name === selectedVoiceName);
                  if (matchedVoice) {
                    utterance.voice = matchedVoice;
                  }
                }
                
                window.speechSynthesis.speak(utterance);
              }
            };

            if (command.includes('다음') || command.includes('완료') || command.includes('했어') || command.includes('성공')) {
              handleNextStep();
              speakConfirmation('다음 단계로 넘어갑니다.');
            } else if (command.includes('이전') || command.includes('뒤로') || command.includes('돌아가')) {
              handlePrevStep();
              speakConfirmation('이전 단계로 돌아갑니다.');
            } else if (command.includes('도와줘') || command.includes('달라') || command.includes('이상해') || command.includes('막혔어')) {
              setShowRecoverySheet(true);
              speakConfirmation('화면 맞춤 처방 창을 열었습니다. 눈앞의 화면을 사진으로 찍어서 올려주시면 새로운 해결법을 분석해 드릴게요.');
            } else if (command.includes('다시') || command.includes('읽어줘')) {
              const card = generatedData?.cards[currentStepIndex];
              if (card) {
                speakConfirmation(`다시 읽어드릴게요. 현재 행동은 ${card.action} 이며, 찾아볼 부분은 ${card.screenAnchor} 입니다.`);
              }
            }
          };
          
          recognition.onerror = (e: any) => {
            console.error('Speech recognition error:', e);
          };
          
          recognition.start();
        } catch (e) {
          console.error('Failed to start speech recognition:', e);
        }
      } else {
        console.warn('SpeechRecognition is not supported in this browser.');
        setIsListening(false);
      }
    }
    
    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, [appState, isListening, currentStepIndex, generatedData]);

  // Analyzing screen dynamic steps simulation
  const [analyzingStep, setAnalyzingStep] = useState(0);

  // Handle Demo Fixtures
  const loadDemo = (demoNum: number) => {
    const input = demoNum === 1 ? DEMO_FIXTURE_1_INPUT : DEMO_FIXTURE_2_INPUT;
    const cards = demoNum === 1 ? DEMO_FIXTURE_1_CARDS : DEMO_FIXTURE_2_CARDS;

    setGoal(input.goal);
    setGuideText(input.guideText);
    setAccessibilityMode(input.accessibilityMode);
    
    // Simulate generation immediately for demo purposes
    setIsLoading(true);
    setAppState('ANALYZING');
    setAnalyzingStep(1);
    
    setTimeout(() => {
      setAnalyzingStep(2);
      setTimeout(() => {
        setAnalyzingStep(3);
        setTimeout(() => {
          setGeneratedData(cards);
          setCurrentStepIndex(0);
          setAppState('CARDS');
          setIsLoading(false);
        }, 1000);
      }, 1000);
    }, 1000);
  };

  // Convert File to Base64
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, isScreenshot = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      const fileData = {
        data: result,
        mimeType: file.type,
      };
      if (isScreenshot) {
        setScreenshotFile(fileData);
      } else {
        setGuideFile(fileData);
      }
    };
    reader.readAsDataURL(file);
  };

  const removeAttachedFile = (isScreenshot = false) => {
    if (isScreenshot) {
      setScreenshotFile(null);
      if (screenshotFileInputRef.current) screenshotFileInputRef.current.value = '';
    } else {
      setGuideFile(null);
      if (guideFileInputRef.current) guideFileInputRef.current.value = '';
    }
  };

  // Run structured output API
  const handleStartAnalysis = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!goal) {
      setApiError('해결하고자 하는 목표를 입력해주세요.');
      return;
    }
    if (!guideText && !guideFile) {
      setApiError('가이드 텍스트를 붙여넣거나 가이드 파일(이미지/PDF)을 등록해주세요.');
      return;
    }

    setApiError('');
    setIsLoading(true);
    setAppState('ANALYZING');
    setAnalyzingStep(1);

    // Simulate analyzing step updates
    const timer1 = setTimeout(() => setAnalyzingStep(2), 1200);
    const timer2 = setTimeout(() => setAnalyzingStep(3), 2400);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          goal,
          guideText,
          guideFile,
          accessibilityMode,
        }),
      });

      const result = await response.json();
      
      clearTimeout(timer1);
      clearTimeout(timer2);

      if (result.success) {
        setGeneratedData(result.data);
        setCurrentStepIndex(0);
        setAppState('CARDS');
        setShowSource(false);
        setCustomRecoveryGuidance(null);
      } else {
        setAppState('INPUT');
        setApiError(result.error || '가이드를 카드로 분석하는 도중 오류가 발생했습니다.');
      }
    } catch (err: any) {
      clearTimeout(timer1);
      clearTimeout(timer2);
      setAppState('INPUT');
      setApiError('서버 연결 실패: 인터넷 연결 혹은 API 키 설정을 확인해주세요.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Submit recovery request
  const handleRecoverSubmit = async () => {
    if (!selectedProblem) {
      setRecoveryError('문제가 발생한 원인을 선택해주세요.');
      return;
    }

    setIsRecovering(true);
    setRecoveryError('');
    setCustomRecoveryGuidance(null);

    try {
      const response = await fetch('/api/recover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          goal,
          currentStep: generatedData?.cards[currentStepIndex],
          problemOption: selectedProblem,
          screenshot: screenshotFile,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setCustomRecoveryGuidance(result.recoveryAction);
        
        // Save element coordinates if found on screenshot
        if (result.elementCoordinates && result.elementCoordinates.length === 4) {
          setRecoveryCoordinates(result.elementCoordinates);
        } else {
          setRecoveryCoordinates(null);
        }
        
        // If Gemini returned an updated step action based on screenshot, update it in state
        if (result.updatedStep && generatedData) {
          const updatedCards = [...generatedData.cards];
          updatedCards[currentStepIndex] = {
            ...updatedCards[currentStepIndex],
            action: result.updatedStep.action || updatedCards[currentStepIndex].action,
            screenAnchor: result.updatedStep.screenAnchor || updatedCards[currentStepIndex].screenAnchor,
          };
          setGeneratedData({
            ...generatedData,
            cards: updatedCards,
          });
        }
      } else {
        setRecoveryError(result.error || '복구 안내를 생성하지 못했습니다.');
      }
    } catch (err) {
      setRecoveryError('네트워크 오류로 복구 안내를 받아오지 못했습니다.');
      console.error(err);
    } finally {
      setIsRecovering(false);
    }
  };

  // Navigation handlers
  const handleNextStep = () => {
    if (!generatedData) return;
    setCustomRecoveryGuidance(null); // Clear previous recovery instructions
    setRecoveryCoordinates(null);   // Clear previous coordinates
    if (currentStepIndex < generatedData.cards.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
      setShowSource(false);
    } else {
      setAppState('COMPLETION');
    }
  };

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
      setShowSource(false);
      setCustomRecoveryGuidance(null);
      setRecoveryCoordinates(null);
    }
  };

  const handleSkipStep = () => {
    handleNextStep();
  };

  const loadPresetScreenshot = (presetNum: number) => {
    let svgContent = '';
    if (presetNum === 1) {
      svgContent = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" fill="%231e293b"/><text x="40" y="60" fill="%23ffffff" font-family="sans-serif" font-size="20" font-weight="bold">정부24 민원 서류 신청 화면 (샘플)</text><rect x="40" y="100" width="520" height="2" fill="%23334155"/><text x="40" y="150" fill="%2394a3b8" font-family="sans-serif" font-size="14">현재 상태: 본인 인증 및 전자 서명 단계</text><rect x="40" y="180" width="340" height="48" rx="6" fill="%23334155" stroke="%23475569" stroke-width="2"/><text x="60" y="210" fill="%23ffffff" font-family="sans-serif" font-size="14">주민등록 등본 교부 신청</text><rect x="400" y="180" width="160" height="48" rx="6" fill="%232563eb"/><text x="445" y="210" fill="%23ffffff" font-family="sans-serif" font-size="14" font-weight="bold">인증 확인</text><rect x="40" y="250" width="520" height="110" rx="8" fill="%23ef4444" fill-opacity="0.1" stroke="%23ef4444" stroke-width="1.5"/><text x="60" y="285" fill="%23fca5a5" font-family="sans-serif" font-size="14" font-weight="bold">⚠️ 오류: 간편인증 모듈 호출에 실패했습니다.</text><text x="60" y="315" fill="%23fca5a5" font-family="sans-serif" font-size="12">브라우저 쿠키 설정 혹은 팝업 차단이 활성화되어 있는지 확인해 주십시오.</text><text x="60" y="335" fill="%23fca5a5" font-family="sans-serif" font-size="12">오류 코드: AUTH_ERR_403</text></svg>`;
      setSelectedProblem('오류 메시지나 경고창이 나타났어요');
    } else {
      svgContent = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" fill="%230f172a"/><text x="40" y="60" fill="%2322c55e" font-family="sans-serif" font-size="22" font-weight="bold">티머니 기후동행카드 미사용 잔액 환급</text><rect x="40" y="90" width="520" height="1.5" fill="%231e293b"/><text x="40" y="130" fill="%2394a3b8" font-family="sans-serif" font-size="14">환급금을 지급받으실 은행 정보와 계좌번호를 등록해 주십시오.</text><text x="40" y="175" fill="%2364748b" font-family="sans-serif" font-size="12" font-weight="bold">환급 은행</text><rect x="40" y="185" width="240" height="40" rx="6" fill="%231e293b" stroke="%23334155" stroke-width="1.5"/><text x="56" y="210" fill="%2394a3b8" font-family="sans-serif" font-size="14">신한은행 (SHINHAN)</text><text x="310" y="175" fill="%2364748b" font-family="sans-serif" font-size="12" font-weight="bold">계좌번호 (숫자만 입력)</text><rect x="310" y="185" width="250" height="40" rx="6" fill="%231e293b" stroke="%23334155" stroke-width="1.5"/><text x="326" y="210" fill="%23f8fafc" font-family="sans-serif" font-size="14">110432567890</text><rect x="40" y="245" width="200" height="42" rx="6" fill="%231e293b" stroke="%23ef4444" stroke-width="2"/><text x="95" y="271" fill="%23ef4444" font-family="sans-serif" font-size="14" font-weight="bold">예금주 조회</text><rect x="260" y="245" width="300" height="42" rx="6" fill="%23ef4444" fill-opacity="0.1" stroke="%23ef4444" stroke-width="1"/><text x="275" y="270" fill="%23fca5a5" font-family="sans-serif" font-size="12">⚠️ 에러: 입력하신 계좌와 실물 소유주 명의가 다릅니다.</text><rect x="360" y="320" width="200" height="48" rx="24" fill="%2322c55e"/><text x="410" y="350" fill="%23ffffff" font-family="sans-serif" font-size="15" font-weight="bold">환급 신청하기 🚀</text></svg>`;
      setSelectedProblem('오류 메시지나 경고창이 나타났어요');
    }
    
    setScreenshotFile({
      data: svgContent,
      mimeType: 'image/svg+xml'
    });
    setRecoveryError('');
  };

  const handleCopyFamilySOS = () => {
    if (!generatedData || !currentStep) return;
    const message = `[StepCue 부모님 안심 SOS 🚨]
아들/딸아, 엄마/아빠가 휴대폰으로 "[${goal}]"을(를) 하던 중에 막혀서 도움이 필요해!

- 현재 단계: ${currentStepIndex + 1}단계 (${currentStep.action})
- 찾아볼 화면 위치: "${currentStep.screenAnchor}"
- 발생한 문제 유형: "${selectedProblem || '화면 불일치'}"
- 인공지능 임시 조치법: "${customRecoveryGuidance}"

이 화면 사진이랑 조치법 같이 보고 카톡이나 전화로 좀 알려주면 고맙겠구나. ❤️
(StepCue 시니어 안심 돌봄망)`;

    navigator.clipboard.writeText(message).then(() => {
      setSosCopied(true);
      setTimeout(() => setSosCopied(false), 5000);
    }).catch(err => {
      console.error('Failed to copy SOS text: ', err);
    });
  };

  const restartApp = () => {
    setGoal('');
    setGuideText('');
    setGuideFile(null);
    setGeneratedData(null);
    setCurrentStepIndex(0);
    setAppState('INPUT');
    setCustomRecoveryGuidance(null);
    setScreenshotFile(null);
    setRecoveryCoordinates(null);
    setSelectedProblem('');
  };

  const currentStep = generatedData?.cards[currentStepIndex];

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <div className="logo-container">
          <div className="logo-icon">S</div>
          <div>
            <h1 className="logo-text">StepCue</h1>
            <p className="subtitle">어려운 안내를 쉬운 한 걸음의 카드로</p>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="main-content">
        {/* INPUT STATE */}
        {appState === 'INPUT' && (
          <div className="card" style={{ maxWidth: '640px', margin: '20px auto w-full' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 800, textAlign: 'center', marginBottom: '8px' }}>
              무엇을 하려고 하나요?
            </h2>
            <p style={{ fontSize: '15px', color: 'var(--text-muted)', textAlign: 'center', marginBottom: '24px' }}>
              부모님과 디지털 초보자도 쉽게 따라갈 수 있도록 단계별 액션 카드로 변환해 드립니다.
            </p>

            {apiError && <div className="error-message">{apiError}</div>}

            <form onSubmit={handleStartAnalysis} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Goal Input */}
              <div className="form-group">
                <label className="form-label" htmlFor="goal">목표 입력</label>
                <input
                  id="goal"
                  type="text"
                  className="form-input"
                  placeholder="예) 주민센터 행정 복사하기, 운전면허증 갱신"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                />
              </div>

              {/* Guide upload / paste option */}
              <div className="form-group">
                <label className="form-label" htmlFor="guideText">안내문 붙여넣기 또는 파일 추가</label>
                <textarea
                  id="guideText"
                  className="form-input form-textarea"
                  placeholder="인터넷 블로그, 매뉴얼 문서 등의 복잡한 안내 내용을 여기에 복사하여 붙여넣으세요."
                  value={guideText}
                  onChange={(e) => setGuideText(e.target.value)}
                />
              </div>

              {/* File Attachment Dropzone */}
              <div 
                className="dropzone"
                onClick={() => guideFileInputRef.current?.click()}
              >
                <div className="dropzone-icon">📁</div>
                {guideFile ? (
                  <div>
                    <p style={{ fontWeight: 600, color: 'var(--primary)', fontSize: '16px' }}>
                      파일이 첨부되었습니다 ({guideFile.mimeType.split('/')[1].toUpperCase()})
                    </p>
                    <button 
                      type="button" 
                      onClick={(e) => {
                        e.stopPropagation();
                        removeAttachedFile(false);
                      }}
                      style={{ color: 'red', marginTop: '8px', border: 'none', background: 'none', textDecoration: 'underline', cursor: 'pointer', fontSize: '14px' }}
                    >
                      첨부 취소
                    </button>
                  </div>
                ) : (
                  <div>
                    <p style={{ fontWeight: 700, fontSize: '16px' }}>가이드 파일 추가하기</p>
                    <p style={{ fontSize: '14px', color: 'var(--text-light)' }}>PDF, JPG, PNG 파일 및 사진 업로드 가능</p>
                  </div>
                )}
                <input
                  type="file"
                  ref={guideFileInputRef}
                  style={{ display: 'none' }}
                  accept="image/*,application/pdf"
                  onChange={(e) => handleFileChange(e, false)}
                />
              </div>

              {/* Accessibility Settings */}
              <div className="form-group">
                <label className="form-label">맞춤 모드 설정</label>
                <div className="chip-group">
                  <button
                    type="button"
                    className={`chip ${accessibilityMode.simpleLanguage ? 'active' : ''}`}
                    onClick={() => setAccessibilityMode(prev => ({ ...prev, simpleLanguage: !prev.simpleLanguage }))}
                  >
                    {accessibilityMode.simpleLanguage ? '✓ ' : ''}쉬운 말
                  </button>
                  <button
                    type="button"
                    className={`chip ${accessibilityMode.largeText ? 'active' : ''}`}
                    onClick={() => setAccessibilityMode(prev => ({ ...prev, largeText: !prev.largeText }))}
                  >
                    {accessibilityMode.largeText ? '✓ ' : ''}큰 글씨
                  </button>
                  <button
                    type="button"
                    className={`chip ${accessibilityMode.stepByStep ? 'active' : ''}`}
                    onClick={() => setAccessibilityMode(prev => ({ ...prev, stepByStep: !prev.stepByStep }))}
                  >
                    {accessibilityMode.stepByStep ? '✓ ' : ''}한 단계씩
                  </button>
                </div>
              </div>

              {/* Primary Buttons */}
              <button type="submit" className="btn btn-primary" style={{ marginTop: '12px' }}>
                분석 시작하기
              </button>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => loadDemo(1)}
                  style={{ fontSize: '15px', height: '56px', padding: '0 8px' }}
                >
                  예시 1 - 해커톤 참가자 가이드
                </button>
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => loadDemo(2)}
                  style={{ fontSize: '15px', height: '56px', padding: '0 8px' }}
                >
                  예시 2 - 기후동행카드 환급 신청
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ANALYZING STATE */}
        {appState === 'ANALYZING' && (
          <div className="card" style={{ maxWidth: '560px', margin: '40px auto', width: '100%' }}>
            <div className="loader-container">
              <div className="loader-spinner"></div>
              <h2 className="loader-title">가이드를 분석 중이에요</h2>
              
              <div className="loader-steps">
                <div className={`loader-step-item ${analyzingStep >= 1 ? 'active' : ''}`}>
                  <span>{analyzingStep > 1 ? '✓' : '●'}</span>
                  <span>가이드의 중요한 내용 찾는 중...</span>
                </div>
                <div className={`loader-step-item ${analyzingStep >= 2 ? 'active' : ''}`}>
                  <span>{analyzingStep > 2 ? '✓' : '●'}</span>
                  <span>필요한 행동 순서 정리하는 중...</span>
                </div>
                <div className={`loader-step-item ${analyzingStep >= 3 ? 'active' : ''}`}>
                  <span>{analyzingStep > 3 ? '✓' : '●'}</span>
                  <span>모든 막힘 현상 복구 대안 만드는 중...</span>
                </div>
              </div>

              <p style={{ fontSize: '15px', color: 'var(--text-muted)', marginTop: '8px' }}>
                잠시만 기다려 주세요. 시니어 사용자를 위한 맞춤형 안내를 작성하고 있습니다.
              </p>
              
              <button 
                className="btn btn-secondary" 
                style={{ height: '48px', marginTop: '16px' }}
                onClick={() => setAppState('INPUT')}
              >
                분석 취소
              </button>
            </div>
          </div>
        )}

        {/* CARDS STATE */}
        {appState === 'CARDS' && generatedData && currentStep && (
          <div className="split-layout">
            
            {/* Desktop Step Navigator */}
            <aside className="sidebar">
              <h3 className="sidebar-title">전체 진행 단계</h3>
              <ul className="step-list">
                {generatedData.cards.map((card, idx) => (
                  <li 
                    key={card.stepNumber} 
                    className={`step-item ${idx === currentStepIndex ? 'active' : ''} ${idx < currentStepIndex ? 'completed' : ''}`}
                    onClick={() => {
                      setCurrentStepIndex(idx);
                      setShowSource(false);
                      setCustomRecoveryGuidance(null);
                    }}
                  >
                    <div className="step-item-dot">
                      {idx < currentStepIndex ? '✓' : card.stepNumber}
                    </div>
                    <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', display: 'block' }}>
                      {card.action}
                    </span>
                  </li>
                ))}
              </ul>
              
              <button 
                className="btn btn-secondary"
                style={{ marginTop: '24px', height: '48px', fontSize: '15px' }}
                onClick={restartApp}
              >
                다른 가이드 시작
              </button>
            </aside>

            {/* Main Action Card block */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
               {/* Concept 2: Voice Control Settings Panel */}
              <div style={{ 
                display: 'flex', 
                gap: '12px', 
                flexWrap: 'wrap', 
                backgroundColor: 'white', 
                padding: '16px', 
                borderRadius: 'var(--radius-sm)', 
                border: '1px solid var(--border)',
                alignItems: 'center'
              }}>
                <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-muted)' }}>🎙️ 시니어 보이스 안심 도우미</span>
                <button 
                  type="button"
                  className={`chip ${isVoiceCoachActive ? 'active' : ''}`}
                  onClick={() => setIsVoiceCoachActive(!isVoiceCoachActive)}
                  style={{ height: '40px', padding: '0 16px', borderRadius: '20px', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <span>{isVoiceCoachActive ? '🔊 소리 내서 안내 중' : '🔇 소리 안내 켜기'}</span>
                </button>
                <button 
                  type="button"
                  className={`chip ${isListening ? 'active' : ''}`}
                  onClick={() => setIsListening(!isListening)}
                  style={{ height: '40px', padding: '0 16px', borderRadius: '20px', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <span style={{ 
                    display: 'inline-block', 
                    width: '8px', 
                    height: '8px', 
                    backgroundColor: isListening ? '#ef4444' : '#9ca3af', 
                    borderRadius: '50%',
                    animation: isListening ? 'pulse 1.5s infinite' : 'none'
                  }}></span>
                  <span>{isListening ? '🎤 네, 말씀하세요' : '🎤 말로 움직이기'}</span>
                </button>

                {availableVoices.length > 1 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: 'auto' }}>
                    <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 700 }}>🗣️ 목소리:</span>
                    <select
                      value={selectedVoiceName}
                      onChange={(e) => setSelectedVoiceName(e.target.value)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '12px',
                        border: '1px solid var(--border)',
                        fontSize: '13px',
                        fontWeight: 700,
                        color: 'var(--text-muted)',
                        backgroundColor: '#f8fafc',
                        cursor: 'pointer',
                        outline: 'none'
                      }}
                    >
                      {availableVoices.map((v) => (
                        <option key={v.name} value={v.name}>
                          {v.name.includes('Google') ? '✨ 구글 고음질 여성음성' : 
                           v.name.includes('Yuna') ? '👩 다정한 여성음성 (유나)' : 
                           v.name.includes('Heami') ? '👩 단정한 여성음성 (혜미)' : 
                           v.name.includes('SunHi') ? '👩 밝은 여성음성 (선희)' : 
                           v.name.includes('InJoon') ? '👨 신뢰감 남성음성 (인준)' : 
                           v.name.replace(/Microsoft|Korean|Korea|Desktop/g, '').trim()}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <p style={{ fontSize: '12px', color: 'var(--text-light)', width: '100%', margin: '4px 0 0 4px', fontWeight: 500 }}>
                  * 마이크를 켜고 "다음", "이전", "도와줘", "다시" 라고 말해서 화면을 제어할 수 있어요.
                </p>
              </div>

              {/* Progress bar info */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', fontWeight: 600, color: 'var(--text-muted)' }}>
                  <span>진행 상황</span>
                  <span>{currentStepIndex + 1} / {generatedData.cards.length} 단계</span>
                </div>
                <div className="progress-bar-container">
                  <div 
                    className="progress-bar-fill"
                    style={{ width: `${((currentStepIndex + 1) / generatedData.cards.length) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* The Action Card */}
              <div className="card">
                <div className="action-card-header">
                  <span className="step-label">현재 단계 {currentStep.stepNumber}</span>
                  <span className="step-count">전체 {generatedData.cards.length}단계</span>
                </div>

                <h2 className="action-title" style={{ fontSize: accessibilityMode.largeText ? '30px' : '24px' }}>
                  {currentStep.action}
                </h2>

                {/* Safety notices if generated */}
                {currentStep.safetyNotice && (
                  <div className="card-section warning-block">
                    <div className="card-section-title">
                      ⚠️ 안전 주의 사항
                    </div>
                    <div className="card-section-content" style={{ fontWeight: 600 }}>
                      {currentStep.safetyNotice}
                    </div>
                  </div>
                )}

                {/* Missing information warning if generated */}
                {currentStep.missingInformationWarning && (
                  <div className="card-section missing-info-block">
                    <div className="card-section-title">
                      ℹ️ 가이드 누락 정보 안내
                    </div>
                    <div className="card-section-content" style={{ fontSize: '16px' }}>
                      {currentStep.missingInformationWarning}
                    </div>
                  </div>
                )}

                {/* Step Details block */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '8px' }}>
                  {/* What to do now */}
                  <div className="card-section">
                    <div className="card-section-title">
                      📍 지금 할 일
                    </div>
                    <div className="card-section-content" style={{ fontSize: accessibilityMode.largeText ? '20px' : '18px' }}>
                      {currentStep.action}
                    </div>
                  </div>

                  {/* What to look for */}
                  <div className="card-section">
                    <div className="card-section-title">
                      🔍 찾아야 할 화면 위치 / 글자
                    </div>
                    <div className="card-section-content" style={{ fontWeight: 600 }}>
                      {currentStep.screenAnchor}
                    </div>
                  </div>

                  {/* Expected result */}
                  <div className="card-section">
                    <div className="card-section-title">
                      ✨ 어떻게 되면 다음으로 가나요? (완료 기준)
                    </div>
                    <div className="card-section-content">
                      {currentStep.expectedResult}
                    </div>
                  </div>

                  {/* Custom recovery instruction if generated by stuck screen uploader */}
                  {customRecoveryGuidance && (
                    <div className="card-section" style={{ backgroundColor: 'rgba(37, 99, 235, 0.05)', border: '2px solid var(--primary)' }}>
                      <div className="card-section-title" style={{ color: 'var(--primary)' }}>
                        🛠️ 현재 화면 맞춤 처방
                      </div>
                      <div className="card-section-content" style={{ fontWeight: 600, marginBottom: '12px' }}>
                        {customRecoveryGuidance}
                      </div>

                      {/* Concept 3: Visual Arrow Spotlight Annotation Overlay */}
                      {screenshotFile && recoveryCoordinates && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center', marginTop: '12px' }}>
                          <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--warning)', alignSelf: 'flex-start' }}>
                            📍 인공지능이 찾아낸 화면 위치 (아래 밝은 영역을 클릭하세요):
                          </span>
                          <div style={{ 
                            position: 'relative', 
                            borderRadius: '12px', 
                            overflow: 'hidden', 
                            border: '3px solid var(--warning)', 
                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                            maxWidth: '100%',
                            display: 'inline-block'
                          }}>
                            <img 
                              src={screenshotFile.data} 
                              alt="Spotlight target" 
                              style={{ display: 'block', maxWidth: '100%', height: 'auto', maxHeight: '350px' }} 
                            />
                            {/* Dark Spotlight overlay using huge box-shadow */}
                            <div style={{
                              position: 'absolute',
                              border: '4px solid #ef4444',
                              backgroundColor: 'rgba(239, 68, 68, 0.15)',
                              boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.65)',
                              borderRadius: '6px',
                              top: `${recoveryCoordinates[0] / 10}%`,
                              left: `${recoveryCoordinates[1] / 10}%`,
                              height: `${(recoveryCoordinates[2] - recoveryCoordinates[0]) / 10}%`,
                              width: `${(recoveryCoordinates[3] - recoveryCoordinates[1]) / 10}%`,
                              pointerEvents: 'none',
                              transition: 'all 0.5s ease-in-out'
                            }} />
                            {/* Pulse indicator target */}
                            <div style={{
                              position: 'absolute',
                              top: `${(recoveryCoordinates[0] + recoveryCoordinates[2]) / 20}%`,
                              left: `${(recoveryCoordinates[1] + recoveryCoordinates[3]) / 20}%`,
                              transform: 'translate(-50%, -50%)',
                              backgroundColor: '#ef4444',
                              color: 'white',
                              padding: '6px 12px',
                              borderRadius: '20px',
                              fontSize: '13px',
                              fontWeight: 'bold',
                              pointerEvents: 'none',
                              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              whiteSpace: 'nowrap'
                            }}>
                              <span style={{ 
                                display: 'inline-block', 
                                width: '6px', 
                                height: '6px', 
                                backgroundColor: 'white', 
                                borderRadius: '50%', 
                                animation: 'pulse 1s infinite' 
                              }}></span>
                              {currentStep.screenAnchor} 위치 📍
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Concept 5: Family SOS Shared Copier */}
                      {screenshotFile && (
                        <div style={{
                          marginTop: '16px',
                          padding: '12px 16px',
                          backgroundColor: '#f0fdf4',
                          border: '1px solid #bbf7d0',
                          borderRadius: 'var(--radius-sm)',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '8px',
                          width: '100%'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '15px', fontWeight: 800, color: '#166534' }}>👨‍👩‍👧‍👦 우리 아이 폰으로 SOS 도움 구하기</span>
                            <span style={{ fontSize: '12px', fontWeight: 700, backgroundColor: '#dcfce7', color: '#15803d', padding: '2px 8px', borderRadius: '12px' }}>효도 안심망 ❤️</span>
                          </div>
                          <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>
                            도무지 막혀서 어렵다면, 인공지능의 처방 내역과 캡처 화면을 자녀에게 카카오톡으로 간편히 전송해 물어보실 수 있습니다.
                          </p>
                          <button
                            type="button"
                            className="btn btn-success"
                            style={{ height: '40px', fontSize: '14px', alignSelf: 'flex-start', marginTop: '4px' }}
                            onClick={handleCopyFamilySOS}
                          >
                            💬 카카오톡 전송용 SOS 메시지 복사하기
                          </button>
                          {sosCopied && (
                            <span style={{ fontSize: '13px', color: '#15803d', fontWeight: 700, animation: 'pulse 1s infinite' }}>
                              ✓ 카톡 전송용 글자가 복사되었습니다! 자녀분과의 대화창에 붙여넣기(Ctrl+V) 하세요! 💌
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Collapsible Source Evidence */}
                <div className="collapsible">
                  <button 
                    className="collapsible-trigger"
                    onClick={() => setShowSource(!showSource)}
                  >
                    <span>원본 가이드 근거 보기</span>
                    <span>{showSource ? '▲' : '▼'}</span>
                  </button>
                  {showSource && (
                    <div className="collapsible-content">
                      <p style={{ fontStyle: 'italic', marginBottom: '8px' }}>"{currentStep.sourceEvidence}"</p>
                      <p style={{ fontSize: '14px', color: 'var(--text-light)', fontWeight: 600 }}>
                        출처 위치: {currentStep.sourceLocation}
                      </p>
                    </div>
                  )}
                </div>

                {/* Card Flow Controls */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
                  
                  {/* Completion Question Checkbox/Primary Button */}
                  <div style={{ backgroundColor: '#F8FAFC', padding: '16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', textAlign: 'center' }}>
                    <p style={{ fontWeight: 700, marginBottom: '12px', color: 'var(--text-main)', fontSize: '18px' }}>
                      {currentStep.completionQuestion}
                    </p>
                    <button 
                      className="btn btn-success"
                      onClick={handleNextStep}
                    >
                      완료했어요 ✓
                    </button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <button 
                      className="btn btn-secondary"
                      onClick={() => setShowRecoverySheet(true)}
                    >
                      화면이 달라요
                    </button>
                    
                    <button 
                      className="btn btn-secondary"
                      onClick={handleSkipStep}
                    >
                      이 단계 넘어가기
                    </button>
                  </div>

                  {currentStepIndex > 0 && (
                    <button 
                      className="btn btn-tertiary"
                      onClick={handlePrevStep}
                    >
                      ← 이전 단계로 돌아가기
                    </button>
                  )}
                </div>
              </div>

              {/* Mobile Back-to-Main Button */}
              <button 
                className="btn btn-tertiary"
                onClick={restartApp}
                style={{ display: 'block', alignSelf: 'center', marginTop: '10px' }}
              >
                처음 화면으로 돌아가기 (안내 분석 다시하기)
              </button>
            </div>
          </div>
        )}

        {/* COMPLETION STATE */}
        {appState === 'COMPLETION' && generatedData && (
          <div className="card" style={{ maxWidth: '580px', margin: '40px auto', width: '100%' }}>
            <div className="completion-container">
              <div className="completion-icon">✓</div>
              <h2 className="completion-title">모두 완료했어요!</h2>
              <p style={{ fontSize: '18px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                목표하신 <strong>"{generatedData.title}"</strong> 단계를 모두 끝마쳤습니다. 수고하셨습니다!
              </p>

              <div className="completion-summary-box">
                <p style={{ fontWeight: 700, fontSize: '16px', color: 'var(--text-muted)', borderBottom: '1px solid var(--border)', paddingBottom: '8px', marginBottom: '8px' }}>
                  진행한 행동 목록
                </p>
                {generatedData.cards.map((card) => (
                  <div key={card.stepNumber} className="completion-item">
                    <span className="completion-item-icon">✓</span>
                    <span>{card.action}</span>
                  </div>
                ))}
              </div>

              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <button 
                  className="btn btn-primary"
                  onClick={restartApp}
                >
                  새로운 가이드 시작
                </button>
                <button 
                  className="btn btn-secondary"
                  onClick={() => {
                    setAppState('CARDS');
                    setCurrentStepIndex(0);
                  }}
                >
                  완료한 단계 다시 보기
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* RECOVERY SHEET / OVERLAY */}
      {showRecoverySheet && currentStep && (
        <div className="overlay" onClick={() => setShowRecoverySheet(false)}>
          <div className="bottom-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="bottom-sheet-header">
              <h3 className="bottom-sheet-title">화면이 달라서 곤란하신가요?</h3>
              <button className="close-btn" onClick={() => setShowRecoverySheet(false)}>×</button>
            </div>

            <p style={{ fontSize: '16px', color: 'var(--text-muted)' }}>
              현재 눈앞에 보이는 화면 상태를 알려주시면 인공지능이 새로운 행동 팁을 알려드립니다.
            </p>

            {recoveryError && <div className="error-message">{recoveryError}</div>}

            {/* Stuck Problem options */}
            <div className="radio-group">
              {[
                '버튼이나 메뉴가 안 보여요',
                '가이드와 화면 내용이 달라요',
                '이전 단계로 돌아가고 싶어요',
                '오류 메시지나 경고창이 나타났어요'
              ].map((option) => (
                <div 
                  key={option}
                  className={`radio-option ${selectedProblem === option ? 'selected' : ''}`}
                  onClick={() => setSelectedProblem(option)}
                >
                  <input
                    type="radio"
                    className="radio-input"
                    checked={selectedProblem === option}
                    onChange={() => setSelectedProblem(option)}
                  />
                  <span>{option}</span>
                </div>
              ))}
            </div>

            {/* Option A: Demo Screen Presets for Easy Judging */}
            <div className="form-group" style={{ marginBottom: '16px', marginTop: '12px' }}>
              <label className="form-label" style={{ fontSize: '15px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}>
                💡 심사위원 및 테스트용 화면 캡처 추천 (원클릭 등록)
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  style={{ fontSize: '13px', padding: '10px', height: 'auto', border: '1px dashed var(--warning)', backgroundColor: '#fff7ed', fontWeight: 600, color: 'var(--warning)' }}
                  onClick={() => loadPresetScreenshot(1)}
                >
                  📝 예시 1: 서류 발급 경고창 캡처
                </button>
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  style={{ fontSize: '13px', padding: '10px', height: 'auto', border: '1px dashed var(--primary)', backgroundColor: '#eff6ff', fontWeight: 600, color: 'var(--primary)' }}
                  onClick={() => loadPresetScreenshot(2)}
                >
                  🚀 예시 2: 기후동행카드 계좌 조회 오류
                </button>
              </div>
            </div>

            {/* Screenshot file upload */}
            <div className="form-group" style={{ marginTop: '8px' }}>
              <label className="form-label" style={{ fontSize: '16px' }}>현재 화면 캡처 업로드 (선택)</label>
              
              <div 
                className="dropzone"
                style={{ padding: '20px 10px' }}
                onClick={() => screenshotFileInputRef.current?.click()}
              >
                {screenshotFile ? (
                  <div>
                    <p style={{ fontWeight: 600, color: 'var(--primary)', fontSize: '15px' }}>
                      화면 이미지가 업로드 되었습니다.
                    </p>
                    <button 
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeAttachedFile(true);
                      }}
                      style={{ color: 'red', marginTop: '6px', border: 'none', background: 'none', textDecoration: 'underline', cursor: 'pointer', fontSize: '13px' }}
                    >
                      업로드 취소
                    </button>
                  </div>
                ) : (
                  <div>
                    <p style={{ fontWeight: 700, fontSize: '15px' }}>📸 현재 화면 사진 올리기</p>
                    <p style={{ fontSize: '13px', color: 'var(--text-light)', marginTop: '4px' }}>
                      스마트폰 카메라로 찍은 사진이나 캡처 이미지
                    </p>
                  </div>
                )}
                <input
                  type="file"
                  ref={screenshotFileInputRef}
                  style={{ display: 'none' }}
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, true)}
                />
              </div>
              <p style={{ fontSize: '13px', color: 'var(--warning)', marginTop: '4px', fontWeight: 600 }}>
                ⚠️ 개인정보, 비밀번호 등 민감한 개인 정보는 사진에 포함되지 않도록 주의해 주세요.
              </p>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px' }}>
              <button 
                className="btn btn-primary"
                onClick={handleRecoverSubmit}
                disabled={isRecovering}
              >
                {isRecovering ? '안내 분석 중...' : '이 화면에 맞게 다시 안내받기'}
              </button>
              
              <button 
                className="btn btn-secondary"
                onClick={() => setShowRecoverySheet(false)}
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer style={{ padding: '24px', backgroundColor: 'white', borderTop: '1px solid var(--border)', marginTop: 'auto' }}>
        <p className="footer-note">
          StepCue MVP &copy; 2026. Antigravity | Google AI Studio 개발단. 모든 안내는 인공지능 분석 결과이므로 정확하지 않을 수 있습니다.
        </p>
      </footer>
    </div>
  );
}
