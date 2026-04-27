# 🔊 사운드 에셋 가이드 — 다람이의 도토리 기억 숲

> 이 문서는 게임에 필요한 사운드 파일의 **저장 위치 · 파일명 · 포맷 · 권장 사양**을 정리합니다.  
> 파일이 없어도 게임은 정상 실행됩니다 (AudioManager가 자동으로 무시).

---

## 📁 저장 위치 구조

```
d:\LSH_GITHUB\mini-game\game\
└── public\
    └── assets\
        └── sounds\
            ├── sfx\
            │   ├── correct.mp3       ← 정답 효과음
            │   ├── wrong.mp3         ← 오답 효과음
            │   ├── click.mp3         ← 버튼 클릭음
            │   ├── complete.mp3      ← 게임 완료음
            │   └── memorize.mp3      ← 기억 단계 시작음
            └── bgm\
                └── forest-ambient.mp3  ← 배경 음악
```

> ⚠️ **`public/` 폴더 하위에 저장해야 합니다.**  
> Vite는 `public/` 폴더의 파일을 그대로 `/` 경로로 서빙합니다.  
> `src/assets/` 에 넣으면 **AudioManager가 파일을 찾지 못합니다.**

---

## 🎵 파일별 상세 사양

### SFX (효과음)

| 파일명 | 용도 | 재생 시점 | 권장 길이 | 권장 볼륨 느낌 |
|--------|------|-----------|-----------|----------------|
| `correct.mp3` | 정답 | 장소를 맞췄을 때 | 0.5~1초 | 밝고 경쾌한 차임 |
| `wrong.mp3` | 오답 | 장소를 틀렸을 때 | 0.5~1초 | 부드러운 낮은 음 (유아 자극 최소화) |
| `click.mp3` | 버튼 클릭 | 모든 버튼 클릭 | 0.1~0.3초 | 짧고 가벼운 탁 소리 |
| `complete.mp3` | 게임 완료 | 마지막 라운드 종료 | 2~3초 | 밝은 팡파레/성공음 |
| `memorize.mp3` | 기억 단계 | 다람이가 도토리 숨길 때 | 0.5~1초 | 신비롭고 귀여운 소리 |

### BGM (배경음악)

| 파일명 | 용도 | 재생 방식 | 권장 길이 | 권장 볼륨 |
|--------|------|-----------|-----------|-----------|
| `forest-ambient.mp3` | 숲 배경음 | 루프 반복 | 30초~3분 | 조용한 자연음 (새소리, 바람 등) |

---

## 🎚️ 파일 포맷 요구사항

### 필수 포맷
| 항목 | 권장값 |
|------|--------|
| **파일 형식** | `.mp3` (모든 브라우저 지원) |
| **샘플레이트** | 44,100 Hz |
| **비트레이트** | SFX: 128 kbps / BGM: 192 kbps |
| **채널** | 스테레오 (2ch) 또는 모노 (1ch) |
| **최대 파일 크기** | SFX: 200 KB 이하 / BGM: 5 MB 이하 |

### 추가 포맷 (선택 — 브라우저 호환성 향상)
Howler.js는 여러 포맷을 배열로 지정하면 자동으로 지원 포맷을 선택합니다.  
현재 `AudioManager.ts`는 `.mp3`만 지정되어 있으나, `.webm` 추가 시 더 넓은 호환성 확보:

```ts
// AudioManager.ts 에서 src 배열에 webm 추가 예시
correct: ['/assets/sounds/sfx/correct.webm', '/assets/sounds/sfx/correct.mp3'],
```

| 형식 | 장점 | 변환 도구 |
|------|------|-----------|
| `.mp3` | 범용 지원 | — |
| `.webm` | 파일 크기 30% 절감 | FFmpeg, Audacity |
| `.ogg` | 오픈소스, 고품질 | Audacity |

---

## 🔍 무료 사운드 소스 추천

### SFX

| 파일 | 추천 사이트 | 검색 키워드 |
|------|------------|-------------|
| `correct.mp3` | [Pixabay](https://pixabay.com/sound-effects/) | `correct chime children` |
| `wrong.mp3` | [Pixabay](https://pixabay.com/sound-effects/) | `wrong buzz soft gentle` |
| `click.mp3` | [Pixabay](https://pixabay.com/sound-effects/) | `click button soft pop` |
| `complete.mp3` | [Pixabay](https://pixabay.com/sound-effects/) | `success fanfare children cute` |
| `memorize.mp3` | [Freesound.org](https://freesound.org) | `magic sparkle twinkle` |

### BGM

| 파일 | 추천 사이트 | 검색 키워드 |
|------|------------|-------------|
| `forest-ambient.mp3` | [Freesound.org](https://freesound.org) (CC0 라이선스) | `forest nature ambient loop birds` |
| `forest-ambient.mp3` | [OpenGameArt.org](https://opengameart.org) | `forest ambient loop children` |

> ✅ **CC0 또는 CC-BY 라이선스** 파일만 사용하세요.  
> CC-BY 사용 시 `credits.md` 파일에 출처를 기록해야 합니다.

---

## 🛠️ 파일 배치 후 확인 방법

### 1. 폴더 구조 확인
```bash
# 터미널에서 실행
find /d/LSH_GITHUB/mini-game/game/public/assets/sounds -type f | sort
```
예상 출력:
```
/d/LSH_GITHUB/mini-game/game/public/assets/sounds/bgm/forest-ambient.mp3
/d/LSH_GITHUB/mini-game/game/public/assets/sounds/sfx/click.mp3
/d/LSH_GITHUB/mini-game/game/public/assets/sounds/sfx/complete.mp3
/d/LSH_GITHUB/mini-game/game/public/assets/sounds/sfx/correct.mp3
/d/LSH_GITHUB/mini-game/game/public/assets/sounds/sfx/memorize.mp3
/d/LSH_GITHUB/mini-game/game/public/assets/sounds/sfx/wrong.mp3
```

### 2. 브라우저에서 직접 접근 테스트
개발 서버(`pnpm dev`) 실행 후 브라우저 주소창에 입력:
```
http://localhost:5173/assets/sounds/sfx/correct.mp3
```
→ 브라우저에서 바로 재생되면 경로 정상 ✅  
→ 404 오류면 경로 또는 파일명 확인 필요 ❌

### 3. 브라우저 콘솔 확인
`F12` → Console 탭에서 AudioManager 경고 확인:
```
[AudioManager] SFX not found: correct   ← 파일 없음
[AudioManager] BGM not found, ...       ← BGM 파일 없음
```
→ 위 메시지가 없으면 모든 파일 정상 로드 ✅

---

## ⚡ 빠른 시작 — 폴더만 먼저 만들기

파일이 아직 없어도 폴더는 미리 생성해두세요:

```bash
mkdir -p /d/LSH_GITHUB/mini-game/game/public/assets/sounds/sfx
mkdir -p /d/LSH_GITHUB/mini-game/game/public/assets/sounds/bgm
```

파일을 다운로드한 뒤 위 폴더에 복사하면 즉시 적용됩니다.  
**개발 서버를 재시작할 필요 없습니다** (Vite HMR이 자동 감지).

---

## 📝 라이선스 기록 템플릿 (`credits.md`)

CC-BY 파일 사용 시 아래 형식으로 기록:

```markdown
## 사운드 크레딧

| 파일 | 제목 | 작성자 | 출처 | 라이선스 |
|------|------|--------|------|----------|
| correct.mp3 | Correct Chime | username | freesound.org/s/12345 | CC0 |
| forest-ambient.mp3 | Forest Birds Loop | username | freesound.org/s/67890 | CC-BY 3.0 |
```
