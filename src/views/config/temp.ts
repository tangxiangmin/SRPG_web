const chessMap = {
  1: {name: 'A', hp: 100, damage: 20, moveStep: 10},
  2: {name: 'B', hp: 50, damage: 10, moveStep: 6},
  3: {name: 'E1', hp: 100, damage: 5, moveStep: 3},
  4: {name: 'E2', hp: 30, damage: 3, moveStep: 4},
}

export function getChessDetailById(id) {
  return chessMap[id]
}

export function getConfig() {
  // 下面的内容可以通过编辑器配置
  return {
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
}

