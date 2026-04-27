# 🐿️ 다람이의 도토리 기억 숲 — 기술 스택 & 설계 문서

> 유아 대상 교육용 기억력 게임 (우포늪 생태 테마)  
> **목표**: 시각·청각 피드백이 풍부한 고퀄리티 인터랙티브 브라우저 게임

---

## 🗺️ 전체 아키텍처 개요

```
[유아 / 브라우저]
      ↓
[Frontend SPA — React + TypeScript]
      ↓ Canvas / DOM 애니메이션
[게임 엔진 레이어 — Phaser 3]
      ↓ 사운드
[Howler.js — 효과음 / 배경음]
      ↓ 배포
[Vercel (정적 호스팅)]
```

> 백엔드 불필요 — 순수 프론트엔드 게임 (점수 저장 필요 시 `localStorage` 또는 Firebase 추가 가능)

---

## 🎮 핵심 기술 스택 선택 이유

### 왜 Phaser 3 인가?

| 비교 항목 | Phaser 3 | 순수 Canvas API | Three.js |
|-----------|----------|-----------------|----------|
| 2D 게임 최적화 | ✅ 특화 | 🔧 직접 구현 필요 | ❌ 3D 중심 |
| 트윈 / 애니메이션 | ✅ 내장 | ❌ 없음 | ✅ 있음 |
| 물리 엔진 | ✅ Arcade 내장 | ❌ 없음 | ❌ 별도 필요 |
| 사운드 관리 | ✅ 내장 | ❌ 없음 | ❌ 없음 |
| 유아 게임 레퍼런스 | ✅ 풍부 | ❌ 적음 | ❌ 적음 |
| 학습 난이도 | ⭐⭐⭐ 중간 | ⭐⭐ 낮음 | ⭐⭐⭐⭐ 높음 |

**→ Phaser 3 채택** : 낙엽 파티클, 도토리 드롭 트윈, 장소 반짝임 효과 등 게임 연출에 필요한 모든 기능이 내장되어 있어 최적

---

## 1. 프론트엔드 (게임 화면)

| 기술 | 역할 | 버전 |
|------|------|------|
| **React 19** | 게임 외 UI (시작화면, 결과화면, 설정) | `^19.x` |
| **TypeScript** | 타입 안전성 — 게임 상태, 장소 데이터 타입 정의 | `^5.x` |
| **Vite** | 빠른 빌드 / HMR (Next.js 불필요, 순수 SPA) | `^6.x` |
| **Phaser 3** | 핵심 게임 엔진 (Canvas 렌더링, 트윈, 파티클) | `^3.88.x` |
| **Tailwind CSS v4** | React UI 영역 스타일링 (버튼, 팝업 등) | `^4.x` |

### 📦 주요 라이브러리

| 라이브러리 | 역할 |
|-----------|------|
| `howler.js` | 배경음악 + 효과음 재생 (낙엽 소리, 찾았다 효과음) |
| `@gsap/react` (GSAP) | React UI 레이어 애니메이션 (결과 팝업 등장 등) |
| `zustand` | 게임 전역 상태 관리 (숨긴 장소 목록, 점수, 단계) |
| `react-confetti` | 성공 시 축하 이펙트 |
| `vite-plugin-pwa` | PWA 설정 → 오프라인 플레이 가능 |

---

## 2. 게임 구조 설계 (Phaser 3 Scene 기반)

```
src/
├── game/
│   ├── scenes/
│   │   ├── BootScene.ts         # 에셋 프리로딩 (배경, 스프라이트, 사운드)
│   │   ├── MainMenuScene.ts     # 시작 화면 (다람이 소개)
│   │   ├── HidePhaseScene.ts    # 1단계: 도토리 숨기기
│   │   ├── WaitPhaseScene.ts    # 2단계: 낙엽 애니메이션 + 대기
│   │   ├── FindPhaseScene.ts    # 3단계: 도토리 찾기
│   │   └── ResultScene.ts       # 4단계: 결과 화면
│   ├── objects/
│   │   ├── HidingSpot.ts        # 숨길 장소 게임 오브젝트
│   │   ├── Acorn.ts             # 도토리 오브젝트 (트윈 포함)
│   │   └── LeafParticle.ts      # 낙엽 파티클 이미터
│   ├── config/
│   │   ├── spots.ts             # 장소 데이터 (이름, 좌표, 이미지키)
│   │   └── gameConfig.ts        # Phaser 게임 설정값
│   └── store/
│       └── gameStore.ts         # Zustand 상태 (선택된 장소 배열)
├── components/
│   ├── GameCanvas.tsx           # Phaser 게임 마운트 컴포넌트
│   ├── StartScreen.tsx          # React 시작 UI
│   └── ResultPopup.tsx          # React 결과 팝업 (GSAP 애니메이션)
├── assets/
│   ├── backgrounds/             # 우포늪 배경 이미지
│   ├── sprites/                 # 다람이, 도토리, 낙엽 스프라이트
│   └── sounds/                  # 효과음, 배경음
└── App.tsx
```

