# StepCue 📍

> **"단 한 걸음의 카드"** — 시니어와 디지털 약자를 위한 구글 제미나이(Gemini) 기반 1인칭 가이드 오버레이 스크린.
>
> **StepCue** is a premium, accessibility-focused web application designed to bridge the digital divide for older adults and tech beginners. Powered by **Google Gemini 1.5 Flash**, it translates complex online tasks into simplified, distraction-free "Single-Action Cards" combined with interactive multi-modal spotlight coordination and voice assistance.

---

## 🎯 Key Core Features (핵심 기능)

1. **✨ Gemini 1.5 Flash AI Guide Generator**
   * 입력된 목표와 가이드 텍스트를 분석하여, 인지 과부하를 유발하지 않는 **3~8단계의 초간결 단일 액션 카드**로 변환합니다. (Zod / JSON Schema 구조화 명세 적용)
2. **🗣️ Interactive Voice Coach (음성 동반자)**
   * Web Speech API (`SpeechSynthesis`)를 연동하여 어르신에게 친숙하고 정서적으로 편안한 한국어 음성(여성/남성/구글 고음질) 선택 기능을 지원하며, 손쉬운 음성 인식 제어(`SpeechRecognition`)를 함께 연동했습니다.
3. **📍 Multi-modal Spotlight Mask (어둠 속 조준 조명)**
   * 화면 진행이 막혔을 때 스마트폰 화면을 캡처하여 올리면, 제미나이 비전이 해당 스크린 내의 Target 요소를 정밀 좌표 분석(`[ymin, xmin, ymax, xmax]`)해내어 **나머지 화면을 검게 가리고 특정 위치만 조명처럼 밝게 스포트라이트**를 쏴 줍니다.
4. **🚨 Family SOS Care Network (효도 안심망)**
   * 해결이 어려울 경우 어르신이 겪고 있는 정교한 에러 정황, 현재 단계, AI 조치법을 카카오톡용 안부 문자 형식으로 원클릭 조합 복사하여 자녀에게 즉시 도움을 청할 수 있습니다.

---

## 📂 Project Directory Structure (프로젝트 구조)

가독성을 높이고 해커톤 심사를 체계적으로 지원하기 위해 문서와 코드를 정비하였습니다.

```text
StepCue/
├── docs/                             # 📄 상세 기획 및 가이드 문서 폴더
│   ├── PRD.md                        # 제품 요구 사양서 (Product Requirements Document)
│   ├── DEMO_VIDEO_SCRIPT.md          # 150초 분량 해커톤 데모 영상 스토리보드 및 발표 대본
│   ├── WALKTHROUGH.md                # 기술 구현 상세 보고서 (Walkthrough)
│   └── google_cloud_deployment.md    # 구글 클라우드 런(Cloud Run) 배포 및 IAM 가이드라인
├── src/
│   ├── app/                          # Next.js App Router (UI & Styling)
│   │   ├── globals.css               # 중앙 프리미엄 정렬 및 CSS Spotlight 스타일시트
│   │   ├── layout.tsx                # 기본 HTML 메타 태그 및 SEO 설정
│   │   └── page.tsx                  # 메인 대시보드 및 리얼 데모 프리셋 연동
│   ├── lib/
│   │   └── gemini.ts                 # @google/genai SDK 연동 및 API 호출 로직
│   └── types/                        # TypeScript 전용 데이터 검증 스키마 선언
├── public/                           # 이미지 및 미디어 정적 리소스
├── deploy.ps1 / deploy.sh            # 구글 클라우드 자동화 배포 스크립트 (PS & Bash)
└── cloudbuild.yaml                   # Google Cloud Build 트리거 설정 파일
```

---

## 🛠️ Getting Started (시작 가이드)

### 1. Prerequisites (환경 요구 사항)
* Node.js v18 이상 설치
* 구글 제미나이 API 키 발급 ([Google AI Studio](https://aistudio.google.com/))

### 2. Installation (의존성 설치)
```bash
# 의존성 패키지 설치
npm install
```

### 3. Environment Configuration (환경변수 설정)
프로젝트 루트 경로에 `.env.local` 파일을 생성하고 아래 키를 입력합니다.
```env
GEMINI_API_KEY=your_actual_gemini_api_key_here
```

### 4. Run Development Server (로컬 서버 구동)
```bash
npm run dev
```
브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 기후동행카드 예시 2번 등을 즉시 원클릭으로 테스트해볼 수 있습니다.

---

## 🏆 Hackathon Tracks & Impact

* **Track Selection**: **Google AI for Social Good (사회적 약자 구출 트랙)**
* **Technical Excellence**: Gemini 1.5 Flash의 비전 분석과 CSS 스포트라이트를 동적으로 연계하여, 기존의 텍스트 기반 AI 챗봇의 한계를 깨고 시각적/물리적인 '스포트라이트 조준 조명'이라는 극상의 실용성을 제공합니다.

---

### 📝 상세 개발 기록 및 연혁
* **[제품 요구 사양서 (PRD)](./docs/PRD.md)**: 전체 아키텍처 및 페르소나 분석
* **[기능 구현 가이드 (Walkthrough)](./docs/WALKTHROUGH.md)**: 단계별 작업 요약 및 QA 검증 방안
* **[데모 영상 대본 (Demo Script)](./docs/DEMO_VIDEO_SCRIPT.md)**: 150초 피칭 완벽 가이드
