import {Effect, EffectTarget, EffectContainer,} from './Effect'
import {initEffectWithName} from "../slg/Effect";

export class Skill implements EffectContainer {
  key: string
  name: string
  desc: string
  effectList: Effect[]

  constructor(key: string) {
    this.key = key
    this.effectList = this.getEffects()
  }

  // 子类实现
  getSkillMap() {
    return {}
  }
  initEffectWithName(name, args){}

  getEffects() {
    const skillMap = this.getSkillMap()
    const config = skillMap[this.key]
    if (!config) return []
    const {effects, desc, name} = config
    this.desc = desc
    this.name = name

    return effects.map(c => {
      const {name, args} = c
      return initEffectWithName(name, args)
    })
  }

  spellTo(target: EffectTarget) {
    const effectList = this.effectList
    for (const effect of effectList) {
      effect.cast(target);
    }
  }
}
