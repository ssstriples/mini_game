import { useState } from 'react'
import { useGameStore } from '../game/store/gameStore'
import type { Difficulty } from '../game/config/types'
import { DIFFICULTY_CONFIG } from '../game/config/gameConfig'

interface StartScreenProps {
  onStart: () => void
}

const DIFFICULTY_OPTIONS: { key: Difficulty; emoji: string; label: string; desc: string; color: string }[] = [
  { key: 'easy',   emoji: '🌱', label: '쉬움',   desc: `${DIFFICULTY_CONFIG.easy.rounds}라운드 · ${DIFFICULTY_CONFIG.easy.memorizeTimeMs / 1000}초`,   color: 'bg-green-500 hover:bg-green-400' },
  { key: 'normal', emoji: '🌿', label: '보통',   desc: `${DIFFICULTY_CONFIG.normal.rounds}라운드 · ${DIFFICULTY_CONFIG.normal.memorizeTimeMs / 1000}초`, color: 'bg-orange-500 hover:bg-orange-400' },
  { key: 'hard',   emoji: '🍂', label: '어려움', desc: `${DIFFICULTY_CONFIG.hard.rounds}라운드 · ${DIFFICULTY_CONFIG.hard.memorizeTimeMs / 1000}초`,   color: 'bg-red-500 hover:bg-red-400' },
]

/**
 * StartScreen — 게임 시작 전 React 오버레이 화면
 * - 게임 제목 + 설명
 * - 난이도 선택 (easy / normal / hard)
 * - 시작 버튼 클릭 시 Phaser 씬으로 전환
 */
export default function StartScreen({ onStart }: StartScreenProps) {
  const { difficulty, setDifficulty, startGame } = useGameStore()
  const [selected, setSelected] = useState<Difficulty>(difficulty)

  const handleStart = () => {
    setDifficulty(selected)
    startGame()
    onStart()
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-[#fff8e1] rounded-3xl shadow-2xl px-10 py-8 max-w-md w-full mx-4 flex flex-col items-center gap-6 border-4 border-[#ff6b35]">

        {/* 타이틀 */}
        <div className="text-center">
          <div className="text-5xl mb-2">🐿️</div>
          <h1 className="text-2xl font-black text-[#3b1f00] leading-tight">
            깜빡깜빡<br />다람이의 도토리 기억 숲
          </h1>
          <p className="text-sm text-[#7a5230] mt-2">
            다람이가 도토리를 숨기는 장소를 기억하고 찾아보세요!
          </p>
        </div>

        {/* 난이도 선택 */}
        <div className="w-full">
          <p className="text-center text-sm font-bold text-[#5c3d1e] mb-3">난이도 선택</p>
          <div className="flex gap-2 justify-center">
            {DIFFICULTY_OPTIONS.map(({ key, emoji, label, desc, color }) => {
              const isSelected = selected === key
              return (
                <button
                  key={key}
                  onClick={() => setSelected(key)}
                  className={[
                    'flex flex-col items-center px-4 py-3 rounded-2xl text-white transition-all duration-150 flex-1',
                    color,
                    isSelected
                      ? 'ring-4 ring-white ring-offset-2 ring-offset-[#fff8e1] scale-105 shadow-lg'
                      : 'opacity-70',
                  ].join(' ')}
                >
                  <span className="text-2xl">{emoji}</span>
                  <span className="font-bold text-sm mt-1">{label}</span>
                  <span className="text-xs opacity-90">{desc}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* 시작 버튼 */}
        <button
          onClick={handleStart}
          className="w-full py-4 rounded-2xl bg-[#ff6b35] hover:bg-[#ff8c5a] active:scale-95 text-white text-xl font-black shadow-lg transition-all duration-150"
        >
          ▶ 게임 시작!
        </button>

        {/* 안내 */}
        <p className="text-xs text-[#a07850] text-center">
          🔊 소리가 나요 — 이어폰을 꽂으면 더 잘 들려요!
        </p>
      </div>
    </div>
  )
}
