import { useState, useEffect } from 'react'

interface WindowSize {
  width: number
  height: number
}

/**
 * useWindowSize — 브라우저 창 크기를 실시간으로 반환하는 훅
 * - resize 이벤트 리스너 자동 등록/해제
 * - ResultPopup의 react-confetti, 반응형 레이아웃에 활용
 */
export function useWindowSize(): WindowSize {
  const [size, setSize] = useState<WindowSize>({
    width: window.innerWidth,
    height: window.innerHeight,
  })

  useEffect(() => {
    const handleResize = () => {
      setSize({ width: window.innerWidth, height: window.innerHeight })
    }

    window.addEventListener('resize', handleResize)
    // 마운트 직후 한 번 실행 (초기 SSR 대비)
    handleResize()

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return size
}
