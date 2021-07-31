import {Skill, NormalAttackSkill} from "./Skill";

export class Target {
  hp: number
  mp: number
  atk: number

  speed: number
  frame: string

  // 状态列表
  buffList: ({ buff: Skill, time: number })[]

  constructor(props) {
    const {hp, mp, frame, atk, speed} = props

    this.hp = hp
    this.mp = mp
    this.frame = frame
    this.atk = atk
    this.speed = speed

    this.buffList = []
  }

  addBuff(buff: Skill, time) {
    this.buffList.push({buff, time})
  }

  // 更新时
  onUpdate() {
    let list = []
    this.buffList.forEach(({buff, time}) => {
      buff.spellTo(this)
      time--
      // 清空已过期的buff
      if (time > 0) {
        list.push({buff, time})
      }
    })

    this.buffList = list
  }

  // 普攻
  attack(target: Target) {
    const {atk} = this
    const skill = new NormalAttackSkill(atk)
    skill.spellTo(target)
  }

  // 使用技能
  useSkill(skill: Skill, target: Target) {
    skill.spellTo(target)
  }
}
