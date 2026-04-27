import { useEffect, useState } from 'react'
import ReactConfetti from 'react-confetti'
import { useGameStore } from '../game/store/gameStore'
import { useWindowSize } from '../hooks/useWindowSize'

interface ResultPopupProps {
  onReplay: () => void
  onHome: () => void
}

/**
 * ResultPopup — 게임 완료 시 React 오버레이
 * - 정답률에 따라 별 1~3개 표시
 * - 만점 시 react-confetti 폭죽 효과
 * - 다시하기 / 처음으로 버튼
 */
export default function ResultPopup({ onReplay, onHome }: ResultPopupProps) {
  const { gameResult, totalRounds, resetGame } = useGameStore()
  const { width, height } = useWindowSize()
  const [confettiRun, setConfettiRun] = useState(true)

  const correct = gameResult?.correctCount ?? 0
  const total = gameResult?.totalRounds ?? totalRounds
  const starCount = correct === total ? 3 : correct >= total * 0.6 ? 2 : 1
  const isPerfect = starCount === 3

  // 5초 후 confetti 자동 종료
  useEffect(() => {
    if (!isPerfect) return
    const t = setTimeout(() => setConfettiRun(false), 5000)
    return () => clearTimeout(t)
  }, [isPerfect])

  const handleReplay = () => {
    resetGame()
    // 같은 난이도로 store 재초기화 후 App의 onReplay가 GameScene 재시작 처리
    useGameStore.getState().startGame()
    onReplay()
  }

  const handleHome = () => {
    resetGame()
    onHome()
  }

  const msg =
    starCount === 3
      ? '모든 도토리를 찾았어요! 최고예요! 🏆'
      : starCount === 2
        ? '잘했어요! 조금만 더 연습해봐요! 👍'
        : '괜찮아요! 다시 도전해봐요! 💪'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      {/* 만점 폭죽 */}
      {isPerfect && confettiRun && (
        <ReactConfetti
          width={width}
          height={height}
          numberOfPieces={300}
          recycle={confettiRun}
          colors={['#ff6b35', '#ffd700', '#4caf50', '#2196f3', '#e91e63']}
        />
      )}

      <div className="bg-[#fff8e1] rounded-3xl shadow-2xl px-8 py-7 max-w-sm w-full mx-4 flex flex-col items-center gap-5 border-4 border-[#ff6b35]">

        {/* 타이틀 */}
        <h2 className="text-2xl font-black text-[#3b1f00]">
          {isPerfect ? '🎉 완벽해요!' : '🐿️ 결과 발표!'}
        </h2>

        {/* 점수 */}
        <p className="text-lg font-bold text-[#5c3d1e]">
          {total}개 중 <span className="text-[#ff6b35] text-2xl">{correct}</span>개 맞혔어요!
        </p>

        {/* 별 */}
        <div className="flex gap-3 text-4xl">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className={[
                'transition-all duration-300',
                i < starCount ? 'opacity-100 scale-110' : 'opacity-25 grayscale',
              ].join(' ')}
              style={{ animationDelay: `${i * 200}ms` }}
            >
              ⭐
            </span>
          ))}
        </div>

        {/* 메시지 */}
        <p className="text-sm text-[#7a5230] text-center">{msg}</p>

        {/* 버튼 */}
        <div className="flex gap-3 w-full">
          <button
            onClick={handleReplay}
            className="flex-1 py-3 rounded-2xl bg-[#ff6b35] hover:bg-[#ff8c5a] active:scale-95 text-white font-black text-base shadow transition-all duration-150"
          >
            🔄 다시하기
          </button>
          <button
            onClick={handleHome}
            className="flex-1 py-3 rounded-2xl bg-[#4a90d9] hover:bg-[#5ba3e8] active:scale-95 text-white font-black text-base shadow transition-all duration-150"
          >
            🏠 처음으로
          </button>
        </div>
      </div>
    </div>
  )
}
