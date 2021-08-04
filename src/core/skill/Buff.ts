import {
  Effect, EffectContainer,
  DamageEffect, BackEffect, BoomEffect
} from "./Effect";
import {Target, TargetEventType} from './Target'


export abstract class Buff implements EffectContainer {
  name: string
  duration: number = Infinity

  // 获取功能列表
  abstract getEffects(): Effect[]

  // 添加时
  abstract install(target: Target): void

  protected constructor(name: string) {
    this.name = name
  }

  // 生效时
  work(target: Target) {
    const effectList = this.getEffects()
    for (const effect of effectList) {
      effect.cast(target);
    }

    this.duration--
    if (this.duration < 0) {
      target.removeBuff(this)
    }
  }
}

// 实际的buff逻辑，跟技能类似，在effect的基础上添加了一些流程逻辑
export class PoisoningDamageBuff extends Buff {
  damage: number

  constructor([damage, duration]) {
    super('中毒')
    this.damage = damage
    this.duration = duration
  }

  install(target: Target) {
    target.on(TargetEventType.onUpdate, () => {
      this.work(target)
    })
  }

  getEffects(): Effect[] {
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

  install(target: Target) {
    target.on(TargetEventType.onDie, () => {
      this.work(target)
    })
  }

  getEffects(): Effect[] {
    return [
      new BoomEffect([this.range, this.damage])
    ]
  }
}

export class BackBuff extends Buff {
  constructor() {
    super('攻击后退');
  }

  install(target: Target) {
    target.on(TargetEventType.onAttack, (enemy: Target) => {
      // 构建动态effect
      const effect = new BackEffect([enemy.x, enemy.y])
      effect.cast(target)
    })
  }

  getEffects(): Effect[] {
    return []
  }
}

const buffMap = {
  PoisoningDamageBuff,
  DieBoomBuff,
  BackBuff
}

// 解析类似于'PoisoningDamageBuff,10,3'的字符串，用于构建buff实例
export function initBuffWithString(str) {
  const [key, ...args] = str.split(',')
  const Construct = buffMap[key]
  return new Construct(args)
}
