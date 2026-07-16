# StepCue Feature Enhancement & Deployment Walkthrough

We have successfully implemented two cutting-edge core features: **Voice Coach (Concept 2)** and **Visual Screenshot Spotlight Annotation (Concept 3)**.

Furthermore, we implemented two high-impact hackathon-focused capabilities: **Instant Mock Screenshot Presets (Option A)** and **Family SOS Copy Network (Option B)**, aligning StepCue with the highest evaluation standards of **Technical Demo depth**, **Social Good impact**, and **Creativity**.

Additionally, all configurations and automated deployment scripts for **Google Cloud Run** are fully prepared.

---

## 🏗️ Architectural Overview

The diagram below illustrates how StepCue uses Google Gemini model capabilities to provide a hands-free voice coach, visual overlay troubleshooting, and family-oriented social good integrations.

```mermaid
graph TD
    User([Senior User]) -->|1. Speaks Commands / Navigates| App[Next.js Frontend]
    App -->|2. Text-to-Speech| TTS[Web Speech API Synthesis]
    TTS -->|Voice Guidance| User
    
    User -->|3. Loads Preset / Uploads Screenshot| App
    App -->|4. Requests Recovery Tips & Coordinates| API[/api/recover]
    API -->|5. Multi-modal Analysis| Gemini[Gemini 2.5 Flash]
    
    Gemini -->|6. Returns Recovery Text & Coordinates| API
    API -->|7. Sends JSON Response| App
    App -->|8. Renders Dark Spotlight Overlay| Overlay[CSS Spotlight Highlight]
    Overlay -->|Visually Points out Elements| User
    
    Overlay -->|9. Copy SOS Message| Clipboard[System Clipboard]
    Clipboard -->|10. Send on KakaoTalk| Family([Caring Family Member])
```

---

## ✨ Implemented Core Features

### 1. 🎙️ Senior Voice Assistant & Coach (Concept 2)
To provide hands-free operation and ease of use for senior citizens, we integrated the browser-native **HTML5 Web Speech API** directly into [page.tsx](src/app/page.tsx):

*   **Auto-Voice Coach (Text-to-Speech)**: Reads the active step's instructions, expected results, and completed triggers in natural Korean (`ko-KR`) when navigating cards. It automatically reads out custom recovery prescriptions if they are fetched from Gemini.
*   **Dynamic Voice Customization**: Available Korean synthesized voices (such as high-fidelity Google Online Voices, Microsoft Yuna, Heami, SunHi, or InJoon) are dynamically fetched from the user's browser environment. We added a **Voice Selector** allowing users to switch between female, male, or premium voice tones. Technical names are mapped to warm, friendly Korean labels (e.g., `👩 다정한 여성음성 (유나)`, `👨 신뢰감 남성음성 (인준)`).
*   **Hands-Free Voice Navigation (Speech-to-Text)**: A real-time voice listener that triggers actions based on voice commands:
    *   *"다음"* / *"완료"* &rarr; Advances to the next card.
    *   *"이전"* / *"뒤로"* &rarr; Goes back to the previous step.
    *   *"도와줘"* / *"화면이 달라"* &rarr; Instantly launches the **Recovery Prescription Bottom Sheet**.
    *   *"다시"* / *"다시 읽어줘"* &rarr; Repeats the current step's instructions.

### 2. 📍 Multi-modal Screenshot Spotlight Annotation (Concept 3)
When users run into a mismatch or missing menu on their screen, they can upload a screenshot of their smart device or PC. Gemini now highlights exactly where they need to click:

*   **Gemini Coordinate Tracking**: We updated `recoverStepAction` in [gemini.ts](src/lib/gemini.ts) to utilize Gemini's multi-modal object detection. It now returns the bounding box `[ymin, xmin, ymax, xmax]` normalized on a scale of `0` to `1000`.
*   **CSS Spotlight Effect**: Inside the Custom Recovery Card, we render a relative image container. On top of it, a customized absolute-positioned overlay dims everything except the target element using a sleek `box-shadow` mask:
    ```css
    box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.65);
    ```
    This creates a bright circular/rounded highlight over the target button or input field, along with a pulsing indicator saying **"현재 위치 📍"** to guide the user precisely.

