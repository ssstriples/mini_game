import { useState } from 'react'
import { AudioManager } from '../game/managers/AudioManager'
import { TTSManager } from '../game/managers/TTSManager'

/**
 * MuteButton — 우상단 고정 음소거 토글 버튼
 * - 클릭 시 AudioManager + TTSManager 동시 음소거
 * - localStorage 저장은 AudioManager 내부에서 처리
 */
export default function MuteButton() {
  const [muted, setMuted] = useState<boolean>(AudioManager.muted)

  const handleToggle = () => {
    const nowMuted = AudioManager.toggleMute()
    TTSManager.setMuted(nowMuted)
    setMuted(nowMuted)
  }

  return (
    <button
      onClick={handleToggle}
      className="fixed top-3 right-3 z-50 w-11 h-11 rounded-full bg-black/40 hover:bg-black/60 active:scale-95 transition-all duration-150 flex items-center justify-center text-2xl shadow-lg"
      aria-label={muted ? '소리 켜기' : '소리 끄기'}
      title={muted ? '소리 켜기' : '소리 끄기'}
    >
      {muted ? '🔇' : '🔊'}
    </button>
  )
}
