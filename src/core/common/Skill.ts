import {Effect, EffectTarget, EffectContainer,} from './Effect'

export abstract class Skill implements EffectContainer {
  key: string
  name: string
  desc: string
  effectList: Effect[]

  constructor(key: string) {
    this.key = key
    this.effectList = this.getEffects()
  }

  // 子类实现
  abstract getSkillMap(): {}

  abstract initEffectWithName(name, args): void

  getEffects() {
    const skillMap = this.getSkillMap()
    const config = skillMap[this.key]
    if (!config) return []
    const {effects, desc, name} = config
    this.desc = desc
    this.name = name

    return effects.map(c => {
      const {name, args} = c
      return this.initEffectWithName(name, args)
    })
  }

  spellTo(target: EffectTarget) {
    const effectList = this.effectList
    for (const effect of effectList) {
      effect.cast(target);
    }
  }
}