---

## 🏆 Hackathon-Specific High-Value Features

To make the technical demonstration exceptionally smooth and amplify our social impact scoring, we added two new premium components:

### 3. 💡 Instant Demo Screen Presets (Option A)
*   **Problem Solved**: Judges may not have a relevant smart device screenshot ready on their test computers, hindering their ability to test the multi-modal spotlight coordination mapping.
*   **Implementation**: Inside the Recovery Bottom Sheet, we added two pre-packaged **Demo Preset Buttons** that load text-based, high-fidelity SVGs as base64 images representing mock smartphone displays:
    1.  *Preset 1 (정부24 민원 서류 발급 경고창)*: Simulates a certificate authentication failure with a red alert banner.
    2.  *Preset 2 (기후동행카드 은행계좌 인증 오류)*: Simulates a Seoul Climate Card refund application form where bank account name validation fails (such as using a child's account instead of the registered card user's), displaying a red mismatch error box.
*   **Result**: Judges can test the full, end-to-end Gemini screen annotation pipeline and coordinate spotlight with **just one click**, making our technical demo highly reliable, stable, and foolproof.

### 4. 👨‍👩‍👧‍👦 Family SOS Care Network (Option B)
*   **Problem Solved**: If a senior user is still confused or anxious even after reading the AI prescription, they need a safe, easy way to involve their family.
*   **Implementation**: In the custom recovery card under the spotlight image, we rendered a warm **"우리 아이 폰으로 SOS 도움 구하기 (효도 안심망)"** block. Clicking the KakaoTalk SOS copy button formats a beautiful, emotional Korean message:
    ```text
    [StepCue 부모님 안심 SOS 🚨]
    아들/딸아, 엄마/아빠가 휴대폰으로 "[주민센터 행정 복사하기]"을(를) 하던 중에 막혀서 도움이 필요해!
    
    - 현재 단계: 3단계 (간편인증 진행하기)
    - 찾아볼 화면 위치: "인증 확인"
    - 발생한 문제 유형: "오류 메시지나 경고창이 나타났어요"
    - 인공지능 임시 조치법: "팝업 차단 설정을 해제하고 본인 인증을 시도해 보세요..."
    
    이 화면 사진이랑 조치법 같이 보고 카톡이나 전화로 좀 알려주면 고맙겠구나. ❤️
    ```
*   **Result**: The message is copied immediately to the clipboard with an animating green confirmation badge, so the parent can easily paste it into KakaoTalk. This provides an absolute home run for the **Google AI for Social Good** track.

---

## 🚀 Google Cloud Deployment Assets

All Google Cloud deployment configurations have been created and optimized:

| Asset File | Platform | Description |
| :--- | :--- | :--- |
| [**`cloudbuild.yaml`**](cloudbuild.yaml) | Cloud Build | Automates multi-stage Docker compilation, image registration to Artifact Registry, and serverless Cloud Run deployment. |
| [**`deploy.ps1`**](deploy.ps1) | Windows PowerShell | Verifies gcloud CLI state, enables APIs, provisions registries, and runs deployment with full stderr/stdout suppression wrapper. |
| [**`deploy.sh`**](deploy.sh) | Linux / macOS | Colored Bash automation pipeline wrapping gcloud setups and deployment triggers. |
| [**`google_cloud_deployment.md`**](google_cloud_deployment.md) | Markdown | Clear, premium deployment manual containing instructions on CLI setup, credentials, and API environment variable management. |

---

## 🛠️ Verification & Next Steps

1.  **Code Security**: Verified that all imports, React hooks, and TypeScript types compile cleanly.
2.  **To Test Demo Presets**:
    *   Navigate to any step card, click **"화면이 달라요"**.
    *   Click either **"예시 1"** or **"예시 2"** under the 추천 목록.
    *   Click **"이 화면에 맞게 다시 안내받기"** to see Gemini instantly crop, annotate, and highlight the mock screen.
3.  **To Test Family SOS**:
    *   Once a prescription is loaded, click the green KakaoTalk SOS button and paste it anywhere (Notepad, chat, etc.) to see the beautifully composed message.
