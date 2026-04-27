import Phaser from 'phaser'
import { useGameStore } from '../store/gameStore'
import { FONT } from '../config/gameConfig'

/**
 * ResultScene — 게임 완료 결과 화면 (Phaser 배경)
 * - 별 점수 + 결과 텍스트 표시
 * - 버튼은 React ResultPopup이 담당 (중복 제거)
 * - React의 onReplay/onHome 콜백이 Phaser 씬 전환도 처리
 */
export class ResultScene extends Phaser.Scene {
  constructor() {
    super({ key: 'ResultScene' })
  }

  create() {
    const { width, height } = this.scale
    const store = useGameStore.getState()
    const result = store.gameResult

    // ── 배경 ──────────────────────────────────────────
    this.add.image(width / 2, height / 2, 'bg-forest').setAlpha(0.6)

    // 어두운 오버레이 (React ResultPopup backdrop-blur와 겹치므로 연하게)
    const overlay = this.add.graphics()
    overlay.fillStyle(0x1a0d00, 0.4)
    overlay.fillRect(0, 0, width, height)

    // ── 결과 데이터 ────────────────────────────────────
    const correct = result?.correctCount ?? 0
    const total = result?.totalRounds ?? store.totalRounds
    const isPerfect = correct === total
    const starCount = correct === total ? 3 : correct >= total * 0.6 ? 2 : 1

    // ── 타이틀 ────────────────────────────────────────
    this.add
      .text(width / 2, height / 2 - 100, isPerfect ? '🎉 완벽해요!' : '🐿️ 결과 발표!', {
        fontSize: '38px',
        color: '#fff8e1',
        fontStyle: 'bold',
        fontFamily: FONT,
        stroke: '#3b1f00',
        strokeThickness: 6,
      })
      .setOrigin(0.5)

    // ── 점수 텍스트 ───────────────────────────────────
    this.add
      .text(width / 2, height / 2 - 40, `${total}개 중 ${correct}개 맞혔어요!`, {
        fontSize: '26px',
        color: '#fff8e1',
        fontFamily: FONT,
        stroke: '#3b1f00',
        strokeThickness: 4,
      })
      .setOrigin(0.5)

    // ── 별 표시 ───────────────────────────────────────
    const starSpacing = 80
    for (let i = 0; i < 3; i++) {
      const x = width / 2 + (i - 1) * starSpacing
      const filled = i < starCount
      const star = this.add
        .image(x, height / 2 + 60, 'star')
        .setScale(0)
        .setAlpha(filled ? 1 : 0.25)

      this.tweens.add({
        targets: star,
        scaleX: filled ? 1.0 : 0.6,
        scaleY: filled ? 1.0 : 0.6,
        duration: 400,
        delay: 200 + i * 200,
        ease: 'Back.easeOut',
      })
    }

    // ── 카메라 페이드인 ────────────────────────────────
    this.cameras.main.fadeIn(500, 0, 0, 0)
  }
}
