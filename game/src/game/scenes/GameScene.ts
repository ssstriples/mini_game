import Phaser from 'phaser'
import { useGameStore } from '../store/gameStore'
import { SPOTS_DATA } from '../config/spots'
import { DIFFICULTY_CONFIG } from '../config/gameConfig'
import type { HidingSpot } from '../config/types'
import { AudioManager } from '../managers/AudioManager'
import { TTSManager } from '../managers/TTSManager'
import { FONT } from '../config/gameConfig'

/**
 * GameScene — 핵심 게임 루프
 * Phase: memorize → play → result → (nextRound or complete)
 */
export class GameScene extends Phaser.Scene {
  private spotImages: Phaser.GameObjects.Image[] = []
  private squirrel!: Phaser.GameObjects.Image
  private phaseText!: Phaser.GameObjects.Text
  private roundText!: Phaser.GameObjects.Text
  private timerBar!: Phaser.GameObjects.Graphics
  private timerBarBg!: Phaser.GameObjects.Graphics
  private memorizeTimer?: Phaser.Time.TimerEvent

  /** play 단계 제한시간 관련 */
  private playTimer?: Phaser.Time.TimerEvent
  private playTimerTween?: Phaser.Tweens.Tween
  private countdownText!: Phaser.GameObjects.Text

  /** 클릭 가능 여부 — play 단계에서만 true, 클릭 후 즉시 false로 잠금 */
  private canClick = false

  constructor() {
    super({ key: 'GameScene' })
  }

  create() {
    const { width, height } = this.scale

    // ── 배경 ──────────────────────────────────────────
    this.add.image(width / 2, height / 2, 'bg-forest')

    // ── 라운드 / 단계 텍스트 ──────────────────────────
    this.roundText = this.add
      .text(width / 2, 28, '', {
        fontSize: '22px',
        color: '#3b1f00',
        fontStyle: 'bold',
        fontFamily: FONT,
        stroke: '#fff8e1',
        strokeThickness: 5,
      })
      .setOrigin(0.5)

    this.phaseText = this.add
      .text(width / 2, 60, '', {
        fontSize: '18px',
        color: '#1a3d00',
        fontFamily: FONT,
        stroke: '#ffffff',
        strokeThickness: 4,
      })
      .setOrigin(0.5)

    // ── 타이머 바 ──────────────────────────────────────
    this.timerBarBg = this.add.graphics()
    this.timerBarBg.fillStyle(0x000000, 0.3)
    this.timerBarBg.fillRoundedRect(width / 2 - 200, 80, 400, 14, 7)

    this.timerBar = this.add.graphics()

    // ── 다람이 ─────────────────────────────────────────
    this.squirrel = this.add.image(width / 2, height / 2, 'squirrel').setScale(1.2)

    // ── 제한시간 카운트다운 텍스트 ─────────────────────
    this.countdownText = this.add
      .text(width / 2, 105, '', {
        fontSize: '28px',
        fontStyle: 'bold',
        fontFamily: FONT,
        color: '#ffffff',
        stroke: '#3b1f00',
        strokeThickness: 5,
      })
      .setOrigin(0.5)
      .setVisible(false)

    // ── 장소 아이콘 배치 ───────────────────────────────
    this.buildSpots()

    // ── 첫 라운드 시작 ─────────────────────────────────
    this.startMemorizePhase()

    // ── 카메라 페이드인 ────────────────────────────────
    this.cameras.main.fadeIn(400, 0, 0, 0)
  }

