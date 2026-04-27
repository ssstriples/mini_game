import type { HidingSpot } from './types'

/** 8개 숨김 장소 데이터 (캔버스 기준 비율 좌표) */
export const SPOTS_DATA: HidingSpot[] = [
  {
    id: 0,
    key: 'tree',
    label: '나무 뒤',
    x: 0.1,
    y: 0.45,
    spriteFrame: 'spot_tree',
  },
  {
    id: 1,
    key: 'rock',
    label: '바위 아래',
    x: 0.25,
    y: 0.65,
    spriteFrame: 'spot_rock',
  },
  {
    id: 2,
    key: 'bush',
    label: '덤불 속',
    x: 0.42,
    y: 0.55,
    spriteFrame: 'spot_bush',
  },
  {
    id: 3,
    key: 'hole',
    label: '땅속 구멍',
    x: 0.58,
    y: 0.7,
    spriteFrame: 'spot_hole',
  },
  {
    id: 4,
    key: 'log',
    label: '통나무 위',
    x: 0.73,
    y: 0.5,
    spriteFrame: 'spot_log',
  },
  {
    id: 5,
    key: 'mushroom',
    label: '버섯 옆',
    x: 0.85,
    y: 0.6,
    spriteFrame: 'spot_mushroom',
  },
  {
    id: 6,
    key: 'flower',
    label: '꽃밭 속',
    x: 0.35,
    y: 0.38,
    spriteFrame: 'spot_flower',
  },
  {
    id: 7,
    key: 'pond',
    label: '연못 근처',
    x: 0.65,
    y: 0.35,
    spriteFrame: 'spot_pond',
  },
]

/** ID로 장소 찾기 */
export function getSpotById(id: number): HidingSpot | undefined {
  return SPOTS_DATA.find((s) => s.id === id)
}
