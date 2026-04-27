import { Howl, Howler } from 'howler'
import type { SfxKey } from '../config/types'

/**
 * AudioManager — Howler.js 기반 사운드 싱글톤 매니저
 * - SFX: 정답/오답/클릭/완료/기억단계
 * - BGM: 숲 배경음 루프
 * - 음소거 토글, 볼륨 조절, localStorage 지속성
 */

// SFX 파일 경로 맵 (파일이 없으면 graceful silent fallback)
const SFX_SOURCES: Record<SfxKey, string[]> = {
  correct: ['/assets/sounds/sfx/correct.mp3'],
  wrong: ['/assets/sounds/sfx/wrong.mp3'],
  click: ['/assets/sounds/sfx/click.mp3'],
  complete: ['/assets/sounds/sfx/complete.mp3'],
  memorize: ['/assets/sounds/sfx/memorize.mp3'],
}

const BGM_SOURCE = ['/assets/sounds/bgm/forest-ambient.mp3']

// localStorage 키
const LS_MUTED = 'darame_muted'
const LS_VOLUME = 'darame_volume'

class AudioManagerClass {
  private sfx: Partial<Record<SfxKey, Howl>> = {}
  private bgm: Howl | null = null
  private _muted: boolean = false
  private _volume: number = 0.7
  private _initialized = false

  /** 초기화 — App 최초 로드 시 1회 호출 */
  init() {
    if (this._initialized) return
    this._initialized = true

    // localStorage 복원
    const savedMuted = localStorage.getItem(LS_MUTED)
    const savedVolume = localStorage.getItem(LS_VOLUME)
    this._muted = savedMuted === 'true'
    this._volume = savedVolume ? parseFloat(savedVolume) : 0.7

    Howler.volume(this._muted ? 0 : this._volume)

    // SFX 미리 로드
    const sfxKeys = Object.keys(SFX_SOURCES) as SfxKey[]
    sfxKeys.forEach((key) => {
      this.sfx[key] = new Howl({
        src: SFX_SOURCES[key],
        volume: 0.8,
        preload: true,
        onloaderror: () => {
          // 파일 없을 때 조용히 무시
          console.warn(`[AudioManager] SFX not found: ${key}`)
        },
      })
    })

    // BGM 로드
    this.bgm = new Howl({
      src: BGM_SOURCE,
      loop: true,
      volume: 0.3,
      preload: true,
      onloaderror: () => {
        console.warn('[AudioManager] BGM not found, continuing without music.')
      },
    })
  }

  // ── SFX ──────────────────────────────────────────────

  playSfx(key: SfxKey) {
    if (this._muted) return
    const sound = this.sfx[key]
    if (!sound) return
    // 이미 재생 중이면 처음부터 다시
    sound.stop()
    sound.play()
  }

  // ── BGM ──────────────────────────────────────────────

  playBgm() {
    if (!this.bgm || this._muted) return
    if (!this.bgm.playing()) {
      this.bgm.play()
    }
  }

  stopBgm() {
    this.bgm?.stop()
  }

  pauseBgm() {
    this.bgm?.pause()
  }

  resumeBgm() {
    if (!this._muted) this.bgm?.play()
  }

  // ── 볼륨 / 음소거 ─────────────────────────────────────

  get muted() {
    return this._muted
  }

  get volume() {
    return this._volume
  }

  toggleMute() {
    this._muted = !this._muted
    Howler.volume(this._muted ? 0 : this._volume)
    localStorage.setItem(LS_MUTED, String(this._muted))

    if (this._muted) {
      this.bgm?.pause()
    } else {
      this.bgm?.play()
    }

    return this._muted
  }

  setVolume(vol: number) {
    this._volume = Math.max(0, Math.min(1, vol))
    if (!this._muted) Howler.volume(this._volume)
    localStorage.setItem(LS_VOLUME, String(this._volume))
  }
}

/** 싱글톤 인스턴스 */
export const AudioManager = new AudioManagerClass()
