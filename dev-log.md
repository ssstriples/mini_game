# 🐿️ 다람이의 도토리 기억 숲 — 개발 기술 문서 (작업 일지)

> Phaser 3 + React + TypeScript 기반 유아 교육 게임  
> 각 Phase 완료 시 실제 명령어·결과·이슈를 기록합니다.

---

## 📋 작업 환경

| 항목 | 값 |
|------|----|
| **OS** | Windows 11 |
| **Shell** | bash (Git Bash) |
| **Node.js** | `v22.20.0` |
| **pnpm** | `v10.9.3` |
| **에디터** | VS Code |
| **작업 시작일** | 2026-04-27 |

---

## PHASE 0 — 개발 환경 세팅

### ✅ G001 — Node.js 버전 확인
- **날짜**: 2026-04-27
- **명령어**:
  ```bash
  node -v
  ```
- **결과**: `v22.20.0` (v20 이상 요건 충족)
- **상태**: ✅ 완료

---

### ✅ G002 — pnpm 설치 확인
- **날짜**: 2026-04-27
- **명령어**:
  ```bash
  pnpm -v
  ```
- **결과**: `v10.9.3` (v9 이상 요건 충족)
- **상태**: ✅ 완료

---

## PHASE 0 — G005~G011 (Vite 프로젝트 + 의존성)

### ✅ G005 — Vite + React + TypeScript 프로젝트 생성
- **날짜**: 2026-04-27
- **생성 위치**: `d:\LSH_GITHUB\mini-game\game\`
- **명령어**:
  ```bash
  pnpm create vite@latest game -- --template react-ts
  cd game && pnpm install
  ```
- **결과**: Vite `v8.0.10` + React `v19.2.5` + TypeScript 프로젝트 생성
- **상태**: ✅ 완료

---

### ✅ G006 — 기본 실행 확인
- **날짜**: 2026-04-27
- **결과**: `http://localhost:5173` 정상 접속 확인
- **상태**: ✅ 완료

---

### ✅ G007 — 보일러플레이트 제거
- **날짜**: 2026-04-27
- **작업**: `App.tsx` 초기화, `index.css` 초기화
- **상태**: ✅ 완료

---

### ✅ G008 — 핵심 의존성 설치
- **날짜**: 2026-04-27
- **명령어**:
  ```bash
  pnpm add phaser@3.88.2 howler gsap zustand react-confetti
  pnpm add -D @types/howler
  ```
- **설치된 패키지**:
  | 패키지 | 버전 |
  |--------|------|
  | phaser | `3.88.2` (⚠️ 4.0.0 자동설치 → 3.88.2로 다운그레이드) |
  | howler | `2.2.4` |
  | gsap | `3.15.0` |
  | zustand | `5.0.12` |
  | react-confetti | `6.4.0` |
  | @types/howler | `2.2.12` |
- **이슈**: `pnpm add phaser` 시 Phaser 4.0.0 설치됨 → `pnpm add phaser@3.88.2`로 재설치
- **상태**: ✅ 완료

---

### ✅ G009 — Tailwind CSS v4 설치
- **날짜**: 2026-04-27
- **명령어**:
  ```bash
  pnpm add tailwindcss @tailwindcss/vite
  ```
- **설치된 패키지**: `tailwindcss@4.2.4`, `@tailwindcss/vite@4.2.4`
- **변경 파일**:
  - `vite.config.ts` → `tailwindcss()` 플러그인 추가
  - `src/index.css` → `@import "tailwindcss"` 첫 줄 추가
- **상태**: ✅ 완료

---

### ✅ G010 — PWA 플러그인 설치
- **날짜**: 2026-04-27
- **명령어**: `pnpm add -D vite-plugin-pwa`
- **설치**: `vite-plugin-pwa@1.2.0`
- **비고**: vite-plugin-pwa peer deps 경고 (Vite 8 미지원) — 동작에는 영향 없음
- **상태**: ✅ 완료

---

### ✅ G011 — Prettier 설정
- **날짜**: 2026-04-27
- **명령어**: `pnpm add -D prettier eslint-config-prettier`
- **생성 파일**: `game/.prettierrc`
  ```json
  { "semi": false, "singleQuote": true, "tabWidth": 2, "trailingComma": "es5", "printWidth": 100 }
  ```
- **상태**: ✅ 완료

---

### ✅ G008~G011 종합 확인
- `pnpm dev` → `localhost:5173` 에러 없이 실행 ✅
- `node_modules/phaser` 존재 ✅
- `node_modules/howler` 존재 ✅
- Tailwind `@import` 적용 ✅

