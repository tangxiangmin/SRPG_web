import EventBus from "./EventBus";
import {Buff} from "./Buff";
import {Skill} from "./Skill";

// 效果接口
export interface Effect {
  cast(target: EffectTarget): void
}

// 装备、buff 等都可以当做是 effect容器
export interface EffectContainer {
  getEffects(): Effect[]
}

export abstract class EffectTarget extends EventBus {
  // 拥有的buff列表
  buffList: Buff[] = []

  // 技能列表
  skillList: Skill[] = []

  constructor({buffList = [], skillList = []}) {
    super()

    // 配置一些被动buff
    this.initPassivityBuff(buffList)

    // 组装主动技能
    this.initSkillList(skillList)
  }

  // 等待子类实现
  abstract initPassivityBuff(buffList):void
  abstract initSkillList(skillList: string[]): void

  // 添加buff
  addBuff(buff: Buff) {
    buff.install(this)
    this.buffList.push(buff)
  }

  // 移除buff
  removeBuff(buff: Buff) {
    this.buffList = this.buffList.filter(b => b !== buff)
  }

  // 使用技能
  useSkill(skill: Skill, target: EffectTarget) {
    skill.spellTo(target)
  }
}
