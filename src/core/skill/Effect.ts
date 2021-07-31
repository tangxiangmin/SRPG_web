import {Target} from "./Target";
import {Skill} from "./Skill";

// 效果接口
export interface Effect {
  cast(target: Target): void

  reverse(): void
}

// 装备、buff 等都可以当做是 effect容器
export interface EffectContainer {
  getEffects(): Effect[]
}

// todo 下面是需要实现的各种效果， 通过在skill中组装实现技能和buff等功能

export class DamageEffect implements Effect {
  damage: number;

  constructor(args) {
    this.damage = args[0]
  }

  cast(target: Target) {
    target.hp -= this.damage
  }

  reverse() {
  }
}

class ChangeSheepEffect implements Effect {
  frame: string
  atk: number
  speed: number

  constructor(args) {
    this.frame = args[0]
    this.atk = args[1]
    this.speed = args[2]
  }

  cast(target: Target) {
    target.frame = this.frame
    target.atk = this.atk
    target.speed = this.speed
  }

  reverse() {
  }
}

class RecoverEffect implements Effect {
  hp: number

  constructor(args) {
    this.hp = args[0]
  }

  cast(target: Target) {
    target.hp += this.hp
  }

  reverse() {
  }
}

// 持续影响的效果
class PoisoningEffect implements Effect {
  duration: number
  damage: number

  constructor(args) {
    this.duration = args[0]
    this.damage = args[1]
  }

  cast(target: Target) {

    const {damage, duration} = this

    class PoisoningDamageSkill extends Skill {
      get name() {
        return "中毒";
      }

      getEffects(): Effect[] {
        return [
          new DamageEffect([damage])
        ]
      }
    }

    const buff = new PoisoningDamageSkill()
    target.addBuff(buff, duration)
  }

  reverse() {
  }
}

const effectMap = {
  DamageEffect,
  ChangeSheepEffect,
  RecoverEffect,
  PoisoningEffect
}

// 根据配置名字和构造参数生成effect实例
export function initEffectWithName(name: string, args: any[]): Effect {
  const Construct = effectMap[name]
  return new Construct(args)
}
