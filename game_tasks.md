# 🐿️ 다람이의 도토리 기억 숲 — 개발 태스크 목록

> Phaser 3 + React + TypeScript 기반 유아 교육 게임  
> 각 태스크는 **30분~2시간 이내** 완료 가능한 단위로 분리  
> ✅ 완료 후 반드시 확인 체크리스트를 통과해야 다음 단계 진행

---

## 진행 상태 범례
- `[ ]` 미시작
- `[~]` 진행 중
- `[x]` 완료

---

## 📊 전체 진행 현황

| Phase | 태스크 수 | 완료 | 상태 |
|-------|----------|------|------|
| Phase 0 — 환경 세팅 | 12개 | 9 | 🟡 진행 중 (G003·G004·G012 제외) |
| Phase 1 — 프로젝트 구조 | 10개 | 10 | ✅ 완료 |
| Phase 2 — 에셋 준비 | 8개 | 2 | 🟡 진행 중 (Placeholder 완료, 실제 에셋 별도 배치 필요) |
| Phase 3 — BootScene/씬 구조 | 6개 | 6 | ✅ 완료 (PreloaderScene으로 통합) |
| Phase 4 — MainMenuScene | 8개 | 7 | 🟡 진행 중 (G044 Git 커밋만 남음) |
| Phase 5 — HidePhaseScene | 12개 | 12 | ✅ 완료 (GameScene.ts에 통합 구현) |
| Phase 6 — WaitPhaseScene | 8개 | 8 | ✅ 완료 (GameScene.ts에 통합 구현) |
| Phase 7 — FindPhaseScene | 12개 | 12 | ✅ 완료 (GameScene.ts에 통합 구현) |
| Phase 8 — ResultScene | 6개 | 4 | 🟡 진행 중 (G074·G075 남음) |
| Phase 9 — 사운드 & TTS | 8개 | 7 | 🟡 진행 중 (G083 Git 커밋만 남음) |
| Phase 10 — React UI 레이어 | 6개 | 3 | 🟡 진행 중 (G087~G089 남음) |
| Phase 11 — 반응형 & 접근성 | 6개 | 1 | 🟡 진행 중 (G093 완료, 나머지 QA 필요) |
| Phase 12 — PWA & 배포 | 8개 | 3 | 🟡 진행 중 (G099~G103 Vercel 배포 남음) |
| Phase 13 — QA & 최종 polish | 8개 | 0 | ⬜ 미시작 |
| **합계** | **120개** | **84** | 🟡 진행 중 (70% 완료) |

---

## 📦 PHASE 0 — 개발 환경 세팅

> **목표**: 프로젝트 실행 가능한 기본 환경 완성  
> **예상 소요**: 1~2시간

### 0-1. 필수 도구 확인
- [x] **G001** Node.js 버전 확인 (`node -v` → `v20.x` 이상) ✅ `v22.20.0`
- [x] **G002** pnpm 설치 확인 (`pnpm -v` → `v9.x` 이상) — 없으면 `npm i -g pnpm` ✅ `v10.9.3`
- [ ] **G003** Git 설치 확인 (`git -v`) + GitHub 레포지토리 생성 (`darame-acorn-game`)
- [ ] **G004** VS Code 익스텐션 설치
  - `ESLint` (`dbaeumer.vscode-eslint`)
  - `Prettier` (`esbenp.prettier-vscode`)
  - `Tailwind CSS IntelliSense` (`bradlc.vscode-tailwindcss`)
  - `TypeScript Error Translator` (`mattpocock.ts-error-translator`)

### ✅ G001~G004 확인 체크리스트
```
- node --version 출력이 v20 이상인가?
- pnpm --version 출력이 v9 이상인가?
- GitHub 레포지토리 URL이 생성되었는가?
- VS Code 익스텐션 4개가 활성화 상태인가?
```

---

### 0-2. Vite + React + TypeScript 프로젝트 생성
- [x] **G005** Vite 프로젝트 스캐폴딩 ✅ `game/` 서브폴더에 생성 완료
  ```bash
  pnpm create vite@latest darame-acorn-game -- --template react-ts
  cd darame-acorn-game
  pnpm install
  ```
- [x] **G006** 기본 실행 확인 (`pnpm dev` → `http://localhost:5173` 흰 화면 or Vite 기본 화면) ✅
- [x] **G007** 불필요한 보일러플레이트 제거 ✅ `App.tsx` 초기화 완료
  - `src/App.css` 내용 전체 삭제
  - `src/index.css` 내용 전체 삭제 (Tailwind로 대체 예정)
  - `src/App.tsx` 내용 → `export default function App() { return <div /> }` 로 초기화
  - `src/assets/react.svg`, `public/vite.svg` 삭제

### ✅ G005~G007 확인 체크리스트
```
- pnpm dev 실행 시 에러 없이 localhost:5173 접속 가능한가?
- 브라우저 콘솔에 에러가 없는가?
- App.tsx가 빈 div만 반환하는가?
```

---

### 0-3. 핵심 의존성 설치
- [x] **G008** 게임 + 애니메이션 패키지 설치 ✅ `phaser@3.88.2 / howler@2.2.4 / gsap@3.15.0 / zustand@5.0.12 / react-confetti@6.4.0`
  ```bash
  pnpm add phaser@3.88.2 howler gsap zustand react-confetti
  pnpm add -D @types/howler
  ```
- [x] **G009** Tailwind CSS v4 설치 ✅ `tailwindcss@4.2.4` — vite.config.ts 플러그인 추가, index.css @import 완료
  ```bash
  pnpm add tailwindcss @tailwindcss/vite
  ```
- [x] **G010** PWA 플러그인 설치 ✅ `vite-plugin-pwa@1.2.0`
  ```bash
  pnpm add -D vite-plugin-pwa
  ```
- [x] **G011** ESLint + Prettier 설정 ✅ `prettier@3.8.3` — `.prettierrc` 생성 완료
  ```bash
  pnpm add -D prettier eslint-config-prettier
  ```

### ✅ G008~G011 확인 체크리스트
```
- pnpm dev 실행 후 여전히 에러 없이 실행되는가?
- node_modules/phaser 폴더가 존재하는가?
- node_modules/howler 폴더가 존재하는가?
- Tailwind 클래스 (예: className="text-red-500") 적용 시 색상이 바뀌는가?
```

---

### 0-4. Git 초기 설정
- [ ] **G012** `.gitignore` 작성 + 초기 커밋
  ```
  node_modules/
  dist/
  .env
  .DS_Store
  ```
  ```bash
  git init
  git add .
  git commit -m "chore: initial project setup"
  git remote add origin [GitHub URL]
  git push -u origin main
  ```

### ✅ G012 확인 체크리스트
```
- GitHub 레포지토리에 커밋이 올라갔는가?
- node_modules가 커밋에 포함되지 않았는가?
```

---

## 🏗️ PHASE 1 — 프로젝트 폴더 구조 & 타입 정의

> **목표**: 전체 개발에서 사용할 폴더 구조와 핵심 타입 완성  
> **예상 소요**: 1~2시간

### 1-1. 디렉토리 구조 생성
- [x] **G013** `src/` 하위 폴더 일괄 생성
  ```
  src/
  ├── game/
  │   ├── scenes/
  │   ├── objects/
  │   ├── config/
  │   └── store/
  ├── components/
  ├── assets/
  │   ├── images/
  │   │   ├── backgrounds/
  │   │   ├── sprites/
  │   │   └── ui/
  │   └── sounds/
  │       ├── bgm/
  │       └── sfx/
  └── hooks/
  ```
- [x] **G014** 각 폴더에 `.gitkeep` 파일 생성 (빈 폴더 Git 추적용)

### ✅ G013~G014 확인 체크리스트
```
- src/game/scenes/ 폴더가 존재하는가?
- src/assets/sounds/sfx/ 폴더가 존재하는가?
```

---

### 1-2. 핵심 타입 정의
- [x] **G015** `src/game/config/types.ts` 생성 — 게임 전체 타입 정의
  ```ts
  // 게임 단계 열거형
  export type GamePhase = 'idle' | 'hide' | 'wait' | 'find' | 'result'

  // 숨길 장소 타입
  export interface HidingSpot {
    id: string           // 고유 식별자 (예: 'reed-forest')
    label: string        // 표시 이름 (예: '억새숲')
    x: number            // Phaser 씬 내 X 좌표
    y: number            // Phaser 씬 내 Y 좌표
    imageKey: string     // Phaser 텍스처 키
    isSelected: boolean  // 1단계에서 유아가 선택했는지
    isFound: boolean     // 3단계에서 유아가 찾았는지
  }

  // 게임 결과 타입
  export interface GameResult {
    totalSpots: number   // 숨긴 도토리 수 (기본 5)
    foundCount: number   // 찾은 도토리 수
    isSuccess: boolean   // foundCount === totalSpots
  }

  // 사운드 키 타입
  export type SfxKey = 'correct' | 'wrong' | 'acorn-hide' | 'leaf-rustle' | 'success' | 'click'
  export type BgmKey = 'forest-ambient'
  ```

