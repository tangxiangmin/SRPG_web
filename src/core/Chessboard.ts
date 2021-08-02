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

function getCellWeight(type: CellType) {
  let map = {
    0: 0,
    1: 1,
    2: 1
  }

  return map[type]
}

export default class Chessboard {
  row: number
  col: number
  grid: number[][]
  weightGrid: number[][]
  chessList: Chess[] = []
  roundCount: number = 1
  currentGroup: number = 1 // 当前回合的用户

  bus: EventBus

  constructor(grid: number[][]) {
    this.grid = grid
    this.row = grid.length
    this.col = grid[0]?.length ?? 0

    this.bus = new EventBus()

    this.initWeightGrid()
  }

  // 计算初始的权重地图
  private initWeightGrid() {
    const {row, col, grid} = this
    let map = []
    for (let i = 0; i < row; ++i) {
      let line = []
      for (let j = 0; j < col; ++j) {
        const cellType = grid[i][j]
        const weight = getCellWeight(cellType)
        line.push(weight)
      }
      map.push(line)
    }
    this.weightGrid = map
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
    const {weightGrid, row, col} = this
    // 根据棋盘上的摆放动态计算权重
    let totalWeightGrid = []
    for (let x = 0; x < row; ++x) {
      let row = []
      for (let y = 0; y < col; ++y) {
        let cell = weightGrid[x][y]
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
      totalWeightGrid.push(row)
    }

    const graph = new Graph(totalWeightGrid)


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

  // 计算某个棋子的范围
  calcRange(x, y, moveStep, filter) {
    const {row, col, grid} = this
    const ans = []
    const queue = [{x, y}];
    const visited = {}

    const insert = (x, y) => {
      if (x < 0 || x >= row || y < 0 || y >= col) return;
      if (!filter(x, y, grid)) return

      const key = getCellKey(x, y)
      if (visited[key]) return

      visited[key] = true
      queue.push({x, y})
    }

    let step = 0
    let len = queue.length
    while (len) {
      len = queue.length
      while (len--) {
        const cell = queue.shift()
        ans.push(cell)
        const {x, y} = cell

        // todo 针对特殊地形可能需要扣减移动步数
        insert(x - 1, y)
        insert(x + 1, y)
        insert(x, y - 1)
        insert(x, y + 1)
      }

      step++
      if (step > moveStep) {
        break
      }
    }

    // 是否返回原始位置
    return ans
  }

  // 计算移动范围
  calcChessMoveRange(chess: Chess) {
    const {x, y, moveStep} = chess
    return this.calcRange(x, y, moveStep, (x, y, grid) => {
      const c = this.getChessByPos(x, y)
      if (c && c !== chess) return false
      if (grid[x][y] === CellType.wall) return false // 墙无法参加
      return true
    })
  }

  // 计算攻击范围
  calcChessAttackRange(chess: Chess) {
    const {x, y, attackDistance} = chess
    return this.calcRange(x, y, attackDistance, () => {
      return true
    }).filter(({x, y}) => {
      return this.grid[x][y] !== CellType.wall
    })
  }

  // 切换回合
  toggleGroup() {
    this.roundCount++
    this.currentGroup = this.currentGroup === 1 ? 2 : 1
    this.getChessListByGroup(this.currentGroup).forEach(chess => {
      chess.resetOnRound()
      chess.onUpdate()
    })

    this.bus.emit(ChessboardEvent.onToggleGroup)
  }

}
