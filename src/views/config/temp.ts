// @ts-ignore
import frame1 from '../../assets/chess/1.jpeg'
// @ts-ignore
import frame2 from '../../assets/chess/2.png'
// @ts-ignore
import frame3 from '../../assets/chess/3.jpeg'

// @ts-ignore
import tile1 from '../../assets/map/tile_1.png'
// @ts-ignore
import tile2 from '../../assets/map/tile_2.png'
// @ts-ignore
import tile3 from '../../assets/map/tile_3.png'

export const chessList = [
  {
    id: 1,
    name: '王子', type: 1, hp: 100, damage: 20, moveStep: 10, attackDistance: 1,
    frame: frame1
  },
  {
    id: 2,
    name: '弓箭手', type: 2, hp: 50, damage: 10, moveStep: 6, attackDistance: 2,
    frame: frame3
  },
  {
    id: 3,
    name: '海盗', type: 1, hp: 100, damage: 5, moveStep: 3, attackDistance: 1,
    frame: frame2
  },
  {
    id: 4,
    name: '海盗2', type: 1, hp: 30, damage: 3, moveStep: 4, attackDistance: 1,
    frame: frame2
  },
]


export const cellList = [
  {id: 0, name: '墙', weight: 0, frame: tile1},
  {id: 1, name: '地板', weight: 1, frame: tile2},
  {id: 2, name: '草地', weight: 1, frame: tile3},
]

const cellMap = cellList.reduce((acc, cell) => {
  acc[cell.id] = cell
  return acc
}, {})

const chessMap = chessList.reduce((acc, chess) => {
  acc[chess.id] = chess
  return acc
}, {})

export function getChessDetailById(id) {
  return chessMap[id]
}

export function getCellDetailById(id) {
  return cellMap[id]
}

const map1 = {
  // 背景贴图列表
  grid: [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 1, 1, 1, 1, 0, 1, 1],
    [1, 1, 0, 0, 0, 0, 0, 0, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ],
  chessList: [
    // 根据chessId查找chess详情
    {chessId: 1, x: 0, y: 2, group: 1},
    {chessId: 2, x: 1, y: 2, group: 1},
    {chessId: 3, x: 7, y: 6, group: 2},
    {chessId: 4, x: 9, y: 9, group: 2},
  ]
}

const map2 = {
  // 背景贴图列表
  grid: [
    [2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 0, 1, 1],
    [1, 1, 0, 0, 0, 0, 0, 0, 1, 1],
    [1, 1, 0, 0, 0, 0, 0, 1, 1, 1],
    [1, 1, 1, 1, 0, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ],
  chessList: [
    // 根据chessId查找chess详情
    {chessId: 1, x: 0, y: 2, group: 1},
    {chessId: 3, x: 9, y: 4, group: 2},
    {chessId: 4, x: 9, y: 5, group: 2},
  ]
}

export const mapList = {
  map1,
  map2
}

export function getConfig(key) {
  // 下面的内容可以通过编辑器配置
  return mapList[key]
}

