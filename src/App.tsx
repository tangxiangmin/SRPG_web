import {Component} from 'react'
import {Chessboard, Chess, AIChess, ChessboardEvent, getCellKey} from "./chess";
import classNames from "classnames";

import './app.scss'

function sleep(ms = 100) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

const ChessboardView = ({grid, cellMap, onCellClick, onChessClick, onMoveRangeCellClick, onAttackRangeCellClick}) => {
  const list = grid.map((row, x) => {
    return (<div className="row" key={x}>
      {
        row.map((cell, y) => {
          const key = getCellKey(x, y)
          const config = cellMap[key] || {}
          const {cls: configCls, chess} = config
          const cls = {
            cell: true,
          }

          if (configCls) {
            cls[configCls] = true
          }

          const onClick = () => {
            return onCellClick(x, y, configCls)
          }

          let chessNode = null
          if (chess) {
            const {group, isDisabled, isMoved} = chess
            const cls = classNames({
              chess: true,
              ['chess-group-' + group]: true,
              'chess-disabled': isDisabled,
              'chess-moved': isMoved,
            })
            chessNode = <span className={cls} onClick={(e) => {
              onChessClick(x, y)
              e.stopPropagation()
            }}>{chess.name} <br/>{chess.hp}</span>
          }

          const moveRangeNode = configCls && configCls.indexOf('move-range') > -1
            ? <span className="move-tip" onClick={(e) => {
              onMoveRangeCellClick(x, y)
              e.stopPropagation()
            }}/>
            : null

          const attackRangeNode = configCls && configCls.indexOf('attack-range') > -1
            ? <span className="attack-tip" onClick={(e) => {
              onAttackRangeCellClick(x, y)
              e.stopPropagation()
            }}/>
            : null

          return <div className={classNames(cls)} onClick={onClick} key={y}>
            <span>({x},{y})</span>
            {chessNode}
            {moveRangeNode}
            {attackRangeNode}

          </div>
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

    const chess1 = new Chess("亚瑟", 100, 20, 10)
    const chess4 = new Chess("长枪兵", 50, 10, 6)
    const chess2 = new AIChess("步兵", 100, 5, 3)
    const chess3 = new AIChess("侦察兵", 30, 3, 4)

    chessboard.addChess(chess1, 0, 2, 1)
    chessboard.addChess(chess4, 1, 2, 1)
    chessboard.addChess(chess2, 7, 6, 2)
    chessboard.addChess(chess3, 9, 9, 2)

    this.chessboard = chessboard

    this.chessboard.bus.on(ChessboardEvent.onToggleGroup, () => {
      if (chessboard.currentGroup === 2) {
        this.onAIRound()
      }
    })

    // const path = this.chessboard.finPath(0, 2, 5, 2)
    // console.log(path)
    //
    // const path2 = this.chessboard.findTargetAround(5, 2)
    // console.log(path2)


    this.renderMap()
  }

  // 电脑回合
  onAIRound = async () => {
    const chessboard = this.chessboard
    const aiChessList = chessboard.getChessListByGroup(2) as AIChess[]

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
      const {x, y} = chess
      const key = getCellKey(x, y)

      cellMap[key] = {
        ...cellMap[key],
        cls: '',
        chess: chess
      }
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


  showMoveRange = async () => {
    const chess = this.currentChess
    let range = chess.calcChessMoveRange()
    this.batchMarkCell(range, 'move-range')
  }

  showActionRange = () => {
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

  moveCurrentChess = async (x, y) => {
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

  doChessAction = () => {
    this.currentChess.doAction()
    this.renderMap()
    this.forceUpdate()
  }

  finishRound = () => {
    this.chessboard.toggleGroup()
    this.renderMap()
  }

  onCellClick = (x, y) => {
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

  onChessClick = (x, y) => {
    const chess = this.chessboard.getChessByPos(x, y)
    if (chess.group !== 1) return

    console.log(chess.name)
    this.currentChess = chess
    if (!chess.isMoved) {
      this.showMoveRange()
    } else if (!chess.isActioned) {
      this.showActionRange()
    } else {
      console.log('当前回合完毕')
    }
  }

  onMoveRangeCellClick = (x, y) => {
    this.moveCurrentChess(x, y)
  }

  onAttackRangeCellClick = (x, y) => {
    if (this.currentChess.isActioned) return
    const target = this.chessboard.getChessByPos(x, y)
    if (target) {
      this.currentChess.attack(target)
    }
    this.forceUpdate()
  }

  render() {
    const {chessboard} = this
    const {grid, cellMap} = this.state
    return (<div>
      <h1>回合{chessboard?.roundCount}，当前轮到{chessboard?.currentGroup}组</h1>
      <button onClick={this.finishRound}>结束回合</button>
      {/*<button onClick={this.showMovePath}>show move path</button>*/}
      <ChessboardView grid={grid}
                      cellMap={cellMap}
                      onCellClick={this.onCellClick}
                      onChessClick={this.onChessClick}
                      onMoveRangeCellClick={this.onMoveRangeCellClick}
                      onAttackRangeCellClick={this.onAttackRangeCellClick}
      />
    </div>)
  }
}


export default App