  // ────────────────────────────────────────────────────
  // 장소 아이콘 생성
  // ────────────────────────────────────────────────────
  private buildSpots() {
    const { width, height } = this.scale
    const store = useGameStore.getState()
    const cfg = DIFFICULTY_CONFIG[store.difficulty]
    const activeSpots = SPOTS_DATA.slice(0, cfg.spotCount)

    this.spotImages = activeSpots.map((spot: HidingSpot) => {
      const x = spot.x * width
      const y = spot.y * height
      const img = this.add
        .image(x, y, spot.spriteFrame)
        .setScale(0.85)
        .setInteractive(
          new Phaser.Geom.Rectangle(-44, -44, 88, 88),
          Phaser.Geom.Rectangle.Contains,
        )
        .setAlpha(0.85)

      // 호버 효과
      img.on('pointerover', () => {
        if (!this.canClick) return
        this.tweens.add({ targets: img, scaleX: 0.98, scaleY: 0.98, duration: 80 })
      })
      img.on('pointerout', () => {
        if (!this.canClick) return
        this.tweens.add({ targets: img, scaleX: 0.85, scaleY: 0.85, duration: 80 })
      })

      // 클릭 — canClick 플래그로만 판단 (play 단계 진입 시 true, 클릭 즉시 false)
      img.on('pointerdown', () => {
        if (!this.canClick) return
        this.canClick = false          // 즉시 잠금 → 다중 클릭 방지
        this.onSpotSelected(spot)
      })

      // 장소 이름 라벨
      this.add
        .text(x, y + 52, spot.label, {
          fontSize: '13px',
          color: '#fff8e1',
          stroke: '#3b1f00',
          strokeThickness: 3,
        })
        .setOrigin(0.5)

      return img
    })
  }

  // ────────────────────────────────────────────────────
  // 기억 단계 — 타깃 장소에 도토리 표시
  // ────────────────────────────────────────────────────
  private startMemorizePhase() {
    this.canClick = false   // 기억 단계엔 클릭 불가
    const store = useGameStore.getState()
    const cfg = DIFFICULTY_CONFIG[store.difficulty]
    const activeSpots = SPOTS_DATA.slice(0, cfg.spotCount)

    // 무작위 타깃 선택
    const targetSpot = activeSpots[Phaser.Math.Between(0, activeSpots.length - 1)]
    store.setMemorizePhase(targetSpot.id)

    // 기억 단계 사운드 + TTS (중복 제거)
    AudioManager.playSfx('memorize')
    this.time.delayedCall(300, () => TTSManager.speak('memorize'))

    this.updateHUD()

    // 다람이를 타깃 장소로 이동
    const { width, height } = this.scale
    this.tweens.add({
      targets: this.squirrel,
      x: targetSpot.x * width,
      y: targetSpot.y * height - 60,
      duration: 700,
      ease: 'Power2',
      onComplete: () => {
        // 도토리 숨기기 연출 (깜빡)
        const acorn = this.add
          .image(targetSpot.x * width, targetSpot.y * height - 30, 'acorn')
          .setScale(1.2)
        this.tweens.add({
          targets: acorn,
          scaleX: 0,
          scaleY: 0,
          duration: 500,
          delay: 400,
          onComplete: () => acorn.destroy(),
        })
      },
    })

    // 타이머 바
    this.startTimerBar(cfg.memorizeTimeMs)

    // 시간 종료 → play 단계
    this.memorizeTimer = this.time.delayedCall(cfg.memorizeTimeMs, () => {
      this.startPlayPhase()
    })
  }

