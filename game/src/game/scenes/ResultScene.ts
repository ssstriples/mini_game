import Phaser from 'phaser'
import { useGameStore } from '../store/gameStore'
import { AudioManager } from '../managers/AudioManager'
import { FONT } from '../config/gameConfig'

/**
 * ResultScene — 게임 완료 결과 화면
 * - 정답률 표시 (별 개수)
 * - 다시하기 / 메인으로 버튼
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

    // 어두운 오버레이
    const overlay = this.add.graphics()
    overlay.fillStyle(0x1a0d00, 0.75)
    overlay.fillRect(0, 0, width, height)

    // ── 결과 패널 ──────────────────────────────────────
    const panel = this.add.graphics()
    panel.fillStyle(0xfff8e1, 0.95)
    panel.fillRoundedRect(width / 2 - 260, height / 2 - 220, 520, 440, 24)
    panel.lineStyle(4, 0xff6b35, 1)
    panel.strokeRoundedRect(width / 2 - 260, height / 2 - 220, 520, 440, 24)

    // ── 타이틀 ────────────────────────────────────────
    const correct = result?.correctCount ?? 0
    const total = result?.totalRounds ?? store.totalRounds
    const isPerfect = correct === total

    this.add
      .text(width / 2, height / 2 - 170, isPerfect ? '🎉 완벽해요!' : '🐿️ 결과 발표!', {
        fontSize: '34px',
        color: '#3b1f00',
        fontStyle: 'bold',
        fontFamily: FONT,
      })
      .setOrigin(0.5)

    // ── 점수 텍스트 ───────────────────────────────────
    this.add
      .text(width / 2, height / 2 - 110, `${total}개 중 ${correct}개 맞혔어요!`, {
        fontSize: '24px',
        color: '#5c3d1e',
        fontFamily: FONT,
      })
      .setOrigin(0.5)

    // ── 별 표시 ───────────────────────────────────────
    const starCount = correct === total ? 3 : correct >= total * 0.6 ? 2 : 1
    const starSpacing = 70
    const starY = height / 2 - 30

    for (let i = 0; i < 3; i++) {
      const x = width / 2 + (i - 1) * starSpacing
      const filled = i < starCount
      const star = this.add
        .image(x, starY, 'star')
        .setScale(0)
        .setAlpha(filled ? 1 : 0.25)

      // 별 등장 애니메이션
      this.tweens.add({
        targets: star,
        scaleX: filled ? 0.9 : 0.6,
        scaleY: filled ? 0.9 : 0.6,
        duration: 400,
        delay: 200 + i * 200,
        ease: 'Back.easeOut',
      })
    }

    // ── 칭찬 메시지 ───────────────────────────────────
    const msg =
      starCount === 3
        ? '모든 도토리를 찾았어요! 최고예요! 🏆'
        : starCount === 2
          ? '잘했어요! 조금만 더 연습해봐요! 👍'
          : '괜찮아요! 다시 도전해봐요! 💪'

    this.add
      .text(width / 2, height / 2 + 60, msg, {
        fontSize: '20px',
        color: '#5c3d1e',
        align: 'center',
      })
      .setOrigin(0.5)

    // ── 버튼 영역 ──────────────────────────────────────
    this.createButton(width / 2 - 110, height / 2 + 145, '🔄 다시하기', 0xff6b35, () => {
      store.resetGame()
      this.cameras.main.fadeOut(300, 0, 0, 0)
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.start('GameScene')
      })
    })

    this.createButton(width / 2 + 110, height / 2 + 145, '🏠 처음으로', 0x4a90d9, () => {
      store.resetGame()
      this.cameras.main.fadeOut(300, 0, 0, 0)
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.start('MainMenuScene')
      })
    })

    // ── 카메라 페이드인 ────────────────────────────────
    this.cameras.main.fadeIn(500, 0, 0, 0)
  }

  private createButton(x: number, y: number, label: string, color: number, onClick: () => void) {
    const bg = this.add.graphics()
    bg.fillStyle(color, 1)
    bg.fillRoundedRect(-95, -28, 190, 56, 14)
    bg.lineStyle(3, 0xffffff, 0.8)
    bg.strokeRoundedRect(-95, -28, 190, 56, 14)

    const txt = this.add
      .text(0, 0, label, {
        fontSize: '20px',
        color: '#ffffff',
        fontStyle: 'bold',
      })
      .setOrigin(0.5)

    const btn = this.add.container(x, y, [bg, txt]).setSize(190, 56).setInteractive()

    btn.on('pointerover', () => {
      this.tweens.add({ targets: btn, scaleX: 1.07, scaleY: 1.07, duration: 100 })
    })
    btn.on('pointerout', () => {
      this.tweens.add({ targets: btn, scaleX: 1, scaleY: 1, duration: 100 })
    })
    btn.on('pointerdown', () => {
      AudioManager.playSfx('click')
      onClick()
    })
  }
}