---

## 🏗️ Phase 1 — 프로젝트 폴더 구조 & 타입 정의 (2026-04-27)

### G013 — src/ 폴더 구조 생성
```bash
mkdir -p src/game/scenes src/game/objects src/game/config src/game/store src/components src/hooks
```
생성된 폴더:
- `src/game/scenes/` `src/game/objects/` `src/game/config/` `src/game/store/`
- `src/components/` `src/hooks/`

### G014 — .gitkeep 생성
각 빈 폴더에 `.gitkeep` 추가 (Git 추적용)

### G015 — `src/game/config/types.ts`
- `GamePhase`: `'idle' | 'memorize' | 'play' | 'result' | 'complete'`
- `HidingSpot`: id, key, label, x, y, spriteFrame
- `RoundResult`: 라운드별 정답 여부 + 반응속도
- `GameResult`: 전체 결과 집계
- `SfxKey`: 5종 효과음 키
- `Difficulty` + `DifficultyConfig`: easy/normal/hard 난이도 설정

### G016 — `src/game/config/spots.ts`
- `SPOTS_DATA`: 8개 장소 (나무 뒤, 바위 아래, 덤불 속, 땅속 구멍, 통나무 위, 버섯 옆, 꽃밭 속, 연못 근처)
- 좌표는 캔버스 기준 **비율값** (0~1)으로 정의
- `getSpotById()` 헬퍼 함수 포함

### G017 — `src/game/config/gameConfig.ts`
- `CANVAS_WIDTH = 1024`, `CANVAS_HEIGHT = 600`
- `PHASER_CONFIG`: `Phaser.Scale.FIT` + `CENTER_BOTH`, `backgroundColor: '#87CEEB'`
- `DIFFICULTY_CONFIG`: easy(3라운드/4초/4장소), normal(5라운드/3초/6장소), hard(7라운드/2초/8장소)
- `ANIM` 상수: 애니메이션 타이밍값

### G018 — `src/game/store/gameStore.ts`
- Zustand `create()` 로 싱글톤 스토어 구성
- 상태: `phase`, `difficulty`, `currentRound`, `score`, `targetSpotId`, `roundResults`, `gameResult`
- 액션: `startGame`, `setMemorizePhase`, `setPlayPhase`, `selectSpot`, `nextRound`, `endGame`, `resetGame`
- `selectSpot()` 에서 반응속도(`reactionTimeMs`) 자동 계산

### G019 — `src/components/GameCanvas.tsx`
- `useRef<HTMLDivElement>` + `useRef<Phaser.Game>` 패턴
- `useEffect` 마운트 시 `new Phaser.Game(config)` 생성, 언마운트 시 `destroy(true)` 정리
- `scenes` prop으로 씬 목록 외부 주입 (의존성 분리)

### G020 — `src/App.tsx` 업데이트
- Tailwind `w-screen h-screen` 레이아웃
- `GameCanvas scenes={SCENES}` 렌더링 (씬은 이후 단계에서 추가)

### G021 — TypeScript 컴파일 확인
```bash
pnpm tsc --noEmit
# → 출력 없음 (에러 0개) ✅
```

---

## 🎨 Phase 2 + 🚀 Phase 3 — 씬 구현 (2026-04-27)

### G024 — `src/game/scenes/PreloaderScene.ts`
Phaser `Graphics.generateTexture()` 로 런타임 placeholder 텍스처 생성.  
실제 PNG 없이도 게임 실행 가능한 구조.

