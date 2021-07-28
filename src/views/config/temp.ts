// @ts-ignore
import frame1 from '../../assets/chess/1.jpeg'
// @ts-ignore
import frame2 from '../../assets/chess/2.png'
// @ts-ignore
import frame3 from '../../assets/chess/3.jpeg'

const chessMap = {
  1: {
    name: '王子', type: 1, hp: 100, damage: 20, moveStep: 10, attackDistance: 1,
    frame: frame1
  },
  2: {
    name: '弓箭手', type: 2, hp: 50, damage: 10, moveStep: 6, attackDistance: 2,
    frame: frame3
  },
  3: {
    name: '海盗', type: 1, hp: 100, damage: 5, moveStep: 3, attackDistance: 1,
    frame: frame2
  },
  4: {
    name: '海盗2', type: 1, hp: 30, damage: 3, moveStep: 4, attackDistance: 1,
    frame: frame2
  },
}

export function getChessDetailById(id) {
  return chessMap[id]
}

export function getConfig() {
  // 下面的内容可以通过编辑器配置
  return {
    // 权重地图
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
    // 背景地图
    map: [
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
}

