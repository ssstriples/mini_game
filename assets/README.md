# 🎨 깜빡깜빡 다람이의 우포늪 — 에셋 디렉토리

> 게임에 사용되는 모든 이미지·사운드 에셋 정리  
> 이미지 포맷: **PNG** (투명 배경 필요 시) / **WEBP** (배경 이미지)  
> 사운드 포맷: **MP3** + **WEBM** (브라우저 호환 폴백)

---

## 📁 디렉토리 구조

```
assets/
├── backgrounds/          # 1. 배경 이미지 (4종)
├── sprites/
│   ├── characters/       # 2. 캐릭터 스프라이트 (다람쥐, 손)
│   ├── spots/            # 3. 숨길 장소 스프라이트 (8종)
│   ├── items/            # 4. 게임 아이템 (도토리, 낙엽)
│   ├── effects/          # 5. 이펙트 스프라이트 (발견 효과, 낙엽 효과)
│   └── decorations/      # 6. 장식용 스프라이트 (청둥오리, 큰기러기)
├── ui/
│   ├── buttons/          # 7. UI 버튼 (시작, 다시하기)
│   ├── hud/              # 8. HUD 요소 (타이머, 도토리 개수 표시)
│   └── result/           # 9. 결과 화면 UI (성공, 실패)
└── sounds/
    ├── bgm/              # 10. 배경음악
    └── sfx/              # 11. 효과음
```

---

## 1. 배경 이미지 (`backgrounds/`)

| 파일명 | 용도 | 해상도 | 비고 |
|--------|------|--------|------|
| `bg-main-menu.png` | ① 시작 화면 배경 | 1024×600 | 우포늪 호수, 맑은 날 |
| `bg-hide-phase.png` | ② 도토리 숨기기 배경 | 1024×600 | 큰 나무 + 호수, 낮 |
| `bg-wait-phase.png` | ③ 낙엽 효과 배경 | 1024×600 | 낙엽 날리는 가을 장면 |
| `bg-result.png` | ④ 결과 화면 배경 | 1024×600 | 큰 나무 + 오리, 맑음 |

> 💡 모든 배경은 **가로 1024px × 세로 600px** 기준  
> Phaser 로딩 키: `bg-main-menu`, `bg-hide-phase`, `bg-wait-phase`, `bg-result`

---

## 2. 캐릭터 스프라이트 (`sprites/characters/`)

| 파일명 | 용도 | 크기 | 비고 |
|--------|------|------|------|
| `squirrel-idle.png` | 다람쥐 기본 자세 | 120×140px | 정면, 웃는 표정 |
| `squirrel-happy.png` | 다람쥐 기쁨 | 120×140px | 양 팔 들기, 성공 시 |
| `squirrel-walk-spritesheet.png` | 다람쥐 걷기 스프라이트시트 | 480×140px | 4프레임 (퇴장 애니메이션) |
| `squirrel-hand.png` | 다람쥐 손 (커서 대체) | 80×90px | 투명 배경, 포인팅 손 |

> Phaser 로딩 키: `squirrel-idle`, `squirrel-happy`, `squirrel-walk`, `squirrel-hand`

---

## 3. 숨길 장소 스프라이트 (`sprites/spots/`)

> 클릭 가능한 인터랙티브 장소 — 각각 **일반 / 선택됨** 2가지 상태 이미지 필요

| 파일명 | 장소 이름 | 크기 | Phaser 키 |
|--------|----------|------|-----------|
| `spot-grass.png` | 풀숲 | 100×90px | `spot-grass` |
| `spot-rock.png` | 돌 옆 | 100×90px | `spot-rock` |
| `spot-stump.png` | 나무 그루터기 | 100×90px | `spot-stump` |
| `spot-log.png` | 통나무 | 110×80px | `spot-log` |
| `spot-reed.png` | 억새숲 | 90×110px | `spot-reed` |
| `spot-mud-hole.png` | 흙 구멍 | 100×80px | `spot-mud-hole` |
| `spot-leaf-pile.png` | 낙엽 더미 | 110×80px | `spot-leaf-pile` |
| `spot-small-tree.png` | 작은 나무 | 90×120px | `spot-small-tree` |
| `spot-tree-base.png` | 나무 밑 따오기 | 110×120px | `spot-tree-base` |

