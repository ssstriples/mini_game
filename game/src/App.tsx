import { useState } from 'react'
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

  // Phaser GameScene이 complete 단계가 되면 ResultPopup 표시
  // (Phaser ResultScene과 React ResultPopup 중 하나만 사용 — React 우선)
  const shouldShowResult = phase === 'complete' && !showStart && showResult

  return (
    <main className="w-screen h-screen flex items-center justify-center bg-[#1a1a2e]">
      <GameCanvas scenes={SCENES} />
      <MuteButton />
      {showStart && (
        <StartScreen
          onStart={() => {
            setShowStart(false)
            setShowResult(true)
          }}
        />
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
