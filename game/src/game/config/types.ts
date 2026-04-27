// 게임 전체 타입 정의

/** 게임 진행 단계 */
export type GamePhase =
  | 'idle' // 시작 전
  | 'memorize' // 다람이가 도토리 숨기는 모습 보여주기
  | 'play' // 플레이어가 장소를 선택하는 단계
  | 'result' // 결과 확인
  | 'complete' // 모든 라운드 완료

/** 장소(숨김 지점) 데이터 */
export interface HidingSpot {
  id: number // 고유 ID (0~7)
  key: string // 식별자 (예: 'tree', 'rock')
  label: string // 한글 이름 (예: '나무 뒤')
  x: number // 캔버스 내 X 좌표 (0~1 비율)
  y: number // 캔버스 내 Y 좌표 (0~1 비율)
  spriteFrame: string // 스프라이트 프레임 키
}

/** 라운드 결과 */
export interface RoundResult {
  round: number
  targetSpotId: number
  selectedSpotId: number
  isCorrect: boolean
  reactionTimeMs: number
}

/** 게임 전체 결과 */
export interface GameResult {
  totalRounds: number
  correctCount: number
  results: RoundResult[]
  durationMs: number
}

/** 사운드 효과 키 */
export type SfxKey =
  | 'correct' // 정답
  | 'wrong' // 오답
  | 'click' // 클릭
  | 'complete' // 게임 완료
  | 'memorize' // 기억하기 단계

/** 게임 난이도 */
export type Difficulty = 'easy' | 'normal' | 'hard'

/** 난이도별 설정 */
export interface DifficultyConfig {
  rounds: number // 총 라운드 수
  memorizeTimeMs: number // 기억 시간 (ms)
  spotCount: number // 활성화할 장소 수
  playTimeLimitMs: number // 정답 선택 제한 시간 (ms)
}
