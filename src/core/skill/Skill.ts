import {Effect, EffectContainer, initEffectWithName, DamageEffect} from "./Effect";
import {Target} from './Target'

import {skillMap} from '../../views/config/skill'

export abstract class Skill implements EffectContainer {
  abstract get name(): string // 从skillMap获取对应的配置项

  getEffects() {
    const config = skillMap[this.name]
    if (!config) return []
    const {effects} = config
    return effects.map(c => {
      const {name, args} = c
      return initEffectWithName(name, args)
    })
  }

  spellTo(target: Target) {
    const effectList = this.getEffects()
    for (const effect of effectList) {
      effect.cast(target);
    }
  }
}

export class ChangeSheepSkill extends Skill {
  get name() {
    return 'ChangeSheepSkill'
  }
}

export class RecoverSkill extends Skill {
  get name() {
    return 'RecoverSkill'
  }
}

export class PoisoningSkill extends Skill {
  get name() {
    return 'PoisoningSkill'
  }
}
export class BoomSkill extends Skill {
  get name() {
    return 'BoomSkill'
  }
}
