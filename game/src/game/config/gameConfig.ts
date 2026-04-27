import Phaser from 'phaser'
import type { DifficultyConfig } from './types'

/** 캔버스 기본 크기 */
export const CANVAS_WIDTH = 1024
export const CANVAS_HEIGHT = 600

/** Phaser 게임 초기화 설정 */
export const PHASER_CONFIG: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: CANVAS_WIDTH,
  height: CANVAS_HEIGHT,
  backgroundColor: '#87CEEB',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: {
    default: 'arcade',
    arcade: { debug: false },
  },
  // Scene은 GameCanvas.tsx에서 주입
  scene: [],
}

/** 난이도별 설정 */
export const DIFFICULTY_CONFIG: Record<string, DifficultyConfig> = {
  easy: {
    rounds: 3,
    memorizeTimeMs: 4000,
    spotCount: 4,
  },
  normal: {
    rounds: 5,
    memorizeTimeMs: 3000,
    spotCount: 6,
  },
  hard: {
    rounds: 7,
    memorizeTimeMs: 2000,
    spotCount: 8,
  },
}

/** 기본 난이도 */
export const DEFAULT_DIFFICULTY = 'easy'

/** 애니메이션 설정 */
export const ANIM = {
  squirrelHide: 800,
  spotReveal: 400,
  resultDelay: 600,
} as const

/** 공통 폰트 패밀리 */
export const FONT = "'Noto Sans KR', Arial, sans-serif"
