import {Card, CardFactory} from './Card'
import {CardChessboard} from "./CardChessboard";

export class Player {
  name: string
  dir: number // 方向
  hp: number = 10 // 生命值

  maxCardNum: number = 4 // 最大卡片数量
  maxEnergy: number = 2 // 最大能量值

  // 当前能量
  energy: number = 2

  cardList: Card[] = []

  cardFactory: CardFactory // 负责实现随机抽卡算法

  currentCard: Card

  chessboard: CardChessboard

  constructor({name, cardGroup, dir}) {
    this.name = name
    this.dir = dir

    this.cardFactory = new CardFactory(cardGroup)
    this.drawCard()
  }


  onRoundStart() {
    this.maxEnergy += 1
    this.energy = this.maxEnergy
    this.drawCard()
  }

  // 随机补满手牌
  drawCard() {
    const num = this.maxCardNum - this.cardList.length

    if (num > 0) {
      const expect = this.cardList.map(card => card.id)
      const cards = this.cardFactory.drawCards(num, expect)
      this.cardList = [...this.cardList, ...cards]
    }
  }

  // 选择卡片
  selectCard(card) {
    if (card.costEnergy > this.energy) {
      return
    }
    this.currentCard = card
  }

  // 打出一张牌
  putCard(card: Card) {
    this.energy -= card.costEnergy
    card.player = this
    this.currentCard = null
    this.cardList = this.cardList.filter(c => c !== card)
  }
}

// todo 这里需要设计比较灵活的AI https://www.xqbase.com/index.htm
export class AIPlayer extends Player {
  calcCurrentPos(card: Card) {
    const {chessboard} = this
    const {putRange, col} = chessboard

    const [x0, x1] = putRange
    const list = []
    for (let x = x0; x <= x1; ++x) {
      for (let y = 0; y < col; ++y) {
        // 计算每个单元格和卡片的权重
        const target = chessboard.getCardByPos(x, y)
        if (!target) {
          list.push({x, y})
        }
      }
    }

    // 返回第一个位置
    return this.dir > 0 ? list[0] : list[list.length - 1]
  }

  calcCurrentCard() {
    const list = this.cardList.filter(card => card.costEnergy <= this.energy)
    return list[0]
  }

  async autoPlay() {
    const {chessboard} = this
    // 选出一张合适的牌
    let card = this.calcCurrentCard()
    while (card) {
      // 选择一个合适的位置
      const cell = this.calcCurrentPos(card)
      if (!cell) break

      // 打牌
      this.selectCard(card)
      await chessboard.putCard(cell.x, cell.y)

      // 重新选择直至无法出牌
      card = this.calcCurrentCard()
    }

    // 随便放个位置
    await chessboard.toggleRound()
  }
}
