import Chessboard, {ChessboardEvent, getCellKey, CellType} from './Chessboard'

import {AIChess, Chess} from "./Chess";

function sleep(ms = 100) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

// 负责管理流程和动画等功能
export class Stage {
  chessboard: Chessboard
  cellMap: any
  currentChess: Chess

  constructor(chessboard: Chessboard) {
    this.chessboard = chessboard

    // FIXME 使用箭头函数绑定会导致无法通过Proxy访问到数据，导致无法进行依赖收集，出现更新异常
    // this.chessboard.bus.on(ChessboardEvent.onToggleGroup, this.onAIRound.bind(this))

    this.renderMap()
  }

  // 电脑回合
  async onAIRound() {
    if (this.chessboard.currentGroup === 1)  return

    const aiChessList = this.chessboard.getChessListByGroup(2) as AIChess[]

    if (!aiChessList) {
      console.log('消灭全部敌人')
      return
    }

    for (const chess of aiChessList) {
      await sleep(100)

      this.onChessClick(chess.x, chess.y)

      await sleep(100)

      const {path, canReach, onTargetPos} = chess.chooseMoveTarget()
      if (!canReach) {
        await this.moveChessByPath(chess, path)
      } else if (onTargetPos) {
        chess.doAction()
      } else {
        await this.moveChessByPath(chess, path)
        await chess.doAction()
      }
    }

    this.finishRound()
  }

  // 计算棋盘状态，重新绘制
  renderMap() {
    const {grid} = this.chessboard
    const cellMap = {}
    const {chessboard} = this

    grid.forEach((row, x) => {
      row.map((cell, y) => {
        const key = getCellKey(x, y)

        cellMap[key] = {} // todo 定义每个cell的类型
        if (cell === CellType.wall) {
          cellMap[key].cls = 'wall'
        }
      })
    })

    chessboard.chessList.forEach(chess => {
      const {x, y} = chess
      const key = getCellKey(x, y)

      cellMap[key] = {
        ...cellMap[key],
        cls: '',
        chess: chess
      }
    })

    this.cellMap = cellMap
  }


  batchMarkCell(list, cls) {
    const {cellMap} = this
    list.forEach(({x, y}) => {
      const key = getCellKey(x, y)
      cellMap[key].cls = cls
    })

    this.cellMap = {...cellMap}
    // this.cellMap = {...cellMap}
  }

  // clearCell = (x, y) => {
  //   this.markCell(x, y, 'none')
  // }


  showMoveRange() {
    const chess = this.currentChess
    let range = chess.calcChessMoveRange()
    this.batchMarkCell(range, 'move-range')
  }

  showActionRange() {
    const chess = this.currentChess
    let range = chess.calcChessAttackRange()
    const list = range.filter((({x, y}) => x !== chess.x || y !== chess.y))

    this.batchMarkCell(list, 'attack-range')
  }

  // showMovePath = async (path) => {
  //   for (const node of path) {
  //     const {x, y} = node
  //     await sleep(100)
  //     this.markCell(x, y, 'path')
  //   }
  // }

  async moveChessByPath(chess, path) {
    for (const node of path) {
      const {x, y} = node
      await sleep(100)

      this.chessboard.moveChess(chess, x, y)
      this.renderMap()
    }
  }

  doChessAction() {
    this.currentChess.doAction()
    this.renderMap()
  }

  finishRound() {
    this.chessboard.toggleGroup()
    this.renderMap()
  }

  onCellClick(x, y) {
    console.log('onCellClick', x, y)
    // const {cellMap} = this.state
    // const key = getCellKey(x, y)
    // const {onClick} = cellMap[key]
    //
    // if (onClick) {
    //   onClick(x, y)
    // } else {
    //   console.log(`${key}对应的handler不存在`)
    // }
  }

  onChessClick(x, y) {
    const chess = this.chessboard.getChessByPos(x, y)
    if (chess.group !== 1) return

    this.currentChess = chess

    if (!chess.isMoved) {
      this.showMoveRange()
    } else if (!chess.isActioned) {
      this.showActionRange()
    } else {
      console.log('当前回合完毕')
    }
  }

  onMoveRangeCellClick(x, y) {

    const {x: x0, y: y0} = this.currentChess
    // 原始位置
    if (x0 === x && y0 === y) {
      this.currentChess.isMoved = true
      this.renderMap()
      return
    }
    const path = this.chessboard.finPath(x0, y0, x, y)
    // let range = this.currentChess.calcChessMoveRange()
    // 清除移动范围
    // this.batchMarkCell(range, 'none')

    // await sleep(200)

    // 展示移动路径
    // await this.showMovePath(path)
    //
    // await sleep(200)
    // 展示移动动画

    this.moveChessByPath(this.currentChess, path)
  }

  onAttackRangeCellClick(x, y) {
    if (this.currentChess.isActioned) return
    const target = this.chessboard.getChessByPos(x, y)
    if (target) {
      this.currentChess.attack(target)
    }
  }
}