  // ────────────────────────────────────────────────────
  // 플레이 단계 — 장소 선택 대기
  // ────────────────────────────────────────────────────
  private startPlayPhase() {
    useGameStore.getState().setPlayPhase()
    this.canClick = true    // ← 이제 클릭 가능
    this.updateHUD()

    // play 단계 TTS 안내 (중복 제거)
    this.time.delayedCall(200, () => TTSManager.speak('play'))

    // 다람이 중앙으로 복귀
    const { width, height } = this.scale
    this.tweens.add({
      targets: this.squirrel,
      x: width / 2,
      y: height / 2,
      duration: 500,
      ease: 'Power2',
    })

    // ── 제한시간 타이머 시작 ────────────────────────────
    const cfg = DIFFICULTY_CONFIG[useGameStore.getState().difficulty]
    const limitMs = cfg.playTimeLimitMs

    // 타이머 바 (play 단계용: 초록→빨강)
    this.timerBarBg.clear()
    this.timerBarBg.fillStyle(0x000000, 0.3)
    const barX = width / 2 - 200
    const barY = 80
    const barW = 400
    const barH = 14
    this.timerBarBg.fillRoundedRect(barX, barY, barW, barH, 7)

    const barObj = { progress: 1 }
    this.playTimerTween = this.tweens.add({
      targets: barObj,
      progress: 0,
      duration: limitMs,
      ease: 'Linear',
      onUpdate: () => {
        this.timerBar.clear()
        const color = barObj.progress > 0.4 ? 0x4caf50 : 0xff5722
        this.timerBar.fillStyle(color, 1)
        this.timerBar.fillRoundedRect(barX, barY, barW * barObj.progress, barH, 7)
      },
      onComplete: () => this.timerBar.clear(),
    })

    // 초 카운트다운 텍스트 (1초마다 갱신)
    let remaining = Math.ceil(limitMs / 1000)
    this.countdownText.setText(`⏱ ${remaining}초`).setVisible(true).setColor('#ffffff')

    this.playTimer = this.time.addEvent({
      delay: 1000,
      repeat: remaining - 1,
      callback: () => {
        remaining -= 1
        if (remaining > 0) {
          const isUrgent = remaining <= 3
          this.countdownText
            .setText(`⏱ ${remaining}초`)
            .setColor(isUrgent ? '#ff4444' : '#ffffff')
          // 3초 이하: 텍스트 흔들림 강조
          if (isUrgent) {
            this.tweens.add({
              targets: this.countdownText,
              scaleX: 1.2, scaleY: 1.2,
              duration: 100, yoyo: true,
            })
          }
        } else {
          // 시간 초과!
          this.onTimeout()
        }
      },
    })
  }

  // ────────────────────────────────────────────────────
  // 시간 초과 처리
  // ────────────────────────────────────────────────────
  private onTimeout() {
    if (!this.canClick) return // 이미 클릭했으면 무시
    this.canClick = false
    this.stopPlayTimer()

    const store = useGameStore.getState()
    // 틀린 것으로 처리 (-1: 선택 안 함)
    store.selectSpot(-1)

    AudioManager.playSfx('wrong')
    this.time.delayedCall(200, () => TTSManager.speak('wrong'))

    const { width, height } = this.scale
    const feedbackText = this.add
      .text(width / 2, height / 2 - 80, '⏰ 시간 초과!', {
        fontSize: '36px',
        color: '#ff4444',
        fontStyle: 'bold',
        fontFamily: FONT,
        stroke: '#3b1f00',
        strokeThickness: 6,
      })
      .setOrigin(0.5)
      .setAlpha(0)

    this.tweens.add({ targets: feedbackText, alpha: 1, y: height / 2 - 110, duration: 300 })

    // 정답 장소 잠깐 강조 (어디였는지 알려주기)
    const targetIdx = SPOTS_DATA.findIndex((s) => s.id === store.targetSpotId)
    if (targetIdx >= 0 && this.spotImages[targetIdx]) {
      this.tweens.add({
        targets: this.spotImages[targetIdx],
        scaleX: 1.3, scaleY: 1.3,
        duration: 300, yoyo: true, repeat: 3,
      })
    }

    this.time.delayedCall(1800, () => {
      feedbackText.destroy()
      const updatedStore = useGameStore.getState()
      if (updatedStore.currentRound >= updatedStore.totalRounds) {
        updatedStore.endGame()
        AudioManager.playSfx('complete')
        this.time.delayedCall(200, () => TTSManager.speak('complete'))
        this.cameras.main.fadeOut(400, 0, 0, 0)
        this.cameras.main.once('camerafadeoutcomplete', () => this.scene.start('ResultScene'))
      } else {
        updatedStore.nextRound()
        this.startMemorizePhase()
      }
    })
  }

  // ────────────────────────────────────────────────────
  // play 타이머 / 카운트다운 정리
  // ────────────────────────────────────────────────────
  private stopPlayTimer() {
    this.playTimer?.remove(false)
    this.playTimer = undefined
    this.playTimerTween?.stop()
    this.playTimerTween = undefined
    this.timerBar.clear()
    this.timerBarBg.clear()
    this.countdownText.setVisible(false)
  }