---

## 3. 게임 단계별 기술 구현 상세

### 1단계 — 도토리 숨기기 (`HidePhaseScene.ts`)

```typescript
// 장소 데이터 타입
interface HidingSpot {
  id: string;           // 'acorn-nest' | 'under-tree' | ...
  label: string;        // "억새숲" | "나무 밑" | ...
  x: number;            // 화면 좌표
  y: number;
  imageKey: string;     // Phaser 텍스처 키
  isSelected: boolean;  // 유아가 선택했는지 여부
}
```

- 장소 클릭 시 **도토리 팝업 트윈** (scale 0 → 1 → 0, 0.8초)
- 선택된 장소에 **반짝임 글로우 이펙트** (postFX 또는 별도 스프라이트)
- 5개 선택 완료 시 자동으로 `WaitPhaseScene` 전환

### 2단계 — 기억 시간 (`WaitPhaseScene.ts`)

- **낙엽 파티클**: `Phaser.GameObjects.Particles.ParticleEmitter`
  - 10~15개 낙엽이 화면 상단에서 3초간 회전하며 낙하
  - 회전 + 중력 + 바람 오프셋 트윈 적용
- 다람이 캐릭터 **화면 밖으로 걸어나가는 애니메이션**
- 3초 후 자동 `FindPhaseScene` 전환

### 3단계 — 도토리 찾기 (`FindPhaseScene.ts`)

| 결과 | 시각 효과 | 사운드 | 텍스트 |
|------|-----------|--------|--------|
| **정답** | 도토리 스프라이트 등장 + 별 파티클 | `correct.mp3` | "찾았다! 🎉" |
| **오답** | 낙엽 휙~ 파티클 (짧게) | `rustle.mp3` | "여긴 없네! 🍂" |

- 이미 찾은 장소는 **클릭 비활성화** + 체크 표시
- 현재 찾은 개수 UI 표시 (`1/5`, `2/5` …)

### 4단계 — 결과 (`ResultScene.ts`)

```
성공 (5/5): react-confetti 전체 화면 + GSAP 팝업 슬라이드인
실패 (< 5): 위로 메시지 팝업 + "잊어버린 도토리가 참나무가 되었어요" 일러스트
```

---

## 4. 에셋 & 디자인 전략

### 이미지 / 일러스트

| 에셋 | 추천 소스 | 비고 |
|------|-----------|------|
| 우포늪 배경 | **Midjourney v6** / Adobe Firefly | "우포늪 가을 숲, 수채화 스타일, 유아 동화" 프롬프트 |
| 다람이 캐릭터 | **Rive** (인터랙티브 벡터 애니메이션) | 걷기 / 놀람 / 기쁨 상태 |
| 도토리 스프라이트 | Figma 직접 제작 또는 Freepik | 투명 PNG |
| 낙엽 파티클 | Figma 직접 제작 | 4~5종 형태 |
| 숨길 장소 아이콘 | **Stable Diffusion** 또는 일러스트레이터 의뢰 | 억새숲, 나무밑 등 8종 |

### 사운드

| 사운드 | 추천 소스 |
|--------|-----------|
| 배경음 (숲 소리) | **Freesound.org** (CC0 라이선스) |
| 도토리 찾기 성공음 | **Pixabay** 무료 효과음 |
| 낙엽 바스락 소리 | **Freesound.org** |
| 다람이 목소리 (TTS) | **Google Cloud TTS** — `ko-KR-Wavenet-A` (아동 친화적 톤) |

