/**
 * 깜빡깜빡 다람이의 우포늪 — 에셋 자동 크롭 스크립트
 *
 * 사용법:
 *   1. asset_2.png 파일을 프로젝트 루트(mini-game/)에 저장
 *   2. node scripts/crop-assets.mjs
 *
 * 의존성: sharp (npm install sharp --save-dev)
 */

import sharp from 'sharp'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')
const SRC = path.join(ROOT, 'asset_2.png')
const ASSETS = path.join(ROOT, 'assets')

// ─────────────────────────────────────────
// 0. 원본 이미지 크기 확인
// ─────────────────────────────────────────
const meta = await sharp(SRC).metadata()
const W = meta.width
const H = meta.height
console.log(`📐 원본 이미지: ${W} × ${H}px`)

// ─────────────────────────────────────────
// 크롭 정의 (left, top, width, height)
// 원본 기준 비율로 계산 → 실제 픽셀로 변환
// ─────────────────────────────────────────

function px(ratioX, ratioY, ratioW, ratioH) {
  return {
    left:   Math.round(W * ratioX),
    top:    Math.round(H * ratioY),
    width:  Math.round(W * ratioW),
    height: Math.round(H * ratioH),
  }
}

const CROPS = [

  // ── 1. 배경 4종 ──────────────────────────────────────────────────
  {
    out: 'backgrounds/bg-main-menu.png',
    region: px(0.010, 0.042, 0.235, 0.190),
    resize: { width: 1024, height: 600 },
    desc: '① 시작 화면 배경',
  },
  {
    out: 'backgrounds/bg-hide-phase.png',
    region: px(0.258, 0.042, 0.235, 0.190),
    resize: { width: 1024, height: 600 },
    desc: '② 도토리 숨기기 배경',
  },
  {
    out: 'backgrounds/bg-wait-phase.png',
    region: px(0.506, 0.042, 0.235, 0.190),
    resize: { width: 1024, height: 600 },
    desc: '③ 낙엽 효과 배경',
  },
  {
    out: 'backgrounds/bg-result.png',
    region: px(0.753, 0.042, 0.235, 0.190),
    resize: { width: 1024, height: 600 },
    desc: '④ 결과 화면 배경',
  },

  // ── 2. 캐릭터 스프라이트 ─────────────────────────────────────────
  {
    out: 'sprites/characters/squirrel-hand.png',
    region: px(0.010, 0.265, 0.095, 0.140),
    resize: { width: 120, height: 140 },
    desc: '다람쥐 손 (커서)',
  },
  {
    out: 'sprites/characters/squirrel-idle.png',
    region: px(0.112, 0.258, 0.110, 0.160),
    resize: { width: 120, height: 140 },
    desc: '다람쥐 캐릭터 (기본)',
  },

  // ── 3. 게임 아이템 ───────────────────────────────────────────────
  {
    out: 'sprites/items/acorn.png',
    region: px(0.238, 0.262, 0.080, 0.130),
    resize: { width: 100, height: 110 },
    desc: '도토리',
  },
  {
    out: 'sprites/items/leaf-red.png',
    region: px(0.333, 0.258, 0.058, 0.095),
    resize: { width: 80, height: 80 },
    desc: '낙엽 (빨강 단풍잎)',
  },
  {
    out: 'sprites/items/leaf-orange.png',
    region: px(0.393, 0.265, 0.048, 0.085),
    resize: { width: 80, height: 80 },
    desc: '낙엽 (주황 단풍잎)',
  },
  {
    out: 'sprites/items/leaf-green.png',
    region: px(0.333, 0.348, 0.052, 0.090),
    resize: { width: 80, height: 80 },
    desc: '낙엽 (녹색 잎)',
  },
  {
    out: 'sprites/items/leaf-yellow.png',
    region: px(0.388, 0.350, 0.055, 0.088),
    resize: { width: 80, height: 80 },
    desc: '낙엽 (노랑 은행잎)',
  },

  // ── 4. 숨길 장소 스프라이트 (8종) ───────────────────────────────
  {
    out: 'sprites/spots/spot-grass.png',
    region: px(0.448, 0.250, 0.080, 0.120),
    resize: { width: 120, height: 120 },
    desc: '풀숲',
  },
  {
    out: 'sprites/spots/spot-rock.png',
    region: px(0.535, 0.250, 0.080, 0.120),
    resize: { width: 120, height: 120 },
    desc: '돌 옆',
  },
  {
    out: 'sprites/spots/spot-stump.png',
    region: px(0.622, 0.250, 0.085, 0.120),
    resize: { width: 120, height: 120 },
    desc: '나무 그루터기',
  },
  {
    out: 'sprites/spots/spot-log.png',
    region: px(0.712, 0.250, 0.090, 0.120),
    resize: { width: 120, height: 120 },
    desc: '통나무',
  },
  {
    out: 'sprites/spots/spot-tree-large.png',
    region: px(0.808, 0.236, 0.100, 0.155),
    resize: { width: 120, height: 140 },
    desc: '나무 밑 따오기 (큰 나무)',
  },
  {
    out: 'sprites/spots/spot-reed.png',
    region: px(0.448, 0.378, 0.075, 0.120),
    resize: { width: 100, height: 130 },
    desc: '억새숲',
  },
  {
    out: 'sprites/spots/spot-mud-hole.png',
    region: px(0.532, 0.380, 0.075, 0.110),
    resize: { width: 110, height: 110 },
    desc: '흙 구멍',
  },
  {
    out: 'sprites/spots/spot-leaf-pile.png',
    region: px(0.618, 0.375, 0.082, 0.118),
    resize: { width: 120, height: 120 },
    desc: '낙엽 더미',
  },
  {
    out: 'sprites/spots/spot-small-tree.png',
    region: px(0.708, 0.368, 0.080, 0.135),
    resize: { width: 100, height: 140 },
    desc: '작은 나무',
  },
  {
    out: 'sprites/spots/spot-tree-base.png',
    region: px(0.800, 0.358, 0.105, 0.155),
    resize: { width: 120, height: 150 },
    desc: '나무 밑 따오기 (오리 포함)',
  },

  // ── 5. UI 버튼 ───────────────────────────────────────────────────
  {
    out: 'ui/buttons/btn-start.png',
    region: px(0.010, 0.530, 0.068, 0.100),
    resize: { width: 100, height: 100 },
    desc: '시작 버튼 (초록 깃발)',
  },
  {
    out: 'ui/buttons/btn-retry.png',
    region: px(0.082, 0.530, 0.068, 0.100),
    resize: { width: 100, height: 100 },
    desc: '다시하기 버튼 (주황 C)',
  },

  // ── 6. HUD 요소 ──────────────────────────────────────────────────
  {
    out: 'ui/hud/hud-timer.png',
    region: px(0.155, 0.530, 0.085, 0.098),
    resize: { width: 120, height: 80 },
    desc: '타이머 (시계 + 숫자 60)',
  },
  {
    out: 'ui/hud/hud-instruction.png',
    region: px(0.248, 0.525, 0.125, 0.100),
    resize: { width: 220, height: 80 },
    desc: '도토리 5개를 숨겨보아요! 안내 패널',
  },
  {
    out: 'ui/hud/hud-acorn-counter.png',
    region: px(0.378, 0.525, 0.115, 0.100),
    resize: { width: 160, height: 80 },
    desc: '도토리 개수 표시 (🌰×5)',
  },

  // ── 7. 결과 화면 UI ──────────────────────────────────────────────
  {
    out: 'ui/result/result-success-panel.png',
    region: px(0.010, 0.640, 0.185, 0.195),
    resize: { width: 360, height: 200 },
    desc: '성공 패널 (성공! 다람이가 도토리를 모두 찾았어요!)',
  },
  {
    out: 'ui/result/result-fail-panel.png',
    region: px(0.205, 0.640, 0.185, 0.195),
    resize: { width: 360, height: 200 },
    desc: '실패 패널 (아쉽지만... 참나무가 자랐네요!)',
  },

  // ── 8. 이펙트 스프라이트 ─────────────────────────────────────────
  {
    out: 'sprites/effects/effect-leaf.png',
    region: px(0.500, 0.648, 0.068, 0.110),
    resize: { width: 80, height: 100 },
    desc: '낙엽 효과 (휙~)',
  },
  {
    out: 'sprites/effects/effect-found.png',
    region: px(0.578, 0.643, 0.078, 0.115),
    resize: { width: 100, height: 100 },
    desc: '발견 효과 (찾았을 때 빛)',
  },

  // ── 9. 장식용 스프라이트 ─────────────────────────────────────────
  {
    out: 'sprites/decorations/deco-duck.png',
    region: px(0.665, 0.640, 0.090, 0.130),
    resize: { width: 110, height: 110 },
    desc: '청둥오리 장식',
  },
  {
    out: 'sprites/decorations/deco-goose-fly.png',
    region: px(0.762, 0.635, 0.110, 0.135),
    resize: { width: 130, height: 110 },
    desc: '큰기러기 (날아가는 모습)',
  },
]

