import {AIPlayer, Player} from "./Player";
import {Card, CardEventEnum} from "./Card";
import {getTransitionRawChildren} from "vue";

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
      player.chessboard = this
    }
  }

  async putCard(x, y) {
    const card = this.currentPlayer.currentCard
    if (!card) return

    // 不再对应范围内
    if (this.putRange[0] > x || this.putRange[1] < x) {
      return
    }


    card.chessboard = this

    card.x = x
    card.y = y

    this.currentPlayer.putCard(card)

    this.cardList.push(card)

    card.on(CardEventEnum.onDie, () => {
      this.getCurrentPlayerPutRange()
    })

    card.on(CardEventEnum.moveEnd, () => {
      this.getCurrentPlayerPutRange()
    })

    card.emit(CardEventEnum.afterPut)

    await card.moveFirst()


    this.getCurrentPlayerPutRange()
  }

  removeCard(card) {
    this.cardList = this.cardList.filter(c => c !== card)
  }


  async toggleRound() {
    let idx = this.playerList.indexOf(this.currentPlayer)
    let nextIdx = idx + 1 >= this.playerList.length ? 0 : idx + 1

    this.currentPlayer = this.playerList[nextIdx]

    this.currentPlayer.onRoundStart()

    const list = this.getPlayerChessList(this.currentPlayer)
    for (const card of list) {
      card.moveForward(card.moveStep)
    }

    this.getCurrentPlayerPutRange()

    // 自动托管
    if (this.currentPlayer instanceof AIPlayer) {
      await this.currentPlayer.autoPlay()
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
  findAroundCard(x, y, diagonal ): Card[] {
    const list = this.findAroundPos(x, y, diagonal)
    let ans: Card[] = []
    list.forEach(({x, y}) => {
      let card = this.getCardByPos(x, y)
      if (card) {
        ans.push(card)
      }
    })

    return ans
  }

  // 找到周围的坐标
  findAroundPos(x: number, y: number, diagonal: boolean): { x: number, y: number }[] {
    const {row, col} = this

    let ans = []
    const insert = (x, y) => {
      if (x < 0 || x >= row || y < 0 || y >= col) return
      ans.push({x, y})
    }

    // 找到周围的单元格
    // IMPORTANT 注意此处顺序，先是上面，再是左边，然后是右边，最后是后面，部分逻辑如攻击选择目标依赖该顺序
    insert(x - 1, y)
    diagonal && insert(x - 1, y - 1)
    diagonal && insert(x - 1, y + 1)
    insert(x, y - 1)
    insert(x, y + 1)
    insert(x + 1, y)
    diagonal && insert(x + 1, y - 1)
    diagonal && insert(x + 1, y + 1)

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

  private getPlayerChessList(player) {
    return this.cardList.filter(card => card.player === player)
  }
}

