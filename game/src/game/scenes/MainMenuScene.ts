import Phaser from 'phaser'
import { AudioManager } from '../managers/AudioManager'
import { TTSManager } from '../managers/TTSManager'
import { FONT } from '../config/gameConfig'

/**
 * MainMenuScene
 * - 배경 + 타이틀 + 다람이 idle 애니메이션만 표시
 * - 난이도 선택/시작 버튼은 React StartScreen에서 처리
 * - React에서 startGame() 호출 후 곧바로 GameScene으로 전환됨
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
    this.time.delayedCall(600, () => TTSManager.speak('welcome'))

    // ── 배경 ──────────────────────────────────────────
    this.add.image(width / 2, height / 2, 'bg-forest')

    // ── 타이틀 텍스트 ──────────────────────────────────
    this.add
      .text(width / 2, height * 0.2, '🐿️ 깜빡깜빡\n다람이의 도토리 기억 숲', {
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

    // ── 부제 ──────────────────────────────────────────
    this.add
      .text(width / 2, height * 0.38, '왼쪽 화면에서 난이도를 선택하고\n게임을 시작해보세요!', {
        fontSize: '20px',
        color: '#5c3d1e',
        fontFamily: FONT,
        align: 'center',
        lineSpacing: 6,
      })
      .setOrigin(0.5)

    // ── 다람이 이미지 ──────────────────────────────────
    const squirrel = this.add.image(width / 2, height * 0.65, 'squirrel').setScale(1.4)
    // 살짝 흔들리는 idle 애니메이션
    this.tweens.add({
      targets: squirrel,
      y: height * 0.65 - 10,
      duration: 1000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    })

    // ── 카메라 페이드인 ────────────────────────────────
    this.cameras.main.fadeIn(400, 0, 0, 0)
  }
}

