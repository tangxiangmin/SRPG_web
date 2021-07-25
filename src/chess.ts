import {astar, Graph} from 'javascript-astar'
import EventEmitter from 'EventEmitter'


export function getCellKey(x, y) {
  return `x${x}y${y}`
}

export enum ChessboardEvent {
  onToggleGroup
}

// type CellType = number
//
// export class Cell {
//   x: number
//   y: number
//   type: CellType // 元素的位置
//   chess: Chess
// }

enum CellType {
  wall = 0,
  blank = 1,
}

export class Chessboard {
  row: number
  col: number
  grid: number[][]
  graph: any // todo Graph type
  chessList: Chess[] = []
  roundCount: number = 1
  currentGroup: number = 1 // 当前回合的用户

  bus: EventEmitter

  constructor(grid) {
    this.grid = grid
    this.row = grid.length
    this.col = grid[0]?.length ?? 0

    this.graph = new Graph(grid)

    this.bus = new EventEmitter()
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

    // this.checkRoundEnd()
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

  // 一些工具方法
  finPath(x0, y0, x1, y1) {
    // 找到最短的路径
    const {graph} = this

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
      chess.isMoved = false
      chess.isActioned = false
    })

    this.bus.emit(ChessboardEvent.onToggleGroup)
  }

}

export class Chess {
  name: string
  x: number
  y: number
  moveStep: number
  hp: number
  damage: number
  isMoved: boolean = false // 是否可以移动
  isActioned: boolean = false // 是否可以操作
  chessboard: Chessboard
  group: number
  target: Chess

  constructor(name: string, hp: number, damage: number, moveStep: number) {
    this.name = name;

    this.moveStep = moveStep;
    this.hp = hp; // 生命值
    this.damage = damage; // 造成的伤害
  }

  get isDisabled() {
    return this.isMoved && this.isActioned
  }

  calcRange(moveStep, filter) {
    const {chessboard} = this
    if (!chessboard) return []
    const {row, col, grid} = chessboard
    const {x, y} = this
    const ans = []
    const queue = [{x, y}];
    const visited = {}

    const insert = (x, y) => {
      if (x < 0 || x >= row || y < 0 || y >= col) return;
      if (grid[x][y] === CellType.wall) return  // 墙无法参加

      if (filter(x, y)) return

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
  calcChessMoveRange() {
    return this.calcRange(this.moveStep, (x, y) => {
      const c = this.chessboard.getChessByPos(x, y)
      if (c && c !== this) return true
    })
  }

  // 计算攻击范围
  calcChessAttackRange() {
    return this.calcRange(1, () => {
      return false
    })
  }

  moveTo(x, y) {
    const path = this.chessboard.finPath(this.x, this.y, x, y)
    console.log(`通过path${path}移动到${{x, y}}`)
    return path
  }

  attack(chess) {
    chess.hp -= this.damage;
    console.log(
      `${this.name}攻击${chess.name}，造成${this.damage}点伤害，${chess.name}剩余血量${chess.hp}`
    );

    chess.onAttack(this)

    this.isActioned = true
  }

  onAttack(chess) {
    // todo 是否能反击
    if (this.hp <= 0) {
      this.onDie()
    }
  }

  onDie() {
    this.chessboard.removeChess(this)
  }

  doAction() {
    this.isActioned = true
    if (this.target) {
      this.attack(this.target)
    }
  }
}

export class AIChess extends Chess {
  // 计算选择策略并进行操作
  chooseActionTarget() {
    // const moveRange = this.calcChessMoveRange()

    const targetList = this.chessboard.chessList.filter((chess) => {
      if (chess === this) return false // 忽略自己

      return true

      // // 找到在移动范围内的元素 先二次循环查找一下
      // for (const cell of moveRange) {
      //   if (chess.x === cell.x && chess.y === cell.y) {
      //     return true
      //   }
      // }
      //
      // return false
    })

    // todo 使用一个概率函数，选择动作策略
    const calcProbability = (target: Chess) => {
      console.log(`calcProbability`, target)
      return 0.5
    }

    for (const chess of targetList) {
      if (calcProbability(chess) > 0.2) {
        return chess
      }
    }
  }

  // 找到移动目标位置
  chooseMoveTarget(): { path: any[], canReach: boolean, onTargetPos: boolean } {
    // const moveRange = this.calcChessMoveRange()
    // 找到敌方的棋子
    const list = this.chessboard.chessList.filter(chess => chess.group !== this.group)
    // const list = moveRange.filter(({x, y}) => {
    //   return x !== this.x && y !== this.y
    // })
    // 确定某个棋子，移动到对应位置
    const target = list[0]
    if (!target) return {path: [], canReach: false, onTargetPos: false}

    this.target = target // 设置目标

    const targetAroundList = this.chessboard.findTargetAround(target.x, target.y, this)

    const onTargetAround = targetAroundList.find(({x, y}) => x === this.x && y === this.y)
    if (onTargetAround) {
      return {path: [], canReach: true, onTargetPos: true}
    }

    const findNearestPath = () => {
      let minPath = []
      for (let target of targetAroundList) {
        const path = this.chessboard.finPath(this.x, this.y, target.x, target.y)
        if (!minPath.length) {
          minPath = path
        } else if (path.length && minPath.length > path.length) {
          minPath = path
        }
      }
      return minPath
    }

    // 找到最近的一个目标位置
    const path = findNearestPath()

    if (!path.length) {
      console.log('no path')

      return {path: [], canReach: false, onTargetPos: false}
    }

    return {
      path: path.slice(0, this.moveStep),
      canReach: path.length <= this.moveStep,
      onTargetPos: false
    }

    // 策略：返回一个随机的可移动位置
    // return list[rdIndex]
  }
}
