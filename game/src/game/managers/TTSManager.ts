/**
 * TTSManager — Web Speech API 기반 한국어 음성 안내 싱글톤
 * - 브라우저 SpeechSynthesis 사용 (설치 불필요, 완전 무료)
 * - 지원하지 않는 브라우저에서 조용히 무시 (graceful fallback)
 * - 음소거 상태에서는 TTS도 비활성화
 */

// 단계별 안내 문구
export const TTS_SCRIPTS = {
  memorize: '다람이가 도토리를 숨기고 있어요. 잘 기억해 두세요!',
  play: '어디에 숨겼을까요? 장소를 클릭해 보세요!',
  correct: '맞았어요! 정말 잘했어요!',
  wrong: '아쉬워요. 다음엔 찾을 수 있을 거예요!',
  complete: '게임이 끝났어요! 정말 대단해요!',
  welcome: '안녕하세요! 다람이와 함께 도토리를 찾아봐요!',
} as const

export type TTSScriptKey = keyof typeof TTS_SCRIPTS

class TTSManagerClass {
  private supported: boolean
  private _muted = false

  constructor() {
    this.supported = typeof window !== 'undefined' && 'speechSynthesis' in window
    if (!this.supported) {
      console.warn('[TTSManager] Web Speech API not supported in this browser.')
    }
  }

  /** 미리 정의된 안내 문구 읽기 */
  speak(key: TTSScriptKey) {
    this.speakText(TTS_SCRIPTS[key])
  }

  /** 임의 텍스트 읽기 */
  speakText(text: string) {
    if (!this.supported || this._muted) return

    // 이전 발화 중단
    this.stop()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'ko-KR'
    utterance.rate = 0.9   // 약간 느리게 (유아 대상)
    utterance.pitch = 1.1  // 약간 높게 (친근한 목소리)
    utterance.volume = 0.9

    // 한국어 음성 선택 (가능한 경우)
    const voices = window.speechSynthesis.getVoices()
    const koVoice = voices.find(
      (v) => v.lang === 'ko-KR' || v.lang.startsWith('ko')
    )
    if (koVoice) utterance.voice = koVoice

    window.speechSynthesis.speak(utterance)
  }

  /** 발화 중단 */
  stop() {
    if (!this.supported) return
    window.speechSynthesis.cancel()
  }

  /** 음소거 설정 (AudioManager와 연동) */
  setMuted(muted: boolean) {
    this._muted = muted
    if (muted) this.stop()
  }

  get muted() {
    return this._muted
  }

  get isSupported() {
    return this.supported
  }
}

/** 싱글톤 인스턴스 */
export const TTSManager = new TTSManagerClass()
