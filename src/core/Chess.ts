import Chessboard, {CellType, getCellKey} from './Chessboard'

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

