import {Chess, ChessEventType} from './Chess'

import {
  DamageEffect, BackEffect, BoomEffect
} from "./Effect";

import {Buff} from '../common/Buff'

// 实际的buff逻辑，跟技能类似，在effect的基础上添加了一些流程逻辑
export class PoisoningDamageBuff extends Buff {
  damage: number

  constructor([damage, duration]) {
    super('中毒')
    this.damage = damage
    this.duration = duration
  }

  install(target: Chess) {
    target.on(ChessEventType.onUpdate, () => {
      this.work(target)
    })
  }

  getEffects() {
    return [
      new DamageEffect([this.damage])
    ]
  }
}

export class DieBoomBuff extends Buff {
  damage: number
  range: number

  constructor([damage, range]) {
    super('死亡爆炸');
    this.damage = damage
    this.range = range
  }

  install(target: Chess) {
    target.on(ChessEventType.onDie, () => {
      this.work(target)
    })
  }

  getEffects() {
    return [
      new BoomEffect([this.range, this.damage])
    ]
  }
}

export class BackBuff extends Buff {
  constructor() {
    super('攻击后退');
  }

  install(target: Chess) {
    target.on(ChessEventType.onAttack, (enemy: Chess) => {
      // 构建动态effect
      const effect = new BackEffect([enemy.x, enemy.y])
      effect.cast(target)
    })
  }

  getEffects() {
    return []
  }
}


export const buffMap = {
  PoisoningDamageBuff,
  DieBoomBuff,
  BackBuff
}

