import Phaser from 'phaser'
import { useGameStore } from '../store/gameStore'
import { AudioManager } from '../managers/AudioManager'
import { TTSManager } from '../managers/TTSManager'
import { FONT } from '../config/gameConfig'

/**
 * MainMenuScene
 * - 게임 타이틀 + 시작 버튼 표시
 * - 난이도 선택 버튼 3개 (easy / normal / hard)
 * - 시작 버튼 클릭 → GameScene 전환
 */
export class MainMenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MainMenuScene' })
  }

  create() {
    const { width, height } = this.scale

    // ── BGM 시작 ───────────────────────────────────────
    AudioManager.playBgm()

    // ── TTS 환영 메시지 ────────────────────────────────
    TTSManager.speak('welcome')

    // ── 환영 TTS ──────────────────────────────────────
    this.time.delayedCall(600, () => TTSManager.speak('welcome'))

    // ── 배경 ──────────────────────────────────────────
    this.add.image(width / 2, height / 2, 'bg-forest')

    // ── 타이틀 텍스트 ──────────────────────────────────
    this.add
      .text(width / 2, height * 0.18, '🐿️ 깜빡깜빡\n다람이의 도토리 기억 숲', {
        fontSize: '42px',
        color: '#3b1f00',
        fontStyle: 'bold',
        fontFamily: FONT,
        align: 'center',
        lineSpacing: 8,
        stroke: '#fff8e1',
        strokeThickness: 6,
      })
      .setOrigin(0.5)

    // ── 다람이 이미지 ──────────────────────────────────
    const squirrel = this.add.image(width / 2, height * 0.46, 'squirrel').setScale(1.4)
    // 살짝 흔들리는 idle 애니메이션
    this.tweens.add({
      targets: squirrel,
      y: height * 0.46 - 10,
      duration: 1000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    })

    // ── 난이도 선택 버튼 ───────────────────────────────
    const difficultyLabels: Array<{ key: string; label: string; color: number }> = [
      { key: 'easy', label: '🌱 쉬움\n(3라운드)', color: 0x4caf50 },
      { key: 'normal', label: '🌿 보통\n(5라운드)', color: 0xff9800 },
      { key: 'hard', label: '🍂 어려움\n(7라운드)', color: 0xf44336 },
    ]

    const store = useGameStore.getState()
    let selectedDifficulty = store.difficulty

    const diffBtns: Phaser.GameObjects.Container[] = []

    difficultyLabels.forEach(({ key, label, color }, i) => {
      const x = width / 2 + (i - 1) * 180
      const y = height * 0.68

      const bg = this.add.graphics()
      const isSelected = key === selectedDifficulty
      this.drawDiffBtn(bg, color, isSelected)

      const txt = this.add
        .text(0, 0, label, {
          fontSize: '18px',
          color: '#ffffff',
          align: 'center',
          lineSpacing: 4,
          fontStyle: 'bold',
        })
        .setOrigin(0.5)

      const container = this.add.container(x, y, [bg, txt]).setSize(140, 70)
      container.setInteractive()
      diffBtns.push(container)

      container.on('pointerdown', () => {
        AudioManager.playSfx('click')
        selectedDifficulty = key as 'easy' | 'normal' | 'hard'
        store.setDifficulty(selectedDifficulty)
        // 선택 표시 갱신
        diffBtns.forEach((btn, bi) => {
          const btnBg = btn.getAt(0) as Phaser.GameObjects.Graphics
          btnBg.clear()
          this.drawDiffBtn(btnBg, difficultyLabels[bi].color, bi === i)
        })
      })

      container.on('pointerover', () => {
        this.tweens.add({ targets: container, scaleX: 1.06, scaleY: 1.06, duration: 100 })
      })
      container.on('pointerout', () => {
        this.tweens.add({ targets: container, scaleX: 1, scaleY: 1, duration: 100 })
      })
    })

    // ── 시작 버튼 ──────────────────────────────────────
    const startBg = this.add.graphics()
    startBg.fillStyle(0xff6b35, 1)
    startBg.fillRoundedRect(-90, -30, 180, 60, 16)
    startBg.lineStyle(3, 0xffffff, 0.9)
    startBg.strokeRoundedRect(-90, -30, 180, 60, 16)

    const startTxt = this.add
      .text(0, 0, '▶  게임 시작!', {
        fontSize: '26px',
        color: '#ffffff',
        fontStyle: 'bold',
      })
      .setOrigin(0.5)

    const startBtn = this.add
      .container(width / 2, height * 0.87, [startBg, startTxt])
      .setSize(180, 60)
      .setInteractive()

    startBtn.on('pointerover', () => {
      this.tweens.add({ targets: startBtn, scaleX: 1.08, scaleY: 1.08, duration: 100 })
    })
    startBtn.on('pointerout', () => {
      this.tweens.add({ targets: startBtn, scaleX: 1, scaleY: 1, duration: 100 })
    })
    startBtn.on('pointerdown', () => {
      AudioManager.playSfx('click')
      useGameStore.getState().startGame()
      this.cameras.main.fadeOut(300, 0, 0, 0)
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.start('GameScene')
      })
    })

    // ── 카메라 페이드인 ────────────────────────────────
    this.cameras.main.fadeIn(400, 0, 0, 0)
  }

  /** 난이도 버튼 배경 그리기 (selected 여부에 따라 테두리 강조) */
  private drawDiffBtn(g: Phaser.GameObjects.Graphics, color: number, selected: boolean) {
    g.clear()
    g.fillStyle(color, selected ? 1 : 0.55)
    g.fillRoundedRect(-70, -35, 140, 70, 12)
    if (selected) {
      g.lineStyle(4, 0xffffff, 1)
      g.strokeRoundedRect(-70, -35, 140, 70, 12)
    }
  }
}
