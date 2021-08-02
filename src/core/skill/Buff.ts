import {Effect, EffectContainer, DamageEffect} from "./Effect";
import {Target} from './Target'

export abstract class Buff implements EffectContainer {
  name: string

  abstract getEffects(): Effect[]

  work(target: Target) {
    const effectList = this.getEffects()
    for (const effect of effectList) {
      effect.cast(target);
    }
  }
}

export class PoisoningDamageBuff extends Buff {
  damage: number
  name: '中毒'

  constructor(damage) {
    super()
    this.damage = damage
  }

  getEffects(): Effect[] {
    return [
      new DamageEffect([this.damage])
    ]
  }
}