> 💡 선택된 상태 이미지가 별도로 필요한 경우:  
> `spot-grass-selected.png` 형식으로 추가 (또는 Phaser tint로 대체 가능)

---

## 4. 게임 아이템 (`sprites/items/`)

| 파일명 | 용도 | 크기 | 비고 |
|--------|------|------|------|
| `acorn.png` | 도토리 | 50×55px | 투명 배경, 광택 있는 스타일 |
| `leaf-red.png` | 낙엽 (빨강) | 40×35px | 단풍잎 형태 |
| `leaf-orange.png` | 낙엽 (주황) | 40×35px | 단풍잎 형태 |
| `leaf-yellow.png` | 낙엽 (노랑) | 38×32px | 은행잎 형태 |
| `leaf-brown.png` | 낙엽 (갈색) | 42×36px | 참나무잎 형태 |

> 낙엽 4종은 파티클 이미터에서 랜덤으로 사용  
> Phaser 로딩 키: `acorn`, `leaf-red`, `leaf-orange`, `leaf-yellow`, `leaf-brown`

---

## 5. 이펙트 스프라이트 (`sprites/effects/`)

| 파일명 | 용도 | 크기 | 비고 |
|--------|------|------|------|
| `effect-found.png` | 발견 효과 (찾았을 때 반짝임) | 80×80px | 별 + 빛줄기, 투명 배경 |
| `effect-found-spritesheet.png` | 발견 효과 스프라이트시트 | 480×80px | 6프레임 애니메이션 |
| `effect-wrong.png` | 오답 효과 (낙엽 휙~) | 60×60px | 단일 낙엽 흩날림 |
| `effect-sparkle.png` | 반짝임 파티클 | 20×20px | 작은 별, 노란색 |

> Phaser 로딩 키: `effect-found`, `effect-sparkle`

---

## 6. 장식용 스프라이트 (`sprites/decorations/`)

> 게임 플레이와 무관한 배경 장식 요소 (선택 적용)

| 파일명 | 용도 | 크기 | 비고 |
|--------|------|------|------|
| `deco-duck.png` | 청둥오리 (장식용) | 70×55px | 물가 장식, 정지 상태 |
| `deco-goose-fly.png` | 큰기러기 (날아가는 모습) | 90×60px | 날개 편 모습, 배경 장식 |
| `deco-goose-fly-spritesheet.png` | 큰기러기 날갯짓 시트 | 360×60px | 4프레임, 배경 지나가기 |

---

## 7. UI 버튼 (`ui/buttons/`)

| 파일명 | 용도 | 크기 | 비고 |
|--------|------|------|------|
| `btn-start.png` | 시작 버튼 (초록 깃발) | 140×60px | 기본 상태 |
| `btn-start-hover.png` | 시작 버튼 호버 | 140×60px | 밝은 상태 |
| `btn-retry.png` | 다시하기 버튼 (주황 C) | 140×60px | 기본 상태 |
| `btn-retry-hover.png` | 다시하기 버튼 호버 | 140×60px | 밝은 상태 |

---

## 8. HUD 요소 (`ui/hud/`)

| 파일명 | 용도 | 크기 | 비고 |
|--------|------|------|------|
| `hud-timer-bg.png` | 타이머 배경 (시계 아이콘 포함) | 100×60px | 숫자는 동적으로 렌더링 |
| `hud-acorn-empty.png` | 도토리 카운터 — 빈 상태 | 40×44px | 반투명 도토리 아이콘 |
| `hud-acorn-filled.png` | 도토리 카운터 — 채워진 상태 | 40×44px | 불투명 도토리 아이콘 |
| `hud-instruction-bg.png` | 안내 텍스트 배경 패널 | 280×70px | "도토리 5개를 숨겨보아요!" 배경 |

---

## 9. 결과 화면 UI (`ui/result/`)

| 파일명 | 용도 | 크기 | 비고 |
|--------|------|------|------|
| `result-success-panel.png` | 성공 패널 배경 | 560×340px | 연두색 테두리 박스 |
| `result-success-squirrel.png` | 성공 시 다람쥐 (기뻐하는 모습) | 100×120px | 팔 들고 만세 |
| `result-fail-panel.png` | 실패 패널 배경 | 560×340px | 오렌지 테두리 박스 |
| `result-fail-tree.png` | 실패 시 참나무 (위로 이미지) | 80×110px | 작은 참나무 일러스트 |

