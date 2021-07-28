import {astar, Graph} from 'javascript-astar'
import EventBus from './EventBus'

import {Chess} from "./Chess"

export function getCellKey(x, y) {
  return `x${x}y${y}`
}

export enum ChessboardEvent {
  onToggleGroup
}

export enum CellType {
  wall = 0,
  blank = 1,
}

export default class Chessboard {
  row: number
  col: number
  grid: number[][]
  map: number[][]
  chessList: Chess[] = []
  roundCount: number = 1
  currentGroup: number = 1 // 当前回合的用户

  bus: EventBus

  constructor(grid, map) {
    this.grid = grid
    this.map = map
    this.row = grid.length
    this.col = grid[0]?.length ?? 0

    this.bus = new EventBus()
  }

  // 添加棋子
  addChess(chess: Chess, x: number, y: number, group: number) {
    chess.x = x
    chess.y = y
    chess.chessboard = this
    chess.group = group

    this.chessList.push(chess)
  }

  // 移动棋子
  moveChess(chess: Chess, x: number, y: number) {
    chess.x = x
    chess.y = y
    chess.isMoved = true
  }

  // 删除棋子
  removeChess(chess) {
    this.chessList = this.chessList.filter(c => c !== chess)
  }

  // 查找棋子
  getChessByPos(x, y) {
    return this.chessList.find(chess => chess.x === x && chess.y === y)
  }

  getChessListByGroup(group) {
    return this.chessList.filter(chess => chess.group === group)
  }

  // 根据棋盘上现在的布局计算最短路径
  finPath(x0, y0, x1, y1) {
    // 找到最短的路径
    const {grid, row, col} = this

    let weightGrid = [] // 计算权重
    // 计算
    for (let x = 0; x < row; ++x) {
      let row = []
      for (let y = 0; y < col; ++y) {
        let cell = grid[x][y]
        // 有棋子的地方无法经过
        const chess = this.getChessByPos(x, y)
        if (chess) {
          // todo 看看是否需要调整为其他专门的类型
          // todo 同组的棋子看看是否可以忽略障碍
          row.push(CellType.wall)
        } else {
          row.push(cell)
        }
      }
      weightGrid.push(row)
    }

    const graph = new Graph(weightGrid)


    const starPosition = graph.grid[x0][y0];
    const endPosition = graph.grid[x1][y1];

    return astar.search(graph, starPosition, endPosition);
  }

  // 找到某个坐标作为可以占据的位置
  findTargetAround(x, y, chess: Chess): { x: number, y: number }[] {
    const {row, col, grid} = this

    const insert = (x, y) => {
      if (x < 0 || x >= row || y < 0 || y >= col) return;
      if (grid[x][y] === CellType.wall) return
      const c = this.getChessByPos(x, y)
      if (c && c !== chess) return // 对应位置有棋子，也无法访问

      ans.push({x, y})
    }

    let ans = []
    insert(x - 1, y)
    insert(x + 1, y)
    insert(x, y - 1)
    insert(x, y + 1)
    return ans
  }

  checkRoundEnd() {
    const list = this.getChessListByGroup(this.currentGroup).filter((chess) => !chess.isDisabled)
    if (list.length === 0) {
      // todo 还可以进行动作
      this.toggleGroup()
    }
  }

  // 切换回合
  toggleGroup() {
    this.roundCount++
    this.currentGroup = this.currentGroup === 1 ? 2 : 1
    this.getChessListByGroup(this.currentGroup).forEach(chess => {
      chess.resetOnRound()
    })

    this.bus.emit(ChessboardEvent.onToggleGroup)
  }

}