import {Chess} from "./Chess";

export class AIChess extends Chess {
  target: Chess

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
    // 找到敌方的棋子
    const list = this.chessboard.chessList.filter(chess => chess.group === 1)

    // todo 优化此处算法，更智能地确定某个目标
    if (!list.length) {
      return {path: [], canReach: false, onTargetPos: false}
    }

    let path = []
    for (const target of list) {
      const targetAroundList = this.chessboard.findTargetAround(target.x, target.y, this)

      const onTargetAround = targetAroundList.find(({x, y}) => x === this.x && y === this.y)
      if (onTargetAround) {
        return {path: [], canReach: true, onTargetPos: true}
      }

      // 找到最近的目标 对应 最近的路
      const findNearestPath = () => {
        let minPath = []
        for (let cell of targetAroundList) {
          const path = this.chessboard.finPath(this.x, this.y, cell.x, cell.y)
          if (!minPath.length) {
            minPath = path
          } else if (path.length && minPath.length > path.length) {
            minPath = path
          }
        }
        return minPath
      }

      // 找到最近的一个目标位置
      const curPath = findNearestPath()
      if (!path.length || (curPath.length && path.length > curPath.length)) {
        path = curPath
        this.target = target // 设置目标
      }
    }

    if (!path.length) {
      console.log('no path')

      return {path: [], canReach: false, onTargetPos: false}
    }

    return {
      path: path.slice(0, this.moveStep),
      canReach: path.length <= this.moveStep,
      onTargetPos: false
    }
  }

  doAction() {
    this.isActioned = true
    if (this.target) {
      this.attack(this.target)
    }
  }
}

