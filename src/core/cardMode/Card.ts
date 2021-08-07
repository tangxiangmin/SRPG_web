import {sleep} from "../../util";
import {CardChessboard} from './CardChessboard'
import {Player} from './Player'
import {EffectTarget} from "../common/Effect";
import {CardSkill} from "./Skill";

import {CardBuff} from './Buff'

import {getCardConfigByKey} from './cardList'
import {getTransitionRawChildren} from "vue";


export enum CardEventEnum {
  moveEnd,
  afterPut,
  onDie,
  beforeAttack,
  afterAttack,
  onUpdate
}

enum CardType {
  unit, // 单元
  skill, // 技能
  construct // 建筑
}

export class Card extends EffectTarget {
  id: number
  player: Player
  chessboard: CardChessboard
  cardType: CardType

  target: Card // 敌方

  name: string
  costEnergy: number
  firstStep: number
  moveStep: number
  hp: number
  x: number
  y: number

  constructor(props) {
    super(props)
    const {id, name, costEnergy, firstStep, moveStep, hp} = props

    this.id = id
    this.hp = hp
    this.name = name
    this.costEnergy = costEnergy
    this.firstStep = firstStep
    this.moveStep = moveStep

    this.on(CardEventEnum.afterPut, () => {
      // todo 一些特殊技能
      console.log(`${this.player.name} ${this.name}打出`)
    })
  }

  initSkillList(skillList: string[]) {
    this.skillList = skillList.map(key => {
      return new CardSkill(key)
    })
  }

  initPassivityBuff(buffList) {
    buffList.forEach(config => {
      const buff = new CardBuff(config)
      this.addBuff(buff)
    })
  }

  // 是否能够继续
  moveTo(nextPos) {
    const target = this.chessboard.getCardByPos(nextPos.x, nextPos.y)

    const moveEnd = () => {
      this.x = nextPos.x
      this.y = nextPos.y

      this.emit(CardEventEnum.moveEnd)
    }

    if (!target) {
      // 对应位置可以直接占据
      moveEnd()
    } else if (target && target.player !== this.player) {
      // 对应位置是敌方棋子
      this.attackCard(target)
      moveEnd()
    } else if (
      (this.player.dir === 1 && nextPos.x >= this.chessboard.row) ||
      (this.player.dir === -1 && nextPos.x < 0)
    ) {
      // 到达敌人目标地址，攻击player
      this.attackPlayer(this.hp)
      this.onDie()
      return false
    }
  }

  private getMoveForwardPos() {
    let unit = this.player.dir
    return {
      x: this.x + unit,
      y: this.y
    }
  }

  // 像前移动
  async moveForward(num) {
    const val = Math.abs(num)
    for (let i = 0; i < val; ++i) {
      const next = this.getMoveForwardPos()

      this.moveTo(next)
      await sleep(400)
    }
  }

  findAroundPosExpectBehind() {
    const list = this.chessboard.findAroundPos(this.x, this.y, false)
    return list.filter((cell) => {
      if (this.player.dir > 0) {
        return cell.x >= this.x
      } else {
        return cell.x <= this.x
      }
    })
  }

  async moveFirst() {
    const findAttackTarget = () => {
      const postList = this.findAroundPosExpectBehind()
      for (const cell of postList) {
        const {x, y} = cell
        const target = this.chessboard.getCardByPos(x, y)
        if (target && target.player !== this.player)
          return target
      }
    }

    await sleep(400)

    for (let i = 0; i < this.firstStep; ++i) {
      const target = findAttackTarget()
      let next
      if (!target) {
        await this.moveForward(1)
      } else {
        // 移动到对应目标位置，然后执行攻击
        await this.moveTo({x: target.x, y: target.y})
        await sleep(400)
      }
    }
  }

  attackPlayer(damage) {
    const enemy = this.chessboard.findPlayerEnemy(this.player)
    enemy.hp -= damage
  }

  attackCard(target: Card) {
    this.target = target
    this.emit(CardEventEnum.beforeAttack)

    const atk1 = Math.max(this.hp, 0)
    const atk2 = Math.max(target.hp, 0)

    target.underAttack(atk1)
    this.underAttack(atk2)
  }

  underAttack(damage) {
    this.hp -= damage
    if (this.hp <= 0) {
      this.onDie()
    } else {
      this.emit(CardEventEnum.afterAttack)
    }
  }

  onDie() {
    this.chessboard.removeCard(this)

    console.log(`${this.player.name} ${this.name}死亡`)

    this.emit(CardEventEnum.onDie)
  }

  underRecover(num) {
    console.log(`${this.name} 受到治疗`)
    this.hp += num
  }
}

// 配置的一些卡片
function createCardById(id: number): Card {
  const config = getCardConfigByKey(id)
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
  drawCards(times: number, except: number[]) {
    const exceptList = [...except]
    const ans = []

    const drawCard = (except) => {
      const list = this.cardGroup
      // .filter(id => !except.includes(id))

      const randomIdx = Math.floor(Math.random() * list.length)
      const cardId = list[randomIdx]
      let card = createCardById(cardId)
      // 保存记录
      this.drawRecord.push(card)
      return card
    }
    for (let i = 0; i < times; ++i) {
      const card = drawCard(except)
      exceptList.push(card.id)

      ans.push(card)
    }
    return ans
  }
}

