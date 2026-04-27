import { useState, useRef } from 'react'
import GameCanvas from './components/GameCanvas'
import MuteButton from './components/MuteButton'
import StartScreen from './components/StartScreen'
import ResultPopup from './components/ResultPopup'
import { useGameStore } from './game/store/gameStore'
import { PreloaderScene } from './game/scenes/PreloaderScene'
import { MainMenuScene } from './game/scenes/MainMenuScene'
import { GameScene } from './game/scenes/GameScene'
import { ResultScene } from './game/scenes/ResultScene'

const SCENES = [PreloaderScene, MainMenuScene, GameScene, ResultScene]

export default function App() {
  const [showStart, setShowStart] = useState(true)
  const phase = useGameStore((s) => s.phase)
  const gameRef = useRef<Phaser.Game | null>(null)

  // phase가 complete이고 StartScreen이 없을 때만 ResultPopup 표시
  // showResult 별도 상태 불필요 — resetGame()/startGame() 호출 시 phase가 바뀌어 팝업 자동 소멸
  const shouldShowResult = phase === 'complete' && !showStart

  const handleStart = () => {
    setShowStart(false)
    // Phaser 씬을 MainMenuScene에서 바로 GameScene으로 전환
    const game = gameRef.current
    if (game) {
      const sceneManager = game.scene
      if (sceneManager.isActive('MainMenuScene')) {
        sceneManager.getScene('MainMenuScene').cameras.main.fadeOut(300, 0, 0, 0)
        sceneManager.getScene('MainMenuScene').cameras.main.once('camerafadeoutcomplete', () => {
          sceneManager.start('GameScene')
        })
      } else {
        sceneManager.getScene('MainMenuScene')?.events.once('create', () => {
          sceneManager.start('GameScene')
        })
      }
    }
  }

  /** 다시하기 — StartScreen 없이 같은 난이도로 즉시 재시작 */
  const handleReplay = () => {
    // ResultPopup 내부에서 resetGame()+startGame()으로 phase='memorize'가 되므로
    // shouldShowResult가 자동으로 false → 팝업 사라짐. 별도 상태 불필요.
    const game = gameRef.current
    if (game) {
      const sm = game.scene
      // ResultScene 혹은 GameScene 어디서든 GameScene으로 직행
      const fadeAndRestart = (sceneKey: string) => {
        const scene = sm.getScene(sceneKey)
        if (!scene) return sm.start('GameScene')
        scene.cameras.main.fadeOut(300, 0, 0, 0)
        scene.cameras.main.once('camerafadeoutcomplete', () => {
          sm.start('GameScene')
        })
      }
      if (sm.isActive('ResultScene')) fadeAndRestart('ResultScene')
      else if (sm.isActive('GameScene')) fadeAndRestart('GameScene')
      else sm.start('GameScene')
    }
  }

  /** 처음으로 — StartScreen으로 돌아가 난이도 재선택 */
  const handleHome = () => {
    setShowStart(true)
    const game = gameRef.current
    if (game) {
      const sm = game.scene
      if (sm.isActive('ResultScene')) sm.start('MainMenuScene')
    }
  }

  return (
    <main className="w-screen h-screen flex items-center justify-center bg-[#1a1a2e]">
      <GameCanvas scenes={SCENES} gameRef={gameRef} />
      <MuteButton />
      {showStart && (
        <StartScreen onStart={handleStart} />
      )}
      {shouldShowResult && (
        <ResultPopup
          onReplay={handleReplay}
          onHome={handleHome}
        />
      )}
    </main>
  )
}
