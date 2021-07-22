import {Component} from 'react'
import {Chessboard, Chess, AIChess, ChessboardEvent} from "./chess";
import classNames from "classnames";

import './app.scss'

function getCellKey(x, y) {
  return `x${x}y${y}`
}

function sleep(ms = 100) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

const ChessboardView = ({grid, cellMap, onCellClick}) => {
  const list = grid.map((row, x) => {
    return (<div className="row" key={x}>
      {
        row.map((cell, y) => {
          const key = getCellKey(x, y)
          const config = cellMap[key] || {}
          const configCls = config.cls
          const cls = {
            cell: true,
          }
          if (configCls) {
            cls[configCls] = true
          }
          const onClick = () => {
            return onCellClick(x, y, configCls)
          }
          return <div className={classNames(cls)} onClick={onClick} key={y}>({x},{y})</div>
        })
      }
    </div>)
  })
  return <div>
    {list}
  </div>
}

class App extends Component<any, any> {

  state = {
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
    cellMap: {},
  }
  chessboard: Chessboard
  currentChess: Chess

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.init()
  }

  init = () => {
    const {grid} = this.state


    const chessboard = new Chessboard(grid)

    const chess1 = new Chess("我方1", 100, 5, 2)
    const chess2 = new AIChess("敌方1", 100, 5, 3)
    const chess3 = new AIChess("敌方2", 30, 3, 4)

    chessboard.addChess(chess1, 0, 2, 1)
    chessboard.addChess(chess2, 7, 6, 2)
    chessboard.addChess(chess3, 9, 9, 2)

    this.chessboard = chessboard

    this.chessboard.bus.on(ChessboardEvent.onToggleGroup, () => {
      if (chessboard.currentGroup === 2) {
        this.onAIRound()
      }
    })

    this.renderMap()
  }

  // 电脑回合
  onAIRound = async () => {
    const chessboard = this.chessboard
    const aiChessList = chessboard.getChessListByGroup(2) as AIChess[]

    for (const chess of aiChessList) {
      await sleep(100)

      this.onChessClick(chess.x, chess.y)

      await sleep(100)

      const {path, canReach} = chess.chooseMoveTarget()

      if (!canReach) {
        await this.moveChessByPath(chess, path)
      } else {
        await this.moveChessByPath(chess, path.slice(0, path.length - 1))
        await chess.doAction()
      }


      // const actionTarget = chess.chooseActionTarget()
      //
      // if (actionTarget) {
      //   console.log('todo 执行动作')
      // } else {
      //   const moveTarget = chess.chooseMoveTarget()
      //   await this.moveCurrentChess(moveTarget.x, moveTarget.y)
      // }
    }

    this.finishRound()
  }

  // 计算棋盘状态，重新绘制
  renderMap = () => {
    const {grid} = this.state
    const cellMap = {}
    const {chessboard} = this

    grid.forEach((row, x) => {
      row.map((cell, y) => {
        const key = getCellKey(x, y)

        cellMap[key] = {} // todo 定义每个cell的类型
        if (cell === 0) {
          cellMap[key].cls = 'wall'
        }
      })
    })

    chessboard.chessList.forEach(chess => {
      const {x, y, group, isDisabled, isMoved} = chess
      const key = getCellKey(x, y)

      cellMap[key].cls = classNames({
        chess: true,
        ['chess-group-' + group]: true,
        'chess-disabled': isDisabled,
        'chess-moved': isMoved,
      })
      cellMap[key].onClick = this.onChessClick
    })

    this.setState({
      cellMap: {...cellMap}
    })
  }

  // markCell = (x, y, cls) => {
  //   const key = getCellKey(x, y)
  //   const {cellMap} = this.state
  //
  //   this.setState({
  //     cellMap: {
  //       ...cellMap,
  //       [key]: {cls}
  //     }
  //   })
  // }

  batchMarkCell = (list, cls) => {
    const {cellMap} = this.state
    list.forEach(({x, y}) => {
      const key = getCellKey(x, y)
      cellMap[key].cls = cls
    })

    this.setState({
      cellMap: {
        ...cellMap,
      }
    })
  }
  // clearCell = (x, y) => {
  //   this.markCell(x, y, 'none')
  // }

  onChessClick = (x, y) => {
    const {chessList} = this.chessboard
    for (const chess of chessList) {
      if (x === chess.x && y === chess.y) {
        this.currentChess = chess
        if (!chess.isDisabled) {
          this.showMoveRange()
        } else {
          console.log('已经移动')
        }
        return
      }
    }
  }

  showMoveRange = async () => {
    const {cellMap} = this.state
    const chess = this.currentChess
    let range = chess.calcChessMoveRange()
    const list = range.filter((({x, y}) => x !== chess.x || y !== chess.y))

    list.forEach(({x, y}) => {
      const key = getCellKey(x, y)
      cellMap[key].onClick = this.moveCurrentChess
    })

    this.batchMarkCell(list, 'move-range')
  }

  // showMovePath = async (path) => {
  //   for (const node of path) {
  //     const {x, y} = node
  //     await sleep(100)
  //     this.markCell(x, y, 'path')
  //   }
  // }

  moveCurrentChess = async (x, y) => {
    const {x: x0, y: y0} = this.currentChess
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
    const chess = this.currentChess

    this.moveChessByPath(chess, path)
  }
  moveChessByPath = async (chess, path) => {
    for (const node of path) {
      const {x, y} = node
      await sleep(100)
      // this.clearCell(chess.x, chess.y)
      this.chessboard.moveChess(chess, x, y)
      // this.markCell(x, y, 'chess')
      this.renderMap()
    }
  }

  onCellClick = (x, y) => {
    const {cellMap} = this.state
    const key = getCellKey(x, y)
    const {onClick} = cellMap[key]

    if (onClick) {
      onClick(x, y)
    } else {
      console.error(`${key}对应的handler不存在`)
    }
  }

  doChessAction = () => {
    this.currentChess.doAction()
    this.renderMap()
  }

  finishRound = () => {
    this.chessboard.toggleGroup()
    this.renderMap()
  }

  render() {
    const {chessboard} = this
    const {grid, cellMap} = this.state
    return (<div>
      <h1>回合{chessboard?.roundCount}，当前轮到{chessboard?.currentGroup}组</h1>
      <button onClick={this.doChessAction}>执行动作</button>
      <button onClick={this.finishRound}>结束回合</button>
      {/*<button onClick={this.showMovePath}>show move path</button>*/}
      <ChessboardView grid={grid} cellMap={cellMap} onCellClick={this.onCellClick}/>
    </div>)
  }
}


export default App