---

## 5. 반응형 & 접근성

| 항목 | 구현 방법 |
|------|-----------|
| **태블릿 최적화** | Phaser `Scale.FIT` 모드 → 화면 비율 유지 자동 리사이징 |
| **터치 지원** | Phaser `setInteractive()` → 터치 이벤트 자동 처리 |
| **큰 클릭 영역** | 장소 히트 영역 최소 `80×80px` 보장 |
| **색맹 배려** | 정답/오답 구분을 색깔만이 아닌 모양 + 소리로도 표현 |
| **로딩 최적화** | `BootScene`에서 프로그레스 바 표시, 에셋 레이지 로딩 |

---

## 6. 배포 & 성능

| 항목 | 기술 | 이유 |
|------|------|------|
| **호스팅** | Vercel | 무료, CDN 자동, PR 미리보기 |
| **PWA** | `vite-plugin-pwa` | 태블릿 홈화면 설치, 오프라인 플레이 |
| **에셋 압축** | `vite-imagetools` + WebP 변환 | 이미지 최대 80% 용량 절감 |
| **코드 분할** | Vite 동적 import → Scene별 청크 분리 | 초기 로딩 속도 향상 |
| **사운드 포맷** | `.webm` + `.mp3` 폴백 | 브라우저 호환성 |

---

## 7. 개발 환경 세팅

```bash
# 프로젝트 생성
pnpm create vite@latest darame-game -- --template react-ts
cd darame-game

# 핵심 의존성
pnpm add phaser howler gsap zustand react-confetti
pnpm add -D tailwindcss @tailwindcss/vite vite-plugin-pwa
pnpm add -D @types/howler
```

### 권장 VS Code 익스텐션

| 익스텐션 | 역할 |
|---------|------|
| `Phaser.js Snippets` | Phaser 코드 자동완성 |
| `Tailwind CSS IntelliSense` | 클래스 자동완성 |
| `ESLint` + `Prettier` | 코드 품질 |

---

## 8. 개발 로드맵

```
Week 1  │ 프로젝트 세팅 + BootScene + 배경/에셋 수집
Week 2  │ HidePhaseScene 구현 (장소 클릭 + 도토리 트윈)
Week 3  │ WaitPhaseScene (낙엽 파티클) + FindPhaseScene (정답/오답)
Week 4  │ ResultScene + 사운드 연동 + 반응형 처리
Week 5  │ 다람이 캐릭터 애니메이션 + 디자인 polish
Week 6  │ PWA 설정 + Vercel 배포 + 유아 사용자 테스트
```

---

## 9. 확장 가능성 (v2 아이디어)

| 기능 | 기술 |
|------|------|
| 난이도 조절 (장소 수 3 / 5 / 8개) | Zustand 설정값 |
| 계절 테마 변경 (봄/여름/가을/겨울) | Phaser Scene 텍스처 스왑 |
| 점수 저장 & 리더보드 | Firebase Firestore (무료 티어) |
| 부모용 학습 리포트 | Firebase Analytics |
| 다국어 지원 (영어) | `i18next` |
| 배경음 on/off 설정 | Zustand + Howler.js |

---

## ✅ 최종 추천 스택 요약

```
게임 엔진    : Phaser 3
UI 프레임워크 : React 19 + TypeScript
빌드 도구    : Vite 6
스타일링     : Tailwind CSS v4
애니메이션   : GSAP (UI 레이어)
상태 관리    : Zustand
사운드       : Howler.js
TTS          : Google Cloud TTS (ko-KR)
배포         : Vercel + PWA
```

> 💡 **포인트**: Phaser 3는 게임 씬(Canvas)을 담당하고, React는 그 외 UI(시작 버튼, 팝업, 설정)를 담당하는 **하이브리드 구조**가 유지보수와 확장 모두에 유리합니다.

---

## 🆚 엔진 / 플랫폼 종합 비교 (Phaser vs Unity vs Unreal vs Scratch)

> "더 좋은 엔진이 있지 않을까?" 에 대한 답변 정리

### 비교표

