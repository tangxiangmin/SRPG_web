import {Player} from "./Player";
import {Card, CardEventEnum} from "./Card";

export class CardChessboard {
  currentPlayer: Player
  playerList: Player[] = []

  row: number
  col: number

  chessList: Card[] = []

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


    this.chessList.push(card)

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
    this.chessList = this.chessList.filter(c => c !== card)
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
    return this.chessList.find(chess => chess.x === x && chess.y === y)
  }

  findPlayerEnemy(player) {
    return this.playerList.find(p => p !== player)
  }

  getCurrentPlayerPutRange() {
    this.putRange =  this.getPlayerPutRange(this.currentPlayer)
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

  // todo 这里需要设计比较灵活的AI
  private autoPlay() {
    this.currentPlayer.selectCard(this.currentPlayer.cardList[0])
    // 随便放个位置
    this.putCard(0, 0)
    this.toggleRound()
  }

  private getPlayerChessList(player) {
    return this.chessList.filter(card => card.player === player)
  }
}