  // ────────────────────────────────────────────────────
  // 장소 선택 처리
  // ────────────────────────────────────────────────────
  private onSpotSelected(spot: HidingSpot) {
    this.stopPlayTimer() // 제한시간 타이머 즉시 정리
    const store = useGameStore.getState()
    store.selectSpot(spot.id)

    const isCorrect = spot.id === store.targetSpotId

    // 정답/오답 사운드 + TTS (중복 제거)
    AudioManager.playSfx(isCorrect ? 'correct' : 'wrong')
    this.time.delayedCall(200, () => TTSManager.speak(isCorrect ? 'correct' : 'wrong'))

    // 정답/오답 시각 피드백
    const { width, height } = this.scale
    const feedbackText = this.add
      .text(width / 2, height / 2 - 80, isCorrect ? '🎉 맞았어요!' : '😢 다음엔 찾을 수 있어요!', {
        fontSize: '32px',
        color: isCorrect ? '#ffd700' : '#ff6b6b',
        fontStyle: 'bold',
        stroke: '#3b1f00',
        strokeThickness: 6,
      })
      .setOrigin(0.5)
      .setAlpha(0)

    this.tweens.add({
      targets: feedbackText,
      alpha: 1,
      y: height / 2 - 110,
      duration: 300,
    })

    // 정답 장소 강조
    const targetIdx = SPOTS_DATA.findIndex((s) => s.id === store.targetSpotId)
    if (targetIdx >= 0 && this.spotImages[targetIdx]) {
      this.tweens.add({
        targets: this.spotImages[targetIdx],
        scaleX: 1.2,
        scaleY: 1.2,
        duration: 300,
        yoyo: true,
        repeat: 2,
      })
    }

    // 1.8초 후 다음 라운드 or 결과 씬
    this.time.delayedCall(1800, () => {
      feedbackText.destroy()
      const updatedStore = useGameStore.getState()
      if (updatedStore.currentRound >= updatedStore.totalRounds) {
        updatedStore.endGame()
        AudioManager.playSfx('complete')
        this.time.delayedCall(200, () => TTSManager.speak('complete'))
        this.cameras.main.fadeOut(400, 0, 0, 0)
        this.cameras.main.once('camerafadeoutcomplete', () => {
          this.scene.start('ResultScene')
        })
      } else {
        updatedStore.nextRound()
        this.startMemorizePhase()  // canClick은 startMemorizePhase 첫 줄에서 false 설정됨
      }
    })
  }

  // ────────────────────────────────────────────────────
  // HUD 업데이트
  // ────────────────────────────────────────────────────
  private updateHUD() {
    const { currentRound, totalRounds, phase } = useGameStore.getState()
    this.roundText.setText(`${currentRound} / ${totalRounds} 라운드`)
    const phaseLabel =
      phase === 'memorize' ? '🐿️ 다람이가 도토리를 숨기고 있어요!' : '👆 어디에 숨겼을까요? 클릭해보세요!'
    this.phaseText.setText(phaseLabel)
  }

  // ────────────────────────────────────────────────────
  // 타이머 바 애니메이션
  // ────────────────────────────────────────────────────
  private startTimerBar(durationMs: number) {
    const { width } = this.scale
    const barX = width / 2 - 200
    const barY = 80
    const barW = 400
    const barH = 14

    this.timerBarBg.clear()
    this.timerBarBg.fillStyle(0x000000, 0.3)
    this.timerBarBg.fillRoundedRect(barX, barY, barW, barH, 7)

    // 시간 감소 트윈
    const barObj = { progress: 1 }
    this.tweens.add({
      targets: barObj,
      progress: 0,
      duration: durationMs,
      ease: 'Linear',
      onUpdate: () => {
        this.timerBar.clear()
        const color = barObj.progress > 0.4 ? 0x4caf50 : 0xff5722
        this.timerBar.fillStyle(color, 1)
        this.timerBar.fillRoundedRect(barX, barY, barW * barObj.progress, barH, 7)
      },
      onComplete: () => this.timerBar.clear(),
    })
  }

  shutdown() {
    this.memorizeTimer?.remove()
    this.playTimer?.remove(false)
    this.playTimerTween?.stop()
  }
}
