import { useEffect, useRef } from 'react'
import type { RefObject } from 'react'
import Phaser from 'phaser'
import { PHASER_CONFIG } from '../game/config/gameConfig'

interface GameCanvasProps {
  scenes: Phaser.Types.Scenes.SceneType[]
  gameRef?: RefObject<Phaser.Game | null>
}

/**
 * Phaser 게임 인스턴스를 React DOM에 마운트하는 컴포넌트
 * - 마운트 시 Phaser.Game 생성
 * - 언마운트 시 destroy()로 정리
 * - gameRef를 통해 부모에서 Phaser.Game 인스턴스 접근 가능
 */
export default function GameCanvas({ scenes, gameRef }: GameCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const internalRef = useRef<Phaser.Game | null>(null)

  useEffect(() => {
    if (!containerRef.current || internalRef.current) return

    const config: Phaser.Types.Core.GameConfig = {
      ...PHASER_CONFIG,
      scene: scenes,
      parent: containerRef.current,
    }

    const game = new Phaser.Game(config)
    internalRef.current = game
    if (gameRef) {
      ;(gameRef as React.MutableRefObject<Phaser.Game | null>).current = game
    }

    return () => {
      game.destroy(true)
      internalRef.current = null
      if (gameRef) {
        ;(gameRef as React.MutableRefObject<Phaser.Game | null>).current = null
      }
    }
  }, [scenes])

  return (
    <div
      ref={containerRef}
      className="w-full h-full flex items-center justify-center overflow-hidden"
    />
  )

}