---

## 10. 배경음악 (`sounds/bgm/`)

| 파일명 | 용도 | 길이 | 비고 |
|--------|------|------|------|
| `bgm-forest.mp3` | 숲 자연 배경음 (루프) | 60~120초 | CC0 라이선스 |
| `bgm-forest.webm` | 동일 파일 WEBM 폴백 | — | 브라우저 호환용 |

> 출처: [Freesound.org](https://freesound.org) — 검색어: `"forest nature ambient loop"`  
> Phaser 로딩 키: `bgm-forest`

---

## 11. 효과음 (`sounds/sfx/`)

| 파일명 | 용도 | 타이밍 | 비고 |
|--------|------|--------|------|
| `sfx-click.mp3` | 버튼 클릭음 | 버튼 누를 때 | 짧은 클릭 |
| `sfx-acorn-hide.mp3` | 도토리 숨기기 | 장소 선택 시 | "뚝" 소리 |
| `sfx-leaf-rustle.mp3` | 낙엽 바스락 | 낙엽 파티클 재생 중 | 루프 가능 |
| `sfx-correct.mp3` | 정답 효과음 | 도토리 발견 시 | 밝은 팡파레 |
| `sfx-wrong.mp3` | 오답 효과음 | 빈 장소 클릭 시 | 낮은 "웅~" |
| `sfx-success.mp3` | 성공 효과음 | 결과 화면 성공 시 | 밝은 팡파레 |
| `sfx-card-flip.mp3` | 장소 뒤집기 | 찾기 단계 클릭 시 | 카드 뒤집는 소리 |

> 출처: [Pixabay](https://pixabay.com/sound-effects/) / [Freesound.org](https://freesound.org)  
> 모든 효과음 `.mp3` + `.webm` 쌍으로 준비 권장

---

## 🔑 Phaser 텍스처 키 전체 목록

```ts
// 배경
'bg-main-menu' | 'bg-hide-phase' | 'bg-wait-phase' | 'bg-result'

// 캐릭터
'squirrel-idle' | 'squirrel-happy' | 'squirrel-walk' | 'squirrel-hand'

// 장소 (8종)
'spot-grass' | 'spot-rock' | 'spot-stump' | 'spot-log'
'spot-reed'  | 'spot-mud-hole' | 'spot-leaf-pile' | 'spot-small-tree' | 'spot-tree-base'

// 아이템
'acorn' | 'leaf-red' | 'leaf-orange' | 'leaf-yellow' | 'leaf-brown'

// 이펙트
'effect-found' | 'effect-sparkle'

// 장식
'deco-duck' | 'deco-goose-fly'

// UI
'btn-start' | 'btn-retry'
'hud-timer-bg' | 'hud-acorn-empty' | 'hud-acorn-filled'
'result-success-panel' | 'result-success-squirrel'
'result-fail-panel' | 'result-fail-tree'

// 사운드
'bgm-forest'
'sfx-click' | 'sfx-acorn-hide' | 'sfx-leaf-rustle'
'sfx-correct' | 'sfx-wrong' | 'sfx-success' | 'sfx-card-flip'
```

---

## 🛠️ 에셋 제작 가이드

### 권장 제작 도구
| 도구 | 용도 |
|------|------|
| **Figma** | UI 버튼, HUD, 결과 패널 |
| **Midjourney v6 / Adobe Firefly** | 배경 이미지, 캐릭터 일러스트 |
| **Stable Diffusion** | 장소 스프라이트 (풀숲, 돌, 나무 등) |
| **Adobe Animate / Aseprite** | 스프라이트시트 애니메이션 |
| **Freesound.org / Pixabay** | CC0 효과음 수집 |

### 이미지 최적화
```bash
# WebP 변환 (품질 85%, 용량 최소화)
cwebp -q 85 input.png -o output.webp

# PNG 최적화
pngquant --quality=65-80 *.png
```

### 에셋 미준비 시
> 모든 에셋은 `BootScene`의 **placeholder 생성 코드**로 대체되어  
> 실제 파일 없이도 게임 개발 진행 가능 (`game_tasks.md` G024 참고)