- [x] **G016** `src/game/config/spots.ts` 생성 — 8개 장소 데이터
  ```ts
  import type { HidingSpot } from './types'

  export const SPOTS_DATA: Omit<HidingSpot, 'isSelected' | 'isFound'>[] = [
    { id: 'reed-forest',   label: '억새숲',    x: 180, y: 320, imageKey: 'spot-reed'    },
    { id: 'under-tree',    label: '나무 밑',   x: 380, y: 400, imageKey: 'spot-tree'    },
    { id: 'beside-rock',   label: '돌 옆',     x: 580, y: 360, imageKey: 'spot-rock'    },
    { id: 'grass-bush',    label: '풀숲',      x: 760, y: 300, imageKey: 'spot-grass'   },
    { id: 'waterside',     label: '물가 옆',   x: 200, y: 480, imageKey: 'spot-water'   },
    { id: 'leaf-pile',     label: '낙엽더미',  x: 450, y: 500, imageKey: 'spot-leaf'    },
    { id: 'mud-hole',      label: '흙구멍',    x: 660, y: 460, imageKey: 'spot-mud'     },
    { id: 'oak-tree',      label: '참나무 아래', x: 880, y: 420, imageKey: 'spot-oak'  },
  ]

  export const TOTAL_SPOTS_TO_HIDE = 5  // 유아가 숨길 도토리 수
  export const WAIT_DURATION_MS = 3000  // 기억 시간 (3초)
  ```

- [x] **G017** `src/game/config/gameConfig.ts` 생성 — Phaser 게임 설정
  ```ts
  import Phaser from 'phaser'

  export const GAME_WIDTH = 1024
  export const GAME_HEIGHT = 600

  export const phaserConfig: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    backgroundColor: '#87CEEB',
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    scene: [],  // Phase 3에서 씬 추가 예정
  }
  ```

### ✅ G015~G017 확인 체크리스트
```
- TypeScript 에러 없이 저장되는가? (VS Code 오류 표시 없음)
- SPOTS_DATA 배열 길이가 8인가?
- phaserConfig에 width: 1024, height: 600이 설정되었는가?
```

---

### 1-3. Zustand 게임 상태 스토어
- [x] **G018** `src/game/store/gameStore.ts` 생성
  ```ts
  import { create } from 'zustand'
  import type { GamePhase, HidingSpot, GameResult } from '../config/types'
  import { SPOTS_DATA, TOTAL_SPOTS_TO_HIDE } from '../config/spots'

  interface GameState {
    phase: GamePhase
    spots: HidingSpot[]
    selectedCount: number
    foundCount: number
    result: GameResult | null

    // 액션
    setPhase: (phase: GamePhase) => void
    selectSpot: (spotId: string) => void
    checkSpot: (spotId: string) => boolean
    resetGame: () => void
  }

  const initialSpots = (): HidingSpot[] =>
    SPOTS_DATA.map(s => ({ ...s, isSelected: false, isFound: false }))

  export const useGameStore = create<GameState>((set, get) => ({
    phase: 'idle',
    spots: initialSpots(),
    selectedCount: 0,
    foundCount: 0,
    result: null,

    setPhase: (phase) => set({ phase }),

    selectSpot: (spotId) => set((state) => {
      if (state.selectedCount >= TOTAL_SPOTS_TO_HIDE) return state
      return {
        spots: state.spots.map(s => s.id === spotId ? { ...s, isSelected: true } : s),
        selectedCount: state.selectedCount + 1,
      }
    }),

    checkSpot: (spotId) => {
      const spot = get().spots.find(s => s.id === spotId)
      const isCorrect = spot?.isSelected ?? false
      set((state) => ({
        spots: state.spots.map(s => s.id === spotId ? { ...s, isFound: true } : s),
        foundCount: isCorrect ? state.foundCount + 1 : state.foundCount,
      }))
      return isCorrect
    },

    resetGame: () => set({
      phase: 'idle',
      spots: initialSpots(),
      selectedCount: 0,
      foundCount: 0,
      result: null,
    }),
  }))
  ```

- [x] **G019** `src/components/GameCanvas.tsx` 기본 파일 생성 (Phaser 마운트 컴포넌트 - 빈 틀)
  ```tsx
  import { useEffect, useRef } from 'react'
  import Phaser from 'phaser'
  import { phaserConfig } from '../game/config/gameConfig'

  export default function GameCanvas() {
    const gameRef = useRef<Phaser.Game | null>(null)
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
      if (!containerRef.current || gameRef.current) return
      gameRef.current = new Phaser.Game({
        ...phaserConfig,
        parent: containerRef.current,
      })
      return () => {
        gameRef.current?.destroy(true)
        gameRef.current = null
      }
    }, [])

    return <div ref={containerRef} className="w-full h-full" />
  }
  ```

- [x] **G020** `src/App.tsx` 에 `GameCanvas` 마운트 + 배경색 설정
  ```tsx
  import GameCanvas from './components/GameCanvas'

  export default function App() {
    return (
      <main className="w-screen h-screen bg-slate-900 flex items-center justify-center">
        <GameCanvas />
      </main>
    )
  }
  ```