// ─────────────────────────────────────────
// 실행: 크롭 + 저장
// ─────────────────────────────────────────
let success = 0
let failed = 0

console.log(`\n🔪 에셋 크롭 시작 (총 ${CROPS.length}개)\n`)

for (const crop of CROPS) {
  const outPath = path.join(ASSETS, crop.out)
  const outDir = path.dirname(outPath)

  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true })

  try {
    const region = crop.region

    // 범위 보정 (이미지 경계 초과 방지)
    const safeRegion = {
      left:   Math.max(0, region.left),
      top:    Math.max(0, region.top),
      width:  Math.min(region.width,  W - region.left),
      height: Math.min(region.height, H - region.top),
    }

    let pipeline = sharp(SRC).extract(safeRegion)

    if (crop.resize) {
      pipeline = pipeline.resize(crop.resize.width, crop.resize.height, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 },  // 투명 배경
      })
    }

    await pipeline.png({ compressionLevel: 9 }).toFile(outPath)

    console.log(`  ✅ ${crop.out.padEnd(52)} ← ${crop.desc}`)
    success++
  } catch (err) {
    console.error(`  ❌ ${crop.out.padEnd(52)} 실패: ${err.message}`)
    failed++
  }
}

console.log(`\n${'─'.repeat(70)}`)
console.log(`✅ 성공: ${success}개   ❌ 실패: ${failed}개`)
console.log(`📁 저장 위치: ${ASSETS}`)
console.log(`${'─'.repeat(70)}\n`)

if (failed > 0) {
  console.log('⚠️  실패한 항목은 크롭 좌표를 수동으로 조정해주세요.')
  console.log('   scripts/preview-grid.mjs 를 실행하면 격자 미리보기가 생성됩니다.\n')
}
