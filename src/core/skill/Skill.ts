import {Effect, EffectContainer, initEffectWithName} from "./Effect";
import {Target} from './Target'

import {skillMap} from '../config/skill'

export class Skill implements EffectContainer {
  key:string
  name: string
  desc: string
  effectList: Effect[]

  constructor(key: string) {
    this.key = key
    this.effectList = this.getEffects()
  }


  getEffects() {
    const config = skillMap[this.key]
    if (!config) return []
    const {effects, desc,name} = config
    this.desc = desc
    this.name = name

    return effects.map(c => {
      const {name, args} = c
      return initEffectWithName(name, args)
    })
  }

  spellTo(target: Target) {
    const effectList = this.effectList
    for (const effect of effectList) {
      effect.cast(target);
    }
  }
}