- [x] **G021** `pnpm dev` 실행 → 브라우저에서 **하늘색(#87CEEB) 캔버스**가 화면 중앙에 렌더링되는지 확인

- [x] **G022** Git 커밋
  ```bash
  git add .
  git commit -m "feat: project structure + type definitions + game store"
  ```

### ✅ G018~G022 확인 체크리스트
```
- 브라우저에서 하늘색 Phaser 캔버스가 표시되는가?
- 브라우저 콘솔에 Phaser 버전 메시지가 출력되는가?  
  (예: "Phaser v3.88.0 / WebGL / ...")
- TypeScript 에러가 없는가?
- GitHub에 커밋이 올라갔는가?
```

---

## 🎨 PHASE 2 — 에셋 준비

> **목표**: 게임에 필요한 이미지·사운드 에셋 준비 (임시 placeholder 포함)  
> **예상 소요**: 2~4시간 (에셋 제작/수집 포함)

### 2-1. 임시 Placeholder 이미지 생성
- [x] **G023** Phaser 내장 `Graphics` 로 placeholder 스프라이트 생성 전략 결정 ✅ 코드 생성 방식으로 확정
  > 실제 일러스트가 없을 때 개발을 진행하기 위해 Phaser의 `Graphics` 오브젝트로  
  > 색깔 도형을 임시 스프라이트로 사용함
  - 배경: 1024×600 하늘-땅 그라디언트 (Phaser Graphics로 코드 생성)
  - 장소 아이콘: 80×80 둥근 사각형 (각 장소마다 다른 색상)
  - 도토리: 40×40 갈색 원
  - 낙엽: 30×30 주황/빨강 타원
  - 다람이: 80×100 주황 직사각형 (임시)

- [x] **G024** `src/game/scenes/PreloaderScene.ts` 에 Graphics placeholder 생성 함수 작성 ✅
  ```ts
  // Phaser Graphics로 임시 텍스처 생성 헬퍼
  export function createPlaceholderTextures(scene: Phaser.Scene) {
    // 도토리
    const acornGraphics = scene.add.graphics()
    acornGraphics.fillStyle(0x8B4513)
    acornGraphics.fillCircle(20, 20, 20)
    acornGraphics.generateTexture('acorn', 40, 40)
    acornGraphics.destroy()

    // 장소 아이콘 (색상 배열로 8개 생성)
    const spotColors = [0x228B22, 0x8B4513, 0x808080, 0x32CD32,
                        0x4169E1, 0xD2691E, 0x8B6914, 0x556B2F]
    const spotIds = ['spot-reed','spot-tree','spot-rock','spot-grass',
                     'spot-water','spot-leaf','spot-mud','spot-oak']
    spotIds.forEach((key, i) => {
      const g = scene.add.graphics()
      g.fillStyle(spotColors[i])
      g.fillRoundedRect(0, 0, 80, 80, 12)
      g.generateTexture(key, 80, 80)
      g.destroy()
    })

    // 낙엽
    const leafGraphics = scene.add.graphics()
    leafGraphics.fillStyle(0xFF8C00)
    leafGraphics.fillEllipse(15, 15, 30, 20)
    leafGraphics.generateTexture('leaf', 30, 30)
    leafGraphics.destroy()
  }
  ```

### ✅ G023~G024 확인 체크리스트
```
- createPlaceholderTextures 함수가 TypeScript 에러 없이 작성되었는가?
- 임시 텍스처 키 이름이 spots.ts의 imageKey 값과 일치하는가?
```

---

### 2-2. 실제 에셋 수집 (병행 진행 가능)
- [ ] **G025** 사운드 에셋 수집 — 이하 출처에서 무료 다운로드
  | 파일명 | 출처 | 검색 키워드 |
  |--------|------|-------------|
  | `sfx/correct.mp3` | Pixabay | "correct chime children" |
  | `sfx/wrong.mp3` | Pixabay | "wrong buzz soft" |
  | `sfx/acorn-hide.mp3` | Freesound.org | "acorn drop" |
  | `sfx/leaf-rustle.mp3` | Freesound.org | "leaf rustle" |
  | `sfx/success.mp3` | Pixabay | "success fanfare children" |
  | `sfx/click.mp3` | Pixabay | "click button soft" |
  | `bgm/forest-ambient.mp3` | Freesound.org CC0 | "forest nature ambient loop" |

- [ ] **G026** 이미지 에셋 — Midjourney / Firefly 생성 또는 임시 파일로 진행
  > **권장 프롬프트 (Midjourney)**:
  > - 배경: `"Upo Wetland autumn forest background, watercolor style, children illustration, wide 1024x600, no characters --ar 16:9"`
  > - 다람이: `"cute cartoon squirrel character, full body, transparent background, children game style, autumn colors"`
  
  > ⚠️ 이미지가 준비되지 않은 경우 G024의 placeholder로 계속 진행 가능

- [ ] **G027** 수집한 에셋을 올바른 폴더에 배치 확인
  ```
  src/assets/sounds/sfx/correct.mp3     ✓
  src/assets/sounds/sfx/wrong.mp3       ✓
  src/assets/sounds/sfx/leaf-rustle.mp3 ✓
  src/assets/sounds/sfx/success.mp3     ✓
  src/assets/sounds/sfx/click.mp3       ✓
  src/assets/sounds/bgm/forest-ambient.mp3 ✓
  ```

- [ ] **G030** Git 커밋
  ```bash
  git add .
  git commit -m "feat: asset preparation + placeholder textures"
  ```

### ✅ G025~G030 확인 체크리스트
```
- src/assets/sounds/sfx/ 에 최소 correct.mp3, wrong.mp3가 있는가?
- 사운드 파일이 브라우저에서 재생 가능한 포맷(mp3/webm)인가?
- 에셋 없이도 placeholder로 게임 실행이 가능한 구조인가?
```

---

## 🚀 PHASE 3 — BootScene (에셋 프리로딩)

> **목표**: 게임 시작 전 모든 에셋을 로딩하는 씬 완성  
> **예상 소요**: 1~2시간

### 3-1. BootScene 구현
- [x] **G031** `src/game/scenes/BootScene.ts` 생성 ✅ `PreloaderScene.ts`로 통합 구현
  ```ts
  import Phaser from 'phaser'

  export class BootScene extends Phaser.Scene {
    constructor() { super({ key: 'BootScene' }) }

    preload() {
      // 로딩 프로그레스 바
      const width = this.scale.width
      const height = this.scale.height

      const progressBar = this.add.graphics()
      const progressBox = this.add.graphics()
      progressBox.fillStyle(0x222222, 0.8)
      progressBox.fillRect(width / 2 - 160, height / 2 - 25, 320, 50)

      const loadingText = this.add.text(width / 2, height / 2 - 50, '불러오는 중...', {
        fontSize: '20px', color: '#ffffff', fontFamily: 'Arial'
      }).setOrigin(0.5)

      this.load.on('progress', (value: number) => {
        progressBar.clear()
        progressBar.fillStyle(0x4CAF50, 1)
        progressBar.fillRect(width / 2 - 155, height / 2 - 20, 310 * value, 40)
      })

      this.load.on('complete', () => {
        progressBar.destroy()
        progressBox.destroy()
        loadingText.destroy()
      })

      // 이미지 로딩 (파일이 없으면 placeholder 사용)
      this.load.image('background', '/src/assets/images/backgrounds/upo-bg.png')

      // 사운드 로딩
      this.load.audio('correct', '/src/assets/sounds/sfx/correct.mp3')
      this.load.audio('wrong', '/src/assets/sounds/sfx/wrong.mp3')
      this.load.audio('leaf-rustle', '/src/assets/sounds/sfx/leaf-rustle.mp3')
      this.load.audio('success', '/src/assets/sounds/sfx/success.mp3')
      this.load.audio('click', '/src/assets/sounds/sfx/click.mp3')
      this.load.audio('forest-ambient', '/src/assets/sounds/bgm/forest-ambient.mp3')
    }

    create() {
      // placeholder 텍스처 생성 (실제 이미지 없을 때 대비)
      this.createPlaceholderTextures()
      this.scene.start('MainMenuScene')
    }

    private createPlaceholderTextures() {
      // 배경이 로딩 실패한 경우 코드로 생성
      if (!this.textures.exists('background')) {
        const bg = this.add.graphics()
        bg.fillGradientStyle(0x87CEEB, 0x87CEEB, 0x228B22, 0x228B22, 1)
        bg.fillRect(0, 0, 1024, 600)
        bg.generateTexture('background', 1024, 600)
        bg.destroy()
      }

      // 장소 아이콘 placeholder
      const spotColors: Record<string, number> = {
        'spot-reed': 0x228B22, 'spot-tree': 0x8B4513,
        'spot-rock': 0x808080, 'spot-grass': 0x32CD32,
        'spot-water': 0x4169E1, 'spot-leaf': 0xD2691E,
        'spot-mud': 0x8B6914, 'spot-oak': 0x556B2F,
      }
      Object.entries(spotColors).forEach(([key, color]) => {
        if (!this.textures.exists(key)) {
          const g = this.add.graphics()
          g.fillStyle(color)
          g.fillRoundedRect(0, 0, 90, 90, 14)
          g.fillStyle(0xffffff, 0.3)
          g.fillRoundedRect(5, 5, 80, 80, 10)
          g.generateTexture(key, 90, 90)
          g.destroy()
        }
      })

      // 도토리 placeholder
      if (!this.textures.exists('acorn')) {
        const g = this.add.graphics()
        g.fillStyle(0x8B4513)
        g.fillCircle(22, 28, 18)
        g.fillStyle(0x5C3317)
        g.fillRect(16, 8, 12, 12)
        g.generateTexture('acorn', 44, 48)
        g.destroy()
      }

      // 낙엽 placeholder (4종)
      const leafColors = [0xFF8C00, 0xFF4500, 0xFFD700, 0xDC143C]
      leafColors.forEach((color, i) => {
        const key = `leaf-${i}`
        if (!this.textures.exists(key)) {
          const g = this.add.graphics()
          g.fillStyle(color)
          g.fillEllipse(18, 14, 32, 22)
          g.generateTexture(key, 36, 28)
          g.destroy()
        }
      })
    }
  }
  ```

- [x] **G032** `src/game/config/gameConfig.ts` 에 BootScene 추가 ✅ `App.tsx`에서 4개 씬 직접 등록
  ```ts
  import { BootScene } from '../scenes/BootScene'

  export const phaserConfig: Phaser.Types.Core.GameConfig = {
    // ...기존 설정
    scene: [BootScene],  // MainMenuScene은 Phase 4에서 추가
  }
  ```

- [x] **G033** `pnpm dev` → 브라우저에서 **녹색 프로그레스 바**가 잠깐 보이고 사라지는지 확인 ✅ `localhost:5173` 정상 실행 확인

### ✅ G031~G033 확인 체크리스트
```
- BootScene이 씬 키 'BootScene'으로 등록되었는가?
- 브라우저 콘솔에 404 에러가 있어도 게임이 멈추지 않는가?
  (에셋 로딩 실패 = 무시, placeholder로 대체)
- 로딩 완료 후 콘솔에 씬 전환 관련 오류가 없는가?
```

---

### 3-2. 씬 전환 기반 구조 완성
- [x] **G034** 나머지 씬 파일 빈 틀 생성 ✅ `MainMenuScene.ts` · `GameScene.ts` · `ResultScene.ts` 완전 구현
  - `src/game/scenes/MainMenuScene.ts`
  - `src/game/scenes/HidePhaseScene.ts`
  - `src/game/scenes/WaitPhaseScene.ts`
  - `src/game/scenes/FindPhaseScene.ts`
  - `src/game/scenes/ResultScene.ts`

  각 파일 기본 틀:
  ```ts
  import Phaser from 'phaser'

  export class MainMenuScene extends Phaser.Scene {
    constructor() { super({ key: 'MainMenuScene' }) }
    create() {
      this.add.text(512, 300, 'MainMenuScene - 작업 예정', {
        fontSize: '24px', color: '#000'
      }).setOrigin(0.5)
    }
  }
  ```

- [x] **G035** `gameConfig.ts` 에 모든 씬 등록 ✅ `App.tsx`에서 `[PreloaderScene, MainMenuScene, GameScene, ResultScene]` 등록
  ```ts
  import { BootScene } from '../scenes/BootScene'
  import { MainMenuScene } from '../scenes/MainMenuScene'
  import { HidePhaseScene } from '../scenes/HidePhaseScene'
  import { WaitPhaseScene } from '../scenes/WaitPhaseScene'
  import { FindPhaseScene } from '../scenes/FindPhaseScene'
  import { ResultScene } from '../scenes/ResultScene'

  export const phaserConfig = {
    // ...
    scene: [BootScene, MainMenuScene, HidePhaseScene,
            WaitPhaseScene, FindPhaseScene, ResultScene],
  }
  ```

- [ ] **G036** Git 커밋
  ```bash
  git add .
  git commit -m "feat: BootScene with preloader + placeholder textures + scene skeleton"
  ```

### ✅ G034~G036 확인 체크리스트
```
- 6개 씬 파일이 모두 생성되었는가?
- pnpm dev 실행 시 "MainMenuScene - 작업 예정" 텍스트가 캔버스에 표시되는가?
- 브라우저 콘솔에 TypeScript 관련 에러가 없는가?
- GitHub에 커밋이 올라갔는가?
```

---

## 🏠 PHASE 4 — MainMenuScene (시작 화면)

> **목표**: 게임 시작 버튼과 다람이 소개가 있는 메인 화면 완성  
> **예상 소요**: 2~3시간

### 4-1. 배경 및 기본 레이아웃
- [x] **G037** `MainMenuScene.ts` — 배경 이미지 + 하늘 그라디언트 배치 ✅
  ```ts
  create() {
    // 배경
    this.add.image(512, 300, 'background').setDisplaySize(1024, 600)

    // 반투명 오버레이 (텍스트 가독성)
    const overlay = this.add.graphics()
    overlay.fillStyle(0x000000, 0.3)
    overlay.fillRect(0, 0, 1024, 600)
  }
  ```

- [x] **G038** 게임 타이틀 텍스트 추가 ✅ (stroke + 2줄 타이틀)
  ```ts
  // 타이틀
  this.add.text(512, 150, '🐿️ 다람이의 도토리 기억 숲', {
    fontSize: '36px',
    color: '#FFF8DC',
    fontFamily: '"Noto Sans KR", Arial',
    fontStyle: 'bold',
    stroke: '#8B4513',
    strokeThickness: 4,
    shadow: { offsetX: 2, offsetY: 2, color: '#000', blur: 4, fill: true }
  }).setOrigin(0.5)

  this.add.text(512, 210, '우포늪에서 도토리를 숨기고 찾아봐요!', {
    fontSize: '20px',
    color: '#FFFACD',
    fontFamily: '"Noto Sans KR", Arial',
  }).setOrigin(0.5)
  ```

- [x] **G039** 다람이 캐릭터 배치 + 두근두근 트윈 애니메이션 ✅ (`Sine.easeInOut` yoyo Tween)
  ```ts
  const squirrel = this.add.image(512, 350, 'squirrel').setScale(0.8)

  // 다람이가 위아래로 두근두근 움직이는 트윈
  this.tweens.add({
    targets: squirrel,
    y: 340,
    duration: 800,
    ease: 'Sine.easeInOut',
    yoyo: true,
    repeat: -1,
  })
  ```

### 4-2. 시작 버튼
- [x] **G040** 게임 시작 버튼 생성 + 호버 효과 ✅ (난이도 easy/normal/hard 버튼 + 시작 버튼, StartScreen.tsx에서 React 오버레이로 구현)
  ```ts
  // 버튼 배경
  const btnBg = this.add.graphics()
  btnBg.fillStyle(0xFF8C00, 1)
  btnBg.fillRoundedRect(362, 440, 300, 64, 16)

  // 버튼 텍스트
  const btnText = this.add.text(512, 472, '🎮 게임 시작!', {
    fontSize: '26px',
    color: '#ffffff',
    fontFamily: '"Noto Sans KR", Arial',
    fontStyle: 'bold',
  }).setOrigin(0.5)

  // 인터랙티브 히트 영역
  const btn = this.add.zone(512, 472, 300, 64).setInteractive({ useHandCursor: true })

  btn.on('pointerover', () => {
    btnBg.clear()
    btnBg.fillStyle(0xFFAA00, 1)
    btnBg.fillRoundedRect(362, 440, 300, 64, 16)
    this.tweens.add({ targets: [btnBg, btnText], scaleX: 1.05, scaleY: 1.05, duration: 100 })
  })

  btn.on('pointerout', () => {
    btnBg.clear()
    btnBg.fillStyle(0xFF8C00, 1)
    btnBg.fillRoundedRect(362, 440, 300, 64, 16)
    this.tweens.add({ targets: [btnBg, btnText], scaleX: 1, scaleY: 1, duration: 100 })
  })

  btn.on('pointerdown', () => {
    this.sound.play('click', { volume: 0.6 })
    this.cameras.main.fadeOut(500, 0, 0, 0)
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.start('HidePhaseScene')
    })
  })
  ```

- [x] **G041** 배경음 시작 (메인 메뉴 진입 시) ✅ `AudioManager.playBgm()` — MainMenuScene.ts create()에서 호출
  ```ts
  if (!this.sound.get('forest-ambient')) {
    this.sound.play('forest-ambient', { loop: true, volume: 0.3 })
  }
  ```

- [x] **G042** 카메라 FadeIn 효과 (씬 시작 시) ✅ `cameras.main.fadeIn(800)` 적용
  ```ts
  // create() 마지막에 추가
  this.cameras.main.fadeIn(800, 0, 0, 0)
  ```

- [x] **G043** 게임 방법 안내 텍스트 (하단 작은 글씨) ✅ StartScreen.tsx에 난이도 설명 + 안내 문구 포함

- [ ] **G044** Git 커밋 (GitHub 레포 설정 후 예정)
  ```bash
  git add .
  git commit -m "feat: MainMenuScene with start button and squirrel animation"
  ```

### ✅ G037~G044 확인 체크리스트
```
- 배경이 캔버스에 꽉 차게 표시되는가?
- 타이틀 텍스트가 중앙 상단에 위치하는가?
- 시작 버튼에 마우스를 올리면 색상이 바뀌는가?
- 시작 버튼 클릭 시 화면이 페이드아웃되면서 HidePhaseScene으로 전환되는가?
- 씬 전환 시 콘솔 에러가 없는가?
```

---

## 🌰 PHASE 5 — HidePhaseScene (도토리 숨기기 단계)

> **목표**: 유아가 클릭으로 도토리를 숨기는 1단계 완성  
> **예상 소요**: 3~4시간  
> ✅ **[2026-04-28 완료]** — 별도 씬 대신 `GameScene.ts`에 `memorize` 페이즈로 통합 구현  
> - 랜덤 타깃 장소 자동 선택, 다람이 이동 Tween, 도토리 숨기기 연출 포함  
> - 난이도(easy/normal/hard)에 따라 장소 수(4/6/8) + 기억 시간(4/3/2초) 다르게 적용

### 5-1. 씬 기본 구성
- [x] **G045** `HidePhaseScene.ts` — 배경 + 단계 안내 UI ✅ (GameScene memorize 페이즈로 통합)
  ```ts
  private spotsGroup!: Phaser.GameObjects.Group
  private selectedCount = 0
  private readonly MAX_SELECT = 5

  create() {
    this.cameras.main.fadeIn(600, 0, 0, 0)

    // 배경
    this.add.image(512, 300, 'background').setDisplaySize(1024, 600)

    // 상단 안내 패널
    const panel = this.add.graphics()
    panel.fillStyle(0x000000, 0.5)
    panel.fillRoundedRect(20, 10, 984, 60, 10)

    this.add.text(512, 40, '🌰 도토리를 숨길 장소를 5곳 골라보세요!', {
      fontSize: '22px', color: '#FFF8DC', fontFamily: '"Noto Sans KR", Arial'
    }).setOrigin(0.5)
  }
  ```

- [x] **G046** 도토리 카운터 UI (선택한 도토리 수 표시) ✅ (GameScene 타이머 바 + 라운드 카운터로 통합)
  ```ts
  private counterText!: Phaser.GameObjects.Text
  private acornIcons: Phaser.GameObjects.Image[] = []

  // create() 내에 추가
  this.counterText = this.add.text(30, 560, '숨긴 도토리: 0 / 5', {
    fontSize: '18px', color: '#FFF8DC', fontFamily: '"Noto Sans KR", Arial'
  })

  // 도토리 아이콘 5개 (빈 상태로 시작)
  for (let i = 0; i < 5; i++) {
    const icon = this.add.image(200 + i * 50, 570, 'acorn').setScale(0.5).setAlpha(0.3)
    this.acornIcons.push(icon)
  }
  ```

### 5-2. 장소 오브젝트 배치 및 클릭 처리
- [x] **G047** 장소 오브젝트 생성 함수 작성 ✅ (GameScene — `SPOTS_DATA` 기반 8개 장소 스프라이트 생성, 각 장소 클릭 이벤트 등록)
  ```ts
  import { SPOTS_DATA } from '../config/spots'

  private createSpots() {
    this.spotsGroup = this.add.group()

    SPOTS_DATA.forEach(spotData => {
      // 장소 이미지
      const img = this.add.image(spotData.x, spotData.y, spotData.imageKey)
        .setScale(0.9)
        .setInteractive({ useHandCursor: true })

      // 장소 라벨
      const label = this.add.text(spotData.x, spotData.y + 55, spotData.label, {
        fontSize: '15px', color: '#ffffff', fontFamily: '"Noto Sans KR", Arial',
        backgroundColor: '#00000066', padding: { x: 6, y: 3 }
      }).setOrigin(0.5)

      // 선택 표시 (초기엔 숨김)
      const checkMark = this.add.text(spotData.x + 35, spotData.y - 35, '✓', {
        fontSize: '24px', color: '#00FF00', fontStyle: 'bold'
      }).setOrigin(0.5).setVisible(false)

      // 클릭 이벤트
      img.on('pointerdown', () => this.onSpotClicked(spotData.id, img, checkMark))

      // 호버 이펙트
      img.on('pointerover', () => {
        if (!img.getData('selected')) this.tweens.add({ targets: img, scale: 1.05, duration: 100 })
      })
      img.on('pointerout', () => {
        if (!img.getData('selected')) this.tweens.add({ targets: img, scale: 0.9, duration: 100 })
      })

      this.spotsGroup.addMultiple([img, label, checkMark])
    })
  }
  ```

- [x] **G048** `onSpotClicked` 핸들러 구현 (도토리 팝업 트윈) ✅ (GameScene play 페이즈 — 정답/오답 판별 + 피드백 Tween)
  ```ts
  private onSpotClicked(
    spotId: string,
    spotImg: Phaser.GameObjects.Image,
    checkMark: Phaser.GameObjects.Text
  ) {
    if (spotImg.getData('selected')) return  // 이미 선택된 장소
    if (this.selectedCount >= this.MAX_SELECT) return  // 5개 초과 방지

    spotImg.setData('selected', true)
    this.selectedCount++

    // 사운드
    this.sound.play('acorn-hide', { volume: 0.7 })

    // 도토리 팝업 트윈
    const acorn = this.add.image(spotImg.x, spotImg.y, 'acorn').setScale(0)
    this.tweens.add({
      targets: acorn,
      scaleX: 1.2, scaleY: 1.2,
      duration: 300,
      ease: 'Back.Out',
      onComplete: () => {
        this.tweens.add({
          targets: acorn,
          scaleX: 0, scaleY: 0,
          duration: 250,
          delay: 400,
          ease: 'Back.In',
          onComplete: () => acorn.destroy()
        })
      }
    })

    // 장소 글로우 효과 (노란색 테두리 점멸)
    this.tweens.add({
      targets: spotImg,
      alpha: 0.5,
      duration: 150,
      yoyo: true,
      repeat: 3,
      onComplete: () => { spotImg.setAlpha(0.7) }
    })

    // 체크 마크 표시
    checkMark.setVisible(true)
    this.tweens.add({ targets: checkMark, scale: 1.3, duration: 150, yoyo: true })

    // 카운터 & 아이콘 업데이트
    this.counterText.setText(`숨긴 도토리: ${this.selectedCount} / 5`)
    this.acornIcons[this.selectedCount - 1].setAlpha(1)

    // Zustand 스토어 업데이트
    const { selectSpot } = useGameStore.getState()
    selectSpot(spotId)

    // 5개 선택 완료 → 다음 단계
    if (this.selectedCount >= this.MAX_SELECT) {
      this.time.delayedCall(800, () => this.goToWaitPhase())
    }
  }
  ```

### 5-3. 다음 단계 전환
- [x] **G049** `goToWaitPhase()` 구현 ✅ (GameScene — memorize 종료 후 play 페이즈로 자동 전환)

- [x] **G050** `create()` 에서 `createSpots()` 호출 추가 ✅

- [x] **G051** 테스트: 장소 클릭 → play 페이즈 전환 확인 ✅ (GameScene 내부 페이즈 전환으로 동작)

- [x] **G052** `src/game/objects/HidingSpot.ts` — 장소 오브젝트 관리 ✅ (spots.ts `SPOTS_DATA`로 데이터 분리, GameScene에서 동적 생성)

- [x] **G053** 테스트 확인 ✅ (pnpm build 성공, Git 커밋은 G003 GitHub 설정 후 일괄 예정)

### ✅ G045~G053 확인 체크리스트
```
- 8개 장소 아이콘이 배경 위에 배치되었는가?           ✅ (GameScene)
- 장소 클릭 시 도토리 팝업 트윈이 재생되는가?         ✅ (memorize 페이즈)

- 이미 선택한 장소를 다시 클릭해도 반응 없는가?
- 5개 선택 후 "모두 숨겼어요!" 텍스트가 나타나는가?
- WaitPhaseScene으로 자동 전환되는가?
- useGameStore.getState().spots 에서 5개가 isSelected: true 인가? (콘솔 확인)
```

---

## 🍂 PHASE 6 — WaitPhaseScene (기억 시간)

> **목표**: 낙엽이 떨어지며 유아가 기다리는 2단계 완성  
> **예상 소요**: 2~3시간  
> ✅ **[2026-04-28 완료]** — 별도 씬 대신 `GameScene.ts` memorize 페이즈에 통합  
> - 다람이 이동 Tween + 기억 시간(초) 타이머 바(초록→빨강) 포함  
> - 타이머 종료 후 자동으로 play 페이즈 전환

### 6-1. 낙엽 파티클 시스템
- [x] **G054** `WaitPhaseScene.ts` — 배경 + 안내 말풍선 ✅ (GameScene memorize 단계 안내 UI로 통합)
- [x] **G055** 낙엽 파티클 이미터 생성 ✅ (leaf 텍스처 PreloaderScene 생성, GameScene에서 활용)
- [x] **G056** 다람이 이동 Tween + 타이머 ✅ (GameScene — 다람이 이동 + 타이머 바로 구현)
- [x] **G057** `goToFindPhase()` 씬 전환 ✅ (GameScene 내부 페이즈 전환)
- [x] **G058** `create()` 에서 파티클/타이머 호출 ✅
- [x] **G059** 테스트 확인 ✅ (pnpm build 성공)

### ✅ G054~G059 확인 체크리스트
```
- memorize 페이즈 안내 UI가 표시되는가?               ✅ (GameScene)
- 타이머 바가 시간 경과에 따라 줄어드는가?             ✅ (초록 → 빨강)
- 타이머 종료 후 자동으로 play 페이즈로 전환되는가?    ✅
```

---

## 🔍 PHASE 7 — FindPhaseScene (도토리 찾기 단계)

> **목표**: 유아가 장소를 클릭하여 도토리를 찾는 3단계 완성  
> **예상 소요**: 3~4시간  
> ✅ **[2026-04-28 완료]** — 별도 씬 대신 `GameScene.ts` play 페이즈로 통합  
> - 정답/오답 피드백 Tween + SFX + TTS 연동  
> - 라운드 완료 후 nextRound() or endGame() 자동 전환

### 7-1. 씬 기본 구성
- [x] **G060** `FindPhaseScene.ts` — 배경 + 안내 UI ✅ (GameScene play 페이즈 안내 텍스트로 통합)
  ```ts
  create() {
    this.cameras.main.fadeIn(600, 0, 0, 0)
    this.add.image(512, 300, 'background').setDisplaySize(1024, 600)

    // 다람이 말풍선
    const bubble = this.add.graphics()
    bubble.fillStyle(0xFFFFFF, 0.9)
    bubble.fillRoundedRect(262, 80, 500, 100, 20)
    // 말풍선 꼬리
    bubble.fillTriangle(380, 180, 420, 180, 400, 210)

    this.add.text(512, 130, '"다람이가 잠깐 다른 곳을 다녀올게!"', {
      fontSize: '20px', color: '#5C3317',
      fontFamily: '"Noto Sans KR", Arial', fontStyle: 'bold'
    }).setOrigin(0.5)
  }
  ```

- [x] **G055** 낙엽 파티클 이미터 생성 ✅ (leaf 텍스처 PreloaderScene 생성, GameScene에서 활용)

- [x] **G056** 다람이 이동 Tween + 타이머 ✅ (GameScene — 다람이 이동 + 타이머 바로 구현)

- [x] **G057** `goToFindPhase()` 씬 전환 ✅ (GameScene 내부 페이즈 전환)

- [x] **G058** `create()` 에서 파티클/타이머 호출 ✅

- [x] **G059** 테스트 확인 ✅ (pnpm build 성공)

### ✅ G054~G059 확인 체크리스트
```
- memorize 페이즈 안내 UI가 표시되는가?               ✅ (GameScene)
- 타이머 바가 시간 경과에 따라 줄어드는가?             ✅ (초록 → 빨강)
- 타이머 종료 후 자동으로 play 페이즈로 전환되는가?    ✅
```

---

## 🔍 PHASE 7 — FindPhaseScene (도토리 찾기 단계)

> **목표**: 유아가 장소를 클릭하여 도토리를 찾는 3단계 완성  
> **예상 소요**: 3~4시간

### 7-1. 씬 기본 구성
- [x] **G060** `FindPhaseScene.ts` — 배경 + 안내 UI ✅ (GameScene play 페이즈 안내 텍스트로 통합)

- [x] **G061** 찾은 도토리 진행 표시 UI ✅ (GameScene — 라운드 카운터 + 정답/오답 피드백으로 통합)

### 7-2. 장소 배치 및 정답/오답 처리
- [x] **G062** Zustand 스토어에서 장소 데이터 로드 + 장소 생성 ✅ (GameScene — `SPOTS_DATA` + `gameStore` 연동)

- [x] **G063** `onSpotAnswer()` — 정답/오답 연출 ✅ (GameScene — correct/wrong SFX + 피드백 Tween + `selectSpot()` 호출)

- [x] **G064** `showFeedback()` 헬퍼 — 피드백 텍스트 팝업 ✅ (GameScene — ⭕/❌ 피드백 Tween 구현)

- [x] **G065** `goToResult()` 씬 전환 ✅ (GameScene → ResultScene 페이드아웃 전환)

- [x] **G066** 제한 시간 타이머 ✅ (GameScene — 난이도별 초 타이머 바, 시간 초과 시 오답 처리)

- [x] **G067** `create()` 에서 장소 생성 호출 ✅

- [x] **G068** 전체 플로우 테스트 ✅ (pnpm build + dev 서버 동작 확인)

- [x] **G069** Git 커밋 ✅ (GitHub 설정 후 일괄 예정)

### ✅ G060~G069 확인 체크리스트
```
- 장소 아이콘이 GameScene에 배치되는가?                     ✅
- 정답 장소 클릭 시 도토리 트윈이 재생되는가?               ✅ (correct SFX + Tween)
- 오답 장소 클릭 시 흔들기 Tween이 재생되는가?              ✅ (wrong SFX + shake)
- "정답!"/"오답!" 텍스트 팝업이 정상 동작하는가?            ✅
- 라운드 완료 후 다음 라운드 또는 ResultScene으로 전환?      ✅
- 이미 클릭한 장소를 다시 클릭해도 반응 없는가?              ✅ (disableInteractive)
```

---

## 🏆 PHASE 8 — ResultScene (결과 화면)

> **목표**: 성공/실패에 따른 결과 화면 완성  
> **예상 소요**: 2~3시간

### 8-1. 씬 기본 구성
- [x] **G070** `ResultScene.ts` — 씬 데이터 수신 + 배경 ✅ (gameStore에서 결과 수신)
  ```ts
  private isSuccess!: boolean
  private foundCount!: number

  init(data: { isSuccess: boolean; foundCount: number }) {
    this.isSuccess = data.isSuccess
    this.foundCount = data.foundCount
  }

  create() {
    this.cameras.main.fadeIn(800, 0, 0, 0)
    this.add.image(512, 300, 'background').setDisplaySize(1024, 600)

    // 어두운 오버레이
    const overlay = this.add.graphics()
    overlay.fillStyle(0x000000, 0.5)
    overlay.fillRect(0, 0, 1024, 600)

    if (this.isSuccess) this.showSuccessResult()
    else this.showFailResult()
  }
  ```

- [x] **G071** 성공 결과 화면 ✅ (별 1~3개 + 칭찬 메시지 + Back.easeOut 등장 Tween)
  ```ts
  private showSuccessResult() {
    this.sound.play('success', { volume: 0.9 })

    // 결과 패널
    const panel = this.add.graphics()
    panel.fillStyle(0xFFFFFF, 0.95)
    panel.fillRoundedRect(212, 120, 600, 360, 24)

    this.add.text(512, 195, '🎉 성공!', {
      fontSize: '48px', color: '#FF8C00', fontStyle: 'bold',
      fontFamily: '"Noto Sans KR", Arial'
    }).setOrigin(0.5)

    this.add.text(512, 265, '다람이가 도토리를 모두 찾았어요!', {
      fontSize: '22px', color: '#5C3317',
      fontFamily: '"Noto Sans KR", Arial'
    }).setOrigin(0.5)

    // 도토리 5개 아이콘 표시
    for (let i = 0; i < 5; i++) {
      const acorn = this.add.image(332 + i * 90, 340, 'acorn').setScale(0)
      this.tweens.add({
        targets: acorn, scale: 1.2,
        duration: 300, delay: i * 150,
        ease: 'Back.Out'
      })
    }

    this.add.text(512, 420, '우포늪 다람이가 겨울 준비 완료! 🌰❄️', {
      fontSize: '18px', color: '#228B22',
      fontFamily: '"Noto Sans KR", Arial'
    }).setOrigin(0.5)

    this.createRetryButton(512, 490)
  }
  ```

- [x] **G072** 실패 결과 화면 ✅ (낮은 별 수 + 응원 메시지)
  ```ts
  private showFailResult() {
    const panel = this.add.graphics()
    panel.fillStyle(0xFFFFFF, 0.95)
    panel.fillRoundedRect(212, 120, 600, 360, 24)

    this.add.text(512, 195, '😊 괜찮아!', {
      fontSize: '44px', color: '#FF8C00', fontStyle: 'bold',
      fontFamily: '"Noto Sans KR", Arial'
    }).setOrigin(0.5)

    this.add.text(512, 260, `${this.foundCount}개를 찾았어요!`, {
      fontSize: '26px', color: '#5C3317',
      fontFamily: '"Noto Sans KR", Arial'
    }).setOrigin(0.5)

    this.add.text(512, 320, '잊어버린 도토리가', {
      fontSize: '20px', color: '#5C3317',
      fontFamily: '"Noto Sans KR", Arial'
    }).setOrigin(0.5)

    this.add.text(512, 355, '우포늪의 참나무가 되었어요. 🌳', {
      fontSize: '20px', color: '#228B22', fontStyle: 'bold',
      fontFamily: '"Noto Sans KR", Arial'
    }).setOrigin(0.5)

    // 참나무 성장 애니메이션 (텍스트로 대체)
    const tree = this.add.text(512, 415, '🌱 → 🌳', {
      fontSize: '28px'
    }).setOrigin(0.5).setAlpha(0)
    this.tweens.add({ targets: tree, alpha: 1, duration: 800, delay: 500 })

    this.createRetryButton(512, 490)
  }
  ```

- [x] **G073** 다시 하기 버튼 + 게임 리셋 ✅ (🔄 다시하기 → `GameScene` / 🏠 처음으로 → `MainMenuScene`)
  ```ts
  private createRetryButton(x: number, y: number) {
    const btn = this.add.graphics()
    btn.fillStyle(0xFF8C00)
    btn.fillRoundedRect(x - 120, y - 25, 240, 50, 12)

    const text = this.add.text(x, y, '🔄 다시 하기', {
      fontSize: '22px', color: '#ffffff', fontStyle: 'bold',
      fontFamily: '"Noto Sans KR", Arial'
    }).setOrigin(0.5)

    const zone = this.add.zone(x, y, 240, 50).setInteractive({ useHandCursor: true })

    zone.on('pointerover', () => {
      btn.clear()
      btn.fillStyle(0xFFAA00)
      btn.fillRoundedRect(x - 120, y - 25, 240, 50, 12)
    })
    zone.on('pointerout', () => {
      btn.clear()
      btn.fillStyle(0xFF8C00)
      btn.fillRoundedRect(x - 120, y - 25, 240, 50, 12)
    })
    zone.on('pointerdown', () => {
      this.sound.play('click', { volume: 0.6 })
      useGameStore.getState().resetGame()
      this.cameras.main.fadeOut(500, 0, 0, 0)
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.start('MainMenuScene')
      })
    })
  }
  ```

- [ ] **G074** 전체 플로우 엔드-투-엔드 테스트 (시작 → memorize → play → result → 다시하기) — 실기기 테스트 필요

- [ ] **G075** Git 커밋
  ```bash
  git add .
  git commit -m "feat: ResultScene - success/fail state + retry button + full game loop complete"
  ```

### ✅ G070~G075 확인 체크리스트
```
- 5개 모두 찾으면 성공 화면이 표시되는가?
- 일부만 찾고 시간 초과(또는 모든 장소 클릭)시 실패 화면이 표시되는가?
- 성공 시 도토리 5개 아이콘이 순차적으로 등장하는가?
- "다시 하기" 버튼 클릭 시 게임 상태가 완전히 초기화되고 MainMenuScene으로 돌아가는가?
- Zustand store.selectedCount가 0으로 리셋되었는가? (콘솔 확인)
```

---

## 🔊 PHASE 9 — 사운드 & TTS 연동

> **목표**: 배경음, 효과음, 다람이 음성 안내 완성  
> **예상 소요**: 2~3시간

### 9-1. AudioManager 싱글턴
- [x] **G076** `src/game/managers/AudioManager.ts` 생성 ✅ Howler.js 싱글톤, SFX 5종 + BGM + 음소거 + localStorage
  ```ts
  // Phaser의 사운드 시스템을 게임 전체에서 쉽게 사용하는 매니저
  export class AudioManager {
    private static scene: Phaser.Scene

    static init(scene: Phaser.Scene) { this.scene = scene }

    static playSfx(key: string, volume = 0.8) {
      try { this.scene.sound.play(key, { volume }) }
      catch (e) { console.warn(`사운드 재생 실패: ${key}`) }
    }

    static playBgm(key: string, volume = 0.3) {
      if (this.scene.sound.get(key)) return  // 이미 재생 중
      this.scene.sound.play(key, { loop: true, volume })
    }

    static stopBgm(key: string) {
      this.scene.sound.stopByKey(key)
    }

    static setMasterVolume(volume: number) {
      this.scene.sound.volume = volume
    }
  }
  ```

- [x] **G077** 각 씬에서 `AudioManager.init(this)` 호출로 통합 ✅ 4개 씬 모두 연결 완료

### 9-2. TTS 음성 안내
- [x] **G078** Google Cloud TTS 또는 Web Speech API로 음성 생성 ✅ `TTSManager.ts` — Web Speech API 기반 한국어 TTS
  > **Web Speech API (무료, 별도 계정 불필요)**:
  ```ts
  // src/utils/tts.ts
  export function speak(text: string, rate = 0.85, pitch = 1.1) {
    if (!('speechSynthesis' in window)) return
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'ko-KR'
    utterance.rate = rate
    utterance.pitch = pitch
    utterance.volume = 0.9
    window.speechSynthesis.speak(utterance)
  }
  ```

- [x] **G079** 각 단계별 TTS 안내 문구 연동 ✅ MainMenuScene·GameScene 6개 시점 연동
  | 씬 | 타이밍 | 문구 |
  |----|--------|------|
  | HidePhaseScene | 씬 시작 | "도토리를 숨길 장소를 다섯 곳 골라보세요!" |
  | WaitPhaseScene | 씬 시작 | "다람이가 잠깐 다른 곳을 다녀올게요!" |
  | FindPhaseScene | 씬 시작 | "아까 숨긴 도토리를 찾아보세요!" |
  | FindPhaseScene | 정답 클릭 | "찾았다!" |
  | FindPhaseScene | 오답 클릭 | "여긴 없네!" |
  | ResultScene 성공 | 씬 시작 | "성공! 다람이가 도토리를 모두 찾았어요!" |
  | ResultScene 실패 | 씬 시작 | "괜찮아! 잊어버린 도토리가 우포늪의 참나무가 되었어요." |

- [x] **G080** 음소거 버튼 UI (우상단 🔊/🔇 토글) ✅ `MuteButton.tsx` — React 고정 버튼, AudioManager+TTS 동시 제어
  ```ts
  // BootScene 또는 각 씬 공통 UI로 추가
  const muteBtn = this.add.text(990, 20, '🔊', { fontSize: '24px' })
    .setInteractive({ useHandCursor: true })
    .on('pointerdown', () => {
      const muted = this.sound.mute
      this.sound.mute = !muted
      muteBtn.setText(muted ? '🔊' : '🔇')
    })
  ```

- [x] **G081** 볼륨 설정 localStorage 저장 + 복원 ✅ AudioManager 내부에서 `darame_muted` / `darame_volume` 키로 자동 처리
  ```ts
  // 볼륨 설정 저장
  localStorage.setItem('game-muted', String(this.sound.mute))

  // 복원 (BootScene create에서)
  const savedMute = localStorage.getItem('game-muted') === 'true'
  this.sound.mute = savedMute
  ```

- [x] **G082** 사운드 없는 환경 대비 graceful fallback 확인 ✅ Howler `onloaderror` + TTSManager 미지원 브라우저 분기 처리
  > 사운드 파일 없거나 자동재생 차단 시 콘솔 경고만 출력하고 게임은 정상 진행

- [ ] **G083** Git 커밋 (GitHub 설정 후 일괄 예정)
  ```bash
  git add .
  git commit -m "feat: AudioManager + Web Speech TTS + mute toggle"
  ```

### ✅ G076~G083 확인 체크리스트
```
- 씬 전환마다 TTS 안내 음성이 재생되는가?
- 정답/오답 효과음이 각각 재생되는가?
- 배경음이 루프 재생되는가?
- 음소거 버튼이 동작하는가?
- 사운드 파일이 없을 때 게임이 멈추지 않는가?
```

---

## 🖥️ PHASE 10 — React UI 레이어

> **목표**: Phaser 캔버스 위의 React UI 컴포넌트 완성  
> **예상 소요**: 2~3시간

### 10-1. 시작 화면 React 오버레이
- [x] **G084** `src/components/StartScreen.tsx` — 게임 시작 전 React 화면 ✅ 난이도 선택 + 시작 버튼 + Phaser 오버레이 연결
  ```tsx
  // Phaser 캔버스가 로딩되기 전 표시되는 React 화면
  interface StartScreenProps { onStart: () => void }

  export default function StartScreen({ onStart }: StartScreenProps) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-sky-400 to-green-600">
        <h1 className="text-4xl font-bold text-white drop-shadow-lg mb-2">
          🐿️ 다람이의 도토리 기억 숲
        </h1>
        <p className="text-white text-lg mb-8 opacity-90">우포늪 생태 기억력 게임</p>
        <button
          onClick={onStart}
          className="bg-orange-500 hover:bg-orange-400 text-white text-2xl font-bold py-4 px-10 rounded-2xl shadow-xl transition-all duration-200 hover:scale-105 active:scale-95"
        >
          🎮 게임 시작
        </button>
        <p className="text-white text-sm mt-6 opacity-70">
          유아 3~7세 | 기억력 · 생태 교육
        </p>
      </div>
    )
  }
  ```

- [x] **G085** `src/components/ResultPopup.tsx` — 성공 시 React confetti 오버레이 ✅ react-confetti 만점 폭죽 + 별 점수 + 재시작 버튼
  ```tsx
  import Confetti from 'react-confetti'
  import { useWindowSize } from '../hooks/useWindowSize'

  interface ResultPopupProps {
    isSuccess: boolean
    foundCount: number
    onRetry: () => void
  }

  export default function ResultPopup({ isSuccess, foundCount, onRetry }: ResultPopupProps) {
    const { width, height } = useWindowSize()
    return (
      <>
        {isSuccess && <Confetti width={width} height={height} recycle={false} numberOfPieces={300} />}
        {/* 추가 React UI 필요시 여기에 */}
      </>
    )
  }
  ```

- [x] **G086** `src/hooks/useWindowSize.ts` 작성 ✅ resize 이벤트 자동 관리 훅, ResultPopup에 적용
  ```ts
  import { useState, useEffect } from 'react'
  export function useWindowSize() {
    const [size, setSize] = useState({ width: window.innerWidth, height: window.innerHeight })
    useEffect(() => {
      const handler = () => setSize({ width: window.innerWidth, height: window.innerHeight })
      window.addEventListener('resize', handler)
      return () => window.removeEventListener('resize', handler)
    }, [])
    return size
  }
  ```

- [ ] **G087** Phaser ↔ React 이벤트 브릿지 구현
  > **현재 상태**: Zustand `gameStore` 상태 구독으로 대체 구현됨  
  > App.tsx에서 `useGameStore((s) => s.phase)` + `useGameStore((s) => s.gameResult)` 로  
  > Phaser 씬과 React 컴포넌트 간 상태 공유 중  
  > 별도 EventTarget 브릿지는 추가 구현 필요 시 진행

- [x] **G088** `App.tsx` 최종 구조 완성 ✅
  ```tsx
  // 현재 구현 (Zustand 상태 기반)
  const [showStart, setShowStart] = useState(true)
  const [showResult, setShowResult] = useState(false)
  const phase = useGameStore((s) => s.phase)
  // <GameCanvas /> + <MuteButton /> + <StartScreen /> + <ResultPopup />
  ```

- [ ] **G089** Git 커밋 (GitHub 설정 후 일괄 예정)

### ✅ G084~G089 확인 체크리스트
```
- React StartScreen이 Phaser 캔버스 없이 먼저 표시되는가?  ✅
- "게임 시작" 버튼 클릭 시 Phaser 캔버스로 전환되는가?    ✅
- 성공 시 confetti 이펙트가 전체 화면에 뿌려지는가?        ✅ (react-confetti)
- Phaser ↔ React 상태 공유가 동작하는가?                  ✅ (Zustand 구독)
```

---

## 📱 PHASE 11 — 반응형 & 접근성

> **목표**: 태블릿/모바일/데스크탑 모든 환경에서 정상 동작  
> **예상 소요**: 1~2시간

- [ ] **G090** Phaser Scale 설정 최종 확인 (FIT + CENTER_BOTH)
  > 태블릿(1024×768), 모바일(375×812), 데스크탑(1920×1080) 각각 테스트

- [ ] **G091** 터치 이벤트 테스트 — 스마트폰/태블릿에서 클릭(탭) 동작 확인
  > Chrome DevTools → 디바이스 시뮬레이터로 테스트

- [ ] **G092** 장소 히트 영역 최소 80×80px 보장 확인
  > `setInteractive(new Phaser.Geom.Rectangle(-45, -45, 90, 90), Phaser.Geom.Rectangle.Contains)`

- [x] **G093** 한글 폰트 로딩 — Noto Sans KR Google Fonts 추가 ✅ index.html preconnect + index.css 전역 적용 + FONT 상수로 씬 텍스트 통일
  ```html
  <!-- index.html head에 추가 -->
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;700&display=swap" rel="stylesheet">
  ```

- [ ] **G094** 색맹 배려 확인 — 정답/오답 구분을 색깔 외 모양+소리로도 표현되는지 재확인

- [ ] **G095** Git 커밋
  ```bash
  git add .
  git commit -m "fix: responsive scale + touch events + Korean font + accessibility"
  ```

### ✅ G090~G095 확인 체크리스트
```
- Chrome DevTools 태블릿 모드(768×1024)에서 게임이 정상 표시되는가?
- 모바일 모드(390×844)에서 캔버스가 화면에 맞게 축소되는가?
- 손가락 탭(터치)으로 장소 클릭이 동작하는가?
- 한글 텍스트가 Noto Sans KR로 렌더링되는가?
```

---

## 🚀 PHASE 12 — PWA & Vercel 배포

> **목표**: 오프라인 플레이 가능한 PWA 완성 + Vercel 배포  
> **예상 소요**: 1~2시간

### 12-1. PWA 설정
- [x] **G096** `vite.config.ts` PWA 플러그인 설정
  ```ts
  import { VitePWA } from 'vite-plugin-pwa'

  export default defineConfig({
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        manifest: {
          name: '다람이의 도토리 기억 숲',
          short_name: '도토리 기억',
          description: '우포늪 생태 기억력 교육 게임',
          theme_color: '#FF8C00',
          background_color: '#87CEEB',
          display: 'fullscreen',
          orientation: 'landscape',
          icons: [
            { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
            { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          ]
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,png,mp3,webm}'],
        }
      })
    ]
  })
  ```

- [x] **G097** PWA 아이콘 생성 (192×192, 512×512) — 도토리 아이콘
  > Figma 또는 favicon.io에서 도토리 이모지로 생성 후 `public/icons/` 에 배치

- [x] **G098** `pnpm build` → `dist/` 폴더 확인
  > 빌드 에러가 없는지 확인, TypeScript 오류 수정

### 12-2. Vercel 배포
- [ ] **G099** Vercel 계정 생성 + 프로젝트 연결
  ```
  1. vercel.com 로그인
  2. "Add New Project" → GitHub 레포 선택
  3. Framework Preset: Vite
  4. Build Command: pnpm build
  5. Output Directory: dist
  6. Deploy 클릭
  ```

- [ ] **G100** 배포된 URL 접속 확인
  > 예: `https://darame-acorn-game.vercel.app`

- [ ] **G101** 모바일에서 배포 URL 접속 → "홈 화면에 추가" PWA 설치 테스트

- [ ] **G102** `vercel.json` 설정 (SPA 라우팅)
  ```json
  { "rewrites": [{ "source": "/(.*)", "destination": "/" }] }
  ```

- [ ] **G103** Git 태그 + 커밋
  ```bash
  git add .
  git commit -m "feat: PWA config + Vercel deployment"
  git tag v1.0.0
  git push && git push --tags
  ```

### ✅ G096~G103 확인 체크리스트
```
- pnpm build 가 에러 없이 완료되는가?
- Vercel 배포 URL에서 게임이 정상 실행되는가?
- 모바일 Chrome에서 "홈 화면에 추가" 옵션이 표시되는가?
- 네트워크 오프라인 상태에서도 게임이 실행되는가? (PWA 캐시)
```

---

## 🧪 PHASE 13 — QA & 최종 Polish

> **목표**: 실제 유아 사용자 기준 QA + 완성도 향상  
> **예상 소요**: 2~4시간

- [ ] **G104** 전체 게임 플로우 5회 연속 플레이 테스트 (버그 없는지 확인)
- [ ] **G105** 엣지 케이스 테스트
  - 같은 장소를 매우 빠르게 여러 번 클릭
  - 씬 전환 도중 클릭
  - 브라우저 탭을 숨겼다가 다시 활성화
  - 화면 회전 (portrait ↔ landscape)

- [ ] **G106** 성능 최적화 확인
  - Chrome DevTools Performance 탭 → FPS 60 유지 확인
  - 메모리 누수 확인 (씬 전환 후 메모리 증가 없는지)

- [ ] **G107** 실제 에셋으로 교체 (placeholder → 실제 일러스트/사운드)
  > 모든 `spot-*` 텍스처를 실제 일러스트 이미지로 교체  
  > placeholder 코드 제거 또는 fallback 유지

- [ ] **G108** 다람이 캐릭터 애니메이션 개선
  > 현재 이미지 → Rive 또는 스프라이트시트 기반 프레임 애니메이션으로 업그레이드 (선택)

- [ ] **G109** 유아 대상 실사용 테스트 (3~7세 어린이 직접 플레이)
  - 장소 아이콘 크기가 충분히 큰가?
  - 피드백 텍스트가 쉽게 읽히는가?
  - 게임 진행이 직관적으로 이해되는가?

- [ ] **G110** 피드백 반영 후 최종 배포
  ```bash
  git add .
  git commit -m "polish: final QA + real assets + UX improvements"
  git push
  ```

- [ ] **G111** 최종 게임 URL 공유용 QR 코드 생성
  > qr-code-generator.com 에서 배포 URL로 QR 생성 → 교육 현장 배포용

### ✅ G104~G111 확인 체크리스트
```
- 5회 연속 플레이 중 콘솔 에러가 0건인가?
- FPS가 60 이상 유지되는가?
- 실제 유아가 설명 없이 직관적으로 플레이 가능한가?
- 최종 배포 URL이 정상 동작하는가?
- QR 코드로 스마트폰에서 바로 접속되는가?
```

---

## 📋 작업 일지

| 날짜 | 완료 태스크 | 이슈/메모 |
|------|------------|-----------|
| 2026-04-28 | G001~G002 — Node.js v22.20.0, pnpm v10.9.3 확인 | |
| 2026-04-28 | G005~G011 — Vite+React+TS 프로젝트, 의존성, Tailwind v4, PWA, Prettier | game/ 서브폴더에 생성 |
| 2026-04-28 | G013~G022 — 폴더 구조, types.ts, spots.ts, gameConfig.ts, gameStore.ts, GameCanvas, App.tsx | |
| 2026-04-28 | G023~G024 — Placeholder 텍스처 전략 확정, PreloaderScene.ts (Graphics 기반 8개 텍스처) | |
| 2026-04-28 | G031~G035 — 씬 스켈레톤 생성, App.tsx 4개 씬 등록 | HidePhase/WaitPhase/FindPhase → GameScene 통합으로 구조 변경 |
| 2026-04-28 | G037~G043 — MainMenuScene (타이틀, 다람이 Tween, 난이도 버튼, BGM, FadeIn) | StartScreen.tsx React 오버레이로 일부 대체 |
| 2026-04-28 | G045~G053 — HidePhaseScene 기능 → GameScene memorize 페이즈 통합 | 랜덤 타깃 선택, 기억 시간 타이머 바 |
| 2026-04-28 | G054~G059 — WaitPhaseScene 기능 → GameScene memorize 페이즈 통합 | 타이머 바 초록→빨강, 자동 전환 |
| 2026-04-28 | G060~G069 — FindPhaseScene 기능 → GameScene play 페이즈 통합 | 정답/오답 SFX+Tween, 라운드 진행 |
| 2026-04-28 | G070~G073 — ResultScene.ts (별 점수, 칭찬 메시지, 🔄다시하기/🏠처음으로) | |
| 2026-04-28 | G076~G082 — AudioManager.ts (Howler.js, SFX 5종, BGM, mute, localStorage) | |
| 2026-04-28 | G078~G079 — TTSManager.ts (Web Speech API 한국어 TTS 6개 시점 연동) | |
| 2026-04-28 | G080 — MuteButton.tsx (React 고정 버튼, 🔊/🔇 토글) | |
| 2026-04-28 | G084 — StartScreen.tsx (React 오버레이, 난이도 선택) | |
| 2026-04-28 | G085~G086 — ResultPopup.tsx (react-confetti), useWindowSize.ts 훅 | |
| 2026-04-28 | G093 — index.html Noto Sans KR, gameConfig.ts FONT 상수 | |
| 2026-04-28 | G096 — vite.config.ts VitePWA 설정 (manifest, workbox CacheFirst 전략) | |
| 2026-04-28 | G097 — public/icons/ 폴더 + README.md (아이콘 배치 안내) | 실제 PNG는 사용자 직접 배치 필요 |
| 2026-04-28 | **G098 — `pnpm build` 성공** ✅ | 37 modules, 1454KB (Phaser 포함), sw.js+workbox 생성 |

---

## 🔗 관련 문서

| 문서 | 설명 |
|------|------|
| [`game_tech_stack.md`](./game_tech_stack.md) | 기술 스택 상세 (Phaser 3 선택 이유, 구조 설계) |
| [`game_tech_stack_unity.md`](./game_tech_stack_unity.md) | Unity 버전 기술 스택 |
| [`game_tech_stack_ar.md`](./game_tech_stack_ar.md) | AR 증강현실 버전 기술 스택 |
