import EventBus from "../EventBus";
import {sleep} from "../../util";
import {CardChessboard} from './CardChessboard'
import {Player} from './Player'

export enum CardEventEnum {
  onMove,
  onPut,
  onDie
}

export class Card extends EventBus {
  player: Player
  chessboard: CardChessboard

  name: string
  costEnergy: number
  firstStep: number
  moveStep: number
  hp: number
  x: number
  y: number

  constructor(props) {
    super()
    const {
      name,
      costEnergy,
      firstStep,
      moveStep,
      hp
    } = props

    this.hp = hp
    this.name = name
    this.costEnergy = costEnergy
    this.firstStep = firstStep
    this.moveStep = moveStep

    this.on(CardEventEnum.onPut, () => {
      console.log(`${this.player.name} ${this.name}打出`)
    })
  }

  // 是否能够继续
  checkMove(nextPos) {
    const target = this.chessboard.getCardByPos(nextPos.x, nextPos.y)
    if (target && target.player !== this.player) {
      this.attackCard(target)
      return false
    }

    // 到达敌人目标地址，攻击player
    if (
      (this.player.dir === 1 && nextPos.x >= this.chessboard.row) ||
      (this.player.dir === -1 && nextPos.x < 0)
    ) {

      const enemy =  this.chessboard.findPlayerEnemy(this.player)
      this.attackPlayer(enemy)
      return false
    }

    return !target
  }

  attackPlayer(player: Player) {
    player.hp -= this.hp
    this.onDie()
  }

  attackCard(target: Card) {
    const atk1 = this.hp
    const atk2 = target.hp
    target.hp -= atk1
    this.hp -= atk2

    if (target.hp <= 0) {
      target.onDie()
    }

    if (this.hp <= 0) {
      this.onDie()
    }
  }

  onDie() {
    this.chessboard.removeCard(this)

    console.log(`${this.player.name} ${this.name}死亡`)

    this.emit(CardEventEnum.onDie)
  }

  // 根据分组处理移动方向
  async move(num) {
    const val = Math.abs(num)
    let unit = this.player.dir
    for (let i = 0; i < val; ++i) {
      await sleep(400)
      const next = {
        x: this.x + unit,
        y: this.y
      }
      if (!this.checkMove(next)) {
        return
      }
      this.x = next.x

      this.emit(CardEventEnum.onMove)
    }
  }

  moveFirst() {
    this.move(this.firstStep)
  }

  moveForward() {
    this.move(this.moveStep)
  }
}

// 配置的一些卡片
const map = {
  1: {
    name: 'card1',
    costEnergy: 1,
    firstStep: 1,
    moveStep: 1,
    hp: 1
  },
  2: {
    name: 'card2',
    costEnergy: 2,
    firstStep: 2,
    moveStep: 1,
    hp: 2
  },
  3: {
    name: 'card3',
    costEnergy: 1,
    firstStep: 3,
    moveStep: 1,
    hp: 3
  },
  4: {
    name: 'card4',
    costEnergy: 1,
    firstStep: 3,
    moveStep: 1,
    hp: 3
  }
}
function createCardById(id: number): Card {
  const config = map[id]
  return new Card(config)
}

// 一个抽卡工具类
export class CardFactory {
  cardGroup: number[]
  drawRecord: Card[] = []// 抽牌记录

  constructor(cardGroup: number[]) {
    this.cardGroup = cardGroup // 拥有的牌组
  }

  // 随机生成times张牌
  drawCards(times: number) {
    return this.cardGroup.sort(() => {
      return .5 - Math.random();
    }).slice(0, times).map(cardId => {
      // 根据cardId创建卡片
      let card = createCardById(cardId)
      // 保存记录
      this.drawRecord.push(card)
      return card
    })
  }
}

