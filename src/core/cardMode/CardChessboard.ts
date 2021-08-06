import {Player} from "./Player";
import {Card, CardEventEnum} from "./Card";

export class CardChessboard {
  currentPlayer: Player
  playerList: Player[] = []

  row: number
  col: number

  cardList: Card[] = []

  putRange: number[]

  constructor() {
    this.row = 5
    this.col = 4

  }

  addPlayer(player) {
    if (!this.playerList.includes(player)) {
      this.playerList.push(player)
    }
  }

  putCard(x, y) {
    const card = this.currentPlayer.currentCard
    if (!card) return

    // 不再对应范围内
    if (this.putRange[0] > x || this.putRange[1] < x) {
      return
    }

    this.currentPlayer.putCard(card)

    card.chessboard = this

    card.x = x
    card.y = y


    this.cardList.push(card)

    card.on(CardEventEnum.onDie, () => {
      this.getCurrentPlayerPutRange()
    })

    card.on(CardEventEnum.onMove, () => {
      this.getCurrentPlayerPutRange()
    })

    card.moveFirst()

    this.getCurrentPlayerPutRange()
  }

  removeCard(card) {
    this.cardList = this.cardList.filter(c => c !== card)
  }


  toggleRound() {
    let idx = this.playerList.indexOf(this.currentPlayer)
    let nextIdx = idx + 1 >= this.playerList.length ? 0 : idx + 1

    this.currentPlayer = this.playerList[nextIdx]

    this.currentPlayer.onRoundStart()

    const list = this.getPlayerChessList(this.currentPlayer)
    for (const card of list) {
      card.moveForward()
    }

    this.getCurrentPlayerPutRange()

    // todo 临时测试
    if (this.currentPlayer.name === 'p2') {
      this.autoPlay()
    }
  }

  getCardByPos(x: number, y: number) {
    return this.cardList.find(chess => chess.x === x && chess.y === y)
  }

  findPlayerEnemy(player) {
    return this.playerList.find(p => p !== player)
  }

  getCurrentPlayerPutRange() {
    this.putRange = this.getPlayerPutRange(this.currentPlayer)
  }

  // 找到指定坐标周围的棋子
  findAroundCard(x, y): Card[] {
    const list = this.findAroundPos(x, y)
    let ans: Card[] = []
    list.forEach(({x, y}) => {
      let card = this.getCardByPos(x, y)
      if (card) {
        ans.push(card)
      }
    })

    return ans
  }

  private findAroundPos(x, y): { x: number, y: number }[] {
    const {row, col} = this

    let ans = []
    const insert = (x, y) => {
      if (x < 0 || x >= row || y < 0 || y >= col) return
      ans.push({x, y})
    }

    // 找到周围的单元格
    insert(x - 1, y)
    insert(x + 1, y)
    insert(x, y - 1)
    insert(x, y + 1)
    insert(x - 1, y - 1)
    insert(x + 1, y - 1)
    insert(x - 1, y + 1)
    insert(x + 1, y + 1)

    return ans
  }

  // 获取可移动距离
  private getPlayerPutRange(player) {
    const list = this.getPlayerChessList(player)
    const arr = list.map(card => card.x)
    if (player.dir > 0) {
      // 不能建在对方门口
      const max = Math.min(Math.max(0, ...arr), this.row - 2)
      return [0, max]
    } else {
      const min = Math.max(1, Math.min(...arr, this.row - 1))
      return [min, this.row - 1]
    }
  }

  // todo 这里需要设计比较灵活的AI https://www.xqbase.com/index.htm
  private autoPlay() {
    this.currentPlayer.selectCard(this.currentPlayer.cardList[0])
    // 随便放个位置
    this.putCard(0, 0)
    this.toggleRound()
  }

  private getPlayerChessList(player) {
    return this.cardList.filter(card => card.player === player)
  }
}