| 텍스처 키 | 크기 | 설명 |
|---|---|---|
| `bg-forest` | 1024×600 | 하늘(#87CEEB) + 땅(#4A7C59) 2색 배경 |
| `acorn` | 40×40 | 갈색 모자 + 밤색 몸통 원형 |
| `spot_tree` ~ `spot_pond` | 88×88 | 8개 장소 색상 원형 아이콘 |
| `squirrel` | 80×100 | 주황 다람이 (몸통+귀+눈 구성) |
| `leaf` | 30×30 | 주황 낙엽 타원 |
| `star` | 48×48 | 황금색 별 (결과 화면용) |

- `create()` 마지막에 `this.scene.start('MainMenuScene')` 자동 전환

### G025 — `src/game/scenes/MainMenuScene.ts`
| 요소 | 구현 |
|---|---|
| 배경 | `bg-forest` 전체 화면 |
| 타이틀 | 2줄 텍스트 + 흰 테두리 stroke |
| 다람이 | 중앙 배치 + `Sine.easeInOut` yoyo Tween |
| 난이도 버튼 | easy/normal/hard 3개 — 선택 시 테두리 강조 + `gameStore.setDifficulty()` |
| 시작 버튼 | `startGame()` → `fadeOut(300)` → `GameScene` 전환 |
| 진입 효과 | `cameras.main.fadeIn(400)` |

### G026 — `src/game/scenes/GameScene.ts`
핵심 게임 루프 씬. 단계: `memorize → play → result → nextRound or complete`

| 기능 | 구현 |
|---|---|
| 장소 아이콘 | 난이도별 `spotCount`만큼 배치 (비율 좌표 → 절대 좌표 변환) |
| 기억 단계 | 랜덤 타깃 선택 → 다람이 이동 Tween → 도토리 숨기기 연출 → 타이머 바 |
| 타이머 바 | progress 값 Tween → 남은 시간 비율 그린색→빨강색 전환 |
| 선택 단계 | `pointerdown` 이벤트 → `store.selectSpot()` → 정답/오답 피드백 텍스트 |
| 라운드 전환 | 1.8초 후 `nextRound()` 또는 `endGame()` → `ResultScene` |
| HUD | 라운드 번호 + 단계 안내 텍스트 실시간 갱신 |

### G027 — `src/game/scenes/ResultScene.ts`
| 요소 | 구현 |
|---|---|
| 결과 패널 | 반투명 흰색 라운드 패널 + 주황 테두리 |
| 별 점수 | 3개 별 — 정답률에 따라 1/2/3개 채움, `Back.easeOut` 등장 Tween |
| 칭찬 메시지 | 별 수에 따른 3단계 메시지 |
| 버튼 | 🔄 다시하기 → `GameScene` / 🏠 처음으로 → `MainMenuScene` |

### G028 — `App.tsx` 씬 연결
```ts
const SCENES = [PreloaderScene, MainMenuScene, GameScene, ResultScene]
```
4개 씬이 순서대로 Phaser에 등록됨.  
첫 씬은 `PreloaderScene` → 자동으로 `MainMenuScene` 전환.

### G029 — 개발 서버 실행 확인
- `pnpm tsc --noEmit` → 에러 0개 ✅
- `localhost:5173` 에서 Phaser 캔버스 렌더링 확인 ✅

<!-- 이하 작업 진행하면서 자동 추가됩니다-->

---

## 🔊 Phase 9 — 사운드 시스템 (2026-04-27)

### G076 — `src/game/managers/AudioManager.ts` 생성

Howler.js 기반 싱글톤 오디오 매니저.

| 항목 | 내용 |
|---|---|
| **SFX 5종** | `correct` / `wrong` / `click` / `complete` / `memorize` |
| **BGM** | `forest-ambient.mp3` 루프 (`volume: 0.3`) |
| **Graceful fallback** | `onloaderror` → 콘솔 경고만, 게임 중단 없음 |
| **음소거** | `toggleMute()` → `Howler.volume(0)` + BGM pause |
| **볼륨** | `setVolume(0~1)` → `Howler.volume()` 전체 적용 |
| **localStorage** | `darame_muted` / `darame_volume` 키로 자동 저장·복원 |
| **초기화** | `AudioManager.init()` — `PreloaderScene.create()` 에서 1회 호출 |

```ts
// 사용 예시
AudioManager.init()          // PreloaderScene에서 최초 1회
AudioManager.playBgm()       // MainMenuScene 진입 시
AudioManager.playSfx('correct')  // 정답 시
AudioManager.toggleMute()    // 음소거 토글
```

### G077 — 각 씬에 AudioManager 연결

| 씬 | 연결 내용 |
|---|---|
| `PreloaderScene` | `create()` 에서 `AudioManager.init()` 호출 |
| `MainMenuScene` | `create()` 에서 `AudioManager.playBgm()` / 난이도·시작 버튼 `playSfx('click')` |
| `GameScene` | 기억 단계 시작 시 `playSfx('memorize')` / 정답 `playSfx('correct')` / 오답 `playSfx('wrong')` / 게임 완료 `playSfx('complete')` |
| `ResultScene` | 버튼 클릭 시 `playSfx('click')` |

**컴파일 확인**: `pnpm tsc --noEmit` → 에러 0개 ✅

---

## 🗣️ TTS + 🔇 음소거 UI (2026-04-28)

### G078 — `src/game/managers/TTSManager.ts` 생성

Web Speech API 기반 한국어 TTS 싱글톤.

| 항목 | 내용 |
|---|---|
| **API** | `window.speechSynthesis` (설치 불필요, 무료) |
| **언어** | `ko-KR` / rate 0.9 / pitch 1.1 (유아 친화적) |
| **Fallback** | 미지원 브라우저에서 조용히 무시 |
| **음소거 연동** | `setMuted(true)` 시 즉시 발화 중단 |

**TTS 안내 문구 6종**:
| 키 | 문구 |
|---|---|
| `welcome` | 안녕하세요! 다람이와 함께 도토리를 찾아봐요! |
| `memorize` | 다람이가 도토리를 숨기고 있어요. 잘 기억해 두세요! |
| `play` | 어디에 숨겼을까요? 장소를 클릭해 보세요! |
| `correct` | 맞았어요! 정말 잘했어요! |
| `wrong` | 아쉬워요. 다음엔 찾을 수 있을 거예요! |
| `complete` | 게임이 끝났어요! 정말 대단해요! |

### G079 — 각 씬에 TTS 연동

| 씬 | 연동 위치 | TTS 키 |
|---|---|---|
| `MainMenuScene` | `create()` 진입 시 | `welcome` |
| `GameScene` | 기억 단계 시작 | `memorize` |
| `GameScene` | 플레이 단계 전환 | `play` |
| `GameScene` | 정답 선택 | `correct` |
| `GameScene` | 오답 선택 | `wrong` |
| `GameScene` | 게임 완료 | `complete` |

### G080 — `src/components/MuteButton.tsx` 생성

React 고정 버튼 컴포넌트 (우상단 `fixed top-3 right-3`).

| 기능 | 구현 |
|---|---|
| 아이콘 | 🔊 (소리 켜짐) / 🔇 (음소거) |
| 클릭 | `AudioManager.toggleMute()` + `TTSManager.setMuted()` 동시 처리 |
| 상태 | React `useState`로 아이콘 실시간 갱신 |
| 스타일 | Tailwind `fixed z-50` 반투명 원형 버튼 |
| 접근성 | `aria-label` + `title` 속성 포함 |

`App.tsx`에서 `<MuteButton />` 를 `<GameCanvas />` 와 나란히 렌더링.

---

## 🔤 Phase 11 — 한글 폰트 적용 (2026-04-28)

### G093 — Noto Sans KR Google Fonts 적용

**변경 파일**:

| 파일 | 변경 내용 |
|---|---|
| `index.html` | `lang="ko"` 설정 / 타이틀 한글화 / `<meta description>` 추가 / Google Fonts `preconnect` + `link` 태그 추가 |
| `src/index.css` | `body { font-family: 'Noto Sans KR', sans-serif }` 전역 설정 |
| `src/game/config/gameConfig.ts` | `FONT` 상수 추가: `"'Noto Sans KR', Arial, sans-serif"` |
| `MainMenuScene.ts` | 타이틀 텍스트 `fontFamily: FONT` 적용 |
| `GameScene.ts` | 라운드/단계 텍스트 `fontFamily: FONT` 적용 |
| `ResultScene.ts` | 결과 타이틀·점수 텍스트 `fontFamily: FONT` 적용 |

**로딩 최적화**:
```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
```
`preconnect`로 DNS 조회·TLS 핸드셰이크를 미리 수행해 폰트 로딩 지연 최소화.

**적용 폰트 웨이트**: 400 (본문) / 700 (강조) / 900 (타이틀)

---

## ⚛️ Phase 10 — React UI 레이어 (2026-04-28)

### G084 — `src/components/StartScreen.tsx` 생성

게임 시작 전 React 오버레이 화면.

| 요소 | 구현 |
|---|---|
| **배경** | `fixed inset-0 backdrop-blur-sm bg-black/70` — Phaser 캔버스 위에 오버레이 |
| **타이틀** | 🐿️ 이모지 + 2줄 한글 제목 + 설명 문구 |
| **난이도 버튼** | easy/normal/hard 3개 — 선택 시 `ring` 테두리 + `scale-105` 강조 |
| **시작 버튼** | 클릭 시 `setDifficulty()` + `startGame()` + `onStart()` 순서 실행 |
| **안내** | 하단 소리 안내 문구 |

**App.tsx 변경**:
```tsx
const [showStart, setShowStart] = useState(true)

// Phaser 캔버스 위에 StartScreen 오버레이
{showStart && <StartScreen onStart={() => setShowStart(false)} />}
```
- `showStart = true` → React StartScreen 표시 (Phaser는 PreloaderScene 대기 상태)
- 시작 버튼 클릭 → `showStart = false` → StartScreen 언마운트 → Phaser가 GameScene으로 전환

### G085 — `src/components/ResultPopup.tsx` 생성

게임 완료 시 React 오버레이 결과 화면.

| 요소 | 구현 |
|---|---|
| **Confetti** | `react-confetti` — 만점(3라운드 전부 정답) 시 5초간 폭죽 |
| **별 점수** | ⭐×3 — 정답률에 따라 opacity + scale 분기 |
| **점수 표시** | `${total}개 중 ${correct}개 맞혔어요!` |
| **칭찬 메시지** | 별 수에 따른 3단계 메시지 |
| **버튼** | 🔄 다시하기 (`resetGame()` + `onReplay()`) / 🏠 처음으로 (`resetGame()` + `onHome()`) |
| **반응형** | `window.resize` 이벤트로 confetti 크기 동적 갱신 |

**App.tsx 최종 구조**:
```tsx
<main>
  <GameCanvas />          // Phaser 캔버스 (항상 렌더링)
  <MuteButton />          // 우상단 음소거 버튼 (항상 렌더링)
  {showStart && <StartScreen />}          // 시작 전 오버레이
  {shouldShowResult && <ResultPopup />}   // 완료 후 오버레이
</main>
```
`phase === 'complete'` (Zustand) 를 구독해 ResultPopup 자동 표시.

---

## 🪝 Phase 10 추가 — useWindowSize 훅 (2026-04-28)

### G086 — `src/hooks/useWindowSize.ts` 생성

| 항목 | 내용 |
|---|---|
| **반환값** | `{ width: number, height: number }` |
| **이벤트** | `window.resize` 자동 등록/해제 (`useEffect` cleanup) |
| **초기값** | 마운트 시 `window.innerWidth / innerHeight` |
| **활용처** | `ResultPopup.tsx` — `ReactConfetti` width·height 주입 |

기존 `ResultPopup.tsx`의 인라인 resize 로직을 훅으로 교체:
```tsx
// Before (인라인)
const [windowSize, setWindowSize] = useState(...)
useEffect(() => { window.addEventListener('resize', ...) }, [])

// After (훅 활용)
const { width, height } = useWindowSize()
```

---

## 📦 Phase 12 — PWA 설정 & 빌드 (2026-04-28)

### G096 — `vite.config.ts` PWA 플러그인 설정

`vite-plugin-pwa` (VitePWA) 설정 추가.

| 항목 | 설정값 |
|---|---|
| `registerType` | `autoUpdate` — 새 버전 자동 업데이트 |
| `display` | `standalone` — 브라우저 UI 없이 앱처럼 실행 |
| `orientation` | `landscape` — 가로 고정 (1024×600 게임) |
| `theme_color` | `#ff6b35` (주황) |
| `background_color` | `#1a1a2e` (어두운 남색) |

**Workbox 캐싱 전략**:

| 패턴 | 전략 | 캐시명 | 유효기간 |
|---|---|---|---|
| `fonts.googleapis.com` | CacheFirst | `google-fonts-cache` | 1년 |
| `fonts.gstatic.com` | CacheFirst | `gstatic-fonts-cache` | 1년 |
| `/assets/sounds/*` | CacheFirst | `sounds-cache` | 30일 |

### G097 — PWA 아이콘 폴더 생성

- `public/icons/` 폴더 생성
- `public/icons/README.md` — 아이콘 제작 가이드 작성
  - 필요 파일: `icon-192.png` (192×192) / `icon-512.png` (512×512)
  - 추천 생성 도구: realfavicongenerator.net / pwabuilder.com

### G098 — `pnpm build` 빌드 확인

```
✓ 37 modules transformed
dist/index.html                  1.08 kB
dist/assets/index-*.css         16.84 kB (gzip: 3.85 kB)
dist/assets/index-*.js       1,454.45 kB (gzip: 398.00 kB)
✓ built in 6.18s

PWA v1.2.0  mode: generateSW
precache  7 entries (1438.00 KiB)
dist/sw.js        ← Service Worker 생성 ✅
dist/workbox-*.js ← Workbox 런타임 생성 ✅
```

> ⚠️ 청크 크기 경고: `index.js` 1.4MB (phaser 라이브러리 포함). 현재는 허용, 추후 동적 import로 분할 가능.









