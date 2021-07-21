import {Component} from 'react'
import {Chessboard, Chess} from "./chess";
import classNames from "classnames";

import './app.css'
import {Simulate} from "react-dom/test-utils";
import ended = Simulate.ended;


// function markCell(x, y, cls = "mark") {
//   const cell = document.querySelector(
//     `.row:nth-of-type(${x + 1}) .cell:nth-of-type(${y + 1})`
//   );
//   if (cell) {
//     cell.classList.add(cls);
//   }
// }


function getCellKey(x, y) {
  return `x${x}y${y}`
}

function sleep(ms = 100) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

// const map = [
//   [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
//   [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
//   [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
//   [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
//   [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
//   [1, 0, 0, 1, 1, 1, 1, 0, 1, 1],
//   [1, 1, 0, 0, 0, 0, 0, 0, 1, 1],
//   [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
//   [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
//   [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
// ];


// const chessboard = new Chessboard(map)
//
// const chess1 = new Chess("1", 100, 5, 1)
// const chess2 = new Chess("2", 100, 5, 3)
//
// chessboard.addChess(chess1, 0, 2)
// chessboard.addChess(chess2, 7, 6)

// async function showMovePath() {
//   const path = chess1.moveTo(chess2.x, chess2.y)
//   for (const node of path) {
//     const {x, y} = node
//     await sleep(100)
//     markCell(x, y, 'path')
//   }
// }


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
          return <div className={classNames(cls)} onClick={onClick} key={y}/>
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
  chess1: Chess
  chess2: Chess
  currentChess: Chess

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.init()
  }

  init = () => {
    const {cellMap, grid} = this.state

    const start = {x: 0, y: 2}
    const target = {x: 7, y: 6}
    grid.forEach((row, x) => {
      row.map((cell, y) => {
        const key = getCellKey(x, y)
        if (cell === 0) {
          cellMap[key] = {cls: 'wall'}
        } else if (x === start.x && y === start.y) {
          cellMap[key] = {cls: 'chess'}
        } else if (x === target.x && y === target.y) {
          cellMap[key] = {cls: 'chess'}
        }
      })
    })

    this.setState({
      cellMap: {...cellMap}
    })

    const chessboard = new Chessboard(grid)

    const chess1 = new Chess("1", 100, 5, 2)
    const chess2 = new Chess("2", 100, 5, 3)

    chessboard.addChess(chess1, start.x, start.y)
    chessboard.addChess(chess2, target.x, target.y)


    this.chessboard = chessboard
    this.chess1 = chess1
    this.chess2 = chess2
  }

  markCell = (x, y, cls) => {
    const key = getCellKey(x, y)
    const {cellMap} = this.state

    this.setState({
      cellMap: {
        ...cellMap,
        [key]: {cls}
      }
    })
  }
  batchMarkCell = (list, cls) => {
    const {cellMap} = this.state
    list.forEach(({x, y}) => {
      const key = getCellKey(x, y)
      cellMap[key] = {cls}
    })

    this.setState({
      cellMap: {
        ...cellMap,
      }
    })
  }
  clearCell = (x, y) => {
    this.markCell(x, y, 'none')
  }

  showMoveRange = async (range) => {
    for (const node of range) {
      const {x, y} = node
      await sleep(10)
      this.markCell(x, y, 'move-range')
    }
  }


  showMovePath = async (path) => {
    for (const node of path) {
      const {x, y} = node
      await sleep(100)
      this.markCell(x, y, 'path')
    }
  }

  showMoveAnimation = async (chess, path) => {
    for (const node of path) {
      const {x, y} = node
      await sleep(100)
      this.clearCell(chess.x, chess.y)
      this.chessboard.moveChess(chess, x, y)
      this.markCell(x, y, 'chess')
    }
  }


  onCellClick = (x, y, type) => {
    const showMoveRange = () => {
      const {chess1, chess2} = this
      const chessList = [chess1, chess2]
      for (const chess of chessList) {
        if (x === chess.x && y === chess.y) {
          this.currentChess = chess
          let range = chess.calcChessMoveRange()
          // this.showMoveRange(range)
          const list = range.filter((({x, y}) => x !== chess.x || y !== chess.y))
          this.batchMarkCell(list, 'move-range')
        }
      }
    }

    const moveTo = async () => {
      const {x: x0, y: y0} = this.currentChess
      const path = this.chessboard.finPath(x0, y0, x, y)
      let range = this.currentChess.calcChessMoveRange()
      // 清除移动范围
      this.batchMarkCell(range, 'none')

      // await sleep(200)

      // 展示移动路径
      // await this.showMovePath(path)
      //
      // await sleep(200)
      // 展示移动动画
      await this.showMoveAnimation(this.currentChess, path)
    }

    const commandMap = {
      'chess': showMoveRange,
      'move-range': moveTo
    }

    const handler = commandMap[type]

    if (handler) {
      handler()
    } else {
      console.error(`${type}对应的handler不存在`)
    }

  }

  render() {
    const {grid, cellMap} = this.state
    return (<div>
      {/*<button onClick={this.showMovePath}>show move path</button>*/}
      <ChessboardView grid={grid} cellMap={cellMap} onCellClick={this.onCellClick}/>
    </div>)
  }
}


export default App
