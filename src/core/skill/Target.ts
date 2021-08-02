import {Skill} from "./Skill";
import {Buff} from "./Buff";


type rawConfig = {
  hp: number
  mp: number
  atk: number,
  speed: number,
  strikeBackNum: number,
  frame: string
}

export abstract class Target {
  config: rawConfig

  x: number
  y: number

  hp: number
  mp: number
  atk: number

  speed: number
  frame: string

  // 反击
  strikeBackNum: number // 可反击次数
  strikeBackTarget: Target

  // 拥有的buff列表
  buffList: ({ buff: Buff, time: number })[]

  constructor(props) {
    const {hp, mp, frame, atk, speed, strikeBackNum = 1} = props

    this.hp = hp
    this.mp = mp
    this.frame = frame
    this.atk = atk
    this.speed = speed

    this.buffList = []
    this.strikeBackNum = strikeBackNum

    this.config = {
      hp, mp, frame, atk, speed, strikeBackNum
    }

    // todo 配置一些被动
  }

  // 更新时
  onUpdate() {
    let list = []
    this.buffList.forEach(({buff, time}) => {
      buff.work(this)
      time--
      // 清空已过期的buff
      if (time > 0) {
        list.push({buff, time})
      }
    })

    this.buffList = list
    this.strikeBackNum = this.config.strikeBackNum
  }

  // // 被攻击时
  onAttack(target: Target) {
    this.hp -= target.atk
    this.strikeBackTarget = target

    this.strikeBack()

    if (this.hp <= 0) {
      this.onDie()
    }
  }

  // 死亡时
  onDie() {
    // 触发一些被动技能之类的，比如爆炸
  }

  // 添加buff
  addBuff(buff: Buff, time) {
    this.buffList.push({buff, time})
  }

  // 普攻
  attack(target: Target) {
    // todo 额外的攻击计算
    target.onAttack(this)
  }

  // 使用技能
  useSkill(skill: Skill, target: Target) {
    skill.spellTo(target)
  }

  // todo 抽象方法，由子类实现
  abstract checkStrikeBackTarget(target: Target): boolean

  // 反击
  strikeBack() {
    const {strikeBackTarget} = this
    const canStrikeBack = this.strikeBackNum > 0
      && strikeBackTarget
      && this.checkStrikeBackTarget(strikeBackTarget)

    if (canStrikeBack) {
      strikeBackTarget.hp -= this.atk
      this.strikeBackNum -= 1
    }
  }
}

export class DemoTarget extends Target {
  checkStrikeBackTarget(target: Target) {
    return true
  }
}
