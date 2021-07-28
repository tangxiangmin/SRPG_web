import Chessboard, {CellType, getCellKey} from './Chessboard'

export class Chess {
  name: string
  x: number
  y: number
  frame: string

  moveStep: number
  attackDistance: number
  hp: number
  damage: number
  isMoved: boolean = false // 是否可以移动
  isActioned: boolean = false // 是否可以操作
  hasStrikeBack: boolean = false // 是否已经反击

  chessboard: Chessboard
  group: number
  target: Chess


  constructor(name: string, hp: number, damage: number, moveStep: number, attackDistance: number, frame:string) {
    this.name = name;

    this.hp = hp; // 生命值
    this.damage = damage; // 造成的伤害

    this.attackDistance = attackDistance // 攻击距离
    this.moveStep = moveStep; // 移动距离
    this.frame = frame
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
  calcChessMoveRange() {
    return this.calcRange(this.moveStep, (x, y, grid) => {
      const c = this.chessboard.getChessByPos(x, y)
      if (c && c !== this) return false
      if (grid[x][y] === CellType.wall) return false // 墙无法参加
      return true
    })
  }

  // 计算攻击范围
  calcChessAttackRange() {
    return this.calcRange(this.attackDistance, () => {
      return true
    }).filter(({x, y}) => {
      return this.chessboard.grid[x][y] !== CellType.wall
    })
  }

  attack(chess: Chess, isStrikeBack: boolean = false) {
    chess.hp -= this.damage;
    console.log(
      `${this.name}${isStrikeBack ? '反击' : '攻击'}${chess.name}，造成${this.damage}点伤害，${chess.name}剩余血量${chess.hp}`
    );

    chess.onAttack(this, isStrikeBack)

    this.isActioned = true
  }

  onAttack(chess: Chess, isStrikeBack: boolean) {
    // 反击
    if (!isStrikeBack && !this.hasStrikeBack) {
      this.strikeBack(chess)
    }

    if (this.hp <= 0) {
      this.onDie()
    }
  }

  // 反击
  strikeBack(chess: Chess) {
    const attackRange = this.calcChessAttackRange()
    // 在攻击范围内
    const canStrikeBack = attackRange.some(({x, y}) => {
      return chess.x === x && chess.y === y
    })

    if (canStrikeBack) {
      this.hasStrikeBack = true
      this.attack(chess, true)
    }
  }


  onDie() {
    console.log(`${this.name}战败，从棋盘上移除`)
    this.chessboard.removeChess(this)
  }

  doAction() {
    this.isActioned = true
    if (this.target) {
      this.attack(this.target)
    }
  }

  resetOnRound() {
    this.isMoved = false
    this.isActioned = false
    this.hasStrikeBack = false
  }
}
