import Chessboard, {getCellKey} from './Chessboard'

import {Chess} from "./Chess";
import {AIChess} from './AIChess'
import {sleep} from "../util";

// 负责管理流程和动画等功能
export class Stage {
  chessboard: Chessboard
  cellMap: any
  currentChess: Chess
  currentMoveRange: any // 移动范围
  currentAttackRange: any // 攻击范围

  constructor(chessboard: Chessboard) {
    this.chessboard = chessboard
    this.currentMoveRange = {}
    this.currentAttackRange = {}

    this.renderMap()
  }

  // 电脑回合
  async onAIRound() {
    if (this.chessboard.currentGroup === 1) return

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

  // 计算棋盘状态，重新绘制 todo 优化逻辑
  renderMap() {
    const cellMap = {}
    const {chessboard} = this

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

  showMoveRange() {
    const chess = this.currentChess
    if (chess.isMoved) return
    let range = this.chessboard.calcChessMoveRange(chess)

    this.currentMoveRange = range.reduce((acc, cell) => {
      const {x, y} = cell
      const key = getCellKey(x, y)
      acc[key] = true
      return acc
    }, {})

    this.renderMap()
  }

  showActionRange() {
    const chess = this.currentChess
    if (chess.isActioned) return

    let range = this.chessboard.calcChessAttackRange(chess)
    const list = range.filter((({x, y}) => x !== chess.x || y !== chess.y))

    this.currentAttackRange = list.reduce((acc, cell) => {
      const {x, y} = cell
      const key = getCellKey(x, y)
      acc[key] = true
      return acc
    }, {})

    this.renderMap()
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
    // 移动完毕后展示攻击范围
    this.showActionRange()
  }

  finishRound() {
    this.currentMoveRange = {}
    this.currentAttackRange = {}

    this.chessboard.toggleGroup()
    this.renderMap()
  }

  onCellClick(x, y) {
    console.log('onCellClick', x, y)
  }

  onChessClick(x, y) {
    const chess = this.chessboard.getChessByPos(x, y)
    this.currentChess = chess

    if (chess.group !== 1) return

    if (!chess.isMoved) {
      this.showMoveRange()
    } else if (!chess.isActioned) {
      this.showActionRange()
    } else {
      console.log('本回合该棋子操作完毕')
    }
  }

  onMoveRangeCellClick(x, y) {
    this.currentMoveRange = {}
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
    // await sleep(200)

    // 展示移动路径
    // await this.showMovePath(path)
    //
    // await sleep(200)
    // 展示移动动画

    this.moveChessByPath(this.currentChess, path)
  }

  onAttackRangeCellClick(x, y, Skill) {
    this.currentAttackRange = {}

    if (this.currentChess.isActioned) return

    const target = this.chessboard.getChessByPos(x, y)

    if (target) {
      if(Skill) {
        const skill = new Skill()
        this.currentChess.useSkill(skill, target)
      }else {
        this.currentChess.attack(target)
      }
    }
    this.renderMap()
  }

  endChessInRound(){
    this.currentChess.isMoved = true
    this.currentChess.isActioned = true
    this.currentAttackRange = {}
    this.currentMoveRange = {}
  }
}
