import {BoomSkill, Skill} from "./Skill";
import {Buff} from "./Buff";
import EventBus from "../EventBus";


type rawConfig = {
  hp: number
  mp: number
  atk: number,
  speed: number,
  strikeBackNum: number,
  frame: string
}

export enum TargetEventType {
  onAttack,
  onDie
}

export abstract class Target extends EventBus {
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

  // 技能列表
  skillList: Skill[]

  constructor(props) {
    super()
    const {hp, mp, frame, atk, speed, strikeBackNum = 1, buffList = [], skillList = []} = props

    this.hp = hp
    this.mp = mp
    this.frame = frame
    this.atk = atk
    this.speed = speed

    this.buffList = []
    this.skillList = skillList // 技能列表

    this.strikeBackNum = strikeBackNum

    this.config = {
      hp, mp, frame, atk, speed, strikeBackNum
    }

    // 配置一些被动
    this.initPassivityBuff(buffList)
  }

  private initPassivityBuff(buffList) {
    buffList.forEach(Buff => {
      const buff = new Buff()
      buff.work(this)
      // todo 被动技能持续有效或者几回合后失效
      // this.addBuff(buff, Infinity)
    })
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

    this.emit(TargetEventType.onAttack, target)

    this.underAttack(target.atk)

    // 存活才可以反击
    if (this.hp > 0) {
      this.strikeBackTarget = target
      this.strikeBack()
    }
  }

  underAttack(damage: number) {
    this.hp -= damage
    if (this.hp <= 0) {
      this.onDie()
    }
  }

  // 死亡时
  onDie() {
    // 触发一些被动技能之类的，比如爆炸
    this.emit(TargetEventType.onDie)
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