| 항목 | Phaser 3 ✅ | Unity | Unreal Engine | Scratch |
|------|------------|-------|---------------|---------|
| **배포 방식** | 브라우저 즉시 실행 | 앱 설치 or WebGL | 앱 설치 or WebGL | 브라우저 즉시 실행 |
| **유아 접근성** | URL 하나로 바로 실행 | 설치 허들 있음 | 설치 허들 있음 | URL 하나로 바로 실행 |
| **태블릿 배포** | Vercel 푸시 → 즉시 반영 | 앱스토어 심사 필요 | 앱스토어 심사 필요 | Scratch 서버 의존 |
| **2D 게임 적합성** | ✅ 2D 특화 | ✅ 적합 | ❌ 3D 중심 과스펙 | ✅ 2D 특화 |
| **커스텀 디자인 자유도** | ✅ 완전 자유 | ✅ 완전 자유 | ✅ 완전 자유 | ❌ 블록 UI 제한 |
| **학습 난이도** | ⭐⭐⭐ 중간 | ⭐⭐⭐ 중간 | ⭐⭐⭐⭐⭐ 매우 높음 | ⭐ 매우 낮음 |
| **빌드 용량** | < 5MB | 50MB~+ (WebGL 수십MB) | 500MB~+ | 해당 없음 |
| **고퀄 연출 가능성** | ✅ 충분 | ✅ 매우 높음 | ✅ 최고 수준 | ❌ 제한적 |
| **비용** | 완전 무료 | 무료 (수익 기준 제한) | 무료 (수익 기준 제한) | 완전 무료 |
| **오프라인 PWA** | ✅ 가능 | ❌ 별도 앱 필요 | ❌ 별도 앱 필요 | ❌ 불가 |
| **업데이트 배포** | push → 즉시 반영 | 앱 재배포 필요 | 앱 재배포 필요 | 프로젝트 재저장 |
| **이 게임 적합도** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐ | ⭐⭐ |

---

### 🟣 Scratch — 이런 경우 고려

**장점**
- 코딩 지식 없이도 블록 조립만으로 게임 제작 가능
- Scratch 플랫폼에서 즉시 공유 가능
- 교육 현장에서 아이들이 직접 수정·참여하는 용도로는 탁월

**단점**
- 커스텀 일러스트·애니메이션 연출이 매우 제한적
- 낙엽 파티클, 트윈 애니메이션, 글로우 이펙트 → **구현 불가 또는 매우 조잡함**
- 외부 사운드·TTS 연동 어려움
- 브랜드 아이덴티티 있는 "고퀄" 게임 제작 불가

**→ 결론**: 선생님이나 아이들이 직접 만드는 교육 활동용으로는 적합하지만,  
**완성도 높은 콘텐츠 제작 목적**에는 부적합

---

### 🟡 Unity — 이런 경우 고려

**장점**
- 2D 게임 제작 완전 지원 (Sprite, Animator, Tilemap)
- C# 스크립팅으로 복잡한 게임 로직 구현 가능
- 에디터에서 드래그앤드롭으로 씬 배치 가능
- 향후 앱스토어 출시 시 동일 코드베이스 재사용 가능

**단점**
- WebGL 빌드 시 초기 로딩 30초~1분 (유아에게 치명적)
- 앱 설치 배포 시 앱스토어 심사 수일~수주 소요
- Unity 에디터 자체 용량 수 GB, 진입장벽 있음
- 이 프로젝트 규모 대비 **과스펙**

**→ 결론**: 정식 앱스토어 출시 또는 오프라인 키오스크 설치형이 목표라면 Unity 추천  
→ 별도 문서 [`game_tech_stack_unity.md`](./game_tech_stack_unity.md) 참고

---

### ❌ Unreal Engine — 비추천 이유

- 주력이 3D AAA 게임 엔진 — 2D 유아 게임에 완전 과스펙
- Blueprint/C++ 학습 비용 대비 이 프로젝트에서 얻는 이점 없음
- WebGL 빌드 용량 500MB~1GB → 현실적으로 배포 불가

---

### 📌 시나리오별 최종 추천

| 시나리오 | 추천 |
|---------|------|
| 브라우저에서 URL로 바로 플레이 (교육 현장) | **Phaser 3** ✅ |
| 앱스토어 정식 출시 목표 | **Unity** |
| 선생님/아이가 직접 블록 코딩으로 수정 | **Scratch** |
| 3D 고퀄 게임으로 확장 예정 | **Unity 또는 Unreal** |
