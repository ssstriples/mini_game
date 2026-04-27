/**
 * 크롭 좌표 확인용 격자 미리보기 생성기
 * 원본 이미지 위에 각 크롭 영역을 색상 박스로 표시
 *
 * 사용법: node scripts/preview-grid.mjs
 * 결과: scripts/preview-grid.png
 */

import sharp from 'sharp'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')
const SRC  = path.join(ROOT, 'asset_2.png')
const OUT  = path.join(__dirname, 'preview-grid.png')

const meta = await sharp(SRC).metadata()
const W = meta.width
const H = meta.height

function px(rx, ry, rw, rh) {
  return { left: Math.round(W * rx), top: Math.round(H * ry), width: Math.round(W * rw), height: Math.round(H * rh) }
}

// crop-assets.mjs 와 동일한 CROPS 좌표 참조
const CROPS = [
  { region: px(0.010, 0.042, 0.235, 0.190), label: 'bg-main-menu',       color: '#FF000066' },
  { region: px(0.258, 0.042, 0.235, 0.190), label: 'bg-hide-phase',      color: '#FF000066' },
  { region: px(0.506, 0.042, 0.235, 0.190), label: 'bg-wait-phase',      color: '#FF000066' },
  { region: px(0.753, 0.042, 0.235, 0.190), label: 'bg-result',          color: '#FF000066' },
  { region: px(0.010, 0.265, 0.095, 0.140), label: 'squirrel-hand',      color: '#00FF0066' },
  { region: px(0.112, 0.258, 0.110, 0.160), label: 'squirrel-idle',      color: '#00FF0066' },
  { region: px(0.238, 0.262, 0.080, 0.130), label: 'acorn',              color: '#FFFF0066' },
  { region: px(0.333, 0.258, 0.058, 0.095), label: 'leaf-red',           color: '#FFFF0066' },
  { region: px(0.393, 0.265, 0.048, 0.085), label: 'leaf-orange',        color: '#FFFF0066' },
  { region: px(0.333, 0.348, 0.052, 0.090), label: 'leaf-green',         color: '#FFFF0066' },
  { region: px(0.388, 0.350, 0.055, 0.088), label: 'leaf-yellow',        color: '#FFFF0066' },
  { region: px(0.448, 0.250, 0.080, 0.120), label: 'spot-grass',         color: '#FF880066' },
  { region: px(0.535, 0.250, 0.080, 0.120), label: 'spot-rock',          color: '#FF880066' },
  { region: px(0.622, 0.250, 0.085, 0.120), label: 'spot-stump',         color: '#FF880066' },
  { region: px(0.712, 0.250, 0.090, 0.120), label: 'spot-log',           color: '#FF880066' },
  { region: px(0.808, 0.236, 0.100, 0.155), label: 'spot-tree-large',    color: '#FF880066' },
  { region: px(0.448, 0.378, 0.075, 0.120), label: 'spot-reed',          color: '#FF880066' },
  { region: px(0.532, 0.380, 0.075, 0.110), label: 'spot-mud-hole',      color: '#FF880066' },
  { region: px(0.618, 0.375, 0.082, 0.118), label: 'spot-leaf-pile',     color: '#FF880066' },
  { region: px(0.708, 0.368, 0.080, 0.135), label: 'spot-small-tree',    color: '#FF880066' },
  { region: px(0.800, 0.358, 0.105, 0.155), label: 'spot-tree-base',     color: '#FF880066' },
  { region: px(0.010, 0.530, 0.068, 0.100), label: 'btn-start',          color: '#0088FF66' },
  { region: px(0.082, 0.530, 0.068, 0.100), label: 'btn-retry',          color: '#0088FF66' },
  { region: px(0.155, 0.530, 0.085, 0.098), label: 'hud-timer',          color: '#00FFFF66' },
  { region: px(0.248, 0.525, 0.125, 0.100), label: 'hud-instruction',    color: '#00FFFF66' },
  { region: px(0.378, 0.525, 0.115, 0.100), label: 'hud-acorn-counter',  color: '#00FFFF66' },
  { region: px(0.010, 0.640, 0.185, 0.195), label: 'result-success',     color: '#FF00FF66' },
  { region: px(0.205, 0.640, 0.185, 0.195), label: 'result-fail',        color: '#FF00FF66' },
  { region: px(0.500, 0.648, 0.068, 0.110), label: 'effect-leaf',        color: '#FFFFFF66' },
  { region: px(0.578, 0.643, 0.078, 0.115), label: 'effect-found',       color: '#FFFFFF66' },
  { region: px(0.665, 0.640, 0.090, 0.130), label: 'deco-duck',          color: '#AAFFAA66' },
  { region: px(0.762, 0.635, 0.110, 0.135), label: 'deco-goose-fly',     color: '#AAFFAA66' },
]

// SVG로 오버레이 박스 생성
function makeSvgOverlay() {
  const rects = CROPS.map(c => {
    const r = c.region
    const hex = c.color.slice(0, 7)
    // SVG rect + 라벨 텍스트
    return `
      <rect x="${r.left}" y="${r.top}" width="${r.width}" height="${r.height}"
            fill="${hex}33" stroke="${hex}" stroke-width="2" />
      <text x="${r.left + 3}" y="${r.top + 13}"
            font-size="11" fill="${hex}" font-family="Arial" font-weight="bold">${c.label}</text>
    `
  }).join('')

  return `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">${rects}</svg>`
}

const svgBuffer = Buffer.from(makeSvgOverlay())

await sharp(SRC)
  .composite([{ input: svgBuffer, top: 0, left: 0 }])
  .png()
  .toFile(OUT)

console.log(`\n✅ 미리보기 생성 완료: ${OUT}`)
console.log(`   이미지를 열어 크롭 박스 위치를 확인하세요.\n`)
console.log('🎨 색상 범례:')
console.log('  🔴 빨강   = 배경 이미지')
console.log('  🟢 초록   = 캐릭터 스프라이트')
console.log('  🟡 노랑   = 게임 아이템 (도토리/낙엽)')
console.log('  🟠 주황   = 숨길 장소 스프라이트')
console.log('  🔵 파랑   = UI 버튼')
console.log('  🩵 하늘   = HUD 요소')
console.log('  💜 보라   = 결과 화면 UI')
console.log('  ⬜ 흰색   = 이펙트')
console.log('  🟩 연두   = 장식용 스프라이트\n')
