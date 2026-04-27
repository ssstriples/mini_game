import { useEffect, useRef } from 'react'
import Phaser from 'phaser'
import { PHASER_CONFIG } from '../game/config/gameConfig'

interface GameCanvasProps {
  scenes: Phaser.Types.Scenes.SceneType[]
}

/**
 * Phaser 게임 인스턴스를 React DOM에 마운트하는 컴포넌트
 * - 마운트 시 Phaser.Game 생성
 * - 언마운트 시 destroy()로 정리
 */
export default function GameCanvas({ scenes }: GameCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const gameRef = useRef<Phaser.Game | null>(null)

  useEffect(() => {
    if (!containerRef.current || gameRef.current) return

    const config: Phaser.Types.Core.GameConfig = {
      ...PHASER_CONFIG,
      scene: scenes,
      parent: containerRef.current,
    }

    gameRef.current = new Phaser.Game(config)

    return () => {
      gameRef.current?.destroy(true)
      gameRef.current = null
    }
  }, [scenes])

  return (
    <div
      ref={containerRef}
      className="w-full h-full flex items-center justify-center overflow-hidden"
    />
  )
}
