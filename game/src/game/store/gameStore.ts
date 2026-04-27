import { create } from 'zustand'
import type { GamePhase, GameResult, RoundResult, Difficulty } from '../config/types'
import { DIFFICULTY_CONFIG, DEFAULT_DIFFICULTY } from '../config/gameConfig'

interface GameState {
  // 게임 상태
  phase: GamePhase
  difficulty: Difficulty
  currentRound: number
  totalRounds: number
  score: number

  // 현재 라운드 데이터
  targetSpotId: number | null
  selectedSpotId: number | null
  roundResults: RoundResult[]
  roundStartTime: number | null

  // 최종 결과
  gameResult: GameResult | null

  // 액션
  setDifficulty: (d: Difficulty) => void
  startGame: () => void
  setMemorizePhase: (targetSpotId: number) => void
  setPlayPhase: () => void
  selectSpot: (spotId: number) => void
  nextRound: () => void
  endGame: () => void
  resetGame: () => void
}

export const useGameStore = create<GameState>((set, get) => ({
  // 초기 상태
  phase: 'idle',
  difficulty: DEFAULT_DIFFICULTY as Difficulty,
  currentRound: 0,
  totalRounds: DIFFICULTY_CONFIG[DEFAULT_DIFFICULTY].rounds,
  score: 0,
  targetSpotId: null,
  selectedSpotId: null,
  roundResults: [],
  roundStartTime: null,
  gameResult: null,

  setDifficulty: (d) => {
    set({
      difficulty: d,
      totalRounds: DIFFICULTY_CONFIG[d].rounds,
    })
  },

  startGame: () => {
    const { difficulty } = get()
    set({
      phase: 'memorize',
      currentRound: 1,
      totalRounds: DIFFICULTY_CONFIG[difficulty].rounds,
      score: 0,
      roundResults: [],
      gameResult: null,
      targetSpotId: null,
      selectedSpotId: null,
    })
  },

  setMemorizePhase: (targetSpotId) => {
    set({ phase: 'memorize', targetSpotId, selectedSpotId: null })
  },

  setPlayPhase: () => {
    set({ phase: 'play', roundStartTime: Date.now() })
  },

  selectSpot: (spotId) => {
    const { targetSpotId, currentRound, roundStartTime, roundResults, score } = get()
    const isCorrect = spotId === targetSpotId
    const reactionTimeMs = roundStartTime ? Date.now() - roundStartTime : 0

    const result: RoundResult = {
      round: currentRound,
      targetSpotId: targetSpotId!,
      selectedSpotId: spotId,
      isCorrect,
      reactionTimeMs,
    }

    set({
      phase: 'result',
      selectedSpotId: spotId,
      roundResults: [...roundResults, result],
      score: isCorrect ? score + 1 : score,
    })
  },

  nextRound: () => {
    const { currentRound, totalRounds } = get()
    if (currentRound >= totalRounds) {
      get().endGame()
    } else {
      set({
        phase: 'memorize',
        currentRound: currentRound + 1,
        targetSpotId: null,
        selectedSpotId: null,
      })
    }
  },

  endGame: () => {
    const { roundResults, totalRounds, score } = get()
    const totalDuration = roundResults.reduce((acc, r) => acc + r.reactionTimeMs, 0)

    set({
      phase: 'complete',
      gameResult: {
        totalRounds,
        correctCount: score,
        results: roundResults,
        durationMs: totalDuration,
      },
    })
  },

  resetGame: () => {
    const { difficulty } = get()
    set({
      phase: 'idle',
      currentRound: 0,
      totalRounds: DIFFICULTY_CONFIG[difficulty].rounds,
      score: 0,
      targetSpotId: null,
      selectedSpotId: null,
      roundResults: [],
      roundStartTime: null,
      gameResult: null,
    })
  },
}))
