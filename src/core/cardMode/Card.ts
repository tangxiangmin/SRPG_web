import {sleep} from "../../util";
import {CardChessboard} from './CardChessboard'
import {Player} from './Player'
import {EffectTarget} from "../common/Effect";
import {CardSkill} from "./Skill";
import {initBuffWithString} from "../common/Buff";

import {buffMap} from './Buff'

export enum CardEventEnum {
  onMove,
  onPut,
  onDie
}

export class Card extends EffectTarget {
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
    super(props)
    const {name, costEnergy, firstStep, moveStep, hp} = props

    this.hp = hp
    this.name = name
    this.costEnergy = costEnergy
    this.firstStep = firstStep
    this.moveStep = moveStep

    this.on(CardEventEnum.onPut, () => {
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
    buffList.forEach(str => {
      const buff = initBuffWithString(str, buffMap)
      this.addBuff(buff)
    })
  }

  // 是否能够继续
  checkMove(nextPos) {
    const target = this.chessboard.getCardByPos(nextPos.x, nextPos.y)
    if (target && target.player !== this.player) {
      this.attackCard(target)
      return true
    }

    // 到达敌人目标地址，攻击player
    if (
      (this.player.dir === 1 && nextPos.x >= this.chessboard.row) ||
      (this.player.dir === -1 && nextPos.x < 0)
    ) {

      this.attackPlayer(this.hp)
      this.onDie()
      return false
    }

    return !target
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


  attackPlayer(damage) {
    const enemy = this.chessboard.findPlayerEnemy(this.player)
    enemy.hp -= damage
  }

  onAttack(target:Card){

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

}

// 配置的一些卡片
// todo 这里写个脚本来随机生成一些有趣的卡片
const map = {
  1: {
    name: '新兵',
    costEnergy: 1,
    firstStep: 1,
    moveStep: 1,
    hp: 1
  },
  2: {
    name: '传令兵',
    costEnergy: 2,
    firstStep: 2,
    moveStep: 1,
    hp: 2
  },
  3: {
    name: '斥候',
    costEnergy: 1,
    firstStep: 3,
    moveStep: 1,
    hp: 1,
    buffList: ['DieBoomBuff,2,1'] // 死亡时对敌方旗手造成1点伤害
  },
  4: {
    name: '老兵',
    costEnergy: 3,
    firstStep: 1,
    moveStep: 1,
    hp: 5
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

