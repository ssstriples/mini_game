import Phaser from 'phaser'
import { AudioManager } from '../managers/AudioManager'

/**
 * PreloaderScene
 * - 실제 에셋 로드 전 Phaser Graphics로 placeholder 텍스처를 생성
 * - 에셋이 준비되면 이 함수 대신 this.load.image() 로 교체 예정
 */
export class PreloaderScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloaderScene' })
  }

  preload() {
    // 실제 에셋 로드 시 여기에 추가
    // this.load.image('bg-forest', 'assets/images/backgrounds/bg-forest.png')
  }

  create() {
    // AudioManager 최초 초기화 (앱 전체 1회)
    AudioManager.init()
    createPlaceholderTextures(this)
    this.scene.start('MainMenuScene')
  }
}

/** Phaser Graphics로 임시 텍스처를 생성하는 헬퍼 함수 */
export function createPlaceholderTextures(scene: Phaser.Scene) {
  // ── 배경 ──────────────────────────────────────────────
  const bg = scene.add.graphics()
  // 하늘 (위)
  bg.fillStyle(0x87ceeb)
  bg.fillRect(0, 0, 1024, 380)
  // 땅 (아래)
  bg.fillStyle(0x4a7c59)
  bg.fillRect(0, 380, 1024, 220)
  bg.generateTexture('bg-forest', 1024, 600)
  bg.destroy()

  // ── 도토리 ────────────────────────────────────────────
  const acorn = scene.add.graphics()
  acorn.fillStyle(0x5c3d1e) // 갈색 모자
  acorn.fillEllipse(20, 8, 28, 14)
  acorn.fillStyle(0x8b5e3c) // 밤색 몸통
  acorn.fillCircle(20, 24, 16)
  acorn.generateTexture('acorn', 40, 40)
  acorn.destroy()

  // ── 장소 아이콘 8개 ───────────────────────────────────
  const spotColors: number[] = [
    0x2d8a4e, // tree      — 초록
    0x7a5230, // rock      — 갈색
    0x3a7d44, // bush      — 짙은 초록
    0x5b4427, // hole      — 흙색
    0xa0522d, // log       — 나무색
    0xc0392b, // mushroom  — 빨강
    0xf39c12, // flower    — 노랑
    0x2980b9, // pond      — 파랑
  ]
  const spotKeys: string[] = [
    'spot_tree',
    'spot_rock',
    'spot_bush',
    'spot_hole',
    'spot_log',
    'spot_mushroom',
    'spot_flower',
    'spot_pond',
  ]

  spotKeys.forEach((key, i) => {
    const g = scene.add.graphics()
    // 배경 원
    g.fillStyle(spotColors[i], 1)
    g.fillCircle(44, 44, 40)
    // 흰 테두리
    g.lineStyle(3, 0xffffff, 0.8)
    g.strokeCircle(44, 44, 40)
    g.generateTexture(key, 88, 88)
    g.destroy()
  })

  // ── 다람이 (플레이어) ──────────────────────────────────
  const squirrel = scene.add.graphics()
  squirrel.fillStyle(0xe8921a) // 주황 몸통
  squirrel.fillRoundedRect(10, 20, 60, 70, 10)
  squirrel.fillStyle(0xf5c27a) // 밝은 배 부분
  squirrel.fillEllipse(40, 55, 30, 40)
  squirrel.fillStyle(0xe8921a) // 귀
  squirrel.fillTriangle(15, 22, 25, 2, 35, 22)
  squirrel.fillTriangle(45, 22, 55, 2, 65, 22)
  squirrel.fillStyle(0x5c3d1e) // 눈
  squirrel.fillCircle(28, 35, 4)
  squirrel.fillCircle(52, 35, 4)
  squirrel.generateTexture('squirrel', 80, 100)
  squirrel.destroy()

  // ── 낙엽 ─────────────────────────────────────────────
  const leaf = scene.add.graphics()
  leaf.fillStyle(0xff8c00)
  leaf.fillEllipse(15, 15, 30, 20)
  leaf.generateTexture('leaf', 30, 30)
  leaf.destroy()

  // ── UI: 별(정답 표시) ─────────────────────────────────
  const star = scene.add.graphics()
  star.fillStyle(0xffd700)
  // 간단한 별: 5각형 근사
  star.fillCircle(24, 24, 20)
  star.fillStyle(0xffd700)
  star.generateTexture('star', 48, 48)
  star.destroy()
}
