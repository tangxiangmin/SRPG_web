import {Card, CardEventEnum, CardFactory} from './Card'

export class Player {
  name: string
  // 方向
  dir: number

  // 生命值
  hp: number = 10
  // 最大卡片数量
  maxCardNum: number = 4

  // 最大能量值
  maxEnergy: number = 3

  // 当前能量
  energy: number = 3

  cardList: Card[] = []

  cardFactory: CardFactory

  currentCard: Card

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
      const cards = this.cardFactory.drawCards(num)
      this.cardList = [...this.cardList, ...cards]
    }
  }

  // 选择卡片
  selectCard(card) {
    this.currentCard = card
  }

  // 打出一张牌
  putCard(card: Card) {
    card.player = this
    this.energy -= card.costEnergy
    this.currentCard = null
    this.cardList = this.cardList.filter(c => c !== card)

    card.emit(CardEventEnum.onPut)
  }
}
