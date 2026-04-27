import { Howl } from 'howler'

/**
 * TTSManager v2 — 하이브리드 음성 안내 싱글톤
 *
 * 우선순위:
 * 1. MP3 사전 녹음 파일 (`/assets/sounds/tts/*.mp3`) — 자연스럽고 고품질
 * 2. Web Speech API — MP3 로드 실패 시 자동 폴백 (브라우저 내장)
 *
 * MP3 파일 준비:
 *   public/assets/sounds/tts/ 폴더에 아래 파일 배치
 *   welcome.mp3 / memorize.mp3 / play.mp3 / correct.mp3 / wrong.mp3 / complete.mp3
 *   (README.md 참조: CLOVA Voice, ElevenLabs, TYPECAST 등 무료 TTS 생성 가능)
 */

export const TTS_SCRIPTS = {
  welcome:  '안녕하세요! 다람이와 함께 도토리를 찾아봐요!',
  memorize: '다람이가 도토리를 숨기고 있어요. 잘 기억해 두세요!',
  play:     '어디에 숨겼을까요? 장소를 클릭해 보세요!',
  correct:  '맞았어요! 정말 잘했어요!',
  wrong:    '아쉬워요. 다음엔 찾을 수 있을 거예요!',
  complete: '게임이 끝났어요! 정말 대단해요!',
} as const

export type TTSScriptKey = keyof typeof TTS_SCRIPTS

/** MP3 파일 경로 맵 */
const TTS_MP3_PATHS: Record<TTSScriptKey, string> = {
  welcome:  '/assets/sounds/tts/welcome.mp3',
  memorize: '/assets/sounds/tts/memorize.mp3',
  play:     '/assets/sounds/tts/play.mp3',
  correct:  '/assets/sounds/tts/correct.mp3',
  wrong:    '/assets/sounds/tts/wrong.mp3',
  complete: '/assets/sounds/tts/complete.mp3',
}

class TTSManagerClass {
  /** MP3 Howl 인스턴스 캐시 */
  private howls: Partial<Record<TTSScriptKey, Howl>> = {}
  /** MP3 로드 가능 여부 (404 등 실패 시 false) */
  private mp3Available: Partial<Record<TTSScriptKey, boolean>> = {}
  /** Web Speech API 지원 여부 */
  private speechSupported: boolean
  private _muted = false
  private currentHowl: Howl | null = null

  constructor() {
    this.speechSupported =
      typeof window !== 'undefined' && 'speechSynthesis' in window
    this.preloadMP3s()
  }

  /** 모든 TTS MP3 미리 로드 */
  private preloadMP3s() {
    const keys = Object.keys(TTS_MP3_PATHS) as TTSScriptKey[]
    keys.forEach((key) => {
      const howl = new Howl({
        src: [TTS_MP3_PATHS[key]],
        preload: true,
        volume: 1.0,
        onload: () => {
          this.mp3Available[key] = true
          console.info(`[TTS] MP3 로드 성공: ${key}`)
        },
        onloaderror: () => {
          this.mp3Available[key] = false
          // 파일 없음 — Web Speech API로 자동 폴백
        },
      })
      this.howls[key] = howl
    })
  }

  /** 미리 정의된 안내 문구 읽기 */
  speak(key: TTSScriptKey) {
    if (this._muted) return

    if (this.mp3Available[key]) {
      // ── MP3 재생 (고품질) ──────────────────────────
      this.stopCurrent()
      const howl = this.howls[key]!
      howl.stop()
      howl.play()
      this.currentHowl = howl
    } else {
      // ── Web Speech API 폴백 ────────────────────────
      this.speakFallback(TTS_SCRIPTS[key])
    }
  }

  /** Web Speech API 폴백 */
  private speakFallback(text: string) {
    if (!this.speechSupported) return
    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'ko-KR'
    utterance.rate = 0.88
    utterance.pitch = 1.1
    utterance.volume = 0.95

    // 한국어 음성 우선 선택
    const voices = window.speechSynthesis.getVoices()
    const koVoice =
      voices.find((v) => v.lang === 'ko-KR' && v.localService) ??
      voices.find((v) => v.lang === 'ko-KR') ??
      voices.find((v) => v.lang.startsWith('ko'))
    if (koVoice) utterance.voice = koVoice

    window.speechSynthesis.speak(utterance)
  }

  /** 현재 재생 중인 MP3 중단 */
  private stopCurrent() {
    if (this.currentHowl) {
      this.currentHowl.stop()
      this.currentHowl = null
    }
  }

  /** 모든 발화 중단 */
  stop() {
    this.stopCurrent()
    if (this.speechSupported) window.speechSynthesis.cancel()
  }

  /** 음소거 설정 (MuteButton과 연동) */
  setMuted(muted: boolean) {
    this._muted = muted
    if (muted) this.stop()
  }

  get muted() { return this._muted }
  get isSupported() { return true }

  /** MP3 준비 상태 확인 (디버그용) */
  get mp3Status() { return { ...this.mp3Available } }
}

/** 싱글톤 인스턴스 */
export const TTSManager = new TTSManagerClass()
