import {astar, Graph} from 'javascript-astar'

export class Chessboard {
  row: number
  col: number
  grid: number[][]
  graph: any // todo Graph type
  chessList: Chess[] = []

  constructor(grid) {
    this.grid = grid
    this.row = grid.length
    this.col = grid[0]?.length ?? 0

    this.graph = new Graph(grid)


  }

  // 添加棋子
  addChess(chess: Chess, x: number, y: number) {
    chess.x = x
    chess.y = y
    chess.chessboard = this
    this.chessList.push(chess)

  }

  finPath(x0, y0, x1, y1) {
    // 找到最短的路径
    const {graph} = this

    const starPosition = graph.grid[x0][y0];
    const endPosition = graph.grid[x1][y1];

    const result = astar.search(graph, starPosition, endPosition);

    return result
  }

  moveChess(chess: Chess, x: number, y: number) {
    chess.x = x
    chess.y = y

  }
}

export class Chess {
  name: string
  x: number
  y: number
  moveStep: number
  hp: number
  damage: number
  isDisabled: boolean
  chessboard: Chessboard

  constructor(name: string, hp: number, damage: number, moveStep: number) {
    this.name = name;

    this.moveStep = moveStep;
    this.hp = hp; // 生命值
    this.damage = damage; // 造成的伤害
    this.isDisabled = false; // 是否可以移动
  }

  calcChessMoveRange() {
    if (!this.chessboard) return []

    const {row, col, grid} = this.chessboard
    const {x, y, moveStep} = this
    const ans = []
    const queue = [{x, y}];
    const visited = {}

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

    function insert(x, y) {
      if (x < 0 || x >= row || y < 0 || y >= col) return;
      if (grid[x][y] === 0) return  // 墙无法参加
      const key = `x${x}y${y}`
      if (visited[key]) return

      visited[key] = true
      queue.push({x, y})
    }

    // 是否返回原始位置
    return ans
  }

  calcChessAttackRange() {

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
  }
}

class AIChess extends Chess {

  // 找到在操作范围内的元素
  findTargetList(): Chess[] {
    const moveRange = this.calcChessMoveRange()

    // 找到在移动范围内的元素
    return this.chessboard.chessList.filter((chess) => {
      // 先二次循环查找一下
      for (const cell of moveRange) {
        if (chess.x === cell.x && chess.y === cell.y) {
          return true
        }
      }
      return false
    })

  }

  // 计算选择策略并进行操作
  chooseActionTarget(targetList: Chess[]) {
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

  autoMove() {
    const targetList = this.findTargetList()
    const target = this.chooseActionTarget(targetList)

  }
}
