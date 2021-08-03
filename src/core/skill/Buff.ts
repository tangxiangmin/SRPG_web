import {
  Effect, EffectContainer,
  DamageEffect, BackEffect, BoomEffect
} from "./Effect";
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

// todo 下面的可以像技能一样走配置

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

export class BoomBuff extends Buff {
  name: "死亡爆炸"

  getEffects(): Effect[] {
    return [
      new BoomEffect([2, 10])
    ]
  }
}

export class BackBuff extends Buff {
  name: "攻击后退"

  getEffects(): Effect[] {
    return [
      new BackEffect()
    ]
  }
}
