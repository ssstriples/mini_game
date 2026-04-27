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
  const [showResult, setShowResult] = useState(false)
  const phase = useGameStore((s) => s.phase)
  const gameRef = useRef<Phaser.Game | null>(null)

  // Phaser GameScene이 complete 단계가 되면 ResultPopup 표시
  const shouldShowResult = phase === 'complete' && !showStart && showResult

  const handleStart = () => {
    setShowStart(false)
    setShowResult(true)
    // Phaser 씬을 MainMenuScene에서 바로 GameScene으로 전환
    const game = gameRef.current
    if (game) {
      const sceneManager = game.scene
      // PreloaderScene 완료 후 MainMenuScene이 활성화된 상태에서 GameScene으로 이동
      if (sceneManager.isActive('MainMenuScene')) {
        sceneManager.getScene('MainMenuScene').cameras.main.fadeOut(300, 0, 0, 0)
        sceneManager.getScene('MainMenuScene').cameras.main.once('camerafadeoutcomplete', () => {
          sceneManager.start('GameScene')
        })
      } else {
        // 아직 MainMenuScene이 준비 안 된 경우 이벤트 대기
        sceneManager.getScene('MainMenuScene')?.events.once('create', () => {
          sceneManager.start('GameScene')
        })
      }
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
          onReplay={() => {
            setShowStart(true)
            setShowResult(false)
          }}
          onHome={() => {
            setShowStart(true)
            setShowResult(false)
          }}
        />
      )}
    </main>
  )
}
